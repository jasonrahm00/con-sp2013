$(document).ready(function () {
  
  /**************************************************************************
                     Global Functions and Variables
  **************************************************************************/
  var chosenTeam,
      activeFilter = 'All',
      teams = [];
    
  /************************** Creating Staff Entries **************************/

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
    $('#directory').html('');
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

    $('#directory').append(staffCard);

  }

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
  
  /**************************************************************************
                          Staff Directory Scripts
  **************************************************************************/

    
  //Get Teams
    //Build cards upon success
  $(function() {

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

});