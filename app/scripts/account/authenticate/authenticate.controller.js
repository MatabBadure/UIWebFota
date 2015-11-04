'use strict';

angular.module('hillromvestApp')
.controller('AuthenticateController',['$scope', 'Auth', '$state', '$stateParams', 'AuthServerProvider',
  function ($scope, Auth, $state, $stateParams,AuthServerProvider) {

    $scope.otherError = false;
    $scope.questionsNotLoaded = false;
    $scope.questionVerificationFailed = false;
    $scope.success = false;
    $scope.doNotMatch = false;
    $scope.alreadyActive = false;
    $scope.authenticate = {};
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
    }).catch(function (err) {
        $scope.questionsNotLoaded = true;
    });

$scope.authenticate = function(event) {
   event.preventDefault();
   $scope.error = null;
   if ($scope.authenticate.password !== $scope.authenticate.confirmPassword) {
    $scope.doNotMatch = 'ERROR';
} else {
   $scope.doNotMatch = null;
   var data = {
       "questionId" : $scope.authenticate.question.id,
       "answer" : $scope.authenticate.answer,
       "password" : $scope.authenticate.password,
       "termsAndConditionsAccepted" : $scope.authenticate.tnc,
       "key" : $stateParams.key
   }
   Auth.activateAccount({key: $stateParams.key}).then(function () {
        $scope.authenticateCred(data);
    }).catch(function () {
        $scope.otherError = true;
    });
  }
};

$scope.passwordStrength = function(){
    $scope.display_strength('passwordBox','passwordStrengthContainer','status');
};

$scope.authenticateCred = function(data){
  Auth.configurePassword(data).then(function () {
    $scope.success = true;
    $state.go('postActivateLogin');
  }).catch(function (response) {
      $scope.success = false;
      if(response.status == 400 && response.data.ERROR == "Invalid Activation Key"){
         $scope.alreadyActive = true;
     }else{
         $scope.otherError = true;
     }
  });
};


$scope.div = function (x){
    return document.getElementById(x);
};

$scope.display_strength = function(x, y, z) {
    if (!x || $scope.div(x) === "") {
      $scope.div(y).style.width = 0 + "%";
      $scope.div(z).innerHTML = "&nbsp:";
      return false;
    }
    var paswd = $scope.div(x);
    var stren = $scope.div(y);
    var stats = $scope.div(z);
    var years = 0;

    var regex = [
      /^[a-zA-Z]+$/g,
      /^[a-zA-Z0-9]+$/g,
      /^[a-zA-Z0-9\ \~\!\@\#\$\%\^\&\*\(\)]+$/g,
    ];

    var count = [42, 52, 63, 74];
    var color = ["red", "gold", "lime", "darkgreen"];
    var value = ["weak", "Good", "Strong", "Very Strong"];
    var index = 0;

    for (index = 0; index < regex.length; index++) {
      if (index > regex.length) {
        break;
      }
      if (regex[index].test(paswd.value)) {
        break;
      } else {
        continue;
      }

    }

    years = $scope.compute_strength(count[index], (paswd.value).length);

    if (years >= 1000 && !$scope.form.password.$error.pattern) {
      stats.innerHTML = value[3];
      stats.style.color = color[3];
    } else if (years >= 100 && years < 1000 && !$scope.form.password.$error.pattern) {
      stats.innerHTML = value[2];
      stats.style.color = color[2];
    } else if (years >= 10 && years < 100 && !$scope.form.password.$error.pattern) {
      stats.innerHTML = value[1];
      stats.style.color = color[1];
    } else {
      if($scope.form.password && $scope.form.password.$error.required){
        stats.innerHTML = '';
        stats.style.color = color[0];
      }else{
        stats.innerHTML = value[0];
        stats.style.color = color[0];
      } 
    }
    return false;
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