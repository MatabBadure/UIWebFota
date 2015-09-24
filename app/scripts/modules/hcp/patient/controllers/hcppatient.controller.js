angular.module('hillromvestApp')
.controller('hcpPatientController',['$scope', '$state', '$stateParams', 'hcpPatientService', 'patientService', 'notyService', 'DoctorService', 'clinicadminPatientService', 'dateService', 'clinicService', function($scope, $state, $stateParams, hcpPatientService, patientService, notyService, DoctorService, clinicadminPatientService, dateService, clinicService) { 
	
	$scope.init = function(){
    if($state.current.name === 'hcppatientDemographic'){
      $scope.getPatientInfo($stateParams.patientId, $scope.setEditMode);
    }else if($state.current.name === 'hcppatientClinics'){
      $scope.getClinicsandHcpAssociatedToPatient($stateParams.patientId);      
    }else if($state.current.name === 'hcppatientProtocol'){
      $scope.getPatientDevicesandProtocols($stateParams.patientId);
    }else if($state.current.name === 'hcppatientCraegiver'){
      $scope.getCaregiversAssociatedWithPatient($stateParams.patientId);
    }else if($state.current.name === 'hcppatientdashboard'){
      $scope.currentPageIndex = 1;
      $scope.perPageCount = 10;
      $scope.pageCount = 0;
      $scope.getClinicsAssociatedToHCP();
      var clinicId = $stateParams.clinicId;
      $scope.sortOption = $stateParams.filter;
      if(!$stateParams.filter){
        $scope.getAllPatientsByClinicId(clinicId, requestParam.pageNo, requestParam.offset);
      } else if($stateParams.filter === 'noevents'){
        $scope.getPatientsWithNoEvents($stateParams.filter, clinicId, requestParam.pageNo, requestParam.offset);
      } else {
        $scope.getPatientsByFilter($stateParams.filter, clinicId, requestParam.pageNo, requestParam.offset);
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
      notyService.showError(response);
    });
  };

  $scope.getAllPatientsByClinicId = function(clinicId, pageNo, offset){
    clinicService.getClinicAssoctPatients(clinicId, pageNo, offset).then(function(response){
      $scope.patients = [];
      angular.forEach(response.data.patientUsers, function(patientList){
        patientList.patient.hcp = patientList.hcp;
        $scope.patients.push(patientList.patient);
        $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] : $scope.patients.length;
        $scope.pageCount = Math.ceil($scope.total / 10);
      });
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.getPatientInfo = function(patinetId, callback){
    clinicadminPatientService.getPatientInfo(patinetId, $stateParams.clinicId).then(function(response){
      $scope.patient = response.data.patientUser;
      callback($scope.patient);
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.getPatientsByFilter = function(filter, clinicId, pageNo, offset){
    var userId = localStorage.getItem('userId');
    hcpPatientService.getAssociatedPatientsByFilter(filter, clinicId, userId, pageNo, offset).then(function(response){
      $scope.patients = [];
      angular.forEach(response.data.patientUsers, function(patient){
        patient.patientComp.patientUser.hcp = patient.hcp;
        patient.patientComp.patientUser.adherence = patient.patientComp.score;
        patient.patientComp.patientUser.transmission  = patient.patientComp.latestTherapyDate;
        $scope.patients.push(patient.patientComp.patientUser);
      });
      $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] : $scope.patients.length;
      $scope.pageCount = Math.ceil($scope.total / 10);
    }).catch(function(response){
      notyService.showError(response);
    });
  };

	$scope.getPatientsWithNoEvents = function(filter, clinicId, pageNo, offset){
    var userId = localStorage.getItem('userId');
		hcpPatientService.getAssociatedPatientsWithNoEvents(filter, clinicId, userId, pageNo, offset).then(function(response){
      $scope.patients = response.data.patientUsers;
      $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] : $scope.patients.length;
      $scope.pageCount = Math.ceil($scope.total / 10);
    }).catch(function(response){
      notyService.showError(response);
    });
	};

  $scope.getClinicsandHcpAssociatedToPatient = function(patientId){
    $scope.getAssociateHCPToPatient(patientId);
    $scope.getAssociatedClincsToPatient(patientId);
  };

  $scope.getAssociateHCPToPatient = function(patientId){
    patientService.getAssociateHCPToPatient(patientId).then(function(response){
      $scope.associatedHCPs = response.data.hcpUsers;
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.getAssociatedClincsToPatient = function(patientId){
    patientService.getClinicsLinkedToPatient(patientId).then(function(response){
      $scope.associatedClinics = response.data.clinics;
    }).catch(function(response){
      notyService.showError(response);
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
      notyService.showError(response);
    });
  };

  $scope.getDevices = function(patientId){
    patientService.getDevices(patientId).then(function(response){
      $scope.devices = response.data.deviceList;
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.getCaregiversAssociatedWithPatient = function(patientId){
    patientService.getCaregiversLinkedToPatient(patientId).then(function(response){
      $scope.caregivers = response.data.caregivers
    }).catch(function(response){
      notyService.showError(response);
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
    if('hcppatientdashboard' === value){
      var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
      $state.go(value, {'clinicId': clinicId});
    }else{
      $state.go(value);
    }
	};

	$scope.searchPatients = function(track){
    if (track !== undefined) {
      if (track === "PREV" && $scope.currentPageIndex > 1) {
        $scope.currentPageIndex--;
      }
      else if (track === "NEXT" && $scope.currentPageIndex < $scope.pageCount){
          $scope.currentPageIndex++;
      }
      else{
          return false;
      }
    }else {
      $scope.currentPageIndex = 1;
    }
    var clinicId = $stateParams.clinicId;
    $scope.sortOption = $stateParams.filter;
    if(!$stateParams.filter){
      $scope.getAllPatientsByClinicId(clinicId, requestParam.pageNo, requestParam.offset);
    } else if($stateParams.filter === 'noevents'){
      $scope.getPatientsWithNoEvents($stateParams.filter, clinicId, $scope.currentPageIndex, requestParam.offset);
    } else {
      $scope.getPatientsByFilter($stateParams.filter, clinicId, $scope.currentPageIndex, requestParam.offset);
    }
		//$state.go('hcppatientdashboard',{'filter':value});
	};

  $scope.switchClinic = function(clinic){
    if($scope.selectedClinic.id !== clinic.id){
      $scope.selectedClinic = clinic;
      if($stateParams.filter === 'noevents'){
        $scope.getPatientsWithNoEvents($stateParams.filter, clinic.id, requestParam.pageNo, requestParam.offset);
      } else {
        $scope.getPatientsByFilter($stateParams.filter, clinic.id, requestParam.pageNo, requestParam.offset);
      }
    }
  };

  $scope.setEditMode = function(patient) {
    $scope.patient = patient;
    if (patient.dob !== null) {
      $scope.patient.age = dateService.getAge(new Date($scope.patient.dob));
      var _date = dateService.getDate($scope.patient.dob);
      var _month = dateService.getMonth(_date.getMonth());
      var _day = dateService.getDay(_date.getDate());
      var _year = dateService.getYear(_date.getFullYear());
      var dob = _month + "/" + _day + "/" + _year;
      $scope.patient.dob = dob;
      $scope.patient.formatedDOB = _month + "/" + _day + "/" + _year.slice(-2);
    }
  };

	$scope.init();
}]);
