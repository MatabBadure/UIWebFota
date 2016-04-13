'use strict';

angular.module('hillromvestApp')
.controller('patientDiagnosticController', ['$scope', '$state', '$rootScope', 'StorageService', 'UserService', 'patientDiagnosticService',
  function ($scope, $state, $rootScope, StorageService, UserService, patientDiagnosticService) {

  $scope.addDiagnostics = function(){
    $scope.isAddDiagnostics = true;
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
      console.log(response.data);
      $scope.testResults = response.data;
    }).catch(function(response){

    });
  };

  $scope.addTestResult = function(){
    console.log('It is cominf here...!', $scope.testResult);
    $scope.testResult.completionDate = new Date();
    patientDiagnosticService.addTestResult(StorageService.get('logged').patientID, $scope.testResult).then(function(response){
      console.log('Success...!');
    }).catch(function(response){
      console.log('ERRORE: ',response)
    });
  };

	$scope.init();
}]);
