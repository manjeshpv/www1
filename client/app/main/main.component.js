import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';

export class MainController {
  $http;
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    myMap();
  }

  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
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
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }

  bookMe(){
    console.log("Testing of data call");
  }

}

export default angular.module('triptoliUiApp.main', [ngRoute])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
