'use strict';

angular.module('hillromvestApp')
  .controller('MainController',['$scope', 'Principal', 'Auth', '$state', 'Account', '$location', '$stateParams', '$rootScope', 'loginConstants', 'StorageService', 'UserService', '$window', 
  function ($scope, Principal,Auth, $state, Account, $location,$stateParams, $rootScope,loginConstants,StorageService, UserService, $window) {
    Principal.identity().then(function(account) {
      $scope.account = account;
      $scope.isAuthenticated = Principal.isAuthenticated;
    });

    $scope.mainInit = function(){    		
    		$rootScope.isAddDiagnostics = false;
			$rootScope.userRole = null;
			$rootScope.username = null;
			if(StorageService.get('logged')){
				$rootScope.userRole = StorageService.get('logged').role;
				$rootScope.username = StorageService.get('logged').userFirstName;
				$rootScope.userLastName = StorageService.get('logged').userLastName;
				$rootScope.userFullName = StorageService.get('logged').userFullName;
				$rootScope.userEmail = StorageService.get('logged').userEmail;  
			}
			if($rootScope.userRole === 'PATIENT'){
				$scope.getNotifications();
			}
    };
	      
    $scope.isActive = function(tab) {
      var path = $location.path();
      if (path.indexOf(tab) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    $scope.isActiveMainBar = function(tab) {
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
    	if($state.current.name === "patientSurvey"){ 
        $rootScope.showSurveyCancelModal = true;       
        if(!$rootScope.isSurveyCancelled){          
          event.preventDefault();
        } else{
          $rootScope.showSurveyCancelModal = false;
        }       
     }else{
     	Auth.signOut().then(function(data) {
          Auth.logout();
          StorageService.clearAll();
          $rootScope.userRole = null;
          $scope.signOut();
        }).catch(function(err) {
        });
      }
    };

    $scope.profile = function(){
      if($rootScope.userRole === "ADMIN"){
        $state.go('adminProfile');
      }else if($rootScope.userRole === "PATIENT"){
        $state.go("patientResetPassword");
      } else if($rootScope.userRole === 'HCP'){
        $state.go('hcpUserProfile');
      }else if($rootScope.userRole === loginConstants.role.acctservices){
        $state.go('adminProfileRc');
      } else if($rootScope.userRole === "CLINIC_ADMIN" || $rootScope.userRole === "CLINIC ADMIN"){
      	var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
    		$state.go("clinicadminUserProfile",{'clinicId': clinicId});
      }else if($rootScope.userRole === "HCP"){
      	var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
    		$state.go("hcpUserProfile",{'clinicId': clinicId});
      }else if($rootScope.userRole === loginConstants.role.associates){
      	$state.go('associateProfile');
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
		$scope.isUserChanged = function(){
			Account.get().$promise
	        .then(function (account) {		
				var prevLoggedinEmail =  $rootScope.userEmail;
				var currentLoggedinEmail = (account.data && account.data.email) ? account.data.email : null;
				if(!prevLoggedinEmail || !currentLoggedinEmail || (prevLoggedinEmail !== currentLoggedinEmail)){
					window.location.reload();
				}
	        }, function(reason) {
	          if($state.current.name !== "login"){
			  	window.location.reload();
	          }
			});
		};
		$window.onfocus = function(){				
			if($state.current.name && $state.current.name !== 'activationLinkErrorPage'  && $state.current.name !== 'postActivateLogin' && $state.current.name !== 'activateUser' && $state.current.name !== 'home' &&  $state.current.name !== 'login' && $state.current.name !== 'requestReset' && $state.current.name !== 'finishReset' && $state.current.name !== 'authenticate'){
				$scope.isUserChanged();
			}
		};
		$scope.passwordStrength = function(){
		  $scope.display_strength('passwordBox','passwordStrengthContainer','status');
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

	    if (years >= 1000 && !$scope.form.password.$error.pattern) {
	      stats.innerHTML = value[3];
	      stats.style.color = color[3];
	    } else if (years >= 100 && years < 1000 && !$scope.form.password.$error.pattern) {
	      stats.innerHTML = value[2];
	      stats.style.color = color[2];
	    } else if (years >= 10 && years < 100 && !$scope.form.password.$error.pattern) {
	      stats.innerHTML = value[1];
	      stats.style.color = color[1];
	    } else {
	      if($scope.form.password && $scope.form.password.$error.required){
	        stats.innerHTML = '';
	        stats.style.color = color[0];
	      }else{
	        stats.innerHTML = value[0];
	        stats.style.color = color[0];
	      } 
	    }
	    return false;
	  };

		$scope.compute_strength = function (x, y){
	    if(!x){
	      return -1;
	    }
	    var secondsInAYear = 31557600;
	    var permutateRepeat = (Math.pow(x,y) - (x*$scope.factorial(y) - 1));
	    var countManyYears = Math.floor(permutateRepeat/(1000000*secondsInAYear));
	    return countManyYears;
		};

		$scope.factorial = function (x) {
	    if(x<0){
	      return false;
	    }

	    if(x == 0 ){
	      return 1;
	    }
	    x = Math.floor(x);
	    return (x*$scope.factorial(x-1));
		};

	$scope.console = function(){
	    if($rootScope.userRole === "ADMIN"){
	      $state.go('adminSurveyReport');
	    }else if($rootScope.userRole === loginConstants.role.acctservices){
	      $state.go('rcddminSurveyReport');
	    } else if($rootScope.userRole === loginConstants.role.associates){
	      $state.go('associateSurveyReport');
	    }
	    else if($rootScope.userRole === loginConstants.role.hcp ){
	      $state.go('hcpBenchmarking');
	    }
	    else if($rootScope.userRole === loginConstants.role.clinicadmin){
	      $state.go('clinicAdminBenchmarking');
	    }
    };
      	
    $scope.loginAnalyitcs = function(){
	    if($rootScope.userRole === "ADMIN"){
	      $state.go('adminLoginAnalytics');
	    }else if($rootScope.userRole === loginConstants.role.acctservices){
	      $state.go('rcadminLoginAnalytics');
	    } else if($rootScope.userRole === loginConstants.role.associates){
	      $state.go('associatesLoginAnalytics');
	    }
    };

    $scope.benchMarking = function(){
      if($rootScope.userRole === "ADMIN"){
      	$state.go('adminBenchmarking');
      }else  if($rootScope.userRole === loginConstants.role.acctservices){
      	$state.go('rcadminBenchmarking');
      }else if($rootScope.userRole === loginConstants.role.associates){
      	$state.go('associatesBenchmarking');
      }
    };

    $scope.userSurvey = function(){
	    if($rootScope.userRole === "PATIENT"){
	      $state.go('patientSurvey');
	    }
    };

    $rootScope.patientDiagnostics = function(){
	    if($rootScope.userRole === "PATIENT"){
  			var patientID = StorageService.get('logged').patientID;
  			console.log("patientDiagnostic", patientID);
  			$state.go("patientDiagnostic");
  		}else if($rootScope.userRole === "CLINIC_ADMIN"){
  			console.log("clinic admin", $stateParams.patientId);
  			$state.go("CADiagnostic", {'patientId': $stateParams.patientId});
  		}else if($rootScope.userRole === "HCP"){
  			console.log("hcp", $stateParams.patientId);
  			$state.go("HCPDiagnostic", {'patientId': $stateParams.patientId});
  		}
    };

    $rootScope.backToDiagnostics = function(){
  		$rootScope.isAddDiagnostics = false;
  		$rootScope.patientDiagnostics();
  	};

  	$rootScope.isIOS = function(){
  		
  		return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  	};

  	$rootScope.goToChangePrescriptionTermsConditions = function(){		
  		$window.open('#/prescription-terms', '_blank');
  	}

  }]);
