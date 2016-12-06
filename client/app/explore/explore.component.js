const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './explore.routes';

export class ExploreComponent {
  description = '';
  poiInfo=[];
  url="";
  mapCanvas = document.getElementById("map");
  mapOptions = {
    center: new google.maps.LatLng(26.912484, 75.747331), zoom: 13
  };
  map = new google.maps.Map(this.mapCanvas, this.mapOptions);

  /*@ngInject*/
  constructor($http, $scope, $routeParams) {
    this.$routeParams = $routeParams;
    this.$scope=$scope;
    console.log("Poi is id :", this.$routeParams.poiid);
    this.$http = $http
    this.message = 'Hello';
    this.url="http://localhost:3000";
  }

  $onInit() {
    this.$http.get(this.url+'/poi-images/' + this.$routeParams.poiid)
      .then(response => {
        this.$scope.poiImages = response.data;
        console.log("Poi Images : ", this.$scope.poiImages);
      });

    this.$http.get(this.url+'/poi-general-infos/' + this.$routeParams.poiid)
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
      infowindow.open(this.map, myLocation);
      $(".gm-style-iw").parent().addClass("transparentClass");
      $(".gm-style-iw").parent().children(':first-child').children().addClass('hideClass');
    });

    google.maps.event.addListener(myLocation, 'dragend', function (event) {
      console.log(this.getPosition().lat());
      console.log(this.getPosition().lng());
    });
    this.map.setZoom(10);
  }

  findplace(placetofind)
  {
console.log("Find Place ");
    var pyrmont = new google.maps.LatLng(this.poiInfo.Poi.latitude, this.poiInfo.Poi.longitude);
 var request = {
    location: pyrmont,
    radius: 1500,
    types: [placetofind]
  };
  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(this.map);
  service.nearbySearch(request,(results, status)=>{
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
    }
  });
}


createMarker(place)
{
  var infowindow = new google.maps.InfoWindow();
  console.log("place is  :",place);
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: this.map,
    position: place.geometry.location
  });
  var contentString = '<div style="background-color: #00A8FF;padding: 5px;color:#ffffff">' + place.name + '</div>';
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  google.maps.event.addListener(marker, 'click', function () {
    infowindow.open(this.map, marker);
    $(".gm-style-iw").parent().addClass("transparentClass");
    $(".gm-style-iw").parent().children(':first-child').children().addClass('hideClass');
  });

  google.maps.event.addListener(marker, 'dragend', function (event) {
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
