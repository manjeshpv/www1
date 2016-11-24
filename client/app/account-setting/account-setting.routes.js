'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/account-setting', {
      template: '<account-setting></account-setting>'
    });
}
