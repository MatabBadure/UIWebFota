'use strict';

angular.module('hillromvestApp')
  .controller('adminProfileController',['$scope', '$state', '$location', 'notyService', 'UserService', 'Password', 'Auth', 'AuthServerProvider', 'StorageService', 'loginConstants',
    function ($scope, $state, $location, notyService, UserService, Password, Auth, AuthServerProvider, StorageService, loginConstants) {


    $scope.isActive = function(tab) {
      var path = $location.path();
      if (path.indexOf(tab) !== -1) {
        return true;
      } else {
        return false;
      }
    };
    $scope.role =StorageService.get('logged').role;
    $scope.initProfile = function(adminId){
      UserService.getUser(adminId).then(function(response){
        $scope.user = response.data.user;
      }).catch(function(response){});
      AuthServerProvider.getSecurityQuestions().then(function(response){
        $scope.questions = response.data
      }).catch(function(response){});
    };

    $scope.init = function(){
      if($state.current.name === 'adminProfile' || $state.current.name === 'editAdminProfile' || $state.current.name === 'adminProfileRc' || $state.current.name === 'editAdminProfileRc'){
        $scope.initProfile(StorageService.get('logged').userId);
      }
    };

    $scope.editMode = function(){
      if($scope.role === loginConstants.role.acctservices){
        $state.go('editAdminProfileRc');
      }else{
        $state.go('editAdminProfile');
      }
    };

    $scope.switchProfileTab = function(status){
      if($scope.role === loginConstants.role.acctservices){
        $state.go(status+loginConstants.role.Rc);
      }else{
        $state.go(status);
      }
    };

    $scope.updateProfile = function(){
      $scope.submitted = true;
      $scope.showUpdateModal = false;
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
        if(StorageService.get("logged").userEmail === $scope.user.email){
          notyService.showMessage(response.data.message, 'success');
          if($scope.role === loginConstants.role.acctservices){
            $state.go('adminProfileRc');
          }else{
            $state.go('adminProfile');
          }
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
      $scope.paasordUpdateModal = false;
      if($scope.form.$invalid){
        return false;
      }
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
          notyService.showMessage(profile.PASSWORD_REST_ERROR, 'warning');
        }else if(response.data.ERROR){
          notyService.showMessage(profile.PASSWORD_REST_ERROR, 'warning');
        }
      });
    };

    $scope.cancel = function(){
      if($scope.role === loginConstants.role.acctservices){
        $state.go('adminProfileRc');
      }else{
        $state.go('adminProfile');
      }
    };

    $scope.showPasswordUpdateModal = function(){
      $scope.submitted = true;
      if($scope.form.$invalid){
        return false;
      }else {
        $scope.paasordUpdateModal = true;
      }
    };

    $scope.init();
  }]);