'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './profile.routes';

export class ProfileComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('triptoliUiApp.profile', [ngRoute])
  .config(routes)
  .component('profile', {
    template: require('./profile.html'),
    controller: ProfileComponent,
    controllerAs: 'profileCtrl'
  })
  .name;
