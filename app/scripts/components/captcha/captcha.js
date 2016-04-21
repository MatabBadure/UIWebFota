'use strict';

angular.module('hillromvestApp').directive('captcha', function (){
  return{
    templateUrl: 'scripts/components/captcha/captcha.html',
    restrict: 'E',
    scope: {
      valid: '='
    },
    controller:['$scope', function($scope){
      $scope.$on('validateCaptcha', function() {
        $scope.validate();
      });

      $scope.$on('initializeCaptcha', function(){
        $scope.init();
      });

      $scope.init = function(){
        $scope.submited = false;
        var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
        var i;
        for (i=0;i<6;i++){
          var a = alpha[Math.floor(Math.random() * alpha.length)];
          var b = alpha[Math.floor(Math.random() * alpha.length)];
          var c = alpha[Math.floor(Math.random() * alpha.length)];
          var d = alpha[Math.floor(Math.random() * alpha.length)];
          var e = alpha[Math.floor(Math.random() * alpha.length)];
          var f = alpha[Math.floor(Math.random() * alpha.length)];
          var g = alpha[Math.floor(Math.random() * alpha.length)];
        }
        var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' '+ f + ' ' + g;
        $scope.captchaValue = code;
        $scope.captchaInput = '';
      };

      $scope.validate = function(){
        $scope.submited = true;
        if($scope.captchaInput){
          var captchaString1 = $scope.removeSpaces($scope.captchaInput);
          var captchaString2 = $scope.removeSpaces($scope.captchaValue);
          if(captchaString1 === captchaString2){
            $scope.valid = true;
          }else{
            $scope.valid = false;
          }
        }else{
          $scope.valid = false;
        }
      };

      $scope.removeSpaces = function(captchaString){
        return captchaString.split(' ').join('');
      };

      $scope.init();
    }]
  };
});