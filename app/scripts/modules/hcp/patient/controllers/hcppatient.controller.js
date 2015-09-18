angular.module('hillromvestApp')
.controller('hcpPatientController',['$scope', '$state', '$stateParams', 'hcpPatientService', 'patientService', 'notyService', 'DoctorService', function($scope, $state, $stateParams, hcpPatientService, patientService, notyService, DoctorService) { 
	
	$scope.init = function(){
    if($state.current.name === 'hcppatientDemographic'){
      $scope.getPatientInfo($stateParams.patientId);      
    }else if($state.current.name === 'hcppatientClinics'){
      $scope.getClinicsandHcpAssociatedToPatient($stateParams.patientId);      
    }else if($state.current.name === 'hcppatientProtocol'){
      $scope.getPatientDevicesandProtocols($stateParams.patientId);
    }else if($state.current.name === 'hcppatientCraegiver'){
      $scope.getCaregiversAssociatedWithPatient($stateParams.patientId);
    }else if($state.current.name === 'hcppatientdashboard'){
      $scope.getClinicsAssociatedToHCP();
      $scope.sortOption = $stateParams.filter;
      if($stateParams.filter === 'noevents'){
        $scope.getPatientsWithNoEvents($stateParams.filter);
      } else {
        $scope.getPatientsByFilter($stateParams.filter);
      }
    }
	};

  $scope.getClinicsAssociatedToHCP = function(){
    DoctorService.getClinicsAssociatedToHCP(localStorage.getItem('userId')).then(function(response){
      $scope.clinics = response.data.clinics;
      angular.forEach($scope.clinics, function(clinic){
        if(clinic.id === $stateParams.clinicId){
          $scope.selectedClinic =  clinic;
        }
      });
    }).catch(function(response){
      $scope.showWarning(response);
    });
  };

  $scope.showWarning = function(response){
    if(response.data.ERROR){
      notyService.showMessage(response.data.ERROR, 'warning');
    }else if(response.data.message){
      notyService.showMessage(response.data.message, 'warning');  
    }
  };

  $scope.getPatientInfo = function(patinetId){
    patientService.getPatientInfo(patinetId).then(function(response){
      $scope.patient = response.data;
    }).catch(function(response){
      $scope.showWarning(response);
    });
  };

  $scope.getPatientsByFilter = function(filter){
    var userId = localStorage.getItem('userId'), clinicId = localStorage.getItem('clinicId');
    hcpPatientService.getAssociatedPatientsByFilter(filter, clinicId, userId).then(function(response){
      $scope.patients = response.data.patientList;
    }).catch(function(response){
      $scope.showWarning(response);
    });
  };

	$scope.getPatientsWithNoEvents = function(filter){
    var userId = localStorage.getItem('userId'), clinicId = localStorage.getItem('clinicId');
		hcpPatientService.getAssociatedPatientsWithNoEvents(filter, clinicId, userId).then(function(response){
      $scope.patients = response.data.patientList;
    }).catch(function(response){
      $scope.showWarning(response);
    });
	};

  $scope.getClinicsandHcpAssociatedToPatient = function(patientId){
    $scope.getAssociateHCPToPatient(patientId);
    $scope.getAssociatedClincsToPatient(patientId);
  };

  $scope.getAssociateHCPToPatient = function(patientId){
    patientService.getAssociateHCPToPatient(patientId).then(function(response){
      console.log('SUCCESS: ', response);
      // $scope.associatedHCPs = response.data.
    }).catch(function(response){
      $scope.showWarning(response);
    });
  };

  $scope.getAssociatedClincsToPatient = function(patientId){
    patientService.getClinicsLinkedToPatient(patientId).then(function(response){
      $scope.associatedClinics = response.data.clinics;
    }).catch(function(response){
      $scope.showWarning(response);
    });
  };

  $scope.getPatientDevicesandProtocols = function(patientId){
    $scope.getProtocols(patientId);
    $scope.getDevices(patientId);
  };

  $scope.getProtocols = function(patientId){
    patientService.getProtocol(patientId).then(function(response){
      $scope.protocols = response.data.protocol;
    }).catch(function(response){
      $scope.showWarning(response);
    });
  };

  $scope.getDevices = function(patientId){
    patientService.getDevices(patientId).then(function(response){
      $scope.devices = response.data.deviceList;
    }).catch(function(response){
      $scope.showWarning(response);
    });
  };

  $scope.getCaregiversAssociatedWithPatient = function(patientId){
    patientService.getCaregiversLinkedToPatient(patientId).then(function(response){
      $scope.caregivers = response.data.caregivers
    }).catch(function(response){
      $scope.showWarning(response);
    });
  };

	$scope.selectPatient = function(patient){
    $state.go('hcppatientOverview',{'patientId': patient.id});
	};

	$scope.switchPatientTab = function(value){
		value = 'hcp' + value;
		$state.go(value, {'patientId':$stateParams.patientId});
	};

	$scope.goToPatientDashboard = function(value){
		$state.go(value);
	};

	$scope.searchPatients = function(value){
		$state.go('hcppatientdashboard',{'filter':value});
	};

  $scope.changeSortOption = function(){
    console.log('Todo :Check Box changes', $scope.sortOn);
  };
	$scope.init();
}]);