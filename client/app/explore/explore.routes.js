'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/explore/:poiid', {
      template: '<explore></explore>'
    });
}
