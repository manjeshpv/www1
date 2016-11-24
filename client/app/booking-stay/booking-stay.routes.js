'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/booking-stay', {
      template: '<booking-stay></booking-stay>'
    });
}
