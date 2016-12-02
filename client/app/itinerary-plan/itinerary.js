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

}
