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
        $scope.currentUserRole = StorageService.get('logged').role;
        $scope.isDisabled = false;
         $scope.noReason = false;
         $scope.reason = {};
         $scope.reason.deactivationReason = "";
         $scope.reason.reasonDetail = "";
         $scope.noOtherDescription = false;
         $scope.reasonList = {}
        $scope.init = function () {
          UserService.getdeactivationTypeCodeValues_Reason().then(function(response){
          $scope.reasonList = response.data.typeCode;
          console.log("$scope.reasonList",$scope.reasonList);
         //$scope.reasonList = $scope.typecodeResponse.typeCode;
        }).catch(function(response){
        notyService.showError(response);
      });
    
          $scope.nonHillRomUsers = ['PATIENT', 'HCP', 'CLINIC_ADMIN', 'CARE_GIVER'];

          if ($state.current.name === 'hillRomUserEdit' || $state.current.name === 'rcadmin-hillRomUserEdit' || $state.current.name === 'customerserviceHillRomUserView') {

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
           $scope.isUser =   ($scope.user.role === 'CARE_GIVER' || $scope.user.role === 'PATIENT' || $scope.user.role === 'HCP' || $scope.user.role === 'CLINIC_ADMIN') ? true : false;
            $scope.isSuperadmin = ($scope.user.role === 'ADMIN' && $scope.currentUserRole === 'ACCT_SERVICES') ? true : false;
          if ($scope.userStatus.editMode && !($scope.userStatus.role === roleEnum.ADMIN || $scope.userStatus.role === roleEnum.ACCT_SERVICES)) {
            return true;
          }
          else return false;
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
            if ($scope.user.authorities) {
              delete $scope.user.authorities;
            }
            $scope.editUser($scope.user);
          } else {
            $scope.newUser($scope.user);
          }
        };

        $scope.$on('getUserDetail', function (event, args) {
          
          if (args.user.email === StorageService.get('logged').userEmail) {
            $scope.selectedSelf = true;
            $scope.myHRID = args.user.hillromId;
          }
        });

        $scope.newUser = function (data) {
          UserService.createUser(data).then(function (response) {
            $scope.userStatus.isMessage = true;
            $scope.userStatus.message = 'User created successfully';
            notyService.showMessage($scope.userStatus.message, 'success');
            $scope.reset();
          }).catch(function (response) {
            $scope.userStatus.isMessage = true;
            if (response.data.message !== undefined) {
              $scope.userStatus.message = response.data.message;
            } else if (response.data.ERROR !== undefined) {
              $scope.userStatus.message = response.data.ERROR;
            } else {
              $scope.userStatus.message = 'Error occured! Please try again';
            }
            notyService.showMessage($scope.userStatus.message, 'warning');
          });
        };

        $scope.editUser = function (data) {
          UserService.editUser(data).then(function (response) {
            $scope.userStatus.isMessage = true;
            $scope.userStatus.message = response.data.message;
            notyService.showMessage($scope.userStatus.message, 'success');
            if ($scope.selectedSelf && (StorageService.get('logged').userEmail !== response.data.user.email || $scope.myHRID !== response.data.user.hillromId)) {
              $rootScope.userRole = null;
              Auth.logout();
              $state.go('login');
            } else {
              $scope.reset();
            }
          }).catch(function (response) {
            $scope.userStatus.isMessage = true;
            if (response.data.message !== undefined) {
              $scope.userStatus.message = response.data.message;
            } else if (response.data.ERROR !== undefined) {
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

            //Type code values  
          if ($scope.reason.deactivationReason!="" && $scope.reason.deactivationReason!=undefined){
          console.log("in required",$scope.reason.deactivationReason);
          //Gimp-4
          if($scope.reason.deactivationReason === "other"){ 
            if($scope.reason.reasonDetail){
            var reason = $scope.reason.reasonDetail;
          }
          else{
            $scope.noOtherDescription = true;
            return;
          }
          }
          else{
            var reason = $scope.reason.deactivationReason;
          }
            UserService.deleteUserWithReason($scope.user.id,reason).then(function (response) {
            //End of Gimp-4
            $scope.reason.reasonDetail = "";
            $scope.reason.deactivationReason = "";
            $scope.showModal = false;
            $scope.userStatus.isMessage = true;
            $scope.userStatus.message = response.data.message;
            notyService.showMessage($scope.userStatus.message, 'success');
            $scope.reset();
          }).catch(function (response) {
            $scope.reset();
            $scope.showModal = false;
            $scope.userStatus.isMessage = true;
            if (response.data.message !== undefined) {
              $scope.userStatus.message = response.data.message;
            } else if (response.data.ERROR !== undefined) {
              $scope.userStatus.message = response.data.ERROR;
            } else {
              $scope.userStatus.message = 'Error occured! Please try again';
            }
            notyService.showMessage($scope.userStatus.message, 'warning');
          });
        }
          else{
         // $scope.msg = 'Please Select the reason';
         $scope.noReason = true;
         console.log("masigf");
        }

          console.log("in deleteUser 11111",$scope.reason.deactivationReason);
          console.log("in deleteUser 22222",$scope.reason.reasonDetail);
        };

        $scope.cancel = function () {
          $scope.reset();
        };

        $scope.resendActivationLink = function () {
          UserService.resendActivationLink($scope.user.id).then(function (response) {
            $scope.isDisableResendButton = true;
            notyService.showMessage(response.data.message, 'success');
          }).catch(function (response) {
            notyService.showError(response);
          });
        };

        $scope.activateUser = function () {
          $scope.showActivateModal = false;
          UserService.reactivateUser($scope.user.id).then(function (response) {
            notyService.showMessage(response.data.message, 'success');
            if ($scope.currentUserRole == 'ADMIN') {
              $state.go('hillRomUser');
            }
            else if ($scope.currentUserRole == 'ACCT_SERVICES') {
              $state.go('rcadmin-hillRomUser');
            }
          }).catch(function (response) {
            notyService.showError(response);
          });
        };

        $scope.reset = function () {
          $scope.user = {};
          $scope.userStatus.isCreate = false;
          $scope.userStatus.editMode = false;
          $scope.form.$setPristine();
          $scope.submitted = false;
          if ($scope.currentUserRole == 'ADMIN') {
            $state.go('hillRomUser');
          }
          else if ($scope.currentUserRole == 'ACCT_SERVICES') {
            $state.go('rcadmin-hillRomUser');
          }
        };

        $scope.resetUser = function () {
          $scope.resetModal = false;
          UserService.resetPasswordUser($scope.user.id).then(function (response) {
            notyService.showMessage(response.data.message, 'success');
            if ($scope.currentUserRole == 'ADMIN') {
              $state.go('hillRomUser');
            }
            else if ($scope.currentUserRole == 'ACCT_SERVICES') {
              $state.go('rcadmin-hillRomUser');
            }
          }).catch(function (response) {
            notyService.showError(response);
          });
        };

        $scope.showUpdateModal = function () {
          $scope.submitted = true;
          if ($scope.form.$invalid) {
            return false;
          }
          $scope.updateModal = true;
        };
        $scope.showResetModel = function(){
          if($scope.form.$invalid){
            return true;
          } else{
            $scope.resetModal = true;
          }
        };
//Gimp-4
       $scope.onSelectChange = function(){
        $scope.noReason = false;
        $scope.noOtherDescription = false;
          console.log("kjhfg",$scope.reason.deactivationReason);
        if($scope.reason.deactivationReason === "other"){ 
          console.log("in ifsfgssggs",$scope.reason.deactivationReason);
        // $scope.reason.reasonDetail = "";
         $scope.isDisabled = true;  //enabling the text box because user selected 'Other' option.
         }
         else{
          //$scope.reasonDetail = $scope.reason.deactivationReason;
          console.log("in else",$scope.reason.deactivationReason);
          $scope.isDisabled = false; 
         }
        };
        //End of Gimp-4
        $scope.init();
      }]
    };
  });