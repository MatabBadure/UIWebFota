'use strict';
angular.module('hillromvestApp')
  .directive('doctor', function() {
    return {
      templateUrl: 'scripts/modules/admin/hcp/directives/create-edit/create.html',
      restrict: 'E',
      scope: {
        doctor: '=doctorData',
        onSuccess: '&',
        doctorStatus: '=doctorStatus'
      },
      controller: ['$scope', '$timeout', 'notyService', '$state', '$stateParams', 'DoctorService', 'UserService', 'clinicService', 'StorageService', 'loginConstants', 'commonsUserService', 'URL', 'addressService',
      function ($scope, $timeout, notyService, $state, $stateParams, DoctorService, UserService, clinicService, StorageService, loginConstants, commonsUserService, URL, addressService) {
        $scope.role = StorageService.get('logged').role;
        $scope.open = function () {
          $scope.showModal = true;
        };

        $scope.loadClinics = function($query) {
          return $scope.clinics.filter(function (clinic){
            return clinic.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
          });
        };

        $scope.cancelUpdate = function(){
          if($state.current.name === 'clinicadminedithcp'){
            $state.go('clinicadminhcpoverview', {'hcpId': $stateParams.doctorId});
          }else{
            $scope.goToHcpProfile();         
          }
        };

        $scope.init = function () {
          $scope.doctor = {};
          if($stateParams.doctorId){
            $scope.doctorStatus.isCreate = false;
            $scope.doctorStatus.editMode = true;
            DoctorService.getDoctor($stateParams.doctorId).then(function(response){
              var tempHcp = response.data.user;
              $scope.selectedHcp = tempHcp;
              $scope.doctor = response.data.user;
              $scope.doctor.zipcode = commonsUserService.formatZipcode($scope.doctor.zipcode);
            }).catch(function(response){
              notyService.showError(response);
              if(response.status === 400){
                if(StorageService.get('logged').role === 'ADMIN'){
                  $state.go('hcpUser');
                }else if(StorageService.get('logged').role === 'ACCT_SERVICES'){
                  $state.go('hcpUserRcadmin');
                }
              }
            });
          }
          $scope.credentialsList = admin_cont.hcp.credentialsList;
          $scope.submitted = false;
          $scope.isOtherCredential = false;
          if($state.current.name === 'clinicadminnewhcp'){
            $scope.getClinicsByClinicAdmin(StorageService.get('logged').userId);
          }else{
            $scope.getParentClinics();
          }
        };

        $scope.getClinicsByClinicAdmin = function(clinicAdminId){
          clinicService.getClinicsByClinicadmin(clinicAdminId).then(function(response){
            $scope.clinics = response.data.clinics;
            angular.forEach($scope.clinics, function(clinic) {
              if(clinic.city) {
                clinic.nameAndCity = clinic.name + "," + clinic.city;
              } else {
                clinic.nameAndCity = clinic.name;
              }
            });
          }).catch(function(response){});
        };

        $scope.getParentClinics = function() {
          var timer = false;
          timer = $timeout(function() {
            var url = URL.allActiveClinics;
            clinicService.getAllClinics(url).then(function(response) {
              $scope.clinics = response.data;
              angular.forEach($scope.clinics, function(clinic) {
                if(clinic.city) {
                  clinic.nameAndCity = clinic.name + "," + clinic.city;
                } else {
                  clinic.nameAndCity = clinic.name;
                }
              });
            }).catch(function(response) {});
          }, 1000)
        };

        $scope.removeClinic = function(index) {
          var tmpList = angular.copy($scope.doctor.clinics);
          tmpList.splice(index, 1);
          $scope.doctor.clinics = tmpList;
        };

        $scope.selectClinic = function(clinic, index) {
          $scope.doctor.clinics[index].name = clinic.name;
          $scope.doctor.clinics[index].id = clinic.id;
          $scope.clinics = [];
        };

        $scope.formSubmit = function() {
          $scope.submitted = true;
        };

        $scope.init();

        $scope.checkCredential = function() {
          if ($scope.doctor.credentials === admin_cont.hcp.other) {
            $scope.isOtherCredential = true;
          }else {
            $scope.doctor.otherCredential = '';
            $scope.isOtherCredential = false;
          }
        }


        $scope.createDoctor = function() {
          if ($scope.form.$invalid) {
            return false;
          }
          if( $scope.isOtherCredential ) {
            $scope.doctor.credentials = $scope.doctor.otherCredential;
          }

          $scope.doctor.clinicList = [];
          angular.forEach($scope.doctor.clinics, function(clinic){
            $scope.doctor.clinicList.push({'id': clinic.id});
          });
          if ($scope.doctorStatus.editMode) {
            $scope.doctor.role = 'HCP';
            $scope.editDoctor($scope.doctor);
          } else {
            var data = $scope.doctor;
            data.role = 'HCP';
            $scope.newDoctor(data);
          }
        };

        $scope.editDoctor = function(data) {
          $scope.showModal = false;
          UserService.editUser(data).then(function(response) {
            $scope.doctorStatus.isMessage = true;
            $scope.doctorStatus.message = response.data.message;
            notyService.showMessage($scope.doctorStatus.message, 'success');
            if( $state.current.name ==='clinicadminedithcp'){
              $state.go('clinicadminhcpoverview', {'hcpId': $stateParams.doctorId});
            }else{
              $scope.goToHcpProfile();
            }
          }).catch(function(response) {
            $scope.doctorStatus.isMessage = true;
            if (response.data.message !== undefined) {
              $scope.doctorStatus.message = response.data.message;
            } else if (response.data.ERROR !== undefined) {
              $scope.doctorStatus.message = response.data.ERROR;
            } else {
              $scope.doctorStatus.message = 'Error occured! Please try again';
            }
            notyService.showMessage($scope.doctorStatus.message, 'warning');
          });
        };

        $scope.newDoctor = function(data) {
          UserService.createUser(data).then(function(response) {
            $scope.doctorStatus.isMessage = true;
            $scope.doctorStatus.message = "HCP created successfully";
            notyService.showMessage($scope.doctorStatus.message, 'success');
            $scope.reset();
          }).catch(function(response) {
            if (response.data.message !== undefined) {
              $scope.doctorStatus.message = response.data.message;
            } else if (response.data.ERROR !== undefined) {
              $scope.doctorStatus.message = response.data.ERROR;
            } else {
              $scope.doctorStatus.message = 'Error occured! Please try again';
            }
            notyService.showMessage($scope.doctorStatus.message, 'warning');
          });
        };

        $scope.deleteDoctor = function () {
          UserService.deleteUser($scope.doctor.id).then(function (response) {
            $scope.showModal = false;
            $scope.doctorStatus.isMessage = true;
            $scope.doctorStatus.message = response.data.message;
            notyService.showMessage($scope.doctorStatus.message, 'success');
            $scope.reset();
          }).catch(function (response) {
            $scope.showModal = false;
            $scope.doctorStatus.isMessage = true;
            if (response.data.message !== undefined) {
              $scope.doctorStatus.message = response.data.message;
            } else if (response.data.ERROR !== undefined) {
              $scope.doctorStatus.message = response.data.ERROR;
            } else {
              $scope.doctorStatus.message = 'Error occured! Please try again';
            }
            notyService.showMessage($scope.doctorStatus.message, 'warning');
          });
        };
        $scope.cancel = function() {
          $scope.reset();
        };

        $scope.reset = function() {
          $scope.doctorStatus.editMode = false;
          $scope.doctorStatus.isCreate = false;
          $scope.submitted = false;
          $scope.doctor = {};
          $scope.doctor.clinics = [];
          $scope.form.$setPristine();
          if($state.current.name === 'clinicadminnewhcp')
          {
            $state.go('clinicadminhcpdashboard', {'clinicId' : $stateParams.clinicId});
          }else{
            if($scope.role === loginConstants.role.acctservices){
               $state.go('hcpUserRcadmin');
            }else{
              $state.go('hcpUser'); 
            } 
          }
        };

        $scope.goToHcpProfile = function(){
            if($scope.role === loginConstants.role.acctservices){
              $state.go('hcpProfileRcadmin', {'doctorId': $stateParams.doctorId});
            }else{
              $state.go('hcpProfile', {'doctorId': $stateParams.doctorId});
            } 
        };

        $scope.getCityState = function(zipcode){
          delete $scope.serviceError;
          $scope.isServiceError = false;
          if(zipcode){
            addressService.getCityStateByZip(zipcode).then(function(response){
              $scope.doctor.city = response.data[0].city;
              $scope.doctor.state = response.data[0].state;
            }).catch(function(response){
              $scope.doctor.state = null;
              $scope.doctor.city = null;
              $scope.serviceError = response.data.ERROR;
              $scope.isServiceError = true;
            });
          }else{
            delete $scope.doctor.city;
            delete $scope.doctor.state;
            if($scope.form.zip.$dirty && $scope.form.zip.$showValidationMessage && $scope.form.zip.$invalid){
            }else{
              $scope.serviceError = 'Invalid Zipcode';
              $scope.isServiceError = true;
            }
          }
        };

        $scope.clearMessages = function(){
          if($scope.doctor.zipcode){
            delete $scope.serviceError;
          }
        };

      }]
    };
  });