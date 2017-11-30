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
    $scope.isDisabled = false;
         $scope.noReason = false;
         $scope.reason = {};
         $scope.reason.deactivationReason = "";
         $scope.reason.reasonDetail = "";
         $scope.noOtherDescription = false;
         
    $scope.init = function() {   
     UserService.getdeactivationTypeCodeValues_Reason().then(function(response){
          $scope.reasonList = response.data.typeCode;
         //$scope.reasonList = $scope.typecodeResponse.typeCode;
        }).catch(function(response){
        notyService.showError(response);
      });  
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
            $scope.reason.deactivationReason = "";
            $scope.reason.reasonDetail = "";
          $scope.showModal = true;
        }
        else if(option == 'activate'){
          $scope.showActivateModal = true;
        }
        };
        $scope.close=function(){
         $scope.isDisabled = false;
         $scope.showModal = false;
        };
         $scope.deleteUserCSR = function(){
          // console.log("$scope.deactivationReason",$scope.deactivationReason)
          // if(!$scope.deactivationReason){
          //   $scope.noReason = true;
          //   return;
          // }
          // else{
          //   $scope.noReason = false;
          // } 
            if ($scope.reason.deactivationReason!="" && $scope.reason.deactivationReason!=undefined){
          console.log("in required",$scope.reason.deactivationReason);
          //Gimp-4
          if($scope.reason.deactivationReason === "Other"){ 
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
            UserService.deleteUserWithReason($scope.user.id,reason.toString()).then(function (response) {
            //End of Gimp-4
            $scope.reason.reasonDetail = "";
            $scope.reason.deactivationReason = "";
            $scope.showModal = false;
            $scope.userStatus.isMessage = true;
            $scope.userStatus.message = response.data.message;
            notyService.showMessage($scope.userStatus.message, 'success');
           if(StorageService.get('logged').role === 'CUSTOMER_SERVICES'){
            $state.go('customerserviceHillRomUser');
           }
          }).catch(function (response) {
            //$scope.reset();
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
        $scope.resendActivationLinkCSR = function(){
          UserService.resendActivationLink($scope.user.id).then(function(response){
            $scope.isDisableResendButton = true;
            notyService.showMessage(response.data.message, 'success'); 
          }).catch(function(response){
            notyService.showError(response);
          });
        };

        $scope.onSelectChange = function(){
          //console.log("kjhfg");
        

        if($scope.deactivationReason === 'Other'){ 
         $scope.isDisabled = false;  //enabling the text box because user selected 'Other' option.
         }
        }
        // $scope.changetextbox = function(){
        //   if($scope.deactivationReason){
        //     console.log("print the reason:",$scope.deactivationReason);
        //     } 
        // }
        $scope.showResetModel = function(){
          if($scope.form.$invalid){
            return true;
          }else{
            $scope.resetModal = true;
          }
        };

        //Gimp-4
       $scope.onSelectChange = function(){
        $scope.noReason = false;
        $scope.noOtherDescription = false;
          console.log("kjhfg",$scope.reason.deactivationReason);
        if($scope.reason.deactivationReason === "Other"){   
          console.log("in ifsfgssggs",$scope.reason.deactivationReason);
         $scope.isDisabled = true;  //enabling the text box because user selected 'Other' option.
         }
         else{
          //$scope.reasonDetail = $scope.reason.deactivationReason;
          console.log("in else",$scope.reason.deactivationReason);
          $scope.isDisabled = false; 
         }
        };
        //End of Gimp-4

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

    $scope.init();
  }]);
