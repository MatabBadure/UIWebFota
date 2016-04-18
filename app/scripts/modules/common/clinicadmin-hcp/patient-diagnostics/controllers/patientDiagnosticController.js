'use strict';

angular.module('hillromvestApp')
.controller('patientDiagnosticController', ['$scope', '$state', '$rootScope', 'StorageService', 'UserService', 'patientDiagnosticService', 'notyService', 'dateService', '$stateParams', 'commonsUserService', '$parse',
function ($scope, $state, $rootScope, StorageService, UserService, patientDiagnosticService, notyService, dateService, $stateParams, commonsUserService, $parse) {
  $scope.isAddDiagnostic = false; 
  $scope.defaultTestResultDate = dateService.getDateFromTimeStamp(new Date().getTime(), patientDashboard.dateFormat, "/"); 
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
				$scope.getTestResultsByPatientId();
			},
			'click.daterangepicker': function(ev, picker) {
				$("#dp1cal").data('daterangepicker').setStartDate($scope.fromDate);
				$("#dp1cal").data('daterangepicker').setEndDate($scope.toDate);
			}
		},
		opens: 'left'
	}


  $scope.addUpdateDiagnostics = function(resultId){
    $scope.isAddDiagnostic = true;
    resultId = (resultId) ? resultId : "";    
    if($rootScope.userRole === "PATIENT"){
        var patientID = StorageService.get('logged').patientID;        
        $state.go("patientDiagnosticAdd", {'resultId': resultId});
      }else if($rootScope.userRole === "CLINIC_ADMIN"){        
        $state.go("CADiagnosticAdd", {'patientId': $stateParams.patientId,'resultId': resultId});
      }else if($rootScope.userRole === "HCP"){        
        $state.go("HCPDiagnosticAdd", {'patientId': $stateParams.patientId,'resultId': resultId});
      }   
  };

  $scope.initAddEditDiagnostics = function(){
    $scope.isAddDiagnostic = true;
    $scope.isEditDiagnostics = false;
    $scope.testResult = {}; 
    $scope.testResult.testResultDate = $scope.defaultTestResultDate;
    if($stateParams.resultId){      
      patientDiagnosticService.getTestResultById($stateParams.resultId).then(function(response){
        $scope.testResult = response.data;
        $scope.isEditDiagnostics = true;
        $scope.submitText = "Update";
      });        
    }else{
      $scope.submitText = "Save";
    }
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
      $scope.diagnosticPatientId =  $stateParams.patientId;
		}else if($state.current.name === "HCPDiagnostic"){			
      $scope.diagnosticPatientId =  $stateParams.patientId;
		}else if($state.current.name === "patientDiagnosticAdd"){      
      $scope.diagnosticPatientId = StorageService.get('logged').patientID;
      $scope.isPatinetLogin = true;           
      $scope.initAddEditDiagnostics();      
    }else if($state.current.name === "CADiagnosticAdd"){
      $scope.diagnosticPatientId =  $stateParams.patientId;
      $scope.initAddEditDiagnostics();    
    }else if($state.current.name === "HCPDiagnosticAdd"){
      $scope.diagnosticPatientId =  $stateParams.patientId;
      $scope.initAddEditDiagnostics();    
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
      
    });
  };

  $scope.addTestResult = function(){
    $scope.submitted = true;    
    if($scope.form && $scope.form.$invalid){
      return false;
    }

    var data = $scope.testResult;    
    data.testResultDate = dateService.getDateFromTimeStamp(dateService.convertToTimestamp(data.testResultDate),patientDashboard.serverDateFormat,"-"); 
    delete data.createdDate;
    if($scope.isEditDiagnostics){
      patientDiagnosticService.updateTestResult($scope.diagnosticPatientId, data).then(function(response){      
        notyService.showMessage(response.data.message, 'success');      
        $rootScope.patientDiagnostics();
      }).catch(function(response){
        notyService.showError(response);
      });
    }else{
      patientDiagnosticService.addTestResult($scope.diagnosticPatientId, data).then(function(response){      
        notyService.showMessage(response.data.message, 'success');      
        $rootScope.patientDiagnostics();
      }).catch(function(response){
        notyService.showError(response);
      });
    }
  };

  $scope.cancelDiagnostic = function(){
    $rootScope.patientDiagnostics();   
  };

  $scope.switchPatientTab = function(value){  
    if($scope.userRole === "HCP"){
      value = 'hcp' + value;
      $state.go(value, {'patientId':$stateParams.patientId, 'clinicId': $stateParams.clinicId});
    } else if($scope.userRole === "CLINIC_ADMIN"){
      $state.go(value, {'patientId':$stateParams.patientId});
    }  
  };

  $scope.setTwoNumberDecimal = function(applicableVarname){          
    if($parse(applicableVarname)($scope)){      
      //replace non-digited chars and decimal.      
      var digiTed = $parse(applicableVarname)($scope).replace(/[^0-9\.]/g, '');   
      digiTed = (digiTed === ".") ? "0.": (digiTed > 0 ? (digiTed.toString().indexOf(".") === -1 ? parseFloat(digiTed).toString() : digiTed) : (digiTed.toString().indexOf(".") === -1 && digiTed == 0)? 0 : digiTed );
      //  get only two digits after decimal, if available   
      digiTed = (digiTed && digiTed.toString().indexOf(".") !== -1) ? ((digiTed.split(".")[1]).toString().length > 2? digiTed.substring(0, digiTed.length-1) : digiTed ): digiTed;
      //check for max value
      digiTed = (digiTed.length > 0) ? ((digiTed <= 100 ) ? $parse(applicableVarname).assign($scope,digiTed) : $parse(applicableVarname).assign($scope,digiTed.substring(0, digiTed.length-1)) ) : (digiTed === 0 ? $parse(applicableVarname).assign($scope,0): $parse(applicableVarname).assign($scope,null)) ;
    }else{
      $parse(applicableVarname).assign($scope,null);
    }   
  };

  $scope.setTwoDigitedNumber = function(applicableVarname){
    if($parse(applicableVarname)($scope)){      
      //replace non-digited chars and decimal.
      var digiTed = $parse(applicableVarname)($scope).replace(/\D/g,'');
      digiTed = (digiTed > 0 ? digiTed : 0 );
      //check for max value
      digiTed = (digiTed.length > 0) ? ((digiTed < 10 ) ? $parse(applicableVarname).assign($scope,digiTed) : $parse(applicableVarname).assign($scope,digiTed.substring(0, digiTed.length-1)) ) : (digiTed === 0 ? $parse(applicableVarname).assign($scope,0): $parse(applicableVarname).assign($scope,null)) ;      
    }else{
      $parse(applicableVarname).assign($scope,null);
    }   
  };

	$scope.init();

  
  angular.element('#dp2').datepicker({
    endDate: '+0d',
    startDate: '-100y',
    defaultDate: $scope.defaultTestResultDate,
    autoclose: true
  })
  .on('hide', function () {
    if(!$(this).val())  {
       $(this).val($scope.defaultTestResultDate).datepicker('update');
       if($scope.testResult){
          $scope.testResult.testResultDate = $scope.defaultTestResultDate;
       }
    }
  });

}]);
