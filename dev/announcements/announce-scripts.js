var currentPage = window.location.href,
    hrUrlString = "human-resources",
    now = Date.now(),
    categories = [
        {
          "name": "All Announcements",
          "icon": "megaphone",
          "index": 0,
          "color": "blue",
          "count": null
        },
        {
          "name": "General Announcements",
          "icon": "newspaper",
          "index": 1,
          "color": "blue",
          "count": 0
        },
        {
          "name": "Faculty Support",
          "icon": "question",
          "index": 2,
          "color": "blue",
          "count": 0
        },
        {
          "name": "Grand Rounds",
          "icon": "presentation",
          "index": 3,
          "color": "blue",
          "count": 0
        },
        {
          "name": "Promotion & Tenure",
          "icon": "person",
          "index": 4,
          "color": "blue",
          "count": 0
        },
        {
          "name": "Compensation & Payroll",
          "icon": "money",
          "index": 5,
          "color": "blue",
          "count": 0
        },
        {
          "name": "Performance Evaluations",
          "icon": "checklist",
          "index": 6,
          "color": "blue",
          "count": 0
        },
        {
          "name": "Personnel Changes",
          "icon": "hierarchy",
          "index": 7,
          "color": "blue",
          "count": 0
        },
        {
          "name": "Recruitment",
          "icon": "handshake",
          "index": 8,
          "color": "blue",
          "count": 0
        },
        {
          "name": "Training & Development",
          "icon": "certificate",
          "index": 9,
          "color": "blue",
          "count": 0
        }
      ],
    hrCats = [
        categories[0],
        categories[1],
        categories[5],
        categories[6],
        categories[7],
        categories[8],
        categories[9]
      ];

angular.module("announcements", [])
.filter("renderHTMLCorrectly", function($sce) {
  return function(stringToParse) {
    return $sce.trustAsHtml(stringToParse);
  }
})
.service("dataService", function($http, $q){

  "use strict";

  // Strips non-numeric characters from string and returns integer
  function getNum(str) {
    return parseInt(str.replace(/\D/g,""));
  }

  // Expects cateogry name string from dataItem object
    // Returns category object with matching name
  function getCategory(x) {
    var category = {};
    categories.forEach(function(element) {
      if (element.name === x) {
        category = element;
      }
    });
    return category;
  }

  // Expects category object from dataItem
    // Iterates over hrCats array and sets match to 'true' if category names match
    // Used to limit display of results on hr pages
  function checkHrCat(x) {
    var match = false;
    hrCats.forEach(function(value, index) {
      if(x.category.name == value.name) {
        match = true;
      }
    });
    return match;
  }

  // getData method to be called from controller
    // Returns promise with announcement data object array upon success
  this.getData = function() {

    var deferred = $q.defer();

    // Get function that retrieves data from Internal Annoucements list
    return $http.get("https://mycon.ucdenver.edu/_vti_bin/listdata.svc/InternalAnnouncements")
      .then(function(response) {
        var data = [];

        // If get request succeeds, iterate over results
        response.data.d.results.forEach(function(value, index) {

          // Only select results that are not "Dean Message"
          if (value.CategoryValue !== "Dean Message") {

            // Get value of publish date, if set, should be milliseconds
              // Send to getNum function to strip out non-numeric characters
            var publishDate = value.PublishDate ? getNum(value.PublishDate) : null;
            var expireDate = value.Expires ? getNum(value.Expires) : null;

            // If check to only grab results that are 'published', ready for display and not expired
            if ((publishDate === null || publishDate < now) && (expireDate === null || expireDate > now)) {

              // Create data object for each result
              var dataItem = {
                "title": value.Announcement,
                "category": getCategory(value.CategoryValue),
                "content": value.Description,
                "expires": expireDate,
                "publishDate": publishDate
              };

              // Check to see if widget is loaded on HR page
                // If not on HR Page, push all relevant, published dataItems to data array
                // If on HR page, pass each dataItem into checkHrCat function
                  // Only dataItems that have matching HR Cat values are pushed into data array
              if (currentPage.indexOf(hrUrlString) < 0) {
                data.push(dataItem);
              } else if(currentPage.indexOf(hrUrlString) > -1 && checkHrCat(dataItem)) {
                data.push(dataItem);
              }
            }
          }
        });

        // Call map method on categories array
          // Iterates over each data object and increases category count property when matching category is found in data
          // Count property used to disable html filter inputs with no results, and display total results for each category
        categories.map(function(obj) {
          data.forEach(function(value, index) {
            if(obj.name === value.category.name) {
              obj.count++;
            }
          })
        });

        // Resolves $q.defer() and returns data promise
        deferred.resolve(data);
        return deferred.promise;
    }, function(error) {
        deferred.reject(error);
        return deferred.promise;
    });
  };

})
.controller("mainController", function($scope, dataService){

  $scope.hrPage = currentPage.indexOf(hrUrlString) > -1 ? true : false;
  $scope.categories = $scope.hrPage ? hrCats : categories;
  $scope.allAnnounce = [];
  $scope.filteredAnnounce = [];
  $scope.currPage = currentPage;

  // Loads data from dataService, response data expected to be json object array
    // Response data assigned to two scoped variables
      // $scope.allAnnounce used to reset filters
      // $scope.chosenFilter set to index of "All Announcements" filter object so that input is selected and highlighted when page loads
  dataService.getData().then(function(response) {
    $scope.allAnnounce = response;
    $scope.filteredAnnounce = response;
    $scope.chosenFilter = 0;
  }, function(error) {
    console.log(error);
  });

  // Watcher set on chosenFilter. Triggered when new filter is clicked, the value changes
  $scope.$watch("chosenFilter", function(newVal, oldVal) {
    if (newVal != oldVal) {
      if (newVal === 0) {
        // Resets filters if "All Announcements" is selected
        $scope.filteredAnnounce = $scope.allAnnounce;
      } else {
        // Filtered array set up to capture announcements whose index property matches
          // Matching announcement objects pushed into filtered array
          // filteredAnnounce set to filtered array so DOM will re-paint and show results of selection
        var filtered = [];
        $scope.allAnnounce.forEach(function(elem) {
          if (elem.category.index === newVal) {
            filtered.push(elem);
          }
        });
        $scope.filteredAnnounce = filtered;
      }
    }
  });

});
