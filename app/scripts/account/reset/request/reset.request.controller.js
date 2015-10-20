'use strict';

angular.module('hillromvestApp')
.controller('RequestResetController',['$scope', '$timeout', 'Auth', 'vcRecaptchaService', 'StorageService',
  function ($scope, $timeout, Auth, vcRecaptchaService, StorageService) {
    $scope.success = null;
    $scope.error = null;
    $scope.errorEmailNotExists = null;
    $scope.resetAccount = {};
    $scope.showCaptcha = false;
    $scope.user = {};
    $scope.response = null;
    $scope.widgetId = null;
    $scope.captchaError = false;
    $scope.siteKey ='6LcXjQkTAAAAAMZ7kb5v9YZ8vrYKFJmDcg2oE-SH';
    $scope.submitted = false;
        
    $timeout(function (){angular.element('[ng-model="resetAccount.email"]').focus();});

    $scope.setResponse = function (response) {
        $scope.response = response;
    };
        
    $scope.setWidgetId = function (widgetId) {
        $scope.widgetId = widgetId;
    };
    
    $scope.requestReset = function () {
      $scope.submitted = true;
      if($scope.form.email.$invalid ||($scope.showCaptcha && $scope.response === null)){
        return false;
      }
    	if($scope.showCaptcha){
        Auth.captcha($scope.response).then(function (data) {
          $scope.showCaptcha = false;
          Auth.resetPasswordInit($scope.resetAccount.email).then(function () {
            $scope.success = 'OK';
            $scope.errorEmailNotExists = null;
            StorageService.save('passResetCount',0);
          }).catch(function (response) {
            $scope.success = null;
            if (response.status === 400 && response.data.message === 'e-mail address not registered') {
              $scope.errorEmailNotExists = 'ERROR';
              var passResetCount = parseInt(StorageService.get('passResetCount')) || 0;
              StorageService.save('passResetCount', passResetCount + 1);
              if(passResetCount >= 2){
                $scope.showCaptcha = true;
              }
            } else {
              $scope.error = 'ERROR';
            }
          });
        }).catch(function (err) {
          $scope.captchaError = true;
          $scope.response = null;
          vcRecaptchaService.reload($scope.widgetId);
        });
      }else{
   		  Auth.resetPasswordInit($scope.resetAccount.email).then(function () {
          $scope.success = 'OK';
          $scope.errorEmailNotExists = null;
          StorageService.save('passResetCount',0);
        }).catch(function (response) {
          $scope.success = null;
          if (response.status === 400 && response.data.message === 'e-mail address not registered') {
              $scope.errorEmailNotExists = 'ERROR';
              var passResetCount = parseInt(StorageService.get('passResetCount')) || 0;
              StorageService.save('passResetCount', passResetCount + 1);
              if(passResetCount >= 2){
              	$scope.showCaptcha = true;
              }
          } else {
              $scope.error = 'ERROR';
          }
        });
      }     	
    }
  }]);
