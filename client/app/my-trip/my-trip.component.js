'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './my-trip.routes';

export class MyTripComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
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
