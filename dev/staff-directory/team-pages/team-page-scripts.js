/******************************************

  //Add the following script tag to a scirpt editor webpart on the page and assign the chosenTeam variable to the team name
  //This is an easy/hacky method to allow the directory content to be filtered on the page
  
  <script type="text/javascript">

    chosenTeam = "";

  </script>

*****************************************/

$(document).ready(function() {
  
  /**************************************************************************
                     Functions and Variables
  **************************************************************************/
  
  var staffListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Staff Directory')/items",
      currentTeam = [];
  
  //Builds html components using directory data for each team member passed in
  function createStaffCard(person) {

    var staffCard = '<section>';
        staffCard += '<div class="image-container">' + addHeadshot(person) + '</div>';
        staffCard += '<div><header class="staff-contact">'; 
        staffCard += '<h2>' + person.fullName + getCredentials(person) + '</h2>';
        staffCard += '<h3>' + person.jobTitle + '</h3>';
        staffCard += '</header>';
        staffCard += person.duties ? person.duties : '';
        staffCard += '</section></div>';  

    $('#directory').append(staffCard);

  }
  
  //Build list of entire staff by passing in a staff objects array
  function buildStaffList(staff) {  
    cleanContainer();
    $.each(staff, function(index, value) {
      createStaffCard(value);
    });
    $('#loadingMessage').remove();
    $('#directory').removeClass('hidden');    
  }
  
  /**************************************************************************
                          Staff Directory Scripts
  **************************************************************************/
  
  //Load all directory data making it available on the page
    //Then build team cards as long as chosenTeam is properly assigned
  getDirectoryData(staffListUrl)
    .then(function() {
    
      if(chosenTeam) {
        
        for(var i = 0; i < allStaff.length; i++) {
          if(allStaff[i].team == chosenTeam) {
            currentTeam.push(allStaff[i]);
          }
        }
        
        currentTeam.sort(function(a,b) {
          return (a.teamOrder > b.teamOrder) ? 1 : ((b.teamOrder > a.teamOrder) ? -1 : 0);
        });
        
        buildStaffList(currentTeam);
        
      }
    
    })
    .catch(function(reason) {
      //If there's an error at this point, the promise is rejected and the following messaging appears
      $('#directory').remove();
      $('#loadingMessage').html('<h2 class="center">Directory failed to load</h2>');
      console.log(reason);
  });
  
});