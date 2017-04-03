angular.module('hillromvestApp')
.controller('clinicadminPatientController',['$scope', '$state', '$stateParams', 'clinicadminPatientService', 'patientService', 'notyService', 'DoctorService', 'clinicadminService', 'clinicService', 'dateService', 'UserService', 'searchFilterService', '$timeout', 'StorageService', 'sortOptionsService','$filter', 'commonsUserService', '$q', 'addressService', '$rootScope', 'exportutilService',
  function($scope, $state, $stateParams, clinicadminPatientService, patientService, notyService, DoctorService, clinicadminService, clinicService, dateService, UserService, searchFilterService, $timeout, StorageService, sortOptionsService,$filter, commonsUserService, $q, addressService, $rootScope, exportutilService) { 
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
       $scope.getTodayDateForReset();
      $scope.scoreToReset = 100;
      //$scope.resetStartDate = null;
      $scope.ShowOther = false;
      patientService.getJustification().then(function(response){
         $scope.justificationlist =  response.data.typeCode;
      }).catch(function(response){});
    }else if($state.current.name === 'clinicadminpatientCraegiver'){
      $scope.getPatientInfo($stateParams.patientId);
      $scope.getCaregiversAssociatedWithPatient($stateParams.patientId);
    }else if($state.current.name === 'clinicadminpatientdashboard'){
      $scope.searchItem = "";
      if($stateParams.filter){
       var filter = ($stateParams.filter).split("+");
     }
    else{
      var filter = "";
    }
      $scope.searchFilter = searchFilterService.initSearchFiltersForPatient(filter, true);
      $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
      $scope.currentPageIndex = 1;
      $scope.perPageCount = 10;
      $scope.pageCount = 0;
      $scope.getClinicsAssociatedToHCP();
      var clinicId = $stateParams.clinicId;
      $scope.initCount($stateParams.clinicId);
      $scope.searchPatients(); 
    }
  };

  $scope.resetScore = function()
    {
      
      //$scope.resetsubmitted = true;
      var deviceType = localStorage.getItem('deviceType');
      var createdById = StorageService.get('logged').userId;
      var userID = $stateParams.patientId;
      var patientHillromId = $scope.patientInformation;
      var resetDate = $scope.resetStartDate;
      var res = resetDate.split("/");
      var resetDateFinal = res[2]+"-"+res[0]+"-"+res[1];
      var resetTo = $scope.scoreToReset;
      var tempJustification = $scope.justification;
      if(tempJustification=="Other")
      { 
        var reason = $scope.othersContent;

      }
      else
      {
        var reason = $scope.justification;
      }

      $scope.patientAdherenceInfo = {
      'createdBy': createdById,
      'userId': userID,
      'patientId': patientHillromId,
      'resetStartDate': resetDateFinal,
      'resetScore': resetTo,
      'justification': reason,
      'deviceType' : deviceType
      };

      patientService.addAdherenceScore($scope.patientAdherenceInfo).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $scope.form.$setPristine();
        $scope.showUpdateModalReset = false;
   /*     $scope.resetStartDate = null;
        $scope.justification = "";
        $scope.scoreToReset = 100;
        $scope.othersContent = null;
        $scope.ShowOther = false;*/
        $scope.resetsubmitted = false ; 
        if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientProtocolRcadmin', {'patientId': $stateParams.patientId});
      }else{
        $state.go('patientProtocol');
      }
      }).catch(function(response){
        notyService.showError(response);
        $scope.form.$setPristine();
        $scope.showUpdateModalReset = false;
       /* $scope.resetStartDate = null;
        $scope.justification = "";
        $scope.scoreToReset = 100;
        $scope.othersContent = null;
          $scope.ShowOther = false;*/
        $scope.resetsubmitted = false ; 
      });

    };

    $scope.handleChange = function()
     {
      if(Number($scope.scoreToReset) >100 || Number($scope.scoreToReset) ==0)
      {
        $scope.maxNumberReached = true;
      }
      else
      {
        $scope.maxNumberReached = false;
      }
     };

     $scope.showUpdateReset = function()
    {
      if($scope.form.$invalid){
        $scope.resetsubmitted = true;
       
        return false;
      }else if($scope.maxNumberReached)
      {
         $scope.maxNumberReached= true;
         return false;
      }
      else{
         $scope.showUpdateModalReset = true;
      }
     
    };

    $scope.SelectOthers = function(option){
      if(option == 'Other')
      {
        $scope.ShowOther = true;
      }
      else
      {
        $scope.ShowOther = false;
      }

    };

     $scope.getTodayDateForReset = function()
    {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear().toString();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var today = mm+'/'+dd+'/'+yyyy;
        $scope.todayDate = today;
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
    clinicadminPatientService.getPatientInfo(patinetId, $stateParams.clinicId,StorageService.get('logged').userId).then(function(response){
      $scope.patient = response.data.patientUser;
      if($scope.patient.zipcode){
        $scope.patient.zipcode = commonsUserService.formatZipcode($scope.patient.zipcode);
      }
      $scope.langKey = $scope.patient.langKey;
        $scope.fullNameLangKey = "";
        if($scope.langKey== "en")
        {
          $scope.fullNameLangKey = "English";
        }
        else if($scope.langKey== "fr")
        {
          $scope.fullNameLangKey = "French";
        }
        else if($scope.langKey== "de")
        {
          $scope.fullNameLangKey = "German";
        }
         else if($scope.langKey== "hi")
        {
          $scope.fullNameLangKey = "Hindi";
        }
         else if($scope.langKey== "it")
        {
          $scope.fullNameLangKey = "Italian";
        }
         else if($scope.langKey== "ja")
        {
          $scope.fullNameLangKey = "Japanese";
        }
         else if($scope.langKey== "es")
        {
          $scope.fullNameLangKey = "Spanish";
        }
         else if($scope.langKey== "zh")
        {
          $scope.fullNameLangKey = "Chinese";
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
   // localStorage.setItem('deviceType', patient.deviceType);
    if(patient.deviceType == 'ALL'){
          localStorage.setItem('deviceType', 'VEST');
          localStorage.setItem('deviceTypeforGraph', 'ALL');
          localStorage.setItem('deviceTypeforBothIcon', 'ALL');
            }
            else{
            localStorage.setItem('deviceType', patient.deviceType);
            localStorage.setItem('deviceTypeforGraph', patient.deviceType);
            localStorage.setItem('deviceTypeforBothIcon', patient.deviceType);

          }
    var clinicId = ($scope.selectedClinic && $scope.selectedClinic.id) ? $scope.selectedClinic.id : ($stateParams.clinicId ? $stateParams.clinicId : null);
   $scope.deviceType = patient.deviceType;
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
    $state.go('clinicadminpatientdashboard',{'clinicId': $scope.selectedClinic.id});
    $scope.initCount($scope.selectedClinic.id);
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
    $scope.updateModal = false;
    addressService.getCityStateByZip($scope.patient.zipcode).then(function(response){
      $scope.patient.city = response.data[0].city;
      $scope.patient.state = response.data[0].state;
      var data = $scope.patient;
      data.role = 'PATIENT';
      data.clinicMRNId.clinicId = $stateParams.clinicId;
      delete data.status;
      if(data.clinicMRNId.clinic){
        delete data.clinicMRNId.clinic;
      }

      var notes = $scope.patient.clinicMRNId.memoNote;

      if(($scope.patient.clinicMRNId.memoNote).length==0)
      {
        notes = " ";
      }

       $scope.patientNotesMemo = {
      'note': notes,
      'userId': StorageService.get('logged').userId,
      'patientId': $scope.patient.hillromId
    };

     var temp = $scope.patientNotesMemo;
    
      UserService.editUserNotes(temp).then(function (response) {
        UserService.editUser(data).then(function (response) {
        notyService.showMessage(response.data.message, 'success');
         $state.go('clinicadminpatientDemographic', {'patientId': $stateParams.patientId});
      }).catch(function(response){
        notyService.showError(response);
      });
      }).catch(function(response){
        notyService.showError(response);
      });
    }).catch(function(response){
      $scope.patient.state = null;
      $scope.patient.city = null;
      $scope.serviceError = response.data.ERROR;
      $scope.isServiceError = true;
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
        patient.dob = (patient.dob) ? dateService.getDateFromTimeStamp(patient.dob, patientDashboard.dateFormat, '/') : patient.dob;
        patient.lastTransmissionDate = (patient.lastTransmissionDate) ? dateService.getDateFromYYYYMMDD(patient.lastTransmissionDate, '/') : patient.lastTransmissionDate;
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

  $scope.getHCPstoLink = function($viewValue){
    return searchFilterService.getMatchingUser($viewValue, $scope.hcps, true);
  };

  $scope.showAssociateHCPModal = function(hcp){
    $scope.selectedHCP = hcp;
    $scope.associateHCPModal = true;
  };

  $scope.selectHcpForPatient = function(){
    $scope.associateHCPModal = false;
    var data = [{'id': $scope.selectedHCP.id}];
    $scope.searchHcp = "";
    patientService.associateHCPToPatient(data, $stateParams.patientId).then(function(response){
      $scope.getAvailableAndAssociatedHCPs($stateParams.patientId);
      $scope.searchHCPText = false;
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

  $scope.getCityState = function(zipcode){   
    delete $scope.serviceError;
    $scope.isServiceError = false;
    if(zipcode){
      addressService.getCityStateByZip(zipcode).then(function(response){
        $scope.patient.city = response.data[0].city;
        $scope.patient.state = response.data[0].state;
      }).catch(function(response){
        $scope.patient.state = null;
        $scope.patient.city = null;
        $scope.serviceError = response.data.ERROR;
        $scope.isServiceError = true;
      });  
    }else{
      delete $scope.patient.city;
      delete $scope.patient.state;
      if($scope.form.zip.$dirty && $scope.form.zip.$showValidationMessage && $scope.form.zip.$invalid){
      }else{
        $scope.serviceError = 'Invalid Zipcode';  
        $scope.isServiceError = true;
      }
    }
  };

 angular.element('#dp2').datepicker({
  endDate: '+0d',
  startDate: '-100y',
  autoclose: true});

  $scope.openEditProtocol = function(protocol){
    if(!protocol){
      return false;
    }
    $state.go('clinicAdminUpdateProtocol', {'protocolId': protocol.id});
  };

  $scope.init();

  $scope.$watch("patient.formatedDOB", function(value) {
    if($state.current.name === 'clinicadmminpatientDemographicEdit'){
      if(value && (commonsUserService.isValidDOBDate(value))){
      $scope.patient.dob = value;
        var age = dateService.getAge(new Date(value));
        $scope.patient.age = age;
        if (age === 0) {
          $scope.form.$invalid = true;
        }
      }else{
        $scope.form.dob.$invalid = true;
        $scope.form.$invalid = true;
        if($scope.patient){
          $scope.patient.age = '';
        }
      }
    }
  });
 
}]);
