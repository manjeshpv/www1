'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/contact', {
      template: '<contact></contact>'
    });
}
