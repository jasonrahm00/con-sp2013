/**************************************************************************
                     Global Functions and Variables
**************************************************************************/

var allStaff = [],
    chosenTeam,
    staffListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Staff Directory')/items",
    staffTeamListUrl = "https://mycon.ucdenver.edu/_vti_bin/listdata.svc/StaffDirectoryTeam",
    teams = [];

function getHeadshotUrl(x) {
  return x.Headshot ? x.Headshot.Url : null;
}

function cleanContainer() {
  $('#directory').html('');
}

//Adds headshot to staff card if available, else adds silhouette 
function addHeadshot(x) {
  if(x.headshot) {
    return '<img src="' + x.headshot + '" alt="' + x.firstName + ' ' + x.lastName + ' Headshot">';
  } else {
    return '<img src="/PublishingImages/headshots/blank-profile.png" alt="Headshot Silhouette">';
  }
}

function getOffice(x) {
  return x.office ? ('<span>Office: Ed2 North, Room ' + x.office + '</span>') : '';
}

function getDuties(x) {
  if(x.duties) {
    return '<section class="duties"><h3>Duties</h3>' + x.duties + '</section>';
  } else {
    return '<section class="duties"><h3>Duties</h3></section>';
  }
}

function getCredentials(x) {
  return x.credentials ? (', ' + x.credentials) : ''; 
}



/**************************************************************************
                     Promise Methods
**************************************************************************/

//Reusable ajax call that returns promise with table data info
  //Sharepoint List API Call: https://social.msdn.microsoft.com/Forums/office/en-US/d7ed7986-4f2d-4a13-b0e3-e23260988351/sharepoint-2013-rest-api-filter-by-a-choice-field-value?forum=appsforsharepoint
  //Promise Chaining: https://html5hive.org/how-to-chain-javascript-promises/
  //URL filter query suffix = ?$filter=Team eq 'Marketing'
  
var getDirectoryData = function() {

  return new Promise(function(resolve, reject) {
    $.ajax({
      url: staffListUrl,
      type: "GET",
      headers: {
        "accept": "application/json;odata=verbose"
      }
    })
    .success(function(data) {
      data.d.results.sort(function(a, b) {
        return (a.Last_Name > b.Last_Name) ? 1 : ((b.Last_Name > a.Last_Name) ? -1 : 0);
      });

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
      
      resolve();
      
    })
   .error(function(err) {
      $('#loadingMessage').remove();
      $('#directoryContainer').html('<h2 class="center">Data load error</h2>').removeClass('hidden');
      console.log('Directory List Call Error: ' + err);
      reject();
    });
    
  });

};

var getTeamList = function() {

  return new Promise(function(resolve, reject) {
    $.ajax({
      url: staffTeamListUrl,
      type: "GET",
      headers: {
        "accept": "application/json;odata=verbose"
      }
    })
    .success(function (data) {
      $.each(data.d.results, function(index, value) {
        teams.push(value.Value);
      });
      teams.sort();
      resolve();
    })
    .error(function (err) {
      $('#loadingMessage').remove();
      $('#directoryContainer').html('<h2 class="center">Data load error</h2>').removeClass('hidden');
      console.log('Team List Call Error: ' + err);
      reject(err);
    });
  });
  
};