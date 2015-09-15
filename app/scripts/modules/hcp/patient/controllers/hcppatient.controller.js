angular.module('hillromvestApp')
.controller('hcpPatientController',['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) { 
	
	$scope.init = function(){
		$scope.getPatientByFilter($stateParams.filter);
	};

	$scope.getPatientByFilter = function(filter){

	};

	$scope.selectPatient = function(){
    $state.go('hcppatientOverview',{'patientId': 357});
	};

	$scope.switchPatientTab = function(value){
		console.log('Some thing is working now...! :', value);
		value = 'hcp' + value;
		$state.go(value, {'patientId':357});
	};
	$scope.init();
}]);