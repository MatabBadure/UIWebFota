'use strict';

angular.module('hillromvestApp').directive('alertModal', function (){
  return{
    templateUrl: 'scripts/components/modal/alertmodal.html',
    restrict: 'E',
    transclude: true,
    scope: {
      onyes : '&onyes',
      onno: '&onno',
      header: '@',
      message: '@',
      message1: '@',
      buttonlabel: '@',
      modall: '=modall'
    },
    controller:['$scope', function($scope){
      $scope.yes = function(){
        $scope.onyes();
      };

      $scope.no = function(){
        $scope.onno();
      };
    }]
  };
});