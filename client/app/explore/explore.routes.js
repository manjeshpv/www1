'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/explore', {
      template: '<explore></explore>'
    });
}
