'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './book-guide.routes';

export class BookGuideComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('triptoliUiApp.book-guide', [ngRoute])
  .config(routes)
  .component('bookGuide', {
    template: require('./book-guide.html'),
    controller: BookGuideComponent,
    controllerAs: 'bookGuideCtrl'
  })
  .name;
