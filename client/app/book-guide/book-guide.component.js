'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');
import routes from './book-guide.routes';

export class BookGuideComponent {
  /*@ngInject*/
  constructor($scope) {
    this.message = 'Hello';
    $scope.mySlides = [
      'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg',
      'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg',
      'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg',
      'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'
    ]
  }

  onClick() {
    console.log("Clicked Me ");
  }
}

export default angular.module('triptoliUiApp.book-guide', [ngRoute])
  .config(routes)
  .component('bookGuide', {
    template: require('./book-guide.html'),
    controller: BookGuideComponent,
  })
  .name;
