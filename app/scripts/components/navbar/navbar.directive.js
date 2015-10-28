'use strict';

angular.module('hillromvestApp')
.directive('activeMenu',['$translate', 'tmhDynamicLocale', function($translate, tmhDynamicLocale) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var language = attrs.activeMenu;

      scope.$watch(function() {
        return $translate.use();
      }, function(selectedLanguage) {
        if (language === selectedLanguage) {
          tmhDynamicLocale.set(language);
          element.addClass('active');
        } else {
          element.removeClass('active');
        }
      });
    }
  };
}]);

angular.module('hillromvestApp')
.directive('navigationBar', ['Auth', '$state', 'Account', '$location', '$stateParams', '$rootScope','loginConstants',
 function (Auth, $state, Account, $location,$stateParams, $rootScope,loginConstants) {
  return {
    templateUrl: 'scripts/components/navbar/navbar.html',
    restrict: 'E',

    controller: ['$scope', '$state', 'StorageService', function ($scope, $state, StorageService) {

      $scope.userRole = null;
      $scope.username = null;
      if(StorageService.get('logged')){
        $scope.userRole = StorageService.get('logged').role;
        $scope.username = StorageService.get('logged').userFirstName;  
      }
      $scope.isActive = function(tab) {
        var path = $location.path();
        if (path.indexOf(tab) !== -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.signOut = function(){
        Account.get().$promise
        .then(function (account) {
          $scope.isAuthenticated = true;

        })
        .catch(function() {
          $scope.isAuthenticated = false;
          $scope.username = null;
          $state.go('login');
        });
      };

      $scope.logout = function(){
        Auth.signOut().then(function(data) {
          Auth.logout();
          StorageService.clearAll();
          $scope.signOut();
        }).catch(function(err) {
        });
      };

      $scope.account = function(){ 
        if($scope.userRole === "ADMIN"){
          $state.go('adminProfile');
        }else if($scope.userRole === "PATIENT"){
          $state.go("patientResetPassword");
        } else if($scope.userRole === 'HCP'){
          $state.go('hcpDashboardProfile');
        }
      };

      $scope.goToHomePage = function(){
        if(!$scope.userRole){
          $state.go("home");
        }else if($scope.userRole === "ADMIN"){
          $state.go("patientUser");
        }else if($scope.userRole === "PATIENT"){
          $state.go("patientdashboard");
        }else if($scope.userRole === "CLINIC_ADMIN" || $scope.userRole === "CLINIC ADMIN"){
          $state.go("clinicadmindashboard");
        }else if($scope.userRole === "HCP"){
          $state.go("hcpdashboard");
        }else if($scope.userRole === "CARE_GIVER"){
          $state.go("caregiverDashboard");
        }else if($scope.userRole === loginConstants.role.acctservices){
          $state.go("rcadminPatients");
        }
      };

      $scope.gotoPage = function(page){
        $state.go(page);
      };

      $scope.goToCaregiverDashboard = function(){
        $state.go("caregiverDashboard");
      };
      $scope.goToPatientDashboard = function(value){
        if(value){
          $state.go(value, {"clinicId": $stateParams.clinicId});
        }else{
          $state.go("patientdashboard");
        }
      };
      $scope.isFooter = function(){
        var url = $location.path();
        $rootScope.isFooter = false;
        $rootScope.isFooter = (!$rootScope.isFooter && url.indexOf(footerConstants.contactus) !== -1) ? true: false;        
        $rootScope.isFooter = (!$rootScope.isFooter) ? ((url.indexOf(footerConstants.privacyPolicy) !== -1) ? true: false) : $rootScope.isFooter;        
        $rootScope.isFooter = (!$rootScope.isFooter) ? ((url.indexOf(footerConstants.termsOfUse) !== -1) ? true: false) : $rootScope.isFooter;        
        $rootScope.isFooter = (!$rootScope.isFooter ) ? ((url.indexOf(footerConstants.privacyPractices) !== -1) ? true: false) : $rootScope.isFooter;        
        $rootScope.isFooter = (!$rootScope.isFooter) ? (( url.indexOf(footerConstants.careSite) !== -1) ? true: false ) : $rootScope.isFooter;
      };

      $scope.isFooter();

      $scope.goToPatientDashboard = function(value){
        if(value){
          $state.go(value, {"clinicId": $stateParams.clinicId});
        }else{
          $state.go("patientdashboard");
        }
      }
    }]
  };
}]);

angular.module('hillromvestApp')
.directive('navigationBarPatient', ['Auth', 'Principal', '$state', 'Account', '$location', function (Auth, Principal, $state, Account, $location) {
  return {
    templateUrl: 'scripts/components/navbar/navbarpatientuser.html',
    restrict: 'E',

    controller: ['$scope', 'UserService', 'StorageService', function ($scope, UserService, StorageService) {
      $scope.notifications = 0;
      $scope.username = StorageService.get('logged').userFirstName;
      $scope.isActive = function(tab) {
        var path = $location.path();
        if (path.indexOf(tab) !== -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.getNotifications = function(){
        UserService.getPatientNotification(StorageService.get("logged").patientID, new Date().getTime()).then(function(response){
          $scope.notifications = response.data;
          $scope.no_of_notifications = response.data.length;
        });
      };
      $scope.getNotifications();
    }]
  };
}]);

angular.module('hillromvestApp')
.directive('navigationBarHcp',['Auth', 'Principal', '$state', 'Account', '$location', function (Auth, Principal, $state, Account, $location) {
  return {
    templateUrl: 'scripts/components/navbar/navbarhcp.html',
    restrict: 'E',

    controller: ['$scope', 'UserService', '$stateParams', 'StorageService', function ($scope, UserService, $stateParams, StorageService) {
      $scope.username = StorageService.get('logged').userFirstName;
      $scope.notifications = 0;
      $scope.isActive = function(tab) {
        var path = $location.path();
        if (path.indexOf(tab) !== -1) {
          return true;
        } else {
          return false;
        }
      }

      $scope.account = function(){
        var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
        $state.go("hcpUserProfile",{'clinicId': clinicId});
      };

      $scope.getNotifications = function(){
        UserService.getPatientNotification(StorageService.get('logged').patientID, new Date().getTime()).then(function(response){
          $scope.notifications = response.data;
          if($scope.notifications.length < 2){
            $scope.no_of_notifications = $scope.notifications.length;
          }else{
            $scope.no_of_notifications = 2;
          }          
        });
      };
    }]
  };
}]);

angular.module('hillromvestApp')
.directive('navigationBarClinicadmin',['$state', '$location', function ($state, $location) {
  return {
    templateUrl: 'scripts/components/navbar/navbarclinicadmin.html',
    restrict: 'E',

    controller: ['$scope', 'UserService', '$stateParams', 'StorageService', function ($scope, UserService, $stateParams, StorageService) {
      $scope.username = StorageService.get('logged').userFirstName;
      $scope.notifications = 0;
      $scope.isActive = function(tab) {
        var path = $location.path();
        if (path.indexOf(tab) !== -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.account = function(){
        var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
        $state.go("clinicadminUserProfile",{'clinicId': clinicId});
      };
    }]
  };
}]);
