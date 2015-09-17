angular.module('hillromvestApp')
.controller('hcpGraphController',['$scope', '$state', 'hcpDashboardService', 'DoctorService', function($scope, $state, hcpDashboardService, DoctorService){

//---HCP PieChart JS =============
  $scope.init = function(){
    DoctorService.getClinicsAssociatedToHCP(localStorage.getItem('userId')).then(function(response){
      localStorage.setItem('clinicId', response.data.clinics[0].id);
      hcpDashboardService.getStatistics(response.data.clinics[0].id, localStorage.getItem('userId')).then(function(response){
        $scope.statistics = response.data.statitics;
      }).catch(function(response){
        console.log('ERROR1 :',response);
      });
    }).catch(function(response){
      console.log('ERROR :', response);
    });
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
    $state.go(value);
  };

  $scope.gotoPatients = function(value){
    $state.go('hcppatientdashboard',{'filter':value});
  };

  $scope.init();
}]);