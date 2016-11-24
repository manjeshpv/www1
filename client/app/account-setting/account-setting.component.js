'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './account-setting.routes';

export class AccountSettingComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('triptoliUiApp.account-setting', [ngRoute])
  .config(routes)
  .component('accountSetting', {
    template: require('./account-setting.html'),
    controller: AccountSettingComponent,
    controllerAs: 'accountSettingCtrl'
  })
  .name;
