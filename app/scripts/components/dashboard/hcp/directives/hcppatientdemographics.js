angular.module('hillromvestApp')
  .directive('hcpPatientDemographics', function() {
    return {
        templateUrl: 'scripts/components/dashboard/hcp/views/hcppatientdemographic.html',
        restrict: 'E',
      }
  });