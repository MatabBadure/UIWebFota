'use strict';
/**
 * @ngdoc directive
 * @name user
 *
 * @description
 * User Directive with create, edit and delete functions
 */
angular.module('hillromvestApp')
  .directive('user', function () {
    return {
      templateUrl: 'scripts/modules/admin/hill-rom-user/directives/create-edit/create.html',
      restrict: 'E',
      scope: {
        user: '=userData',
        // isCreate: '=isCreate',
        onSuccess: '&',
        userStatus: '=userStatus'
      },
      controller: ['$scope', 'notyService', '$state', 'UserService', 'StorageService', 'Auth', '$rootScope', function ($scope, notyService, $state, UserService, StorageService, Auth, $rootScope) {

        $scope.init = function(){
          $scope.nonHillRomUsers = ['PATIENT', 'HCP', 'CLINIC_ADMIN', 'CARE_GIVER'];
          if($state.current.name === 'hillRomUserEdit'){
            $scope.loggedUserId = StorageService.get('logged').userId;
          }
        };
        $scope.open = function () {
          $scope.showModal = true;
        };

        $scope.close = function () {
          $scope.showModal = false;
        };

        $scope.submitted = false;
        $scope.formSubmit = function () {
          $scope.submitted = true;
        };

        $scope.validateSuperAdmin = function () {
          if ($scope.userStatus.editMode && $scope.userStatus.role !== roleEnum.ADMIN) {
            return true;
          }
        };

        /**
         * @ngdoc function
         * @name createUser
         * @description
         * Function to create a user
         */
        $scope.createUser = function () {
          $scope.showUpdateModal = false;
          if ($scope.form.$invalid) {
            return false;
          }
          if ($scope.userStatus.editMode) {
            //will be removed when we support multiple role
            if($scope.user.authorities){
              delete $scope.user.authorities;
            }
            $scope.editUser($scope.user);
          } else {
            $scope.newUser($scope.user);
          }
        };

        $scope.$on('getUserDetail', function (event, args){
          if(args.user.email === StorageService.get('logged').userEmail){
            $scope.selectedSelf = true;
            $scope.myHRID = args.user.hillromId;
          }
        });

        $scope.newUser = function(data) {
          UserService.createUser(data).then(function (response) {
            $scope.userStatus.isMessage = true;
            $scope.userStatus.message = 'User created successfully';
            notyService.showMessage($scope.userStatus.message, 'success');
            $scope.reset();
          }).catch(function (response) {
            $scope.userStatus.isMessage = true;
            if (response.data.message !== undefined) {
              $scope.userStatus.message = response.data.message;
            }else if(response.data.ERROR !== undefined){
              $scope.userStatus.message = response.data.ERROR;
            } else {
              $scope.userStatus.message = 'Error occured! Please try again';
            }
            notyService.showMessage($scope.userStatus.message, 'warning');
          });
        };

        $scope.editUser = function(data) {
          UserService.editUser(data).then(function (response) {
            $scope.userStatus.isMessage = true;
            $scope.userStatus.message = response.data.message;
            notyService.showMessage($scope.userStatus.message, 'success');
            if($scope.selectedSelf && (StorageService.get('logged').userEmail !== response.data.user.email || $scope.myHRID !== response.data.user.hillromId) ){
              $rootScope.userRole = null;
              Auth.logout();
              $state.go('login');
            }else{
              $scope.reset();
            }
          }).catch(function (response) {
            $scope.userStatus.isMessage = true;
            if (response.data.message !== undefined) {
              $scope.userStatus.message = response.data.message;
            }else if(response.data.ERROR !== undefined){
              $scope.userStatus.message = response.data.ERROR;
            } else {
              $scope.userStatus.message = 'Error occured! Please try again';
            }
            notyService.showMessage($scope.userStatus.message, 'warning');
          });
        };

        /**
         * @ngdoc function
         * @name deleteUser
         * @description
         * Function to delete a User
         */
        $scope.deleteUser = function () {
          UserService.deleteUser($scope.user.id).then(function (response) {
            $scope.showModal = false;
            $scope.userStatus.isMessage = true;
            $scope.userStatus.message = response.data.message;
            notyService.showMessage($scope.userStatus.message, 'success');
            $scope.reset();
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

        $scope.cancel = function(){
          $scope.reset();
        };

        $scope.resendActivationLink = function(){
          UserService.resendActivationLink($scope.user.id).then(function(response){
            notyService.showMessage(response.data.message, 'success'); 
          }).catch(function(response){
            notyService.showError(response);
          });
        };

        $scope.activateUser = function(){
          $scope.showActivateModal = false;
          UserService.reactivateUser($scope.user.id).then(function(response){
           notyService.showMessage(response.data.message, 'success');
           $state.go('hillRomUser');
          }).catch(function(response){
           notyService.showError(response);
          });
        };

        $scope.reset = function(){
          $scope.user = {};
          $scope.userStatus.isCreate = false;
          $scope.userStatus.editMode = false;
          $scope.form.$setPristine();
          $scope.submitted = false;
          $state.go('hillRomUser');
        };

        $scope.init();
      }]
    };
  });