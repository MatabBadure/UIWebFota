'use strict';

angular.module('hillromvestApp').controller('patientprofileController', ['$scope', '$state', 'notyService', 'patientService', 'UserService', 'AuthServerProvider', 'Password', 'Auth', function ($scope, $state, notyService, patientService, UserService, AuthServerProvider,Password, Auth) {
	
  $scope.init = function(){
		var currentRoute = $state.current.name;	
		$scope.profileTab = currentRoute;	
		$scope.userRole = localStorage.getItem('role');			
		if (currentRoute === 'patientProfile') {
			$scope.initProfileView();        
		}else if(currentRoute === 'patientProfileEdit'){
			$scope.initProfileEdit();
		}else if(currentRoute === 'patientResetPassword'){
			$scope.initResetPassword();
		}else if(currentRoute === 'patientSettings'){
			$scope.initPatientSettings();
		}	
	};

	$scope.isProfileTabActive = function(tab) {
    if ($scope.profileTab.indexOf(tab) !== -1) {
      return true;
    } else {
      return false;
    }
  };

	$scope.switchProfileTabs = function(tab){
		$scope.profileTab = tab;
		$state.go(tab);	
	};

	$scope.getPatientById = function(patientId){
    patientService.getPatientInfo(patientId).then(function(response){
      $scope.patientView = response.data;
    }).catch(function(response){
      notyService.showError(response);
    });
  };

	$scope.initProfileView = function(){
		UserService.getUser(localStorage.getItem('patientID')).then(function(response){
			$scope.patientView = response.data.user;
		}).catch(function(response){});
		AuthServerProvider.getSecurityQuestions().then(function(response){
			$scope.questions = response.data
		}).catch(function(response){
      notyService.showError(response);
    });
	};

	$scope.openEditDetail = function(){
		$state.go("patientProfileEdit");	
	};

	$scope.initProfileEdit = function(){
		UserService.getUser(localStorage.getItem('patientID')).then(function(response){
			$scope.editPatientProfile = response.data.user;
		}).catch(function(response){});
		AuthServerProvider.getSecurityQuestions().then(function(response){
			$scope.questions = response.data
		}).catch(function(response){
      notyService.showError(response);
    });		
	};

	$scope.cancelEditProfile = function(){
		$state.go("patientProfile");
		$scope.editPatientProfile = "";
	};	

	$scope.updateProfile = function(){    
    $scope.submitted = true;
    if($scope.form.$invalid){
      return false;
    }
    if($scope.resetAccount){
      var data = {
        "questionId": $scope.resetAccount.question.id,
        "answer": $scope.resetAccount.answer
      };
      AuthServerProvider.changeSecurityQuestion(data, $scope.editPatientProfile.id).then(function(response){
      }).catch(function(response){
        notyService.showError(response);
      });
    }
    $scope.editPatientProfile.role = $scope.editPatientProfile.authorities[0].name;
    $scope.editPatientProfile.dob = null;
    UserService.editUser($scope.editPatientProfile).then(function(response){        
      if(localStorage.getItem("userEmail") === $scope.editPatientProfile.email){
        notyService.showMessage(response.data.message, 'success');
        $state.go('patientProfile');
      }else{
        notyService.showMessage(profile.EMAIL_UPDATED_SUCCESSFULLY, 'success');
        Auth.logout();
        $state.go('login');
      }
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.initResetPassword = function(){
  	$scope.profile = {};
    AuthServerProvider.getSecurityQuestions().then(function(response){
      $scope.questions = response.data
    }).catch(function(response){});
  };

  $scope.updatePassword = function(){
    $scope.submitted = true;
    if($scope.form.$invalid){
      return false;
    }
    if($scope.resetAccount){
      var data = {
        "questionId": $scope.resetAccount.question.id,
        "answer": $scope.resetAccount.answer
      };
      AuthServerProvider.changeSecurityQuestion(data, localStorage.getItem('patientID')).then(function(response){
      }).catch(function(response){
        notyService.showError(response);
      });
    }
    var data = {
      'password': $scope.profile.password,
      'newPassword': $scope.profile.newPassword
    };
    Password.updatePassword(localStorage.getItem('patientID'), data).then(function(response){
      Auth.logout();
      notyService.showMessage(response.data.message, 'success');
      $state.go('login');
    }).catch(function(response){
    	notyService.showError(response);
    });
  };

  $scope.initPatientSettings = function(){ 	
		UserService.getPatientUserNotification(localStorage.getItem('patientID')).then(function(response){
			$scope.patientUser = response.data.user;
		}).catch(function(){
		   notyService.showError(response);
		});
  };

  $scope.toggleNotification = function(notification){
    var data = {"isMissedTherapyNotification" : $scope.patientUser.missedTherapyNotification, "isNonHMRNotification": $scope.patientUser.nonHMRNotification, "isSettingDeviationNotification": $scope.patientUser.settingDeviationNotification };
    if(notification === 'missedTherapyNotification'){
    	data.isMissedTherapyNotification = !$scope.patientUser.missedTherapyNotification;
    }
    if(notification === 'nonHMRNotification'){
    	data.isNonHMRNotification = !$scope.patientUser.nonHMRNotification;
    }
    if(notification === 'settingDeviationNotification'){
    	data.isSettingDeviationNotification = !$scope.patientUser.settingDeviationNotification;
    }
    UserService.updatePatientUserNotification(localStorage.getItem('patientID'), data).then(function(response){
			$scope.patientUser = response.data.user;    
		}).catch(function(response){
      notyService.showError(response);
		});
  };

  $scope.cancel = function(){
    $state.go('patientProfile');
  };

	$scope.init();    
}]);