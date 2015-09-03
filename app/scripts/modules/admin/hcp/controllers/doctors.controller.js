'use strict';

angular.module('hillromvestApp')
  .controller('DoctorsController', function($rootScope, $scope, $state, $timeout, Auth,$stateParams, UserService, DoctorService, notyService, clinicService ) {
    $scope.doctor = {};
    $scope.doctorStatus = {
      'role': localStorage.getItem('role'),
      'editMode': false,
      'isCreate': false,
      'isMessage': false,
      'message': ''
    };

    $scope.init = function(){
      var currentRoute = $state.current.name;
      if (currentRoute === 'hcpProfile') {
        $scope.getDoctorDetails($stateParams.doctorId, $scope.setEditMode);
      } else if (currentRoute === 'hcpNew') {
        $scope.createDoctor();
      } else if(currentRoute === 'associatedClinic'){
        $scope.getClinicsOfHCP($stateParams.doctorId);
        $scope.getAllclinics();
        $scope.getDoctorById($stateParams.doctorId);
      }
    };

    $scope.getDoctorById = function(doctorId){
      var url = '/api/user/' + doctorId + '/hcp';
      UserService.getUser(doctorId, url).then(function(response) {
        $scope.doctor = response.data.user;
      }).catch(function(response) {});
    };

    $scope.selectedDoctor = function(doctor) {
      $scope.doctorStatus.editMode = true;
      $scope.doctorStatus.isCreate = false;
      $scope.doctor = doctor;
    };

    $scope.getDoctorDetails = function(doctorId,callback){
      $scope.getPatientsAssociatedToHCP(doctorId, null);
      $scope.getClinicsOfHCP(doctorId);
      var url = '/api/user/' + doctorId + '/hcp';
      UserService.getUser(doctorId, url).then(function(response) {
        $scope.doctor = response.data.user;
        if (typeof callback === 'function') {
          callback($scope.doctor);
        }
      }).catch(function(response) {});
    };


    $scope.setEditMode = function(doctor){
      $scope.doctorStatus.editMode = true;
      $scope.doctorStatus.isCreate = false;
      $scope.doctor = doctor;
    };

    $scope.createDoctor = function() {
      $scope.doctorStatus.isCreate = true;
      $scope.doctorStatus.isMessage = false;
      $scope.doctor = {
        title: 'Mr.'
      };
    };

    $scope.viewAssociatedPatients = function(){
      if($scope.doctor.clinics.length === 1){
        var ids = $scope.doctor.clinics[0].id;
        localStorage.setItem('ids', ids)
        $state.go('associatedPatients');
      } else {
        console.log('Returning False...!')
        return false;
      }

    };

    $scope.onSuccess = function() {
      $scope.$broadcast('resetList', {});
    };

    $scope.getPatientsAssociatedToHCP = function(doctorId, clinicId){
      DoctorService.getPatientsAssociatedToHCP(doctorId, clinicId).then(function(response) {
        $scope.patients = response.data.patientList;
      }).catch(function(response) {});
    };

    $scope.getPatientsByClinic = function(){
      $scope.getPatientsAssociatedToHCP($scope.doctor.id, $scope.sortOption);
    };

    $scope.getClinicsOfHCP = function(doctorId){
      DoctorService.getClinicsAssociatedToHCP(doctorId).then(function(response) {
        $scope.clinicsOfHCP =  response.data.clinics;
        $scope.clinicList = [{"clinicId": 0, "name": "ALL"}];
        $scope.sortOption = $scope.clinicList[0].clinicId;
        if($scope.clinicsOfHCP){
          for(var i=0; i< $scope.clinicsOfHCP.length; i++){
            $scope.clinicList.push({"clinicId": $scope.clinicsOfHCP[i].id, "name": $scope.clinicsOfHCP[i].name});
          }
        }
      }).catch(function(response) {});
    };

    $scope.switchHCPTab = function(status){
      $state.go(status, {'doctorId': $stateParams.doctorId});
    };

    $scope.editHCP = function(){
      $state.go('hcpEdit', {'doctorId': $stateParams.doctorId});
    };

    $scope.showDeactivateModal = function(){
      $scope.deactivateModal = true;
    };

    $scope.showclinicDisassociatedModal = function(clinicId){
      $scope.deleteClinicId = clinicId;
      $scope.deactivateModal = true;
    };

    $scope.close = function(){
      $scope.deactivateModal = false;
    };

    $scope.deleteDoctor = function(){
      $scope.close();
      UserService.deleteUser($scope.doctor.id).then(function (response) {
        $scope.doctorStatus.message = response.data.message;
        notyService.showMessage($scope.doctorStatus.message, 'success');
        $state.go('hcpUser');
      }).catch(function (response) {
        if (response.data.message !== undefined) {
          $scope.doctorStatus.message = response.data.message;
        } else if (response.data.ERROR !== undefined) {
          $scope.doctorStatus.message = response.data.ERROR;
        }
        notyService.showMessage($scope.doctorStatus.message, 'warning');
      });
    };

    $scope.disassociateClinic = function(){
      $scope.deactivateModal = false;
      var data = [{'id': $scope.deleteClinicId}]
      clinicService.disassociateHCP($stateParams.doctorId, data).then(function(response){
        $scope.getClinicsOfHCP($stateParams.doctorId);
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        if (response.data.message !== undefined) {
          $scope.doctorStatus.message = response.data.message;
        } else if (response.data.ERROR !== undefined) {
          $scope.doctorStatus.message = response.data.ERROR;
        }
        notyService.showMessage($scope.doctorStatus.message, 'warning');
      });
    };

    $scope.getAllclinics = function(){
      clinicService.getAllClinics().then(function(response){
        $scope.clinics = response.data;
      }).catch(function(response){});
    };

    $scope.selectClinicFromHCP = function(clinic){
      $scope.searchItem = "";
      var data = [{'id': $stateParams.doctorId}];
      clinicService.associateHcp(clinic.id, data).then(function(response){
        $scope.getClinicsOfHCP($stateParams.doctorId);
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
         if (response.data.message !== undefined) {
          $scope.doctorStatus.message = response.data.message;
        } else if (response.data.ERROR !== undefined) {
          $scope.doctorStatus.message = response.data.ERROR;
        }
        notyService.showMessage($scope.doctorStatus.message, 'warning');
      });
    };

    $scope.linkClinic = function(){
      $scope.associateClinicSearch = true;
    };
    
    $scope.init();
  });
