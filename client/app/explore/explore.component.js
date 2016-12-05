const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './explore.routes';

export class ExploreComponent {
  description='';

  mapCanvas = document.getElementById("map");
  mapOptions = {
    center: new google.maps.LatLng(26.912484, 75.747331), zoom: 13
  };
  map = new google.maps.Map(this.mapCanvas, this.mapOptions);

  /*@ngInject*/
  constructor($http,$scope,$routeParams) {
    this.$routeParams=$routeParams;
    console.log("Poi is id :",this.$routeParams.poiid);
    this.$http = $http
    this.message = 'Hello';

    $scope.mySlides = [
      'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg',
      'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg',
      'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg',
      'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'
    ]
  }

  $onInit() {
    this.$http.get('http://192.168.1.2:3000/api/poi-images/'+this.$routeParams.poiid)
      .then(response => {
        this.poiImage = response.data;
        console.log("Data is : ", this.poiImage);
      });

    this.$http.get('http://192.168.1.2:3000/api/poi-general-infos/'+this.$routeParams.poiid)
      .then(response => {
        this.poiInfo = response.data;
        this.description = this.poiInfo.Poi.short_description;
        console.log("Data is : ", this.poiInfo);

        var mylatLong = new google.maps.LatLng(this.poiInfo.Poi.latitude, this.poiInfo.Poi.longitude);
        this.setLocation(mylatLong, this.poiInfo.Poi);
      });



  }

  showMore() {
    console.log("test");
    this.description = this.poiInfo.Poi.description;
  }
  setLocation(mylatLong, poi) {
    var myLocation = new google.maps.Marker({
      position: mylatLong,
      map: this.map,
      title: poi.placename,
      zIndex: 1,

    });
    // this.markers.push(myLocation);
    var contentString = '<div style="background-color: #00A8FF;padding: 5px;color:#ffffff">' + poi.name + '</div>';
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
    this.map.setZoom(10);
  }




}

export default angular.module('triptoliUiApp.explore', [ngRoute])
  .config(routes)
  .component('explore', {
    template: require('./explore.html'),
    controller: ExploreComponent
  })
  .name;
