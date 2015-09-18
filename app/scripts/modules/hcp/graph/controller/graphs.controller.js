'use strict';

angular.module('hillromvestApp')
.controller('hcpGraphController',[ '$scope', '$state', 'hcpDashBoardService', 'dateService', 'graphUtil', '$stateParams', function($scope, $state, hcpDashBoardService, dateService, graphUtil, $stateParams) {
    var chart;
    $scope.init = function() {
    	$scope.selectedGraph = 'CUMULATIVE';
      $scope.treatmentGraph = false;
      $scope.cumulativeGraph = true;
      $scope.format = 'weekly';
      $scope.selectedDateOption = 'WEEK';
      $scope.toTimeStamp = new Date().getTime();
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(7);
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp);
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp);
      $scope.weeklyChart();
    }; 

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
    
    $scope.calculateDateFromPicker = function(picker) {
      $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();
      $scope.toTimeStamp = new Date(picker.endDate._d).getTime();
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp);
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp);
      if ($scope.fromDate === $scope.toDate ) {
        $scope.fromTimeStamp = $scope.toTimeStamp;
      }
    };

    $scope.removeGraph = function() {
      d3.selectAll('svg').selectAll("*").remove();
    }

    
    $scope.drawGraph = function() {
    var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
		if(days <= 7 && days > 0) {
        $scope.weeklyChart($scope.fromTimeStamp);
      } else if ( days > 7 && days <= 32 ) {
        $scope.monthlyChart($scope.fromTimeStamp);
      } else if ( days > 32) {
         $scope.yearlyChart($scope.fromTimeStamp);
      }
    };



    $scope.dates = {startDate: null, endDate: null};

    $scope.showCumulativeGraph = function() {
      $scope.selectedGraph = 'CUMULATIVE';
      $scope.treatmentGraph = false;
      $scope.cumulativeGraph = true;
      $scope.getCumulativeGraphData();
    };

    $scope.getCumulativeGraphData = function() {
    	 hcpDashBoardService.getCumulativeGraphPoints($scope.hcpId, $scope.fromTimeStamp, $scope.toTimeStamp, $scope.groupBy).then(function(response){
        	//$scope.cumulativeGraphData = response.data;
          //$scope.yAxisRangeForCompliance = graphUtil.getYaxisRangeComplianceGraph($scope.completeComplianceData);
      }).catch(function(response) {
      });
      /* mocked data starts */
      $scope.serverCumulativeGraphData = cumulativeGraphData;
      $scope.formatedCumulativeGraphData = graphUtil.convertIntoCumulativeGraph($scope.serverCumulativeGraphData); 
      console.log("cumulative Graph Data:" + JSON.stringify($scope.formatedCumulativeGraphData));
      $scope.drawCumulativeGraph();
      /* mocked data ends */      
      
    }

    $scope.drawCumulativeGraph = function() {
    	
	    nv.addGraph(function() {
	    var chart = nv.models.lineChart()
	                  .x(function(d) { return d[0] })
	                  .y(function(d) { return d[1] }) 
	                  .color(d3.scale.category10().range())
                    .tooltipContent(function(key, x, y, e, graph) {
        return '<h3>' + key + ' Custom Text Here ' + x + '</h3> here' + '<p> or here ,' + y + '</p>'
    })
	                  .useInteractiveGuideline(true)
	                  ;
          chart.xAxis.showMaxMin = true;
          chart.xAxis.staggerLabels = true,
          chart.yAxis.axisLabel('No. of patients')
	        chart.xAxis.tickFormat(function(d) {
            if(d % 1 === 0){
              var timeStamp = $scope.serverCumulativeGraphData[d-1].timeStamp;
              switch($scope.format) {
                case "weekly":
                    return d3.time.format('%A')(new Date(timeStamp));
                    break;
                case "monthly":
                    return 'week ' + dateService.getWeekOfMonth(timeStamp);
                    break;
                case "yearly":
                    return d3.time.format('%B')(new Date(timeStamp));
                    break;
                default:
                    break;
              }
            }
	          });
          chart.tooltipContent($scope.toolTipContentFunction);
	    	chart.yAxis
	    		.tickFormat(function(d) {  
              return d;
            });

	    	d3.select('#cumulativeGraph svg')
	        .datum($scope.formatedCumulativeGraphData)
	        .call(chart);
	    	nv.utils.windowResize(chart.update);

	    return chart;
	  });
    }


    $scope.getTreatmentGraphData = function() {
       hcpDashBoardService.getTreatmentGraphPoints($scope.hcpId, $scope.fromTimeStamp, $scope.toTimeStamp, $scope.groupBy).then(function(response){

      }).catch(function(response) {
      });
      /* mocked data starts */
      $scope.serverTreatmentGraphData = treatmentGraphData;
      $scope.formatedTreatmentGraphData = graphUtil.convertIntoTreatmentGraph($scope.serverTreatmentGraphData); 
      console.log("Treatment Graph Data:" + JSON.stringify($scope.formatedTreatmentGraphData));
      $scope.drawTreatmentGraph();
      /* mocked data ends */      
    }

    $scope.calculateTimeDuration = function(durationInDays) {
      $scope.toTimeStamp = new Date().getTime();
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp);
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp);
    };

    $scope.chooseGraph = function() {
    	if($scope.cumulativeGraph) {
        $scope.getCumulativeGraphData();
      } else if ($scope.treatmentGraph) {
        $scope.getTreatmentGraphData();
      }
    }

    // Weekly chart
    $scope.weeklyChart = function(datePicker) {
      $scope.selectedDateOption = 'WEEK';
      $scope.removeGraph();
      if(datePicker === undefined){
        $scope.calculateTimeDuration(7);
      }
      $scope.format = $scope.groupBy = 'weekly';
      $scope.chooseGraph();
    };

    // Yearly chart
    $scope.yearlyChart = function(datePicker) {
      $scope.selectedDateOption = 'YEAR';
      $scope.removeGraph();
       if(datePicker === undefined){
        $scope.calculateTimeDuration(365);
      }
      $scope.format = $scope.groupBy = 'yearly';
      $scope.chooseGraph();
    };
   
    // Monthly chart
    $scope.monthlyChart = function(datePicker) {
      $scope.selectedDateOption = 'MONTH';
      $scope.removeGraph();
      if(datePicker === undefined){
        $scope.calculateTimeDuration(30);
      }
      $scope.format = $scope.groupBy = 'monthly';
      $scope.chooseGraph();
    };
    //hmrDayChartG330

    $scope.showTreatmentGraph = function() {
      $scope.selectedGraph = 'TREATMENT';
      $scope.treatmentGraph = true;
      $scope.cumulativeGraph = false;
      if($scope.fromTimeStamp === $scope.toTimeStamp){
        $scope.calculateTimeDuration(7);
      }
      $scope.getTreatmentGraphData();
  	};

  $scope.createComplianceGraphData = function() {
    delete $scope.complianceGraphData ;
    $scope.complianceGraphData = [];
    var count = 0;
    $scope.compliance.secondaryYaxis = '';
    $scope.compliance.primaryYaxis = '';
    angular.forEach($scope.completecomplianceGraphData, function(value) {
      if(value.key.indexOf("pressure") >= 0 && $scope.compliance.pressure === true){
        value.yAxis = ++count;
        value.color = 'rgb(255, 127, 14)';
        if(count === 1){
          $scope.yAxis1Max = $scope.yAxisRangeForCompliance.maxPressure;
          $scope.compliance.primaryYaxis = 'pressure';
        } else if(count === 2){
          $scope.yAxis2Max = $scope.yAxisRangeForCompliance.maxPressure;
          $scope.compliance.secondaryYaxis = 'pressure';
        }
        $scope.complianceGraphData.push(value);
      }
      if(value.key.indexOf("duration") >= 0 && $scope.compliance.duration === true){
        value.yAxis = ++count;
        value.color = 'rgb(31, 119, 180)';
        if(count === 1){
          $scope.yAxis1Max = $scope.yAxisRangeForCompliance.maxDuration;
          $scope.compliance.primaryYaxis = 'duration';
        } else if(count === 2){
          $scope.yAxis2Max = $scope.yAxisRangeForCompliance.maxDuration;
          $scope.compliance.secondaryYaxis = 'duration';
        }
        $scope.complianceGraphData.push(value);
      }
      if(value.key.indexOf("frequency") >= 0  && $scope.compliance.frequency === true){
        value.yAxis = ++count;
        value.color = 'rgb(55, 163, 180)';
        if(count === 1){
          $scope.yAxis1Max = $scope.yAxisRangeForCompliance.maxFrequency;
          $scope.compliance.primaryYaxis = 'frequency';
        } else if(count === 2){
          $scope.yAxis2Max = $scope.yAxisRangeForCompliance.maxFrequency;
          $scope.compliance.secondaryYaxis = 'frequency';
        }
        $scope.complianceGraphData.push(value);
      }
    });
    if( $scope.compliance.frequency === false && $scope.compliance.duration === false && $scope.compliance.pressure === false){
      $scope.yAxis1Max = 0;
      $scope.yAxis2Max = 0;
    }
  };

  $scope.drawTreatmentGraph = function() {
    d3.select('#treatmentGraph svg').selectAll("*").remove();
      nv.addGraph(function() {
      var chart = nv.models.multiChart()
      .margin({top: 30, right: 100, bottom: 50, left: 100})
      .color(d3.scale.category10().range());
     // chart.noData("Nothing to see here.");
      //chart.tooltipContent($scope.toolTipContentForCompliance($scope.completeComplianceData.actual));
      //this function to put x-axis labels
      chart.xAxis.tickFormat(function(d) {
          if(d % 1 === 0) {
            var timeStamp = $scope.serverTreatmentGraphData[d-1].timeStamp;
            switch($scope.format) {
                case "weekly":
                    return d3.time.format('%A')(new Date(timeStamp));
                    break;
                case "monthly":
                    return 'week ' + dateService.getWeekOfMonth(timeStamp);
                    break;
                case "yearly":
                    return d3.time.format('%B')(new Date(timeStamp));
                    break;
                default:
                    break;
            }
          }
        });
      chart.yAxis1.tickFormat(d3.format('d'));
      chart.yAxis2.tickFormat(d3.format('d'));
        d3.select('#treatmentGraph svg')
      .datum($scope.formatedTreatmentGraphData)
      .transition().duration(500).call(chart);
      return chart;
    });
  }

  $scope.init();
  $scope.gotoPatients = function(value){
    $state.go('hcppatientdashboard');
  };

}]);
