'use strict';

angular.module('hillromvestApp',
  [
   'tmh.dynamicLocale',
   'pascalprecht.translate',
   'ngResource',
   'ui.router',
   'ngCookies',
   'ngCacheBuster',
   'vcRecaptcha',
   'ngTagsInput',
   'angularSpinner',
   'ngLoadingSpinner',
   'ui.mask',
   'validation.match',
   'ui.bootstrap',
   'ngSanitize',
   'ngAnimate',
   'toastr',
   'oc.lazyLoad',
   'ng.deviceDetector'
   ])
.run(['$rootScope', '$location', '$window', '$http', '$state', '$translate', 'Language', 'Auth', 'Principal', 'ENV', 'VERSION', function($rootScope, $location, $window, $http, $state, $translate, Language, Auth, Principal, ENV, VERSION) {
    $rootScope.ENV = ENV;
    $rootScope.VERSION = VERSION;
    $rootScope.versionNumber = Math.floor((Math.random()*6)+1);
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      if($state.current.name === "patientSurvey"){ 
        $rootScope.showSurveyCancelModal = true;       
        if(!$rootScope.isSurveyCancelled){          
          event.preventDefault();
        } else{
          $rootScope.showSurveyCancelModal = false;
        }       
      }else{
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;

        if (Principal.isIdentityResolved()) {
          Auth.authorize();
        }

        // Update the language
        Language.getCurrent().then(function(language) {
          $translate.use(language);
        });
      }
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
  .factory('authInterceptor', ['$rootScope', '$q', '$location', 'StorageService', function($rootScope, $q, $location, StorageService) {
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        var token = null;
        if(StorageService.get('logged')){
          token = StorageService.get('logged').token;
        }
        if (token && token.expires && token.expires > new Date().getTime()) {
          config.headers['x-auth-token'] = token.token;
        }
        return config;
      }
    };
  }])

  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$translateProvider', 'tmhDynamicLocaleProvider', 'httpRequestInterceptorCacheBusterProvider','$ocLazyLoadProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider, httpRequestInterceptorCacheBusterProvider, $ocLazyLoadProvider) {

    //Cache everything except rest api requests
    httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/, /.*.json.*/, /.*tims.*/, /.*index.html.*/, /.*navbar.html.*/, /.*patient-details.html.*/, /.*clinicadminpatientnavbar.html.*/], true);

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
        files: ['scripts/modules/patient/graph/controller/graphs.controller.js',
                'scripts/third_party_library/angular.easypiechart.js',
                'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
                'bower_components/canvg-gabelerner/rgbcolor.js',
                'bower_components/isteven-angular-multiselect/isteven-multi-select.js',
                'bower_components/canvg-gabelerner/StackBlur.js',
                'bower_components/canvg-gabelerner/canvg.js',  
                'https://code.highcharts.com/5.0.6/highcharts.js'
                ]
      },{
        name: 'HCPGraphModule',
        files: ['scripts/modules/clinicadmin/graph/services/clinicadmin.service.js', 
                'scripts/modules/hcp/graph/controller/graphs.controller.js',
                'scripts/third_party_library/angular.easypiechart.js',
                'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
                'bower_components/canvg-gabelerner/rgbcolor.js',
                'bower_components/canvg-gabelerner/StackBlur.js',
                'bower_components/canvg-gabelerner/canvg.js',  
                'https://code.highcharts.com/5.0.6/highcharts.js'
                ]
      },{
        name: 'PatientProfileModule',
        files: ['scripts/modules/patient/profile/controllers/patientprofile.controller.js',
                'bower_components/isteven-angular-multiselect/isteven-multi-select.js']
      },{
        name: 'AdminProfileModule',
        files: ['scripts/modules/admin/profile/controller/admin-profile.controller.js',
                'scripts/modules/admin/profile/controller/chargercontroller.js',
                'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
                'scripts/modules/tims/controller/tims.controller.js']
      },
      {
        name: 'FOTAAdminProfileModule',
        files: ['scripts/modules/admin/profile/controller/admin-profile.controller.js',
                'scripts/modules/admin/profile/controller/chargercontroller.js',
                'scripts/modules/FOTA/FotaHome/controllers/fota.controller.js',
                ]
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
      },
      {
        name: 'LoginAnalyticsModule',
        files: ['scripts/modules/common/console/loginanalytics/controllers/loginanalytics.controller.js',                
                'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
                'bower_components/canvg-gabelerner/rgbcolor.js',
                'bower_components/canvg-gabelerner/StackBlur.js',
                'bower_components/canvg-gabelerner/canvg.js',            
                'https://code.highcharts.com/5.0.6/highcharts.js']
      },
      {
        name: 'surveyModule',
        files:[
          'bower_components/canvg-gabelerner/rgbcolor.js',
          'bower_components/canvg-gabelerner/StackBlur.js',
          'bower_components/canvg-gabelerner/canvg.js',
          'https://code.highcharts.com/5.0.6/highcharts.js',
          'bower_components/angular-daterangepicker/js/angular-daterangepicker.js'
          ]
      },
      {
        name: 'BenchmarkingModule',
        files:[
          'bower_components/canvg-gabelerner/rgbcolor.js',
          'bower_components/canvg-gabelerner/StackBlur.js',
          'bower_components/canvg-gabelerner/canvg.js',
          'bower_components/isteven-angular-multiselect/isteven-multi-select.js',
          'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
          'https://code.highcharts.com/5.0.6/highcharts.js'
        ]
      },{
        name: 'PatientBenchmarkingModule',
        files:[
          'bower_components/canvg-gabelerner/rgbcolor.js',
          'bower_components/canvg-gabelerner/StackBlur.js',
          'bower_components/canvg-gabelerner/canvg.js',
          'bower_components/isteven-angular-multiselect/isteven-multi-select.js',
          'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
          'https://code.highcharts.com/5.0.6/highcharts.js'
        ]
      },{
        name: 'HCPCABenchmarkingModule',
        files:[
          'bower_components/canvg-gabelerner/rgbcolor.js',
          'bower_components/canvg-gabelerner/StackBlur.js',
          'bower_components/canvg-gabelerner/canvg.js',
          'bower_components/isteven-angular-multiselect/isteven-multi-select.js',
          'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
          'https://code.highcharts.com/5.0.6/highcharts.js'
        ]
      },{
        name: 'PatientDiagnosticModule',
        files:[          
          'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
          'bower_components/isteven-angular-multiselect/isteven-multi-select.js'
        ]
      },
      {
        name: 'MessagesModule',
        files:[          
          'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
          'scripts/modules/patient/graph/controller/graphs.controller.js',
          'scripts/modules/common/messagesMain/controller/messagecontroller.js',
          'scripts/modules/common/messagesMain/services/message.service.js',
                'scripts/third_party_library/angular.easypiechart.js',
                'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
                'bower_components/canvg-gabelerner/rgbcolor.js',
                'bower_components/isteven-angular-multiselect/isteven-multi-select.js',
                'bower_components/canvg-gabelerner/StackBlur.js',
                'bower_components/canvg-gabelerner/canvg.js',  
                'https://code.highcharts.com/5.0.6/highcharts.js'
        ]
      }]
    });
  }])
  .config(['toastrConfig', function(toastrConfig) {
  angular.extend(toastrConfig, {
    autoDismiss: false,
    containerId: 'toast-container',
    maxOpened: 0,
    newestOnTop: true,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    preventOpenDuplicates: true,
    target: 'body',
    closeButton: true,
    progressBar:true
  });
}]);
