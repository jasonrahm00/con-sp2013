var $ = jQuery,
    staffListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Staff Directory')/items",
    sgcMembers = [],
    sgcOfficers = [
      {
        "office": "Chair",
        "member": null
      },
      {
        "office": "Vice Chair",
        "member": null
      },
      {
        "office": "Parliamentarian",
        "member": null
      },
      {
        "office": "Secretary",
        "member": null
      },
      {
        "office": "Treasurer",
        "member": null
      }      
    ];

$(document).ready(function() {
  
  /**************************************************************************
                     Functions and Variables
  **************************************************************************/

  //Builds html components using directory data for each team member passed in
  function createStaffCard(person) {

    var staffCard = '<section>';
        staffCard += '<div class="image-container">' + addHeadshot(person) + '</div>';
        staffCard += '<div><header>'; 
        staffCard += '<h2>' + person.fullName + '</h2>';
        staffCard += person.committeeRole ? '<h3>' + person.committeeRole + '</h3>' : '';
        staffCard += '</header>';
        staffCard += person.statement ? person.statement : '';
        staffCard += '</section></div>';  

    $('#directory').append(staffCard);

  }
  
  /**************************************************************************
                          Staff Directory Scripts
  **************************************************************************/
  
  //Load all directory data making it available on the page
    //Then build team cards as long as chosenTeam is properly assigned
  getDirectoryData(staffListUrl)
    .then(function() {
      for(var i = 0; i < allStaff.length; i++) {
        if(allStaff[i].committees) {
          if(allStaff[i].committeeRole) {
            for(var j = 0; j < sgcOfficers.length; j++) {
              if(sgcOfficers[j].office == allStaff[i].committeeRole) {
                sgcOfficers[j].member = allStaff[i];
              }
            }
          } else {
            sgcMembers.push(allStaff[i]);
          }
        }
      }
    
      cleanContainer();

      $.each(sgcOfficers, function(index, value) {
        value.member ? createStaffCard(value.member) : '';
      });
      $.each(sgcMembers, function(index, value) {
        createStaffCard(value);
      });
    
      $('#loadingMessage').remove();
      $('#directory').removeClass('hidden'); 
    })
    .catch(function(reason) {
      //If there's an error at this point, the promise is rejected and the following messaging appears
      $('#directory').remove();
      $('#loadingMessage').html('<h2 class="center">Directory failed to load</h2>');
      console.log(reason);
  });
  
});