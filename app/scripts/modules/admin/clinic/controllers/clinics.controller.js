'use strict';

angular.module('hillromvestApp')
  .controller('clinicsController', [ '$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'Auth', 'clinicService', 'UserService', 'notyService', 'searchFilterService', 'dateService', 'sortOptionsService', 'StorageService',
    function ($rootScope, $scope, $state, $stateParams, $timeout, Auth, clinicService, UserService, notyService, searchFilterService, dateService,sortOptionsService, StorageService) {
    var searchOnLoad = true;
    $scope.clinic = {};
    $scope.clinicStatus = {
      'role':StorageService.get('logged').role,
      'editMode':false,
      'isCreate':false,
      'isMessage':false,
      'message': ''
    }
    /*check the state from the route*/
    $scope.init = function() {
      var currentRoute = $state.current.name;
      if (currentRoute === 'clinicEdit') {
        $scope.initClinicEdit($stateParams.clinicId, $scope.setEditMode);
        //$scope.getClinicDetails($stateParams.clinicId, $scope.setEditMode);
      } else if (currentRoute === 'clinicNew') {
        $scope.initCreateClinic();
      } else if (currentRoute === 'clinicUser'){
        $scope.sortClinicList = sortOptionsService.getSortOptionsForClinicList();
        $scope.initPaginationVars();
        $scope.searchFilter = searchFilterService.initSearchFiltersForClinic();
        $scope.initClinicList();
      } else if (currentRoute === 'clinicProfile'){
        $scope.initClinicProfile($stateParams.clinicId);
      } else if(currentRoute === 'clinicAssociatedPatients'){
        $scope.searchFilter = {};    
        $scope.searchFilter = searchFilterService.initSearchFiltersForPatient();
        $scope.initPaginationVars();
        $scope.initClinicAssoctPatients($stateParams.clinicId);
      } else if(currentRoute === 'clinicAssociatedHCP'){
        $scope.initClinicAssoctHCPs($stateParams.clinicId);
      }
      else if(currentRoute === 'clinicAdmin'){
        $scope.initClinicAdmin($stateParams.clinicId);
      }
    };

    $scope.getClinicById = function(clinicId){
      clinicService.getClinic(clinicId).then(function(response){
        $scope.clinic = response.data.clinic;
      }).catch(function(response){});
    };

    $scope.initClinicAssoctPatients = function(clinicId){
      $scope.searchAssociatedPatients();      
      $scope.getClinicById(clinicId);
      $scope.getNonAssociatedPatients(clinicId);
    };

    $scope.getNonAssociatedPatients = function(clinicId){
      clinicService.getNonAssocaitedPatients(clinicId).then(function(response){
        $scope.nonAssociatedPatients = response.data.patientUsers;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.initClinicAssoctHCPs = function(clinicId){
      $scope.isAssociateHCP = false;
      clinicService.getClinicAssoctHCPs(clinicId).then(function(response){
        $scope.associatedHcps = response.data.hcpUsers;
        clinicService.getHCPsWithClinicName().then(function(response){
          $scope.hcps = response.data;
          angular.forEach($scope.hcps, function(hcp, hcpKey){
            angular.forEach(hcp.clinics, function(clinic, clinicKey){
              hcp.clinicName = clinic.name;
              angular.forEach($scope.associatedHcps, function(associatedHcp, associatedHcpKey){
                if(associatedHcp.id === hcp.id){
                  $scope.hcps.splice(hcpKey,1);
                }
              });
            });
          });
        }).catch(function(response){
          notyService.showError(response);
        });
      }).catch(function(response){
        notyService.showError(response);
      });
      $scope.getClinicById(clinicId);
    };

    $scope.initClinicList = function(){
      $scope.currentPageIndex = 1;
      $scope.perPageCount = "";
      $scope.pageCount = 0;
      $scope.total = 0;
      $scope.clinics = [];
      $scope.sortOption ="";
      $scope.showModal = false;
      $scope.clinicSortOption = "";
      $scope.sortIconDefault = true;
      $scope.sortIconUp = false;
      $scope.sortIconDown = false;
      $scope.searchClinics();
    };

    $scope.initCreateClinic = function(){
      $scope.states = [];
      $scope.clinic = {};
      $scope.clinic.type = 'parent';
      $scope.clinicStatus.editMode = false;
      $scope.clinicStatus.isCreate = true;
      UserService.getState().then(function(response) {
        $scope.states = response.data.states;
      }).catch(function(response) {});
      if($stateParams.parentId){
        $scope.clinicStatus.createSatellite = true;
        $scope.clinic.type = "child";
        clinicService.getClinic($stateParams.parentId).then(function(response) {
        $scope.clinic.parentClinic = response.data.clinic;
      }).catch(function(response) {});
      }else{
        $scope.getParentClinic();
      }
    };

    $scope.initClinicEdit = function(clinicId){
      $scope.states = [];
      $scope.clinicStatus.editMode = true;
      $scope.clinicStatus.isCreate = false;
      UserService.getState().then(function(response) {
        $scope.states = response.data.states;
      }).catch(function(response) {});
      $scope.getParentClinic();
      clinicService.getClinic(clinicId).then(function(response) {
        $scope.clinic = response.data.clinic;
        $scope.slectedClinic = response.data.clinic;
        if($scope.clinic.parent){
          $scope.clinic.type = "parent";
        }else{
           $scope.clinic.type = "child";
        }
      }).catch(function(response) {});
    };

    $scope.initClinicProfile = function(clinicId){
      $scope.states = [];
      $scope.clinicStatus.editMode = true;
      $scope.clinicStatus.isCreate = false;
      clinicService.getClinic(clinicId).then(function(response) {
        $scope.clinic = response.data.clinic;
        $scope.childClinics = response.data.childClinics;
        if($scope.clinic.parent){
          $scope.clinic.type = "parent";
        }else{
           $scope.clinic.type = "child";
        }
        if($scope.clinic.deleted){
          $scope.clinic.status = "Inactive";
        }else{
          $scope.clinic.status = "Active";
        }
        /*if(){

        }*/
      }).catch(function(response) {});
    };

    $scope.getclinicAdmin = function(clinicId){
      clinicService.getClinicAdmins(clinicId).then(function(response){
        $scope.clinicAdmin = response.data.clinicAdmin
      }).catch(function(response){});
    };

    $scope.initClinicAdmin = function(clinicId) {
      $scope.getClinicById(clinicId);
      $scope.getclinicAdmin(clinicId);
      clinicService.getAllClinicAdmins().then(function(response){
        $scope.allClinicAdmins = response.data.users
      }).catch(function(response){});
    }

    /* init clinic list*/

      var timer = false;
      $scope.$watch('searchItem', function () {
        if($state.current.name === 'clinicUser' && !searchOnLoad){
        if(timer){
          $timeout.cancel(timer)
        }
        timer= $timeout(function () {
            $scope.searchClinics();
        },1000)
       }
      });

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
        var filter = searchFilterService.getFilterStringForClinics($scope.searchFilter);
        clinicService.getClinics($scope.searchItem, $scope.clinicSortOption, $scope.currentPageIndex, $scope.perPageCount, filter).then(function (response) {
          $scope.clinics = response.data;
          $scope.total = response.headers()['x-total-count'];
          $scope.pageCount = Math.ceil($scope.total / 10);
          searchOnLoad = false;
        }).catch(function (response) {

        });
      };

      $scope.selectClinic = function(clinic) {
         $state.go('clinicProfile', {
          'clinicId': clinic.id
        });
      };

      $scope.createClinic = function(){
          $state.go('clinicNew');
      };
    /* init clinic list*/

    /* edit clinic */
    $scope.open = function () {
      $scope.showModal = true;
    };

    $scope.close = function () {
      $scope.showModal = false;
    };

    $scope.newChildClinic = function() {
      $scope.clinic.childClinics.push({
        name: ''
      });
    };

    $scope.removeChildClinic = function(idx) {
      $scope.clinic.childClinics.splice(idx, 1);
    };

    $scope.submitted = false;
    $scope.formSubmit = function() {
      $scope.submitted = true;
    };

    $scope.formSubmitClinic = function() {
      if ($scope.form.$invalid) {
        return false;
      }
      if ($scope.clinic.type === 'parent') {
        $scope.clinic.parent = true;
      } else {
        $scope.clinic.parent = false;
      }
      if ($scope.clinicStatus.editMode) {
        var data = $scope.clinic;
        if (data.parentClinic) {
          var id = data.parentClinic.id;
          var name = data.parentClinic.name;
          delete data.parentClinic;
          data.parentClinic ={};
          data.parentClinic.id = id;
          $scope.clinic.parentClinic.name = name;
        }
        $scope.editClinic(data);
      } else {
        if ($scope.clinic.type === 'parent' && $scope.clinic.parentClinic) {
          delete $scope.clinic.parentClinic;
        }
        $scope.newClinic($scope.clinic);
      }
    };

    $scope.editClinic = function(clinic){
      clinicService.updateClinic(clinic).then(function(data) {
        $scope.clinicStatus.isMessage = true;
        $scope.clinicStatus.message = "Clinic updated successfully";
        notyService.showMessage($scope.clinicStatus.message, 'success');
        $scope.selectClinic(clinic);
      }).catch(function(response) {
        if (response.data.message !== undefined) {
          $scope.clinicStatus.message = response.data.message;
        } else if(response.data.ERROR !== undefined){
          $scope.clinicStatus.message = response.data.ERROR;
        } else {
          $scope.clinicStatus.message = 'Error occurred! Please try again';
        }
        $scope.clinicStatus.isMessage = true;
        notyService.showMessage($scope.clinicStatus.message, 'warning');
      });
    };

    $scope.deactivateClinicModal = function(clininc){
      $scope.clinicToDeactivate = clininc;
      $scope.showModalClinic = true;
    };

    $scope.closeModalClinic = function(){
      delete $scope.clinicToDeactivate;
      $scope.showModalClinic = false;
    };

    $scope.deactivateClinic = function(clinicId){
      $scope.closeModalClinic();
      clinicService.deleteClinic(clinicId).then(function(response){
        $state.go('clinicUser');
        notyService.showMessage(response.data.message,'success');
      }).catch(function(response){
        if(response.data.message){
          notyService.showMessage(response.data.message,'warning');
        } else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR,'warning');
        }
      });
    };

    $scope.newClinic = function(clinic){
      clinicService.createClinic(clinic).then(function(data) {
        $scope.clinicStatus.isMessage = true;
        $scope.clinicStatus.message = "Clinic created successfully";
        notyService.showMessage($scope.clinicStatus.message, 'success');
        if($scope.clinicStatus.createSatellite){
          $scope.selectClinic(data.data.Clinic.parentClinic);
        }else if($scope.clinicStatus.isCreate){
          $state.go('clinicUser');
        }
      }).catch(function(response) {
        if (response.data.message !== undefined) {
          $scope.clinicStatus.message = response.data.message;
        } else if(response.data.ERROR !== undefined) {
          $scope.clinicStatus.message = response.data.ERROR;
        } else {
          $scope.clinicStatus.message = 'Error occured! Please try again';
        }
        $scope.clinicStatus.isMessage = true;
        notyService.showMessage($scope.clinicStatus.message, 'warning');
      });
    };

    $scope.deleteClinic = function() {
      clinicService.deleteClinic($scope.clinic.id).then(function(data) {
        $scope.showModal = false;
        $scope.clinicStatus.isMessage = true;
        $scope.clinicStatus.message = data.data.message;
        notyService.showMessage($scope.clinicStatus.message, 'success');
        $scope.reset();
      }).catch(function(response) {
         $scope.showModal = false;
        if (response.data.message !== undefined) {
          $scope.clinicStatus.message = response.data.message;
        } else if(response.data.ERROR !== undefined){
          $scope.clinicStatus.message = response.data.ERROR;
        } else {
          $scope.clinicStatus.message = 'Error occured! Please try again';
        }
        $scope.clinicStatus.isMessage = true;
        notyService.showMessage($scope.clinicStatus.message, 'warning');
      });
    };

    $scope.cancel = function(){
      if($stateParams.clinicId){
        $state.go('clinicProfile', {
          'clinicId': $stateParams.clinicId
        });
      } else {
        $state.go('clinicUser');
      }
    };

    $scope.reset = function(){
      $scope.clinicStatus.editMode = false;
      $scope.clinicStatus.isCreate = false;
      $scope.submitted = false;
      $scope.clinic = {};
      $scope.form.$setPristine();
      $state.go('clinicUser');
    };

    $scope.selectClinicEdit = function(clinic) {
      $scope.clinic.parentClinic.name = clinic.name;
      $scope.clinic.parentClinic.id = clinic.id;
      $scope.clinics = [];
    };

    $scope.removeParent = function() {
      $scope.clinic.parentClinic = null;
    };

    $scope.getParentClinic = function() {
      clinicService.getAllClinics().then(function (response) {
        $scope.parentClinics = response.data;
      }).catch(function (response) {});
    };

    $scope.createSatellite = function(parentId){
      $state.go('clinicNew', {
        'parentId': parentId
      });
    };

    $scope.goToEditClinic = function(clinicId){
      $state.go('clinicEdit', {
        'clinicId': clinicId
      });
    };

    $scope.switchTab = function(state){
      $state.go(state, {
        'clinicId': $stateParams.clinicId
      });
    };

    $scope.disassociatePatient = function(patientId){
      $scope.hasNoPatient = false;
      $scope.closePatientDeactivateModal();
      var data = [{'id': $stateParams.clinicId}];
      clinicService.disassociatePatient(patientId, data).then(function(response){
        $scope.initClinicAssoctPatients($stateParams.clinicId);
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        notyService.showMessage(response.data.message, 'warning');
      });
    };

    $scope.openPatientDeactivateModal = function(patientId){
      $scope.deletePatientId = patientId;
      $scope.patientDeactivateModal = true;

    };

    $scope.closePatientDeactivateModal = function(){
      $scope.patientDeactivateModal = false;
    };

    $scope.closeHcpDeactivateModal = function(){
      $scope.hcpDeactivateModal = false;
    };

    $scope.openHcpDeactivateModal = function(hcpId){
      $scope.deleteHcpId = hcpId
      $scope.hcpDeactivateModal = true;
    };

    $scope.linkPatient = function(){
      $scope.isAssociatePatient = true;
    };

    $scope.linkHCP = function(){
      $scope.isAssociateHCP = true;
    };

    $scope.selectPatient = function(patient, index){
      $scope.searchPatient = "";
      var data = [{'id': $stateParams.clinicId}];
      clinicService.associatePatient(patient.id, data).then(function(response){
        $scope.initClinicAssoctPatients($stateParams.clinicId);
        notyService.showMessage(response.data.message, 'success');
        $scope.getNonAssociatedPatients($stateParams.clinicId);
      }).catch(function(response){
        notyService.showMessage(response.data.message, 'warning');
      });
    };

    $scope.disassociateHCP = function(hcpId){
      $scope.closeHcpDeactivateModal();
      var data = [{'id': $stateParams.clinicId}];
      clinicService.disassociateHCP(hcpId, data).then(function(response){
        $scope.initClinicAssoctHCPs($stateParams.clinicId);
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        notyService.showMessage(response.data.message, 'warning');
      });
    };

    $scope.selectHCP = function(hcp, index){
      $scope.searchHcp = "";
      var data = [{'id': hcp.id}];
      clinicService.associateHcp($stateParams.clinicId, data).then(function(response){
        $scope.initClinicAssoctHCPs($stateParams.clinicId);
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        notyService.showMessage(response.data.message, 'warning');
      });
    };

    $scope.sortType = function(sortParam){
      var toggledSortOptions = {};
      $scope.clinicSortOption = "";
      if(sortParam === sortConstant.clinicName){                        
        toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortClinicList.clinicName);
        $scope.sortClinicList = sortOptionsService.getSortOptionsForClinicList();
        $scope.sortClinicList.clinicName = toggledSortOptions;
        $scope.clinicSortOption = sortConstant.name + sortOptionsService.getSortByASCString(toggledSortOptions);
        $scope.searchClinics();
      }else if(sortParam === sortConstant.address){
        toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortClinicList.address);
        $scope.sortClinicList = sortOptionsService.getSortOptionsForClinicList();
        $scope.sortClinicList.address = toggledSortOptions;
        $scope.clinicSortOption = sortConstant.address + sortOptionsService.getSortByASCString(toggledSortOptions);
        $scope.searchClinics();
      }else if(sortParam === sortConstant.city){
        toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortClinicList.city);
        $scope.sortClinicList = sortOptionsService.getSortOptionsForClinicList();
        $scope.sortClinicList.city = toggledSortOptions;
        $scope.clinicSortOption = sortConstant.city + sortOptionsService.getSortByASCString(toggledSortOptions);
        $scope.searchClinics();
      }else if(sortParam === sortConstant.state){
        toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortClinicList.state);
        $scope.sortClinicList = sortOptionsService.getSortOptionsForClinicList();
        $scope.sortClinicList.state = toggledSortOptions;
        $scope.clinicSortOption = sortConstant.state + sortOptionsService.getSortByASCString(toggledSortOptions);
        $scope.searchClinics();
      }else if(sortParam === sortConstant.phoneNumber){
        toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortClinicList.phoneNumber);
        $scope.sortClinicList = sortOptionsService.getSortOptionsForClinicList();
        $scope.sortClinicList.phoneNumber = toggledSortOptions;
        $scope.clinicSortOption = sortConstant.phoneNumber + sortOptionsService.getSortByASCString(toggledSortOptions);
        $scope.searchClinics();
      }else if(sortParam === sortConstant.type){
        toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortClinicList.type);
        $scope.sortClinicList = sortOptionsService.getSortOptionsForClinicList();
        $scope.sortClinicList.type = toggledSortOptions;
        $scope.clinicSortOption = sortConstant.parent + sortOptionsService.getSortByASCString(toggledSortOptions);
        $scope.searchClinics();
      }else if(sortParam === sortConstant.hillromId){
        toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortClinicList.hillromId);
        $scope.sortClinicList = sortOptionsService.getSortOptionsForClinicList();
        $scope.sortClinicList.hillromId = toggledSortOptions;
        $scope.clinicSortOption = sortConstant.hillromId + sortOptionsService.getSortByASCString(toggledSortOptions);
        $scope.searchClinics();
      }else if(sortParam === sortConstant.status){
        toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortClinicList.status);
        $scope.sortClinicList = sortOptionsService.getSortOptionsForClinicList();
        $scope.sortClinicList.status = toggledSortOptions;
        $scope.clinicSortOption = sortConstant.deleted + sortOptionsService.getSortByASCString(toggledSortOptions);
        $scope.searchClinics();
      }          
          
    };

    $scope.addClinicAdminShow = function(){
      $scope.showAddclinicAdmin = true;
    };

    $scope.addCliniAdminToClinic = function(clinicAdmin){
      var data = {
        "id": clinicAdmin.id
      };
      $scope.searchItem = '';
      clinicService.addClinicAdmin($stateParams.clinicId, data).then(function(response){
        $scope.getclinicAdmin($stateParams.clinicId);
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){});
    };

    $scope.showDeleteModal = function(){
      $scope.showModalClincAdmin = true;
    };

    $scope.cancelModelClinicAdmin = function(){
      $scope.showModalClincAdmin = false;
    };

    $scope.deletClinicAdmin =  function(){
      $scope.cancelModelClinicAdmin();
      var data = {
        "id": $scope.clinicAdmin.id
      };
      clinicService.disassociateClinicAdmmin($stateParams.clinicId, data).then(function(response){        
        $scope.initClinicAdmin($stateParams.clinicId);
        $scope.showAddclinicAdmin = false;
        $scope.addAdmin = '';
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        if(response.data.message){
          notyService.showMessage(response.data.message, 'warning');
        }else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR, 'warning');
        }
      });
    };

    $scope.submitClinicAdmin = function(){
      $scope.submitted = true;
      if($scope.createClinicAdminForm.$invalid){
        return false;
      }
      var data = $scope.newAdmin;
      data.role = 'CLINIC_ADMIN';
      data.clinicList = [{
        'id': $stateParams.clinicId
      }];
      if($scope.clinicAdminEdit){
        $scope.editClinicAdmin(data);
      } else {
        $scope.createClinicAdmin(data);
      }      
    };

    $scope.createClinicAdmin = function(data){
      UserService.createUser(data).then(function(response){
        $scope.getclinicAdmin($stateParams.clinicId);
        $scope.cancelClinicAdmin();
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        if(response.data.message){
          notyService.showMessage(response.data.message, 'warning');
        }else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR, 'warning');
        }
      });
    };

    $scope.editClinicAdmin = function(data){
      UserService.editUser(data).then(function(response){
        $scope.getclinicAdmin($stateParams.clinicId);
        $scope.cancelClinicAdmin();
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        if(response.data.message){
          notyService.showMessage(response.data.message, 'warning');
        }else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR, 'warning');
        }
      });
    };

    $scope.setEditClinicAdmin = function(){
      $scope.clinicAdminEdit = true;
      $scope.newAdmin = $scope.clinicAdmin;
    };

    $scope.cancelClinicAdmin = function(){
      $scope.newAdmin = '';
      $scope.clinicAdminEdit = false;
      $scope.showAddclinicAdmin = false;
      $scope.submitted = false;
    };

    $scope.validateClinicName = function(){
      angular.forEach($scope.parentClinics, function(parentClinic){
       if(parentClinic.id === $scope.clinic.parentClinic.id){
        $scope.clinic.parentClinic.name = parentClinic.name;
       }         
      });
    };

    $scope.selectAssociatedPatient = function(patient){
      $state.go('patientOverview', {
        'patientId': patient.id
      });
    };
    
    $scope.selectDoctor = function(doctor) {
      $state.go('hcpProfile',{
        'doctorId': doctor.id
      });
    };

    $scope.$watch('searAssociatedPatient', function () {
      if($state.current.name === 'clinicAssociatedPatients' && !searchOnLoad){
      if(timer){
        $timeout.cancel(timer)
      }
      timer= $timeout(function () {
          $scope.searchAssociatedPatients();
      },1000)
     }
    });

    $scope.searchAssociatedPatients = function (track) {
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
      var filter = searchFilterService.getFilterStringForPatient($scope.searchFilter) + $scope.sortOption; 
      clinicService.searchAssociatedPatientsToClinic($scope.searAssociatedPatient, filter, $scope.currentPageIndex, $scope.perPageCount, $stateParams.clinicId).then(function (response) {        
        $scope.associatedPatients = [];     
        if(response.data.length < 1){
          $scope.hasNoPatient = true;
        } else {
          $scope.hasNoPatient = false;
        } 
        angular.forEach(response.data, function(patientList, index){
          patientList.dob = dateService.getDateFromTimeStamp(patientList.dob, patientDashboard.dateFormat,'/');
          $scope.associatedPatients.push({"patient": patientList});         
          $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] :  response.data.length;
          $scope.pageCount = Math.ceil($scope.total / 10);
        });     
        searchOnLoad = false;
      }).catch(function (response) {

      });
    };

    $scope.initPaginationVars = function(){
      $scope.currentPageIndex = 1;
      $scope.perPageCount = 10;
      $scope.pageCount = 0;
      $scope.total = 0;        
      $scope.sortOption ="";
      $scope.searchItem = "";
      $scope.searAssociatedPatient = ""; 
      $scope.clinicSortOption = "";     
    };

    $scope.searchOnFilters = function(){    
      if($state.current.name === 'clinicUser'){
        $scope.searchClinics();
      }else if( $state.current.name === 'clinicAssociatedPatients'){
        $scope.searchAssociatedPatients();
      }
    };
    $scope.init();
  }]);