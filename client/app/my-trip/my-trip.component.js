'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './my-trip.routes';

export class MyTripComponent {
  /*@ngInject*/
  constructor($http,$scope) {
    this.message = 'Hello';
    this.$http=$http;
    this.$scope=$scope;
  }
  $onInit() {
    this.$http.get('http://localhost:3000/api/user-itinerarys')
      .then(response => {
        this.$scope.trips = response.data;
        console.log("All Trips are  : ", this.$scope.trips);
      });
  }
}

export default angular.module('triptoliUiApp.my-trip', [ngRoute])
  .config(routes)
  .component('myTrip', {
    template: require('./my-trip.html'),
    controller: MyTripComponent,
    controllerAs: 'myTripCtrl'
  })
  .name;
