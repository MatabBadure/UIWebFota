angular.module('hillromvestApp')
.controller('hcpPatientController',['$scope', '$state', '$stateParams', 'hcpPatientService', 'patientService', 'notyService', 'DoctorService', 'clinicadminPatientService', 'dateService', 'clinicService', '$timeout', 'searchFilterService', 'StorageService', 'sortOptionsService','$filter', 'commonsUserService',
  function($scope, $state, $stateParams, hcpPatientService, patientService, notyService, DoctorService, clinicadminPatientService, dateService, clinicService, $timeout, searchFilterService, StorageService, sortOptionsService, $filter,commonsUserService) {   
  var searchOnLoad = true; 
   $scope.DisableAddProtocol = false; 
    $scope.displayFlag = true;
          $scope.customPointsChecker = 0;
          $scope.lastdeviceType = "";   
	$scope.init = function(){     
    if($state.current.name === 'hcppatientDemographic'){
      $scope.getPatientInfo($stateParams.patientId, $scope.setEditMode);
    }else if($state.current.name === 'hcppatientdemographicEdit'){
      $scope.getPatientInfo($stateParams.patientId);
    }
    else if($state.current.name === 'hcppatientClinics'){
      $scope.getClinicsandHcpAssociatedToPatient($stateParams.patientId);      
    }else if($state.current.name === 'hcppatientProtocol'){
      $scope.getPatientInfo($stateParams.patientId);
      $scope.getPatientDevicesandProtocols($stateParams.patientId);
    }else if($state.current.name === 'hcppatientCraegiver'){
      $scope.getPatientInfo($stateParams.patientId);
      $scope.getCaregiversAssociatedWithPatient($stateParams.patientId);
    }else if($state.current.name === 'hcppatientdashboard'){
      $scope.sortOption = "";
      $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
      if($stateParams.filter){
        var filter = ($stateParams.filter).split("+");
      }
      else var filter = "";
      $scope.searchFilter = searchFilterService.initSearchFiltersForPatient(filter, true);
      $scope.currentPageIndex = 1;
      $scope.perPageCount = 10;
      $scope.pageCount = 0;
      $scope.getClinicsAssociatedToHCP();  
      $scope.initCount($stateParams.clinicId);               
    }
	};


  $scope.getClinicsAssociatedToHCP = function(){
    DoctorService.getClinicsAssociatedToHCP(StorageService.get('logged').userId).then(function(response){
      if(response.data && response.data.clinics){
        $scope.clinics = $filter('orderBy')(response.data.clinics, "name");
        var benchmarkingClinic = (StorageService.get('benchmarkingClinic') && StorageService.get('benchmarkingClinic').clinic) ? StorageService.get('benchmarkingClinic').clinic.id : null;
        var currentClinicId = ($stateParams.clinicId) ? $stateParams.clinicId : (benchmarkingClinic ? benchmarkingClinic : null) ;            
        $scope.clinics.push({"id": "others", "name": "Others"});
        if(currentClinicId){
          $scope.selectedClinic = commonsUserService.getSelectedClinicFromList($scope.clinics, currentClinicId);
        }else if($scope.clinics && $scope.clinics.length > 0){
          $scope.selectedClinic =  $scope.clinics[0];
        }
      }
      $scope.searchPatients();
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
    clinicadminPatientService.getPatientInfo(patinetId, $stateParams.clinicId,StorageService.get('logged').userId).then(function(response){
      $scope.patient = response.data.patientUser;
      $scope.patient.zipcode = commonsUserService.formatZipcode($scope.patient.zipcode);
      $scope.langKey = $scope.patient.langKey;
        $scope.fullNameLangKey = "";
         $scope.fullNameLangKey = patientService.getLanguageName($scope.langKey);
      if(callback){
        callback($scope.patient);
      }
      if($scope.patient){
        if($scope.patient.deviceType){
        $scope.patient.deviceType = patientService.getDeviceTypeName($scope.patient.deviceType);
        }
        else{
          $scope.patient.deviceType = patientService.getDeviceTypeName($scope.getDeviceTypeforBothIcon());
        }
            if($scope.patient.monarchGarmentSize){
              $scope.patient.monarchGarmentSize = searchFilters.oneSize;
            }
         }


    }).catch(function(response){
      notyService.showError(response);
      if(response.status === 400){
        $state.go('hcppatientdashboard',{'clinicId': $stateParams.clinicId});
      }
    });
  };

  $scope.getPatientsByFilter = function(filter, clinicId, pageNo, offset){
    var userId = StorageService.get('logged').userId;
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
    var userId = StorageService.get('logged').userId;
		hcpPatientService.getAssociatedPatientsWithNoEvents(filter, clinicId, userId, pageNo, offset).then(function(response){
      $scope.patients = response.data.patientUsers;
      $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] : $scope.patients.length;
      $scope.pageCount = Math.ceil($scope.total / 10);
    }).catch(function(response){
      notyService.showError(response);
    });
	};

  $scope.getPatientById = function(patientId){
    patientService.getPatientInfo(patientId).then(function(response){
      $scope.slectedPatient = response.data;
    });
  };

  $scope.getClinicsandHcpAssociatedToPatient = function(patientId){
    $scope.getPatientById(patientId);
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
      $scope.normalProtocol = new Array(new Array());
         $scope.normalProtocol[0] = [];
          $scope.normalProtocol[1] = [];
        $scope.customProtocol = new Array(new Array());
         $scope.customProtocol[0] = [];
          $scope.customProtocol[1] = [];
    $scope.DisableAddProtocol = false;
    patientService.getProtocol(patientId,$scope.getDeviceTypeforBothIcon()).then(function(response){
      $scope.protocols = response.data.protocol;
       if($scope.getDeviceTypeforBothIcon() === searchFilters.allCaps){
        angular.forEach($scope.protocols, function(protocol, key){
          var protocolkey = protocol.protocolKey;
          var protocolobject = {}
            if(protocol.type === 'Normal'){
              if($scope.normalProtocol[0].length){
              if($scope.normalProtocol[0][0].protocolKey === protocolkey){
            protocolobject = protocol;
              $scope.normalProtocol[0].push(protocolobject);
             }
             else{
            protocolobject = protocol;
              $scope.normalProtocol[1].push(protocolobject);
             }
           }
       else{
             protocolobject = protocol;
              $scope.normalProtocol[0].push(protocolobject);
            }
      }
            else if(protocol.type === 'Custom'){
              if($scope.customProtocol[0].length){
              if($scope.customProtocol[0][0].protocolKey === protocolkey){
            protocolobject = protocol;
              $scope.customProtocol[0].push(protocolobject);
             }
             else{
            protocolobject = protocol;
              $scope.customProtocol[1].push(protocolobject);
             }
           }
           else{
            protocolobject = protocol;
              $scope.customProtocol[0].push(protocolobject);
           }
            }
          });
        }
              var vestFlag = false;
        var monarchFlag = false;
        $scope.lastdeviceType = $scope.protocols[0].deviceType;
        angular.forEach($scope.protocols, function(protocol){
          if(protocol.deviceType === searchFilters.VisiVest){
            vestFlag = true;
           
          }
          if(protocol.deviceType === searchFilters.Monarch){
            monarchFlag = true;
           
          }
        });
          if(vestFlag && monarchFlag){
          $scope.DisableAddProtocol = true;
        
        }
        else{
          $scope.DisableAddProtocol = false;
         
        }
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.getDevices = function(patientId){
    patientService.getDevices(patientId).then(function(response){
      angular.forEach(response.data.deviceList, function(device){
        device.createdDate = dateService.getDateByTimestamp(device.createdDate);
        device.lastModifiedDate = dateService.getDateByTimestamp(device.lastModifiedDate);
         device.createdDate = dateService.getDateByTimestamp(device.createdDate);
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
        //localStorage.setItem('deviceType', patient.deviceType);
        if(patient.deviceType == 'ALL'){
          localStorage.setItem('deviceType_'+patient.id, 'VEST');
        //  localStorage.setItem('deviceTypeforGraph', 'ALL');
          localStorage.setItem('deviceTypeforBothIcon_'+patient.id, 'ALL');
            }
            else{
            localStorage.setItem('deviceType_'+patient.id, patient.deviceType);
           // localStorage.setItem('deviceTypeforGraph', patient.deviceType);
            localStorage.setItem('deviceTypeforBothIcon_'+patient.id, patient.deviceType);
          }
    $state.go('hcppatientOverview',{'patientId': patient.id, 'clinicId': $scope.selectedClinic.id});
	};

	$scope.switchPatientTab = function(value){     
		value = 'hcp' + value;
		$state.go(value, {'patientId':$stateParams.patientId, 'clinicId': $stateParams.clinicId});
	};

	$scope.goToPatientDashboard = function(value){
      var clinicId =  ($scope.selectedClinic && $scope.selectedClinic.id) ? $scope.selectedClinic.id : ($stateParams.clinicId ? $stateParams.clinicId : null);
      $state.go(value, {'clinicId': clinicId});
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
    $scope.searchFilter = ($scope.searchFilter && $scope.searchFilter != undefined) ? $scope.searchFilter :searchFilterService.initSearchFiltersForPatient();
    var filter = searchFilterService.getFilterStringForPatient($scope.searchFilter);
    if(filter){
    var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
    DoctorService.searchPatientsForHCP($scope.searchItem, 'hcp',StorageService.get('logged').userId, clinicId, $scope.currentPageIndex, $scope.perPageCount, filter, $scope.sortOption).then(function (response) {
      $scope.patients = response.data;      
      angular.forEach($scope.patients, function(patient){
        patient.dob = (patient.dob) ? dateService.getDateFromTimeStamp(patient.dob, patientDashboard.dateFormat, '/') : patient.dob;
        patient.lastTransmissionDate = (patient.lastTransmissionDate) ? dateService.getDateFromYYYYMMDD(patient.lastTransmissionDate, '/') : patient.lastTransmissionDate;
      });
      $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] :$scope.patients.length; 
      $scope.pageCount = Math.ceil($scope.total / 10);
      searchOnLoad = false;
    }).catch(function (response) {
      notyService.showError(response);
    });    
    }
    else{
      $scope.patients = {};
      $scope.currentPageIndex = 1;
      $scope.perPageCount = 10;
      $scope.pageCount = 0;
    }       
	};

  $scope.switchClinic = function(clinic){
    if($scope.selectedClinic.id !== clinic.id){
      $scope.selectedClinic = clinic;
      $scope.searchPatients();      
    }
    $scope.initCount($scope.selectedClinic.id);
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

  $scope.getPatientsForClinic = function(clinicId){
    DoctorService.searchPatientsForHCPOrCliniadmin($scope.searchItem, 'hcp', StorageService.get('logged').userId, clinicId, $scope.currentPageIndex, $scope.perPageCount).then(function (response) {
      $scope.patients = response.data;
      $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] :$scope.patients.length; 
      $scope.pageCount = Math.ceil($scope.total / 10);
      searchOnLoad = false;
    }).catch(function (response) {
      notyService.showError(response);
    });   
  };

  $scope.init();

  var timer = false;
  $scope.$watch('searchItem', function() { 
    $scope.searchItem = ($scope.searchItem != undefined) ? $scope.searchItem : stringConstants.emptyString ;
    if($state.current.name === "hcppatientdashboard" && !searchOnLoad){
    if (timer) {
      $timeout.cancel(timer)
    }
    timer = $timeout(function() {
      $scope.searchPatients();
    }, 1000)
   }
  }); 

  $scope.searchOnFilters = function(){    
    $scope.searchPatients();
  }; 
	
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
      $scope.sortOption = sortConstant.patientDoB + sortOptionsService.getSortByASCString(toggledSortOptions);
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

  $scope.openEditProtocol = function(protocol){
    if(!protocol){
      return false;
    }
    $state.go('hcpUpdateProtocol', {'protocolId': protocol.id , 'protocolDevice' : protocol.deviceType});
  };
  $scope.openEditDetail = function(){
        $state.go('hcppatientdemographicEdit', {'patientId': $stateParams.patientId});  
    };
  $scope.showPatientUpdateModel = function(){
    /*alert($scope.form.$invalid);
    if($scope.form.$invalid){
      $scope.submitted = true;
      return false;
    }else{*/
      $scope.updateModel = true;
     
   // }  
    };
    $scope.cancelEditDemographics = function(){
          $state.go('hcppatientDemographic', {'patientId': $stateParams.patientId});    
    };


     $scope.setModelValue = function(){
          $scope.updateModel = false;
    };
    $scope.protocolDeviceIconFilter = function(protocol){
      if($scope.getDeviceTypeforBothIcon() === searchFilters.allCaps){
       if($scope.customPointsChecker == $scope.protocols.length){
          $scope.customPointsChecker = 0;
          $scope.lastdeviceType = $scope.protocols[0].deviceType;
        }
      
      if(protocol.type === 'Normal'){
        $scope.customPointsChecker = 0;
        $scope.lastdeviceType = protocol.deviceType;
        $scope.displayFlag = true;
        return true;
      }
      else if(protocol.type === 'Custom'){
      if($scope.lastdeviceType != protocol.deviceType){
         $scope.customPointsChecker = 0;
      }
      $scope.customPointsChecker++;
      if($scope.customPointsChecker == 1){
         $scope.lastdeviceType = protocol.deviceType;
         $scope.displayFlag = true;
        return true;
      }
      else{
         $scope.lastdeviceType = protocol.deviceType;
         $scope.displayFlag = false;
        return false;
      }
        }
      }
      else{
        return true;
      }
    };

    $scope.editPatientNotes = function(notes){
     $scope.updateModel = false;
     patientID=$stateParams.patientId;

     patientService.getPatientInfo(patientID).then(function(response){
      $scope.slectedPatient = response.data;
    });

      var notes = $scope.patient.clinicMRNId.memoNote;

       $scope.patientNotesMemo = {
      'note': notes,
      'userId': StorageService.get('logged').userId,
      'patientId': $scope.patient.hillromId
    };

     var temp = $scope.patientNotesMemo;

      hcpPatientService.updatePatientNotes(temp).then(function (response) {
        notyService.showMessage('User Updated Successfully', 'success');
        $state.go('hcppatientDemographic', {'patientId': $stateParams.patientId});
      }).catch(function(response){
        notyService.showError(response);
      });
    
  };

}]);
