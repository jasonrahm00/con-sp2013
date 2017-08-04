$(document).ready(function() {
  
  /**************************************************************************
                          Staff Directory Scripts
  **************************************************************************/
  //initial if test
  //if(window.location.href.indexOf('administration-test.aspx') > -1) {}
  
  //https://social.msdn.microsoft.com/Forums/office/en-US/d7ed7986-4f2d-4a13-b0e3-e23260988351/sharepoint-2013-rest-api-filter-by-a-choice-field-value?forum=appsforsharepoint
  
  //URL filter query suffix = ?$filter=Team eq 'Marketing'
  var listUrl = "/test/_api/web/lists/GetByTitle('Test Directory')/items";
  var allStaff = [];

  function getHeadshotUrl(x) {
    return x.Headshot ? x.Headshot.Url : null;
  }
  
  function addHeadshotUrl(x) {
    return x.headshot ? x.headshot : "/PublishingImages/headshots/blank-profile.png";
  }
  
  function getOffice(x) {
    return x.office ? ('<span>Office: Ed2 North, Room ' + x.office + '</span>') : '';
  }
  
  function buildStaffList(staff) {
    $('#staffDirectory').html('');
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

});
