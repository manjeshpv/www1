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

  constructor($location, $scope, $http, OAuth, OAuthToken, Auth, Session, URLS) {
    'ngInject';
    this.$http = $http;
    this.$location = $location;
    this.$scope = $scope;
    this.OAuth = OAuth;
    this.OAuthToken = OAuthToken;
    this.Auth = Auth;
    this.Session = Session;
    this.URLS = URLS;
    this.$scope.user = [];


    if(localStorage.userid) {
      $scope.showAccount = true;
      $scope.showLoginbtn = false;
      $scope.showRegisterbtn = false;
      $scope.showLogout = true;
    } else {
      $scope.showAccount = false;
      $scope.showLoginbtn = true;
      $scope.showRegisterbtn = true;
      $scope.showLogout = false;
    }
  }

  loginx(user) {
    var options = {};
    this.OAuth.getAccessToken(user, options).then(response => {
      this.OAuthToken.setToken(response.data);
      console.log(this.OAuthToken.getToken(), response);
      this.Auth.setSessionData().then(() => {
        location.href = '/';
        setTimeout(function () {
          location.reload();
        }, 100);
      });
    })
      .catch(err => {
        console.log('err', err);
        this.errorMessage = 'Server Errro';
      });
  }

  logout() {
    this.OAuthToken.removeToken()
    this.Session.destroy();
    location.href = '/';
  }

  isActive(route) {
    return route === this.$location.path();
  }

  showRegister() {
    if(this.$scope.showRegister) {
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

    this.$http({
      method: 'POST',
      url: this.URLS.API + '/users',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function (obj) {
        var str = [];
        for (var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      data: {name: user.name, email: user.email, mobile: user.mobile, password: user.password}

    }).then((data, status, headers, config) => {
      // deferred.resolve(data);
      this.$scope.showRegister = false;
      console.log("Register data is : ", data);
      localStorage.userid = data.id;
      // location.reload();

    }).catch((data, status) => {
      // return deferred.reject(data);
      alert("Problem with register try Again");
      console.log("error ", status);
    });

  }

  login(login) {
    this.$http({
      method: 'POST',
      url: this.URLS.API + '/users/login',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function (obj) {
        var str = [];
        for (var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      data: {username: login.email, password: login.password}

    }).success(function (data, status, headers, config) {
      // deferred.resolve(data);
      // this.$scope.showRegister=false;
      console.log("status ", status);
      console.log("DAta ", data);
      if (status == 200) {
        localStorage.userid = data;
        location.reload();
      }
      else {
        alert("Invalid User Details");
      }
      console.log("done ", data);
    }).error(function (data, status) {
      // return deferred.reject(data);
      console.log("error ", status);
      alert('Invalid User Details');
    });
  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
