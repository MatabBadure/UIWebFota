'use strict';
angular.module('hillromvestApp')
.controller('hcpGraphController',[ '$scope', '$state', 'hcpDashBoardService', 'dateService', 'graphUtil', '$stateParams', 'hcpDashboardConstants', 'DoctorService', 'clinicadminService', 'notyService', function($scope, $state, hcpDashBoardService, dateService, graphUtil, $stateParams, hcpDashboardConstants, DoctorService, clinicadminService, notyService) {
	var chart;
	$scope.init = function() {
		$scope.hcpId = parseInt(localStorage.getItem('userId'));
		$scope.selectedGraph = 'CUMULATIVE';
		$scope.treatmentGraph = false;
		$scope.cumulativeGraph = true;
		$scope.format = 'weekly';
		$scope.selectedDateOption = 'WEEK';
		$scope.toTimeStamp = new Date().getTime();
		$scope.treatment = {};
		$scope.treatment.treatmentPerDay = true;
		$scope.treatment.treatmentLength = true;
		$scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(patientDashboard.maxDaysForWeeklyGraph);
		$scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		$scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		if($state.current.name === 'hcpdashboard'){
		  $scope.getClinicsForHCP($scope.hcpId);
		} else if($state.current.name === 'clinicadmindashboard') {
			$scope.getClinicsForClinicAdmin($scope.hcpId);
		}
	}; 

	$scope.getBarColor = function(count) {
		if( count <= 25 && count > 0) {
			return hcpDashboardConstants.statistics.color.quarter;
		} else if(count >25 && count <=50) {
			return hcpDashboardConstants.statistics.color.half;
		} else if(count >50 && count <=75) {
			return hcpDashboardConstants.statistics.color.threeQuarters;
		} else if( count >75) {
			return hcpDashboardConstants.statistics.color.full;
		}
	};

	$scope.getStatistics = function(clinicId, userId){
		if($state.current.name === 'hcpdashboard'){
			hcpDashBoardService.getStatistics(clinicId, userId).then(function(response){
				  $scope.statistics = response.data.statitics;
				}).catch(function(response){
				  $scope.showWarning(response);
				});
		} else if($state.current.name === 'clinicadmindashboard'){
				clinicadminService.getStatistics(clinicId, userId).then(function(response){
	      $scope.statistics = response.data.statitics;
	    }).catch(function(response){
	      $scope.showWarning(response);
	    });
		}
  };

	$scope.getClinicsForHCP = function(userId) {
		DoctorService.getClinicsAssociatedToHCP(userId).then(function(response){
			localStorage.setItem('clinicId', response.data.clinics[0].id);
			$scope.clinics = response.data.clinics;
			$scope.selectedClinic = response.data.clinics[0];
			$scope.weeklyChart();
			$scope.getStatistics($scope.selectedClinic.id, userId);
	  }).catch(function(response){
			$scope.showWarning(response);
	  });
	};

	$scope.getClinicsForClinicAdmin = function(userId) {
		clinicadminService.getClinicsAssociated(userId).then(function(response){
      localStorage.setItem('clinicId', response.data.clinics[0].id);
      $scope.clinics = response.data.clinics;
      $scope.selectedClinic = response.data.clinics[0];
      $scope.weeklyChart();
      $scope.getStatistics($scope.selectedClinic.id, userId);
    }).catch(function(response){
      $scope.showWarning(response);
    });
	};

	//---HCP PieChart JS =============
	$scope.missedtherapyDays = 25;
	$scope.hmrRunRate = 55;
	$scope.deviationDays = 49;
	$scope.noeventDays = 76;
	$scope.missedtherapy = {
		animate:{
			duration: hcpDashboardConstants.statistics.duration,
			enabled:true
		},
		barColor: $scope.getBarColor($scope.missedtherapyDays),
		trackColor: hcpDashboardConstants.statistics.color.track,
		scaleColor: hcpDashboardConstants.statistics.scaleColor,
		lineWidth: hcpDashboardConstants.statistics.lineWidth,
		lineCap: hcpDashboardConstants.statistics.lineCap
	};
	
  $scope.hmr = {
		animate:{
			duration: hcpDashboardConstants.statistics.duration,
			enabled:true
		},
		barColor: $scope.getBarColor($scope.hmrRunRate),
		trackColor: hcpDashboardConstants.statistics.color.track,
		scaleColor: hcpDashboardConstants.statistics.scaleColor,
		lineWidth: hcpDashboardConstants.statistics.lineWidth,
		lineCap: hcpDashboardConstants.statistics.lineCap
	};
	
  $scope.deviation = {
		animate:{
			duration: hcpDashboardConstants.statistics.duration,
			enabled:true
		},
		barColor: $scope.getBarColor($scope.deviationDays),
		trackColor: hcpDashboardConstants.statistics.color.track,
		scaleColor: hcpDashboardConstants.statistics.scaleColor,
		lineWidth: hcpDashboardConstants.statistics.lineWidth,
		lineCap: hcpDashboardConstants.statistics.lineCap
	};
	
  $scope.noevent = {
		animate:{
			duration: hcpDashboardConstants.statistics.duration,
			enabled:true
		},
		barColor: $scope.getBarColor($scope.noeventDays),
		trackColor: hcpDashboardConstants.statistics.color.track,
		scaleColor: hcpDashboardConstants.statistics.scaleColor,
		lineWidth: hcpDashboardConstants.statistics.lineWidth,
		lineCap: hcpDashboardConstants.statistics.lineCap
	};

  $scope.goToPatientDashboard = function(value){
	  if(value === 'hcppatientdashboard' || value === 'clinicadminpatientdashboard'){
	    $state.go(value, {'clinicId': $scope.selectedClinic.id});
	  }else{
	    $state.go(value);
	  }
  };

	/*Dtate picker js*/
	$scope.opts = {
		maxDate: new Date(),
		format: patientDashboard.dateFormat,
		dateLimit: {"months":patientDashboard.maxDurationInMonths},
		eventHandlers: {
      'apply.daterangepicker': function(ev, picker) {
			  $scope.calculateDateFromPicker(picker);
			  $scope.drawGraph();
			  $scope.selectedDateOption = '';
			}
		},
		opens: 'left'
	};

		/*Dtate picker js END*/

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
  	  $scope.drawGraph();
  	}
  };
			
	$scope.calculateDateFromPicker = function(picker) {
		$scope.fromTimeStamp = new Date(picker.startDate._d).getTime();
		$scope.toTimeStamp = new Date(picker.endDate._d).getTime();
		$scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		$scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		if ($scope.fromDate === $scope.toDate ) {
			$scope.fromTimeStamp = $scope.toTimeStamp;
		}
	};

	$scope.removeGraph = function() {
		d3.selectAll('svg').selectAll("*").remove();
	};

		
	$scope.drawGraph = function() {
	var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
	if(days <= patientDashboard.maxDaysForWeeklyGraph && days > 0) {
			$scope.weeklyChart($scope.fromTimeStamp);
		} else if ( days > patientDashboard.maxDaysForWeeklyGraph && days <= patientDashboard.minDaysForMonthlyGraph ) {
			$scope.monthlyChart($scope.fromTimeStamp);
		} else if ( days > patientDashboard.minDaysForMonthlyGraph) {
			 $scope.yearlyChart($scope.fromTimeStamp);
		} else if(days === 0) {
			$scope.plotNoDataAvailable();
		}
	};

	$scope.dates = {startDate: null, endDate: null};

	$scope.plotNoDataAvailable = function() {
		$scope.removeGraph();
		d3.selectAll('svg').append('text').
			text(hcpDashboardConstants.message.noData).
			attr('class','nvd3 nv-noData').
			attr('x','560').
			attr('y','175');
	};

	$scope.showCumulativeGraph = function() {
		$scope.selectedGraph = 'CUMULATIVE';
		$scope.treatmentGraph = false;
		$scope.cumulativeGraph = true;
		$scope.getCumulativeGraphData();
	};

	$scope.getCumulativeGraphData = function() {
		hcpDashBoardService.getCumulativeGraphPoints($scope.hcpId, $scope.selectedClinic.id, dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.serverDateFormat,'-'), $scope.groupBy).then(function(response){
			$scope.serverCumulativeGraphData = response.data.cumulativeStatitics;
			if($scope.serverCumulativeGraphData.length !== 0) {
				$scope.formatedCumulativeGraphData = graphUtil.convertIntoCumulativeGraph($scope.serverCumulativeGraphData); 
				$scope.drawCumulativeGraph();
			} else {
				$scope.plotNoDataAvailable();
			}
		}).catch(function(response) {
			$scope.plotNoDataAvailable();
		});	
	};

	$scope.drawCumulativeGraph = function() {
		nv.addGraph(function() {
		  var chart = nv.models.lineChart()
			.x(function(d) { return d[0] })
			.y(function(d) { return d[1] }) 
			.color(d3.scale.category10().range())
			.useInteractiveGuideline(true);
			chart.xAxis.showMaxMin = true;
			chart.xAxis.staggerLabels = true,
			chart.yAxis.axisLabel(hcpDashboardConstants.cumulativeGraph.yAxis.label);
			//chart.yDomain([0,5]);
			chart.xAxis.tickFormat(function(d) {
				if(d % 1 === 0){
					var timeStamp = $scope.serverCumulativeGraphData[d-1].startTimestamp;
					if( event !== undefined && event.type === "mousemove") {
						return d3.time.format('%x')(new Date(timeStamp));
					}
					
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
	};


	$scope.getTreatmentGraphData = function() {
		hcpDashBoardService.getTreatmentGraphPoints($scope.hcpId, $scope.selectedClinic.id, dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.serverDateFormat,'-'), $scope.groupBy).then(function(response){
			if( response !== null && response.data !== null && response.data.treatmentStatitics !== undefined) {
				$scope.serverTreatmentGraphData = response.data.treatmentStatitics;
				$scope.formatedTreatmentGraphData = graphUtil.convertIntoTreatmentGraph($scope.serverTreatmentGraphData);
				$scope.handlelegends();
				$scope.treatmentGraphRange = graphUtil.getYaxisRangeTreatmentGraph($scope.serverTreatmentGraphData);
				$scope.createTreatmentGraphData(); 
				$scope.drawTreatmentGraph();
			} else {
				$scope.plotNoDataAvailable();
			}
		}).catch(function(response) {
		   $scope.plotNoDataAvailable();
		});
	};

	$scope.calculateTimeDuration = function(durationInDays) {
		$scope.toTimeStamp = new Date().getTime();
		$scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		$scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
		$scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.USdateFormat,'/');
	};

	$scope.chooseGraph = function() {
		if($scope.cumulativeGraph) {
			$scope.getCumulativeGraphData();
		} else if ($scope.treatmentGraph) {
			$scope.getTreatmentGraphData();
		}
	};

	$scope.drawChart = function(datePicker,dateOption,groupByOption,durationInDays) {
		$scope.selectedDateOption = dateOption;
		$scope.removeGraph();
		if(datePicker === undefined){
			$scope.calculateTimeDuration(parseInt(durationInDays));
			$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
		}
		$scope.format = $scope.groupBy = groupByOption;
		$scope.chooseGraph();
	};

	// Weekly chart
	$scope.weeklyChart = function(datePicker) {
		$scope.drawChart(datePicker,'WEEK','weekly',6);
	};

	// Yearly chart
	$scope.yearlyChart = function(datePicker) {
		$scope.drawChart(datePicker,'YEAR','yearly',365);
	};
 
	// Monthly chart
	$scope.monthlyChart = function(datePicker) {
		$scope.drawChart(datePicker,'MONTH','monthly',30);
	};
	
	$scope.reCreateTreatmentGraph = function() {
		$scope.removeGraph();
		$scope.handlelegends();
		$scope.createTreatmentGraphData();
		$scope.drawTreatmentGraph();
	};

	$scope.handlelegends = function() {
		var count = 0 ;
		if($scope.treatment.treatmentPerDay){
			count++;
		}
		if($scope.treatment.treatmentLength){
			count++;
		}
		if(count === 1 ) {
			if($scope.treatment.treatmentPerDay){
				$scope.isTreatmentPerDayDisabled = true;
				$scope.isTreatmentLengthDisabled = false;
				$scope.treatment.treatmentPerDay = true;
				$scope.treatment.treatmentLength = false;
			}
			if($scope.treatment.treatmentLength) {
				$scope.isTreatmentPerDayDisabled = false;
				$scope.isTreatmentLengthDisabled = true;
				$scope.treatment.treatmentPerDay = false;
				$scope.treatment.treatmentLength = true;
			}
		}
		if(count === 2) {
			$scope.isTreatmentPerDayDisabled = false;
			$scope.isTreatmentLengthDisabled = false;
			$scope.treatment.treatmentPerDay = true;
			$scope.treatment.treatmentLength = true;
		}
	};

	$scope.setYaxisRangeForTreatmentGraph = function(axisLabel,count) {
		switch(axisLabel) {
			case 'Treatments':
				if(count === 1) {
					$scope.yAxis1Max = $scope.treatmentGraphRange.maxTreatmentsPerDay;
				} else if(count === 2) {
					$scope.yAxis2Max = $scope.treatmentGraphRange.maxTreatmentDuration;
				}
				break;
			case 'Minutes':
				if(count === 1) {
					$scope.yAxis1Max = $scope.treatmentGraphRange.maxTreatmentDuration;
				} else if(count === 2) {
					$scope.yAxis2Max = $scope.treatmentGraphRange.maxTreatmentDuration;
				}
				break;
		}
	};

	$scope.createTreatmentGraphData = function() {
		delete $scope.treatmentGraphData ;
		$scope.treatmentGraphData = [];
		var count = 0;
		angular.forEach($scope.formatedTreatmentGraphData, function(value) {
			if(value.axisLabel === 'Treatments' && $scope.treatment.treatmentPerDay){
				value.yAxis = ++count;
				$scope.setYaxisRangeForTreatmentGraph(value.axisLabel,count);
				value.color = hcpDashboardConstants.treatmentGraph.color.treatmentPerDay;
				$scope.treatmentGraphData.push(value);
			}
			if(value.axisLabel === 'Minutes' && $scope.treatment.treatmentLength){
				value.yAxis = ++count;
				$scope.setYaxisRangeForTreatmentGraph(value.axisLabel,count);
				value.color = hcpDashboardConstants.treatmentGraph.color.treatmentLength;
				$scope.treatmentGraphData.push(value);
			}
		});
	};

	$scope.showTreatmentGraph = function() {
		$scope.selectedGraph = 'TREATMENT';
		$scope.treatmentGraph = true;
		$scope.cumulativeGraph = false;
		if($scope.fromTimeStamp === $scope.toTimeStamp){
			$scope.calculateTimeDuration(7);
		}
		$scope.getTreatmentGraphData();
	};

	$scope.toolTipContentForTreatment = function(){
		return '';   
	};

	$scope.drawTreatmentGraph = function() {
		d3.select('#treatmentGraph svg').selectAll("*").remove();
			nv.addGraph(function() {
			var chart = nv.models.multiChart()
			.showLegend(false)
			.margin({top: 30, right: 100, bottom: 50, left: 100})
			.color(d3.scale.category10().range());
			
			chart.tooltipContent($scope.toolTipContentForTreatment());
			//chart.yDomain1([0,$scope.yAxis1Max]);
			//chart.yDomain2([0,$scope.yAxis2Max]); 
			//this function to put x-axis labels
			chart.xAxis.tickFormat(function(d) {
					if(d % 1 === 0) {
						var timeStamp = $scope.serverTreatmentGraphData[d-1].startTime;
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
			var data =  $scope.treatmentGraphData;
				 angular.forEach(data, function(value) {
						if(value.yAxis === 1){
							chart.yAxis1.axisLabel(value.axisLabel);
						}
						 if(value.yAxis === 2){
							chart.yAxis2.axisLabel(value.axisLabel);
						}
			});
			chart.yAxis1.tickFormat(d3.format('d'));
			chart.yAxis2.tickFormat(d3.format('d'));
				d3.select('#treatmentGraph svg')
			.datum($scope.treatmentGraphData)
			.transition().duration(500).call(chart);
			return chart;
		});
	};

	$scope.init();

	$scope.gotoPatients = function(value){
		if($state.current.name === 'hcpdashboard'){
			$state.go('hcppatientdashboard',{'filter':value, 'clinicId':$scope.selectedClinic.id});
		} else if($state.current.name === 'clinicadmindashboard') {
			$state.go('clinicadminpatientdashboard',{'filter':value, 'clinicId':$scope.selectedClinic.id});
		}
  };
}]);