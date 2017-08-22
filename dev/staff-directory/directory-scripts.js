$(document).ready(function() {
  
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
        staffCard += '</section>';  

    $('#directory').append(staffCard);

  }

  //Build list of entire staff by passing in allStaff array
    //Called on initial load and if select option 'All' is chosen
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

  //Promise chain used on initial page load
    //First method calls loads the staff directory list data and creates JSON object for each entry
    //First .then() calls getTeamList method which creates an array of teams from the dropdown choice in the directory list
    //Second .then() executes the createFilter and buildStaffList functions to build the entire staff list
    //Upon completion
      //The full staff list and filter are visible on the page
      //The allStaff object array is available to dynamically filter the list in the page without additional api calls

  getDirectoryData()
    .then(getTeamList)
    .then(function() {
      createFilter();
      buildStaffList(allStaff);
    })
    .catch(function(reason) {
      //If there's an error at this point, the promise is rejected and the following messaging appears
      $('#directoryContainer').remove();
      $('#loadingMessage').html('<h2 class="center">Directory failed to load</h2>');
      console.log(reason);
  });

});