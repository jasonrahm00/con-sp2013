/**************************************************************************
                     Global Functions and Variables
**************************************************************************/

var allStaff = [],
    staffListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Staff Directory')/items",
    staffTeamListUrl = "https://mycon.ucdenver.edu/_vti_bin/listdata.svc/StaffDirectoryTeam";
   
function getHeadshotUrl(x) {
  return x.Headshot ? x.Headshot.Url : null;
}

//Reusable ajax call that returns promise with table data info
  //https://social.msdn.microsoft.com/Forums/office/en-US/d7ed7986-4f2d-4a13-b0e3-e23260988351/sharepoint-2013-rest-api-filter-by-a-choice-field-value?forum=appsforsharepoint
  //URL filter query suffix = ?$filter=Team eq 'Marketing'

(function getDirectoryData() {

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
   
   console.log(allStaff);
   
  })
 .error(function(err) {
    $('#loadingMessage').remove();
    $('#directoryContainer').html('<h2 class="center">Data load error</h2>').removeClass('hidden');
    console.log('Directory List Call Error: ' + err);
  });

})();