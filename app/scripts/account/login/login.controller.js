'use strict';

angular.module('hillromvestApp')
  .controller('LoginController',['$scope','$state','deviceDetector', '$timeout', 'Auth', 'vcRecaptchaService', 'globalConfig', '$rootScope', 'loginConstants', 'Principal', 'StorageService', 'patientsurveyService', 'Account',
    function($scope, $state,deviceDetector, $timeout, Auth, vcRecaptchaService, globalConfig, $rootScope, loginConstants, Principal, StorageService, patientsurveyService, Account) {
    $scope.showLogin = true;
    $scope.isEmailExist = true;
    $scope.isFirstLogin = false;
    $scope.showCaptcha = false;
    $scope.response = null;
    $scope.widgetId = null;
    $scope.user = {};
    $scope.errors = {};
    $scope.questions = [];
    $scope.authenticationError = false;
    $scope.siteKey = globalConfig.siteKey;
    $scope.loginSubmitted = false;
    $scope.submitted = false;
    $scope.firstTimeAccessFailed = false;
    $scope.otherError = false;
    $scope.message = "";
    $scope.showSubmit = true;
	$scope.isBrowserCompatible= false;
	
	$scope.chechBrowserCompatibility = function() {
    
      if ((deviceDetector.browser == 'chrome' && deviceDetector.browser_version <'38' ) || (deviceDetector.browser == 'ie' && deviceDetector.browser_version < 11 ) || (deviceDetector.browser == 'firefox' && deviceDetector.browser_version < '38' )  || (deviceDetector.browser == 'safari' && deviceDetector.browser_version < '7' ) || (deviceDetector.browser == 'opera')){
        $scope.isBrowserCompatible= true;
          }
    else  {
      $scope.isBrowserCompatible = false;
          } 
    };

    $scope.setResponse = function(response) {
      $scope.response = response;
    };

    $scope.setWidgetId = function(widgetId) {
      $scope.widgetId = widgetId;
    };

    $scope.submitConfirmForm = function() {
      $scope.submitted = true;
    };

    $scope.clearLastLogin = function(){
      Auth.logout();
      StorageService.clearAll();
      $scope.isAuthenticated = false;
      $rootScope.username = null;
      $rootScope.userFullName = null;
      $rootScope.userLastName = null;
      $scope.password = null;
      $scope.isLoaded = true;
      $scope.submitted = false;
    };

    $scope.navigateUser = function(){       
      if(Principal.isAuthenticated()){
        $rootScope.userRole = StorageService.get('logged').role;
        if(!$rootScope.userRole){
          $scope.clearLastLogin(); 
          $state.go("home");
        }else if($rootScope.userRole === "ADMIN"){
          $state.go("patientUser");
        }else if($rootScope.userRole === "PATIENT"){
          $state.go("patientdashboard");
        }else if($rootScope.userRole === "CLINIC_ADMIN" || $rootScope.userRole === "CLINIC ADMIN"){
          $state.go("clinicadmindashboard");
        }else if($rootScope.userRole === "HCP"){
          $state.go("hcpdashboard");
        }else if($rootScope.userRole === loginConstants.role.acctservices){
          $state.go("rcadminPatients");
        }else if($rootScope.userRole === loginConstants.role.associates){
          $state.go("associatePatientUser");
        }
        else if($rootScope.userRole === loginConstants.role.customerservices){
          $state.go("customerservicePatientUser");
        }
      }else{        
          $scope.clearLastLogin();
      }
    };

    $scope.resetForActivateUser = function(){
      $scope.isAuthenticated = false;
      $rootScope.username = null;
      $rootScope.userFullName = null;
      $rootScope.userLastName = null;
      $scope.password = null;
      $scope.isLoaded = true;
      $scope.message = '';
      $scope.isFirstLogin = true;
      $scope.isEmailExist = (StorageService.get('logged') && StorageService.get('logged').activateEmail) ? true : false;
      $scope.showLogin = false;
    };

    $scope.init = function() {
      var currentRoute = $state.current.name;
	  $scope.chechBrowserCompatibility();
      if(currentRoute === "activateUser"){
        if(StorageService.get('logged') && StorageService.get('logged').token && StorageService.get('logged').isActivate){
          $scope.resetForActivateUser();  
        }else{
          $state.go("activate");
        }        
      }else{
        if(currentRoute === "postActivateLogin"){
          $scope.isLoaded = true;
          $scope.showLogin = true;        
          $scope.username = '';
          $rootScope.userRole = false;
        }else{
          $scope.navigateUser();  
        }
      }  
    };

    Auth.getSecurityQuestions().then(function(response) {
      $scope.questions = response.data;
    }).catch(function(err) {
      $scope.questionsNotLoaded = true;
    });

    $scope.authenticate = function() {
      $scope.authenticationError = false;
      Auth.login({
        username: $scope.username,
        password: $scope.password,
        captcha: $scope.user.captcha
      }).then(function(response) {
        if (response.status === 200) { 
          var logged = StorageService.get('logged') || {};
          StorageService.remove('loginCount');
          logged.userFirstName = response.data.user.firstName;
          logged.userFullName = response.data.user.lastName+' '+response.data.user.firstName;
          logged.userLastName = response.data.user.lastName;
          logged.role = response.data.user.authorities[0].name;
          logged.userEmail = response.data.user.email;
          $rootScope.isFooter = false;
          $rootScope.userRole = response.data.user.authorities[0].name;
          $rootScope.username = response.data.user.firstName;
          $rootScope.userFullName = response.data.user.lastName + ' ' +response.data.user.firstName;
          $rootScope.userLastName = response.data.user.lastName;
          $rootScope.userEmail = response.data.user.email;
          
          if(response.data.user.authorities[0].name === loginConstants.role.patient){
          Account.get().$promise
          .then(function (account) {
            if(account.data.deviceType == 'ALL'){
          localStorage.setItem('deviceType', 'VEST');
          localStorage.setItem('deviceTypeforGraph', 'ALL');
          localStorage.setItem('deviceTypeforBothIcon', 'ALL');
            }
            else{
            localStorage.setItem('deviceType', account.data.deviceType);
            localStorage.setItem('deviceTypeforGraph', account.data.deviceType);
            localStorage.setItem('deviceTypeforBothIcon', account.data.deviceType);
          }
           });
            logged.patientID = response.data.user.id;
            patientsurveyService.isSurvey(response.data.user.id).then(function(response) {
              $rootScope.surveyId = response.data.id;
              $state.go('patientdashboard');
            });
          } else if(response.data.user.authorities[0].name === loginConstants.role.hcp){
            logged.userId = response.data.user.id;
            $state.go('hcpdashboard');
          } else if(response.data.user.authorities[0].name === 'CARE_GIVER'){
            logged.userId = response.data.user.id;
            $state.go('caregiverDashboard');
          } else if(response.data.user.authorities[0].name === 'CLINIC_ADMIN'){
            logged.userId = response.data.user.id;
            $state.go('clinicadmindashboard');
          } else if(response.data.user.authorities[0].name === loginConstants.role.acctservices){
            logged.userId = response.data.user.id;
            $state.go('rcadminPatients');
          } else if(response.data.user.authorities[0].name === loginConstants.role.associates){
            logged.userId = response.data.user.id;
            $state.go('associatePatientUser');
          } 
          else if(response.data.user.authorities[0].name === loginConstants.role.customerservices){
            logged.userId = response.data.user.id;
            $state.go('customerservicePatientUser');
          // $state.go('fotaHome');
          }
          else if(response.data.user.authorities[0].name === loginConstants.role.FOTAAdmin || response.data.user.authorities[0].name === loginConstants.role.FOTAApprover){
              logged.userId = response.data.user.id;
            $state.go('fotaHome');
          }
          else{
            logged.userId = response.data.user.id;
            $state.go('patientUser');
          }
          StorageService.save('logged', logged);
        }
      }).catch(function(response) {
        if (response.status === 401) {
          $scope.response = null;
          if (!response.data.APP_CODE) {
            $scope.message = response.data.Error;
            $scope.authenticationError = true;
            var loginCount = parseInt(StorageService.get('loginCount')) || 0;
            StorageService.save('loginCount', loginCount + 1);
            if (loginCount > 1) {
              vcRecaptchaService.reload();
              $scope.showCaptcha = true;
            }
          } else if (response.data.APP_CODE === 'EMAIL_PASSWORD_RESET') {
            var logged = StorageService.get('logged') || {};
            logged.token = response.data.token;
            logged.activateEmail = null;
            logged.isActivate = true;
            StorageService.save('logged', logged);
            $state.go("activateUser");            
          } else if (response.data.APP_CODE === 'PASSWORD_RESET') {
            var logged = StorageService.get('logged') || {};
            logged.token = response.data.token;
            logged.userEmail = null;
            logged.isActivate = true;  
            logged.activateEmail = true;          
            StorageService.save('logged', logged);
            $state.go("activateUser");     
          } else {
            $scope.otherError = true;
          }
        } else {
          $scope.authenticationError = true;
          $scope.message = "Authentication failed! Please check your credentials and try again."
        }
      });
    };

    $scope.submitPassword = function(event) {   
      if ($scope.confirmForm.$invalid) {
        $scope.showSubmit = true;
        return false;
      }
      event.preventDefault();

      if ($scope.user.password !== $scope.user.confirmPassword) {
        $scope.doNotMatch = true;
      } else {
        $scope.showSubmit = false;
        $scope.doNotMatch = false;
        Auth.submitPassword({
          'email': $scope.user.email,
          'password': $scope.user.password,
          'answer': $scope.user.answer,
          'questionId': $scope.user.question.id,
          'termsAndConditionsAccepted': $scope.user.tnc
        }).then(function(data) {          
          $scope.user.email = null;
          $scope.username = null;
          $scope.clearLastLogin();
          $scope.isFirstLogin = false;
          $scope.showLogin = true;  
          $state.go("postActivateLogin");
        }).catch(function(err) {
          $scope.showSubmit = true;
          if(err.data && err.data.ERROR){
            $scope.message = err.data.ERROR;
          }
          $scope.firstTimeAccessFailed = true;          
        });
      }
    };

    $timeout(function() {
      angular.element('[ng-model="username"]').focus();
    });

    $scope.login = function(event) {
      $scope.loginSubmitted = true;
      if ($scope.form.username.$invalid || $scope.form.username.$invalid || ($scope.showCaptcha && $scope.response === null)) {
        return false;
      }
      event.preventDefault();
      if ($scope.showCaptcha) {
        Auth.captcha($scope.response).then(function(data) {
          $scope.showCaptcha = false;
          $scope.captchaError = false;
          $scope.authenticate();
        }).catch(function(err) {
          $scope.captchaError = true;
          $scope.response = null;
          vcRecaptchaService.reload($scope.widgetId);
        });
      } else {
        $scope.authenticate();
      }
    };

    $scope.div = function(x) {
      return document.getElementById(x);
    };

    $scope.compute_strength = function(x, y) {
      if (!x) {
        return -1;
      }
      var secondsInAYear = 31557600;
      var permutateRepeat = (Math.pow(x, y) - (x * $scope.factorial(y) - 1));
      var countManyYears = Math.floor(permutateRepeat / (1000000 * secondsInAYear));

      return countManyYears;
    };

    $scope.factorial = function(x) {
      if (x < 0) {
        return false;
      }

      if (x == 0) {
        return 1;
      }

      x = Math.floor(x);
      return (x * $scope.factorial(x - 1));
    };

    $scope.init();
  }]);
