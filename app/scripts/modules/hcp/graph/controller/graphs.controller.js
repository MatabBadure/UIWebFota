'use strict';

angular.module('hillromvestApp')
<<<<<<< HEAD
.controller('hcpGraphController', function($scope, $state, patientDashBoardService, StorageService, dateService, graphUtil, patientService, UserService, $stateParams, notyService, $timeout) {
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

    $scope.hmrLineSetMinMax = function() {
      var values = [];
      values.push($scope.yAxisRangeForHMRLine.min);
      values.push($scope.yAxisRangeForHMRLine.max);
      return values;
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

    $scope.opts = {
      eventHandlers: {'apply.daterangepicker': function(ev, picker) {
        $scope.calculateDateFromPicker(picker);
        $scope.drawGraph();
        $scope.selectedDateOption = '';
        }
      },
      opens: 'left'
    }

  $scope.dates = {startDate: null, endDate: null};
    
    $scope.getHmrRunRateAndScore = function() {
      patientDashBoardService.getHMRrunAndScoreRate($scope.patientId, $scope.toTimeStamp).then(function(response){
        if(response.status === 200 ){
          $scope.hmrRunRate = response.data.hmrRunRate;
          $scope.adherenceScore = response.data.score;
        }
      }).catch(function(response) {
      });
    }

    $scope.xAxisTickFormatFunction = function(format){
      return function(d){
        switch(format) {
          case "weekly":
              return d3.time.format('%A')(new Date(d));
              break;
          case "dayWise":
              return dateService.getTimeIntervalFromTimeStamp(d);
              break;
          case "monthly":
              return 'week ' + dateService.getWeekOfMonth(d);
              break;
          case "yearly":
              return d3.time.format('%B')(new Date(d));
              break;
          default:
              break;
        }
    }
  };

    $scope.toolTipContentFunction = function(){
      return function(key, x, y, e, graph) {
        var toolTip = '';
        angular.forEach($scope.completeGraphData.actual, function(value) {
          if(value.timestamp === e.point[0]){
              toolTip =
                '<h6>' + dateService.getDateFromTimeStamp(value.timestamp) + '</h6>' +
                '<ul class="graph_ul">' +
                  '<li><span class="pull-left">' + 'Treatment/Day ' +'</span><span class="pull-right value">' + value.treatmentsPerDay +'</span></li>' +
                  '<li><span class="pull-left">' + 'Frequency' + '</span><span class="pull-right value">' + value.weightedAvgFrequency  + '</span></li>' +
                  '<li><span class="pull-left">' + 'Pressure' +'</span><span class="pull-right value">' + value.weightedAvgPressure  +'</span></li>' +
                  '<li><span class="pull-left">' + 'Cough Pauses' +'</span><span class="pull-right value">' + value.normalCoughPauses +'</span></li>' +
                '</ul>';
          }
        });
      return toolTip;   
      }
    };

    $scope.toolTipContentBarChart = function(){
      return function(key, x, y, e, graph) {
        var toolTip = '';
        angular.forEach($scope.completeGraphData, function(value) {
          if(value.startTime === e.point[0] && value.hmr !== 0 ){
              toolTip =
                '<h6>' + dateService.getDateFromTimeStamp(value.startTime) + '</h6>' +
                '<ul class="graph_ul">' +
                  '<li><span class="pull-left">' + 'Frequency' + '</span><span class="pull-right value">' + value.frequency  + '</span></li>' +
                  '<li><span class="pull-left">' + 'Pressure' +'</span><span class="pull-right value">' + value.pressure +'</span></li>' +
                  '<li><span class="pull-left">' + 'Cough Pauses' +'</span><span class="pull-right value">' + (value.normalCaughPauses + value.programmedCaughPauses) +'</span></li>' +
                '</ul>';
          }
        });
      return toolTip;   
      }
    };

    $scope.toolTipContentForCompliance = function(data){
      return function(key, x, y, e, graph) {
        var toolTip = '';
        angular.forEach(data, function(value) {
          if(value.start === e.point.timeStamp){
              toolTip =
                '<h6>' + dateService.getDateFromTimeStamp(value.start) + '</h6>' +
                '<ul class="graph_ul">' +
                  '<li><span class="pull-left">' + 'Treatment/Day' + '</span><span class="pull-right value">' + value.treatmentsPerDay + '</span></li>' +
                  '<li><span class="pull-left">' + 'Frequency' +'</span><span class="pull-right value">' + value.weightedAvgFrequency +'</span></li>' +
                  '<li><span class="pull-left">' + 'Pressure' +'</span><span class="pull-right value">' + value.weightedAvgPressure +'</span></li>' +
                  '<li><span class="pull-left">' + 'Cough Pauses' +'</span><span class="pull-right value">' + value.normalCoughPauses +'</span></li>' +
                '</ul>';
          }
        });
      return toolTip;   
      }
    };

    $scope.xAxisTickValuesFunction = function(){
    return function(d){
        var tickVals = [];
        var values = d[0].values;
        for(var i in values){
          tickVals.push(values[i][0]);
        }
        return tickVals;
      };
    };

    $scope.yAxisFormatFunction = function() {
      return function(d) {
        var tickVals = [];
        var values = d[0].values;
        for(var i in values){
          tickVals.push(values[i][0]);
        }
        return tickVals;
      };
    }

    $scope.showCumulativeGraph = function() {
      $scope.selectedGraph = 'CUMULATIVE';
      $scope.treatmentGraph = false;
      $scope.cumulativeGraph = true;
      $scope.getCumulativeGraphData();
    };

    $scope.getNonDayHMRGraphData = function() {
      patientDashBoardService.getHMRGraphPoints($scope.patientId, $scope.fromTimeStamp, $scope.toTimeStamp, $scope.groupBy).then(function(response){
        //Will get response data from real time API once api is ready
        $scope.completeGraphData = response.data;
        if($scope.completeGraphData.actual === undefined){
          $scope.graphData = [];
        } else {
          $scope.yAxisRangeForHMRLine = graphUtil.getYaxisRangeLineGraph($scope.completeGraphData);
          $scope.graphData = graphUtil.convertIntoHMRLineGraph($scope.completeGraphData);
          $scope.customizationInLineGraph = function() {

         var circlesInHMR = d3.select('#HMRLineGraph svg').select('.nv-scatterWrap').select('.nv-group.nv-series-0').selectAll('circle')[0];
         var count = 0;
         var missedTherapyCircles = [];
         angular.forEach($scope.completeGraphData.actual,function(value){
          if(value.missedTherapy === true){
            missedTherapyCircles.push(circlesInHMR[count]);
          }
          count++;
         })
         angular.forEach(missedTherapyCircles,function(circle){
          d3.select('#HMRLineGraph svg').select('.nv-scatterWrap').select('.nv-group.nv-series-0').append('circle')
          .attr('cx',circle.attributes.cx.value)
          .attr('cy',circle.attributes.cy.value)
          .attr('r',4.5)
          .attr('class','missed_therapy_node');
         })

          };

          var circleSelectorInHMR = d3.select('#HMRLineGraph svg').select('.nv-scatterWrap').select('.nv-group.nv-series-0').selectAll('circle')[0];
          var circleCount;
          if(circleSelectorInHMR !== undefined) {
            circleCount = circleSelectorInHMR.length;
          }
          var count = 10;
          $scope.waitFunction = function waitHandler() {
            circleSelectorInHMR = d3.select('#HMRLineGraph svg').select('.nv-scatterWrap').select('.nv-group.nv-series-0').selectAll('circle')[0];
            if(circleSelectorInHMR !== undefined) {
            circleCount = circleSelectorInHMR.length;
            }
            if(circleCount > 0 || count === 0 ) {
              $scope.customizationInLineGraph();
              return false;
            } else {
              count --;
            }
            $timeout(waitHandler, 1000);
          }
          $scope.waitFunction();
        }
      }).catch(function(response) {
        $scope.graphData = [];
      });
    };

    $scope.reCreateCumulativeGraph = function() {
      $scope.removeGraph();
      $scope.handlelegends();
      $scope.createComplianceGraphData();
      $scope.drawComplianceGraph();
    };

    $scope.handlelegends = function() {
      var count = 0 ;
      if($scope.compliance.pressure === true ){
        count++;
      }
      if($scope.compliance.duration === true ){
        count++;
      }
      if($scope.compliance.frequency === true ){
        count++;
      }
      if(count === 2 ) {
        if($scope.compliance.pressure === false ){
          $scope.pressureIsDisabled = true;
          $scope.frequencyIsDisabled = false;
          $scope.durationIsDisabled = false;
        }
        if($scope.compliance.frequency === false ){
          $scope.pressureIsDisabled = false;
          $scope.frequencyIsDisabled = true;
          $scope.durationIsDisabled = false;
        }
        if($scope.compliance.duration === false ){
          $scope.pressureIsDisabled = false;
          $scope.frequencyIsDisabled = false;
          $scope.durationIsDisabled = true;
        }
      } else if(count === 1 ) {
        if($scope.compliance.pressure === true ){
          $scope.pressureIsDisabled = true;
          $scope.frequencyIsDisabled = false;
          $scope.durationIsDisabled = false;
        }
        if($scope.compliance.frequency === true ){
          $scope.pressureIsDisabled = false;
          $scope.frequencyIsDisabled = true;
          $scope.durationIsDisabled = false;
        }
        if($scope.compliance.duration === true ){
          $scope.pressureIsDisabled = false;
          $scope.frequencyIsDisabled = false;
          $scope.durationIsDisabled = true;
        }
      }

    }

    $scope.getDayHMRGraphData = function() {
      patientDashBoardService.getHMRBarGraphPoints($scope.patientId, $scope.fromTimeStamp).then(function(response){
        $scope.completeGraphData = response.data;
        if($scope.completeGraphData.actual === undefined){
           $scope.hmrBarGraphData = [];
         } else {
          $scope.completeGraphData = graphUtil.formatDayWiseDate($scope.completeGraphData.actual);
          $scope.yAxisRangeForHMRBar = graphUtil.getYaxisRangeBarGraph($scope.completeGraphData);
          $scope.hmrBarGraphData = graphUtil.convertIntoHMRBarGraph($scope.completeGraphData);
          $scope.customizationForBarGraph = function() {
            var rect_height = d3.select('#hmrBarGraph svg').selectAll('.nv-barsWrap defs rect').attr("height");
            var rect_width = d3.select('#hmrBarGraph svg').selectAll('.nv-barsWrap defs rect').attr("width");
           d3.select('#hmrBarGraph svg').selectAll('rect.nv-bar')
              .attr("x", 40)
              .attr("width", 70);

              d3.select('#hmrBarGraph svg').select('.nv-y .nv-wrap g').append('rect')
              .attr("width", rect_width)
              .attr("height" , rect_height)
              .attr("x" , 0)
              .attr("y" , 0 )
              .attr("class" , 'svg_bg');
          };

          var barCount= d3.select('#hmrBarGraph svg').selectAll('.nv-group .nv-bar')[0].length;
          var count = 5;
          $scope.waitFunction = function waitHandler() {
             barCount = d3.select('#hmrBarGraph svg').selectAll('.nv-group .nv-bar')[0].length;
            if(barCount > 0 || count === 0 ) {
              $scope.customizationForBarGraph();
              return false;
            } else {
              count --;
            }
            $timeout(waitHandler, 1000);
          }
          $scope.waitFunction();
         }
      }).catch(function(response) {
        $scope.hmrBarGraphData = [];
      });
    };

    $scope.getCumulativeGraphData = function() {
    	 patientDashBoardService.getHMRGraphPoints($scope.hcpId, $scope.fromTimeStamp, $scope.toTimeStamp, $scope.groupBy).then(function(response){
        	//$scope.cumulativeGraphData = response.data;
          //$scope.yAxisRangeForCompliance = graphUtil.getYaxisRangeComplianceGraph($scope.completeComplianceData);
      }).catch(function(response) {
        	$scope.cumulativeGraphData = [];
        	$scope.serverCumulativeGraphData = cumulativeGraphData;
		      //$scope.formatedCumulativeGraphData = graphUtil.convertIntoCumulativeGraph($scope.serverCumulativeGraphData.actual);          
		      //$scope.createCumulativeGraphData();
		      $scope.drawCumulativeGraph();
      });
      
    }

    $scope.drawCumulativeGraph = function() {
    	var testdata = [
    {
        "key": "Series 1",
        "area": true,
        "color": "red",
        "values": [
            [
                1,
                0
            ],
            [
                2,
                2.3382185140371
            ],
            [
                3,
                4.9507873460847
            ],
            [
                4,
                10.569146943813
            ],
            [
                5,
                4.4767332317425
            ],
            [
                6,
                0.50794682203014
            ],
            [
                7,
                4.5310285460542
            ]
        ]
    },
    {
        "key": "Series 2",
        "area": true,
        "color": "blue",
        "values": [
            [
                1,
                1
            ],
            [
                2,
                2
            ],
            [
                3,
                3
            ],
            [
                4,
                4
            ],
            [
                5,
                5
            ],
            [
                6,
                6
            ],
            [
                7,
                7
            ]
        ]
    },
    {
        "key": "Series 3",
        "area": true,
        "color":"green",
        "values": [
            [
                1,
                0
            ],
            [
                2,
                6.3382185140371
            ],
            [
                3,
                5.9507873460847
            ],
            [
                4,
                11.569146943813
            ],
            [
                5,
                5.4767332317425
            ],
            [
                6,
                0.50794682203014
            ],
            [
                7,
                5.5310285460542
            ]
        ]
    },
    {
        "key": "Series 4",
        "area": true,
        "color": "orange",
        "values": [
            [
                1,
                7.0674410638835
            ],
            [
                2,
                14.663359292964
            ],
            [
                3,
                14.10439306054
            ],
            [
                4,
                23.114477037218
            ],
            [
                5,
                16.774256687841
            ],
            [
                6,
                11.902028464
            ],
            [
                7,
                16.883038668422
            ]
        ]
    }
];
	    nv.addGraph(function() {
	    var chart = nv.models.cumulativeLineChart()
	                  .x(function(d) { return d[0] })
	                  .y(function(d) { return d[1] }) //adjusting, 100% is 1.00, not 100 as it is in the data
	                  .color(d3.scale.category10().range())
	                  .useInteractiveGuideline(true)
	                  ;

	     chart.xAxis
	        .tickFormat(function(d) {
	            return d;
	          });

	    	chart.yAxis
	    		.tickFormat(d3.format('.d'));

	    	d3.select('#cumulativeGraph svg')
	        .datum(testdata)
	        .call(chart);
	    	nv.utils.windowResize(chart.update);

	    return chart;
	  });
    }

    $scope.getTreatmentGraphData = function() {
      patientDashBoardService.getHMRGraphPoints($scope.patientId, $scope.fromTimeStamp, $scope.toTimeStamp, $scope.groupBy).then(function(response){
        $scope.completeComplianceData = response.data;
        if($scope.completeComplianceData.actual === undefined){
          $scope.complianceGraphData = [];
        } else {
          //recommended values
          $scope.minFrequency = $scope.completeComplianceData.recommended.minFrequency;
          $scope.maxFrequency = $scope.completeComplianceData.recommended.maxFrequency;
          $scope.minPressure = $scope.completeComplianceData.recommended.minPressure;
          $scope.maxPressure = $scope.completeComplianceData.recommended.maxPressure;
          $scope.minDuration = $scope.completeComplianceData.recommended.minMinutesPerTreatment * $scope.completeComplianceData.recommended.treatmentsPerDay;
          $scope.maxDuration = $scope.completeComplianceData.recommended.maxMinutesPerTreatment * $scope.completeComplianceData.recommended.treatmentsPerDay;
          $scope.yAxisRangeForCompliance = graphUtil.getYaxisRangeComplianceGraph($scope.completeComplianceData);
          $scope.completecomplianceGraphData = graphUtil.convertIntoComplianceGraph($scope.completeComplianceData.actual);          
          $scope.yAxis1Max = $scope.yAxisRangeForCompliance.maxDuration;
          $scope.createComplianceGraphData();
          $scope.drawComplianceGraph();
        }
      }).catch(function(response) {
        $scope.complianceGraphData = [];
      });
    };

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
    //hmrDayChart

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

  $scope.putComplianceGraphLabel = function(chart) {
    var data =  $scope.complianceGraphData
     angular.forEach(data, function(value) {
          if(value.yAxis === 1){
            chart.yAxis1.axisLabel(value.key);
          }
           if(value.yAxis === 2){
            chart.yAxis2.axisLabel(value.key);
          }
    });
  };

  $scope.formatXtickForCompliance = function(format,d){
    switch(format) {
      case "weekly":
          return d3.time.format('%A')(new Date(d));
          break;
      case "monthly":
          return 'week ' + dateService.getWeekOfMonth(d);
          break;
      case "yearly":
          return d3.time.format('%B')(new Date(d));
          break;
      default:
          break;
    }
  };
  $scope.getMinMaxForComplianceGraph = function(){
    switch($scope.compliance.primaryYaxis) {
        case "duration":
            $scope.yAxis1MaxMark = $scope.maxDuration;
            $scope.yAxis1MinMark = $scope.minDuration;
            break;
        case "pressure":
            $scope.yAxis1MaxMark = $scope.maxPressure;
            $scope.yAxis1MinMark = $scope.minPressure;
            break;
        case "frequency":
            $scope.yAxis1MaxMark = $scope.maxFrequency;
            $scope.yAxis1MinMark = $scope.minFrequency;
            break;
        default:
            break;
    }
    switch($scope.compliance.secondaryYaxis) {
        case "duration":
            $scope.yAxis2MaxMark = $scope.maxDuration;
            $scope.yAxis2MinMark = $scope.minDuration;
            break;
        case "pressure":
            $scope.yAxis2MaxMark = $scope.maxPressure;
            $scope.yAxis2MinMark = $scope.minPressure;
            break;
        case "frequency":
            $scope.yAxis2MaxMark = $scope.maxFrequency;
            $scope.yAxis2MinMark = $scope.minFrequency;
            break;
        default:
            break;
    }
  };
  $scope.drawComplianceGraph = function() {
    d3.select('#complianceGraph svg').selectAll("*").remove();
      nv.addGraph(function() {
      var chart = nv.models.multiChart()
      .margin({top: 30, right: 100, bottom: 50, left: 100})
      .showLegend(false)
      .color(d3.scale.category10().range());
     // chart.noData("Nothing to see here.");
      chart.tooltipContent($scope.toolTipContentForCompliance($scope.completeComplianceData.actual));
      //this function to put x-axis labels
      chart.xAxis.tickFormat(function(d) {
          if(d % 1 === 0) {
            var timeStamp = $scope.completecomplianceGraphData[0].values[d-1].timeStamp;
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
      chart.yDomain1([$scope.yAxis1Min,$scope.yAxis1Max]);
      chart.yDomain2([$scope.yAxis2Min,$scope.yAxis2Max]); 
      var data =  $scope.complianceGraphData;
         angular.forEach(data, function(value) {
              if(value.yAxis === 1){
                chart.yAxis1.axisLabel(value.key);
              }
               if(value.yAxis === 2){
                chart.yAxis2.axisLabel(value.key);
              }
        });
        d3.select('#complianceGraph svg')
      .datum($scope.complianceGraphData)
      .transition().duration(500).call(chart);

        if( $scope.compliance.frequency === false && $scope.compliance.duration === false && $scope.compliance.pressure === false){

        } else {

          /* Mark red color for missed therapy  -- start --*/
         var circlesInCompliance = d3.select('#complianceGraph svg').select('.nv-group.nv-series-0').selectAll('circle')[0];
         var count = 0;
         var missedTherapyCircles = [];
         angular.forEach($scope.completeComplianceData.actual,function(value){
          if(value.missedTherapy === true){
            missedTherapyCircles.push(circlesInCompliance[count]);
          }
          count++;
         })
         angular.forEach(missedTherapyCircles,function(circle){
          d3.select('#complianceGraph svg').selectAll('.nv-group.nv-series-0').append('circle')
          .attr('cx',circle.attributes.cx.value)
          .attr('cy',circle.attributes.cy.value)
          .attr('r',4.5)
          .attr('class','missed_therapy_node');
         })

         /* Mark red color for missed therapy  -- end --*/
         var bgHeight = d3.select('#complianceGraph svg').selectAll('.x .tick line').attr("y2");;
         var bgWidth = d3.select('#complianceGraph svg ').selectAll('.y1 .tick line').attr("x2");
         d3.select('#complianceGraph svg .nv-axis g').append('rect')
                  .attr("height", Math.abs(bgHeight))
                  .attr("width", bgWidth)
                  .attr("x" , 0)
                  .attr("y" , bgHeight)
                  .attr("class" , "svg_bg");

        var y1AxisMark = d3.select('#complianceGraph svg').selectAll('.y1.axis').selectAll('.nvd3.nv-wrap.nv-axis');
        var y2AxisMark = d3.select('#complianceGraph svg').selectAll('.y2.axis').selectAll('.nvd3.nv-wrap.nv-axis');
        var y1AxisMinMax = d3.select('#complianceGraph svg').selectAll('.y1.axis').selectAll('.nvd3.nv-wrap.nv-axis').select('.nv-axisMaxMin').attr("transform");
        var y2AxisMinMax = d3.select('#complianceGraph svg').selectAll('.y2.axis').selectAll('.nvd3.nv-wrap.nv-axis').select('.nv-axisMaxMin').attr("transform");
        var maxTransform = parseInt(y1AxisMinMax.split(',')[1].replace(y1AxisMinMax,')',''));
        $scope.y1AxisTransformRate = parseInt(y1AxisMinMax.split(',')[1].replace(y1AxisMinMax,')',''))/($scope.yAxis1Max - $scope.yAxis1Min);
        $scope.y2AxisTransformRate = parseInt(y2AxisMinMax.split(',')[1].replace(y2AxisMinMax,')',''))/($scope.yAxis2Max - $scope.yAxis2Min);
        var y1LineLength = d3.select('#complianceGraph svg').selectAll('.y1.axis').selectAll('.nvd3.nv-wrap.nv-axis').selectAll('line').attr('x2');
        var y2LineLength = d3.select('#complianceGraph svg').selectAll('.y2.axis').selectAll('.nvd3.nv-wrap.nv-axis').selectAll('line').attr('x2');
        $scope.getMinMaxForComplianceGraph();
        var y1AxisMinTransform = maxTransform - parseInt($scope.y1AxisTransformRate * $scope.yAxis1MinMark);
        var y1AxisMaxTransform = maxTransform - parseInt($scope.y1AxisTransformRate * $scope.yAxis1MaxMark);
        var y2AxisMinTransform = maxTransform - parseInt($scope.y2AxisTransformRate * $scope.yAxis2MinMark);
        var y2AxisMaxTransform = maxTransform - parseInt($scope.y2AxisTransformRate * $scope.yAxis2MaxMark);

        y1AxisMark.append('g').
        attr('class','minRecommendedLevel').
        attr('transform','translate(0, '+ y1AxisMinTransform + ')').
        append('text').
        text($scope.yAxis1MinMark).
        style('fill','red');

        y1AxisMark.append('g').
        attr('class','maxRecommendedLevel').
        attr('transform','translate(0,'+ y1AxisMaxTransform + ')').
        append('text').
        text($scope.yAxis1MaxMark).
        style('fill','green');

        y2AxisMark.append('g').
        attr('class','minRecommendedLevel').
        attr('transform','translate(0,'+ y2AxisMinTransform + ')').
        append('text').
        text($scope.yAxis2MinMark).
        style('fill','red');

        y2AxisMark.append('g').
        attr('class','maxRecommendedLevel').
        attr('transform','translate(0,'+ y2AxisMaxTransform + ')').
        append('text').
        text($scope.yAxis2MaxMark).
        style('fill','green');
      }
      return chart;
    });
  };

    $scope.init();
});

