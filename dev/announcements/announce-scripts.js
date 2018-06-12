const currentPage = window.location.href,
      hrUrlString = "human-resources",
      now = Date.now();

var   categories = [
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

  function getNum(str) {
    return parseInt(str.replace(/\D/g,""));
  }

  function getCategory(x) {
    let category = {};
    categories.forEach(function(element) {
      if (element.name === x) {
        category = element;
      }
    });
    return category;
  }

  function checkHrCat(x) {
    let match = false;
    hrCats.forEach(function(value, index) {
      if(x.category.name == value.name) {
        match = true;
      }
    });
    return match;
  }

  function countResults(data, cats) {
    data.forEach(function(value, index) {
      if(value.category === x.name) {
        x.count++;
      }
    });
  }

  this.getData = function() {

    let deferred = $q.defer();

    return $http.get("https://mycon.ucdenver.edu/_vti_bin/listdata.svc/InternalAnnouncements")
      .then(function(response) {
        let data = [];
      
        response.data.d.results.forEach(function(value, index) {
          if (value.CategoryValue !== "Dean Message") {

            let publishDate = value.PublishDate ? getNum(value.PublishDate) : null;

            if (publishDate === null || publishDate < now) {

              let dataItem = {
                "title": value.Announcement,
                "category": getCategory(value.CategoryValue),
                "content": value.Description,
                "created": getNum(value.Created),
                "modified": getNum(value.Modified),
                "publishDate": publishDate
              };

              if (currentPage.indexOf(hrUrlString) < 0) {
                data.push(dataItem);
              } else if(currentPage.indexOf(hrUrlString) > -1 && checkHrCat(dataItem)) {
                data.push(dataItem);
              }
            }
          }
        });

        categories.map(function(obj) {
          data.forEach(function(value, index) {
            if(obj.name === value.category.name) {
              obj.count++;
            }
          })
        });

        deferred.resolve(data);
        return deferred.promise;
    }, function(error) {
        deferred.reject(error);
        return deferred.promise;
    });
  };

})
.controller("mainController", function($scope, dataService){

  $scope.categories = currentPage.indexOf(hrUrlString) > -1 ? hrCats : categories;
  $scope.allAnnounce = [];
  $scope.filteredAnnounce = [];

  $scope.count = function (prop, value) {
    return function (el) {
      return el[prop] == value;
    };
  };

  dataService.getData().then(function(response) {
    $scope.allAnnounce = response;
    $scope.filteredAnnounce = response;
    $scope.chosenFilter = 0;
  }, function(error) {
    console.log(error);
  });

  $scope.$watch("chosenFilter", function(newVal, oldVal) {
    if (newVal != oldVal) {
      if (newVal === 0) {
        $scope.filteredAnnounce = $scope.allAnnounce;
      } else {
        let filtered = [];
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
