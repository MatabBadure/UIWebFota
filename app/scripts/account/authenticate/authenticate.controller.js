'use strict';

angular.module('hillromvestApp')
.controller('AuthenticateController',['$scope', 'Auth', '$state', '$stateParams', 'AuthServerProvider',
  function ($scope, Auth, $state, $stateParams,AuthServerProvider) {

    $scope.questionVerificationFailed = false;
    $scope.success = false;
    $scope.doNotMatch = false;
    $scope.alreadyActive = false;
    $scope.authenticate = {};
    $scope.isServerError = false;
    $scope.serverErrorMessage = '';
    $scope.formSubmit = function(){
       $scope.submitted  = true;
   }
   
   AuthServerProvider.isValidActivationKey($stateParams.key).
   then(function (response) {
      $scope.isActivateUser = true;
    }).catch(function (err) {
       $state.go("activationLinkErrorPage");
    });

   Auth.getSecurityQuestions().
   then(function (response) {
    $scope.questions = response.data;
    }).catch(function (response) {
      $scope.showServerError(response);
    });

$scope.authenticate = function(event) {
   event.preventDefault();
   if($scope.form.$invalid){
    return false;
   }
   $scope.error = null;
   if ($scope.authenticate.password !== $scope.authenticate.confirmPassword) {
    $scope.doNotMatch = 'ERROR';
} else {
   $scope.doNotMatch = null;
   var data = {
       "questionId" : ($scope.authenticate.question && $scope.authenticate.question.id) ? $scope.authenticate.question.id : null,
       "answer" : $scope.authenticate.answer,
       "password" : $scope.authenticate.password,
       "termsAndConditionsAccepted" : $scope.authenticate.tnc,
       "key" : $stateParams.key
   }
   Auth.activateAccount({key: $stateParams.key}).then(function () {
        $scope.authenticateCred(data);
    }).catch(function (response) {
      $scope.showServerError(response);
    });
  }
};

$scope.authenticateCred = function(data){
  Auth.configurePassword(data).then(function () {
    $scope.success = true;
    $state.go('postActivateLogin');
  }).catch(function (response) {
      $scope.success = false;
      $scope.showServerError(response);
      if(response.status == 400 && response.data.ERROR == "Invalid Activation Key"){
         $scope.alreadyActive = true;
     }
  });
};

$scope.div = function (x){
    return document.getElementById(x);
};

$scope.showServerError = function(response){
  $scope.isServerError = true;
  if(response.data.message){
    $scope.serverErrorMessage = response.data.message;
  }else if(response.data.ERROR){
    $scope.serverErrorMessage = response.data.ERROR;
  }
};

}]);