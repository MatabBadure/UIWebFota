'use strict';

angular.module('hillromvestApp')
.controller('patientDiagnosticController', ['$scope', '$state', '$rootScope', 'StorageService', 'UserService', 'patientDiagnosticService', 'notyService',
  function ($scope, $state, $rootScope, StorageService, UserService, patientDiagnosticService, notyService) {

  $scope.addDiagnostics = function(){
    $state.go('patientDiagnosticAdd');
  };

  $scope.init = function(){
    $scope.testResult = {};
		if($state.current.name === "patientDiagnostic"){
			$scope.hidePatientNavbar = true;
      $scope.viewType = 'grid';
      $scope.getTestResultsByPatientId(StorageService.get('logged').patientID);
		  
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

  $scope.getTestResultsByPatientId = function(patientID){
    patientDiagnosticService.getTestResultsByPatientId(patientID).then(function(response){
      $scope.testResults = response.data;
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.addTestResult = function(){
    $scope.testResult.completionDate = new Date();
    patientDiagnosticService.addTestResult(StorageService.get('logged').patientID, $scope.testResult).then(function(response){
      notyService.showMessage(response.data.message, 'success');
      $state.go('patientDiagnostic');
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.cancelDiagnostic = function(){
    $state.go('patientDiagnostic');
  };

	$scope.init();
}]);
