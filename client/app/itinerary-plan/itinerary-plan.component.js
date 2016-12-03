'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './itinerary-plan.routes';
import {Itinerary} from './itinerary.logic';


export class ItineraryPlanComponent {
  itinerary = [];
  loiti = new Itinerary();
  itineraryMarkers = [];

  mapCanvas = document.getElementById("map");
  mapOptions = {
    center: new google.maps.LatLng(26.912484, 75.747331), zoom: 13
  };
  map = new google.maps.Map(this.mapCanvas, this.mapOptions);

  routes = [];
  markers = [];

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.message = 'Hello';
    this.itinerary = [];
    // myMap();

  }

  $onInit() {
    this.$http.get('http://192.168.1.8:3000/api/pois/23')
      .then(response => {
        this.pois = response.data;
        console.log("All Pois are  : ", this.pois);
      });
    if (localStorage.itinerary && JSON.parse(localStorage.itinerary).length > 0) {
      this.itinerary = JSON.parse(localStorage.itinerary);
      this.setItineraryMarkers(this.itinerary);
      this.drawLine();
      this.optimizeItineraryZoom();
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

    var point = this.getTravelTime(from, to, (data) => {
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

      this.loiti.calling();
      var reachtime = this.loiti.displayTime(now);

      this.loiti.checkPoiExist(itineraryData, id, (flag) => {

        if (flag) {
          alert(" Already Exist In Itinerary !");
        }
        else {
          var model;
          model = this.loiti.getModelItem(id, "day1", placename, lati, longi, vlati, vlongi, reachtime, distance, minExploTime, maxExploTime, waitTime, categoryImg, "0", window_close, monument_close, true);
          var itineraryData = JSON.parse(localStorage.itinerary);
          itineraryData.push(model);

          localStorage.itinerary = JSON.stringify(itineraryData);
          this.itinerary = itineraryData;
          this.setItineraryMarkers(itineraryData);
          this.drawLine();
          this.optimizeItineraryZoom();
        }
      });

    });

  }


  activateReadyItinerary() {
    var model = this.loiti.getModelItem(0, "start", "Start", localStorage.startLat, localStorage.startLong, "", "", "6:00 AM", "", "", "", "", "", "0", "", "", true);
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
    this.map = new google.maps.Map(mapCanvas, mapOptions);
  }

  setLocation(mylatLong, poi) {
    var myLocation = new google.maps.Marker({
      position: mylatLong,
      map: this.map,
      title: poi.placename,
      zIndex: 1,

    });
     this.markers.push(myLocation);
    var contentString = '<div style="background-color: #00A8FF;padding: 5px;color:#ffffff">' + poi.placename + '</div>';
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


  setItineraryMarkers(itineraryData) {
    itineraryData.forEach((item, index) => {
      var mylatLong = new google.maps.LatLng(item.latitude, item.longitude);
      this.setLocation(mylatLong, item);
    })
  }


  drawLine() {

    // if (lastpath) {
    //   lastpath.setMap(null);
    // }

    if (this.routes.length > 0) {
      for (var i = 0; i < this.routes.length; i++) {
        this.routes[i].setMap(null);
      }

    }
    // lastpath.setPath([]);
    var colorsLine = ["#9E9E9E", "#2196F3", "#009688", "#4CAF50", "#E65100", "#CDDC39", "#651FFF", "#F06292"];
    if (localStorage.itinerary) {
      var readyItineraryData = JSON.parse(localStorage.itinerary);
      // var itineraryOfDay = $filter('filter')(readyItineraryData, {day: $rootScope.selectedDay.day});
      // itineraryOfDay.unshift(readyItineraryData[0]);
      var drowdata = readyItineraryData;

      console.log("drawData is : ", readyItineraryData);

      for (var i = 0; i < drowdata.length - 1; i++) {

        var start = new google.maps.LatLng(drowdata[i].latitude, drowdata[i].longitude);
        var end = new google.maps.LatLng(drowdata[i + 1].latitude, drowdata[i + 1].longitude);

        if (i == 0) {
          var start = new google.maps.LatLng(drowdata[i].latitude, drowdata[i].longitude);
          var end = new google.maps.LatLng(drowdata[i + 1].latitude, drowdata[i + 1].longitude);

          var flightPathShadow = new google.maps.Polyline({
            path: [start, end],
            strokeColor: '#ffffff',
            strokeOpacity: 0.8,
            strokeWeight: 5,
            map: this.map
          });
          this.routes.push(flightPathShadow);

          var startPath = new google.maps.Polyline({
            path: [start, end],
            strokeColor: '#00C853',
            strokeOpacity: 1,
            strokeWeight: 3,
            map: this.map
          });
          this.routes.push(startPath);
        }
        else {


          var flightPathShadow = new google.maps.Polyline({
            path: [start, end],
            strokeColor: '#ffffff',
            strokeOpacity: 0.8,
            strokeWeight: 5,
            map: this.map
          });
          this.routes.push(flightPathShadow);

          var paths = new google.maps.Polyline({
            path: [start, end],
            strokeColor: '#FF5722',
            strokeOpacity: 1.0,
            strokeWeight: 3,
            map: this.map
          });

          this.routes.push(paths);
        }
      }

      // var start = new google.maps.LatLng(drowdata[0].latitude, drowdata[0].longitude);
      // var end = new google.maps.LatLng(drowdata[drowdata.length - 1].latitude, drowdata[drowdata.length - 1].longitude);
      //
      // lastpath = new google.maps.Polyline({
      //   path: [start, end],
      //   strokeColor: "#FF0000",
      //   strokeOpacity: 1.0,
      //   strokeWeight: 4,
      //   map: map
      // });


    }

  }

  clearAllLine() {
    if (this.routes.length > 0) {
      for (var i = 0; i < this.routes.length; i++) {
        this.routes[i].setMap(null);
      }
    }
  }
  optimizeItineraryZoom() {
  this.map.setZoom(10);

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
      controller: ItineraryPlanComponent,
      providers: [Itinerary]
    }
  )
  .name;
