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

  constructor($location, $scope, $http) {
    'ngInject';
    this.$http = $http;
    this.$location = $location;
    this.$scope = $scope;
    this.$scope.user = [];
  }

  isActive(route) {
    return route === this.$location.path();
  }

  showRegister() {
    if (this.$scope.showRegister) {
      this.$scope.showRegister = false;
    }
    else {
      this.$scope.showLogin = false;
      this.$scope.showRegister = true;
    }
  }

  showLogin() {
    if (this.$scope.showLogin) {
      this.$scope.showLogin = false;
    }
    else {
      this.$scope.showRegister = false;
      this.$scope.showLogin = true;
    }
  }

  register(user) {
    console.log("User Details is : ", user)

    this.$http({
      method: 'POST',
      url: 'http://localhost:3000/api/triptoli-users',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function (obj) {
        var str = [];
        for (var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      data: {name: user.name, email: user.email, mobile: user.mobile, password: user.password}

    }).success(function (data, status, headers, config) {
      // deferred.resolve(data);
      // this.$scope.showRegister=false;
      console.log("done ", data);
    }).error(function (data, status) {
      // return deferred.reject(data);
      console.log("error ", status);
    });

  }

  login(login) {
    console.log("Login details is : ", login);
  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
