const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './explore.routes';

export class ExploreComponent {
  description='';
  /*@ngInject*/
  constructor($http,$scope) {
    this.$http = $http
    this.message = 'Hello';
    myMap();
    $scope.mySlides = [
      'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg',
      'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg',
      'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg',
      'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'
    ]
  }

  $onInit() {
    this.$http.get('http://192.168.1.8:3000/api/poi-images/1')
      .then(response => {
        this.poiImage = response.data;
        console.log("Data is : ", this.poiImage);
      });

    this.$http.get('http://192.168.1.8:3000/api/poi-general-infos/1')
      .then(response => {
        this.poiInfo = response.data;
        this.description = this.poiInfo.Poi.short_description;
        console.log("Data is : ", this.poiInfo);
      });

  }

  showMore() {
    console.log("test");
    this.description = this.poiInfo.Poi.description;
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

export default angular.module('triptoliUiApp.explore', [ngRoute])
  .config(routes)
  .component('explore', {
    template: require('./explore.html'),
    controller: ExploreComponent
  })
  .name;
