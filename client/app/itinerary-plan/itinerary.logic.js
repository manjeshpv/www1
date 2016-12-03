'use strict';
const angular = require('angular');
export class Itinerary {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.message = 'Hello';

  }

  calling(){
    console.log('Testing calling from other');
  }
  displayTime(currentTime) {
    var str = "";
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
      minutes = "0" + minutes
    }
    if (seconds < 10) {
      seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if (hours > 11) {
      str += "PM"
    } else {
      str += "AM"
    }
    return str;
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

}
