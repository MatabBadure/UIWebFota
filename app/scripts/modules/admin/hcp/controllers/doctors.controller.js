'use strict';

angular.module('hillromvestApp')
  .controller('DoctorsController',['$rootScope', '$scope', '$state', '$timeout', 'Auth', '$stateParams', 'UserService', 'DoctorService', 'notyService', 'clinicService', 'searchFilterService', 'dateService', 'StorageService', 'commonsUserService', 'loginConstants', 'URL',
    function($rootScope, $scope, $state, $timeout, Auth,$stateParams, UserService, DoctorService, notyService, clinicService,searchFilterService, dateService, StorageService, commonsUserService, loginConstants, URL) {
    $scope.doctor = null;
    $scope.doctorStatus = {
      'role': StorageService.get('logged').role,
      'editMode': false,
      'isCreate': false,
      'isMessage': false,
      'message': ''
    };
    var searchOnLoad = true;

    $scope.init = function(){
      var currentRoute = $state.current.name;
      if (currentRoute === 'hcpProfile' || currentRoute === 'hcpProfileRcadmin' || currentRoute === 'hcpProfileAssociates' || currentRoute === 'hcpProfileCustomerService') {
        $scope.currentPageIndex = 1;
        $scope.perPageCount = 10;
        $scope.pageCount = 0;
        $scope.total = 0;        
        $scope.filterClinicId = "all";
        $scope.searchItem = "";
        $scope.searchFilter = searchFilterService.initSearchFiltersForPatient();
        $scope.searchFilter.isHideStatusFilter = true;
        $scope.searchPatientsForHCP();
        $scope.getDoctorDetails($stateParams.doctorId, $scope.setEditMode);        
      } else if (currentRoute === 'hcpNew' || currentRoute === 'hcpNewRcadmin') {
        $scope.createDoctor();
      } else if(currentRoute === 'associatedClinic' || currentRoute === 'associatedClinicRcadmin' || currentRoute === 'associatedClinicAssociates' || currentRoute === 'associatedClinicCustomerService'){
        $scope.getAvailableclinics($stateParams.doctorId);       
        $scope.getDoctorById($stateParams.doctorId);
      }
    };

    $scope.getDoctorById = function(doctorId){
      var url = URL.getHcpUserById.replace('HCPID', doctorId);
      UserService.getUser(doctorId, url).then(function(response) {
        $scope.doctor = response.data.user;
      }).catch(function(response) {
        notyService.showError(response);
        if(response.status === 400){
          $scope.redirectToManageHCPs();
        }
      });
    };

    $scope.redirectToManageHCPs = function(){
      if(StorageService.get('logged').role === 'ADMIN'){
        $state.go('hcpUser');
      }else if(StorageService.get('logged').role === 'ACCT_SERVICES'){
        $state.go('hcpUserRcadmin');
      }
    };

    $scope.selectedDoctor = function(doctor) {
      $scope.doctorStatus.editMode = true;
      $scope.doctorStatus.isCreate = false;
      $scope.doctor = doctor;
    };

    $scope.getDoctorDetails = function(doctorId,callback){
      $scope.getClinicsOfHCP(doctorId);
      var url = URL.getHcpUserById.replace('HCPID', doctorId);
      UserService.getUser(doctorId, url).then(function(response) {
        $scope.doctor = response.data.user;
        if (typeof callback === 'function') {
          callback($scope.doctor);
        }
      }).catch(function(response) {
        notyService.showError(response);
        $scope.redirectToManageHCPs();
      });
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
      if($scope.doctor && $scope.doctor.clinics.length === 1){
        $state.go('associatedPatients');
      } else {
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
      $scope.searchPatientsForHCP();
    };

    $scope.getClinicsOfHCP = function(doctorId){
      DoctorService.getClinicsAssociatedToHCP(doctorId).then(function(response) {
        $scope.clinicsOfHCP =  response.data.clinics;
        $scope.clinicList = [{"clinicId": "all", "name": "ALL"}];
        $scope.filterClinicId = $scope.clinicList[0].clinicId;
        if($scope.clinicsOfHCP){
          angular.forEach($scope.clinicsOfHCP, function(clinic){
            $scope.clinicList.push({"clinicId": clinic.id, "name": clinic.name});
          });
        }
      }).catch(function(response) {});
    };

    $scope.switchHCPTab = function(status){
      if($scope.doctorStatus.role === loginConstants.role.acctservices){
        $state.go(status+loginConstants.role.Rcadmin, {'doctorId': $stateParams.doctorId});
      }else if($scope.doctorStatus.role === loginConstants.role.associates){
        $state.go(status+'Associates', {'doctorId': $stateParams.doctorId});
      }else if($scope.doctorStatus.role === loginConstants.role.customerservices){
        $state.go(status+'CustomerService', {'doctorId': $stateParams.doctorId});
      }else {
        $state.go(status, {'doctorId': $stateParams.doctorId});
      }
    };

    $scope.editHCP = function(){
      if($scope.doctorStatus.role === loginConstants.role.acctservices){
        $state.go('hcpEditRcadmin', {'doctorId': $stateParams.doctorId});
      }else{
        $state.go('hcpEdit', {'doctorId': $stateParams.doctorId});
      }
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
      if($scope.doctor){
        UserService.deleteUser($scope.doctor.id).then(function (response) {
          $scope.doctorStatus.message = response.data.message;
          notyService.showMessage($scope.doctorStatus.message, 'success');
          if($scope.doctorStatus.role === loginConstants.role.acctservices){
            $state.go('hcpUserRcadmin');
          }else{
            $state.go('hcpUser');
          }
        }).catch(function (response) {
          if (response.data.message !== undefined) {
            $scope.doctorStatus.message = response.data.message;
          } else if (response.data.ERROR !== undefined) {
            $scope.doctorStatus.message = response.data.ERROR;
          }
          notyService.showMessage($scope.doctorStatus.message, 'warning');
        });
      }
    };

    $scope.disassociateClinic = function(){
      $scope.deactivateModal = false;
      var data = [{'id': $scope.deleteClinicId}]
      clinicService.disassociateHCP($stateParams.doctorId, data).then(function(response){
        $scope.getAvailableclinics($stateParams.doctorId); 
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

    $scope.showAssociateClinicModal = function(clinic){
      $scope.selectedclinic = clinic;
      $scope.associatedClinicModal = true;
    };

    $scope.selectClinicFromHCP = function(){
      $scope.associatedClinicModal = false;
      $scope.searchItem = "";
      var data = [{'id': $stateParams.doctorId}];
      clinicService.associateHcp($scope.selectedclinic.id, data).then(function(response){
        $scope.getAvailableclinics($stateParams.doctorId);
        $scope.associateClinicSearch = false;
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
    
    $scope.getAvailableclinics = function(doctorId){
      $scope.clinicsAssociatedErrMsg = null;
      $scope.clinics = []; 
      clinicService.getAllActiveClinics().then(function(response){
        if(response.data)
        $scope.clinics = commonsUserService.formatDataForTypehead(response.data);
        DoctorService.getClinicsAssociatedToHCP(doctorId).then(function(response) {
          $scope.clinicsOfHCP = [];  $scope.clinicsOfHCP.length = 0;
          if(response.data.clinics){            
            $scope.clinicsOfHCP =  response.data.clinics;
          }
          if((!response.data.clinics || response.data.clinics === 'undefined') && response.data.message){
            $scope.clinicsAssociatedErrMsg = response.data.message;
          }
          for(var i=0; i< $scope.clinicsOfHCP.length; i++){
            for(var j=0;j< $scope.clinics.length ; j++){
              if($scope.clinicsOfHCP[i].id.trim() === $scope.clinics[j].id.trim()){
                $scope.clinics.splice(j,1);
              }
            }
          }          
          $scope.clinicList = [{"clinicId": 0, "name": "ALL"}];
          $scope.filterClinicId = $scope.clinicList[0].clinicId;
          if($scope.clinicsOfHCP){
            angular.forEach($scope.clinicsOfHCP, function(clinic){
              $scope.clinicList.push({"clinicId": clinic.id, "name": clinic.name});
            });
          }
        });
      });      
    };

    $scope.selectPatient = function(patient) {
      if($scope.doctorStatus.role === loginConstants.role.acctservices){
        $state.go('patientOverviewRcadmin', {
          'patientId': patient.id
        });
      }else if($scope.doctorStatus.role === loginConstants.role.associates){
        $state.go('associatepatientOverview', {
          'patientId': patient.id
        });
      }else if($scope.doctorStatus.role === loginConstants.role.customerservices){
        $state.go('customerservicepatientOverview', {
          'patientId': patient.id
        });
      }else {
        $state.go('patientOverview', {
          'patientId': patient.id
        });
      }
    };

    $scope.selectClinic = function(clinic) {
      if($scope.doctorStatus.role === loginConstants.role.acctservices){
        $state.go('clinicProfileRcadmin', {
          'doctorId': $stateParams.doctorId,
          'clinicId': clinic.id
        });
      }else if($scope.doctorStatus.role === loginConstants.role.associates){
        $state.go('clinicProfileAssociate', {
          'clinicId': clinic.id
        });
      }else if($scope.doctorStatus.role === loginConstants.role.customerservices){
        $state.go('clinicProfileCustomerService', {
          'clinicId': clinic.id
        });
      }else{
        $state.go('clinicProfile', {
          'clinicId': clinic.id
        });
      }
    };
    
    $scope.searchPatientsOnQueryChange = function(){
      if(($state.current.name === 'hcpProfile' || $state.current.name === 'hcpProfileRcadmin' || $state.current.name === 'hcpProfileAssociates' || $state.current.name === 'hcpProfileCustomerService') && !searchOnLoad){
        $scope.searchPatientsForHCP();
      }
    };

    $scope.searchPatientsForHCP = function(track){
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
        DoctorService.searchPatientsForHCPOrClinicadminFromSuperAdmin($scope.searchItem, 'hcp' ,$stateParams.doctorId, $scope.filterClinicId, $scope.currentPageIndex, $scope.perPageCount, filter).then(function (response) {
          $scope.patients = [];
          angular.forEach(response.data, function(patient){
            patient.dob = dateService.getDateFromTimeStamp(patient.dob, patientDashboard.dateFormat,'/');
            patient.lastTransmissionDate = dateService.getDateFromTimeStamp(patient.lastTransmissionDate, patientDashboard.dateFormat,'/');
            $scope.patients.push({"patientUser": patient});
          });          
          $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] :$scope.patients.length; 
          $scope.pageCount = Math.ceil($scope.total / 10);
          searchOnLoad = false;
        });    
    };

    $scope.searchOnFilters = function(){    
      $scope.searchPatientsForHCP();
    };

    $scope.resendActivationLink = function(){
      if($scope.doctor && $scope.doctor.id){
        UserService.resendActivationLink($scope.doctor.id).then(function(response){
          notyService.showMessage(response.data.message, 'success');
          $scope.isDisableResendButton = true;
        }).catch(function(response){
          notyService.showError(response);
        });  
      }      
    };

    $scope.reActivateDoctor = function(){
      if($scope.doctor && $scope.doctor.id){
        UserService.reactivateUser($scope.doctor.id).then(function(response){
          notyService.showMessage(response.data.message, 'success');
          $state.go('hcpUser');
        }).catch(function(response){
          notyService.showError(response);
        });
      }
    };

    $scope.init();
  }]);
