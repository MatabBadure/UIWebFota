'use strict';

angular.module('hillromvestApp')
  .controller('clinicsController', [ '$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'Auth','clinicService', 'UserService', 'notyService', 'searchFilterService', 'dateService', 'sortOptionsService', 'StorageService', 'loginConstants', 'commonsUserService', '$q', 'addressService',
    function ($rootScope, $scope, $state, $stateParams, $timeout, Auth,clinicService, UserService, notyService, searchFilterService, dateService,sortOptionsService, StorageService, loginConstants, commonsUserService, $q, addressService) {
    var searchOnLoad = true;
    $scope.clinic = {};
    $scope.clinicStatus = {
      'role':StorageService.get('logged').role,
      'editMode':false,
      'isCreate':false,
      'isMessage':false,
      'message': ''
    }
      $scope.clinicAdvancedFilter = {};
      $scope.genders = searchFilterService.processGenderOptions();
      $scope.yesNo = searchFilterService.processYesNoOptions();
      $scope.activeInactive = searchFilterService.processActiveInactiveOptions();
      $scope.clinicType = searchFilterService.processClinicTypeOptions();
      $scope.selectedStates  = {};
      $scope.localLang = searchFilterService.multiselectPropertiesForAdvancedFilters();
      $scope.clinicAdvancedFilter.clinicStatus = "All";
      $scope.isAdvancedFilters = false; 
      $scope.isZipcode = false;
      $scope.expandedSign = false;
      $scope.clinic.parentClinic = {};
      $scope.noParentName = false;
      $scope.linkHCPFlag = false;
    /*check the state from the route*/
    $scope.init = function() {
      var currentRoute = $state.current.name;
      if (currentRoute === 'clinicEdit' || currentRoute === 'clinicEditRcadmin') {
        $scope.initClinicEdit($stateParams.clinicId, $scope.setEditMode);
        //$scope.getClinicDetails($stateParams.clinicId, $scope.setEditMode);
      } else if (currentRoute === 'clinicNew' || currentRoute === 'clinicNewRcadmin') {
        $scope.initCreateClinic();
      } else if (currentRoute === 'clinicUser' || currentRoute === 'clinicUserRcadmin' || currentRoute === 'associateClinicUser' || currentRoute === 'customerserviceClinicUser'){
        $scope.sortClinicList = sortOptionsService.getSortOptionsForClinicList();
        $scope.initPaginationVars();
        $scope.searchFilter = searchFilterService.initSearchFiltersForClinic();
        $scope.initClinicAdvancedFilters();
        $scope.initClinicList();
        $scope.noDataFlag = false;
      } else if (currentRoute === 'clinicProfile' || currentRoute === 'clinicProfileRcadmin' || currentRoute === 'clinicProfileAssociate' || currentRoute === 'clinicProfileCustomerService'){
        $scope.initClinicProfile($stateParams.clinicId);
      } else if(currentRoute === 'clinicAssociatedPatients' || currentRoute === 'clinicAssociatedPatientsRcadmin' || currentRoute === 'clinicAssociatedPatientsAssociate' || currentRoute === 'clinicAssociatedPatientsCustomerService'){
        $scope.searchFilter = {}; 
        if($stateParams.filter){
              var filter = ($stateParams.filter).split("+"); 
              }
              else{
                var filter = "";
              }
        $scope.searchFilter = searchFilterService.initSearchFiltersForPatient(filter, true);
        $scope.initPaginationVars();
        $scope.initClinicAssoctPatients($stateParams.clinicId);
      } else if(currentRoute === 'clinicAssociatedHCP' || currentRoute === 'clinicAssociatedHCPRcadmin' || currentRoute === 'clinicAssociatedHCPAssociate' || currentRoute === 'clinicAssociatedHCPCustomerService'){
        $scope.linkHCPFlag = true;
        $scope.initClinicAssoctHCPs($stateParams.clinicId);
      }
      else if(currentRoute === 'clinicAdmin' || currentRoute === 'clinicAdminRcadmin' || currentRoute === 'clinicAdminAssociate' || currentRoute === 'clinicAdminCustomerService'){
        $scope.initClinicAdmin($stateParams.clinicId);
      }
    };

    $scope.getClinicById = function(clinicId){
      clinicService.getClinic(clinicId).then(function(response){
        $scope.clinic = response.data.clinic;
      }).catch(function(response){
        notyService.showError(response);
        if(response.status === 400){
          $scope.redirectToManageClinic();
        }
      });
    };

    $scope.initClinicAssoctPatients = function(clinicId){
      $scope.searchAssociatedPatients();      
      $scope.getClinicById(clinicId);
      $scope.getNonAssociatedPatients(clinicId);
    };

    $scope.getNonAssociatedPatients = function(clinicId){
      clinicService.getNonAssocaitedPatients(clinicId).then(function(response){
        $scope.nonAssociatedPatients = $scope.formatDataForTypehead(response.data.patientUsers);
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.getPatientsToAssociate = function($viewValue){
      return searchFilterService.getMatchingUserByNameEmailId($viewValue, $scope.nonAssociatedPatients);
    };

    $scope.searchAssociatedHcps = function(track) {
      if (track !== undefined) {
        if (track === "PREV" && $scope.currentPageIndex > 1) {
          $scope.currentPageIndex--;
        } else if (track === "NEXT" && $scope.currentPageIndex < $scope.pageCount) {
          $scope.currentPageIndex++;
        } else {
          return false;
        }
      }else {
        $scope.currentPageIndex = 1;
      }
      var filter = searchFilterService.getFilterStringForHCP($scope.searchFilter);
      $scope.perPageCount = 10;
      if(!$scope.searchItem){
        if($scope.linkHCPFlag){
          //var searchItem = window.encodeURIComponent("%%");
        $scope.searchItem =  window.encodeURIComponent("%%");
        }
        else{
          $scope.searchItem = '';
        }
        
      }
      clinicService.getAssociatedHCPstoClinic($stateParams.clinicId, $scope.searchItem, filter, sortConstant.lastName, $scope.currentPageIndex, $scope.perPageCount).then(function(response) {
        $scope.associatedHcps = response.data;
        $scope.total = response.headers()['x-total-count'];
        $scope.pageCount = Math.ceil($scope.total / 10);
        if ($scope.total == 0) {
          $scope.noMatchFound = true;
        } else {
          $scope.noMatchFound = false;
        }
        searchOnLoad = false;
      }).catch(function(response) {

      });
    };

    $scope.initClinicAssoctHCPs = function(clinicId){
      $scope.isAssociateHCP = false;
      $scope.searchFilter = searchFilterService.initSearchFiltersForClinic();
      var filter = searchFilterService.getFilterStringForHCP($scope.searchFilter);
      var searchString = window.encodeURIComponent("%%");
      $scope.currentPageIndex = 1;
      $q.all([
        clinicService.getAssociatedHCPstoClinic(clinicId, searchString, filter, sortConstant.lastName, $scope.currentPageIndex, 10),
        clinicService.getClinicAssoctHCPs(clinicId),
        clinicService.getHCPsWithClinicName(searchString)
      ]).then(function(response) {
        if(response){
          if(response[0]){
            $scope.total = response[0].headers()['x-total-count'];
            $scope.pageCount = Math.ceil($scope.total / 10);
            $scope.associatedHcps = response[0].data;    
          }

          if(response[1] && response[2]){
            $scope.hcps = response[2].data;
            var associatedHCPs = response[1].data.hcpUsers;
            var count = 0
            angular.forEach($scope.hcps, function(hcp, hcpKey){
              angular.forEach(hcp.clinics, function(clinic, clinicKey){
                hcp.clinicName = clinic.name;
                angular.forEach(associatedHCPs, function(associatedHcp, associatedHcpKey){
                  if(associatedHcp.id === hcp.id){
                    $scope.hcps.splice(hcpKey,1);
                  }
                });
              });
            });
          }
        }
      });
      $scope.getClinicById(clinicId);
    };

    $scope.getHCPsToLinkClinic = function($viewValue){
      return searchFilterService.getMatchingUser($viewValue, $scope.hcps, true);
    };

    $scope.initClinicList = function(){
      $scope.currentPageIndex = 1;
      $scope.perPageCount = 10;
      $scope.pageCount = 0;
      $scope.total = 0;
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
      clinicService.getClinicSpeciality().then(function(response){
         $scope.specialities =  response.data.typeCode;
      }).catch(function(response){});
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
      clinicService.getClinicSpeciality().then(function(response){
         $scope.specialities =  response.data.typeCode;
      }).catch(function(response){});
      UserService.getState().then(function(response) {
        $scope.states = response.data.states;
      }).catch(function(response) {});
      $scope.getParentClinic();
      clinicService.getClinic(clinicId).then(function(response) {
        $scope.clinic = response.data.clinic;
        $scope.clinic.zipcode = commonsUserService.formatZipcode($scope.clinic.zipcode);
        $scope.slectedClinic = response.data.clinic;
        if($scope.clinic.parent){
          $scope.clinic.type = "parent";
        }else{
           $scope.clinic.type = "child";
        }
      }).catch(function(response) {
        notyService.showError(response);
        if(response.status === 400){
          $scope.redirectToManageClinic();
        }
      });
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
      }).catch(function(response) {
        notyService.showError(response);
        if(response.status === 400){
          $scope.goToClinicUser();
        }
      });
    };

    $scope.getclinicAdmin = function(clinicId){
      clinicService.getClinicAdmins(clinicId).then(function(response){
        $scope.clinicAdmins = response.data.clinicAdmin
      }).catch(function(response){});
    };

    $scope.initClinicAdmin = function(clinicId) {
      $scope.allClinicAdmins = [];
      $scope.getClinicById(clinicId);
      $q.all([
        clinicService.getClinicAdmins(clinicId),
        clinicService.getAllClinicAdmins()
      ]).then(function(response) {
        if(response){
          if(response[0]){
            $scope.clinicAdmins = response[0].data.clinicAdmin;
          }
          if(response[1] && response[1].data.users){
            $scope.allClinicAdmins = response[1].data.users;
            for(var i = 0; i < $scope.allClinicAdmins.length; i++){
              for(var j = 0; j < $scope.clinicAdmins.length; j++){
                if($scope.allClinicAdmins[i] && $scope.allClinicAdmins[i].id === $scope.clinicAdmins[j].id){
                  $scope.allClinicAdmins.splice(i ,1);
                }
              }
            }
          }
        }
      }).catch(function(response){notyService.showError(response, 'warning');});
    };


    $scope.getClinicAdminstoLink = function($viewValue){
      return searchFilterService.getMatchingUser($viewValue, $scope.allClinicAdmins);
    };

    /* init clinic list*/

      $scope.searchClinicsOnQueryChange = function(){
        if(($state.current.name === 'clinicUser' || $state.current.name === 'clinicUserRcadmin' || $state.current.name === 'associateClinicUser' || $state.current.name === 'customerserviceClinicUser') && !searchOnLoad){
         $scope.isAdvancedFilters = false;
          $scope.searchClinics();
        }
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

        if($scope.isAdvancedFilters){
          $scope.advancedSearchClinics(false);
        }
        else{
         
        var filter = searchFilterService.getFilterStringForClinics($scope.searchFilter);
        clinicService.getClinics($scope.searchItem, $scope.clinicSortOption, $scope.currentPageIndex, $scope.perPageCount, filter).then(function (response) {
          $scope.clinics = {};
          $scope.clinics = response.data;
          $scope.total = response.headers()['x-total-count'];
          $scope.pageCount = Math.ceil($scope.total / 10);
          searchOnLoad = false;
          $scope.noDataFlag = false;
        }).catch(function (response) {

        });
      }
      };

      $scope.selectClinic = function(clinic) {
        if(clinic){
        localStorage.setItem('clinicname_',clinic.name);
        if(clinic.hillromId){
        localStorage.setItem('clinicHillRomID_',clinic.hillromId);
      }
      else{
        localStorage.setItem('clinicHillRomID_'," ");
      }
        }
        if($scope.clinicStatus.role === 'ADMIN')
        {
          $state.go('clinicDashboard', {
            'clinicId': clinic.id
          });
        }
        else if($scope.clinicStatus.role === loginConstants.role.acctservices){
          $state.go('clinicDashboardRcadmin', {
            'clinicId': clinic.id
          });
        }else if($scope.clinicStatus.role === loginConstants.role.associates){
          $state.go('clinicDashboardAssociate', {
            'clinicId': clinic.id
          });
        }else if($scope.clinicStatus.role === loginConstants.role.customerservices){
          $state.go('clinicDashboardCustomerService', {
            'clinicId': clinic.id
          });
        }
        else {
          $state.go('clinicProfile', {
            'clinicId': clinic.id
          });
        }
      };

      $scope.createClinic = function(){
        $scope.goToCinicNew();
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
      if($scope.clinic.type == 'child' && $scope.clinic.parentClinic.name == ""){
        return false;
      }
      else{
      $scope.submitted = true;
    }
    };

   /* $scope.formSubmit = function() {
            $scope.submitted = true;
    };*/
    $scope.formUpdate = function(){
    if($scope.form.$invalid){
      if($scope.clinic.type == 'child' && $scope.clinic.parentClinic.name == null){
        $scope.noParentName = true;
      }
        return false;
      }
      else{
        $scope.showUpdateModal = true;
      }

    };

    $scope.validateParentName = function(){
      $scope.clinic.parentClinic = {};
      $scope.clinic.parentClinic.name = null;
    };

    $scope.formSubmitClinic = function() {
      if ($scope.form.$invalid) {
        return false;
      }
      else{
        $scope.showUpdateModal = true;
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
      $scope.showUpdateModal = false;
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

$scope.activateClinicModal = function(clininc){
      $scope.clinicToDeactivate = clininc;
      $scope.showActivateModal = true;
    };
    
    $scope.closeModalClinic = function(){
      delete $scope.clinicToDeactivate;
      $scope.showModalClinic = false;
    };

    $scope.deactivateClinic = function(clinicId){
      $scope.closeModalClinic();
      clinicService.deleteClinic(clinicId).then(function(response){
        $scope.goToClinicUser();
        notyService.showMessage(response.data.message,'success');
      }).catch(function(response){
        if(response.data.message){
          notyService.showMessage(response.data.message,'warning');
        } else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR,'warning');
        }
      });
    };
    
    $scope.activateClinic = function(clinicId){
      $scope.closeModalClinic();
      var data = {};
      data.deleted = false;
      clinicService.activateClinic(data,clinicId).then(function(response){
        $scope.goToClinicUser();
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
          $scope.goToClinicUser();
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
        if($scope.clinicStatus.role === loginConstants.role.acctservices){
          $state.go('clinicProfileRcadmin', {
            'clinicId': $stateParams.clinicId
          });
        }else{
          $state.go('clinicProfile', {
            'clinicId': $stateParams.clinicId
          });
        }
      } else {
        $scope.goToClinicUser();
      }
    };

    $scope.reset = function(){
      $scope.clinicStatus.editMode = false;
      $scope.clinicStatus.isCreate = false;
      $scope.submitted = false;
      $scope.clinic = {};
      $scope.form.$setPristine();
      $scope.goToClinicUser();
    };

    $scope.selectClinicEdit = function(clinic) {
      $scope.clinic.parentClinic.name = clinic.name;
      $scope.clinic.parentClinic.id = clinic.id;
    };

    $scope.removeParent = function() {
      $scope.clinic.parentClinic = null;
    };

    $scope.getParentClinic = function() {
      clinicService.getAllClinics().then(function (response) {
        $scope.parentClinics = response.data;
        angular.forEach($scope.parentClinics, function(parentClinic, key){
          if(!parentClinic.city){
            parentClinic.city = "";
          }
          if(!parentClinic.state){
            parentClinic.state = "";
          }
        });
      }).catch(function (response) {});
    };

    $scope.createSatellite = function(parentId){
      $scope.goToCinicNew(parentId);
    };

    $scope.goToEditClinic = function(clinicId){
      if($scope.clinicStatus.role === loginConstants.role.acctservices){
        $state.go('clinicEditRcadmin', {
          'clinicId': clinicId
        });
      }else{
        $state.go('clinicEdit', {
          'clinicId': clinicId
        });
      }
    };

    $scope.switchTab = function(state){
      if($scope.clinicStatus.role === loginConstants.role.acctservices){
        $state.go(state+loginConstants.role.Rcadmin, {
          'clinicId': $stateParams.clinicId
        });
      }else if($scope.clinicStatus.role === loginConstants.role.associates){
        $state.go(state+'Associate', {
          'clinicId': $stateParams.clinicId
        });
      }else if($scope.clinicStatus.role === loginConstants.role.customerservices){
        $state.go(state+'CustomerService', {
          'clinicId': $stateParams.clinicId
        });
      }
      else{
        $state.go(state, {
          'clinicId': $stateParams.clinicId
        });
      }
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

    $scope.showAssociatePatientModal = function(patient){
      $scope.selectedPatient = patient;
      $scope.associatePatientModal = true;
    };

    $scope.selectPatient = function(){
      $scope.associatePatientModal = false;
      $scope.searchPatient = "";
      var data = [{'id': $stateParams.clinicId}];
      clinicService.associatePatient($scope.selectedPatient.id, data).then(function(response){
        $scope.initClinicAssoctPatients($stateParams.clinicId);
        $scope.isAssociatePatient = false;
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

    $scope.showAssociateHCPModal = function(hcp){
      $scope.associateHCPModal = true;
      $scope.selectedHcp = hcp;
    };

    $scope.selectHCP = function(){
      $scope.associateHCPModal = false;
      $scope.searchHcp = "";
      var data = [{'id': $scope.selectedHcp.id}];
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

    $scope.showAssociateClinicAdminModal = function(clinicAdmin){
      $scope.clinicAdmin = clinicAdmin;
      $scope.associateClinicAdminModal = true;

    };

    $scope.addCliniAdminToClinic = function(){
      var data = {
        "id": $scope.clinicAdmin.id
      };
      $scope.searchItem = '';
      clinicService.addClinicAdmin($stateParams.clinicId, data).then(function(response){
        $scope.initClinicAdmin($stateParams.clinicId);
        $scope.associateClinicAdminModal = false;
        notyService.showMessage(response.data.message, 'success');
        $scope.cancelClinicAdmin();
      }).catch(function(response){});
    };

    $scope.showDeleteModal = function(clinicAdmin){
      $scope.clinicAdmin = clinicAdmin;
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

    $scope.setEditClinicAdmin = function(clinicAdmin){
      $scope.clinicAdminEdit = true;
      $scope.newAdmin = clinicAdmin;
    };

    $scope.cancelClinicAdmin = function(){
      $scope.newAdmin = '';
      $scope.clinicAdminEdit = false;
      $scope.showAddclinicAdmin = false;
      if($scope.createClinicAdminForm.$dirty){
        $scope.getclinicAdmin($stateParams.clinicId);
      }
      $scope.addAdmin = '';
      $scope.resetClinicAdminForm();
    };

    $scope.resetClinicAdminForm =function(){
      $scope.submitted = false;
      $scope.createClinicAdminForm.$setPristine();
    };

    $scope.validateClinicName = function(){
      angular.forEach($scope.parentClinics, function(parentClinic){
       if(parentClinic.id === $scope.clinic.parentClinic.id){
        $scope.clinic.parentClinic.name = parentClinic.name;
       }         
      });
    };

    $scope.selectAssociatedPatient = function(patient){
     // localStorage.setItem('deviceType', patient.deviceType); 
      if(patient.deviceType == 'ALL'){
          localStorage.setItem('deviceType_'+patient.id, 'VEST');
          //localStorage.setItem('deviceTypeforGraph', 'ALL');
          localStorage.setItem('deviceTypeforBothIcon_'+patient.id, 'ALL');
            }
            else{
            localStorage.setItem('deviceType_'+patient.id, patient.deviceType);
           // localStorage.setItem('deviceTypeforGraph', patient.deviceType);
            localStorage.setItem('deviceTypeforBothIcon_'+patient.id, patient.deviceType);
          }
      if($state.current.name === 'clinicAssociatedPatients'){
        $state.go('patientOverview', {
          'patientId': patient.id
        });
      }else if($state.current.name ===  'clinicAssociatedPatientsAssociate'){
        $state.go('associatepatientOverview', {
          'patientId': patient.id
        });
      }else if($state.current.name ===  'clinicAssociatedPatientsCustomerService'){
        $state.go('customerservicepatientOverview', {
          'patientId': patient.id
        });
      }else if($state.current.name ===  'clinicAssociatedPatientsRcadmin'){
        $state.go('customerservicepatientOverview', {
          'patientId': patient.id
        });
      }
    };
    
    $scope.selectDoctor = function(doctor) {
      if($state.current.name === 'clinicAssociatedHCP'){
        $state.go('hcpProfile',{
          'doctorId': doctor.id
        });
      }
      else if($state.current.name === 'clinicAssociatedHCPAssociate'){
        $state.go('hcpProfileAssociates',{
          'doctorId': doctor.id
        });
      }else if($state.current.name === 'clinicAssociatedHCPCustomerService'){
        $state.go('hcpProfileCustomerService',{
          'doctorId': doctor.id
        });
      }
      else if($state.current.name === 'clinicAssociatedHCPRcadmin'){
        $state.go('hcpProfileRcadmin',{
          'doctorId': doctor.id
        });
      }
    };

    $scope.searchPatientsOnQueryChange = function(){
      if(($state.current.name === 'clinicAssociatedPatients' || $state.current.name === 'clinicAssociatedPatientsRcadmin' || $state.current.name === 'clinicAssociatedPatientsAssociate' || $state.current.name === 'clinicAssociatedPatientsCustomerService') && !searchOnLoad){
        $scope.searchAssociatedPatients();
      }
    };

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
      var filter = searchFilterService.getFilterStringForPatient($scope.searchFilter);
      clinicService.searchAssociatedPatientsToClinic($scope.searAssociatedPatient, filter, sortConstant.lastName, $scope.currentPageIndex, $scope.perPageCount, $stateParams.clinicId).then(function (response) {        
        $scope.associatedPatients = [];     
        if(response.data.length < 1){
          $scope.hasNoPatient = true;
        } else {
          $scope.hasNoPatient = false;
        } 
        angular.forEach(response.data, function(patientList, index){ 
        if(patientList.dob){   
          patientList.dob = dateService.getDateFromTimeStamp(patientList.dob, patientDashboard.dateFormat,'/');
          }
          else{
            patientList.dob = "";
          }
          patientList.lastTransmissionDate = (patientList.lastTransmissionDate) ? dateService.getDateFromYYYYMMDD(patientList.lastTransmissionDate, '/') : patientList.lastTransmissionDate;
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
      if($state.current.name === 'clinicUser' || $state.current.name ==='clinicUserRcadmin' || $state.current.name === 'associateClinicUser' || $state.current.name === 'customerserviceClinicUser'){
        $scope.searchClinics();
      }else if( $state.current.name === 'clinicAssociatedPatients' || $state.current.name === 'clinicAssociatedPatientsRcadmin' || $state.current.name === 'clinicAssociatedPatientsAssociate' || $state.current.name === 'clinicAssociatedPatientsCustomerService'){
        $scope.searchAssociatedPatients();
      }else if($state.current.name === 'clinicAssociatedHCP' || $state.current.name === 'clinicAssociatedHCPRcadmin' || $state.current.name ===  'clinicAssociatedHCPAssociate' || $state.current.name ===  'clinicAssociatedHCPCustomerService'){
        $scope.searchAssociatedHcps();
      }
    };

    $scope.formatDataForTypehead = function(patientUsers){
      angular.forEach(patientUsers, function(user){
        angular.forEach(user, function(value, key){
          if(!value){
            user[key] = "";
          }
        });   
      });
      return patientUsers;
    };

    $scope.goToClinicUser = function(){
      if($scope.clinicStatus.role === loginConstants.role.acctservices){
        $state.go('clinicUserRcadmin');
      }else if($scope.clinicStatus.role === loginConstants.role.customerservices){
        $state.go('customerserviceClinicUser');
      }else{
        $state.go('clinicUser');
      }
    };

    $scope.goToCinicNew = function(parentId){
      if($scope.clinicStatus.role === loginConstants.role.acctservices){
          $state.go('clinicNewRcadmin', {'parentId': parentId});
        }else{
          $state.go('clinicNew', {'parentId': parentId});
        }
    };

    $scope.redirectToManageClinic = function(){
      if(StorageService.get('logged').role === 'ADMIN'){
        $state.go('clinicUser');
      }else if(StorageService.get('logged').role === 'ACCT_SERVICES'){
        $state.go('clinicUserRcadmin');
      }
    };

    $scope.showUpdateClinicAdminModal = function(){
      $scope.submitted = true;
      if($scope.createClinicAdminForm.$invalid){
        return false;
      }else{
        $scope.updateClinicModal = true;
      }
    };

    $scope.getCityState = function(zipcode){
      delete $scope.serviceError;
      $scope.isServiceError = false;
      if(zipcode){
        addressService.getCityStateByZip(zipcode).then(function(response){
          $scope.clinic.city = response.data[0].city;
          $scope.clinic.state = response.data[0].state;
        }).catch(function(response){
          $scope.clinic.state = null;
          $scope.clinic.city = null;
          $scope.serviceError = response.data.ERROR;
          $scope.isServiceError = true;
        });
      }else{
        delete $scope.clinic.city;
        delete $scope.clinic.state;
        if($scope.form.zip.$dirty && $scope.form.zip.$showValidationMessage && $scope.form.zip.$invalid){
        }else{
          $scope.serviceError = 'Invalid Zipcode';
          $scope.isServiceError = true;
        }
      }
    };

    $scope.clearMessages = function(){
      if($scope.clinic.zipcode){
        delete $scope.serviceError;
      }
    };
    //Implementation of GIMP-2
        $scope.toggleHeaderAccount = function(){
      $( "#collapseTwo" ).slideToggle( "slow" );
      //$scope.expandedSign = ($scope.expandedSign === "+") ? "-" : "+"; 
      $scope.expandedSign = ($scope.expandedSign === true) ? false : true;  
      if($scope.expandedSign === true){
       // $scope.searchItem = ""; 
        /*$scope.isAdvancedFilters = true;*/
       $("#searchListParam").attr("disabled", true);
       $("#searchListParam").css("background-color", 'rgb(235, 235, 228)'); 
     // $scope.initPaginationVars();
      }
      else{
         
       $("#searchListParam").attr("disabled", false);
       $("#searchListParam").css("background-color", 'inherit'); 
      }     
    }

    $scope.initClinicAdvancedFilters = function(){
       $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
       $("#city-dropdown").css("pointer-events","none");
      $("#state-dropdown").css("background-color", 'inherit');
       $("#state-dropdown").css("pointer-events","all");
       $("#country-dropdown").css("background-color", 'inherit');
       $("#country-dropdown").css("pointer-events","all");
      $scope.isZipcode = false;
      $scope.clinicAdvancedFilter = {};
      $scope.clinicAdvancedFilter.clinicName = "";
      $scope.clinicAdvancedFilter.clinicType = "";
      $scope.clinicAdvancedFilter.clinicSpecialty = "";
      $scope.selectedCountry = [];
      $scope.selectedCountryObj = 'US';
      $scope.selectedStates = [];
      $scope.selectedCities = [];
      $scope.clinicAdvancedFilter.country = ['US'];
      $scope.clinicAdvancedFilter.state = [];
      $scope.clinicAdvancedFilter.city = [];
      $scope.clinicAdvancedFilter.zipcode = "";
      $scope.clinicAdvancedFilter.adherenceWindowSelected = "";
      $scope.clinicAdvancedFilter.clinicStatus = "All";
      $scope.countries = searchFilterService.processCountries();
      $scope.getAdherenceScoreSettingDays();
     /* $("#country-dropdown").css("background-color",'#eeeeee');
      $("#country-dropdown").css("pointer-events","none");*/
      clinicService.getClinicSpeciality().then(function(response){
         $scope.specialities =  response.data.typeCode;
      }).catch(function(response){});
      $scope.countries = searchFilterService.processCountries();
      addressService.getAllStatesAdv($scope.clinicAdvancedFilter.country).then(function(response){
        $scope.rawStates = response.data;
        $scope.states = searchFilterService.processStates($scope.rawStates);
        $scope.cities = searchFilterService.processCities();
      }).catch(function(response){
        notyService.showError(response);
      });
    }

        $scope.getCityStateforAdvancedFilters = function(zipcode){ 
          $scope.isZipcode = true; 
          delete $scope.serviceError;
          $scope.isServiceError = false;
          if(zipcode){
            addressService.getCityStateByZip(zipcode).then(function(response){
              $scope.mapZipcode(response.data);
            }).catch(function(response){
              $scope.serviceError = response.data.ERROR;
              $scope.isServiceError = true;
               $scope.isZipcode = false; 
            });  
          }else{
            $scope.form = {};
            $scope.form.zip = {};
            $scope.isZipcode = false; 
            $scope.selectedStates = [];
            $scope.selectedCities = [];
            $scope.states = searchFilterService.processStates($scope.rawStates);
            $scope.cities = searchFilterService.processCities();
            $scope.clinicAdvancedFilter.city = [];
            $scope.clinicAdvancedFilter.state = [];
            $scope.clinicAdvancedFilter.country = [];
            $scope.countries = searchFilterService.processCountries();
            $("#country-dropdown").css("background-color", 'inherit');
            $("#country-dropdown").css("pointer-events","all");
            $("#state-dropdown").css("background-color", 'inherit');
            $("#state-dropdown").css("pointer-events","all");
            $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
            $("#city-dropdown").css("pointer-events","none");
            if($scope.form.zip.$dirty && $scope.form.zip.$showValidationMessage && $scope.form.zip.$invalid){
            }else{
              $scope.serviceError = '';  
              $scope.isServiceError = true;
            }
          }
        };
      $scope.onCloseCountry = function(){
          if($scope.selectedCountry.length > 0){
          var selectedCountry = [];
          $scope.states = [];
          $scope.cities = [];
          $scope.clinicAdvancedFilter.country = [];
          $scope.clinicAdvancedFilter.city = [];
          $scope.clinicAdvancedFilter.state = [];
          //push selected country in $scope.patientadvancedFilters.country angular.foreach etc
          
          //pass the country to the service and call API like in line no.323

          angular.forEach($scope.selectedCountry, function(country){
            $scope.clinicAdvancedFilter.country.push(country.name);
          });

          addressService.getAllStatesAdv($scope.clinicAdvancedFilter.country).then(function(response){
          if(!$scope.isZipcode){
          $("#state-dropdown").css("background-color", 'inherit');
          $("#state-dropdown").css("pointer-events","all");
          }
           $scope.rawStates = response.data;
           $scope.states = searchFilterService.processStates($scope.rawStates);
          }).catch(function(){

          }); 
          //states pushing
          //call cities api  
          /*angular.forEach($scope.selectedStates, function(state){
            $scope.clinicAdvancedFilter.state.push(state.name);
          });  */   
         /* addressService.getCitybyStateAdv($scope.patientAdvancedFilters.country,$scope.patientAdvancedFilters.state).then(function(response){
          if(!$scope.isZipcode){
          $("#city-dropdown").css("background-color", 'inherit');
          $("#city-dropdown").css("pointer-events","all");
          }
           $scope.cities = response.data;
          }).catch(function(){
          });*/
          }
          else{
          delete $scope.state;
          $scope.states = searchFilterService.processStates();
          delete $scope.city;
         // $scope.state = Object.keys($scope.rawStates).join();
          $scope.cities = searchFilterService.processCities();
          $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#city-dropdown").css("pointer-events","none");
          $("#state-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#state-dropdown").css("pointer-events","none");
          $scope.clinicAdvancedFilter.city = [];
          $scope.clinicAdvancedFilter.state = [];

          }
          };
     $scope.onCloseState = function(){
         if($scope.selectedStates.length > 0){
          var selectedStates = [];
          $scope.cities = [];
          $scope.clinicAdvancedFilter.city = [];
          $scope.clinicAdvancedFilter.state = [];
          angular.forEach($scope.selectedStates, function(state){
            $scope.clinicAdvancedFilter.state.push(state.name);
          });

         addressService.getCitybyStateAdv($scope.clinicAdvancedFilter.country,$scope.clinicAdvancedFilter.state).then(function(response){
          if(!$scope.isZipcode){
          $("#city-dropdown").css("background-color", 'inherit');
          $("#city-dropdown").css("pointer-events","all");
        }
           $scope.cities = response.data;
           angular.forEach($scope.cities, function(cityObj){
          cityObj.name  = unescape(escape(cityObj.name));
        });
          }).catch(function(){

          });

        }else{
          delete $scope.city;
          $scope.state = Object.keys($scope.rawStates).join();
          $scope.cities = searchFilterService.processCities();
          $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#city-dropdown").css("pointer-events","none");
          $scope.clinicAdvancedFilter.city = [];
          $scope.clinicAdvancedFilter.state = [];
      }
    };

   $scope.onCitiesClose = function(){
      if($scope.selectedCities.length > 0 ){
        $scope.clinicAdvancedFilter.city = [];
        var cities = [];
        angular.forEach($scope.selectedCities, function(city){
          cities.push(city.name);
          $scope.clinicAdvancedFilter.city.push(city.name);
        });
      }else{
        $scope.clinicAdvancedFilter.city = [];
      }
    };
      $scope.clearMessages = function(){
          if($scope.clinicAdvancedFilter.zipcode){
            delete $scope.serviceError;
          }
        };
   $scope.mapZipcode = function(responseData){
      if(responseData.length>0){
      $scope.selectedStates = [];
       $scope.isZipcode = true; 
       $scope.states = [];
       $scope.cities = [];
       $scope.selectedCities = [];
       $scope.selectedStates = [];
       $scope.selectedCountry = [];

       $scope.clinicAdvancedFilter.country = [];
       $scope.clinicAdvancedFilter.state = [];
       $scope.clinicAdvancedFilter.city = [];
            }

            $scope.states.push({
              'name':responseData[0].state,
              'ticked':true
            });
            $scope.cities.push({
              'name':responseData[0].city,
              'ticked':true
            }); 
            $scope.selectedStates.push({
              'name':responseData[0].state,
              'ticked':true
            });
            $scope.selectedCities.push({
              'name':responseData[0].city,
              'ticked':true
            });

           $scope.clinicAdvancedFilter.state.push(responseData[0].state);
          // $scope.clinicAdvancedFilter.city.push(responseData[0].city);
          angular.forEach(responseData, function(cityState){
            angular.forEach($scope.countries, function(country){
            if(cityState.country === country.name){
              country.ticked = true;
              $scope.selectedCountry.push(country);
              $scope.clinicAdvancedFilter.country.push(country.name);
            }
            else{
              country.ticked = false;
            }
          });
          });

          $("#country-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#country-dropdown").css("pointer-events","none");
          $("#state-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#state-dropdown").css("pointer-events","none");
          $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#city-dropdown").css("pointer-events","none");
    };

    $scope.resetAdvancedFilters = function(){
      $scope.initClinicAdvancedFilters();
    }
     $scope.getAdherenceScoreSettingDays = function(){
     clinicService.getAdherenceScoreDays().then(function(response){
              $scope.adherenceDays =  response.data.typeCode;
          }).catch(function(response){
          
          });
    };
   /* $scope.validateParentName = function() {
      $scope.clinic.parentClinic.name = "";
    };*/

    $scope.advancedSearchClinics = function(isFresh){
      if(isFresh){
         $scope.searchItem = ""; 
        $scope.currentPageIndex = 1;
      $scope.perPageCount = 10;
      $scope.pageCount = 0;
      $scope.total = 0;
      }
      $scope.isAdvancedFilters = true;
      if($scope.clinicAdvancedFilter.zipcode){
         $scope.clinicAdvancedFilter.zipcode = $scope.clinicAdvancedFilter.zipcode.replace(' ','');
        //do nothing
      }
      else{
        $scope.clinicAdvancedFilter.zipcode = "";
      }
      $scope.clinicAdvancedFilter.city = [];
      angular.forEach($scope.selectedCities, function(city){
            $scope.clinicAdvancedFilter.city.push(city.name);
          });
/*      for(var i=0;i<$scope.selectedCities.length;i++){
        $scope.clinicAdvancedFilter.city.push($scope.selectedCities[i].name);
      }*/
      
      clinicService.getclinicsByAdvancedFilter($scope.clinicAdvancedFilter,$scope.clinicSortOption, $scope.currentPageIndex, $scope.perPageCount).then(function(response){
       $scope.clinics = {};
        $scope.clinics = response.data;
         $scope.total = response.headers()['x-total-count'];
        $scope.pageCount = Math.ceil($scope.total / 10);
        $scope.noDataFlag = true;
        }).catch(function(response){
          
          });
    }
    $scope.lastRadio = function(value,lastRadio){
      if(value.name === lastRadio){
        return 'advanced-filters-radio-last'
      }
      else return "";
    };
    //End of Implementation of GIMP-2
    $scope.init();
  }]);