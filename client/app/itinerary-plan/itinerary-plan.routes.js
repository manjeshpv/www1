'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/itinerary-plan', {
      template: '<itinerary-plan></itinerary-plan>'
    });
}
