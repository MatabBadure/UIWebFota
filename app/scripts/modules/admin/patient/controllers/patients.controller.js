'use strict';


angular.module('hillromvestApp')
.filter('range', function() {
  return function(val, range) {
    range = parseInt(range);
    for (var i=0; i<range; i++)
      val.push(i);
    return val;
  };
})
.controller('patientsController',['$scope','$rootScope', '$state', '$stateParams', 'patientService', 'dateService', 'notyService', 'UserService', 'DoctorService', 'clinicService', '$q', 'StorageService', 'loginConstants', 'commonsUserService', 'searchFilterService', 'addressService','exportutilService',
  function($scope, $rootScope, $state, $stateParams, patientService, dateService, notyService, UserService, DoctorService, clinicService, $q, StorageService, loginConstants, commonsUserService, searchFilterService, addressService, exportutilService) {
    $scope.currentPageIndex = 1;
    $scope.pageCount = 0;
    $scope.perPageCount = 5;
    $scope.PageNumber=1;
    $scope.nodataflag = false;
    var isFormLoaded = false;
    $scope.patient = {};
    $scope.patientTab = "";
    $scope.newProtocolPoint = 1;
    $scope.patientActivateModal = false;
    $scope.captchaValid = false;
    $scope.DisableAddProtocol = false; 
    $scope.displayFlag = true;
          $scope.customPointsChecker = 0;
          $scope.lastdeviceType = "";
       $scope.associatedClinics =[];
    $scope.patientStatus = {
      'role': StorageService.get('logged').role,
      'editMode': false,
      'isCreate': false,
      'isMessage': false,
      'message': ''
    };

    $scope.isActive = function(tab) {
      if ($scope.patientTab.indexOf(tab) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    $scope.switchPatientTab = function(status){
      $scope.patientTab = status;
      if($scope.patientStatus.role === loginConstants.role.admin){
        $state.go(status, {'patientId': $stateParams.patientId});
      }else if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go(status+loginConstants.role.Rcadmin, {'patientId': $stateParams.patientId});
      }else if($scope.patientStatus.role === loginConstants.role.associates){
        $state.go('associate'+ status, {'patientId': $stateParams.patientId});
      }
      else if($scope.patientStatus.role === loginConstants.role.customerservices){
        $state.go('customerservice'+ status, {'patientId': $stateParams.patientId});
      }
    };

    $scope.setOverviewMode = function(patient){
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
      patientService.getHCPsLinkedToPatient($scope.patient.id).then(function(response){
        var hcpUsers = '';
        angular.forEach(response.data.hcpUsers, function(hcpUser){
          if(hcpUsers){
            hcpUsers = hcpUsers + ', ';
          } if(hcpUser.title){
            hcpUsers = hcpUsers + hcpUser.title + ' ' +hcpUser.firstName + ' ' + hcpUser.lastName;
          }else{
            hcpUsers = hcpUsers + hcpUser.firstName + ' ' + hcpUser.lastName;
          }
        });
        $scope.patient.hcpUSers = hcpUsers;
      }).catch(function(response){
        notyService.showError(response);
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

    $scope.initPatientOverview = function(){
      $scope.patientTab = "patientEdit";
      $scope.getPatiendDetails($stateParams.patientId, $scope.setOverviewMode);
    };

    $scope.initpatientDemographic = function(){
      $scope.getPatientById($stateParams.patientId);
      UserService.getState().then(function(response) {
       $scope.states = response.data.states;
      }).catch(function(response) {});
      $scope.getPatiendDetails($stateParams.patientId, $scope.setEditMode);
    };

    $scope.openEditDetail = function(){
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientDemographicEditRcadmin', {'patientId': $stateParams.patientId});
      }else{
        $state.go('patientDemographicEdit', {'patientId': $stateParams.patientId});
      }
    };

    $scope.getProtocols = function(patientId){
      patientService.getProtocol(patientId).then(function(response){
        console.log("protocol response:",response);
        $scope.protocols = response.data.protocol;
        $scope.isAddProtocol = true;
        $scope.isProtocolLoaded = true;
        $scope.DisableAddProtocol = false;
        var vestFlag = false;
        var monarchFlag = false;
        $scope.lastdeviceType = $scope.protocols[0].deviceType;
        angular.forEach($scope.protocols, function(protocol){
          protocol.createdDate = dateService.getDateByTimestamp(protocol.createdDate);
          protocol.lastModifiedDate = dateService.getDateByTimestamp(protocol.lastModifiedDate);
          if(!protocol.deleted){
            $scope.isAddProtocol = false;
          }
          if(protocol.deviceType === searchFilters.VisiVest){
            vestFlag = true;
           // alert("vestFlag = true");
          }
          if(protocol.deviceType === searchFilters.Monarch){
            monarchFlag = true;
           // alert("monarchFlag = true");
          }
        });
        if(vestFlag && monarchFlag){
          $scope.DisableAddProtocol = true;
        //  alert($scope.DisableAddProtocol);
        }
        else{
          $scope.DisableAddProtocol = false;
          // alert($scope.DisableAddProtocol);
        }
      }).catch(function(){});
    };

    $scope.getDevices = function(patientId){
      $scope.totalHmr = 0;
      patientService.getDevices(patientId).then(function(response){
        angular.forEach(response.data.deviceList, function(device){
          $scope.totalHmr = $scope.totalHmr + device.hmr;
          device.createdDate = dateService.getDateByTimestamp(device.createdDate);
          device.lastModifiedDate = dateService.getDateByTimestamp(device.lastModifiedDate);
           device.createdDate = dateService.getDateByTimestamp(device.createdDate);
          $scope.deviceTypeSelected = localStorage.getItem('devicetype'); //later to be changed when devicetype is passed in response
        });
        $scope.devices = response.data.deviceList;
        $scope.isDevicesLoaded = true;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.initProtocolDevice = function(patientId){
      $scope.getPatientById(patientId);
      $scope.getDevices(patientId);
      $scope.getProtocols(patientId);
      $scope.getTodayDateForReset();
      $scope.scoreToReset = 100;
      //$scope.resetStartDate = null;
      $scope.ShowOther = false;
        patientService.getJustification().then(function(response){
         $scope.justificationlist =  response.data.typeCode;
      }).catch(function(response){});
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
$scope.getdevice = function(){

};
    $scope.initPatientAddProtocol = function(){
      $scope.getPatientById($stateParams.patientId);
      $scope.protocol = $stateParams.protocol;
      var notProtocolDevType = $stateParams.protocolDevType;
      if($stateParams.protocolDevType){
        $scope.disableDropdown = true; // If protocol for one device is already present , disable the dropdown
      }
      else{
        $scope.disableDropdown = false;
      }
      if(notProtocolDevType){
           if(notProtocolDevType === searchFilters.VisiVest){
              $scope.deviceTypeSelectedProtocol = searchFilters.Monarch;
              $scope.deviceTypeVest = false;   
               $scope.deviceTypeMonarch = true;  
               $scope.ProtocolDevType = searchFilters.Monarch;
            }
            else if(notProtocolDevType === searchFilters.Monarch){
             $scope.ProtocolDevType = $scope.deviceTypeSelectedProtocol = searchFilters.VisiVest;
             $scope.deviceTypeVest = true;   
               $scope.deviceTypeMonarch = false;  
            }
            else{
             $scope.ProtocolDevType = $scope.deviceTypeSelectedProtocol = searchFilters.VisiVest;
            }
     }
     else{
       $scope.ProtocolDevType = $scope.deviceTypeSelectedProtocol = searchFilters.VisiVest;
            var device = localStorage.getItem('deviceTypeforBothIcon');
            if(device === searchFilters.VisiVest){
             
                 $scope.deviceTypeVest = true;   
               $scope.deviceTypeMonarch = false;  
              }
              else if(device === searchFilters.Monarch){
                
                 $scope.deviceTypeVest = false;   
               $scope.deviceTypeMonarch = true;  
              }
              else{
                $scope.deviceTypeVest = true;   
               $scope.deviceTypeMonarch = false;
              }
      }
        
      if(!$scope.protocol){
        $scope.protocol = {};
        $scope.protocol.type = 'Normal';
        $scope.protocol.protocolEntries = [{}];
        $scope.deviceTypeSelectedProtocol = localStorage.getItem('devicetype');
      } else {
        $scope.protocol.type = $scope.protocol.protocol[0].type;
        $scope.protocol.treatmentsPerDay = $scope.protocol.protocol[0].treatmentsPerDay;
        $scope.protocol.protocolEntries = $scope.protocol.protocol;
        $scope.deviceTypeSelectedProtocol = localStorage.getItem('devicetype');
      }
    };

    $scope.initPatientAddDevice = function(){
      $scope.getPatientById($stateParams.patientId);
      var device = localStorage.getItem('deviceTypeforBothIcon');
      if(device === searchFilters.VisiVest){
       
           $scope.deviceTypeVest = true;   
         $scope.deviceTypeMonarch = false;  
        }
        else if(device === searchFilters.Monarch){
          
           $scope.deviceTypeVest = false;   
         $scope.deviceTypeMonarch = true;  
        }
        else{
         /* $scope.deviceTypeVest = true;   
         $scope.deviceTypeMonarch = false;*/
        }
      if($stateParams.device){
      $scope.device = $stateParams.device; //  for passing to edit mode
      $scope.device.wifiId = $stateParams.device.wifiId;
   }
      $scope.deviceTypeSelected = localStorage.getItem('devicetype');
    };

    $scope.init = function() {
      $scope.deviceTypeVest = false;   
      $scope.deviceTypeMonarch = false; 
      $scope.disableDropdown = false;
      $scope.displayFlag = true;
          $scope.customPointsChecker = 0;
          $scope.lastdeviceType = "";
       $scope.selectedDevice();
      var currentRoute = $state.current.name;
      //in case the route is changed from other thatn switching tabs
     // $scope.devicetype = localStorage.getItem('deviceType');
      $scope.patientTab = currentRoute;
      if(currentRoute === 'patientOverview' || currentRoute === 'patientOverviewRcadmin'){
        $scope.initPatientOverview();
      }else if(currentRoute === 'patientDemographic' || currentRoute === 'patientDemographicRcadmin' || currentRoute === 'associatepatientDemographic' || currentRoute === 'customerservicepatientDemographic'){
        $scope.initpatientDemographic();
      }else if (currentRoute === 'patientEdit') {
        $scope.getPatiendDetails($stateParams.patientId, $scope.setEditMode);
      } else if (currentRoute === 'patientNew' || currentRoute === 'rcadminPatientNew') {
        $scope.createPatient();
      }else if($state.current.name === 'patientEditClinics'){
        $scope.initPatientClinics($stateParams.patientId);
      }else if(currentRoute === 'patientClinics' || currentRoute === 'patientClinicsRcadmin' || currentRoute === 'associatepatientClinics' || currentRoute === 'customerservicepatientClinics'){
        $scope.initPatientClinicsInfo($stateParams.patientId);
      }else if(currentRoute === 'patientCraegiver' || currentRoute === 'patientCraegiverRcadmin' || currentRoute === 'associatepatientCraegiver' || currentRoute === 'customerservicepatientCraegiver' ){
        $scope.initpatientCraegiver($stateParams.patientId);
      } else if($state.current.name === 'patientProtocol' || $state.current.name === 'patientProtocolRcadmin' || $state.current.name === 'associatepatientProtocol' || $state.current.name === 'customerservicepatientProtocol'){
        $scope.initProtocolDevice($stateParams.patientId);
        $scope.getAdherenceScoreResetHistory($stateParams.patientId);
      }else if(currentRoute === 'patientCraegiverAdd' || currentRoute === 'patientCraegiverAddRcadmin'){
        $scope.initpatientCraegiverAdd($stateParams.patientId);
      }else if(currentRoute === 'patientCraegiverEdit' || currentRoute === 'patientCraegiverEditRcadmin'){
        $scope.initpatientCraegiverEdit($stateParams.patientId);
      }else if(currentRoute === 'patientAddProtocol' || currentRoute === 'patientAddProtocolRcadmin'){
        $scope.initPatientAddProtocol();
      }else if(currentRoute === 'patientAddDevice' || currentRoute === 'patientAddDeviceRcadmin'){
        $scope.initPatientAddDevice();
      }else if(currentRoute === 'patientDemographicEdit' || currentRoute === 'patientDemographicEditRcadmin'){
        $scope.initpatientDemographic();
      }else if(currentRoute === 'patientEditProtocol' || currentRoute === 'patientEditProtocolRcadmin'){
        $scope.initpatientEditProtocol();
      }
    };

    $scope.setEditMode = function(patient) {
      $scope.patientStatus.editMode = true;
      $scope.patientStatus.isCreate = false;
      $scope.patient = patient;
      $scope.patient.zipcode = commonsUserService.formatZipcode($scope.patient.zipcode);
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

    $scope.getPatiendDetails = function(patientId, callback) {
      patientService.getPatientInfo(patientId).then(function(response) {
        $scope.patientInfo = response.data;
        $scope.patient = $scope.patientInfo;
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
      }).catch(function(response) {});
    };

    $scope.createPatient = function() {
      $scope.patientStatus.isCreate = true;
      $scope.patientStatus.isMessage = false;
      $scope.patient = {
        title: 'Mr.'
      };
    };

    $scope.goToPatientClinics = function(){
      $state.go('patientEditClinics',{'patientId': $stateParams.patientId});
    }
    
    $scope.availableClinicsForPatient = function(associatedClinics){
      clinicService.getClinics($scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount).then(function (response) {
          $scope.clinics = response.data;
          $scope.total = response.headers()['x-total-count'];
          $scope.pageCount = Math.ceil($scope.total / 10);
        }).catch(function (response) {

        });
    };

    $scope.initializeClinics = function(clinics){
      $scope.clinics = []; $scope.clinics.length = 0;
      angular.forEach(clinics, function(clinic, clinicKey){
        if(!clinic.city){
          clinic.city = "";
        }
        if(!clinic.state){
         clinic.state = "";
        }
        if(!clinic.hillromId){
          clinic.hillromId = "";
        }else{
          clinic.hillromId = clinic.hillromId + ' &nbsp; ';
        }

        angular.forEach($scope.associatedClinics, function(associatedClinic, associatedClinicKey){
          if(associatedClinic.id === clinic.id){
            clinics.splice(clinicKey, 1);
          }
        });
      });
      $scope.clinics = clinics;
    };

    /** starts for patient clinics **/
    $scope.getPatientClinicInfo = function(patientId){
      $scope.associatedClinics =[]; $scope.associatedClinics.length = 0;
      patientService.getClinicsLinkedToPatient(patientId).then(function(response) {
        $scope.associatedClinics = response.data.clinics;
      }).catch(function(response) {});
    };

    $scope.disassociateLinkedClinics = function(id){
      $scope.showModalClinic = false;
      var data = [{"id": id}];
      patientService.disassociateClinicsFromPatient($stateParams.patientId, data).then(function(response) {
        $scope.associatedClinics = response.data.clinics;
        $scope.getAvailableAndAssociatedClinics($stateParams.patientId);
        $scope.getAvailableAndAssociatedHCPs($stateParams.patientId);
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response) {
        notyService.showError(response);
      });
    };

    $scope.disassociateLinkedHCPs = function(id){
      $scope.showModalHCP = false;
      var data = [{"id": id}];
      patientService.disassociateHCPFromPatient($stateParams.patientId, data).then(function(response) {
        $scope.getAvailableAndAssociatedHCPs($stateParams.patientId);
        notyService.showMessage(response.data.message, 'success');
      });
    };

    $scope.searchClinics = function (track) {
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
      clinicService.getClinics($scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount).then(function (response) {
        $scope.clinics = response.data;
        $scope.total = response.headers()['x-total-count'];
        $scope.pageCount = Math.ceil($scope.total / 10);
      }).catch(function (response) {

      });
    };

    $scope.initPatientClinics = function(patientId){
      if($scope.searchItem && $scope.searchItem.length > 0){
        clinicService.getClinics($scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount).then(function (response) {
          $scope.initializeClinics(response.data);
          $scope.total = response.headers()['x-total-count'];
          $scope.pageCount = Math.ceil($scope.total / 10);
        }).catch(function (response) {

        });
      }else {
        $scope.clinics = []; $scope.clinics.length = 0;
        $scope.searchItem = "";
      }
    };

    $scope.showAssociateClinicModal = function(clinic){
      $scope.selectedClinic = clinic;
      $scope.associatedClinicModal = true;
    };

    $scope.selectClinicForPatient = function(){
      var data = [{"id": $scope.selectedClinic.id, "mrnId": null, "notes": null}];
      $scope.clinic.name = "";
      $scope.associatedClinicModal = false;
      patientService.associateClinicToPatient($stateParams.patientId, data).then(function(response) {
        $scope.searchClinicText = false;
        $scope.associatedClinics = response.data.clinics;
        $scope.getAvailableAndAssociatedClinics($stateParams.patientId);
        $scope.getAvailableAndAssociatedHCPs($stateParams.patientId);
      }).catch(function(response) {
        notyService.showError(response);
      });
    };

    $scope.initPatientClinicsInfo = function(patientId){
      $scope.patientTab = "patientClinics";
      $scope.currentPageIndex = 1;
      $scope.perPageCount = 500;
      $scope.pageCount = 0;
      $scope.total = 0;
      $scope.sortOption = "";
      $scope.searchItem = "";
      $scope.searchClinicText = false;
      $scope.getPatientById(patientId);
      $scope.getAvailableAndAssociatedClinics(patientId);
      $scope.getAvailableAndAssociatedHCPs(patientId);     
    };

    $scope.getAssociatedHCPs = function(patientId){
      patientService.getAssociateHCPToPatient(patientId).then(function(response){
        $scope.associatedHCPs = response.data.hcpUsers
      }).catch(function(response){
        notyService.showError(response);
      });
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
        $scope.getAdherenceScoreResetHistory($stateParams.patientId);
        /*$scope.resetStartDate = null;
        $scope.justification = "";
        $scope.scoreToReset = 100;
        $scope.othersContent = "";
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
        $scope.othersContent = "";
        $scope.ShowOther = false;*/
        $scope.resetsubmitted = false ; 
      });

    };

        // getAdherenceScoreResetHistory history strats here 

    $scope.getAdherenceScoreResetHistory = function(patientId){
      patientService.getAdherenceScoreResetHistory(patientId,$scope.PageNumber,$scope.perPageCount).then(function(response){
     
        $scope.resetHistoryData = response.data.Adherence_Reset_History.content;  
      $scope.totalPages = response.data.Adherence_Reset_History.totalPages;
      $scope.totalElements = response.data.Adherence_Reset_History.totalElements;
        
        if($scope.totalElements == 0){
         $scope.nodataflag = true;
          }

      }).catch(function(){});
    };
       $scope.getAdherenceScoreResetHistoryPagination = function(track){
     if (track !== undefined) {
        if (track === 'PREV' && $scope.currentPageIndex > 1) {
          $scope.PageNumber--;
          $scope.currentPageIndex--;
        }
        else if (track === 'NEXT' && $scope.currentPageIndex < $scope.totalPages){
            $scope.PageNumber++;
            $scope.currentPageIndex++;
        }
        else{
            return false;
        }
      }else {
          $scope.PageNumber = 1;
      }
 $scope.getAdherenceScoreResetHistory($stateParams.patientId);
    };

    // getAdherenceScoreResetHistory ends here 

    $scope.showAssociateHcpModal = function(hcp){
      $scope.selectedHCP = hcp;
      $scope.associatedHCPModal = true;
    };

    $scope.selectHcpForPatient = function(){
      $scope.associatedHCPModal = false;
      var data = [{'id': $scope.selectedHCP.id}];
      $scope.searchHcp = "";
      patientService.associateHCPToPatient(data, $stateParams.patientId).then(function(response){
        $scope.searchHCPText = false;
        $scope.getAvailableAndAssociatedHCPs($stateParams.patientId);
        notyService.showMessage(response.data.message, 'success');
      });
    };

    $scope.getHCPs = function(){
      DoctorService.getDoctorsList($scope.searchItem, $scope.currentPageIndex, $scope.perPageCount).then(function(response){
        $scope.hcps = response.data;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.getClinics = function(){
      clinicService.getClinics($scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount).then(function (response) {
          $scope.initializeClinics(response.data);
          $scope.total = response.headers()['x-total-count'];
          $scope.pageCount = Math.ceil($scope.total / 10);
        }).catch(function (response) {

        });
    }

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

    $scope.cancelProtocolDevice = function() {
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientProtocolRcadmin', {'patientId': $stateParams.patientId});
      }else{
        $state.go('patientProtocol');
      }
    };

    $scope.cancelEditDemographics = function(){
      if($scope.patientStatus.role === loginConstants.role.acctservices){
          $state.go('patientDemographicRcadmin', {'patientId': $stateParams.patientId});
        }else{
          $state.go('patientDemographic', {'patientId': $stateParams.patientId});
        }
    };


    $scope.cancelDeviceModel = function(){
      $scope.showModalDevice = false;
    };

    $scope.cancelProtocolModel = function(){
      $scope.showModalProtocol = false;
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

    $scope.cancelHCPModel = function(){
      $scope.showModalHCP = false;
    };

    $scope.cancelClinicModel = function(){
      $scope.showModalClinic = false;
    };

    $scope.disassociatePatient =function(disassociatePatient){
      patientService.disassociatePatient(disassociatePatient.id).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        if($scope.patientStatus.role === loginConstants.role.acctservices){
          $state.go('rcadminPatients');
        }else{
          $state.go('patientUser');
        }
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    /** start of caregiver tab for admin->patient **/
    $scope.getCaregiversForPatient = function(patientId){
      patientService.getCaregiversLinkedToPatient(patientId).then(function(response){
        $scope.caregivers =  response.data.caregivers;
        $scope.isCargiverLoaded = true;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.associateCaregiverstoPatient = function(patientId, careGiver){
        patientService.associateCaregiversFromPatient(patientId, careGiver).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $scope.caregivers =  response.data.user;
        $scope.isCargiverLoaded = true;
        $scope.associateCareGiver = [];$scope.associateCareGiver.length = 0;
        $scope.switchPatientTab('patientCraegiver');
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.disassociateCaregiversFromPatient = function(caregiver){
      $scope.closeModalCaregiver();
      patientService.disassociateCaregiversFromPatient($stateParams.patientId, caregiver.id).then(function(response){
        $scope.caregivers.splice(caregiver.index, 1);
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.initpatientCraegiver = function (patientId){
      $scope.getPatientById(patientId);
      $scope.getCaregiversForPatient($stateParams.patientId);
    };

    $scope.initpatientCraegiverAdd = function(){
      $scope.getPatientById($stateParams.patientId);
      $scope.careGiverStatus = "new";
      $scope.associateCareGiver = {};
      UserService.getState().then(function(response) {
        $scope.states = response.data.states;
      }).catch(function(response) {});
      UserService.getRelationships().then(function(response) {
        $scope.relationships = response.data.relationshipLabels;
        $scope.associateCareGiver.relationship = $scope.relationships[0];
      }).catch(function(response) {});
    };

    $scope.linkCaregiver = function(){
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientCraegiverAddRcadmin', {'patientId': $stateParams.patientId});
      }else{
        $state.go('patientCraegiverAdd', {'patientId': $stateParams.patientId});
      }
    };

    $scope.formSubmitCaregiver = function(){
      $scope.submitted = true;
      if($scope.form.$invalid){
        return false;
      }
      var data = $scope.associateCareGiver;
      data.role = 'CARE_GIVER';
      if($scope.careGiverStatus === "new"){
        $scope.associateCaregiverstoPatient($stateParams.patientId, data);
      }else if($scope.careGiverStatus === "edit"){
        $scope.caregiverUpdateModal = false;
        $scope.updateCaregiver($stateParams.patientId, $stateParams.caregiverId , data);
      }
    };

    $scope.showCaregiverUpdateModal = function(){
      $scope.submitted = true;
      if($scope.form.$invalid){
        return false;
      }
      $scope.caregiverUpdateModal = true;
    };

    $scope.linkDevice = function(){
      
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientAddDeviceRcadmin',{patientId: $stateParams.patientId});
      }else{
        $state.go('patientAddDevice');
      }
    };

    $scope.addDevice = function(){
      $scope.submitted = true;
      if($scope.addDeviceForm.$invalid){
        return false;
      }
      patientService.addDevice( $stateParams.patientId, $scope.device, $scope.deviceTypeSelected).then(function(response){
      if(response.data.changedDevType == 'ALL'){
          localStorage.setItem('deviceType', 'VEST');
          localStorage.setItem('deviceTypeforGraph', 'ALL');
          localStorage.setItem('deviceTypeforBothIcon', 'ALL');
            }
            else{
            localStorage.setItem('deviceType', response.data.changedDevType);
            localStorage.setItem('deviceTypeforGraph', response.data.changedDevType);
            localStorage.setItem('deviceTypeforBothIcon', response.data.changedDevType);
          }
        if($scope.patientStatus.role === loginConstants.role.acctservices){
          $state.go('patientProtocolRcadmin', {'patientId': $stateParams.patientId});
        }else{
          $state.go('patientProtocol');
        }
      }).catch(function(response){
        if(response.data.user){
          $scope.deviceAssociatedPatient = response.data.user;
        }
        notyService.showError(response);
      });
    };

    $scope.linkProtocol = function(){
      console.log("$scope.protocols in linkprototocl:",$scope.protocols);
      var protocolDevType = ($scope.protocols)?$scope.protocols[0].deviceType:null;
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientAddProtocolRcadmin', {'patientId': $stateParams.patientId , 'protocolDevType': protocolDevType});
      }else{
        $state.go('patientAddProtocol' , {'protocolDevType': protocolDevType});
      }
    };

    $scope.addProtocol = function(){
      $scope.submitted = true;
      if($scope.addProtocolForm.$invalid){
        return false;
      }
      if($scope.protocol.type === 'Custom'){
        angular.forEach($scope.protocol.protocolEntries, function(protocol, index){
          protocol.treatmentLabel = 'point'+ (index + 1);
        })
      }
      patientService.addProtocol($stateParams.patientId, $scope.protocol, $scope.deviceTypeSelectedProtocol).then(function(response){
        if($scope.patientStatus.role === loginConstants.role.acctservices){
          $state.go('patientProtocolRcadmin', {'patientId': $stateParams.patientId});
        }else{
          $state.go('patientProtocol');
        }
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.deleteDevice = function(){
      $scope.showModalDevice = false;
      patientService.deleteDevice($stateParams.patientId, $scope.deviceToDelete, localStorage.getItem('deviceType')).then(function(response){
        $scope.deviceToDelete.active = false;
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        notyService.showError(response);
      });
    };
    
     
    $scope.deleteProtocolModel = function(protocolId){
      $scope.toDeleteProtocolId = protocolId;
      $scope.showModalProtocol = true;
    };

    $scope.deleteProtocolModelforBoth = function(protocolId, protocoldeviceType){
      $scope.toDeleteProtocolId = protocolId;
       $scope.toDeleteProtocoldeviceType = protocoldeviceType;
      $scope.showModalProtocol = true;
    };

    $scope.deleteDeviceModel = function(device){
      $scope.deviceToDelete = device;
      $scope.showModalDevice = true;
    };
    
    $scope.deleteDeviceboth = function(){ 

      $scope.showModalDevice = false;
      patientService.deleteDeviceboth($stateParams.patientId, $scope.deviceToDelete, $scope.deviceToDelete.deviceType).then(function(response){
        $scope.deviceToDelete.active = false;
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        notyService.showError(response);
      });
    };
    $scope.deleteClinicModel = function(clinic){
      $scope.clinicToDelete = clinic;
      $scope.showModalClinic = true;
    };

    $scope.deleteHCPModel = function(hcp){
      $scope.deviceToDelete = hcp;
      $scope.showModalHCP = true;
    };

    $scope.deleteProtocol = function(id){
      $scope.showModalProtocol = false;
      patientService.deleteProtocol($stateParams.patientId, $scope.toDeleteProtocolId).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $scope.getProtocols($stateParams.patientId);
      }).catch(function(response){
        notyService.showError(response);
      });
    };

     $scope.deleteProtocolforBoth = function(id){
      $scope.showModalProtocol = false;
      patientService.deleteProtocolforBoth($stateParams.patientId, $scope.toDeleteProtocolId, $scope.toDeleteProtocoldeviceType).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $scope.getProtocols($stateParams.patientId);
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.initpatientCraegiverEdit = function(careGiverId){
      $scope.careGiverStatus = "edit";
      $scope.getPatientById($stateParams.patientId);
      $scope.editCaregiver(careGiverId);
    };

    $scope.editCaregiver = function(careGiverId){
      UserService.getState().then(function(response) {
        $scope.states = response.data.states;
      }).catch(function(response) {});
      UserService.getRelationships().then(function(response) {
        $scope.relationships = response.data.relationshipLabels;
      }).catch(function(response) {});
      var caregiverId = $stateParams.caregiverId;
      patientService.getCaregiverById($stateParams.patientId, caregiverId).then(function(response){
        $scope.associateCareGiver = response.data.caregiver.userPatientAssocPK.user;
        $scope.associateCareGiver.relationship = response.data.caregiver.relationshipLabel;
        if($scope.associateCareGiver.zipcode){
          $scope.associateCareGiver.zipcode = commonsUserService.formatZipcode($scope.associateCareGiver.zipcode);
        }
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.updateCaregiver = function(patientId, caregiverId , careGiver){
      var tempCaregiver = {};
      tempCaregiver.title = careGiver.title;
      tempCaregiver.firstName = careGiver.firstName;
      tempCaregiver.middleName = careGiver.middleName;
      tempCaregiver.lastName = careGiver.lastName;
      tempCaregiver.email = careGiver.email;
      tempCaregiver.address = careGiver.address;
      tempCaregiver.zipcode = careGiver.zipcode;
      tempCaregiver.city = careGiver.city;
      tempCaregiver.state = careGiver.state;
      tempCaregiver.relationship = careGiver.relationship;
      tempCaregiver.primaryPhone = careGiver.primaryPhone;
      tempCaregiver.mobilePhone = careGiver.mobilePhone;
      tempCaregiver.role = careGiver.role;

      patientService.updateCaregiver(patientId,caregiverId, tempCaregiver).then(function(response){
        $scope.associateCareGiver = [];$scope.associateCareGiver.length = 0;
        $scope.switchPatientTab('patientCraegiver');
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.goToCaregiverEdit = function(careGiverId){
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientCraegiverEditRcadmin', {'caregiverId': careGiverId, 'patientId': $stateParams.patientId});
      }else{
        $state.go('patientCraegiverEdit', {'caregiverId': careGiverId});
      }
    };

    $scope.openEditProtocol = function(protocol){
      if(!protocol){
        return false;
      }
      console.log("protocol",protocol);
      protocol.edit = true;
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientEditProtocolRcadmin', {
          'patientId': $stateParams.patientId,
          'protocolId': protocol.id,
          'protocolDevice': protocol.deviceType,
        });
      }else{
        $state.go('patientEditProtocol', {
          'protocolId': protocol.id,
           'protocolDevice': protocol.deviceType,
        });
      }
    };

    $scope.openEditDevice = function(device){
      if(!device.active){
        return false;
      }
      device.edit = true;
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientAddDeviceRcadmin',{device: device, patientId: $stateParams.patientId});
      }else{
        $state.go('patientAddDevice',{device: device});
      }
    };

    $scope.updateProtocol = function(){
      $scope.isProtocolSubmited = true;
      if($scope.protocol.id){
        delete $scope.protocol.id;
      }
      if($scope.protocol.patient){
        delete $scope.protocol.patient;
      }
      var data = $scope.protocol.protocol;
      if($scope.protocol.type === 'Custom'){        
        angular.forEach(data, function(value, key){
          if(value){
            value.type = 'Custom';
            value.treatmentsPerDay = $scope.protocol.treatmentsPerDay;           
          }          
          if(!value.treatmentLabel){
            value.treatmentLabel = 'point'+(key+1);
          }           
          if(!value.protocolKey){
            value.protocolKey = $scope.protocol.protocol[0].protocolKey;
          }         
        });

      }else{
        angular.forEach(data, function(value, key){
          if(value){
            value.type = 'Normal';
            value.treatmentLabel = "";
          }          
        });        
        data[0].treatmentsPerDay = $scope.protocol.treatmentsPerDay;
      }
      
      patientService.editProtocol($stateParams.patientId, data, $scope.deviceTypeSelectedProtocol).then(function(response){
        $scope.isVerificationModal = false;
        notyService.showMessage(response.data.message, 'success');
        if($scope.patientStatus.role === loginConstants.role.acctservices){
          $state.go('patientProtocolRcadmin', {'patientId': $stateParams.patientId});
        }else{
          $state.go('patientProtocol');
        }
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.getPatientById = function(patientid){
      patientService.getPatientInfo(patientid).then(function(response){
        $scope.slectedPatient = response.data;
        $scope.patientInformation = $scope.slectedPatient.hillromId;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.updateDevice = function(){
      $scope.deviceUpdateModal =true;
      patientService.addDevice($stateParams.patientId, $scope.device, $scope.deviceTypeSelected).then(function(response){
        if($scope.patientStatus.role === loginConstants.role.acctservices){
          $state.go('patientProtocolRcadmin', {'patientId': $stateParams.patientId});
        }else{
          $state.go('patientProtocol');
        }
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.addNewProtocolPoint = function (){
      $scope.submitted = false;
      $scope.newProtocolPoint += 1;
      $scope.protocol.protocolEntries.push({});
    };

    $scope.switchtoNormal = function(){
      $scope.submitted = false;
      $scope.protocol.protocolEntries.splice(1);
      if($scope.protocol.edit && $scope.prevProtocolType && $scope.prevProtocolType.indexOf("Normal") !== -1){                  
        $scope.protocol = angular.copy($scope.prevProtocol);                        
      } else{
        $scope.clearFn();
      } 
    };

    $scope.linkClinic = function(){
      $scope.getAvailableAndAssociatedClinics($stateParams.patientId);
      $scope.searchClinicText = true;
    };

    $scope.linkHCP = function(){
      $scope.getAvailableAndAssociatedHCPs($stateParams.patientId);
      $scope.searchHCPText = true;
    };

    $scope.getAvailableAndAssociatedClinics = function(patientId){
      $scope.associatedClinicsErrMsg = null;
      $scope.associatedHCPsErrMsg = null;            
      patientService.getClinicsLinkedToPatient(patientId).then(function(response) {
        $scope.associatedClinics =[];
        if(response.data.clinics){ 
          $scope.associatedClinics = response.data.clinics;
        }else if(response.data.message){
          $scope.associatedClinicsErrMsg = response.data.message;
        }
        clinicService.getClinics($scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount).then(function (response) {
          $scope.initializeClinics(response.data);
        });
      });
    };

    $scope.getAvailableAndAssociatedHCPs = function(patientId){
      $scope.associatedClinicsErrMsg = null;
      $scope.associatedHCPsErrMsg = null;  
      var searchString = "";
      var offset = 100;
      var pageNo = 1;
      $q.all([
        patientService.getHCPsToLinkToPatient(patientId, searchString, pageNo, offset),
        patientService.getAssociateHCPToPatient(patientId)
      ]).then(function(data) {        
        if(data){
          if(data[0]){
            $scope.hcps = []; 
            $scope.hcps = data[0].data.HCPUser; 
          }
          $scope.associatedHCPs = [];
          if(data[1] && data[1].data.hcpUsers !== undefined){
            $scope.associatedHCPs = data[1].data.hcpUsers;
            for(var i=0; i < $scope.associatedHCPs.length; i++){
              for(var j=0; j <  $scope.hcps.length; j++ ){
                if($scope.associatedHCPs[i].id === $scope.hcps[j].id){
                  $scope.hcps.splice(j, 1);
                }
              }
            }
          }
        }
      });
    };

    $scope.getHCPsToLinkToPatient = function($viewValue){
      return searchFilterService.getMatchingUser($viewValue, $scope.hcps, true);
    };

    $scope.openPatientDeactivateModal = function(patient){
      $scope.deletePatient = patient;
      $scope.patientDeactivateModal = true;
    };

    $scope.closePatientDeactivateModal = function(){
      $scope.patientDeactivateModal = false;
    };
    $scope.openModalCaregiver = function(caregiverId, index){
      $scope.showModalCaregiver = true;
      $scope.deleteCaregiver = {'id':caregiverId, 'index':index};
    };
    $scope.closeModalCaregiver = function(){
      $scope.showModalCaregiver = false;
    };

    angular.element('#dp2').datepicker({
          endDate: '+0d',
          startDate: '-100y',
          autoclose: true});

    $scope.switchtoCustom = function(){
      $scope.submitted = false;
      $scope.newProtocolPoint = 1;      
      if($scope.protocol.edit && $scope.prevProtocolType && $scope.prevProtocolType.indexOf("Custom") !== -1){                 
        $scope.protocol = angular.copy($scope.prevProtocol);             
      }else{
        $scope.clearFn();
     }     
    };

    $scope.clearFn = function(){
      $scope.protocol.treatmentsPerDay = null;
      angular.forEach($scope.protocol.protocolEntries, function(protocolEntry, key){
        protocolEntry.minMinutesPerTreatment = null;
        protocolEntry.maxMinutesPerTreatment = null;
        protocolEntry.minFrequency = null;
        protocolEntry.maxFrequency = null;
        protocolEntry.minPressure = null;
        protocolEntry.maxPressure = null;
        protocolEntry.minIntensity= null;
      });
      $scope.addProtocolForm.$setPristine();
    };

    $scope.initpatientEditProtocol = function(){
      $scope.getPatientById($stateParams.patientId);

     
      patientService.getProtocolById($stateParams.patientId, $stateParams.protocolId,$stateParams.protocolDevice).then(function(response){
        $scope.protocol = response.data;
      


        
        if($stateParams.protocolDevice === searchFilters.VisiVest){
          
           $scope.deviceTypeVest = true;   
         $scope.deviceTypeMonarch = false;  
        }
        else if($stateParams.protocolDevice === searchFilters.Monarch){
        
           $scope.deviceTypeVest = false;   
         $scope.deviceTypeMonarch = true;  
        }
        $scope.protocol.edit = true;  
        $scope.newProtocolPoint = ($scope.protocol.protocol) ? $scope.protocol.protocol.length : 1;
        if(!$scope.protocol){
          $scope.protocol = {};
          $scope.protocol.type = 'Normal';
          $scope.protocol.protocolEntries = [{}];
          $scope.deviceTypeSelectedProtocol = $stateParams.protocolDevice;
        } else {
          $scope.protocol.type = $scope.protocol.protocol[0].type;
          $scope.protocol.treatmentsPerDay = $scope.protocol.protocol[0].treatmentsPerDay;
          $scope.protocol.protocolEntries = $scope.protocol.protocol;
          $scope.deviceTypeSelectedProtocol = $stateParams.protocolDevice;
        }
        $scope.prevProtocolType = $scope.protocol.type;
        $scope.prevProtocol = angular.copy($scope.protocol);        
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.selectDoctor = function(doctor) {
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('hcpProfileRcadmin',{
          'doctorId': doctor.id
        });
      }else if($scope.patientStatus.role === loginConstants.role.associates){
        $state.go('hcpProfileAssociates', {'doctorId': doctor.id});
      }else if($scope.patientStatus.role === loginConstants.role.customerservices){
        $state.go('hcpProfileCustomerService', {'doctorId': doctor.id});
      }else {
        $state.go('hcpProfile',{
          'doctorId': doctor.id
        });
      }
    };

    $scope.selectClinic = function(clinic) {
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('clinicProfileRcadmin', {
          'clinicId': clinic.id
        });
      }else if($scope.patientStatus.role === loginConstants.role.associates){
        $state.go('clinicProfileAssociate', {'clinicId': clinic.id});
      }else if($scope.patientStatus.role === loginConstants.role.customerservices){
        $state.go('clinicProfileCustomerService', {'clinicId': clinic.id});
      }
      else {
        $state.go('clinicProfile', {
          'clinicId': clinic.id
        });
      }
    };

    $scope.gotoPatient = function(){
      $state.go('patientOverview',{'patientId': $scope.deviceAssociatedPatient.id});
    };

    $scope.activatePatient = function(){
      patientService.reactivatePatient($scope.patient.id).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $state.go('patientUser');
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.toggleReactivationModal = function(){
      $scope.patientActivateModal = $scope.patientActivateModal ? false:true;
    };

    $scope.$watch("patient.dob", function(value) {
      if(value && (commonsUserService.isValidDOBDate(value))){
        $scope.patient.dob = value;
        var age = dateService.getAge(new Date(value));
        $scope.patient.age = age;
        if (age === 0) {
          $scope.form.$invalid = true;
        }
      }else{
        if($scope.form && isFormLoaded){
          $scope.form.dob.$invalid = true;
          $scope.form.$invalid = true;
          $scope.patient.age = '';
        }
      }
      isFormLoaded = true;
    });

    $scope.resendActivationLink = function(){
      UserService.resendActivationLink($scope.patient.id).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $scope.isDisableResendButton = true;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.showPatientUpdateModal = function(){
      if($scope.form.$invalid){
        $scope.submitted = true;
        return false;
      }else{
        $scope.showModal = true;
      }
    };

    $scope.showPrtocolUpdateModal = function(){
      $scope.submitted = true;
      if($scope.addProtocolForm.$invalid){
        return false;
      }
      $scope.isAuthorizeProtocolModal = true;
    };

    $scope.showDeviceUpdateModal = function(){
      $scope.submitted = true;
      if($scope.addDeviceForm.$invalid){
        return false;
      }else{
        $scope.deviceUpdateModal =true;
      }
    };

    $scope.getClinicToLinkToPatient = function($viewValue){
      return searchFilterService.getMatchingClinic($viewValue, $scope.clinics);
    };
     
  $scope.selectedDevice = function() {   
    $scope.selectedDeviceType = $scope.getDeviceTypeforBothIcon();   
    if($scope.selectedDeviceType== "VEST")    
    {   
        $scope.deviceTypeVest = true;   
         $scope.deviceTypeMonarch = false;    
    }   
    if($scope.selectedDeviceType== "MONARCH")   
    {   
        $scope.deviceTypeMonarch = true;    
        $scope.deviceTypeVest = false;    
    }   
  };    
  $scope.onChangeSelectedDevice = function() {    
    $scope.selectedDeviceType = $scope.deviceTypeSelected;   
    if($scope.selectedDeviceType== "VEST")    
    {   
        $scope.deviceTypeVest = true;   
         $scope.deviceTypeMonarch = false;    
    }   
    if($scope.selectedDeviceType== "MONARCH")   
    {   
        $scope.deviceTypeMonarch = true;    
        $scope.deviceTypeVest = false;    
    }   
  };    

  $scope.onChangeSelectedDeviceProtocol = function() {    
    $scope.selectedDeviceTypeProtocol = $scope.deviceTypeSelectedProtocol;   
    if($scope.selectedDeviceTypeProtocol== "VEST")    
    {   
        $scope.deviceTypeVest = true;   
         $scope.deviceTypeMonarch = false;    
    }   
    if($scope.selectedDeviceTypeProtocol== "MONARCH")   
    {   
        $scope.deviceTypeMonarch = true;    
        $scope.deviceTypeVest = false;    
    }   
  };
    $scope.getCityStateByZip = function(){
      delete $scope.serviceError;
      $scope.isServiceError = false;
      if($scope.form && $scope.patient.zipcode){
        addressService.getCityStateByZip($scope.patient.zipcode).then(function(response){
          if(response && response.data && response.data.length > 0){
            $scope.patient.state = response.data[0].state;
            $scope.patient.city = response.data[0].city;
          }
        }).catch(function(response){
          $scope.patient.state = null;
          $scope.patient.city = null;
          $scope.isServiceError = false;
          $scope.serviceError = response.data.ERROR;
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
    $scope.protocolDeviceIconFilter = function(protocol){
      if(localStorage.getItem('deviceTypeforBothIcon') === searchFilters.allCaps){
      if(protocol.type === 'Normal'){
        $scope.customPointsChecker = 0;
        console.log("protocol is normal, we want device symbol so i am returning true");
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
        console.log("protocol is custom, we want device symbol so i am returning true");
         $scope.lastdeviceType = protocol.deviceType;
         $scope.displayFlag = true;
        return true;
      }
      else{
        console.log("protocol is custom,but we dont want device symbol so i am returning false");
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
    $scope.init();
  }]);
