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
  }

  addToItinerary(poi) {
    console.log('test app click now', poi);
    this.itinerary.push(poi);
    localStorage.itinerary = JSON.stringify(this.itinerary);

    var mylatLong1 = new google.maps.LatLng(26.912484, 75.747331);
    var mylatLong2 = new google.maps.LatLng(26.8921609, 75.8155296);

    this.getTravelTime(mylatLong1, mylatLong2, function (timedis) {
      console.log(timedis);
    });
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
    getTravelTime(mylatLong1, mylatLong2, function (timedis) {
      console.log(timedis);
    });
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
export default angular.module('triptoliUiApp.itinerary-plan', [ngRoute])
  .config(routes)
  .component('itineraryPlan', {
    template: require('./itinerary-plan.html'),
    controller: ItineraryPlanComponent
  })
  .name;
