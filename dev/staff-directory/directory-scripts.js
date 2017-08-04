$(document).ready(function() {
  
  /**************************************************************************
                          Staff Directory Scripts
  **************************************************************************/

  if($("#staffDirectory")) {
  
    //https://social.msdn.microsoft.com/Forums/office/en-US/d7ed7986-4f2d-4a13-b0e3-e23260988351/sharepoint-2013-rest-api-filter-by-a-choice-field-value?forum=appsforsharepoint

    //URL filter query suffix = ?$filter=Team eq 'Marketing'
    var chosenTeam,
        listUrl = "/test/_api/web/lists/GetByTitle('Test Directory')/items",
        allStaff = [],
        filteredTeam = [],
        activeFilter = 'All',
        teams = [];

    /**************************************************************************
                          Creating Staff Entries
    **************************************************************************/
    
    function getHeadshotUrl(x) {
      return x.Headshot ? x.Headshot.Url : null;
    }

    function addHeadshotUrl(x) {
      return x.headshot ? x.headshot : "/PublishingImages/headshots/blank-profile.png";
    }

    function getOffice(x) {
      return x.office ? ('<span>Office: Ed2 North, Room ' + x.office + '</span>') : '';
    }
    
    function cleanStaffContainer() {
      $('#staffDirectory').html('');
    };

    function buildStaffList(staff) {
      cleanStaffContainer();
      $.each(staff, function(index, value) {
        createStaffCard(value);
      });
    }

    function createStaffCard(person) {

      var staffCard = '<section>';
      staffCard += '<div class="image-container"><img src="' + addHeadshotUrl(person) + '" alt="" ></div>';
      staffCard += '<header class="staff-contact">'; 
      staffCard += '<h2>' + person.fullName + '</h2>';
      staffCard += '<em>' + person.jobTitle + '</em>';
      staffCard += getOffice(person);
      staffCard += '<span>Phone: ' + person.phone + '</span>';
      staffCard += '<span>Email: <a href="mailto:' + person.email + '">' + person.email + '</a></span>';
      staffCard += '</header>';
      staffCard += '<section class="duties"><h3>Duties</h3>' + (person.duties ? person.duties : '') + '</section>';
      staffCard+= '</section>';

      $('#staffDirectory').append(staffCard);

    }

    //Get all staff from sharepoint list, create object for each entry and push to allStaff array
    $(function() {
      $.ajax({
        url: listUrl,
        type: "GET",
        headers: {
          "accept": "application/json;odata=verbose"
        }
      })
      .success(function (data) {
        results = data.d.results;

        results.sort(function(a, b) {
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
          )
        });

        buildStaffList(allStaff);

      });
    });
    
    /**************************************************************************
                          Staff Directory Filtering
    **************************************************************************/
    
    //Get Teams
    $.getJSON('https://mycon.ucdenver.edu/test/_vti_bin/listdata.svc/TestDirectoryTeam', function(data) {
      $.each(data.d.results, function(index, value) {
        teams.push(value.Value);
      });
      createFilter();
    });
    
    //Dynamically create filter based on teams array
    function createFilter() {
      $('#directoryFilter').html('<label>All Staff<input type="radio" name="staffFilter" value="All" checked></label>');
      
      $.each(teams, function(index, value) {
        var filter = '<label>' + value + '<input type="radio" name="staffFilter" value="' + value + '"></label>';
        $('#directoryFilter').append(filter);
      });
      
      //Recreate staff cards to only display filtered team
          //Create separate array for filtered staff
          //Order team based on team order value
          //When reset to all, rebuild all staff by using all staff list and resort alphabetically
      $('#directoryFilter input').click(function() {

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
