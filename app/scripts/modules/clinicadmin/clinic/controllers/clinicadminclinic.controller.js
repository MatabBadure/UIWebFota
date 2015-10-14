angular.module('hillromvestApp')
.controller('clinicadminclinicController',['$scope', '$state', 'clinicadminService', 'notyService', '$stateParams', 'clinicService', 'UserService',
  function($scope, $state, clinicadminService, notyService, $stateParams, clinicService, UserService) {

  	$scope.init = function(){
      var currentRoute = $state.current.name;
      if (currentRoute === 'clinicadminclinicdashboard') {
        $scope.clinicDashboardInit();
      }
  	};

    $scope.clinicDashboardInit = function(){
      $scope.clinicStatus={'editMode' : true};
      $scope.getClinicsAssociatedToClinicadmin();
      $scope.getStates();
      $scope.getClinic($stateParams.clinicId);
    };

    $scope.getStates = function(){
      UserService.getState().then(function(response) {
        $scope.states = response.data.states;
      }).catch(function(response) {
        notyService.showError(response);
      });
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

    $scope.getClinic = function(clinicId){
      clinicService.getClinic(clinicId).then(function(response){
        $scope.clinic = response.data.clinic;
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
      if($scope.clinic.status === 'Active'){
        $scope.clinic.deleted = false;
      }else if($scope.clinic.status === 'Inactive'){
        $scope.clinic.deleted = true;
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

  	$scope.init();

  }]);
