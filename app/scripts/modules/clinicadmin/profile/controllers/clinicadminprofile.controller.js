'use strict';

angular.module('hillromvestApp')
  .controller('clinicadminProfileController',['$scope', '$state', '$stateParams', '$location', 'notyService', 'UserService', 'Password', 'Auth', 'AuthServerProvider', 'DoctorService','clinicadminService', 'StorageService', '$rootScope',
    function ($scope, $state, $stateParams, $location, notyService, UserService, Password, Auth, AuthServerProvider, DoctorService, clinicadminService, StorageService, $rootScope) {
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
      }).catch(function(response){
        notyService.showError(response);
      });
      AuthServerProvider.getSecurityQuestions().then(function(response){
        $scope.questions = response.data
      }).catch(function(response){
        notyService.showError(response);
      });
      clinicadminService.getClinicsAssociated(StorageService.get('logged').userId).then(function(response){
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
    $scope.initSettings = function(){
      UserService.getUser(StorageService.get('logged').userId).then(function(response){
        $scope.user = response.data.user;
        $scope.processNotificationData();
      }).catch(function(response){
        notyService.showError(response);
      });

      clinicadminService.getClinicsAssociated(StorageService.get('logged').userId).then(function(response){
        $scope.clinics = response.data.clinics;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.init = function(){
      $scope.getisMessagesOpted();
      $scope.initCount($stateParams.clinicId);
      if($state.current.name === 'clinicadminUserProfile' || $state.current.name === 'editClinicadminProfile' || $state.current.name === 'clinicadminUpdatePassword'){
        $scope.initProfile(StorageService.get('logged').userId);
      }else if($state.current.name === 'clinicadminSettings'){
        $scope.initSettings();
      }
    };

    $scope.editMode = function(){
      $state.go('editClinicadminProfile',{'clinicId': $stateParams.clinicId});
    };

    $scope.switchProfileTab = function(status){
      $state.go(status,{'clinicId': $stateParams.clinicId});
      //$state.go(status);
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
      UserService.editUser($scope.user).then(function(response){        
        if(StorageService.get('logged').userEmail === $scope.user.email){
          notyService.showMessage(response.data.message, 'success');
          $state.go('clinicadminUserProfile');
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
      $scope.passordUpdateModal = false;
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
        notyService.showMessage(profile.PASSWORD_REST_ERROR, 'warning');
      });
    };

    $scope.cancel = function(){
      $state.go('clinicadminUserProfile');
    };

    $scope.goToPatientDashboard = function(value){
      var clinicId = $stateParams.clinicId;
      $state.go(value, {'clinicId': clinicId });
    };
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
    
    $scope.notificationFrequency = function(notification){
      var data = $scope.discardIncompleteData();
      UserService.updatePatientUserNotification(StorageService.get('logged').userId, data).then(function(response){
        $scope.user = response.data.user; 
      //  $scope.processNotificationData();   
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.showPassordUpdateModal = function(){
      $scope.submitted = true;
      if($scope.form.$invalid){
        return false;
      }else{
        $scope.passordUpdateModal = true;
      }
    };

    $scope.init();
  }]);