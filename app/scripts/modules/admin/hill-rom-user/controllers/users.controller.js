'use strict';

angular.module('hillromvestApp')
  .controller('UsersController',['$scope', 'UserService', '$state', '$stateParams', 'StorageService', 'notyService', 'loginConstants',
    function($scope, UserService, $state, $stateParams, StorageService, notyService,loginConstants) {
    $scope.user = {};
    $scope.userStatus = {
      'role': StorageService.get('logged').role,
      'editMode': false,
      'isCreate': false,
      'isMessage': false
    };

    $scope.init = function() {
      var currentRoute = $state.current.name;

      if ($state.current.name === 'hillRomUserEdit' || $state.current.name === 'associateHillRomUserView' || $state.current.name === 'rcadmin-hillRomUserEdit' || $state.current.name === 'customerserviceHillRomUserView') {
        $scope.getUserDetails($stateParams.userId, $scope.setEditMode);
      } else if ($state.current.name === 'hillRomUserNew' || $state.current.name === 'rcadmin-hillRomUserNew') {
        $scope.createUser();
      }
    };

    $scope.setEditMode = function(user) {
      $scope.userStatus.editMode = true;
      $scope.userStatus.isCreate = false;
      $scope.user = user;
    };

    $scope.getUserDetails = function(userId, callback) {
      UserService.getUser(userId).then(function(response) {
        response.data.user.role = response.data.user.authorities[0].name;
        $scope.user = response.data.user;
        if (typeof callback === 'function') {
          callback($scope.user);
        }
        $scope.$broadcast('getUserDetail', {user: $scope.user});
      }).catch(function(response) {
        notyService.showError(response);
        if($scope.userStatus.role == 'ADMIN'){
          $state.go('hillRomUser');
        }
         else if($scope.userStatus.role == 'ACCT_SERVICES'){
          $state.go('rcadmin-hillRomUser');
        }
        
      });
    };


    $scope.selectedUser = function(user) {
      $scope.userStatus.isCreate = false;
      $scope.userStatus.editMode = true;
      $scope.user = user;
    };

    $scope.createUser = function() {
      $scope.userStatus.isCreate = true;
      $scope.userStatus.isMessage = false;
      $scope.user = {
        title: hillRomUser.title,
        role: hillRomUser.role
      };
    };

    $scope.onSuccess = function() {
      $scope.$broadcast('resetList', {});
    };

    $scope.back = function(){
      var role = StorageService.get('logged').role;
    if(role === loginConstants.role.associates){
            $state.go('associateHillRomUser');
          }else if(role === loginConstants.role.customerservices){
            $state.go('customerserviceHillRomUser');
          }
    };

$scope.activateUserCSR = function(){
          $scope.showActivateModal = false;
          UserService.reactivateUser($scope.user.id).then(function(response){
           notyService.showMessage(response.data.message, 'success');
          if(StorageService.get('logged').role === 'CUSTOMER_SERVICES'){
            $state.go('customerserviceHillRomUser');
           }
          }).catch(function(response){
           notyService.showError(response);
          });
        };
        $scope.open = function (option) {
          if(option == 'deactivate'){
          $scope.showModal = true;
        }
        else if(option == 'activate'){
          $scope.showActivateModal = true;
        }
        };
        $scope.close = function () {
       $scope.showModal = false;
        };
         $scope.deleteUserCSR = function () {
          UserService.deleteUser($scope.user.id).then(function (response) {
            $scope.showModal = false;
            $scope.userStatus.isMessage = true;
            $scope.userStatus.message = response.data.message;
            notyService.showMessage($scope.userStatus.message, 'success');
            //$scope.reset();
            if(StorageService.get('logged').role === 'CUSTOMER_SERVICES'){
            $state.go('customerserviceHillRomUser');
           }
            
          }).catch(function (response) {
            $scope.showModal = false;
            $scope.userStatus.isMessage = true;
            if(response.data.message !== undefined) {
              $scope.userStatus.message = response.data.message;
            } else if(response.data.ERROR !== undefined){
              $scope.userStatus.message = response.data.ERROR;
            } else {
              $scope.userStatus.message = 'Error occured! Please try again';
            }
            notyService.showMessage($scope.userStatus.message, 'warning');
          });
        };
        $scope.resendActivationLinkCSR = function(){
          UserService.resendActivationLink($scope.user.id).then(function(response){
            $scope.isDisableResendButton = true;
            notyService.showMessage(response.data.message, 'success'); 
          }).catch(function(response){
            notyService.showError(response);
          });
        };
    $scope.init();
  }]);
