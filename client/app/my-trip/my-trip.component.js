'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './my-trip.routes';

export class MyTripComponent {
  /*@ngInject*/
  constructor($http,$scope,URLS,Session) {
    this.message = 'Hello';
    this.$http=$http;
    this.$scope=$scope;
    this.URLS=URLS;
    this.Session = Session;
  }
  $onInit() {
    this.$http.get(this.URLS.API+'/user-itinerarys')
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
