import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';
import {Itinerary} from '../itinerary-plan/itinerary.logic';

export class MainController {
  $http;
  poiByCity = [];
  newThing = '';
  loiti = new Itinerary();

  /*@ngInject*/
  constructor($http, $scope, $filter) {
    this.$filter = $filter;
    this.$http = $http;
    myMap();
    this.$scope = $scope;

  }

  $onInit() {

    this.$http.get('http://192.168.1.2:3000/api/banners')
      .then(response => {
        this.$scope.mySlides = response.data;
        console.log("Data is : ", this.$scope.mySlides);
      });

    this.$http.get('http://192.168.1.2:3000/api/home-sections/23')
      .then(response => {
        this.$scope.poiByCity = response.data;
        console.log("Data is : ", this.$scope.poiByCity);
      });

    if (localStorage.itinerary) {
      this.$scope.cart = JSON.parse(localStorage.itinerary).length;
    }

  }

  addButton(poi) {

    console.log("Poi to add  : ", poi);
    this.addToItinerary(poi.id, poi.name, poi.latitude, poi.longitude, poi.vlatitude, poi.vlongitude, poi.explore_time_leasure, poi.explore_time_optimal, poi.wait_time, poi.icon, poi.image);
  }


  addToItinerary(id, placename, lati, longi, vlati, vlongi, minExploTime, maxExploTime, waitTime, categoryImg, image) {

    var from;
    if (localStorage.itinerary) {
      var itineraryData = JSON.parse(localStorage.itinerary);
      var totalPoi = itineraryData.length;
      from = new google.maps.LatLng(itineraryData[totalPoi - 1].latitude, itineraryData[totalPoi - 1].longitude);
    }
    else {
      this.loiti.activateReadyItinerary();
      from = new google.maps.LatLng(localStorage.startLat, localStorage.startLong);
    }

    var to = new google.maps.LatLng(lati, longi);

    var point = this.loiti.getTravelTime(from, to, (data) => {
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

      var reachdate = this.$filter('date')(now, 'yyyy-MM-dd');
      var reachtime = this.$filter('date')(now, 'hh:mm a');

      this.loiti.checkPoiExist(itineraryData, id, (flag) => {

        if (flag) {
          alert(" Already Exist In Itinerary !");
        }
        else {
          var model;
          model = this.loiti.getModelItem(id, "day1", placename, lati, longi, vlati, vlongi, reachtime, distance, minExploTime, maxExploTime, waitTime, categoryImg, "0", image);
          var itineraryData = JSON.parse(localStorage.itinerary);
          itineraryData.push(model);

          localStorage.itinerary = JSON.stringify(itineraryData);
          this.$scope.cart = JSON.parse(localStorage.itinerary).length;
          this.$scope.$apply();
        }
      });

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


  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }

  bookMe() {
    console.log("Testing of data call");
  }

}

export default angular.module('triptoliUiApp.main', [ngRoute])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController,
    providers: [Itinerary]
  })
  .name;
