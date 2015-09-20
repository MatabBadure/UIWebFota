angular.module('hillromvestApp')
.controller('hcpGraphController',['$scope', '$state', 'hcpDashboardService', 'DoctorService', function($scope, $state, hcpDashboardService, DoctorService){

//---HCP PieChart JS =============
  $scope.init = function(){
    DoctorService.getClinicsAssociatedToHCP(localStorage.getItem('userId')).then(function(response){
      localStorage.setItem('clinicId', response.data.clinics[0].id);
      $scope.clinics = response.data.clinics;
      $scope.selectedClinic = response.data.clinics[0];
      $scope.getStatistics($scope.selectedClinic.id, localStorage.getItem('userId'));
    }).catch(function(response){
      $scope.showWarning(response);
    });
  };

  $scope.getStatistics = function(clinicId, userId){
    hcpDashboardService.getStatistics(clinicId, userId).then(function(response){
      $scope.statistics = response.data.statitics;
    }).catch(function(response){
      $scope.showWarning(response);
    });
  };

  $scope.showWarning = function(response){
    if(response.data.ERROR){
      notyService.showMessage(response.data.ERROR, 'warning');
    }else if(response.data.message){
      notyService.showMessage(response.data.message, 'warning');  
    }
  };

  $scope.switchClinic = function(clinic){
    if($scope.selectedClinic.id !== clinic.id){
      $scope.selectedClinic = clinic;
      $scope.getStatistics($scope.selectedClinic.id, localStorage.getItem('userId'));
    }
  };

	//Todo For Donut Graph and Main Graph
	$scope.missedtherapy = {
        animate:{
            duration:3000,
            enabled:true
        },
        barColor:'#69be7f',
        trackColor: '#ccc',
        scaleColor: false,
        lineWidth:12,
        lineCap:'circle'
    };
    $scope.hmr = {
        animate:{
            duration:3000,
            enabled:true
        },
        barColor:'#f7a462',
        trackColor: '#ccc',
        scaleColor: false,
        lineWidth:12,
        lineCap:'circle'
    };
  $scope.deviation = {
          animate:{
              duration:3000,
              enabled:true
          },
          barColor:'#5da0cc',
          trackColor: '#ccc',
          scaleColor: false,
          lineWidth:12,
          lineCap:'circle'
      };
$scope.noevent = {
          animate:{
              duration:3000,
              enabled:true
          },
          barColor:'#e28181',
          trackColor: '#ccc',
          scaleColor: false,
          lineWidth:12,
          lineCap:'circle'
      };
//---HCP PieChart JS =============

/*Dtate picker js*/
$scope.opts = {
      eventHandlers: {'apply.daterangepicker': function(ev, picker) {
        $scope.calculateDateFromPicker(picker);
        $scope.drawGraph();
        $scope.selectedDateOption = '';
        }
      },
      opens: 'left'
    }
/*Dtate picker js END*/

  $scope.goToPatientDashboard = function(value){
    if(value === 'hcppatientdashboard'){
      $state.go(value, {'clinicId': $scope.selectedClinic.id});
    }else{
      $state.go(value);
    }
  };

  $scope.gotoPatients = function(value){
    $state.go('hcppatientdashboard',{'filter':value, 'clinicId':$scope.selectedClinic.id});
  };

  $scope.init();
}]);