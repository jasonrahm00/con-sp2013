$(document).ready(function () {
  
  /**************************************************************************
                     Functions and Variables
  **************************************************************************/
  
  var activeFilter = 'All';
      

  /************************** Creating Staff Entries **************************/
  
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

  function buildStaffList(staff) {
    cleanContainer();
    $.each(staff, function(index, value) {
      createStaffCard(value);
    });
    $('#loadingMessage').remove();
    $('#directoryContainer').removeClass('hidden');
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
          cleanContainer();
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

  getDirectoryData()
    .then(getTeamList)
    .then(function() {
      createFilter();
      buildStaffList(allStaff);
  });
  
});