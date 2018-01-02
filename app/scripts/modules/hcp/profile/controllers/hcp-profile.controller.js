'use strict';

angular.module('hillromvestApp')
  .controller('hcpProfileController',['$scope', '$state', '$stateParams', '$location', 'notyService', 'UserService', 'Password', 'Auth', 'AuthServerProvider', 'DoctorService', 'StorageService', 'commonsUserService', '$rootScope',
    function ($scope, $state, $stateParams, $location, notyService, UserService, Password, Auth, AuthServerProvider, DoctorService, StorageService, commonsUserService, $rootScope) {
   $scope.data  = {};
    $scope.dayOptions = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Daily'];
    $scope.MessageNotificationFreq = "";
    $scope.isActive = function(tab) {
      var path = $location.path();
      if (path.indexOf(tab) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    $scope.initProfile = function(adminId){
      UserService.getState().then(function(response) {
       $scope.states = response.data.states;
      }).catch(function(response) {
        notyService.showError(response);
      });
      $scope.credentialsList = admin_cont.hcp.credentialsList;
      UserService.getUser(adminId).then(function(response){
        $scope.user = response.data.user;
        $scope.user.role = StorageService.get('logged').role;
        $scope.user.zipcode = commonsUserService.formatZipcode($scope.user.zipcode);
      }).catch(function(response){
        notyService.showError(response);
      });
      AuthServerProvider.getSecurityQuestions().then(function(response){
        $scope.questions = response.data
      }).catch(function(response){
        notyService.showError(response);
      });
      DoctorService.getClinicsAssociatedToHCP(StorageService.get('logged').userId).then(function(response){
        $scope.clinics = response.data.clinics;
      }).catch(function(response){
        notyService.showError(response);
      });
      UserService.getTimezoneList().then(function(response){
        $scope.timezoneList = response.data.timezones;
       }).catch(function(response){
        notyService.showError(response);
      });
    };
 $scope.processNotificationData = function(){
    $scope.data.isMissedTherapyNotification = $scope.user.missedTherapyNotification;
    $scope.data.isNonHMRNotification = $scope.user.nonHMRNotification;
    $scope.data.isSettingDeviationNotification = $scope.user.settingDeviationNotification;
    $scope.data.isMessageNotification = $scope.user.messageNotification;
    $scope.data.MissedTherapyNotificationFreq = $scope.user.missedTherapyNotificationFreq;
    $scope.data.NonHMRNotificationFreq = $scope.user.nonHMRNotificationFreq;
    $scope.data.SettingDeviationNotificationFreq = $scope.user.settingDeviationNotificationFreq;
    if($scope.data.isMessageNotification){
      $scope.MessageNotificationFreq = 'Daily';
    }
    else{
      $scope.MessageNotificationFreq = "";
    }
/*   if($scope.data.isMissedTherapyNotification){
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
    $scope.initSettings = function(){
      UserService.getUser(StorageService.get('logged').userId).then(function(response){
        $scope.user = response.data.user;
         $scope.processNotificationData();
      }).catch(function(response){
        notyService.showError(response);
      });
    };
 $scope.initPatientSettings = function(){  
    UserService.getPatientUserNotification(StorageService.get('logged').patientID).then(function(response){
      $scope.user = response.data.user;
      $scope.processNotificationData();
    }).catch(function(){
       notyService.showError(response);
    });
  };
    $scope.init = function(){
       $scope.initCount($stateParams.clinicId);
      if($state.current.name === 'hcpUserProfile' || $state.current.name === 'editHCPProfile' ){
        $scope.initProfile(StorageService.get('logged').userId);
      }else if($state.current.name === 'hcpSettings'){
        $scope.initSettings();
      }
    };

    $scope.close = function(value)
    {
      $scope.showUpdateModal = value;
    };

    $scope.showUpdate = function(){
          $scope.submitted = true;
          if($scope.form.$invalid){
            return false;
          }
          $scope.showUpdateModal = true;
        };
        
    $scope.editMode = function(){
       var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : (($scope.clinics && $scope.clinics.length > 0) ? $scope.clinics[0].id : $stateParams.clinicId);      
      $state.go('editHCPProfile', {'clinicId': clinicId});
    };

    $scope.switchProfileTab = function(status){
       var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : (($scope.clinics && $scope.clinics.length > 0) ? $scope.clinics[0].id : $stateParams.clinicId);      
      $state.go(status, {'clinicId': clinicId});
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
        AuthServerProvider.changeSecurityQuestion(data, $scope.user.id).then(function(response){
        }).catch(function(response){
          notyService.showError(response);
        });
      }
      $scope.user.role = $scope.user.authorities[0].name;
       var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : (($scope.clinics && $scope.clinics.length > 0) ? $scope.clinics[0].id : $stateParams.clinicId);
      UserService.editUser($scope.user).then(function(response){      
      localStorage.setItem('timestampPreference',$scope.user.timeZone);  
        if(StorageService.get('logged').userEmail === $scope.user.email){
          notyService.showMessage(response.data.message, 'success');
          $state.go('hcpUserProfile', {'clinicId': clinicId});
        }else{
          notyService.showMessage(profile.EMAIL_UPDATED_SUCCESSFULLY, 'success');
          Auth.logout();
          $state.go('login');
        }
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.updatePassword = function(){
      $scope.submitted = true;
      $scope.passwordUpdateModal = false;
      if($scope.form.$invalid){
        return false;
      }
      var data = {
        'password': $scope.password,
        'newPassword': $scope.newPassword
      };
      Password.updatePassword(StorageService.get('logged').userId, data).then(function(response){
        Auth.logout();
        $rootScope.userRole = null;
        notyService.showMessage(response.data.message, 'success');
        $state.go('login');
      }).catch(function(response){
        console.log("reset pwd err : "+profile.PASSWORD_REST_ERROR);
        notyService.showMessage(profile.PASSWORD_REST_ERROR, 'warning');
      });
    };
    /*$scope.processNotificationData = function(){
    $scope.data.isMessageNotification = $scope.patientUser.missedTherapyNotification;
    $scope.data.isNonHMRNotification = $scope.patientUser.nonHMRNotification;
    $scope.data.isSettingDeviationNotification = $scope.patientUser.settingDeviationNotification;
    $scope.data.isMessageNotification = $scope.patientUser.messageNotification;
    $scope.data.MissedTherapyNotificationFreq = $scope.patientUser.missedTherapyNotificationFreq;
    $scope.data.NonHMRNotificationFreq = $scope.patientUser.nonHMRNotificationFreq;
    $scope.data.SettingDeviationNotificationFreq = $scope.patientUser.settingDeviationNotificationFreq;
    if($scope.isMessageNotification){
      $scope.MessageNotificationFreq = 'Daily';
    }
    else{
      $scope.MessageNotificationFreq = "";
    }
  };*/
   
    $scope.toggleNotification = function(notification){
     if(notification === 'missedTherapyNotification'){
      $scope.data.isMissedTherapyNotification = !$scope.user.missedTherapyNotification;
      $scope.user.missedTherapyNotification = $scope.data.isMissedTherapyNotification;
      if($scope.data.isMissedTherapyNotification == false)
      {
        $scope.data.MissedTherapyNotificationFreq = "";
        $scope.notificationFrequency();
      }
    }
    else if(notification === 'nonHMRNotification'){
      $scope.data.isNonHMRNotification = !$scope.user.nonHMRNotification;
      $scope.user.nonHMRNotification = $scope.data.isNonHMRNotification;
      if($scope.data.isNonHMRNotification == false){
        $scope.data.NonHMRNotificationFreq = "";
        $scope.notificationFrequency();
      }
    }
    else if(notification === 'settingDeviationNotification'){
      $scope.data.isSettingDeviationNotification = !$scope.user.settingDeviationNotification;
      $scope.user.settingDeviationNotification = $scope.data.isSettingDeviationNotification;
      if( $scope.data.isSettingDeviationNotification == false)
      {
        $scope.data.SettingDeviationNotificationFreq = "";
        $scope.notificationFrequency();
      }
    }
     else if(notification === 'messageNotification'){
        $scope.data.isMessageNotification = !$scope.user.messageNotification;
        $scope.user.messageNotification = $scope.data.isMessageNotification;
        if($scope.data.isMessageNotification){
          $scope.MessageNotificationFreq = 'Daily'
        }
        else{
        $scope.MessageNotificationFreq = '';
      }
        $scope.notificationFrequency();
      }
    };
   /* $scope.notificationFrequency = function(){
UserService.updatePatientUserNotification(StorageService.get('logged').userId, $scope.data).then(function(response){
        $scope.user = response.data.user;    
      }).catch(function(response){
        notyService.showError(response);
      });
    };*/
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
    UserService.updatePatientUserNotification(StorageService.get('logged').userId, data).then(function(response){
        $scope.user = response.data.user;   
      //$scope.processNotificationData(); 
    }).catch(function(response){
      notyService.showError(response);
    });
  };
    $scope.cancel = function(){
            var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : (($scope.clinics && $scope.clinics.length > 0) ? $scope.clinics[0].id : $stateParams.clinicId);
      $state.go('hcpUserProfile', {'clinicId': clinicId});
    };

    $scope.goToPatientDashboard = function(value){
      var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : (($scope.clinics && $scope.clinics.length > 0) ? $scope.clinics[0].id : $stateParams.clinicId);
      $state.go(value, {'clinicId': clinicId});
    };

    $scope.showPasswordUpdateModal = function(){
      $scope.submitted = true;
      if($scope.form.$invalid){
        return false;
      }else{
        $scope.passwordUpdateModal = true;
      }
    };

    $scope.init();
  }]);