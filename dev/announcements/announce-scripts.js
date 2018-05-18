/**************************************************************************
                     Global Functions and Variables
**************************************************************************/

var data = [],
    listUrl = "https://mycon.ucdenver.edu/_vti_bin/listdata.svc/InternalAnnouncements",
    pageUrl = window.location.href,
    catFilters = {
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

//Clears out directory container whenever called

$(document).ready(function() {

  function cleanContainer() {
    $('#cardContainer').html('');
  }

  function getNum(str) {
    return str.replace(/\D/g,"");
  }

  function createAnnounceCard(arr) {
    arr.forEach(function(obj) {
      var announceCard = "<div class='card'>"; // begin card
          announceCard += "<div class='card-header'>"; // begin card header
          announceCard += "<img src='https://mycon.ucdenver.edu/PublishingImages/icons/megaphone-blue.png' alt=''>";
          announceCard += "<span class='card-title'>" + obj.title + "</span>";
          announceCard += "<span class='card-cat'>" + obj.category + "</span>";
          announceCard += "</div>"; // end card header
          announceCard += "<div class='card-content'>"; // begin card content
          announceCard += obj.content;
          announceCard += "<span class='card-date'>" + obj.created + "</span>";
          announceCard += "</div>"; // end card content
        announceCard += "</div>"; // end card

      $("#cardContainer").append(announceCard);
    });
  }

  var getData = function() {

    //Promise created to handle the ajax call
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: listUrl,
        type: "GET",
        headers: {
          "accept": "application/json;odata=verbose"
        }
      })
      .success(function (obj) {
        //Upon success, the data (an array of strings) is pushed into the data array
        $.each(obj.d.results, function(index, value) {
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
        resolve();
      })
      .error(function () {
        reject(err);
      });
    });

  };

  getData()
    .then(function() {
      cleanContainer();
      createAnnounceCard(data);
    })
    .catch(function(err) {
      console.log(err);
  });

});
