'use strict';

angular.module('hillromvestApp').controller('patientprofileController', ['$scope', '$state', 'notyService', 'patientService', 'UserService', 'AuthServerProvider', 'Password', 'Auth', 'StorageService', 'caregiverDashBoardService', '$stateParams', 'loginConstants', '$q', 'dateService', '$rootScope', 'commonsUserService',
  function ($scope, $state, notyService, patientService, UserService, AuthServerProvider,Password, Auth, StorageService, caregiverDashBoardService, $stateParams, loginConstants, $q, dateService, $rootScope, commonsUserService) {
    $scope.isPhoneUpdated = false;
   $scope.isEmailUpdated = false;
   $scope.dayOptions = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Daily'];
   $scope.MessageNotificationFreq = "";
  $scope.init = function(){
		var currentRoute = $state.current.name;
     $scope.initCount("");
     $scope.isDisable = false;
      $scope.isDisable1 = false;
       $scope.isDisable2 = false;
        $scope.isDisable3 = false;
		$scope.profileTab = currentRoute;	
		$scope.userRole = StorageService.get('logged').role;
    $scope.data  = {};
    $scope.role = StorageService.get('logged').role;
    $scope.caregiverID = parseInt(StorageService.get('logged').userId);
    UserService.getTimezoneList().then(function(response){
        $scope.timezoneList = response.data.timezones;
       }).catch(function(response){
        notyService.showError(response);
      });
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
      $scope.$emit('getPatients', $scope.patients);
 if($stateParams.patientId){   
          for(var i=0;i<response.data.patients.length;i++){
            if($stateParams.patientId == response.data.patients[i].userId){
          $scope.selectedPatient = response.data.patients[i];
          $scope.patientId = $scope.selectedPatient.userId;
          break;
        }
        }
        } else{

          $scope.selectedPatient = response.data.patients[0];
          $scope.patientId = $scope.selectedPatient.userId;
        }
      if($state.current.name === 'patientDashboardPatientInfo'){
        $scope.initProfileViewCaregiver();    
      } else if($state.current.name === 'patientDashboardNotification'){
        $scope.initPatientSettingsCaregiver();
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
        $scope.selectedPatient = patient;
        $scope.patientId = $scope.selectedPatient.userId;
         var currentname = $state.current.name;
        $state.go(currentname,{'patientId':$scope.patientId});
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
		      if($scope.patientView){
        $scope.patientView.zipcode = commonsUserService.formatZipcode($scope.patientView.zipcode);
      if($scope.patientView.deviceType){
        $scope.patientView.deviceType = patientService.getDeviceTypeName($scope.patientView.deviceType);
        }
        else{
          $scope.patientView.deviceType = patientService.getDeviceTypeName($scope.getDeviceTypeforBothIcon());
        }
          if($scope.patientView.monarchGarmentSize){
          $scope.patientView.monarchGarmentSize = searchFilters.oneSize;
        }
      }
    }).catch(function(response){});
		AuthServerProvider.getSecurityQuestions().then(function(response){
			$scope.questions = response.data
		}).catch(function(response){
      notyService.showError(response);
    });
	};
    $scope.initProfileViewCaregiver = function(){
    UserService.getUser($scope.selectedPatient.userId).then(function(response){
      $scope.patientView = response.data.user;
            if($scope.patientView){
     $scope.patientView.zipcode = commonsUserService.formatZipcode($scope.patientView.zipcode);
      if($scope.patientView.deviceType){
        $scope.patientView.deviceType = patientService.getDeviceTypeName($scope.patientView.deviceType);
        }
        else{
          $scope.patientView.deviceType = patientService.getDeviceTypeName($scope.getDeviceTypeforBothIcon());
        }
          if($scope.patientView.monarchGarmentSize){
          $scope.patientView.monarchGarmentSize = searchFilters.oneSize;
        }
      }
    }).catch(function(response){});
    AuthServerProvider.getSecurityQuestions().then(function(response){
      $scope.questions = response.data
    }).catch(function(response){
      notyService.showError(response);
    });
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
    if($scope.isPhoneUpdated ==true && $scope.isEmailUpdated == false)
    {
        $scope.emailFormSubmitted = true;
      if($scope.emailForm.$invalid){
        return false;
      }
      var data = $scope.patient;
      data.role = 'PATIENT';
      UserService.editUser(data).then(function(response){
        localStorage.setItem('timestampPreference',$scope.user.timeZone);
        notyService.showMessage(response.data.message, 'success');
        $scope.isPhoneUpdated = false;
      }).catch(function(response){
        notyService.showError(response);
        $scope.isPhoneUpdated = false;
      });
    }
    else if($scope.isPhoneUpdated ==false && $scope.isEmailUpdated == true)
    {
      $scope.emailFormSubmitted = true;
      if($scope.emailForm.$invalid){
        return false;
      }
      var data = $scope.patient;
      data.role = 'PATIENT';
      UserService.editUser(data).then(function(response){
         localStorage.setItem('timestampPreference',$scope.user.timeZone);
        Auth.logout();
        StorageService.clearAll();
        $rootScope.userRole = null;
        notyService.showMessage(response.data.message, 'success');
        $scope.isEmailUpdated = false;
        $state.go('login');
      }).catch(function(response){
        notyService.showError(response);
        $scope.isEmailUpdated = false;
      });
    }
    else
    {
       $scope.emailFormSubmitted = true;
      if($scope.emailForm.$invalid){
        return false;
      }
      var data = $scope.patient;
      data.role = 'PATIENT';
      UserService.editUser(data).then(function(response){
         localStorage.setItem('timestampPreference',$scope.user.timeZone);
        Auth.logout();
        StorageService.clearAll();
        $rootScope.userRole = null;
        notyService.showMessage(response.data.message, 'success');
        $scope.isEmailUpdated = false;
        $scope.isPhoneUpdated = false;
        $state.go('login');
      }).catch(function(response){
        notyService.showError(response);
        $scope.isEmailUpdated = false;
        $scope.isPhoneUpdated = false;
      });
    }
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
  $scope.processNotificationData = function(){
    $scope.data.isMissedTherapyNotification = $scope.patientUser.missedTherapyNotification;
    $scope.data.isNonHMRNotification = $scope.patientUser.nonHMRNotification;
    $scope.data.isSettingDeviationNotification = $scope.patientUser.settingDeviationNotification;
    $scope.data.isMessageNotification = $scope.patientUser.messageNotification;
    $scope.data.MissedTherapyNotificationFreq = $scope.patientUser.missedTherapyNotificationFreq;
    $scope.data.NonHMRNotificationFreq = $scope.patientUser.nonHMRNotificationFreq;
    $scope.data.SettingDeviationNotificationFreq = $scope.patientUser.settingDeviationNotificationFreq;
    if($scope.data.isMessageNotification){
      $scope.MessageNotificationFreq = 'Daily';
    }
    else{
      $scope.MessageNotificationFreq = "";
    }
    /*if($scope.data.isMissedTherapyNotification){
    $scope.data.MissedTherapyNotificationFreq = "Daily";
  }
  else{
$scope.data.MissedTherapyNotificationFreq = "";
  }
   if($scope.data.isNonHMRNotification){
    $scope.data.NonHMRNotificationFreq = "Daily";
  }
   else{
    $scope.data.NonHMRNotificationFreq = "";
  }
   if($scope.data.isSettingDeviationNotification){
    $scope.data.SettingDeviationNotificationFreq = "Daily";
  }
   else{
     $scope.data.SettingDeviationNotificationFreq = "";
  }*/
  };

  $scope.initPatientSettings = function(){ 	
		UserService.getPatientUserNotification(StorageService.get('logged').patientID).then(function(response){
			$scope.patientUser = response.data.user;
      $scope.processNotificationData();
		}).catch(function(){
		   notyService.showError(response);
		});
  };
    $scope.initPatientSettingsCaregiver = function(){  
    UserService.getPatientUserNotification($scope.selectedPatient.userId).then(function(response){
      $scope.patientUser = response.data.user;
    }).catch(function(){
       notyService.showError(response);
    });
  };

  $scope.toggleNotification = function(notification){
   // $scope.data = {"isMissedTherapyNotification" : $scope.patientUser.missedTherapyNotification, "isNonHMRNotification": $scope.patientUser.nonHMRNotification, "isSettingDeviationNotification": $scope.patientUser.settingDeviationNotification,"isMessageNotification": $scope.patientUser.messageNotification};
   
    if(notification === 'missedTherapyNotification'){
    	$scope.data.isMissedTherapyNotification = !$scope.patientUser.missedTherapyNotification;
      $scope.patientUser.missedTherapyNotification = $scope.data.isMissedTherapyNotification;
      if($scope.data.isMissedTherapyNotification == false)
      {
        $scope.data.MissedTherapyNotificationFreq = "";
        $scope.notificationFrequency();
      }
    }
    else if(notification === 'nonHMRNotification'){
    	$scope.data.isNonHMRNotification = !$scope.patientUser.nonHMRNotification;
      $scope.patientUser.nonHMRNotification = $scope.data.isNonHMRNotification;
      if($scope.data.isNonHMRNotification == false){
        $scope.data.NonHMRNotificationFreq = "";
        $scope.notificationFrequency();
      }
    }
    else if(notification === 'settingDeviationNotification'){
    	$scope.data.isSettingDeviationNotification = !$scope.patientUser.settingDeviationNotification;
      $scope.patientUser.settingDeviationNotification = $scope.data.isSettingDeviationNotification;
      if( $scope.data.isSettingDeviationNotification == false)
      {
        $scope.data.SettingDeviationNotificationFreq = "";
        $scope.notificationFrequency();
      }
    }
     else if(notification === 'messageNotification'){
        $scope.data.isMessageNotification = !$scope.patientUser.messageNotification;
        $scope.patientUser.messageNotification = $scope.data.isMessageNotification;
        if($scope.data.isMessageNotification){
          $scope.MessageNotificationFreq = 'Daily'
        }
        else{
        $scope.MessageNotificationFreq = '';
      }
        $scope.notificationFrequency();
      }
  };
 $scope.discardIncompleteData = function(){
     var dataTemp = Object.assign({}, $scope.data);
      //var data = $scope.data;
      if($scope.data.isMissedTherapyNotification){
        if($scope.data.MissedTherapyNotificationFreq){
          //do nothing
        }
        else{
          dataTemp.isMissedTherapyNotification = false;
        }
      }
            if($scope.data.isNonHMRNotification){
        if($scope.data.NonHMRNotificationFreq){
          //do nothing
        }
        else{
          dataTemp.isNonHMRNotification = false;
        }
      }
            if($scope.data.isSettingDeviationNotification){
        if($scope.data.SettingDeviationNotificationFreq){
          //do nothing
        }
        else{
          dataTemp.isSettingDeviationNotification = false;
        }
      }
      return dataTemp;
    };
    
  $scope.notificationFrequency = function(){
    var data = $scope.discardIncompleteData();
  var id = ($scope.selectedPatient)? ($scope.selectedPatient.userId): (StorageService.get('logged').patientID);
  UserService.updatePatientUserNotification(id,data).then(function(response){
      $scope.patientUser = response.data.user;   
    //  $scope.processNotificationData(); 
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
