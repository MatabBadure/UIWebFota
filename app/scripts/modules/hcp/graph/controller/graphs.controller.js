angular.module('hillromvestApp')
.controller('hcpGraphController',['$scope', function($scope) {

//---HCP PieChart JS =============
	$scope.missedtherapyDays = 25;
	$scope.hmrRunRate = 65;
	$scope.deviationDays = 49;
	$scope.noeventDays = 76;
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
}]);