'use strict';

angular.module('hillromvestApp')
    .controller('MainController',['$scope', 'Principal', 'Auth', '$state', 'Account', '$location', '$stateParams', '$rootScope', 'loginConstants', 'StorageService', 'UserService', '$window',
    	function ($scope, Principal,Auth, $state, Account, $location,$stateParams, $rootScope,loginConstants,StorageService, UserService, $window) {
        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

        $scope.mainInit = function(){
			$rootScope.userRole = null;
			$rootScope.username = null;
			if(StorageService.get('logged')){
				$rootScope.userRole = StorageService.get('logged').role;
				$rootScope.username = StorageService.get('logged').userFirstName;  
			}
			if($rootScope.userRole === 'PATIENT'){
				$scope.getNotifications();
			}
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
	        Auth.signOut().then(function(data) {
	          Auth.logout();
	          StorageService.clearAll();
	          $rootScope.userRole = null;
	          $scope.signOut();
	        }).catch(function(err) {
	        });
	      };

	      $scope.profile = function(){ 
	        if($rootScope.userRole === "ADMIN"){
	          $state.go('adminProfile');
	        }else if($rootScope.userRole === "PATIENT"){
	          $state.go("patientResetPassword");
	        } else if($rootScope.userRole === 'HCP'){
	          $state.go('hcpDashboardProfile');
	        }else if($rootScope.userRole === loginConstants.role.acctservices){
	          $state.go('adminProfileRc');
	        } else if($rootScope.userRole === "CLINIC_ADMIN" || $rootScope.userRole === "CLINIC ADMIN"){
	        	var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
        		$state.go("clinicadminUserProfile",{'clinicId': clinicId});
	        }else if($rootScope.userRole === "HCP"){
	        	var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
        		$state.go("hcpUserProfile",{'clinicId': clinicId});
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
	      $scope.getNotifications = function(){
	        UserService.getPatientNotification(StorageService.get("logged").patientID, new Date().getTime()).then(function(response){
				$scope.notifications = response.data;
				$scope.no_of_notifications = response.data.length;
				switch($rootScope.userRole) {
				    case "PATIENT":
				        $scope.getPatientNotifications($scope.notifications);
				        break;
				    case "HCP":
				        $scope.getHCPNotifications($scope.notifications);
				        break;
				}				
				 
			});
	      };

	      $scope.getHCPNotifications = function(notifications){
	      	if(notifications.length < 2){
				$scope.no_of_notifications = notifications.length;
			}else{
				$scope.no_of_notifications = 2;
			}  
	      };

	      $scope.getPatientNotifications = function(notifications){
	      	if(notifications.length === 0){            
			  	var noNotification = {
			      'notificationType' : 'NO_NOTIFICATION'
			    }
			    $scope.notifications.push(noNotification);
			}
	      };
		$scope.mainInit();
		$window.onfocus = function(){
			$scope.mainInit();			
			Auth.authorize(true);
		}

    }]);
