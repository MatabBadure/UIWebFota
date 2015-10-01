'use strict';

angular.module('hillromvestApp')
  .controller('DoctorsController',['$rootScope', '$scope', '$state', '$timeout', 'Auth', '$stateParams', 'UserService', 'DoctorService', 'notyService', 'clinicService', 'searchFilterService', 'dateService',
    function($rootScope, $scope, $state, $timeout, Auth,$stateParams, UserService, DoctorService, notyService, clinicService,searchFilterService, dateService ) {
    $scope.doctor = {};
    $scope.doctorStatus = {
      'role': localStorage.getItem('role'),
      'editMode': false,
      'isCreate': false,
      'isMessage': false,
      'message': ''
    };
    var searchOnLoad = true;

    $scope.init = function(){
      var currentRoute = $state.current.name;
      if (currentRoute === 'hcpProfile') {
        $scope.currentPageIndex = 1;
        $scope.perPageCount = 10;
        $scope.pageCount = 0;
        $scope.total = 0;        
        $scope.sortOption ="";
        $scope.searchItem = "";
        $scope.searchFilter = searchFilterService.initSearchFiltersForPatient();
        $scope.searchPatientsForHCP();
        $scope.getDoctorDetails($stateParams.doctorId, $scope.setEditMode);        
      } else if (currentRoute === 'hcpNew') {
        $scope.createDoctor();
      } else if(currentRoute === 'associatedClinic'){
        $scope.getAvailableclinics($stateParams.doctorId);       
        $scope.getDoctorById($stateParams.doctorId);
      }
    };

    $scope.getDoctorById = function(doctorId){
      var url = '/api/user/' + doctorId + '/hcp';
      UserService.getUser(doctorId, url).then(function(response) {
        $scope.doctor = response.data.user;
      }).catch(function(response) {
        if(response.data.message){
          notyService.showMessage(response.data.message,'warning');
        } else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR,'warning');
        }
      });
    };

    $scope.selectedDoctor = function(doctor) {
      $scope.doctorStatus.editMode = true;
      $scope.doctorStatus.isCreate = false;
      $scope.doctor = doctor;
    };

    $scope.getDoctorDetails = function(doctorId,callback){
      //$scope.getPatientsAssociatedToHCP(doctorId, null);
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
      $scope.searchPatientsForHCP();
    };

    $scope.getClinicsOfHCP = function(doctorId){
      DoctorService.getClinicsAssociatedToHCP(doctorId).then(function(response) {
        $scope.clinicsOfHCP =  response.data.clinics;
        $scope.clinicList = [{"clinicId": "", "name": "ALL"}];
        $scope.sortOption = $scope.clinicList[0].clinicId;
        if($scope.clinicsOfHCP){
          angular.forEach($scope.clinicsOfHCP, function(clinic){
            $scope.clinicList.push({"clinicId": clinic.id, "name": clinic.name});
          });
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

    $scope.selectClinicFromHCP = function(clinic){
      $scope.searchItem = "";
      var data = [{'id': $stateParams.doctorId}];
      clinicService.associateHcp(clinic.id, data).then(function(response){
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

    $scope.linkClinic = function(){
      $scope.associateClinicSearch = true;
    };
    
    $scope.getAvailableclinics = function(doctorId){
      $scope.clinicsAssociatedErrMsg = null;
      $scope.clinics = []; 
      clinicService.getAllActiveClinics().then(function(response){
        if(response.data)
        $scope.clinics = response.data;
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
              if($scope.clinicsOfHCP[i].id === $scope.clinics[j].id){
                $scope.clinics.splice(j,1);
              }
            }
          }          
          $scope.clinicList = [{"clinicId": 0, "name": "ALL"}];
          $scope.sortOption = $scope.clinicList[0].clinicId;
          if($scope.clinicsOfHCP){
            angular.forEach($scope.clinicsOfHCP, function(clinic){
              $scope.clinicList.push({"clinicId": clinic.id, "name": clinic.name});
            });
          }                    
        });              
      });      
    };

    $scope.selectPatient = function(patient) {
      $state.go('patientOverview', {
        'patientId': patient.id
      });
    };

    $scope.selectClinic = function(clinic) {
       $state.go('clinicProfile', {
        'clinicId': clinic.id
      });
    };

    var timer = false;
    $scope.$watch('searchItem', function () {
      if($state.current.name === 'hcpProfile' && !searchOnLoad){
      if(timer){
        $timeout.cancel(timer)
      }
      timer= $timeout(function () {
          $scope.searchPatientsForHCP();
      },1000)
     }
    });

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
        DoctorService.searchPatientsForHCPOrCliniadmin($scope.searchItem, 'hcp' ,$stateParams.doctorId, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount, filter).then(function (response) {
          $scope.patients = [];
          angular.forEach(response.data, function(patient){
            patient.dob = dateService.getDateFromTimeStamp(patient.dob, patientDashboard.dateFormat,'/');
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

    $scope.init();
  }]);
