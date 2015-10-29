'use strict';

angular.module('hillromvestApp')
    .controller('MainController',['$scope', 'Principal', 'Auth', '$state', 'Account', '$location', '$stateParams', '$rootScope', 'loginConstants', 'StorageService', 
    	function ($scope, Principal,Auth, $state, Account, $location,$stateParams, $rootScope,loginConstants,StorageService) {
    		console.log("main controller..................");
        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });
	      $rootScope.userRole = null;
	      $rootScope.username = null;
	      if(StorageService.get('logged')){
	        $rootScope.userRole = StorageService.get('logged').role;
	        $rootScope.username = StorageService.get('logged').userFirstName;  
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
	          $rootScope.username = null;
	          $state.go('login');
	        });
	      };

	      $scope.logout = function(){
	      	console.log("LOGOUT....................");
	        Auth.signOut().then(function(data) {
	          Auth.logout();
	          StorageService.clearAll();
	          $rootScope.userRole = null;
	          $scope.signOut();
	        }).catch(function(err) {
	        });
	      };

	      $scope.account = function(){ 
	        if($rootScope.userRole === "ADMIN"){
	          $state.go('adminProfile');
	        }else if($rootScope.userRole === "PATIENT"){
	          $state.go("patientResetPassword");
	        } else if($rootScope.userRole === 'HCP'){
	          $state.go('hcpDashboardProfile');
	        }else if($rootScope.userRole === loginConstants.role.acctservices){
	          $state.go('adminProfileRc');
	        }
	      };

	      $scope.goToHomePage = function(){
	        if(!$rootScope.userRole){
	          $state.go("home");
	        }else if($rootScope.userRole === "ADMIN"){
	          $state.go("patientUser");
	        }else if($rootScope.userRole === "PATIENT"){
	          $state.go("patientdashboard");
	        }else if($rootScope.userRole === "CLINIC_ADMIN" || $rootScope.userRole === "CLINIC ADMIN"){
	          $state.go("clinicadmindashboard");
	        }else if($rootScope.userRole === "HCP"){
	          $state.go("hcpdashboard");
	        }else if($rootScope.userRole === "CARE_GIVER"){
	          $state.go("caregiverDashboard");
	        }else if($rootScope.userRole === loginConstants.role.acctservices){
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
	      };
    }]);
