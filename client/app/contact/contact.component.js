'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './contact.routes';

export class ContactComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('triptoliUiApp.contact', [ngRoute])
  .config(routes)
  .component('contact', {
    template: require('./contact.html'),
    controller: ContactComponent,
    controllerAs: 'contactCtrl'
  })
  .name;
