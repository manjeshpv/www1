'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

const ngRoute = require('angular-route');

import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';


import {
  routeConfig
} from './app.config';

import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import explore from './explore/explore.component';
import itineraryPlan from './itinerary-plan/itinerary-plan.component';
import bookGuide from './book-guide/book-guide.component';
import accountSetting from './account-setting/account-setting.component';
import myTrip from './my-trip/my-trip.component';
import bookingStay from './booking-stay/booking-stay.component';
import profileComponent from './profile/profile.component';
import contact from './contact/contact.component';
import constants from './app.constants';
import util from '../components/util/util.module';


import './app.css';

var myapp=angular.module('triptoliUiApp', [ngCookies, ngResource, ngSanitize, ngRoute, uiBootstrap, navbar,
  footer, main,explore,itineraryPlan,bookGuide,accountSetting,myTrip,bookingStay,profileComponent,contact, constants, util
])
  .config(routeConfig);

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['triptoliUiApp'], {
      strictDi: true
    });
  });

myapp.directive('flexslider', function () {

  return {
    link: function (scope, element, attrs) {

      element.flexslider({
        animation: "slide"
      });
    }
  }
});

myapp.directive('flexcaroslider', function () {

  return {
    link: function (scope, element, attrs) {

      element.flexslider({
        animation: "slide",
        animationLoop: false,
        itemWidth: 210,
        itemMargin: 5,
        minItems: 1,
        maxItems: 2
      });
    }
  }
});
