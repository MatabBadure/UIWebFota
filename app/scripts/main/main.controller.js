'use strict';

angular.module('hillromvestApp')
  .controller('MainController', 
  	['$scope', 'Principal', 'Auth','notyService', 'DoctorService','$state', 'Account', '$location', '$stateParams', '$rootScope', 'loginConstants', 'StorageService', 'UserService', '$window', 'patientService', 'messageService', 'caregiverDashBoardService',
  function ($scope, Principal,Auth,notyService,DoctorService, $state, Account, $location,$stateParams, $rootScope,loginConstants,StorageService, UserService, $window, patientService,messageService,caregiverDashBoardService) {
    Principal.identity().then(function(account) {
      $scope.account = account;
      $scope.isAuthenticated = Principal.isAuthenticated;
    });
	$rootScope.initCount = function(clinicid){
	if($rootScope.userRole === 'PATIENT' || $rootScope.userRole === 'CLINIC_ADMIN' || $rootScope.userRole === 'HCP'){
				$rootScope.UnreadMessages ="";
				$scope.getunreadcount(clinicid);
			}	
	}
	$rootScope.getDeviceType = function(){
		var patientId = "";
		$rootScope.userRole = StorageService.get('logged').role;
		if($rootScope.userRole === 'PATIENT'){
			patientId = $rootScope.userId;
		}
		else if($rootScope.userRole === 'CARE_GIVER'){
			if($stateParams.patientId){
				patientId = $stateParams.patientId;
			}
			else{
			patientId = StorageService.get('logged').patientID;
				}
			}
		else{
			patientId = $stateParams.patientId;
		}
	return (localStorage.getItem('deviceType_'+patientId));	
	}

	$rootScope.getDeviceTypeforBothIcon = function(){
		var patientId = "";
		$rootScope.userRole = StorageService.get('logged').role;
		if($rootScope.userRole === 'PATIENT'){
			patientId = $rootScope.userId;
			console.log("patientId in main",patientId)
		}
		else if($rootScope.userRole === 'CARE_GIVER'){
			if($stateParams.patientId){
				patientId = $stateParams.patientId;
			}
			else{
			patientId = StorageService.get('logged').patientID;
				}
			}
		else{
			patientId = $stateParams.patientId;
		}
	return (localStorage.getItem('deviceTypeforBothIcon_'+patientId));	
	}
	//the following module added for ticket Hill-2411
	$rootScope.getPatientListForCaregiver = function(caregiverID){
      var currentname = $state.current.name;  
      caregiverDashBoardService.getPatients(caregiverID).then(function(response){
                $scope.patients = response.data.patients;
                var logged = StorageService.get('logged');                    
            logged.patientID = $stateParams.patientId ? $stateParams.patientId : response.data.patients[0].user.id;               
            StorageService.save('logged', logged);
                 if(response.data.patients[0].deviceType == 'ALL'){
          localStorage.setItem('deviceType_'+response.data.patients[0].user.id, 'VEST');
          localStorage.setItem('deviceTypeforBothIcon_'+response.data.patients[0].user.id, 'ALL');

            }
            else{
            localStorage.setItem('deviceType_'+response.data.patients[0].user.id, response.data.patients[0].deviceType);
            localStorage.setItem('deviceTypeforBothIcon_'+response.data.patients[0].user.id, response.data.patients[0].deviceType);
          }

      }).catch(function(response){
                  notyService.showError(response);
      });
      return $scope.patients;
    };
    //EnfOf:the following module added for ticket Hill-2411
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
	 /*****Get unread messages *****/
   $scope.getunreadcount = function(clinicid){
  if(StorageService.get('logged').role === 'PATIENT'){
  messageService.getUnreadMessagesCount(StorageService.get('logged').patientID,0).then(function(response){
  if(response.data.length){
if(response.data[0][0] == false){
  $rootScope.UnreadMessages = response.data[0][1];
}
else{
  $rootScope.UnreadMessages = 0;
}
}
else {
  $rootScope.UnreadMessages = 0;
}
   }).catch(function(response){
    if(response.message == 'No message available'){
    $rootScope.UnreadMessages = 0;
  }
    });

}
else if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
  messageService.getUnreadMessagesCountCA(StorageService.get('logged').userId,1,clinicid).then(function(response){
if(response.data.length){
if(response.data[0][0] == false){
  $rootScope.UnreadMessages = response.data[0][1];
}
else{
  $rootScope.UnreadMessages = 0;
}
}
else {
  $rootScope.UnreadMessages = 0;
}
   }).catch(function(response){
    if(response.message == 'No message available'){
    $rootScope.UnreadMessages = 0;  
  }
    });

}
else if(StorageService.get('logged').role === 'HCP'){
  messageService.getUnreadMessagesCountCA(StorageService.get('logged').userId,1,clinicid).then(function(response){
if(response.data.length){
if(response.data[0][0] == false){
  $rootScope.UnreadMessages = response.data[0][1];
}
else{
  $rootScope.UnreadMessages = 0;
}
}
else {
  $rootScope.UnreadMessages = 0;
}
   }).catch(function(response){
    if(response.message == 'No message available'){
    $rootScope.UnreadMessages = 0;  
  }
    });

}

};
//$scope.getunreadcount();

    $scope.FooterLoginZindex = function(){
    	if($state.current.name === "login" || $state.current.name === "home" ){
		    return "remove-static-loginPage";
			}
    	else {
    		return "remove-static";
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
          localStorage.clear();
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
      } /*else if($rootScope.userRole === "CLINIC_ADMIN" || $rootScope.userRole === "CLINIC ADMIN"){
      	var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
    		$state.go("clinicadminUserProfile",{'clinicId': clinicId});
      }*/
      /*else if($rootScope.userRole === "HCP"){
      	var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
    		$state.go("hcpUserProfile",{'clinicId': clinicId});
      }*/
      else if($rootScope.userRole === loginConstants.role.associates){
      	$state.go('associateProfile');
      }
      else if($rootScope.userRole === loginConstants.role.customerservices){
      	$state.go('customerserviceProfile');
     // $state.go('RnDadminProfile');
      }
      else if($rootScope.userRole === loginConstants.role.RnDadmin){
      	$state.go('RnDadminProfile');
      }
    };
    $scope.profileCA = function(clinicid){
      	var clinicId = ($stateParams.clinicId) ? $stateParams.clinicId : clinicid;
    		$state.go("clinicadminUserProfile",{'clinicId': clinicId});
      
    };
        $scope.profileHCP = function(clinicid){
      	var clinicId = ($stateParams.clinicId) ? $stateParams.clinicId : clinicid;
    		$state.go("hcpUserProfile",{'clinicId': clinicId});
      
    };


    $scope.chargerdummydata = function()
    {
    	if($rootScope.userRole === "ADMIN"){
        $state.go('charger');
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
      else if($rootScope.userRole === loginConstants.role.customerservices){
        $state.go("customerservicePatientUser");
      }
      else if($rootScope.userRole === loginConstants.role.RnDadmin){
        $state.go("fotaHome");
      }
    };

    $scope.gotoPage = function(page){
      $state.go(page);
    };

	  $scope.goToCaregiverDashboard = function(){
	    $state.go("caregiverDashboard",{"patientId":$stateParams.patientId});
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

	/*  $scope.goToPatientDashboard = function(value){
	    if(value){
	      $state.go(value, {"clinicId": $stateParams.clinicId});
	    }else{
	      $state.go("patientdashboard");
	    }
	  };
	  $scope.goToPatientDashboard = function(value){
	    if(value){
	      $state.go(value, {"clinicId": $stateParams.clinicId});
	    }else{
	      $state.go("patientdashboard");
	    }
	  };
*/
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
	  		$scope.getNumberofDays();
		   	if(notifications.length === 0){            
		  	var noNotification = {
		      'notificationType' : 'NO_NOTIFICATION'
		    }
		    $scope.notifications.push(noNotification);
			}
	  };
	  /******Written to fix Hill-2002. Calling clinics API to get number of days(adherenceSetting) ******/
	    $scope.getNumberofDays = function(){
	  patientService.getClinicsLinkedToPatient(StorageService.get('logged').patientID).then(function(response){
          $scope.notificationData = response.data.clinics[0].adherenceSetting;
       });
	};
	 /******End of Calling clinics API to get number of days(adherenceSetting) ******/

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
	    else if($rootScope.userRole === loginConstants.role.customerservices){
	      $state.go('customerserviceSurveyReport');
	    }
	    else if($rootScope.userRole === loginConstants.role.hcp ){
	      $state.go('hcpBenchmarking');
	    }
	    else if($rootScope.userRole === loginConstants.role.clinicadmin){
	      $state.go('clinicAdminBenchmarking');
	    }
    };
      $scope.announcement = function(){
	    if($rootScope.userRole === "ADMIN"){
	      $state.go('adminAnnouncements');
	    }else if($rootScope.userRole === "ACCT_SERVICES"){ 
	      $state.go('rcadminAnnouncements');
	    }
	    else if($rootScope.userRole === "ASSOCIATES"){ 
	      $state.go('associateAnnouncements');
	    }
	    else if($rootScope.userRole === "CUSTOMER_SERVICES"){ 
	      $state.go('customerserviceAnnouncements');
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
	    else if($rootScope.userRole === loginConstants.role.customerservices){
	      $state.go('customerserviceLoginAnalytics');
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
      else if($rootScope.userRole === loginConstants.role.customerservices){
      	$state.go('customerserviceBenchmarking');
      }
    };

    $scope.redirectCaregiver = function(value){
		$state.go(value,{'patientId':$stateParams.patientId});
    };

    $scope.userSurvey = function(){
	    if($rootScope.userRole === "PATIENT"){
	      $state.go('patientSurvey');
	    }
    };

    $rootScope.patientDiagnostics = function(){
	    if($rootScope.userRole === "PATIENT"){
  			var patientID = StorageService.get('logged').patientID;
  			$state.go("patientDiagnostic");
  		}else if($rootScope.userRole === "CLINIC_ADMIN"){
  			$state.go("CADiagnostic", {'patientId': $stateParams.patientId});
  		}else if($rootScope.userRole === "HCP"){
  			$state.go("HCPDiagnostic", {'patientId': $stateParams.patientId});
  		}else if($rootScope.userRole === "CARE_GIVER"){
  			$state.go("caregiverpatientDiagnostic");
  		}
    };

    $rootScope.backToDiagnostics = function(){
  		$rootScope.isAddDiagnostics = false;
  		$rootScope.patientDiagnostics();
  	};

  	$rootScope.isIOS = function(){
  		
  		return /iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
  	};
  	$rootScope.isMobile = function(){
	 if( navigator.userAgent.match(/Android/i)
	 || navigator.userAgent.match(/webOS/i)
	 || navigator.userAgent.match(/iPhone/i)
	 || navigator.userAgent.match(/BlackBerry/i)
	 || navigator.userAgent.match(/Windows Phone/i)
	 ){
	    return true;
	  }
	 else {
	    return false;
	  }

  	};

  	$rootScope.goToChangePrescriptionTermsConditions = function(){		
  		$window.open('#/prescription-terms', '_blank');
  	};

    $scope.navigateUser = function(tabName){
    	$state.go(tabName);
    };
    $scope.navigateWithPatientID = function(tabName){
    	$state.go(tabName,{'patientId': StorageService.get('logged').patientID});
    };
    $scope.tims = function(){
    	
    	$state.go('timslog');
    }
    $scope.timsLog = function(){
    	
    	$state.go('timslog');
    }
    $scope.timsExecute = function(){
    	
    	$state.go('executeJob');
    }
    $scope.timsDetails = function(){
    	
    	$state.go('executedLog');
    }
        $scope.caregiverProfile = function(){
      //var id = ($stateParams.patientId)?($stateParams.patientId):($scope.selectedPatient.userId);
       var id = $location.path();
        var res = id.split('/');
        var idnumber = parseFloat(res[res.length-1]);
      $state.go('caregiverProfile', {'patientId': idnumber});
    };

  }]);
