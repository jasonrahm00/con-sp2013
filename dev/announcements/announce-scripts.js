angular.module("announcements", [])
.service('dataService', function($http, $q){

  'use strict';

  function getNum(str) {
    return str.replace(/\D/g,"");
  }

  this.getData = function() {

    var deferred = $q.defer();

    return $http.get('https://mycon.ucdenver.edu/_vti_bin/listdata.svc/InternalAnnouncements')
      .then(function(response) {
        var data = [];
        response.data.d.results.forEach(function(value, index) {
          if(value.CategoryValue !== "Dean Message") {
            data.push(
              {
                "index": index,
                "title": value.Announcement,
                "category": value.CategoryValue,
                "content": value.Description,
                "created": new Date(parseInt(getNum(value.Created))).toDateString()
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

  $scope.catFilters = {
    "all": [
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
    "hr": [
      "General Announcements",
      "Compensation & Payroll",
      "Performance Evaluations",
      "Personnel Changes",
      "Recruitment",
      "Training & Development"
    ],
    "facAffairs": [
      "General Announcements",
      "Faculty Support",
      "Grand Rounds",
      "Promotion & Tenure",
      "Compensation & Payroll",
      "Performance Evaluations",
      "Personnel Changes",
      "Recruitment",
      "Training & Development"
    ]
  };

  $scope.chosenFilter = "All";

  $scope.allAnnounce = [];

  dataService.getData().then(function(response) {
    $scope.allAnnounce = response;
  }, function(error) {
    console.log(error);
  });

});
