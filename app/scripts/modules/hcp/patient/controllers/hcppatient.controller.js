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
		console.log('Some thing is working now...!	');
		$state.go('hcpPatientDemographic',{'patientId':357});
	};
	$scope.init();
}]);
