'use strict';

angular.module('hillromvestApp')
.directive('hcpNavbar', function() {
  return {
      templateUrl: 'scripts/modules/admin/hcp/directives/hcp-info/navbar/navbar.html',
      restrict: 'E',
      controller: ['$scope', '$location', function ($scope, $location) {
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