'use strict';

angular.module('hillromvestApp')
.controller('patientDiagnosticController', ['$scope', '$state', '$rootScope', 'StorageService', 'UserService', 'patientDiagnosticService', 'notyService', 'dateService', '$stateParams', 'commonsUserService',
function ($scope, $state, $rootScope, StorageService, UserService, patientDiagnosticService, notyService, dateService, $stateParams, commonsUserService) {
  $scope.isAddDiagnostic = false;
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
    $scope.isAddDiagnostic = true;
    if($rootScope.userRole === "PATIENT"){
        var patientID = StorageService.get('logged').patientID;
        console.log("patientDiagnostic", patientID);
        $state.go("patientDiagnosticAdd");
      }else if($rootScope.userRole === "CLINIC_ADMIN"){
        console.log("clinic admin", $stateParams.patientId);
        $state.go("CADiagnosticAdd", {'patientId': $stateParams.patientId});
      }else if($rootScope.userRole === "HCP"){
        console.log("hcp", $stateParams.patientId);
        $state.go("HCPDiagnosticAdd", {'patientId': $stateParams.patientId});
      }
    /*if($rootScope.userRole === 'PATIENT')
    $state.go('patientDiagnosticAdd');*/
  };

  $scope.init = function(){
  	$scope.calculateTimeDuration(90);
    $scope.testResult = {};
    $scope.isPatinetLogin = false;
		if($state.current.name === "patientDiagnostic"){
			$scope.hidePatientNavbar = true;
      $scope.isPatinetLogin = true;
      $scope.viewType = 'grid';
      $scope.diagnosticPatientId = StorageService.get('logged').patientID;		  
		}else if($state.current.name === "CADiagnostic" ){
			console.log("clinic admin PD");
      $scope.diagnosticPatientId =  $stateParams.patientId;
		}else if($state.current.name === "HCPDiagnostic"){
			console.log("hcp PD");
      $scope.diagnosticPatientId =  $stateParams.patientId;
		}else if($state.current.name === "patientDiagnosticAdd"){
      $scope.isAddDiagnostic = true;
      $scope.diagnosticPatientId = StorageService.get('logged').patientID;
      $scope.isPatinetLogin = true;
    }else if($state.current.name === "CADiagnosticAdd"){
      $scope.isAddDiagnostic = true;
      $scope.diagnosticPatientId =  $stateParams.patientId;
    }else if($state.current.name === "HCPDiagnosticAdd"){
      $scope.isAddDiagnostic = true;
      $scope.diagnosticPatientId =  $stateParams.patientId;
    }
    $scope.getTestResultsByPatientId();
    UserService.getUser($scope.diagnosticPatientId).then(function(response){
      $scope.patient = response.data.user;
    });
	};

  $scope.switchView = function(view){
    $scope.viewType = view;
  };

  $scope.getTestResultsByPatientId = function(){
    patientDiagnosticService.getTestResultsByPatientId($scope.diagnosticPatientId, $scope.serverFromDate, $scope.serverToDate).then(function(response){
      $scope.testResults = response.data;
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.addTestResult = function(){
    if($scope.form.$invalid){
      return false;
    }
    patientDiagnosticService.addTestResult($scope.diagnosticPatientId, $scope.testResult).then(function(response){
      notyService.showMessage(response.data.message, 'success');
      //$state.go('patientDiagnostic');
      $rootScope.patientDiagnostics();
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.cancelDiagnostic = function(){
    $rootScope.patientDiagnostics();
   // $state.go('patientDiagnostic');
  };

  $scope.formSubmit = function(){
    $scope.submitted = true;
    if($scope.form.$invalid){
      return false;
    }
    var data = $scope.patient;
    data.role = 'PATIENT';
    $scope.showModal = false;
    UserService.editUser(data).then(function (response) {
      if(response.status === 200) {
        $scope.patientStatus.isMessage = true;
        $scope.patientStatus.message = "Patient updated successfully";
        notyService.showMessage($scope.patientStatus.message, 'success');
        if($scope.patientStatus.role === loginConstants.role.acctservices){
          $state.go('patientDemographicRcadmin', {'patientId': $stateParams.patientId});
        }else{
          $state.go('patientDemographic', {'patientId': $stateParams.patientId});
        }
      } else {
        $scope.patientStatus.message = 'Error occured! Please try again';
        notyService.showMessage($scope.patientStatus.message, 'warning');
      }
    }).catch(function (response) {
      $scope.patientStatus.isMessage = true;
      if (response.data.message !== undefined) {
        $scope.patientStatus.message = response.data.message;
      } else if(response.data.ERROR !== undefined) {
        $scope.patientStatus.message = response.data.ERROR;
      } else {
        $scope.patientStatus.message = 'Error occured! Please try again';
      }
      notyService.showMessage($scope.patientStatus.message, 'warning');
    });
  };

  $scope.switchPatientTab = function(value){  
    if($scope.userRole === "HCP"){
      value = 'hcp' + value;
      $state.go(value, {'patientId':$stateParams.patientId, 'clinicId': $stateParams.clinicId});
    } else if($scope.userRole === "CLINIC_ADMIN"){
      $state.go(value, {'patientId':$stateParams.patientId});
    }  
  };

  $scope.editDiagnostic = function(testResult){
    console.log(testResult);

  };

	$scope.init();

  angular.element('#dp2').datepicker({
    endDate: '+0d',
    startDate: '-100y',
    autoclose: true
  });

}]);
