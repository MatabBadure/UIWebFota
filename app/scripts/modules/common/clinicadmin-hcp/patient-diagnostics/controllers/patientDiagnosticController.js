'use strict';

angular.module('hillromvestApp')
.controller('patientDiagnosticController', ['$scope', '$state', '$rootScope', 'StorageService', 'UserService', 'patientDiagnosticService', 'notyService', 'dateService',
function ($scope, $state, $rootScope, StorageService, UserService, patientDiagnosticService, notyService, dateService) {

	$scope.calculateDateFromPicker = function(picker) {
    $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();	      
	  $scope.toTimeStamp = (new Date().getTime() < new Date(picker.endDate._d).getTime())? new Date().getTime() : new Date(picker.endDate._d).getTime();
    $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
    $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');

    $scope.serverFromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-');
    $scope.serverToDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-');
    if ($scope.fromDate === $scope.toDate ) {
      $scope.fromTimeStamp = $scope.toTimeStamp;
    }	      
  };

  $scope.calculateTimeDuration = function(durationInDays) {
    $scope.toTimeStamp = new Date().getTime();
    $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
    $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
    $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
    $scope.serverFromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-');
    $scope.serverToDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-');
  };

	$scope.opts = {
		maxDate: new Date(),
		format: patientDashboard.dateFormat,
		eventHandlers: {'apply.daterangepicker': function(ev, picker) {  
				$scope.calculateDateFromPicker(picker);
				console.log($scope.serverFromDate, $scope.serverToDate);
				$scope.getTestResultsByPatientId(StorageService.get('logged').patientID);
			},
			'click.daterangepicker': function(ev, picker) {
				$("#dp1cal").data('daterangepicker').setStartDate($scope.fromDate);
				$("#dp1cal").data('daterangepicker').setEndDate($scope.toDate);
			}
		},
		opens: 'left'
	}


  $scope.addDiagnostics = function(){
    $state.go('patientDiagnosticAdd');
  };

  $scope.init = function(){
  	$scope.calculateTimeDuration(90);
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
    patientDiagnosticService.getTestResultsByPatientId(patientID, $scope.serverFromDate, $scope.serverToDate).then(function(response){
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
