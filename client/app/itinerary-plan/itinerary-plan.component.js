'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './itinerary-plan.routes';


export class ItineraryPlanComponent {
  itinerary = [];

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.message = 'Hello';
    myMap();
  }

  $onInit() {
    this.$http.get('http://192.168.1.8:3000/api/pois/23')
      .then(response => {
        this.pois = response.data;
        console.log("All Pois are  : ", this.pois);
      });
    if (localStorage.itinerary && JSON.parse(localStorage.itinerary).length > 0) {
      this.itinerary = JSON.parse(localStorage.itinerary);
    }
    localStorage.startLat = 26.8851417;
    localStorage.startLong = 75.6504706;
  }

  addButton(poi) {
    this.addToItinerary(poi.id, poi.name, poi.latitude, poi.longitude, poi.vlatitude, poi.vlongitude, poi.explore_time_leasure, poi.explore_time_optimal, poi.wait_time, poi.icon, poi.PoiGeneralInfo.close, poi.PoiGeneralInfo.open);
  }

  addToItinerary(id, placename, lati, longi, vlati, vlongi, minExploTime, maxExploTime, waitTime, categoryImg, window_close, monument_close) {

    var from;
    if (localStorage.itinerary) {
      var itineraryData = JSON.parse(localStorage.itinerary);
      var totalPoi = itineraryData.length;
      from = new google.maps.LatLng(itineraryData[totalPoi - 1].latitude, itineraryData[totalPoi - 1].longitude);
    }
    else {
      this.activateReadyItinerary();
      from = new google.maps.LatLng(localStorage.startLat, localStorage.startLong);
    }

    var to = new google.maps.LatLng(lati, longi);

    var point = this.getTravelTime(from, to, function (data) {
      var time = data[0];
      var distance = data[1];

      var itineraryData = [];
      var now = new Date();

      if (localStorage.itinerary) {

        itineraryData = JSON.parse(localStorage.itinerary);
        var s = itineraryData[itineraryData.length - 1].time,
          parts = s.match(/(\d+)\:(\d+) (\w+)/),
          hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10) + 12,
          minutes = parseInt(parts[2], 10);
        now.setHours(hours);
        now.setMinutes(minutes);
      }

      var time = parseInt(time.split(' ')[0])
      var maxTime = parseInt(maxExploTime);
      var wait = parseInt(waitTime)
      now.setMinutes(now.getMinutes() + time + maxTime + wait);

      // var reachdate = $filter('date')(now, 'yyyy-MM-dd');
      // var reachtime = $filter('date')(now, 'hh:mm a');
      var reachtime = this.displayTime(now);

      checkPoiExist(itineraryData, id, function (flag) {

        if (flag) {

          alert(" Already Exist In Itinerary !");

        }
        else {
          var model;
          model = getModelItem(id, $rootScope.selectedDay.day, placename, lati, longi, vlati, vlongi, reachtime, distance, minExploTime, maxExploTime, waitTime, categoryImg, "0", window_close, monument_close, true);
          var itineraryData = JSON.parse(localStorage.itinerary);
          itineraryData.push(model);

          localStorage.itinerary = JSON.stringify(itineraryData);
          this.itinerary = itineraryData;

        }
      });

    });
  }

  displayTime(currentTime) {
    var str = "";
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
      minutes = "0" + minutes
    }
    if (seconds < 10) {
      seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if (hours > 11) {
      str += "PM"
    } else {
      str += "AM"
    }
    return str;
  }

  checkPoiExist(itinerary, id, callback) {
    var flag = false;
    var data = itinerary.find(function (ele) {

      if (ele.id == id) {
        flag = true;
      }

    });
    callback(flag);
  }

  getModelItem(id, day, placename, lati, longi, vlati, vlongi, time, distance, minExploTime, maxExploTime, waitTime, categoryImg, visited, window_close, monument_close, canVisit) {
    return {
      id: id,
      day: day,
      placename: placename,
      latitude: lati,
      longitude: longi,
      vlatitude: vlati,
      vlongitude: vlongi,
      time: time,
      distance: distance,
      minExploTime: minExploTime,
      maxExploTime: maxExploTime,
      waitTime: waitTime,
      categoryImg: categoryImg,
      visited: visited,
      window_close: window_close,
      monument_close: monument_close,
      can_visit: canVisit
    }
  }

  activateReadyItinerary() {
    var model = this.getModelItem(0, "start", "Start", localStorage.startLat, localStorage.startLong, "", "", "6:00 AM", "", "", "", "", "", "0", "", "", true);
    var arr = [];
    arr[0] = model;
    localStorage.itinerary = JSON.stringify(arr);
  }

  getTravelTime(from, to, callback) {
    console.log('trying to get time and distance');
    var origin = from; // using google.maps.LatLng class
    var destination = to; // using string

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function (response, status) {
      if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
        var distance = response.rows[0].elements[0].distance.text;
        var duration = response.rows[0].elements[0].duration.text;
        var dvDistance = document.getElementById("dvDistance");
        // dvDistance.innerHTML = "";
        // dvDistance.innerHTML += "Distance: " + distance + "<br />";
        // dvDistance.innerHTML += "Duration:" + duration;

        var item = {};
        item[0] = duration;
        item[1] = distance;
        callback(item);

      } else {
        // var alertPopup = $ionicPopup.alert({
        //   title: 'Error',
        //   template: "Please Set The Start Point First !"
        // });
        //
        // alertPopup.then(function (res) {
        //   $scope.searchPointFlag = true;
        // });
      }
    });

  }


  myMap() {
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
      center: new google.maps.LatLng(26.912484, 75.747331), zoom: 13
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);

    var mylatLong1 = new google.maps.LatLng(26.912484, 75.747331);
    setLocation1(mylatLong1, map);

    var mylatLong2 = new google.maps.LatLng(26.8921609, 75.8155296);
    setLocation2(mylatLong2, map);

  }

  setLocation1(mylatLong, map) {
    var myLocation = new google.maps.Marker({
      position: mylatLong,
      map: map,
      title: "Me",
      zIndex: 1,

    });
    // markers.push(myLocation);
    var contentString = '<div class="event_one">' +
      '<div class="event_item">' +
      '<img src="assets/images/event_1.jpg">' +
      '<div class="event_desc">' +
      '<h6>Musical Night</h6>' +
      '<p>Nucleya, Indian Ocean, Dualist Inquiry, Ankur & The Ghalat Family, Prateek Kuhad Live</p>' +
      '<a href="javascript:;" class="btn btn-event">Know More</a>' +
      '<a href="javascript:;" class="btn btn-event">Book Now</a>' +
      '</div>' +
      '</div>' +
      '</div>';
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    google.maps.event.addListener(myLocation, 'click', function () {
      infowindow.open(map, myLocation);
      $(".gm-style-iw").parent().addClass("transparentClass");
      $(".gm-style-iw").parent().children(':first-child').children().addClass('hideClass');
    });

    google.maps.event.addListener(myLocation, 'dragend', function (event) {
      console.log(this.getPosition().lat());
      console.log(this.getPosition().lng());
    });

  }

  setLocation2(mylatLong, map) {
    var myLocation = new google.maps.Marker({
      position: mylatLong,
      map: map,
      title: "Me",
      zIndex: 1,

    });
    // markers.push(myLocation);
    var contentString = '<div class="event_one">' +
      '<div class="event_item">' +
      '<img src="assets/images/event_1.jpg">' +
      '<div class="event_desc">' +
      '<h6>Musical Night</h6>' +
      '<p>Nucleya, Indian Ocean, Dualist Inquiry, Ankur & The Ghalat Family, Prateek Kuhad Live</p>' +
      '<a href="javascript:;" class="btn btn-event">Know More</a>' +
      '<a href="javascript:;" class="btn btn-event">Book Now</a>' +
      '</div>' +
      '</div>' +
      '</div>';
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    google.maps.event.addListener(myLocation, 'click', function () {
      infowindow.open(map, myLocation);
      $(".gm-style-iw").parent().addClass("transparentClass");
      $(".gm-style-iw").parent().children(':first-child').children().addClass('hideClass');
    });

    google.maps.event.addListener(myLocation, 'dragend', function (event) {
      console.log(this.getPosition().lat());
      console.log(this.getPosition().lng());
    });

  }

}

export
default
angular
  .module(
    'triptoliUiApp.itinerary-plan'
    ,
    [ngRoute]
  )
  .config(routes)

  .component(
    'itineraryPlan'
    , {
      template: require
      (
        './itinerary-plan.html'
      ),
      controller: ItineraryPlanComponent
    }
  )
  .name;
