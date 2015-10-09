'use strict';

angular.module('hillromvestApp').controller('patientprofileController', ['$scope', '$state', 'notyService', 'patientService', 'UserService', 'AuthServerProvider', 'Password', 'Auth', 'caregiverDashBoardService', '$stateParams', 'loginConstants',
  function ($scope, $state, notyService, patientService, UserService, AuthServerProvider,Password, Auth, caregiverDashBoardService, $stateParams, loginConstants) {
	
  $scope.init = function(){
		var currentRoute = $state.current.name;	
		$scope.profileTab = currentRoute;	
		$scope.userRole = localStorage.getItem('role');		
    $scope.role = localStorage.getItem('role'); 
    $scope.caregiverID = parseInt(localStorage.getItem('userId'));
    if( $scope.role === loginConstants.role.caregiver){
        $scope.getPatientListForCaregiver($scope.caregiverID);
      }	
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

  $scope.getPatientListForCaregiver = function(caregiverID){
    caregiverDashBoardService.getPatients(caregiverID).then(function(response){
      $scope.patients = response.data.patients;
      if(localStorage.getItem('patientID') !== undefined){
          angular.forEach($scope.patients, function(value){
            if(value.userId === parseInt(localStorage.getItem('patientID'))){
              $scope.$emit('getSelectedPatient', value);
              $scope.selectedPatient = value;
              $scope.patientId = localStorage.getItem('patientID');
            }
          });
      } else{
          $scope.selectedPatient = response.data.patients[0];
          $scope.$emit('getSelectedPatient', $scope.selectedPatient);
          $scope.patientId = $scope.selectedPatient.userId;
          localStorage.setItem('patientID',$scope.patientId);
      }
      $scope.$emit('getPatients', $scope.patients);
      if($state.current.name === 'patientDashboardPatientInfo'){
        $scope.initProfileView();    
      } else if($state.current.name === 'patientDashboardNotification'){
        $scope.initPatientSettings();
      }
    }).catch(function(response){
      notyService.showError(response);
    });
  };


  $scope.$on('switchPatientCareGiver',function(event,patient){
    $scope.switchPatient(patient);
  });
  
  $scope.$on('switchCaregiverTab',function(event,state){
    $scope.switchCaregiverTab(state);
  });

  $scope.switchPatient = function(patient){
    if($scope.selectedPatient.userId !== patient.userId){
      $scope.selectedPatient = patient;
      $scope.patientId = $scope.selectedPatient.userId;
      $scope.$emit('getSelectedPatient', $scope.selectedPatient);
      localStorage.setItem('patientID',$scope.patientId);
      if($state.current.name === 'patientDashboardPatientInfo'){
        $scope.initProfileView();    
      } else if($state.current.name === 'patientDashboardNotification'){
        $scope.initPatientSettings();
      }
    }
  };

  $scope.switchCaregiverTab = function(status){
    $scope.caregiverTab = status;
    $state.go(status, {'caregiverId': $stateParams.caregiverId});
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
        if(response.data.message){
          notyService.showMessage(response.data.message, 'warning');
        } else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR, 'warning');
        }
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
    	if(response && response.data && response.data.ERROR)
      notyService.showMessage(response.data.ERROR, 'warning');
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
