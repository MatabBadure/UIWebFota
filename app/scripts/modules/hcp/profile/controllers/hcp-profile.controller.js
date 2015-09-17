'use strict';

angular.module('hillromvestApp')
  .controller('hcpProfileController', function ($rootScope, $scope, $state, $stateParams, $location, notyService, UserService, Password, Auth, AuthServerProvider) {


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
      }).catch(function(response) {});
      $scope.credentialsList = admin_cont.hcp.credentialsList;
      UserService.getUser(adminId).then(function(response){
        $scope.user = response.data.user;
      }).catch(function(response){});
      AuthServerProvider.getSecurityQuestions().then(function(response){
        $scope.questions = response.data
      }).catch(function(response){});
    };

    $scope.init = function(){
      if($state.current.name === 'hcpUserProfile' || $state.current.name === 'editHCPProfile' ){
        $scope.initProfile(localStorage.getItem('userId'));
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
          if(response.data.message){
            notyService.showMessage(response.data.message, 'warning');
          } else if(response.data.ERROR){
            notyService.showMessage(response.data.ERROR, 'warning');
          }
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
        if(response && response.data && response.data.message){
          notyService.showMessage(response.data.message, 'warning');
        } else if(response && response.data && response.data.ERROR){
          notyService.showMessage(response.data.ERROR, 'warning');
        }
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
        if(response.data.message){
          notyService.showMessage(response.data.message, 'warning');
        }else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR, 'warning');
        }
      });
    };

    $scope.cancel = function(){
      $state.go('hcpUserProfile');
    };

    $scope.goToPatientDashboard = function(value){
      $state.go(value);
    };

    $scope.init();
  });