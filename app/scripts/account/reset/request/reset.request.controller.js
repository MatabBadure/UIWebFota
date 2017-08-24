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
    $scope.siteKey ='6LdXAi4UAAAAANmuHKtaEFqkCE_XLRE_qS4jgGxJ';
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
            $scope.response = null;
            $scope.errorEmailNotExists = 'ERROR';
            $scope.errorMailMessage = '';
            $scope.errorMailContact = '';
            var passResetCount = parseInt(StorageService.get('passResetCount')) || 0;
            StorageService.save('passResetCount', passResetCount + 1);
            if(passResetCount >= 2){
              vcRecaptchaService.reload($scope.widgetId);
              $scope.showCaptcha = true;
            }
            if (response.status === 400 && response.data.message === 'e-mail address not registered') {              
              $scope.errorMailMessage = resetpassword.error.email_is_not_registered;
              $scope.errorMailContact = resetpassword.error.conatct_message;
            } else if (response.status === 400 && response.data.message.indexOf('Kindly contact with Administrator') !== -1 ) {
              $scope.errorMailMessage = resetpassword.error.unauthorized_email;
              $scope.errorMailContact = resetpassword.error.contact_message_for_unauthorized_mail;
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
          $scope.errorEmailNotExists = 'ERROR';
          $scope.errorMailMessage = '';
          $scope.errorMailContact = '';
          var passResetCount = parseInt(StorageService.get('passResetCount')) || 0;
          StorageService.save('passResetCount', passResetCount + 1);
          if(passResetCount >= 2){
            vcRecaptchaService.reload($scope.widgetId);
            $scope.showCaptcha = true;
          }
          if (response.status === 400 && response.data.message === 'e-mail address not registered') {
              $scope.errorMailMessage = resetpassword.error.email_is_not_registered;
              $scope.errorMailContact = resetpassword.error.conatct_message;
          } else if (response.status === 400 && response.data.message.indexOf('Kindly contact with Administrator') !== -1 ) {
              $scope.errorMailMessage = resetpassword.error.unauthorized_email;
              $scope.errorMailContact = resetpassword.error.contact_message_for_unauthorized_mail;
          }
        });
      }     	
    }
  }]);
