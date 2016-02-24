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
.controller('patientsController',['$scope','$rootScope', '$state', '$stateParams', 'patientService', 'dateService', 'notyService', 'UserService', 'DoctorService', 'clinicService', '$q', 'StorageService', 'loginConstants', 'commonsUserService', 'searchFilterService', 'addressService',
  function($scope, $rootScope, $state, $stateParams, patientService, dateService, notyService, UserService, DoctorService, clinicService, $q, StorageService, loginConstants, commonsUserService, searchFilterService, addressService) {
    var isFormLoaded = false;
    $scope.patient = {};
    $scope.patientTab = "";
    $scope.newProtocolPoint = 1;
    $scope.patientActivateModal = false;
    $scope.captchaValid = false;
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
        $scope.protocols = response.data.protocol;
        $scope.isAddProtocol = true;
        $scope.isProtocolLoaded = true;
        angular.forEach($scope.protocols, function(protocol){
          protocol.createdDate = dateService.getDateByTimestamp(protocol.createdDate);
          protocol.lastModifiedDate = dateService.getDateByTimestamp(protocol.lastModifiedDate);
          if(!protocol.deleted){
            $scope.isAddProtocol = false;
          }
        });
      }).catch(function(){});
    };

    $scope.getDevices = function(patientId){
      patientService.getDevices(patientId).then(function(response){
        angular.forEach(response.data.deviceList, function(device){
          device.createdDate = dateService.getDateByTimestamp(device.createdDate);
          device.lastModifiedDate = dateService.getDateByTimestamp(device.lastModifiedDate);
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
    };

    $scope.initPatientAddProtocol = function(){
      $scope.getPatientById($stateParams.patientId);
      $scope.protocol = $stateParams.protocol;
      if(!$scope.protocol){
        $scope.protocol = {};
        $scope.protocol.type = 'Normal';
        $scope.protocol.protocolEntries = [{}];
      } else {
        $scope.protocol.type = $scope.protocol.protocol[0].type;
        $scope.protocol.treatmentsPerDay = $scope.protocol.protocol[0].treatmentsPerDay;
        $scope.protocol.protocolEntries = $scope.protocol.protocol;
      }
    };

    $scope.initPatientAddDevice = function(){
      $scope.getPatientById($stateParams.patientId);
      $scope.device = $stateParams.device;
    };

    $scope.init = function() {
      var currentRoute = $state.current.name;
      //in case the route is changed from other thatn switching tabs
      $scope.patientTab = currentRoute;
      if(currentRoute === 'patientOverview' || currentRoute === 'patientOverviewRcadmin'){
        $scope.initPatientOverview();
      }else if(currentRoute === 'patientDemographic' || currentRoute === 'patientDemographicRcadmin' || currentRoute === 'associatepatientDemographic'){
        $scope.initpatientDemographic();
      }else if (currentRoute === 'patientEdit') {
        $scope.getPatiendDetails($stateParams.patientId, $scope.setEditMode);
      } else if (currentRoute === 'patientNew' || currentRoute === 'rcadminPatientNew') {
        $scope.createPatient();
      }else if($state.current.name === 'patientEditClinics'){
        $scope.initPatientClinics($stateParams.patientId);
      }else if(currentRoute === 'patientClinics' || currentRoute === 'patientClinicsRcadmin' || currentRoute === 'associatepatientClinics'){
        $scope.initPatientClinicsInfo($stateParams.patientId);
      }else if(currentRoute === 'patientCraegiver' || currentRoute === 'patientCraegiverRcadmin' || currentRoute === 'associatepatientCraegiver' ){
        $scope.initpatientCraegiver($stateParams.patientId);
      } else if($state.current.name === 'patientProtocol' || $state.current.name === 'patientProtocolRcadmin' || $state.current.name === 'associatepatientProtocol'){
        $scope.initProtocolDevice($stateParams.patientId);
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
      }else if(currentRoute === 'updatedProtocolDetail'){
        $scope.initUpdatedProtocolDetail();
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
      $scope.perPageCount = 90;
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
      patientService.addDevice( $stateParams.patientId, $scope.device).then(function(response){
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
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientAddProtocolRcadmin', {'patientId': $stateParams.patientId});
      }else{
        $state.go('patientAddProtocol');
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
      patientService.addProtocol($stateParams.patientId, $scope.protocol).then(function(response){
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
      patientService.deleteDevice($stateParams.patientId, $scope.deviceToDelete).then(function(response){
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

    $scope.deleteDeviceModel = function(device){
      $scope.deviceToDelete = device;
      $scope.showModalDevice = true;
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
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientEditProtocolRcadmin', {
          'patientId': $stateParams.patientId,
          'protocolId': protocol.id
        });
      }else{
        $state.go('patientEditProtocol', {
          'protocolId': protocol.id
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
      $rootScope.$broadcast('validateCaptcha');
      $scope.isProtocolSubmited = true;
      setTimeout(function(){
        if($scope.protocolVerificationForm.$invalid || !$scope.captchaValid){
          return false;
        }
        var data = {
          'password': $scope.password
        };
        UserService.validateCredentials(data).then(function(response){
          angular.forEach($rootScope.protocols, function(protocol){
            if(!protocol.type){
              protocol.type = $rootScope.protocols[0].type;
            }
          });
          patientService.editProtocol($stateParams.patientId, $rootScope.protocols).then(function(response){
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
        }).catch(function(response){
          notyService.showError(response);
        });
      }, 250);
    };

    $scope.getPatientById = function(patientid){
      patientService.getPatientInfo(patientid).then(function(response){
        $scope.slectedPatient = response.data;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.updateDevice = function(){
      $scope.deviceUpdateModal =true;
      patientService.addDevice($stateParams.patientId, $scope.device).then(function(response){
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
      $scope.clearFn();
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
      $scope.clearFn();
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
      });
      $scope.addProtocolForm.$setPristine();
    };

    $scope.initpatientEditProtocol = function(){
      $scope.getPatientById($stateParams.patientId);
      patientService.getProtocolById($stateParams.patientId, $stateParams.protocolId).then(function(response){
        $scope.protocol = response.data;
        $scope.protocol.edit = true;  
        $scope.newProtocolPoint = ($scope.protocol.protocol) ? $scope.protocol.protocol.length : 1;
        if(!$scope.protocol){
          $scope.protocol = {};
          $scope.protocol.type = 'Normal';
          $scope.protocol.protocolEntries = [{}];
        } else {
          $scope.protocol.type = $scope.protocol.protocol[0].type;
          $scope.protocol.treatmentsPerDay = $scope.protocol.protocol[0].treatmentsPerDay;
          $scope.protocol.protocolEntries = $scope.protocol.protocol;
        }      
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
      }else {
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
      if($scope.protocol.id){
        delete $scope.protocol.id;
      }
      if($scope.protocol.patient){
        delete $scope.protocol.patient;
      }
      var data = $scope.protocol.protocol;
      if($scope.protocol.type === 'Custom'){
        angular.forEach(data, function(value, key){
          if(!value.type){
            value.type = 'Custom';
          }
          value.treatmentsPerDay = $scope.protocol.treatmentsPerDay;
          if(!value.treatmentLabel){
            value.treatmentLabel = 'point'+(key+1);
          }
        });
      }else{
        data[0].treatmentsPerDay = $scope.protocol.treatmentsPerDay;
      }
      $rootScope.protocols = data;
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

    $scope.clearMessages = function(){
      if($scope.patient.zipcode){
        delete $scope.serviceError;
      }
    };

    $scope.openProtocolDetailPage = function(){
      if($scope.patientStatus.role === loginConstants.role.admin){
        $state.go('updatedProtocolDetail',{'protocolId': $stateParams.protocolId});
      }else if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('updatedProtocolDetailRcadmin',{'protocolId': $stateParams.protocolId, 'patientId':$stateParams.patientId});
      }
    };

    $scope.openVerificationModal = function(){

      $scope.isAuthorizeFormSubmited = true;
      if($scope.authorizeForm.$invalid){
        return false;
      }
      $rootScope.$broadcast('initializeCaptcha');
      $scope.password = '';
      $scope.isVerificationModal = true;
    };

    $scope.initUpdatedProtocolDetail = function(){
      $scope.getPatientById($stateParams.patientId);
      var date = new Date();
      $scope.currentDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
      if(!$rootScope.protocols){
        if($scope.patientStatus.role === loginConstants.role.admin){
          $state.go('patientProtocol',{'patientId': $stateParams.patientId});
        }else if($scope.patientStatus.role === loginConstants.role.acctservices){
          $state.go('patientProtocolRcadmin',{'patientId': $stateParams.patientId});
        }
      }
    };

    $scope.init();
  }]);
