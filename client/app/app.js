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
import  'angular-oauth2';

import './app.css';

angular.module('triptoliUiApp', [ngCookies, ngResource, ngSanitize,
  ngRoute, uiBootstrap, 'angular-oauth2',
  navbar, footer, main, explore, itineraryPlan, bookGuide, accountSetting, myTrip,
  bookingStay, profileComponent, contact, constants, util
])
  .constant('APP_CONFIG', {
    baseApiUrl: 'http://localhost:3000/api'
    //baseApiUrl: "http://s-api.triptoli.com/api/"
  })
  .constant('URLS', {
    API: 'http://localhost:3000/api',
    OAUTH: 'http://localhost:3000',
    //baseApiUrl: "http://s-api.triptoli.com/api/"
  })
  .config(routeConfig)
  .config(function(OAuthTokenProvider, OAuthProvider, URLS) {
    OAuthTokenProvider.configure({
      name: 'token',
      options: {
        secure: false,
        path: '/'
      }
    });

    OAuthProvider.configure({
      baseUrl: URLS.OAUTH,
      clientId: 'sapi',
      clientSecret: 'sapisecret', // optional
      grantPath: '/oauth/token',
    });

  })
  .run(function($rootScope, $window, OAuth) {
    $rootScope.$on('$stateChangeStart', function handleStateChange(event, next) {
      //if (!OAuth.isAuthenticated() && (next.name !== 'login')) {
      //  event.preventDefault();
      //  $state.go('login')
      //  //$window.location.href = URLS.OAUTH;
      //  //$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      //}
      if(!OAuth.isAuthenticated() && ['login', 'main'].indexOf(next.name) === -1) {
        event.preventDefault();
        location.href = '/#/login';
        //$state.go('dashboard');
      }

      if(OAuth.isAuthenticated() && ['login'].indexOf(next.name) !== -1) {
        event.preventDefault();
        $window.location.href = '/#/dashboard';
        //$state.go('dashboard');
      }
    });
  })
  .factory('Auth', ($log, $http, $q, Session, URLS) => {
    const authService = {};

    authService.setSessionData = function gInfo() {
      return $q.all([
        $http
          .get(URLS.API + '/me')
          .then(function userinfoSuccess(response) {
            return Session.create('user', response.data);
          })
      ]);
    };

    return authService;
  })
  .factory('Session', [
    '$window',
    function Session($window) {
      const sessionService = {};

      sessionService.create = function create(key, value) {
        $window.localStorage[key] = angular.toJson(value);
      };

      sessionService.read = function read(key) {
        return angular.fromJson($window.localStorage[key]);
      };

      sessionService.destroy = function destroy() {
        $window.localStorage.clear();
      };

      sessionService.isAuthenticated = function isAuthenticated() {
        return !!(sessionService.read('oauth') && sessionService.read('oauth').access_token);
      };

      sessionService.getAccessToken = function getAccessToken() {
        return sessionService.read('oauth') && sessionService.read('oauth').access_token;
      };

      sessionService.isAuthorized = function isAuthorized(authorizedRoles) {
        let roles = authorizedRoles;
        if (!angular.isArray(roles)) {
          roles = [].push(roles);
        }

        return (sessionService.isAuthenticated() && ~roles.indexOf(sessionService.userRole));
      };

      return sessionService;
    },
  ])
  .directive('flexSlider', [
    '$parse', '$timeout', function ($parse, $timeout) {
      return {
        restrict: 'AE',
        scope: false,
        replace: true,
        transclude: true,
        template: '<div class="flexslider-container"></div>',
        compile: function(element, attr, linker) {
          return function($scope, $element) {
            var addSlide, collectionString, flexsliderDiv, getTrackFromItem, indexString, match,
              removeSlide, slidesItems, trackBy;
            match = (attr.slide || attr.flexSlide)
              .match(/^\s*(.+)\s+in\s+(.*?)(?:\s+track\s+by\s+(.+?))?\s*$/);
            indexString = match[1];
            collectionString = match[2];
            trackBy = angular.isDefined(match[3]) ? $parse(match[3]) : $parse("" + indexString);
            flexsliderDiv = null;
            slidesItems = {};
            getTrackFromItem = function (collectionItem, index) {
              var locals;
              locals = {};
              locals[indexString] = collectionItem;
              locals['$index'] = index;
              return trackBy($scope, locals);
            };
            addSlide = function (collectionItem, index, callback) {
              var childScope, track;
              track = getTrackFromItem(collectionItem, index);
              if (slidesItems[track] != null) {
                throw "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys.";
              }
              childScope = $scope.$new();
              childScope[indexString] = collectionItem;
              childScope['$index'] = index;
              return linker(childScope, function (clone) {
                var slideItem;
                slideItem = {
                  collectionItem: collectionItem,
                  childScope: childScope,
                  element: clone
                };
                slidesItems[track] = slideItem;
                return typeof callback === "function" ? callback(slideItem) : void 0;
              });
            };
            removeSlide = function (collectionItem, index) {
              var slideItem, track;
              track = getTrackFromItem(collectionItem, index);
              slideItem = slidesItems[track];
              if (slideItem == null) {
                return;
              }
              delete slidesItems[track];
              slideItem.childScope.$destroy();
              return slideItem;
            };
            return $scope.$watchCollection(collectionString, function (collection, oldCollection) {
              var attrKey, attrVal, c, currentSlidesLength, e, i, idx, n, options, slider, slides, t, toAdd, toRemove, trackCollection, _i, _j, _k, _l, _len, _len1, _len2, _len3;
              if (!((collection != null ? collection.length : void 0) || (oldCollection != null ? oldCollection.length : void 0))) {
                return;
              }
              if (flexsliderDiv != null) {
                slider = flexsliderDiv.data('flexslider');
                currentSlidesLength = Object.keys(slidesItems).length;
                if (collection == null) {
                  collection = [];
                }
                trackCollection = {};
                for (i = _i = 0, _len = collection.length; _i < _len; i = ++_i) {
                  c = collection[i];
                  trackCollection[getTrackFromItem(c, i)] = c;
                }
                toAdd = (function () {
                  var _j, _len1, _results;
                  _results = [];
                  for (i = _j = 0, _len1 = collection.length; _j < _len1; i = ++_j) {
                    c = collection[i];
                    if (slidesItems[getTrackFromItem(c, i)] == null) {
                      _results.push({
                        value: c,
                        index: i
                      });
                    }
                  }
                  return _results;
                })();
                toRemove = (function () {
                  var _results;
                  _results = [];
                  for (t in slidesItems) {
                    i = slidesItems[t];
                    if (trackCollection[t] == null) {
                      _results.push(i.collectionItem);
                    }
                  }
                  return _results;
                })();
                if ((toAdd.length === 1 && toRemove.length === 0) || toAdd.length === 0) {
                  for (_j = 0, _len1 = toRemove.length; _j < _len1; _j++) {
                    e = toRemove[_j];
                    e = removeSlide(e, collection.indexOf(e));
                    if (e) {
                      slider.removeSlide(e.element);
                    }
                  }
                  for (_k = 0, _len2 = toAdd.length; _k < _len2; _k++) {
                    e = toAdd[_k];
                    idx = e.index;
                    addSlide(e.value, idx, function (item) {
                      if (idx === currentSlidesLength) {
                        idx = void 0;
                      }
                      return $scope.$evalAsync(function () {
                        return slider.addSlide(item.element, idx);
                      });
                    });
                  }
                  return;
                }
              }
              slidesItems = {};
              if (flexsliderDiv != null) {
                flexsliderDiv.remove();
              }
              slides = angular.element('<ul class="slides"></ul>');
              flexsliderDiv = $('<div class="flexslider"></div>');
              flexsliderDiv.append(slides);
              $element.append(flexsliderDiv);
              for (i = _l = 0, _len3 = collection.length; _l < _len3; i = ++_l) {
                c = collection[i];
                addSlide(c, i, function (item) {
                  return slides.append(item.element);
                });
              }
              options = {};
              for (attrKey in attr) {
                attrVal = attr[attrKey];
                if (attrKey.indexOf('$') === 0) {
                  continue;
                }
                if (!isNaN(n = parseInt(attrVal))) {
                  options[attrKey] = n;
                  continue;
                }
                if (attrVal === 'false' || attrVal === 'true') {
                  options[attrKey] = attrVal === 'true';
                  continue;
                }
                if (attrKey === 'start' || attrKey === 'before' || attrKey === 'after' || attrKey === 'end' || attrKey === 'added' || attrKey === 'removed') {
                  options[attrKey] = (function (attrVal) {
                    var f;
                    f = $parse(attrVal);
                    return function (slider) {
                      return $scope.$apply(function () {
                        return f($scope, {
                          '$slider': {
                            element: slider
                          }
                        });
                      });
                    };
                  })(attrVal);
                  continue;
                }
                if (attrKey === 'startAt') {
                  options[attrKey] = $parse(attrVal)($scope);
                  continue;
                }
                options[attrKey] = attrVal;
              }
              if (!options.sliderId && attr.id) {
                options.sliderId = "" + attr.id + "-slider";
              }
              if (options.sliderId) {
                flexsliderDiv.attr('id', options.sliderId);
              }
              return $timeout((function () {
                return flexsliderDiv.flexslider(options);
              }), 0);
            });
          };
        }
      };
    }
  ]);


angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['triptoliUiApp'], {
      strictDi: false
    });
  });


