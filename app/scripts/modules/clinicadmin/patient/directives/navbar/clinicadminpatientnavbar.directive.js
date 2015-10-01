'use strict';

angular.module('hillromvestApp')
.directive('clinicadminPatientNavbar', function() {
  return {
      templateUrl: 'scripts/modules/clinicadmin/patient/directives/navbar/clinicadminpatientnavbar.html',
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