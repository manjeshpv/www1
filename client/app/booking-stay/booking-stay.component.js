'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './booking-stay.routes';

export class BookingStayComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('triptoliUiApp.booking-stay', [ngRoute])
  .config(routes)
  .component('bookingStay', {
    template: require('./booking-stay.html'),
    controller: BookingStayComponent,
    controllerAs: 'bookingStayCtrl'
  })
  .name;
