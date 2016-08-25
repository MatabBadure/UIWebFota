angular.module('hillromvestApp')
.controller('clinicadminclinicController',['$scope', '$state', 'clinicadminService', 'notyService', '$stateParams', 'clinicService', 'UserService', 'StorageService', 'commonsUserService',
  function($scope, $state, clinicadminService, notyService, $stateParams, clinicService, UserService, StorageService, commonsUserService) {

  	$scope.init = function(){
      var currentRoute = $state.current.name;
      if (currentRoute === 'clinicadminclinicdashboard') {        
        $scope.clinicDashboardInit();
      }
	  clinicService.getClinicSpeciality().then(function(response){
         $scope.specialities =  response.data.typeCode;
      }).catch(function(response){});
  	};

    $scope.clinicDashboardInit = function(){
      var benchmarkingClinic = (StorageService.get('benchmarkingClinic') && StorageService.get('benchmarkingClinic').clinic) ? StorageService.get('benchmarkingClinic').clinic.id : null;
      $scope.stateParamclinicId = ($stateParams.clinicId) ? $stateParams.clinicId : (benchmarkingClinic ? benchmarkingClinic : null) ;      
      $scope.clinicStatus={'editMode' : true};
      $scope.getClinicsAssociatedToClinicadmin();
      $scope.getStates();
      $scope.getClinic($scope.stateParamclinicId);
    };

    $scope.getStates = function(){
      UserService.getState().then(function(response) {
        $scope.states = response.data.states;
      }).catch(function(response) {
        notyService.showError(response);
      });
    };

    $scope.getClinicsAssociatedToClinicadmin = function(){
      clinicadminService.getClinicsAssociated(StorageService.get('logged').userId).then(function(response){
        $scope.clinics = response.data.clinics;
        angular.forEach($scope.clinics, function(clinic){
          if(clinic.id === $scope.stateParamclinicId){
            $scope.selectedClinic =  clinic;
          }
        });
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.getClinic = function(clinicId){
      clinicService.getClinic(clinicId).then(function(response){
        $scope.clinic = response.data.clinic;
        $scope.clinic.zipcode = commonsUserService.formatZipcode($scope.clinic.zipcode);
        if($scope.clinic.parent){
          $scope.clinic.type = "parent";
        }else{
           $scope.clinic.type = "child";
        }
        if($scope.clinic.deleted){
          $scope.clinic.status = 'Inactive';
        }else{
          $scope.clinic.status = 'Active';
        }
      }).catch(function(response){
        notyService.showError(response);
      });
    };

  	$scope.editClinic = function(){
      if($scope.form.$invalid){
        return false;
      }
      var data = $scope.clinic;
      clinicService.updateClinic(data).then(function(response){
        $state.go('clinicadmindashboard');
      }).catch(function(response){
        notyService.showError(response);
      });
  	};

  	$scope.cancelEditClinic = function(){
  		$state.go('clinicadmindashboard');
  	};

    $scope.switchClinic = function(clinic){
      $state.go('clinicadminclinicdashboard', {'clinicId':clinic.id})
    };

    $scope.showUpdateClinicModal = function(){
      if($scope.form.$invalid){
        return false;
      }else {
        $scope.showModal = true;
      }
    };

  	$scope.init();

  }]);
