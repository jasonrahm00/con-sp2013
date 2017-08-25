/**************************************************************************
                      Global Variabls and Functions
**************************************************************************/

var serviceListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Department Services')/items?$top=200",
    services = [];



/**************************************************************************
                  Department Directory Functions
**************************************************************************/

var deptDirectoryUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Department Directory')/items",
    deptDirectory = {};

//Get directory list data
  //Adds data to the deptDirectory data on ajax success
  //Returns promise when done
function getDirectory() {
  
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: deptDirectoryUrl,
      type: "GET",
      headers: {
        "accept": "application/json;odata=verbose"
      }
    })
    .success(function(data) {

      var results = data.d.results;

      for(var i = 0; i < results.length; i++) {
        var teamName = results[i].Team;
        deptDirectory[teamName] = {
          page: results[i].Web_Page ? results[i].Web_Page.Url : null,
          phone: results[i].Phone_Number ? results[i].Phone_Number : null,
          email: results[i].Email ? results[i].Email.split(",") : null
        }
      }
      resolve();
    })
    .error(function() {
      reject();
    });
  })
}

function createContact(directoryEntry, departmentName) {
  
  var contactSection = '<section><h3>Department Contact</h3>';
      contactSection += '<ul>';
      contactSection += directoryEntry.phone ? ('<li>Phone: ' + directoryEntry.phone + '</li>') : '';
  
  if(directoryEntry.email != null) {
    for(var i = 0; i < directoryEntry.email.length; i++) {
      contactSection += '<li>Email: <a href=mailto:' + directoryEntry.email[i] + '>' + directoryEntry.email[i] + '</a></li>';
    } 
  }
  
  contactSection += directoryEntry.page ? ('<li><a href="' + directoryEntry.page + '">Visit ' + departmentName + ' Page</a></li>') : '';
  contactSection += '</ul></section>';

  return contactSection;

}



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
        services.push(
          {
            team: teamName,
            list: teams[teamName]
          }
        );
      }
      
      //Object array is alpha sorted by team name
      services.sort(function(a, b) {
        return (a.team > b.team) ? 1 : ((b.team > a.team) ? -1 : 0);
      });
      
      //After data is sorted and object created, the promise resolves so the next action can occur
      resolve();
      
    })
   .error(function() {
      reject();
    });
  });
  
};



/**************************************************************************
                      Component Creation Functions
**************************************************************************/

function createList(x) {
  
  var list = '<ul class="list-column">';
  
  function checkExit(z) {
    if(z.indexOf('.pdf') > -1 || z.indexOf('mycon.ucdenver.edu') == -1) {
      return 'target="_blank"';
    }
  }
  
  function linkCheck(y) {
    return y.link ? '<a href="' + y.link + '"' + checkExit(y.link) + '>' + y.service + '</a>' : y.service;
  }
  
  for(var i = 0; i < x.length; i++) {
    list += '<li>' + linkCheck(x[i]) + '</li>';
  }
  
  list += '</ul>';
  
  return list;

}

function buildServiceSections(x) {
  var serviceSection = '<section><h2>' + x.team + '</h2>';
      serviceSection += createList(x.list);
      serviceSection += deptDirectory[x.team] ? createContact(deptDirectory[x.team], x.team) : '';
      serviceSection += '</section>';
  $('#serviceListContainer').append(serviceSection);
}



/**************************************************************************
                            Build Page
**************************************************************************/

$(document).ready(function() {
  getDirectory()
    .then(getServices)
    .then(function() {

      for(var i = 0; i < services.length; i++) {
        buildServiceSections(services[i]);
      }
    
      $('#loadingMessage').remove();
      $('#serviceListContainer').removeClass('hidden');
    
    })
    .catch(function(reason) {
      $('#loadingMessage').html('<h2>Data failed to load</h2>')
      console.log(reason)
  });
  
});