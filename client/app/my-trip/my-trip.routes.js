'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/my-trip', {
      template: '<my-trip></my-trip>'
    });
}
