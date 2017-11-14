'use strict';

angular.module('hillromvestApp')
.controller('ResetFinishController',['$scope', '$stateParams', '$timeout', 'Auth', '$state', 'AuthServerProvider',
function ($scope, $stateParams, $timeout, Auth, $state, AuthServerProvider) {

  $scope.keyMissing = $stateParams.key === undefined;
  $scope.doNotMatch = null;
  $scope.showCaptcha = false;
  $scope.resetAccount = {};
  $scope.questions = [];
  $scope.questionsNotLoaded = false;
  $scope.questionVerificationFailed =false;
  $scope.submitted  = false;
  $scope.otherError = false;
  $scope.message = "";
  $timeout(function (){angular.element('[ng-model="resetAccount.password"]').focus();});
  
  $scope.formSubmit = function(){
   $scope.submitted  = true;
  }

  AuthServerProvider.isValidResetKey($stateParams.key).
  then(function (response) {
    $scope.isActivateUser = true;
  }).catch(function (err) {
    $state.go("activationLinkErrorPage");
  });
  Auth.getSecurityQuestions().
  then(function (response) {
    $scope.questions = response.data;
  }).catch(function (err) {
    $scope.questionsNotLoaded = true;
  });

  $scope.finishReset = function() {
    if($scope.form.$invalid){
      return false;
    }  
    $scope.error = null;
    if ($scope.resetAccount.password !== $scope.resetAccount.confirmPassword) {
      $scope.doNotMatch = 'ERROR';
      $scope.message = reset.finish.passwordNotMatched;
    } else {
      $scope.doNotMatch = null;
      Auth.resetPasswordFinish($stateParams.key,$scope.resetAccount).then(function () {
        $scope.success = 'OK';
        $state.go('home');
      }).catch(function (response) {
        $scope.success = null;
        if(response.status === 400 && response.data.ERROR !== undefined){
          $scope.message = response.data.ERROR;
        }else{
          $scope.message = reset.finish.otherError;
        }
      });
    }
  };

$scope.div = function (x){
  return document.getElementById(x);
};

  $scope.compute_strength = function (x, y){
    if(!x){
      return -1;
    }
    var secondsInAYear = 31557600;
    var permutateRepeat = (Math.pow(x,y) - (x*$scope.factorial(y) - 1));
    var countManyYears = Math.floor(permutateRepeat/(1000000*secondsInAYear));

    return countManyYears;
  };

  $scope.factorial = function (x) {
    if(x<0){
      return false;
    }

    if(x == 0 ){
      return 1;
    }

    x = Math.floor(x);
    return (x*$scope.factorial(x-1));

  };
}]);
