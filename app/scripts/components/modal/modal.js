'use strict';

angular.module('hillromvestApp').directive('modal', function (){
  return{
    templateUrl: 'scripts/components/modal/modal.html',
    restrict: 'E',
    transclude: true,
    scope: {
      onyes : '&onyes',
      onno: '&onno',
      header: '@',
      message: '@',
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