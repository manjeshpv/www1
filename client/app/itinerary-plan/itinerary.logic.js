'use strict';
const angular = require('angular');
export class Itinerary {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.message = 'Hello';

  }

  calling() {
    console.log('Testing calling from other');
  }

  checkPoiExist(itinerary, id, callback) {
    var flag = false;
    var data = itinerary.find(function (ele) {

      if (ele.poi_id == id) {
        flag = true;
      }

    });
    callback(flag);
  }

  getModelItem(id, day, placename, lati, longi, vlati, vlongi, time, distance, minExploTime, maxExploTime, waitTime, categoryImg, visited,image) {
    return {
      poi_id: id,
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
      image: image
    }
  }

  activateReadyItinerary() {
    var model = this.getModelItem(0, "start", "Start", localStorage.startLat, localStorage.startLong, "", "", "6:00 AM", "", "", "", "", "", "0", "start.jpg");
    var arr = [];
    arr[0] = model;
    localStorage.itinerary = JSON.stringify(arr);
  }

  getTravelTime(from, to, callback) {
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


}
