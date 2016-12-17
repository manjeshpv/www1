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
  constructor($http, $filter, $scope) {
    this.$scope = $scope;
    this.$http = $http;
    this.$filter = $filter;
    this.message = 'Hello';
    this.$scope.itinerary = [];
    this.$scope.trip = [];
    this.initTimePicker();
    this.initDatePicker();
  }

  initDatePicker() {
    this.$scope.dt = new Date();
  }

  initTimePicker() {
    var start = new Date();

    if (localStorage.itinerary) {
      var itineraryData = JSON.parse(localStorage.itinerary);
      var startTime = itineraryData[0].time;
      var time = startTime.split(' ')[0].split(':');
      console.log("start time : ", time);
      start.setHours(time[0]);
      start.setMinutes(time[1]);
    }

    this.$scope.mytime = start;
    this.$scope.hstep = 1;
    this.$scope.mstep = 1;
    this.$scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };
    this.$scope.ismeridian = true;
  }

  showTime() {
    this.$scope.showTimePicker = true;
  }

  closeTimePicker() {
    this.$scope.showTimePicker = false;
    var itineraryData = JSON.parse(localStorage.itinerary);
    itineraryData[0].time = this.$filter('date')(this.$scope.mytime, 'hh:mm a');
    localStorage.itinerary = JSON.stringify(itineraryData);

    this.recalculate(() => {
      if (localStorage.itinerary) {
        this.$scope.itinerary = JSON.parse(localStorage.itinerary);
        setTimeout(() => {
          this.$scope.$apply();
        }, 100);

      }

    });
  }

  $onInit() {
    this.$http.get('http://s-api.triptoli.com/api/pois/23')
      .then(response => {
        this.pois = response.data;
        console.log("All Pois are  : ", this.pois);
      });
    if (localStorage.itinerary && JSON.parse(localStorage.itinerary).length > 0) {
      this.$scope.itinerary = JSON.parse(localStorage.itinerary);
      this.setItineraryMarkers(this.$scope.itinerary);
      this.drawLine();
      this.optimizeItineraryZoom();
    }
    localStorage.startLat = 26.8851417;
    localStorage.startLong = 75.6504706;

    if (!localStorage.day) {
      localStorage.day = 1;
      this.$scope.day = localStorage.day;
    }
    else {
      this.$scope.day = localStorage.day;
    }

  }

  addButton(poi) {
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
          var day = localStorage.day;
          model = this.loiti.getModelItem(id, "day" + day, placename, lati, longi, vlati, vlongi, reachtime, distance, minExploTime, maxExploTime, waitTime, categoryImg, "0", image);
          var itineraryData = JSON.parse(localStorage.itinerary);
          itineraryData.push(model);

          localStorage.itinerary = JSON.stringify(itineraryData);
          this.$scope.itinerary = itineraryData;
          this.$scope.$apply();
          this.setItineraryMarkers(itineraryData);
          this.drawLine();
          this.optimizeItineraryZoom();
        }
      });

    });

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

  // Removes the markers from the map, but keeps them in the array.
  clearItineraryMarkers(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
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

  previousDay() {
    console.log('previousDay()');
    var day = parseInt(localStorage.day)
    if (day == 1) {

    }
    else {
      day = day - 1;
      this.$scope.day = localStorage.day = day;

      var fullItinerary = JSON.parse(localStorage.itinerary);
      this.$scope.itinerary = this.$filter('filter')(fullItinerary, {day: 'day' + day});
      this.$scope.itinerary.unshift(fullItinerary[0]);
    }
  }

  nextDay() {
    console.log('NextDay()');
    var day = parseInt(localStorage.day)
    day = day + 1;
    this.$scope.day = localStorage.day = day;

    var fullItinerary = JSON.parse(localStorage.itinerary);
    this.$scope.itinerary = this.$filter('filter')(fullItinerary, {day: 'day' + day});
    this.$scope.itinerary.unshift(fullItinerary[0]);
  }

  deletePoi(poi, index) {
    if (index == 0) {
      alert("Can't Delete Start Point !");
    }
    else {


      console.log("Delete : ", index);
      var fullItinerary = JSON.parse(localStorage.itinerary);
      fullItinerary.splice(index, 1);
      console.log(fullItinerary);
      this.$scope.itinerary = fullItinerary;
      localStorage.itinerary = JSON.stringify(fullItinerary);
      this.clearItineraryMarkers(null);
      this.clearAllLine();
      this.setItineraryMarkers(fullItinerary)
      this.drawLine();
    }
  }

  recalculate(callback) {
    if (localStorage.itinerary) {
      var itinerarydata = JSON.parse(localStorage.itinerary);
      var i = 0;
      var j = 1;
      itinerarydata.forEach((ele) => {
        if (i != 0) {
          var from = new google.maps.LatLng(itinerarydata[i - 1].latitude, itinerarydata[i - 1].longitude);
          var to = new google.maps.LatLng(ele.latitude, ele.longitude);

          this.loiti.getTravelTime(from, to, (timedata) => {
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

            var model = this.loiti.getModelItem(itinerarydata[j].id, itinerarydata[j].day, itinerarydata[j].placename, itinerarydata[j].latitude, itinerarydata[j].longitude, itinerarydata[j].vlatitude, itinerarydata[j].vlongitude, newtime, distance, itinerarydata[j].minExploTime, itinerarydata[j].maxExploTime, itinerarydata[j].waitTime, itinerarydata[j].categoryImg, itinerarydata[j].visited, itinerarydata[j].image);

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

  saveItineraryDialog() {
    this.$scope.showSaveItnerary = true;
  }

  cancelSaveDialog() {
    this.$scope.showSaveItnerary = false;
  }

  saveItinerary(trip) {
    this.$http({
      method: 'POST',
      url: 'http://localhost:3000/api/user-itinerarys',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function (obj) {
        var str = [];
        for (var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      data: {user_id:'1',itinerary_name:trip.name,itinerary_date:this.$scope.dt,start_time:this.$scope.itinerary[0].time,latitude:localStorage.startLat,longitude:localStorage.startLong}

    }).success(function (data, status, headers, config) {
      // deferred.resolve(data);
      // this.$scope.showRegister=false;
      console.log("status ", status);
      console.log("DAta ", data);
      if (status == 200) {
        location.reload();
      }
      else {
        alert("Invalid Details");
      }
      console.log("done ", data);
    }).error(function (data, status) {
      // return deferred.reject(data);
      console.log("error ", status);
      alert("Invalid Details");
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
      controller: ItineraryPlanComponent,
      providers: [Itinerary]
    }
  )
  .name;

