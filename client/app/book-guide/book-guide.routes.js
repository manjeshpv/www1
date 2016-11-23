'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/book-guide', {
      template: '<book-guide></book-guide>'
    });
}
