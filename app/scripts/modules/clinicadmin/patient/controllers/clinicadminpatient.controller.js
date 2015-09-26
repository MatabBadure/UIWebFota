angular.module('hillromvestApp')
.controller('clinicadminPatientController',['$scope', '$state', '$stateParams', 'clinicadminPatientService', 'patientService', 'notyService', 'DoctorService', 'clinicadminService', 'clinicService', 'dateService', 'UserService', function($scope, $state, $stateParams, clinicadminPatientService, patientService, notyService, DoctorService, clinicadminService, clinicService, dateService, UserService) { 
	
	$scope.init = function(){
    if($state.current.name === 'clinicadminpatientDemographic'  || $state.current.name === 'clinicadmminpatientDemographicEdit'){
      $scope.getPatientInfo($stateParams.patientId, $scope.setEditMode);
      if($state.current.name === 'clinicadmminpatientDemographicEdit'){
        $scope.getStates();
      }
    }else if($state.current.name === 'clinicadminpatientClinics'){
      $scope.getClinicsandHcpAssociatedToPatient($stateParams.patientId);
    }else if($state.current.name === 'clinicadminpatientProtocol'){
      $scope.getPatientDevicesandProtocols($stateParams.patientId);
    }else if($state.current.name === 'hcppatientCraegiver'){
      $scope.getCaregiversAssociatedWithPatient($stateParams.patientId);
    }else if($state.current.name === 'clinicadminpatientdashboard'){
      $scope.currentPageIndex = 1;
      $scope.perPageCount = 10;
      $scope.pageCount = 0;
      $scope.getClinicsAssociatedToHCP();
      var clinicId = $stateParams.clinicId;
      $scope.sortOption = $stateParams.filter;
      if(!$stateParams.filter){
        $scope.getAllPatientsByClinicId(clinicId, requestParam.pageNo, requestParam.offset);
      }else if($stateParams.filter === 'noevents'){
        $scope.getPatientsWithNoEvents($stateParams.filter, clinicId, requestParam.pageNo, requestParam.offset);
      } else {
        $scope.getPatientsByFilter($stateParams.filter, clinicId, requestParam.pageNo, requestParam.offset);
      }
    }
	};

  $scope.getStates = function(){
    UserService.getState().then(function(response) {
      $scope.states = response.data.states;
    }).catch(function(response) {
      notyService.showError(response);
    });
  };

  $scope.getAllPatientsByClinicId = function(clinicId, pageNo, offset){
    clinicService.getClinicAssoctPatients(clinicId,  pageNo, offset).then(function(response){
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

  $scope.getClinicsAssociatedToHCP = function(){
    clinicadminService.getClinicsAssociated(localStorage.getItem('userId')).then(function(response){
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

  $scope.getPatientInfo = function(patinetId, callback){
    clinicadminPatientService.getPatientInfo(patinetId, $stateParams.clinicId).then(function(response){
      $scope.patient = response.data.patientUser;
      if (typeof callback === 'function') {
        callback($scope.patient);
      }
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.getPatientsByFilter = function(filter, clinicId, pageNo, offset){
    var userId = localStorage.getItem('userId');
    clinicadminPatientService.getAssociatedPatientsByFilter(filter, clinicId, userId, pageNo, offset).then(function(response){
      $scope.patients = [];
      angular.forEach(response.data.patientUsers, function(patientList){
        patientList.patientComp.patientUser.hcp = patientList.hcp;
        patientList.patientComp.patientUser.adherence = patientList.patientComp.score;
        patientList.patientComp.patientUser.transmission  = patientList.patientComp.latestTherapyDate;
        $scope.patients.push(patientList.patientComp.patientUser);
      });
      $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] : $scope.patients.length;
      $scope.pageCount = Math.ceil($scope.total / 10);
    }).catch(function(response){
      notyService.showError(response);
    });
  };

	$scope.getPatientsWithNoEvents = function(filter, clinicId, pageNo, offset){
    var userId = localStorage.getItem('userId');
		clinicadminPatientService.getAssociatedPatientsWithNoEvents(filter, clinicId, userId).then(function(response){
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
      $scope.associatedHCPs = response.data.hcpUsers
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

  $scope.getClinicById = function(clinicId){
    clinicService.getClinic(clinicId).then(function(response){
      $scope.clinic = response.data.clinic;
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
    $state.go('clinicadminpatientOverview',{'patientId': patient.id});
	};

	$scope.switchPatientTab = function(value){
		$state.go(value, {'patientId':$stateParams.patientId});
	};

	$scope.goToPatientDashboard = function(value){
		$state.go(value);
	};

	/*$scope.searchPatients = function(value){
		$state.go('clinicadminpatientdashboard',{'filter':value});
	};
*/
  $scope.switchClinic = function(clinic){
    if($scope.selectedClinic.id !== clinic.id){
      $scope.selectedClinic = clinic;
      if($stateParams.filter === 'noevents'){
        $scope.getPatientsWithNoEvents($stateParams.filter, clinic.id);
      } else if($stateParams.filter === ''){
        $scope.getAllPatientsByClinicId(clinic.id);
      } else {
        $scope.getPatientsByFilter($stateParams.filter, clinic.id);
      }
    }
  };

  $scope.changeSortOption = function(){
    console.log('Todo :Check Box changes', $scope.sortOn);
  };

  $scope.openEditDetail = function(){
    $state.go('clinicadmminpatientDemographicEdit', {'patientId': $stateParams.patientId});
  };

  $scope.cancelEditDemographics = function(){
    $state.go('clinicadminpatientDemographic', {'patientId': $stateParams.patientId});
  };

  $scope.editPatient = function(){
    if($scope.form.$invalid){
      return false;
    }
    var data = $scope.patient;
    data.role = 'PATIENT';
    data.clinicMRNId.clinicId = $stateParams.clinicId;
    if(data.clinicMRNId.clinic){
      delete data.clinicMRNId.clinic;
    }
    UserService.editUser(data).then(function (response) {
      $state.go('clinicadminpatientDemographic', {'patientId': $stateParams.patientId});
      notyService.showMessage(response.data.message, 'success');
    }).catch(function(response){
      notyService.showError(response);
    });

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
    DoctorService.searchPatientsForHCP($scope.searchItem, localStorage.getItem('userId'), clinicId, $scope.currentPageIndex, $scope.perPageCount).then(function (response) {
      $scope.patients = [];
      angular.forEach(response.data, function(patient){
        $scope.patients.push({"patientUser": patient});
      });
      $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] :$scope.patients.length; 
      $scope.pageCount = Math.ceil($scope.total / 10);
      searchOnLoad = false;
    }).catch(function (response) {
      notyService.showError(response);
    });    
  };

	$scope.init();
}]);
