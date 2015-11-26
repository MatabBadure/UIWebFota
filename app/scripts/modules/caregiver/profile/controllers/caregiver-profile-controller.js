'use strict';

angular.module('hillromvestApp')
  .controller('caregiverProfileController',['$scope', '$state', '$location', 'notyService', 'UserService', 'Password', 'Auth', 'AuthServerProvider', 'StorageService', function ($scope, $state, $location, notyService, UserService, Password, Auth, AuthServerProvider, StorageService) {


    $scope.isActive = function(tab) {
      var path = $location.path();
      if (path.indexOf(tab) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    $scope.initProfile = function(userId){
      $scope.associateCareGiver = {};
      UserService.getRelationships().then(function(response) {
        $scope.relationships = response.data.relationshipLabels;
      });
      UserService.getState().then(function(response) {
        $scope.states = response.data.states;        
      });
      UserService.getUser(userId).then(function(response){
          $scope.associateCareGiver = response.data.user;
      });
    };

    $scope.init = function(){
      if($state.current.name === 'caregiverProfile' || $state.current.name === 'caregiverProfileEdit' ){
        $scope.initProfile(StorageService.get('logged').userId);
      } else if($state.current.name === 'caregiverChangePassword'){
          $scope.profile = {};
          AuthServerProvider.getSecurityQuestions().then(function(response){
            $scope.questions = response.data
          });
      }
    };

    $scope.editMode = function(){
      $state.go('caregiverProfileEdit');
    };

    $scope.updateCaregiver = function(careGiver){
      careGiver.role = 'CARE_GIVER';
      UserService.editUser(careGiver).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $state.go('caregiverProfile');
      }).catch(function(response){
        notyService.showMessage(response.data.message, 'warning');
      });
    };

    $scope.updateProfile = function(){
      $scope.submitted = true;
      $scope.showUpdateModal = false;
      if($scope.form.$invalid){
        return false;
      }
      $scope.updateCaregiver($scope.associateCareGiver);
    };

    $scope.changePassword = function(){
      var data = {
        'password': $scope.profile.password,
        'newPassword': $scope.profile.newPassword
      };

      Password.updatePassword(StorageService.get('logged').userId, data).then(function(response){
        Auth.logout();
        notyService.showMessage(response.data.message, 'success');
        $state.go('login');
      }).catch(function(response){
        if(response.data.message){
          notyService.showMessage(response.data.message, 'warning');
        }else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR, 'warning');
        }
      });
    };

    $scope.updatePassword = function(){
      $scope.submitted = true;
      $scope.passwordUpdateModal = false;
      if($scope.form.$invalid){
        return false;
      }
      if($scope.resetAccount){
        var data = {
          "questionId": $scope.resetAccount.question.id,
          "answer": $scope.resetAccount.answer
        };
        AuthServerProvider.changeSecurityQuestion(data, StorageService.get('logged').userId).then(function(response){
          $scope.changePassword();
        }).catch(function(response){
          if(response.data.message){
            notyService.showMessage(response.data.message, 'warning');
          } else if(response.data.ERROR){
            notyService.showMessage(response.data.ERROR, 'warning');
          }
        });
      } else{
        $scope.changePassword();
      }
    };

    $scope.cancel = function(){
      $state.go('caregiverProfile');
    };

    $scope.showPasswordUpdateModal = function(){
      $scope.submitted = true;
      if($scope.form.$invalid){
        console.log('Is itr comijngfoe gdsjhfk');
        return false;
      }else{
        $scope.passwordUpdateModal = true;
      }
    };

    $scope.init();
  }]);