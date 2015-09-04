angular.module('hillromvestApp')
  .directive('hcpGraph', function() {
    return {
        templateUrl: 'scripts/components/dashboard/hcp/views/graph.html',
        restrict: 'E',
      }
  });

  angular.module('hillromvestApp')
  .directive('hcpdashboardNavbar', function() {
    return {
        templateUrl: 'scripts/components/dashboard/hcp/views/navbar.html',
        restrict: 'E',
      }
  });