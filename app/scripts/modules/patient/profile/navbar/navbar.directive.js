'use strict';

angular.module('hillromvestApp')
.directive('adminProfileNavbar', function() {
  return {
      templateUrl: 'scripts/app/modules/admin/profile/navbar/navbar.html',
      restrict: 'E',
      controller: function ($scope, $location) {
        $scope.isActive = function(tab) {
          var path = $location.path();
          if (path.indexOf(tab) !== -1) {
            return true;
          } else {
            return false;
          }
        };
      }
    }
});