'use strict';

angular.module('hillromvestApp')
.controller('patientDiagnosticController', ['$scope', '$state', '$rootScope', 'StorageService', 'UserService', 'patientDiagnosticService', 'notyService', 'dateService', '$stateParams', 'commonsUserService', '$parse', 'caregiverDashBoardService',
function ($scope, $state, $rootScope, StorageService, UserService, patientDiagnosticService, notyService, dateService, $stateParams, commonsUserService, $parse,caregiverDashBoardService) {
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
    dateLimit: {"months":12},
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


  $scope.addUpdateDiagnostics = function(){
    $scope.isAddDiagnostic = true;
    if($rootScope.userRole === "PATIENT"){
      $state.go("patientDiagnosticAdd");
    }else if($rootScope.userRole === "CLINIC_ADMIN"){
      $state.go("CADiagnosticEdit", {'patientId': $stateParams.patientId});
    }else if($rootScope.userRole === "HCP"){
      $state.go("HCPDiagnosticEdit", {'patientId': $stateParams.patientId});
    }
  };

  $scope.openEditDiagnostics = function(resultId){
    $scope.isAddDiagnostic = true;
    resultId = (resultId) ? resultId : "";
    if($rootScope.userRole === "CLINIC_ADMIN"){
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
  	$scope.calculateTimeDuration(365);
    $scope.testResult = {};
    $scope.isPatinetLogin = false;
		if($state.current.name === "patientDiagnostic"){
			$scope.hidePatientNavbar = true;
      $scope.isPatinetLogin = true;
      $scope.viewType = 'grid';
      $scope.diagnosticPatientId = StorageService.get('logged').patientID;		  
		}else if($state.current.name === "caregiverpatientDiagnostic"){
      var loginID = StorageService.get('logged').userId;
      $scope.isPatinetLogin = false;
      $scope.viewType = 'grid';
      $scope.getPatientListForCaregiver(loginID);
      $scope.diagnosticPatientId = ($stateParams.patientId)?$stateParams.patientId:$scope.selectedPatient.user.id;
    }else if($state.current.name === "CADiagnostic"){		
      $scope.diagnosticPatientId =  $stateParams.patientId;
		}else if($state.current.name === "HCPDiagnostic"){			
      $scope.diagnosticPatientId =  $stateParams.patientId;
		}
    //Implementation of GIMP-19
    else if($state.current.name === "adminPatientDiagnostic" || $state.current.name === "rcadminPatientDiagnostic" || $state.current.name === "associatePatientDiagnostic" || $state.current.name === "customerservicePatientDiagnostic"){
      $scope.diagnosticPatientId =  $stateParams.patientId;
    }
    //End of Implementation of GIMP-19
    else if($state.current.name === "patientDiagnosticAdd"){      
      $scope.diagnosticPatientId = StorageService.get('logged').patientID;
      $scope.isPatinetLogin = true;           
      $scope.initAddEditDiagnostics();      
    }else if($state.current.name === "CADiagnosticAdd"){
      $scope.diagnosticPatientId =  $stateParams.patientId;
      $scope.initAddEditDiagnostics();    
    }else if($state.current.name === "HCPDiagnosticAdd"){
      $scope.diagnosticPatientId =  $stateParams.patientId;
      $scope.initAddEditDiagnostics();    
    }else if($state.current.name === 'CADiagnosticEdit' || $state.current.name === 'HCPDiagnosticEdit' ){
      $scope.diagnosticPatientId =  $stateParams.patientId;
      $scope.initAddEditDiagnostics();
    }
    if($state.current.name !== 'CADiagnosticEdit' && $state.current.name !== 'HCPDiagnosticEdit'){
      $scope.getTestResultsByPatientId();
    }
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
      if($scope.isPatinetLogin){
        patientDiagnosticService.addTestResult($scope.diagnosticPatientId, data).then(function(response){
          notyService.showMessage(response.data.message, 'success');
          $rootScope.patientDiagnostics();
        }).catch(function(response){
          notyService.showError(response);
        });
      }else{
        patientDiagnosticService.addTestResultByClinicadminHCP($scope.diagnosticPatientId, StorageService.get('logged').userId, data).then(function(response){
          notyService.showMessage(response.data.message, 'success');
          $rootScope.patientDiagnostics();
        }).catch(function(response){
          notyService.showError(response);
        });
      }
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
    /* For GIMP 19 */
    else if($scope.userRole === "ADMIN"){
      $state.go(value, {'patientId': $stateParams.patientId});
    } else if($scope.userRole === "ASSOCIATES"){
      $state.go(value, {'patientId': $stateParams.patientId});
    } else if($scope.userRole === "CUSTOMER_SERVICES"){
       $state.go(value, {'patientId': $stateParams.patientId});
    } else if($scope.userRole === "ACCT_SERVICES"){
       $state.go(value, {'patientId': $stateParams.patientId});
    }
   /* For GIMP 19 */

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
      $scope.getPatientListForCaregiver = function(caregiverID){
      caregiverDashBoardService.getPatients(caregiverID).then(function(response){
        $scope.patients = response.data.patients;
        $scope.$emit('getPatients', $scope.patients);
        /* if(response.data.patients[0].deviceType == 'ALL'){
          localStorage.setItem('deviceType_'+response.data.patients[0].id, 'VEST');
         // localStorage.setItem('deviceTypeforGraph', 'ALL');
          localStorage.setItem('deviceTypeforBothIcon_'+response.data.patients[0].id, 'ALL');


            }
            else{
            localStorage.setItem('deviceType_'+response.data.patients[0].id, response.data.patients[0].deviceType);
           // localStorage.setItem('deviceTypeforGraph', response.data.patients[0].deviceType);
            localStorage.setItem('deviceTypeforBothIcon_'+response.data.patients[0].id, response.data.patients[0].deviceType);
          }*/
       if($stateParams.patientId){
          for(var i=0;i<response.data.patients.length;i++){
            if($stateParams.patientId == response.data.patients[i].userId){
          $scope.selectedPatient = response.data.patients[i];
          $scope.patientId = $scope.selectedPatient.userId;
          break;
        }
        }
        } else{
          $scope.selectedPatient = response.data.patients[0];

          $scope.patientId = $scope.selectedPatient.user.id;
          var logged = StorageService.get('logged');
          logged.patientID = $scope.patientId
          StorageService.save('logged', logged);
        }
         $scope.$emit('getSelectedPatient', $scope.selectedPatient);
         }).catch(function(response){
        notyService.showError(response);
      });
    };

	$scope.init();

  
  angular.element('#dp2').datepicker({
    endDate: '+0d',
    startDate: '-100y',
    defaultDate: $scope.defaultTestResultDate,
    autoclose: true,
    dateFormat: 'mm/dd/yyyy'
  })
  .on('hide', function () {
    if(!$(this).val()){
       $("#dp2").datepicker('setDate', $scope.defaultTestResultDate);
       $(this).val($scope.defaultTestResultDate).datepicker('update');
       if($scope.testResult){
          $scope.testResult.testResultDate = $scope.defaultTestResultDate;
       }
    }
  });

  $("#dp2").datepicker('setDate', $scope.defaultTestResultDate);

}]);
