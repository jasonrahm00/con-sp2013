$(document).ready(function() {
  
  /**************************************************************************
                          Administration Page Scripts
  **************************************************************************/
  
  /*
  if(window.location.href.indexOf('administration-test.aspx') > -1) {
    var listUrl = 'https://mycon.ucdenver.edu/_vti_bin/listdata.svc/Directory';
    var tableData = [];
    
    $.getJSON(listUrl, function(data) {
      
      $.each(data.d.results, function(index, value) {
        tableData.push(
          {
            id: value.Id,
            email: value.Email.split(', '),
            jobTitle: value.JobTitle,
            name: value.Name,
            phone: value.Phone,
            profilePage: value.Profile ? value.Profile.split(', ') : null,
            subTeam: value.SubTeam,
            team: value.Team          
          }
        )
      });
      
      console.log(tableData);
      
    });
  }
  */
  
});