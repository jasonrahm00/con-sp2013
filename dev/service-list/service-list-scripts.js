/**************************************************************************
                      Global Variabls and Functions
**************************************************************************/

var serviceListUrl = "https://mycon.ucdenver.edu/_api/web/lists/GetByTitle('Department Services')/items?$top=200",
    teamPage = {},
    services = [];



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
        services.push({team: teamName, list: teams[teamName], email: emails[teamName], page: teamPage[teamName]});
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

function createContact(email, page, team) {
  
  var contactSection = '<section><h3>Department Contact</h3><ul>',
      dataPresent = 0;
  
  if(email != undefined) {
    
    dataPresent++;
    
    for(var i = 0; i < email.length; i++) {
      contactSection += '<li>Email: <a href="mailto:' + email[i] + '">' + email[i] + '</a></li>';
    }

  } 
  
  if(page != undefined || page != null) {
    dataPresent++;
    contactSection += '<li><a href="' + page + '">Visit ' + team + ' Page</a></li>'
  }
  
  if(dataPresent > 0) {
    contactSection += '</ul></section>';
    return contactSection;
  } else {
    return '';
  }
}

function buildServiceSections(x) {
  var serviceSection = '<section><h2>' + x.team + '</h2>';
      serviceSection += createList(x.list);
      serviceSection += createContact(x.email, x.page, x.team);
      serviceSection += '</section>';
  $('#serviceListContainer').append(serviceSection);
}



/**************************************************************************
                            Build Page
**************************************************************************/

$(document).ready(function() {
  getTeamContact()
    .then(getServices)
    .then(function() {
      console.log(services);

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