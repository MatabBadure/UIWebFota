'use strict';
angular.module('hillromvestApp')
  .controller('ResetPasswordController', ['$scope', '$stateParams', '$timeout', 'Auth', '$state', 'AuthServerProvider',
    function ($scope, $stateParams, $timeout, Auth, $state, AuthServerProvider) {

      $scope.keyMissing = $stateParams.key === undefined;
      $scope.doNotMatch = null;
      $scope.showCaptcha = false;
      $scope.resetAccount = {};
      $scope.questions = [];
      $scope.questionsNotLoaded = false;
      $scope.questionVerificationFailed = false;
      $scope.submitted = false;
      $scope.otherError = false;
      $scope.message = "";
      var data = {};
      $timeout(function () { angular.element('[ng-model="resetAccount.password"]').focus(); });
      $scope.formSubmit = function () {
        $scope.submitted = true;
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
        }).catch(function (err) {
          $scope.questionsNotLoaded = true;
        });

      $scope.resetPasswordUser = function () {
        if ($scope.form.$invalid) {
          return false;
        }
        $scope.error = null;
        if ($scope.resetAccount.password !== $scope.resetAccount.confirmPassword) {
          $scope.doNotMatch = 'ERROR';
          $scope.message = reset.finish.passwordNotMatched;
        } else {
          $scope.doNotMatch = null;
           data = {
            "questionId": ($scope.resetAccount.question && $scope.resetAccount.question.id) ? $scope.resetAccount.question.id : null,
            "answer": $scope.resetAccount.answer,
            "password": $scope.resetAccount.password,
            "termsAndConditionsAccepted": $scope.resetAccount.tnc,
            "key": $stateParams.key
          }
          Auth.configurePassword(data).then(function () {
            $scope.success = 'OK';
            $state.go('login');
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

    }]);