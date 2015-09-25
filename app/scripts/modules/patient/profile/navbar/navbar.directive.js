'use strict';

angular.module('hillromvestApp')
.directive('patientProfileNavbar', function() {
  return {
      templateUrl: 'scripts/modules/patient/profile/navbar/navbar.html',
      restrict: 'E',
      controller: function ($scope, $location) {

      }
    }
});