/**************************************************************************
                      Global Variabls and Functions
**************************************************************************/

var serviceListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Department Services')/items?$top=200",
    emailListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Department Emails')/items",
    teamListUrl = "https://mycon.ucdenver.edu/_vti_bin/listdata.svc/DepartmentServicesTeam",
    services = [],
    teams = [],
    emails = [];



/**************************************************************************
                            Get Teams
**************************************************************************/
/*
var getTeams = function() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: teamListUrl,
      type: "GET",
      headers: {
        "accept": "application/json;odata=verbose"
      }
    })
    .success(function(data) {
      
      $.each(data.d.results, function(index, value) {
        services.push({
          team: value.Value,
          email: [],
          serviceList: []
        });
      });
      
      //After data is sorted and object created, the promise resolves so the next action can occur
      resolve();
      
    })
   .error(function() {
      reject('Error with getTeams()');
    });
  });
};
*/



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

      $.each(data.d.results, function(index, value) {
        for(var i = 0; i < services.length; i++) {
          if(services[i].team === value.Title) {
            services[i].email.push(value.Email.Description);
          }
        }
      });
      
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
      
      console.log(teams);
      
      for(var teamName in teams) {
        services.push({team: teamName, list: teams[teamName]});
      }
      
      /*
      $.each(results, function(index, value) {
        services.push(
          {
            team: value.Team,
            service: value.Title,
            link: value.Link ? value.Link.Url : null
          }
        )
      });
      */
      
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
  getServices()
    .then(function() {
      console.log(services);
    })
    .catch(function(reason) {
      console.log(reason)
  });
  
});