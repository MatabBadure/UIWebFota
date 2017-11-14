'use strict';

angular.module('hillromvestApp')
  .controller('hcpProfileController',['$scope', '$state', '$stateParams', '$location', 'notyService', 'UserService', 'Password', 'Auth', 'AuthServerProvider', 'DoctorService', 'StorageService', 'commonsUserService', '$rootScope',
    function ($scope, $state, $stateParams, $location, notyService, UserService, Password, Auth, AuthServerProvider, DoctorService, StorageService, commonsUserService, $rootScope) {


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
    };

    $scope.initSettings = function(){
      UserService.getUser(StorageService.get('logged').userId).then(function(response){
        $scope.user = response.data.user;
      }).catch(function(response){
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

    $scope.toggleNotification = function(notification){
      var data = {"isMissedTherapyNotification" : $scope.user.missedTherapyNotification, "isNonHMRNotification": $scope.user.nonHMRNotification, "isSettingDeviationNotification": $scope.user.settingDeviationNotification, "isMessageNotification": $scope.user.messageNotification};
      if(notification === 'missedTherapyNotification'){
        data.isMissedTherapyNotification = !$scope.user.missedTherapyNotification;
      }
      if(notification === 'nonHMRNotification'){
        data.isNonHMRNotification = !$scope.user.nonHMRNotification;
      }
      if(notification === 'settingDeviationNotification'){
        data.isSettingDeviationNotification = !$scope.user.settingDeviationNotification;
      }
      if(notification === 'messageNotification')
      {
        data.isMessageNotification = !$scope.user.messageNotification;
      }
      UserService.updatePatientUserNotification(StorageService.get('logged').userId, data).then(function(response){
        $scope.user = response.data.user;    
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