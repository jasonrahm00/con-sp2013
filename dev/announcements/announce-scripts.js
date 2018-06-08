const currentPage = window.location.href,
      hrUrlString = "/human-resources/",
      facAffairsUrlString = "/faculty-affairs/",
      hrCats = [
        "General Announcements",
        "Compensation & Payroll",
        "Performance Evaluations",
        "Personnel Changes",
        "Recruitment",
        "Training & Development"
      ],
      facCats = [
        "General Announcements",
        "Faculty Support",
        "Grand Rounds",
        "Promotion & Tenure",
        "Compensation & Payroll",
        "Performance Evaluations",
        "Personnel Changes",
        "Recruitment",
        "Training & Development"
      ],
      categories = [
        {
          "name": "All Announcements",
          "icon": "megaphone",
          "index": 0,
          "color": "blue"
        },
        {
          "name": "General Announcements",
          "icon": "megaphone",
          "index": 1,
          "color": "blue"
        },
        {
          "name": "Faculty Support",
          "icon": "question",
          "index": 2,
          "color": "blue"
        },
        {
          "name": "Grand Rounds",
          "icon": "presentation",
          "index": 3,
          "color": "blue"
        },
        {
          "name": "Promotion & Tenure",
          "icon": "person",
          "index": 4,
          "color": "blue"
        },
        {
          "name": "Compensation & Payroll",
          "icon": "money",
          "index": 5,
          "color": "blue"
        },
        {
          "name": "Performance Evaluations",
          "icon": "checklist",
          "index": 6,
          "color": "blue"
        },
        {
          "name": "Personnel Changes",
          "icon": "hierarchy",
          "index": 7,
          "color": "blue"
        },
        {
          "name": "Recruitment",
          "icon": "handshake",
          "index": 8,
          "color": "blue"
        },
        {
          "name": "Training & Development",
          "icon": "certificate",
          "index": 9,
          "color": "blue"
        }
      ];

angular.module("announcements", [])
.service('dataService', function($http, $q){

  'use strict';

  function getNum(str) {
    return str.replace(/\D/g,"");
  }

  function getCategory(x) {
    var category = {};
    categories.forEach(function(element) {
      if (element.name === x) {
        category = element;
      }
    });
    return category;
  }

  this.getData = function() {

    var deferred = $q.defer();

    //Filter results at data call when on hr or fac affairs page. Pass list view or filter param into url query?
    return $http.get('https://mycon.ucdenver.edu/_vti_bin/listdata.svc/InternalAnnouncements')
      .then(function(response) {
        var data = [];
        response.data.d.results.forEach(function(value, index) {
          if(value.CategoryValue !== "Dean Message") {
            data.push(
              {
                "index": index,
                "title": value.Announcement,
                "category": getCategory(value.CategoryValue),
                "content": value.Description,
                "created": new Date(parseInt(getNum(value.Created))).toDateString(),
                "modified": new Date(parseInt(getNum(value.Modified))).toDateString()
              }
            );
          }
        });
        deferred.resolve(data);
        return deferred.promise;
    }, function(error) {
        deferred.reject(error);
        return deferred.promise;
    });
  };

})
.filter("renderHTMLCorrectly", function($sce) {
	return function(stringToParse) {
      return $sce.trustAsHtml(stringToParse);
	}
})
.controller("mainController", function($scope, dataService){

  $scope.categories = categories;
  $scope.allAnnounce = [];
  $scope.filteredAnnounce = [];

  dataService.getData().then(function(response) {
    $scope.allAnnounce = response;
    $scope.filteredAnnounce = response;
    $scope.chosenFilter = 0;
  }, function(error) {
    console.log(error);
  });

  $scope.$watch('chosenFilter', function(newVal, oldVal) {
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
