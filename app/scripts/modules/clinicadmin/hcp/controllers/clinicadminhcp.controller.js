angular.module('hillromvestApp')
.controller('clinicadminHcpController',['$scope', '$state', '$stateParams', 'clinicService', 'DoctorService', 'UserService',
  function($scope, $state, $stateParams, clinicService, DoctorService, UserService) {

  	$scope.init = function(){
      var currentState = $state.current.name;
  		console.log('Init is Working...!', currentState);
      if(currentState === 'clinicadminhcpdashboard'){
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
      $scope.getHcps();
    };

    $scope.hcpOverviewInit = function(){
      console.log('hcpOverviewInit', $stateParams.hcpId)
      DoctorService.getDoctor($stateParams.hcpId).then(function(response){
        $scope.selectedHcp = response.data.user; 
      }).catch(function(response){});
    };

    $scope.hcpEditInit = function(){
      $scope.doctorStatus = {};
      $scope.doctorStatus.isCreate = false;
      $scope.doctorStatus.editMode = true;
    };

    $scope.getHcps = function(){
      clinicService.getClinicAssoctHCPs(localStorage.getItem('clinicId')).then(function(response){
        console.log('RESPONSE: ', response);
        $scope.hcps = response.data.hcpUsers;
      }).catch(function(response){
        console.log('ERROR: ', response);
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
      console.log($scope.selectedHcp);
      $scope.hcpDisassociateModal = false;
      console.log('TODO Integrate REST API...');
      UserService.deleteUser($scope.selectedHcp.id).then(function (response) {
        console.log('SUCCESS', RESPONSE);
      }).catch(function (response) {
        console.log('ERROR', response);
      });
    };

    $scope.createHCP = function(){
      $state.go('clinicadminnewhcp');
    };




  	$scope.init();
  }]); 
