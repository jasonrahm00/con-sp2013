var serviceListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Department Services')/items",
    emailListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Department Emails')/items",
    services = [],
    emails = [];

var getEmails = function() {
  
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: serviceListUrl,
      type: "GET",
      headers: {
        "accept": "application/json;odata=verbose"
      }
    })
    .success(function(data) {
      //Upon success, the list data alpha sorted
      /*
      data.d.results.sort(function(a, b) {
        return (a.Last_Name > b.Last_Name) ? 1 : ((b.Last_Name > a.Last_Name) ? -1 : 0);
      });
      */
        
      //Each item is turned into a JSON Object and pushed into the allStaff array
      /*
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
      */
      
      console.log(data)
      
      //After data is sorted and object created, the promise resolves so the next action can occur
      resolve();
      
    })
   .error(function() {
      reject('Error with getEmails()');
    });
  });
  
};

var getServices = function() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: emailListUrl,
      type: "GET",
      headers: {
        "accept": "application/json;odata=verbose"
      }
    })
    .success(function(data) {
      
      console.log(data)
      
      //After data is sorted and object created, the promise resolves so the next action can occur
      resolve();
      
    })
   .error(function() {
      reject('Error with getServices()');
    });
  });
};

$(document).ready(function() {
  
  getEmails()
    .then(getServices)
    .then(function() {
      console.log("All Data Available")
    })
    .catch(function(reason) {
      console.log(reason)
  });
  
});

