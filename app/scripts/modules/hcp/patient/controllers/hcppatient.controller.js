angular.module('hillromvestApp')
.controller('hcpPatientController',['$scope', '$state', function($scope, $state) { 
	$scope.selectPatient = function(){
		console.log('Cool It works...!');
    $state.go('hcppatientOverview',{'patientId': 357});
	};
}]);