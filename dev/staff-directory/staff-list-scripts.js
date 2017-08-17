/**************************************************************************
                     Global Functions and Variables
**************************************************************************/

var allStaff = [],
    chosenTeam,
    staffListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Staff Directory')/items",
    staffTeamListUrl = "https://mycon.ucdenver.edu/_vti_bin/listdata.svc/StaffDirectoryTeam",
    teams = [];

//Clears out directory container whenever called
function cleanContainer() {
  $('#directory').html('');
}

//Test whether a headshot url is present in the list object
function getHeadshotUrl(x) {
  return x.Headshot ? x.Headshot.Url : null;
}

//Returns image element with staff headshot if available, else returns a silhouette image
function addHeadshot(x) {
  if(x.headshot) {
    return '<img src="' + x.headshot + '" alt="' + x.firstName + ' ' + x.lastName + ' Headshot">';
  } else {
    return '<img src="/PublishingImages/headshots/blank-profile.png" alt="Headshot Silhouette">';
  }
}

//Return element with office number if available, else returns nothing and no office number is added to the card
function getOffice(x) {
  return x.office ? ('<span>Office: Ed2 North, Room ' + x.office + '</span>') : '';
}

//Returns list of duties if available, else returns just the section and header
function getDuties(x) {
  if(x.duties) {
    return '<section class="duties"><h3>Duties</h3>' + x.duties + '</section>';
  } else {
    return '<section class="duties"><h3>Duties</h3></section>';
  }
}

//Returns credentials text if avialable for addition to person's name, else nothing is added to the name
function getCredentials(x) {
  return x.credentials ? (', ' + x.credentials) : ''; 
}



/**************************************************************************
                     Promise Methods
**************************************************************************/

//Reusable ajax that return promises which are used to build the initial staff list on page load (or return errors)
  //Sharepoint List API Call: https://social.msdn.microsoft.com/Forums/office/en-US/d7ed7986-4f2d-4a13-b0e3-e23260988351/sharepoint-2013-rest-api-filter-by-a-choice-field-value?forum=appsforsharepoint
  //Promise Chaining: https://html5hive.org/how-to-chain-javascript-promises/
  //URL filter query suffix = ?$filter=Team eq 'Marketing'
  
//Ajax call to staff directory list
var getDirectoryData = function() {

  //Promise is created to sycnhronize actions when the page initially loads 
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: staffListUrl,
      type: "GET",
      headers: {
        "accept": "application/json;odata=verbose"
      }
    })
    .success(function(data) {
      //Upon success, the list data alpha sorted
      data.d.results.sort(function(a, b) {
        return (a.Last_Name > b.Last_Name) ? 1 : ((b.Last_Name > a.Last_Name) ? -1 : 0);
      });
        
      //Each item is turned into a JSON Object and pushed into the allStaff array
      $.each(data.d.results, function(index, value) {
        allStaff.push(
          {
            firstName: value.First_Name,
            lastName: value.Last_Name,
            fullName: value.First_Name + ' ' + value.Last_Name,
            credentials: value.Credentials,
            jobTitle: value.Job_Title,
            phone: value.Phone,
            email: value.Email,
            office: value.Office_Number,
            team: value.Team,
            duties: value.Job_Duties,
            committees: value.Committee_Membership,
            committeeRole: value.Committee_Role,
            statement: value.Additional_Statement,
            headshot: getHeadshotUrl(value)
          }
        );

      });
      
      //After data is sorted and object created, the promise resolves so the next action can occur
      resolve();
      
    })
   .error(function(err) {
      //If there's an error at this point, the promise is rejected and the following messaging appears
      $('#directoryContainer').remove();
      $('#loadingMessage').html('<h2 class="center">Directory failed to load</h2>');
      console.log('Directory List Call Error: ' + err);
      reject();
    });
    
  });

};

//Ajax call to the list of choices in the 'Team' dropdown within the list
  //For whatever reason, this has to be called separately from Sharepoint as opposed to it being a simple array to begin with 
var getTeamList = function() {

  //Promise created to handle the ajax call
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: staffTeamListUrl,
      type: "GET",
      headers: {
        "accept": "application/json;odata=verbose"
      }
    })
    .success(function (data) {
      //Upon success, the data (an array of strings) is pushed into the teams array
      $.each(data.d.results, function(index, value) {
        teams.push(value.Value);
      });
      teams.sort(); //Teams arrays sorted (default sort is alpha)
      resolve();  //Promise resolved so
    })
    .error(function (err) {
      //If there's an error loading the team list, the following messaging appears and the promise is rejected
      $('#directoryContainer').remove();
      $('#loadingMessage').html('<h2 class="center">Directory failed to load</h2>');
      console.log('Team List Call Error: ' + err);
      reject();
    });
  });
  
};