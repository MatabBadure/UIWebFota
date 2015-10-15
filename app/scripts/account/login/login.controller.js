'use strict';

angular.module('hillromvestApp')
  .controller('LoginController',['$scope', '$state', '$timeout', 'Auth', 'vcRecaptchaService', 'globalConfig', '$rootScope', 'loginConstants', 'Principal', 'StorageService',
    function($scope, $state, $timeout, Auth, vcRecaptchaService, globalConfig, $rootScope, loginConstants, Principal, StorageService) {
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
      $scope.username = null;
      $scope.password = null;
      $scope.isLoaded = true;
    };

    $scope.navigateUser = function(){
      if(Principal.isAuthenticated()){
        $scope.userRole = StorageService.get('logged').role;
        if(!$scope.userRole){
          $scope.clearLastLogin(); 
          $state.go("home");
        }else if($scope.userRole === "ADMIN"){
          $state.go("patientUser");
        }else if($scope.userRole === "PATIENT"){
          $state.go("patientdashboard");
        }else if($scope.userRole === "CLINIC_ADMIN" || $scope.userRole === "CLINIC ADMIN"){
          $state.go("clinicadmindashboard");
        }else if($scope.userRole === "HCP"){
          $state.go("hcpdashboard");
        }
      }else{
        $scope.clearLastLogin();
      }
    }

    $scope.init = function() {
      $scope.navigateUser();      
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
          logged.role = response.data.user.authorities[0].name;
          logged.userEmail = response.data.user.email;
          $rootScope.isFooter = false;
          $rootScope.userRole = response.data.user.authorities[0].name;
          $rootScope.username = response.data.user.firstName;

          if(response.data.user.authorities[0].name === loginConstants.role.patient){
            logged.patientID = response.data.user.id;
            $state.go('patientdashboard');
          } else if(response.data.user.authorities[0].name === loginConstants.role.hcp){
            logged.userId = response.data.user.id;
            $state.go('hcpdashboard');
          } else if(response.data.user.authorities[0].name === 'CARE_GIVER'){
            localStorage.setItem('userId', response.data.user.id);
            $state.go('caregiverDashboard');
          } else if(response.data.user.authorities[0].name === 'CLINIC_ADMIN'){
            logged.userId = response.data.user.id;
            $state.go('clinicadmindashboard');
          } else{
            logged.userId = response.data.user.id;
            $state.go('patientUser');
          }
          StorageService.save('logged', logged);
        }
      }).catch(function(response) {
        if (response.status === 401) {
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
            StorageService.save('logged', logged);
            $scope.message = '';
            $scope.isFirstLogin = true;
            $scope.isEmailExist = false;
            $scope.showLogin = false;
          } else if (response.data.APP_CODE === 'PASSWORD_RESET') {
            var logged = StorageService.get('logged') || {};
            logged.token = response.data.token;
            StorageService.save('logged', logged);
            $scope.isFirstLogin = true;
            $scope.message = '';
            $scope.showLogin = false;
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
        return false;
      }
      event.preventDefault();

      if ($scope.user.password !== $scope.user.confirmPassword) {
        $scope.doNotMatch = true;
      } else {
        $scope.doNotMatch = false;
        Auth.submitPassword({
          'email': $scope.user.email,
          'password': $scope.user.password,
          'answer': $scope.user.answer,
          'questionId': $scope.user.question.id,
          'termsAndConditionsAccepted': $scope.user.tnc
        }).then(function(data) {
          Auth.logout();
          $scope.isFirstLogin = false;
          $scope.showLogin = true;
        }).catch(function(err) {
          Auth.logout();
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

    $scope.passwordStrength = function() {
      $scope.display_strength('passwordBox', 'passwordStrengthContainer', 'status');
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

    $scope.display_strength = function(x, y, z) {
      if (!x || $scope.div(x) === "") {
        $scope.div(y).style.width = 0 + "%";
        $scope.div(z).innerHTML = "&nbsp:";
        return false;
      }
      var paswd = $scope.div(x);
      var stren = $scope.div(y);
      var stats = $scope.div(z);
      var years = 0;

      var regex = [
        /^[a-zA-Z]+$/g,
        /^[a-zA-Z0-9]+$/g,
        /^[a-zA-Z0-9\ \~\!\@\#\$\%\^\&\*\(\)]+$/g,
      ];

      var count = [42, 52, 63, 74];
      var color = ["red", "gold", "lime", "darkgreen"];
      var value = ["weak", "Good", "Strong", "Very Strong"];
      var index = 0;

      for (index = 0; index < regex.length; index++) {
        if (index > regex.length) {
          break;
        }
        if (regex[index].test(paswd.value)) {
          break;
        } else {
          continue;
        }

      }

      years = $scope.compute_strength(count[index], (paswd.value).length);

      if (years >= 1000) {
        stren.style.width = "100%";
        stren.style.background = color[3];
        stats.innerHTML = value[3];
        stats.style.color = color[3];
      } else if (years >= 100 && years < 1000) {
        stren.style.width = "75%";
        stren.style.background = color[2];
        stats.innerHTML = value[2];
        stats.style.color = color[2];
      } else if (years >= 10 && years < 100) {
        stren.style.width = "50%";
        stren.style.background = color[1];
        stats.innerHTML = value[1];
        stats.style.color = color[1];
      } else {
        stren.style.width = "25%";
        stren.style.background = color[0];
        stats.innerHTML = value[0];
        stats.style.color = color[0];
      }
      return false;
    };
    $scope.init();
  }]);
