angular.module('hillromvestApp')
.controller('clinicadminHcpController',['$scope', '$state', '$stateParams', 'clinicService', 'DoctorService', 'UserService', 'searchFilterService', '$timeout', 'clinicadminService', 'clinicadminHcpService',
  function($scope, $state, $stateParams, clinicService, DoctorService, UserService, searchFilterService, $timeout, clinicadminService, clinicadminHcpService) {

    var searchOnLoad = true;
  	$scope.init = function(){
      var currentState = $state.current.name;
      if(currentState === 'clinicadminhcpdashboard'){
        $scope.searchItem = "";
        $scope.searchFilter = searchFilterService.initSearchFiltersForHCP($stateParams.filter);
        $scope.perPageCount = 10;
        $scope.getClinicsAssociatedToClinicadmin();
        $scope.initClinicadminHcpDashboard();
      }else if(currentState === 'clinicadminnewhcp'){
        $scope.doctorStatus = {};
        $scope.doctorStatus.isCreate = true;
      }else if(currentState === 'clinicadminhcpoverview'){
        $scope.hcpOverviewInit();
      }else if(currentState === 'clinicadminedithcp'){
        $scope.hcpEditInit();
      }
  	};

    $scope.initClinicadminHcpDashboard = function(){
      $scope.searchHcps();
    };

    $scope.hcpOverviewInit = function(){
      DoctorService.getDoctor($stateParams.hcpId).then(function(response){
        $scope.selectedHcp = response.data.user; 
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.hcpEditInit = function(){
      $scope.doctorStatus = {};
      $scope.doctorStatus.isCreate = false;
      $scope.doctorStatus.editMode = true;
    };

    $scope.searchHcps = function(track){ 
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
      clinicadminHcpService.searchAssociatedHcpsToClinic($scope.searchItem, filter, $scope.currentPageIndex, $scope.perPageCount, localStorage.getItem('userId'), clinicId).then(function(response){
        $scope.hcps = response.data;
        searchOnLoad = false;
      }).catch(function(response){
        notyService.showError(response);
      });  
    };

    $scope.selectHcp = function(hcp){
      $state.go('clinicadminhcpoverview',{'hcpId': hcp.id});
    };

    $scope.openEditDetail = function(hcp){
      $state.go('clinicadminedithcp', {'doctorId': hcp.id});
    };


    $scope.openDiassociateModal = function(){
      $scope.hcpDisassociateModal = true;
    };

    $scope.closeDiassociateModal = function(){
      $scope.hcpDisassociateModal = false;
    };

    $scope.disassociateHcp = function(hcp){
      $scope.hcpDisassociateModal = false;
      var data = [
      {
        "id": $stateParams.clinicId
      }
      ];
      clinicService.disassociateHCP($scope.selectedHcp.id, data).then(function (response) {
      }).catch(function (response) {
        notyService.showError(response);
      });
    };

    $scope.createHCP = function(){
      $state.go('clinicadminnewhcp');
    };

    var timer = false;
    $scope.$watch('searchItem', function() {
      $scope.searchItem = ($scope.searchItem != undefined) ? $scope.searchItem : stringConstants.emptyString ;
      if(!searchOnLoad){
      if (timer) {
        $timeout.cancel(timer)
      }
      timer = $timeout(function() {
        $scope.searchHcps();
      }, 1000)
     }
    });

    $scope.searchOnFilters = function(){
      $scope.searchHcps();
    };

    $scope.getClinicsAssociatedToClinicadmin = function(){
      clinicadminService.getClinicsAssociated(localStorage.getItem('userId')).then(function(response){
        $scope.clinics = response.data.clinics;
        angular.forEach($scope.clinics, function(clinic){
          if(clinic.id === $stateParams.clinicId){
            $scope.selectedClinic =  clinic;
          }
        });
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.switchClinic = function(clinic){
      $state.go('clinicadminhcpdashboard', {'clinicId':clinic.id});
    };

  	$scope.init();
  }]); 
