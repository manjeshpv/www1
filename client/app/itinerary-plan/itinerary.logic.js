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

      if (ele.id == id) {
        flag = true;
      }

    });
    callback(flag);
  }

  getModelItem(id, day, placename, lati, longi, vlati, vlongi, time, distance, minExploTime, maxExploTime, waitTime, categoryImg, visited,image) {
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
      image: image
    }
  }

  activateReadyItinerary() {
    var model = this.getModelItem(0, "start", "Start", localStorage.startLat, localStorage.startLong, "", "", "6:00 AM", "", "", "", "", "", "0", "");
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

recalculate(callback) {
  if (localStorage.itinerary) {
    var itinerarydata = JSON.parse(localStorage.itinerary);
    var i = 0;
    var j = 1;
    itinerarydata.forEach((ele)=> {
      if (i != 0) {
        var from = new google.maps.LatLng(itinerarydata[i - 1].latitude, itinerarydata[i - 1].longitude);
        var to = new google.maps.LatLng(ele.latitude, ele.longitude);

        this.getTravelTime(from, to, function (timedata) {
          var time = itinerarydata[j - 1].time.split(' ')[0].split(':');
          var min = parseInt(timedata[0].split(' ')[0]);
          var distance = timedata[1];
          var currentTime = new Date();
          currentTime.setHours(time[0]);
          currentTime.setMinutes(time[1]);
          var maxTime = parseInt(ele.maxExploTime);
          var waitTime = parseInt(ele.waitTime);
          currentTime.setMinutes(currentTime.getMinutes() + min + maxTime + waitTime);
          var newtime = this.$filter('date')(currentTime, 'hh:mm a');


          var model = this.getModelItem(itinerarydata[j].id, itinerarydata[j].day, itinerarydata[j].placename, itinerarydata[j].latitude, itinerarydata[j].longitude, itinerarydata[j].vlatitude, itinerarydata[j].vlongitude, newtime, distance, itinerarydata[j].minExploTime, itinerarydata[j].maxExploTime, itinerarydata[j].waitTime, itinerarydata[j].categoryImg, itinerarydata[j].visited, itinerarydata[j].image);

          itinerarydata[j] = model;
          localStorage.itinerary = JSON.stringify(itinerarydata);
          j++;
        });
      }

      i++;
    });
  }
  callback();
}

}
