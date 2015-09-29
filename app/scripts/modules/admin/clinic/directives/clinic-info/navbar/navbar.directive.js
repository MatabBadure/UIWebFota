'use strict';

angular.module('hillromvestApp')
.directive('clinicNavbar', function() {
  return {
      templateUrl: 'scripts/modules/admin/clinic/directives/clinic-info/navbar/navbar.html',
      restrict: 'E',
      controller: ['$scope', '$location',function ($scope, $location) {
        $scope.isActive = function(tab) {
          var path = $location.path();
          if (path.indexOf(tab) !== -1) {
            return true;
          } else {
            return false;
          }
        };
      }]
    }
});