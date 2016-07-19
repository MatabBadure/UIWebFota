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

    /*
      *To Apply active class on selected tab
    */
    $scope.isActive = function(tab) {
      if ($scope.patientTab.indexOf(tab) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    /*
    * To Switch to respective state depending on the role of the user
    */
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

    /*
    * @ngdoc : method
    * @name : setOverviewMode
    * @description : It is a function which makes the dob of patient in human readable format. This function is passed as a callback to $scope.getPatiendDetails
    */
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

    /*
    * Initialization method for Patient overvirew page (patientOverview or patientOverviewRcadmin state)
    */
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

    /*
     * Method to open Edit Patient Details form From Patient Info tab.
    */
    $scope.openEditDetail = function(){
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientDemographicEditRcadmin', {'patientId': $stateParams.patientId});
      }else{
        $state.go('patientDemographicEdit', {'patientId': $stateParams.patientId});
      }
    };

    /*
     * To get protocols of a particular patient. (Care Plan and Device Tab)
    */
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

    /*
     * To get devicess of a particular patient. (Care Plan and Device Tab)
    */
    $scope.getDevices = function(patientId){
      $scope.totalHmr = 0;
      patientService.getDevices(patientId).then(function(response){
        angular.forEach(response.data.deviceList, function(device){
          $scope.totalHmr = $scope.totalHmr + device.hmr;
          device.createdDate = dateService.getDateByTimestamp(device.createdDate);
          device.lastModifiedDate = dateService.getDateByTimestamp(device.lastModifiedDate);
        });
        $scope.devices = response.data.deviceList;
        $scope.isDevicesLoaded = true;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    /*
     * Initilization of careplan and device page. 
    */
    $scope.initProtocolDevice = function(patientId){
      $scope.getPatientById(patientId);
      $scope.getDevices(patientId);
      $scope.getProtocols(patientId);
    };

    /*
     * Add protocol page (Careplan and device tab). 
    */
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

    /*
     * Add device page (careplan and device page).
    */
    $scope.initPatientAddDevice = function(){
      $scope.getPatientById($stateParams.patientId);
      $scope.device = $stateParams.device;
    };

    /*
     * This method is called each time this controller is loaded.
    */
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
      }
    };

    /*
    * @ngdoc : method
    * @name : setEditMode
    * @description : This methods calulates the age of a patient and format zipcode and set status. This function is passed as a callback to $scope.getPatiendDetails and $scope.getPatiendDetails
    */
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

    /*
     * Method to get patient detail. 
    */
    $scope.getPatiendDetails = function(patientId, callback) {
      patientService.getPatientInfo(patientId).then(function(response) {
        $scope.patientInfo = response.data;
        $scope.patient = $scope.patientInfo;
        if (typeof callback === 'function') {
          callback($scope.patient);
        }
      }).catch(function(response) {});
    };

    /*
     * Method to set flag variables in create state.
    */
    $scope.createPatient = function() {
      $scope.patientStatus.isCreate = true;
      $scope.patientStatus.isMessage = false;
      $scope.patient = {
        title: 'Mr.'
      };
    };

    /*
    * Need to check if it is really in use.
    */
    $scope.goToPatientClinics = function(){
      $state.go('patientEditClinics',{'patientId': $stateParams.patientId});
    }


    /*
     * Need to check if it is really in use. 
    */
    $scope.availableClinicsForPatient = function(associatedClinics){
      clinicService.getClinics($scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount).then(function (response) {
          $scope.clinics = response.data;
          $scope.total = response.headers()['x-total-count'];
          $scope.pageCount = Math.ceil($scope.total / 10);
        }).catch(function (response) {

        });
    };

    /*
     * 
    */
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
        /*splicing out associated clinics from all clinics set */
        angular.forEach($scope.associatedClinics, function(associatedClinic, associatedClinicKey){
          if(associatedClinic.id === clinic.id){
            clinics.splice(clinicKey, 1);
          }
        });
      });
      $scope.clinics = clinics;
    };

    /** starts for patient clinics **/
    /*
    Get associated clinics of a patient
    */
    $scope.getPatientClinicInfo = function(patientId){
      $scope.associatedClinics =[]; $scope.associatedClinics.length = 0;
      patientService.getClinicsLinkedToPatient(patientId).then(function(response) {
        $scope.associatedClinics = response.data.clinics;
      }).catch(function(response) {});
    };

    /*
     * To disassociate the clinic and remove the name of clinic in the list and available for adding the clinic in the list again
    */
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

    /*
     * Need to see if really used.
    */
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

    /*
    * To Show pop-up modal while associating Clinic to patient
    */
    $scope.showAssociateClinicModal = function(clinic){
      $scope.selectedClinic = clinic;
      $scope.associatedClinicModal = true;
    };

    /*
     * To Associate Clinic to a patient on confirming from pop-up modal
    */
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

    /*
     * Initialization method for Patient clincs and HCPs tab 
    */
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

    /*
    */
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

    /*
    * Need to check
    */
    $scope.getHCPs = function(){
      DoctorService.getDoctorsList($scope.searchItem, $scope.currentPageIndex, $scope.perPageCount).then(function(response){
        $scope.hcps = response.data;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    /*
     Need to check
    */
    $scope.getClinics = function(){
      clinicService.getClinics($scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount).then(function (response) {
          $scope.initializeClinics(response.data);
          $scope.total = response.headers()['x-total-count'];
          $scope.pageCount = Math.ceil($scope.total / 10);
        }).catch(function (response) {

        });
    }

    /*
    This method gets called while updating patient details
    */
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

    /*
    TO Cancle update protocol flow and go back to careplan and device tab
    */
    $scope.cancelProtocolDevice = function() {
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientProtocolRcadmin', {'patientId': $stateParams.patientId});
      }else{
        $state.go('patientProtocol');
      }
    };

    /*To cancel Patient Edit /Update flow and got back to patient info tab in readonly mode*/
    $scope.cancelEditDemographics = function(){
      if($scope.patientStatus.role === loginConstants.role.acctservices){
          $state.go('patientDemographicRcadmin', {'patientId': $stateParams.patientId});
        }else{
          $state.go('patientDemographic', {'patientId': $stateParams.patientId});
        }
    };

    /*
     *  TO cancel modal pop up of delete device.
    */
    $scope.cancelDeviceModel = function(){
      $scope.showModalDevice = false;
    };


    /*
    To cancel modal pop up of delete protocl modal
    */
    $scope.cancelProtocolModel = function(){
      $scope.showModalProtocol = false;
    };
/*
    Cancel model popup while disassociating HCP from patient 
*/
    $scope.cancelHCPModel = function(){
      $scope.showModalHCP = false;
    };

    /*
    Cancel model popup while disassociating clinic from patient 
    */
    $scope.cancelClinicModel = function(){
      $scope.showModalClinic = false;
    };

    /*
    Need to check
    */
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
    /** List of caregiver information for the particulat patient in caregiver info tab**/
    $scope.getCaregiversForPatient = function(patientId){
      patientService.getCaregiversLinkedToPatient(patientId).then(function(response){
        $scope.caregivers =  response.data.caregivers;
        $scope.isCargiverLoaded = true;
      }).catch(function(response){
        notyService.showError(response);
      });
    };
    /** Adding a caregiver to patient in caregiver info tab -> add caregiver (save button) **/
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

  /** Delete or disassociate the caregiver from the patient (on click of yes button for modal during deleting) **/
    $scope.disassociateCaregiversFromPatient = function(caregiver){
      $scope.closeModalCaregiver();
      patientService.disassociateCaregiversFromPatient($stateParams.patientId, caregiver.id).then(function(response){
        $scope.caregivers.splice(caregiver.index, 1);
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        notyService.showError(response);
      });
    };
  /** On page load for caregiver info tab **/
    $scope.initpatientCraegiver = function (patientId){
      $scope.getPatientById(patientId);
      $scope.getCaregiversForPatient($stateParams.patientId);
    };

    /** On page load of add care giver in care giver info tab**/
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

    /** On click of add caregiver in caregiver info tab**/
    $scope.linkCaregiver = function(){
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientCraegiverAddRcadmin', {'patientId': $stateParams.patientId});
      }else{
        $state.go('patientCraegiverAdd', {'patientId': $stateParams.patientId});
      }
    };

    /** On click of save button on care giver info tab ->Add caregiver **/
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

    /** on click of update button for showing POP up **/
    $scope.showCaregiverUpdateModal = function(){
      $scope.submitted = true;
      if($scope.form.$invalid){
        return false;
      }
      $scope.caregiverUpdateModal = true;
    };

    /** On click of add device button on care plan and device tab **/
    $scope.linkDevice = function(){
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientAddDeviceRcadmin',{patientId: $stateParams.patientId});
      }else{
        $state.go('patientAddDevice');
      }
    };

    /** Inside add device on care plan and device tab on click of save button **/
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

    /** inside care plan and device tab on click of add protocol (if its active) **/
    $scope.linkProtocol = function(){
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientAddProtocolRcadmin', {'patientId': $stateParams.patientId});
      }else{
        $state.go('patientAddProtocol');
      }
    };

    /** On click of save button while adding a new protocol inside care plan and device **/
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

    /** On click of yes button on modal pop up of delete device **/
    $scope.deleteDevice = function(){
      $scope.showModalDevice = false;
      patientService.deleteDevice($stateParams.patientId, $scope.deviceToDelete).then(function(response){
        $scope.deviceToDelete.active = false;
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    /** On click of delete icon of protocol in care plan and device tab  **/
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

    /** Initilisation method for caregiver edit page **/
    $scope.initpatientCraegiverEdit = function(careGiverId){
      $scope.careGiverStatus = "edit";
      $scope.getPatientById($stateParams.patientId);
      $scope.editCaregiver(careGiverId);
    };

    /** during intialisation of edit caregiver page for getting relationship and states **/
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

    /** This is getting call inside formsubmit function which is been called when the form is submitted or saved /update**/
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

    /** this will get called on click of edit button icon in caregiver info and been used for routing **/
    $scope.goToCaregiverEdit = function(careGiverId){
      if($scope.patientStatus.role === loginConstants.role.acctservices){
        $state.go('patientCraegiverEditRcadmin', {'caregiverId': careGiverId, 'patientId': $stateParams.patientId});
      }else{
        $state.go('patientCraegiverEdit', {'caregiverId': careGiverId});
      }
    };

    /** In care plan and device for edit button icon  (symbol) for protocol**/
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

    /** In care plan and device for edit button icon (symbol) for device**/
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

    /** It been called from dirctivce which is been used when on click of yes in update protocol modal**/
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
      
      patientService.editProtocol($stateParams.patientId, data).then(function(response){
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
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    /** On click of yes button in modal pop up while updating device from care plan and device**/
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

    /** On click of add new point while adding or updating custom protocol in care plan and device**/
    $scope.addNewProtocolPoint = function (){
      $scope.submitted = false;
      $scope.newProtocolPoint += 1;
      $scope.protocol.protocolEntries.push({});
    };

    /** on click of RadioButton switching from custom to normal**/
    $scope.switchtoNormal = function(){
      $scope.submitted = false;  
      $scope.protocol.protocolEntries.splice(1);                
      if($scope.protocol.edit && $scope.prevProtocolType && $scope.prevProtocolType.indexOf("Normal") !== -1){                  
        $scope.protocol = angular.copy($scope.prevProtocol);                        
      } else{
        $scope.clearFn();
      } 
    };

    /** inside Clinininfo on click of link clinic button**/
    $scope.linkClinic = function(){
      $scope.getAvailableAndAssociatedClinics($stateParams.patientId);
      $scope.searchClinicText = true;
    };

    /** inside Clinininfo on click of link HCP button**/
    $scope.linkHCP = function(){
      $scope.getAvailableAndAssociatedHCPs($stateParams.patientId);
      $scope.searchHCPText = true;
    };

    /** called inside link clinic for getting associated clinics**/
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

    /** called inside link HCP for getting associated HCP**/
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

    /** Need to check**/
    $scope.getHCPsToLinkToPatient = function($viewValue){
      return searchFilterService.getMatchingUser($viewValue, $scope.hcps, true);
    };

    /** Not used**/
    $scope.openPatientDeactivateModal = function(patient){
      $scope.deletePatient = patient;
      $scope.patientDeactivateModal = true;
    };
    /** Not used**/
    $scope.closePatientDeactivateModal = function(){
      $scope.patientDeactivateModal = false;
    };
    /** Inside care giver info on click of delete icon for open modal pop up**/
    $scope.openModalCaregiver = function(caregiverId, index){
      $scope.showModalCaregiver = true;
      $scope.deleteCaregiver = {'id':caregiverId, 'index':index};
    };
    /** Inside care giver info on click of delete icon for closing modal pop up**/
    $scope.closeModalCaregiver = function(){
      $scope.showModalCaregiver = false;
    };

    angular.element('#dp2').datepicker({
          endDate: '+0d',
          startDate: '-100y',
          autoclose: true});

    /** on click of RadioButton switching from normal to custom**/
    $scope.switchtoCustom = function(){
      $scope.submitted = false;
      $scope.newProtocolPoint = 1;      
      if($scope.protocol.edit && $scope.prevProtocolType && $scope.prevProtocolType.indexOf("Custom") !== -1){                 
        $scope.protocol = angular.copy($scope.prevProtocol);             
      }else{
        $scope.clearFn();
     }     
    };

    /** To clear all the Protocol data when we switch from normal to custom and vice versa**/
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

    /** For intilising the protocol edit**/
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
        $scope.prevProtocolType = $scope.protocol.type;
        $scope.prevProtocol = angular.copy($scope.protocol);        
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    /** oOn clinic info when you HCP on any of the HCp inside the list**/
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

    /** oOn clinic info when you click on any of the clinic inside the list**/
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

    /** Need to check**/
    $scope.gotoPatient = function(){
      $state.go('patientOverview',{'patientId': $scope.deviceAssociatedPatient.id});
    };

    /** Not used**/
    $scope.activatePatient = function(){
      patientService.reactivatePatient($scope.patient.id).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $state.go('patientUser');
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    /** Not used**/
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

    /** Not in use as of now**/
    $scope.resendActivationLink = function(){
      UserService.resendActivationLink($scope.patient.id).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $scope.isDisableResendButton = true;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    /** During updating the patient details on click of update during saving in patient info**/
    $scope.showPatientUpdateModal = function(){
      if($scope.form.$invalid){
        $scope.submitted = true;
        return false;
      }else{
        $scope.showModal = true;
      }
    };

    /** During updating the protocol on click of udpate during saving in care plan and device**/
    $scope.showPrtocolUpdateModal = function(){
      $scope.submitted = true;
      if($scope.addProtocolForm.$invalid){
        return false;
      }
      $scope.isAuthorizeProtocolModal = true;
    };

    /** During updating the patient details on click of udpate during saving in care plan and device tab **/
    $scope.showDeviceUpdateModal = function(){
      $scope.submitted = true;
      if($scope.addDeviceForm.$invalid){
        return false;
      }else{
        $scope.deviceUpdateModal =true;
      }
    };
    /** used while searching the clinic, returns array of clinics**/
    $scope.getClinicToLinkToPatient = function($viewValue){
      return searchFilterService.getMatchingClinic($viewValue, $scope.clinics);
    };

    /*Stae and city are not editable in create or edit patient, when zipcode is entered, this function is used to make both fields editable*/
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

    $scope.init();
  }]);
