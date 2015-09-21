angular.module('hillromvestApp')
  .directive('clinicadminGraph', function() {
    return {
        templateUrl: 'scripts/components/dashboard/clinicadmin/views/graph.html',
        restrict: 'E',
      }
  });

angular.module('hillromvestApp')
.directive('clinicadminNavbar', function() {
  return {
    templateUrl: 'scripts/components/dashboard/clinicadmin/views/navbar.html',
    restrict: 'E',
  }
});