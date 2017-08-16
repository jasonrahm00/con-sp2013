$(document).ready(function() {
  
  /**************************************************************************
                     Global Functions and Variables
  **************************************************************************/
  
  var staffListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Staff Directory')/items",
      staffTeamListUrl = "https://mycon.ucdenver.edu/_vti_bin/listdata.svc/StaffDirectoryTeam";
  
  //Reusable ajax call that returns promise with table data info
    //https://social.msdn.microsoft.com/Forums/office/en-US/d7ed7986-4f2d-4a13-b0e3-e23260988351/sharepoint-2013-rest-api-filter-by-a-choice-field-value?forum=appsforsharepoint
    //URL filter query suffix = ?$filter=Team eq 'Marketing'
  function getDirectoryData() {
    
    return new Promise(function(resolve, reject) {
      
     $.ajax({
        url: staffListUrl,
        type: "GET",
        headers: {
          "accept": "application/json;odata=verbose"
        }
      })
      .success(function(data) {
        resolve(data);
      })
     .error(function(err) {
        $('#loadingMessage').remove();
        $('#directoryContainer').html('<h2 class="center">Data load error</h2>').removeClass('hidden');
        console.log('Directory List Call Error: ' + err);
        reject(err);
      });
      
    });
  }
  
  /************************** Creating Staff Entries **************************/

  //Called when JSON Object created
  function getHeadshotUrl(x) {
    return x.Headshot ? x.Headshot.Url : null;
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

  function cleanStaffContainer() {
    $('#staffDirectory').html('');
  };

  function buildStaffList(staff) {
    cleanStaffContainer();
    $.each(staff, function(index, value) {
      createStaffCard(value);
    });
    $('#loadingMessage').remove();
    $('#directoryContainer').removeClass('hidden');
  }

  function getCredentials(x) {
    return x.credentials ? (', ' + x.credentials) : ''; 
  }

  function createStaffCard(person) {

    var staffCard = '<section>';
    staffCard += '<div class="image-container">' + addHeadshot(person) + '</div>';
    staffCard += '<header class="staff-contact">'; 
    staffCard += '<h2>' + person.fullName + getCredentials(person) + '</h2>';
    staffCard += '<em>' + person.jobTitle + '</em>';
    staffCard += getOffice(person);
    staffCard += '<span>Phone: ' + person.phone + '</span>';
    staffCard += '<span>Email: <a href="mailto:' + person.email + '">' + person.email + '</a></span>';
    staffCard += '</header>';
    staffCard += getDuties(person);
    staffCard+= '</section>';

    $('#staffDirectory').append(staffCard);

  }
  
  /**************************************************************************
                          Staff Directory Scripts
  **************************************************************************/

  if($("#staffDirectory")) {

    var chosenTeam,
        allStaff = [],
        activeFilter = 'All',
        teams = [];

    getDirectoryData().then(function(data) {
      
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
      
      //Get Teams
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
        createFilter();
        buildStaffList(allStaff);
      })
      .error(function (err) {
        $('#loadingMessage').remove();
        $('#directoryContainer').html('<h2 class="center">Data load error</h2>').removeClass('hidden');
        console.log('Team List Call Error: ' + err);
      });
    });

    
    
    /**************************************************************************
                          Staff Directory Filtering
    **************************************************************************/
    
    //Dynamically create filter based on teams array
    function createFilter() {
      $('#directoryFilter').html('<label for="teamFilter">Filter by Team</label><select name="teamFilter"><option selected>All</option></select>');
      
      $.each(teams, function(index, value) {
        $('#directoryFilter select').append('<option value="' + value + '">' + value + '</option>');
      });
      
      //Add click event to newly created filters that recreate staff cards to only display filtered team
      $('#directoryFilter select').change(function() {

        if(activeFilter !== this.value) {
          chosenTeam = this.value;
          if(chosenTeam === 'All') {
            buildStaffList(allStaff);
          } else {
            cleanStaffContainer();
            $.each(allStaff, function(index, value) {
              if(value.team === chosenTeam) {
                createStaffCard(value);
              }
            });
          } 
          activeFilter = chosenTeam;
        }

      });
    }
    
  }

});