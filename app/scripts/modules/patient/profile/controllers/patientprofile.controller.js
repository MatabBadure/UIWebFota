'use strict';

angular.module('hillromvestApp').controller('patientprofileController', ['$scope', '$state', 'notyService', 'patientService', 'UserService', 'AuthServerProvider', 'Password', 'Auth', 'StorageService', 'caregiverDashBoardService', '$stateParams', 'loginConstants', '$q', 'dateService', '$rootScope',
  function ($scope, $state, notyService, patientService, UserService, AuthServerProvider,Password, Auth, StorageService, caregiverDashBoardService, $stateParams, loginConstants, $q, dateService, $rootScope) {
	
  $scope.init = function(){
		var currentRoute = $state.current.name;
		$scope.profileTab = currentRoute;	
		$scope.userRole = StorageService.get('logged').role;
    $scope.role = StorageService.get('logged').role;
    $scope.caregiverID = parseInt(StorageService.get('logged').userId);
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
      if(StorageService.get('logged') && StorageService.get('logged').patientID !== undefined){
          angular.forEach($scope.patients, function(value){
            if(value.userId === parseInt(StorageService.get('logged').patientID)){
              $scope.$emit('getSelectedPatient', value);
              $scope.selectedPatient = value;
              $scope.patientId = StorageService.get('logged').patientID;
            }
          });
      } else{
          $scope.selectedPatient = response.data.patients[0];
          $scope.$emit('getSelectedPatient', $scope.selectedPatient);
          $scope.patientId = $scope.selectedPatient.userId;
          var logged = StorageService.get('logged');
          logged.patientID = $scope.patientId;
          StorageService.save('logged',logged);
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
      var logged = StorageService.get('logged');
      logged.patientID = $scope.patientId;
      StorageService.save('logged',logged);
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

  $scope.setOverviewMode = function(patient){
      $scope.patient = patient;
      if (patient.dob !== null) {
        $scope.patient.age = dateService.getAge(new Date($scope.patient.dob));
        var _date = dateService.getDate($scope.patient.dob);
        var _month = dateService.getMonth(_date.getMonth());
        var _day = dateService.getDay(_date.getDate());
        var _year = dateService.getYear(_date.getFullYear());
        var dob = _month + "/" + _day + "/" + _year;
        $scope.patient.dob = dob;
        $scope.patient.formatedDOB = _month + "/" + _day + "/" + _year.slice(-2);
      }
    };

	$scope.initProfileView = function(){
		UserService.getUser(StorageService.get('logged').patientID).then(function(response){
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
		UserService.getUser(StorageService.get('logged').patientID).then(function(response){
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
    $scope.editPatientProfile.role = $scope.editPatientProfile.authorities[0].name;
    $scope.editPatientProfile.dob = null;
    UserService.editUser($scope.editPatientProfile).then(function(response){        
      if(StorageService.get('logged').userEmail === $scope.editPatientProfile.email){
        notyService.showMessage(response.data.message, 'success');
        $state.go('patientProfile');
      }else{
        notyService.showMessage(profile.EMAIL_UPDATED_SUCCESSFULLY, 'success');
        Auth.logout();
        StorageService.clearAll();
        $rootScope.userRole = null;
        $state.go('login');
      }
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.initResetPassword = function(){
    $scope.showUpdatePasswordModal = false;
  	$scope.profile = {};
    $q.all([
      AuthServerProvider.getSecurityQuestions(),
      patientService.getUserSecurityQuestion(StorageService.get('logged').patientID),
      patientService.getPatientInfo(StorageService.get('logged').patientID)
    ]).then(function(data) {        
      if(data){
        if(data[0]){
          $scope.questions = data[0].data; 
          if(data[1]){
            angular.forEach($scope.questions, function(value, key){
              if(value.id === data[1].data.question.id){
                $scope.resetAccount = value;
              }
            });
          }
          $scope.resetAccount = ($scope.resetAccount) ? $scope.resetAccount : $scope.questions[0];
        }
        if(data[2]){
          $scope.setOverviewMode(data[2].data);
        }
      }
    });
  };

  $scope.updateSecurityQuestion = function(){
    $scope.securityFormSubmitted = true;
    if($scope.securityQuestionForm.$invalid){
      return false;
    }
    var data = {
      "questionId": $scope.resetAccount.id,
      "answer": $scope.resetAccount.answer
    };
    AuthServerProvider.changeSecurityQuestion(data, StorageService.get('logged').patientID).then(function(response){
      notyService.showMessage(response.data.message, 'success');  
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.updateEmail = function(){
    $scope.emailFormSubmitted = true;
    if($scope.emailForm.$invalid){
      return false;
    }
    var data = $scope.patient;
    data.role = 'PATIENT';
    UserService.editUser(data).then(function(response){
      Auth.logout();
      StorageService.clearAll();
      $rootScope.userRole = null;
      notyService.showMessage(response.data.message, 'success');
      $state.go('login');
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.updatePassword = function(){
    $scope.submitted = true;
    if($scope.form.$invalid){
      return false;
    }
    var data = {
      'password': $scope.profile.password,
      'newPassword': $scope.profile.newPassword
    };
    Password.updatePassword(StorageService.get('logged').patientID, data).then(function(response){
        Auth.logout();
        StorageService.clearAll();
        $rootScope.userRole = null;
      notyService.showMessage(response.data.message, 'success');
      $state.go('login');
    }).catch(function(response){
    	notyService.showMessage(profile.PASSWORD_REST_ERROR, 'warning');
    });
  };

  $scope.initPatientSettings = function(){ 	
		UserService.getPatientUserNotification(StorageService.get('logged').patientID).then(function(response){
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
    UserService.updatePatientUserNotification(StorageService.get('logged').patientID, data).then(function(response){
			$scope.patientUser = response.data.user;    
		}).catch(function(response){
      notyService.showError(response);
		});
  };

  $scope.cancel = function(){
    $state.go('patientProfile');
  };

  $scope.resetEmailForm = function(){
    $scope.patient.email = null;
    $scope.emailForm.$setPristine();
    $scope.emailFormSubmitted = false;
  };

  $scope.resetPasswordForm = function(){
    $scope.profile = {};
    $scope.form.$setPristine();
    $scope.submitted = false;
  };

  $scope.resetSecurityQuestionForm = function(){
    $scope.resetAccount.answer = null;
    $scope.securityQuestionForm.$setPristine();
    $scope.securityFormSubmitted = false;
  };

  $scope.showModal = function(invalid, modalName){
      switch(modalName){
        case 'passwordModal':
        $scope.submitted = true;
        if(!invalid){
          $scope.showUpdatePasswordModal = true;
        }        
        break;
        case 'emailModal':
        $scope.emailFormSubmitted = true;
        if(!invalid){
          $scope.showUpdateEmailModal = true;
        }
        break;
        case 'securityQuestionModal':
        $scope.securityFormSubmitted = true;
        if(!invalid){
          $scope.showSecurityQuestionModal = true;
        }
        break;
      }
      return !invalid;
  };

	$scope.init();    
}]);
