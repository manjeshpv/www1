'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Home',
    link: '/'
  }];
  $location;
  isCollapsed = true;

  constructor($location,$scope) {
    'ngInject';

    this.$location = $location;
    this.$scope=$scope;

  }

  isActive(route) {
    return route === this.$location.path();
  }

  register(){
if(this.$scope.showRegister)
{
  this.$scope.showRegister=false;
}
else {
  this.$scope.showRegister=true;
}
  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
