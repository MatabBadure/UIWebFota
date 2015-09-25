'use strict';

angular.module('hillromvestApp')
  .controller('hcpProfileController',['$scope', '$state', '$stateParams', '$location', 'notyService', 'UserService', 'Password', 'Auth', 'AuthServerProvider', 'DoctorService', function ($scope, $state, $stateParams, $location, notyService, UserService, Password, Auth, AuthServerProvider, DoctorService) {


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
        $scope.user.role = localStorage.getItem('role');
      }).catch(function(response){
        notyService.showError(response);
      });
      AuthServerProvider.getSecurityQuestions().then(function(response){
        $scope.questions = response.data
      }).catch(function(response){
        notyService.showError(response);
      });
      DoctorService.getClinicsAssociatedToHCP(localStorage.getItem('userId')).then(function(response){
        $scope.clinics = response.data.clinics;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.initSettings = function(){
      UserService.getUser(localStorage.getItem('userId')).then(function(response){
        $scope.user = response.data.user;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.init = function(){
      if($state.current.name === 'hcpUserProfile' || $state.current.name === 'editHCPProfile' ){
        $scope.initProfile(localStorage.getItem('userId'));
      }else if($state.current.name === 'hcpSettings'){
        $scope.initSettings();
      }
    };

    $scope.editMode = function(){
      $state.go('editHCPProfile');
    };

    $scope.switchProfileTab = function(status){
      $state.go(status);
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
        if(localStorage.getItem("userEmail") === $scope.user.email){
          notyService.showMessage(response.data.message, 'success');
          $state.go('hcpUserProfile');
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
      if($scope.form.$invalid){
        return false;
      }
      var data = {
        'password': $scope.profile.password,
        'newPassword': $scope.profile.newPassword
      };
      Password.updatePassword(localStorage.getItem('userId'), data).then(function(response){
        Auth.logout();
        notyService.showMessage(response.data.message, 'success');
        $state.go('login');
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.toggleNotification = function(notification){
      var data = {"isMissedTherapyNotification" : $scope.user.missedTherapyNotification, "isNonHMRNotification": $scope.user.nonHMRNotification, "isSettingDeviationNotification": $scope.user.settingDeviationNotification };
      if(notification === 'missedTherapyNotification'){
        data.isMissedTherapyNotification = !$scope.user.missedTherapyNotification;
      }
      if(notification === 'nonHMRNotification'){
        data.isNonHMRNotification = !$scope.user.nonHMRNotification;
      }
      if(notification === 'settingDeviationNotification'){
        data.isSettingDeviationNotification = !$scope.user.settingDeviationNotification;
      }
      UserService.updatePatientUserNotification(localStorage.getItem('userId'), data).then(function(response){
        $scope.user = response.data.user;    
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.cancel = function(){
      $state.go('hcpUserProfile');
    };

    $scope.goToPatientDashboard = function(value){
      $state.go(value, {'clinicId': $scope.clinics[0].id});
    };
    $scope.init();
  }]);