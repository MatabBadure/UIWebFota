
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
        $scope.$on('getPatients', function(event, data) { 
          $scope.patients = data;
        });    
        $scope.$on('getSelectedPatient', function(event, data) { 
          $scope.selectedPatient = data;
        });

        $scope.switchPatient = function(patient){
          $scope.$broadcast('switchPatientCareGiver',patient);
        };

        $scope.switchCaregiverTab = function(state){
          $scope.$broadcast('switchCaregiverTab',state);
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