'use strict';

angular.module('hillromvestApp',
  [
  'LocalStorageModule',
   'tmh.dynamicLocale',
   'pascalprecht.translate',
   'ngResource',
   'ui.router',
   'ngCookies',
   'ngCacheBuster',
   'vcRecaptcha',
   'ngTagsInput',
   'angular-noty',
   'angular-loading-bar',
   'ui.mask',
   'validation.match',
   'ui.bootstrap',
   'oc.lazyLoad'
   ])
.run(['$rootScope', '$location', '$window', '$http', '$state', '$translate', 'Language', 'Auth', 'Principal', 'ENV', 'VERSION', function($rootScope, $location, $window, $http, $state, $translate, Language, Auth, Principal, ENV, VERSION) {
    $rootScope.ENV = ENV;
    $rootScope.VERSION = VERSION;
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;

      if (Principal.isIdentityResolved()) {
        Auth.authorize();
      }

      // Update the language
      Language.getCurrent().then(function(language) {
        $translate.use(language);
      });

    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      var titleKey = 'global.title';

      $rootScope.previousStateName = fromState.name;
      $rootScope.previousStateParams = fromParams;

      // Set the page title key to the one configured in state or use default one
      if (toState.data.pageTitle) {
        titleKey = toState.data.pageTitle;
      }

      $translate(titleKey).then(function(title) {
        // Change window title with translated one
        $window.document.title = title;
      });

    });

    $rootScope.back = function() {
      // If previous state is 'activate' or do not exist go to 'home'
      if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
        $state.go('home');
      } else {
        $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
      }
    };
  }])
  .factory('authInterceptor', ['$rootScope', '$q', '$location', 'localStorageService', function($rootScope, $q, $location, localStorageService) {
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        var token = localStorageService.get('token');

        if (token && token.expires && token.expires > new Date().getTime()) {
          config.headers['x-auth-token'] = token.token;
        }

        return config;
      }
    };
  }])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$translateProvider', 'tmhDynamicLocaleProvider', 'httpRequestInterceptorCacheBusterProvider','$ocLazyLoadProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider, httpRequestInterceptorCacheBusterProvider, $ocLazyLoadProvider) {

    //Cache everything except rest api requests
    httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);

    $urlRouterProvider.otherwise('/');
    $stateProvider.state('site', {
      'abstract': true,
      views: {
        'navbar@': {
          templateUrl: 'scripts/components/navbar/navbar.html'
        }
      },
      resolve: {
        authorize: ['Auth',
          function(Auth) {
            return Auth.authorize();
          }
        ],
        translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
          $translatePartialLoader.addPart('global');
          $translatePartialLoader.addPart('language');
        }]
      }
    });


    $httpProvider.interceptors.push('authInterceptor');

    // Initialize angular-translate
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: 'i18n/{lang}/{part}.json'
    });

    $translateProvider.preferredLanguage('en');
    $translateProvider.useCookieStorage();
    $translateProvider.useSanitizeValueStrategy('escaped');

    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
    tmhDynamicLocaleProvider.useCookieStorage();
    tmhDynamicLocaleProvider.storageKey('NG_TRANSLATE_LANG_KEY');


    //Create lazy load modules
    $ocLazyLoadProvider.config({
      modules: [{
        name: 'PatientGraphModule',
        files: ['scripts/modules/patient/graph/controller/graphs.controller.js']
      },{
        name: 'HCPGraphModule',
        files: ['scripts/modules/clinicadmin/graph/services/clinicadmin.service.js', 
                'scripts/modules/hcp/graph/controller/graphs.controller.js']
      },{
        name: 'PatientProfileModule',
        files: ['scripts/modules/patient/profile/controllers/patientprofile.controller.js']
      },{
        name: 'AdminProfileModule',
        files: ['scripts/modules/admin/profile/controller/admin-profile.controller.js']
      },
      {
        name: 'ClinicAdminProfileModule',
        files: ['scripts/modules/clinicadmin/graph/services/clinicadmin.service.js', 
                'scripts/modules/clinicadmin/profile/controllers/clinicadminprofile.controller.js']
      },
      {
        name: 'ClinicAdminPatientModule',
        files: ['scripts/modules/clinicadmin/graph/services/clinicadmin.service.js', 
                'scripts/modules/clinicadmin/patient/controllers/clinicadminpatient.controller.js']
      }]
    });
  }]);
