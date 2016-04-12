'use strict';

angular.module('hillromvestApp')
.controller('patientDiagnosticController', ['$scope', '$state', '$rootScope', 'StorageService', 'UserService',
  function ($scope, $state, $rootScope, StorageService, UserService) {

  $scope.addDiagnostics = function(){
    $rootScope.isAddDiagnostics = true;
  };

  $scope.init = function(){
		if($state.current.name === "patientDiagnostic"){
			$scope.hidePatientNavbar = true;
      $scope.viewType = 'grid';
			var patientID = StorageService.get('logged').patientID;
			//$state.go("patientDiagnostic");
		}else if($state.current.name === "CADiagnostic" ){
			console.log("clinic admin PD");
		}else if($state.current.name === "HCPDiagnostic"){
			console.log("hcp PD");
		}
    UserService.getUser(StorageService.get('logged').patientID).then(function(response){
      $scope.patient = response.data.user;
    });
	};

  $scope.switchView = function(view){
    $scope.viewType = view;
  };

	$scope.init();
}]);
