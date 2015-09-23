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
.controller('patientsController', function($scope, $filter, $state, $stateParams, patientService, dateService, notyService, UserService, DoctorService, clinicService,$rootScope,$timeout) {
    $scope.patient = {};
    $scope.patientTab = "";
    $scope.newProtocolPoint = 1;
    $scope.patientStatus = {
      'role': localStorage.getItem('role'),
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
      $state.go(status, {'patientId': $stateParams.patientId});
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
      }).catch(function(response){});
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
      $state.go('patientDemographicEdit', {'patientId': $stateParams.patientId});
    };

    $scope.getProtocols = function(patientId){
      patientService.getProtocol(patientId).then(function(response){
        $scope.protocols = response.data.protocol;
        $scope.addProtocol = true;
        angular.forEach($scope.protocols, function(protocol){
          protocol.createdDate = dateService.getDateByTimestamp(protocol.createdDate);
          protocol.lastModifiedDate = dateService.getDateByTimestamp(protocol.lastModifiedDate);
          if(!protocol.deleted){
            $scope.addProtocol = false;
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
      }).catch(function(response){});
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
      if(currentRoute === 'patientOverview'){
        $scope.initPatientOverview();
      }else if(currentRoute === 'patientDemographic'){
        $scope.initpatientDemographic();
      }else if (currentRoute === 'patientEdit') {
        $scope.getPatiendDetails($stateParams.patientId, $scope.setEditMode);
      } else if (currentRoute === 'patientNew') {
        $scope.createPatient();
      }else if($state.current.name === 'patientEditClinics'){
        $scope.initPatientClinics($stateParams.patientId);
      }else if(currentRoute === 'patientClinics'){
        $scope.initPatientClinicsInfo($stateParams.patientId);
      }else if(currentRoute === 'patientCraegiver'){
        $scope.initpatientCraegiver($stateParams.patientId);
      } else if($state.current.name === 'patientProtocol'){
        $scope.initProtocolDevice($stateParams.patientId);
      }else if(currentRoute === 'patientCraegiverAdd'){
        $scope.initpatientCraegiverAdd($stateParams.patientId);
      }else if(currentRoute === 'patientCraegiverEdit'){
        $scope.initpatientCraegiverEdit($stateParams.patientId);
      }else if(currentRoute === 'patientAddProtocol'){
        $scope.initPatientAddProtocol();
      }else if(currentRoute === 'patientAddDevice'){
        $scope.initPatientAddDevice();
      }else if(currentRoute === 'patientDemographicEdit'){
        $scope.initpatientDemographic();
      }else if(currentRoute === 'patientEditProtocol'){
        $scope.initpatientEditProtocol();
      }

    };

    $scope.setEditMode = function(patient) {
      $scope.patientStatus.editMode = true;
      $scope.patientStatus.isCreate = false;
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
    }

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
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response) {
        notyService.showMessage(response.data.message, 'warning');
      });
    };

    $scope.disassociateLinkedHCPs = function(id){
      $scope.showModalHCP = false;
      var data = [{"id": id}];
      patientService.disassociateHCPFromPatient($stateParams.patientId, data).then(function(response) {
        $scope.getAvailableAndAssociatedHCPs($stateParams.patientId);
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response) {
        if(response.data.message){
          notyService.showMessage(response.data.message, 'warning');
        } else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR, 'warning');
        }
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
          $scope.clinics = []; $scope.clinics.length = 0;
          $scope.clinics = response.data;
          for(var i=0; i < $scope.associatedClinics.length; i++){
            for(var j=0; j <  $scope.clinics.length; j++ ){
              if($scope.associatedClinics[i].id == $scope.clinics[j].id){
                $scope.clinics.splice(j, 1);
              }
            }
          }
          $scope.total = response.headers()['x-total-count'];
          $scope.pageCount = Math.ceil($scope.total / 10);
        }).catch(function (response) {

        });
      }else {
        $scope.clinics = []; $scope.clinics.length = 0;
        $scope.searchItem = "";
      }
    };

    $scope.selectClinicForPatient = function(clinic, index){
      var data = [{"id": clinic.id, "mrnId": null, "notes": null}]
      $scope.searchItem = "";
      patientService.associateClinicToPatient($stateParams.patientId, data).then(function(response) {
        $scope.associatedClinics = response.data.clinics;
        $scope.getAvailableAndAssociatedClinics($stateParams.patientId);
      }).catch(function(response) {});
    };

    $scope.initPatientClinicsInfo = function(patientId){
      $scope.patientTab = "patientClinics";
      $scope.currentPageIndex = 1;
      $scope.perPageCount = 90;
      $scope.pageCount = 0;
      $scope.total = 0;
      $scope.clinics = [];
      $scope.sortOption = "";
      $scope.searchItem = "";
      $scope.searchClinicText = false;
      $scope.associatedClinics = [];
      $scope.getPatientById(patientId);
      $scope.getAvailableAndAssociatedClinics(patientId);
      $scope.getAvailableAndAssociatedHCPs(patientId);     
    };

    $scope.getAssociatedHCPs = function(patientId){
      patientService.getAssociateHCPToPatient(patientId).then(function(response){
        $scope.associatedHCPs = response.data.hcpUsers
      }).catch(function(response){});
    };

    $scope.selectHcpForPatient = function(hcp){
      var data = [{'id': hcp.id}];
      $scope.searchHcp = "";
      patientService.associateHCPToPatient(data, $stateParams.patientId).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $scope.getAvailableAndAssociatedHCPs($stateParams.patientId);
      }).catch(function(response){
        if(response.data.message){
          notyService.showMessage(response.data.message, 'warning');
        } else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR, 'warning');
        }
      });
    };

    $scope.getHCPs = function(){
      DoctorService.getDoctorsList($scope.searchItem, $scope.currentPageIndex, $scope.perPageCount).then(function(response){
        $scope.hcps = response.data;
      }).catch(function(response){});
    };

    $scope.getClinics = function(){
      clinicService.getClinics($scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount).then(function (response) {
          $scope.clinics = []; $scope.clinics.length = 0;
          $scope.clinics = response.data;
          for(var i=0; i < $scope.associatedClinics.length; i++){
            for(var j=0; j <  $scope.clinics.length; j++ ){
              if($scope.associatedClinics[i].id == $scope.clinics[j].id){
                $scope.clinics.splice(j, 1);
              }
            }
          }
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
      UserService.editUser(data).then(function (response) {
        if(response.status === 200) {
          $scope.patientStatus.isMessage = true;
          $scope.patientStatus.message = "Patient updated successfully";
          notyService.showMessage($scope.patientStatus.message, 'success');
          $state.go('patientDemographic', {'patientId': $stateParams.patientId});
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
      $state.go('patientProtocol');
    };

    $scope.cancelEditDemographics = function(){
      $state.go('patientDemographic', {'patientId': $stateParams.patientId});
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
        $state.go('patientUser');
      }).catch(function(response){});
    };

    /** start of caregiver tab for admin->patient **/
    $scope.getCaregiversForPatient = function(patientId){
      patientService.getCaregiversLinkedToPatient(patientId).then(function(response){
        $scope.caregivers =  response.data.caregivers;
      }).catch(function(response){});
    };

    $scope.associateCaregiverstoPatient = function(patientId, careGiver){
        patientService.associateCaregiversFromPatient(patientId, careGiver).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $scope.caregivers =  response.data.user;
        $scope.associateCareGiver = [];$scope.associateCareGiver.length = 0;
        $scope.switchPatientTab('patientCraegiver');
      }).catch(function(response){
        notyService.showMessage(response.data.ERROR,'warning' );
      });
    };

    $scope.disassociateCaregiversFromPatient = function(caregiver){
      $scope.closeModalCaregiver();
      patientService.disassociateCaregiversFromPatient($stateParams.patientId, caregiver.id).then(function(response){
        $scope.caregivers.splice(caregiver.index, 1);
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        if(response.data.message){
          notyService.showMessage(response.data.message,'warning');
        }else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR,'warning');
        }
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
      $state.go('patientCraegiverAdd', {'patientId': $stateParams.patientId});
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
        $scope.updateCaregiver($stateParams.patientId, $stateParams.caregiverId , data);
      }
    };

    $scope.linkDevice = function(){
      $state.go('patientAddDevice');
    };

    $scope.addDevice = function(){
      $scope.submitted = true;
      if($scope.addDeviceForm.$invalid){
        return false;
      }
      patientService.addDevice( $stateParams.patientId, $scope.device).then(function(response){
        $state.go('patientProtocol');
      }).catch(function(response){});
    };

    $scope.linkProtocol = function(){
      $state.go('patientAddProtocol');
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
        $state.go('patientProtocol');
      }).catch(function(response){});
    };

    $scope.deleteDevice = function(){
      $scope.showModalDevice = false;
      patientService.deleteDevice($stateParams.patientId, $scope.deviceToDelete).then(function(response){
        $scope.deviceToDelete.active = false;
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        notyService.showMessage(response.data.message, 'warning');
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
      }).catch(function(response){});
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
        }).catch(function(response){});
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
      }).catch(function(response){});
    };

    $scope.goToCaregiverEdit = function(careGiverId){
      $state.go('patientCraegiverEdit', {'caregiverId': careGiverId});
    };

    $scope.openEditProtocol = function(protocol){
      if(!protocol){
        return false;
      }
      $state.go('patientEditProtocol', {
        'protocolId': protocol.id
      });
      /*$scope.protocol = protocol;
      patientService.getProtocolById($stateParams.patientId, protocol.id).then(function(response){
        $scope.protocol = response.data;
        $scope.protocol.edit = true;
        $state.go('patientAddProtocol',{protocol: $scope.protocol});
      }).catch(function(response){});*/
    };

    $scope.openEditDevice = function(device){
      if(!device.active){
        return false;
      }
      device.edit = true;
      $state.go('patientAddDevice',{device: device});
    };

    $scope.updateProtocol = function(){
      if($scope.protocol.id){
        delete $scope.protocol.id;
      }
      if($scope.protocol.patient){
        delete $scope.protocol.patient;
      }
      var data = $scope.protocol.protocol;
      patientService.editProtocol($stateParams.patientId, data).then(function(response){
        $state.go('patientProtocol');
      }).catch(function(response){});
    };

    $scope.getPatientById = function(patientid){
      patientService.getPatientInfo(patientid).then(function(response){
        $scope.slectedPatient = response.data;
      }).catch(function(response){});
    };

    $scope.updateDevice = function(){
      patientService.addDevice($stateParams.patientId, $scope.device).then(function(response){
        $state.go('patientProtocol');
      }).catch(function(response){});
    };

    $scope.addNewProtocolPoint = function (){
      $scope.submitted = false;
      $scope.newProtocolPoint += 1;
      $scope.protocol.protocolEntries.push({});
    };

    $scope.switchtoNormal = function(){
      $scope.submitted = false;
      $scope.protocol.protocolEntries.splice(1);
    };

    $scope.linkClinic = function(){
      $scope.searchClinicText = true;
    };

    $scope.linkHCP = function(){
      $scope.searchHCPText = true;
    };

    $scope.getAvailableAndAssociatedClinics = function(patientId){
      $scope.associatedClinicsErrMsg = null;
      $scope.associatedHCPsErrMsg = null;
      $scope.associatedClinics =[]; 
      $scope.associatedClinics.length = 0;
      $scope.clinics = []; $scope.clinics.length = 0;
      patientService.getClinicsLinkedToPatient(patientId).then(function(response) {
        if(response.data.clinics){
          $scope.associatedClinics = response.data.clinics;
        }else if(response.data.message){
          $scope.associatedClinicsErrMsg = response.data.message;
        }
        clinicService.getClinics($scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount).then(function (response) {          
          $scope.clinics = response.data;
          for(var i=0; i < $scope.associatedClinics.length; i++){
            for(var j=0; j <  $scope.clinics.length; j++ ){
              if($scope.associatedClinics[i].id == $scope.clinics[j].id){
                $scope.clinics.splice(j, 1);
              }
            }
          }          
        });
      });
    };

    $scope.getAvailableAndAssociatedHCPs = function(patientId){
      $scope.associatedClinicsErrMsg = null;
      $scope.associatedHCPsErrMsg = null;
      $scope.associatedHCPs = []; $scope.associatedHCPs.length = 0;
      $scope.hcps = []; $scope.hcps.length = 0;
      patientService.getAssociateHCPToPatient(patientId).then(function(response){        
        if(response.data.hcpUsers){
          $scope.associatedHCPs = response.data.hcpUsers;          
        }else if(response.data.message){
          $scope.associatedHCPsErrMsg = response.data.message;
        }
        DoctorService.getDoctorsList($scope.searchItem, $scope.currentPageIndex, $scope.perPageCount).then(function(response){          
          $scope.hcps = response.data;
          for(var i=0; i < $scope.associatedHCPs.length; i++){
            for(var j=0; j <  $scope.hcps.length; j++ ){
              if($scope.associatedHCPs[i].id == $scope.hcps[j].id){
                $scope.hcps.splice(j, 1);
              }
            }
          }
        });
      });
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
          autoclose: true}).
          on('changeDate', function(ev) {
          var selectedDate = angular.element('#dp2').datepicker("getDate");
          var _month = (selectedDate.getMonth()+1).toString();
          _month = _month.length > 1 ? _month : '0' + _month;
          var _day = (selectedDate.getDate()).toString();
          _day = _day.length > 1 ? _day : '0' + _day;
          var _year = (selectedDate.getFullYear()).toString();
          var dob = _month+"/"+_day+"/"+_year;
          $scope.patient.dob = dob;
          var age = dateService.getAge(selectedDate);
          angular.element('.age').val(age);
          $scope.patient.age = age;
          if (age === 0) {
            $scope.form.$invalid = true;
          }
          angular.element("#dp2").datepicker('hide');
          $scope.$digest();
        });

    $scope.switchtoCustom = function(){
      $scope.submitted = false;      
    };

    $scope.initpatientEditProtocol = function(){
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
      }).catch(function(response){});
    };

    $scope.init();
  });
