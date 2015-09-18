angular.module('hillromvestApp')
.controller('hcpPatientController',['$scope', '$state', function($scope, $state) { 
	$scope.selectPatient = function(){
    $state.go('hcppatientOverview',{'patientId': 357});
	};
}]);