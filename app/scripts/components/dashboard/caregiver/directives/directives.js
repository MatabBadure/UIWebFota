
angular.module('hillromvestApp')
.directive('caregiverNavbar', function() {
  return {
      templateUrl: 'scripts/components/dashboard/caregiver/views/caregiver-navbar.html',
      restrict: 'E',
      controller: function($scope, $location) {
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

angular.module('hillromvestApp')
.directive('caregiverGraph', function() {
  return {
      templateUrl: 'scripts/components/dashboard/patient/views/graph.html',
      restrict: 'E',
    }
});