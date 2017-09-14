'use strict';

angular.module('hillromvestApp')
  .controller('adminProfileController',['$scope', '$state', '$location', 'notyService', 'UserService', 'Password', 'Auth', 'AuthServerProvider', 'StorageService', 'loginConstants', '$rootScope',
    function ($scope, $state, $location, notyService, UserService, Password, Auth, AuthServerProvider, StorageService, loginConstants, $rootScope) {


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
      if($state.current.name === 'adminProfile' || $state.current.name === 'editAdminProfile' || $state.current.name === 'adminProfileRc' || $state.current.name === 'editAdminProfileRc' || $state.current.name === 'associateProfile' || $state.current.name === 'editAssociateProfile' || $state.current.name === 'customerserviceProfile' || $state.current.name === 'editcustomerserviceProfile'){
        $scope.initProfile(StorageService.get('logged').userId);
      }
      else if($state.current.name === 'RnDadminProfile'){
         $scope.initProfile(StorageService.get('logged').userId);
      }
    };

    $scope.editMode = function(){
      if($scope.role === loginConstants.role.acctservices){
        $state.go('editAdminProfileRc');
      }else if($scope.role === loginConstants.role.associates){
        $state.go('editAssociateProfile');
      }
      else if($scope.role === loginConstants.role.customerservices){
        $state.go('editcustomerserviceProfile');
      }
      else if($scope.role === loginConstants.role.FOTAAdmin){
        $state.go('editFotaAdminProfile');
      }
      else if($scope.role === loginConstants.role.FOTAAdmin){
        $state.go(status);
      }
      else {
        $state.go('editAdminProfile');
      }
    };

    $scope.switchProfileTab = function(status){
      if($scope.role === loginConstants.role.acctservices){
        $state.go(status+loginConstants.role.Rc);
      }else if($scope.role === loginConstants.role.associates){
        $state.go(status);
      }
      else if($scope.role === loginConstants.role.customerservices){
        $state.go(status);
      }
      else if($scope.role === loginConstants.role.FOTAAdmin){
        //console.log("tab");
        $state.go(status);
      }
      else{
        $state.go(status);
      }
    };

    $scope.updateProfile = function(){
      $scope.submitted = true;
      $scope.updateModal = false;
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
        var loggedUser = StorageService.get('logged');
        loggedUser.userFirstName = $scope.user.firstName;
        StorageService.save('logged', loggedUser);
        if(StorageService.get("logged").userEmail === $scope.user.email){
          notyService.showMessage(response.data.message, 'success');
          if($scope.role === loginConstants.role.acctservices){
            $state.go('adminProfileRc');
          }else if($scope.role === loginConstants.role.associates){
            $state.go('associateProfile');
          }
           else if($scope.role === loginConstants.role.customerservices){
            $state.go('customerserviceProfile');
          }
          else{
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
        'password': $scope.password,
        'newPassword': $scope.newPassword
      };
      Password.updatePassword(StorageService.get('logged').userId, data).then(function(response){
        Auth.logout();
        $rootScope.userRole = null;
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
      }else if($scope.role === loginConstants.role.associates){
        $state.go('associateProfile');
      }
      else if($scope.role === loginConstants.role.customerservices){
        $state.go('customerserviceProfile');
      }else {
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

    $scope.showUpdateModal = function(){
      if($scope.form.$invalid){
        return false;
      }else{
        $scope.updateModal = true;
      }
    };

    $scope.init();
  }]);