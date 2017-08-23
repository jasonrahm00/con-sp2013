/**************************************************************************
                      Global Variabls and Functions
**************************************************************************/

var serviceListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Department Services')/items?$top=200",
    emailListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Department Emails')/items",
    emails = {},
    services = [];



/**************************************************************************
                              Get Emails
**************************************************************************/

//Run map on email list to add to services?
var getEmails = function() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: emailListUrl,
      type: "GET",
      headers: {
        "accept": "application/json;odata=verbose"
      }
    })
    .success(function(data) {

      var results = data.d.results;
      
      for(var i = 0; i < results.length; i++) {
        var teamName = results[i].Team;
        if(!emails[teamName]) {
          emails[teamName] = [];
        }
        emails[teamName].push(results[i].Email.Description);
      }
      
      //After data is sorted and object created, the promise resolves so the next action can occur
      resolve();
      
    })
   .error(function() {
      reject('Error with getEmails()');
    });
  });
};



/**************************************************************************
                              Get Services
**************************************************************************/

//Use Reduce on data to combine like into single object?
var getServices = function() {
  
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: serviceListUrl,
      type: "GET",
      headers: {
        "accept": "application/json;odata=verbose"
      }
    })
    .success(function(data) {
      var results = data.d.results;
          
      //Upon success, the list data alpha sorted
        //List call results limited to 100 by default append ?$top=(up to 1000) to url to extend results
          //https://sharepoint.stackexchange.com/questions/74777/list-api-get-all-items-limited-to-100-rows
      results.sort(function(a, b) {
        return (a.Title > b.Title) ? 1 : ((b.Title > a.Title) ? -1 : 0);
      });
        
      
      //Each item is turned into a JSON Object and pushed into the allStaff array
      var teams = {};
      
      for(var i = 0; i < results.length; i++) {
        var teamName = results[i].Team;
        if(!teams[teamName]) {
          teams[teamName] = [];
        }
        teams[teamName].push({service: results[i].Title, link: results[i].Link ? results[i].Link.Url : null})
      }
      
      for(var teamName in teams) {
        services.push({team: teamName, list: teams[teamName], email: emails[teamName]});
      }
      
      //After data is sorted and object created, the promise resolves so the next action can occur
      resolve();
      
    })
   .error(function() {
      reject('Error with getServices()');
    });
  });
  
};


/**************************************************************************
                            Build Page
**************************************************************************/

$(document).ready(function() {
  getEmails()
    .then(getServices)
    .then(function() {
      console.log(emails);
      console.log(services);
    })
    .catch(function(reason) {
      console.log(reason)
  });
  
});