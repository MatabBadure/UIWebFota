angular.module('hillromvestApp')
.controller('clinicadminPatientController',['$scope', '$state', '$stateParams', 'clinicadminPatientService', 'patientService', 'notyService', 'DoctorService', 'clinicadminService', 'clinicService', 'dateService', 'UserService', 'searchFilterService', '$timeout', 'StorageService', 'sortOptionsService','$filter', 'commonsUserService', '$q',
  function($scope, $state, $stateParams, clinicadminPatientService, patientService, notyService, DoctorService, clinicadminService, clinicService, dateService, UserService, searchFilterService, $timeout, StorageService, sortOptionsService,$filter, commonsUserService, $q) { 
	var searchOnLoad = true;
	$scope.init = function(){
    if($state.current.name === 'clinicadminpatientDemographic'  || $state.current.name === 'clinicadmminpatientDemographicEdit'){
      $scope.getPatientInfo($stateParams.patientId, $scope.setEditMode);
      if($state.current.name === 'clinicadmminpatientDemographicEdit'){
        $scope.getStates();
      }
    }else if($state.current.name === 'clinicadminpatientClinics'){
      $scope.getPatientInfo($stateParams.patientId);
      $scope.getClinicsandHcpAssociatedToPatient($stateParams.patientId);
    }else if($state.current.name === 'clinicadminpatientProtocol'){
      $scope.getPatientInfo($stateParams.patientId);
      $scope.getPatientDevicesandProtocols($stateParams.patientId);
    }else if($state.current.name === 'clinicadminpatientCraegiver'){
      $scope.getPatientInfo($stateParams.patientId);
      $scope.getCaregiversAssociatedWithPatient($stateParams.patientId);
    }else if($state.current.name === 'clinicadminpatientdashboard'){
      $scope.searchItem = "";
      $scope.searchFilter = searchFilterService.initSearchFiltersForPatient($stateParams.filter);
      $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
      $scope.currentPageIndex = 1;
      $scope.perPageCount = 10;
      $scope.pageCount = 0;
      $scope.getClinicsAssociatedToHCP();
      var clinicId = $stateParams.clinicId;
      $scope.searchPatients(); 
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
    clinicadminService.getClinicsAssociated(StorageService.get('logged').userId).then(function(response){
      if(response.data && response.data.clinics){
        $scope.clinics = $filter('orderBy')(response.data.clinics, "name");
        if($stateParams.clinicId){
          $scope.selectedClinic = commonsUserService.getSelectedClinicFromList($scope.clinics, $stateParams.clinicId);
        }else if($scope.clinics && $scope.clinics.length > 0){
          $scope.selectedClinic =  $scope.clinics[0];
        }
      }
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.getPatientInfo = function(patinetId, callback){
    clinicadminPatientService.getPatientInfo(patinetId, $stateParams.clinicId).then(function(response){
      $scope.patient = response.data.patientUser;
      if($scope.patient.zipcode){
        $scope.patient.zipcode = commonsUserService.formatZipcode($scope.patient.zipcode);
      }
      if (typeof callback === 'function') {
        callback($scope.patient);
      }
    }).catch(function(response){
      notyService.showError(response);
      $state.go('clinicadminpatientdashboard',{'clinicId':$stateParams.clinicId});
    });
  };

  $scope.getPatientsByFilter = function(filter, clinicId, pageNo, offset){
    var userId = StorageService.get('logged').userId;
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
    var userId = StorageService.get('logged').userId;
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
    $scope.getClinicById($stateParams.clinicId);
  };

  $scope.getAssociateHCPToPatient = function(patientId){
    clinicadminPatientService.getAssociatedHCPOfPatientClinic(patientId, $stateParams.clinicId).then(function(response){
      $scope.associatedHCPs = response.data.hcpList
    });
  };

  $scope.getClinicById = function(clinicId){
    clinicService.getClinic(clinicId).then(function(response){
      $scope.clinic = response.data.clinic;
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
      angular.forEach(response.data.deviceList, function(device){
        device.createdDate = dateService.getDateByTimestamp(device.createdDate);
        device.lastModifiedDate = dateService.getDateByTimestamp(device.lastModifiedDate);
      });
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
    var clinicId = ($scope.selectedClinic && $scope.selectedClinic.id) ? $scope.selectedClinic.id : ($stateParams.clinicId ? $stateParams.clinicId : null);
    $state.go('clinicadminpatientOverview',{'patientId': patient.id, 'clinicId': clinicId});
	};

	$scope.switchPatientTab = function(value){
		$state.go(value, {'patientId':$stateParams.patientId});
	};

	$scope.goToPatientDashboard = function(value){
    var clinicId = ($scope.selectedClinic && $scope.selectedClinic.id) ? $scope.selectedClinic.id : ($stateParams.clinicId ? $stateParams.clinicId : null);
		$state.go(value,{'clinicId': clinicId});
	};

  $scope.switchClinic = function(clinic){
    if($scope.selectedClinic.id !== clinic.id){
      $scope.selectedClinic = clinic;
      $scope.searchPatients();      
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
    delete data.status;
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
    if(patient.expired){
      $scope.patient.status = 'expired';
    }else if(patient.isDeleted){
      $scope.patient.status = 'inactive';
    }else {
      $scope.patient.status = 'active';
    }
    if (patient.dob !== null) {
      $scope.patient.age = dateService.getAge(new Date($scope.patient.dob));
      var _date = dateService.getDate($scope.patient.dob);
      var _month = dateService.getMonth(_date.getMonth());
      var _day = dateService.getDay(_date.getDate());
      var _year = dateService.getYear(_date.getFullYear());
      var dob = _month + "/" + _day + "/" + _year;
      $scope.patient.dob = dob;
      $scope.patient.formatedDOB = _month + "/" + _day + "/" + _year;
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
    var filter = searchFilterService.getFilterStringForPatient($scope.searchFilter);
    var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
    DoctorService.searchPatientsForHCPOrCliniadmin($scope.searchItem, 'clinicadmin', StorageService.get('logged').userId, clinicId, $scope.currentPageIndex, $scope.perPageCount, filter, $scope.sortOption).then(function (response) {
      $scope.patients = response.data;      
      angular.forEach($scope.patients, function(patient){
        patient.dob = dateService.getDateFromTimeStamp(patient.dob, patientDashboard.dateFormat, '/');
      });
      $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] :$scope.patients.length; 
      $scope.pageCount = Math.ceil($scope.total / 10);
      searchOnLoad = false;
    }).catch(function (response) {
      notyService.showError(response);
    });    
  };

  $scope.searchOnFilters = function(){    
    $scope.searchPatients();
  };

  var timer = false;
  $scope.$watch('searchItem', function() { 
    $scope.searchItem = ($scope.searchItem != undefined) ? $scope.searchItem : stringConstants.emptyString ;
    if(!searchOnLoad){
    if (timer) {
      $timeout.cancel(timer)
    }
    timer = $timeout(function() {
      $scope.searchPatients();
    }, 1000)
   }
  });  
  
  $scope.sortType = function(sortParam){ 
    var toggledSortOptions = {};
    $scope.sortOption = "";
    if(sortParam === sortConstant.lastName){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.lastName);
      $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
      $scope.sortPatientList.lastName = toggledSortOptions;
      $scope.sortOption = sortConstant.lastName + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.searchPatients();
    }else if(sortParam === sortConstant.mrnId){
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.mrnId);
      $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
      $scope.sortPatientList.mrnId = toggledSortOptions;
      $scope.sortOption = sortConstant.mrnid + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.searchPatients();
    }else if(sortParam === sortConstant.dob){
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.dob);
      $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
      $scope.sortPatientList.dob = toggledSortOptions;
      $scope.sortOption = sortConstant.dob + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.searchPatients();
    }else if(sortParam === sortConstant.city){
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.city);
      $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
      $scope.sortPatientList.city = toggledSortOptions;
      $scope.sortOption = sortConstant.city + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.searchPatients();
    }else if(sortParam === sortConstant.transmission){
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.transmission);
      $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
      $scope.sortPatientList.transmission = toggledSortOptions;
      $scope.sortOption = sortConstant.last_date + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.searchPatients();
    }else if(sortParam === sortConstant.status){
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.status);
      $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
      $scope.sortPatientList.status = toggledSortOptions;
      $scope.sortOption = sortConstant.isDeleted + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.searchPatients();
    }else if(sortParam === sortConstant.adherence){
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.adherence);
      $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
      $scope.sortPatientList.adherence = toggledSortOptions;
      $scope.sortOption = sortConstant.adherence + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.searchPatients();
    }else if(sortParam === sortConstant.hcp){
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.hcp);
      $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
      $scope.sortPatientList.hcp = toggledSortOptions;
      $scope.sortOption = sortConstant.hcpname + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.searchPatients();
    }       
    
  };

  $scope.getAvailableAndAssociatedHCPs = function(patientId){
    var searchString = "";
    var offset = 100;
    var pageNo = 1;
    $q.all([
      clinicService.getClinicAssoctHCPs($stateParams.clinicId),
      clinicadminPatientService.getAssociatedHCPOfPatientClinic(patientId, $stateParams.clinicId)
    ]).then(function(data) {
      if(data){
        if(data[0]){
          $scope.hcps = [];
          $scope.hcps = data[0].data.hcpUsers;
        }
        if(data[1] && data[1].data.hcpList !== undefined){
          $scope.associatedHCPs = [];
          $scope.associatedHCPs = data[1].data.hcpList;
          for(var i=0; i < $scope.associatedHCPs.length; i++){
            for(var j=0; j <  $scope.hcps.length; j++ ){
              if($scope.associatedHCPs[i].id == $scope.hcps[j].id){
                $scope.hcps.splice(j, 1);
              }
            }
          }
        }
      }
    }).catch(function(data){notyService.showError(response, 'warning');});
  };

  $scope.selectHcpForPatient = function(hcp){
    var data = [{'id': hcp.id}];
    $scope.searchHcp = "";
    $scope.searchHCPText = false;
    patientService.associateHCPToPatient(data, $stateParams.patientId).then(function(response){
      $scope.getAvailableAndAssociatedHCPs($stateParams.patientId);
      notyService.showMessage(response.data.message, 'success');
    });
  };

  $scope.linkHCP = function(){
    $scope.getAvailableAndAssociatedHCPs($stateParams.patientId);
    $scope.searchHCPText = true;
  };

  $scope.showUpdatePatientModal = function(){
    $scope.submitted = true;
    if($scope.form.$invalid){
      return false;
    }else{
      $scope.updateModal = true;
    }
  };

  angular.element('#dp2').datepicker({
          endDate: '+0d',
          autoclose: true});
  
	$scope.init();
}]);
