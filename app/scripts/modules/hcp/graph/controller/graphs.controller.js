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
		$scope.showTreatmentLegends = false;
		$scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(patientDashboard.maxDaysForWeeklyGraph);
		$scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		$scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		if($state.current.name === 'hcpdashboard'){
		  $scope.getClinicsForHCP($scope.hcpId);
		} else if($state.current.name === 'clinicadmindashboard') {
			$scope.getClinicsForClinicAdmin($scope.hcpId);
		}
	};

	$scope.getStatistics = function(clinicId, userId){
		if($state.current.name === 'hcpdashboard'){
			hcpDashBoardService.getStatistics(clinicId, userId).then(function(response){
				  $scope.statistics = response.data.statitics;
				  $scope.statistics.date = dateService.getDateFromTimeStamp(new Date($scope.statistics.date),hcpDashboardConstants.USdateFormat,'/');
				  $scope.getPercentageStatistics($scope.statistics);				  
				}).catch(function(response){
				  notyService.showError(response);
				});
		} else if($state.current.name === 'clinicadmindashboard'){
			clinicadminService.getStatistics(clinicId, userId).then(function(response){
		  $scope.statistics = response.data.statitics;
		  $scope.statistics.date = dateService.getDateFromTimeStamp(new Date($scope.statistics.date),hcpDashboardConstants.USdateFormat,'/');
		  $scope.getPercentageStatistics($scope.statistics);
		}).catch(function(response){
		  notyService.showError(response);
		});

		}
   };

	$scope.getPercentageStatistics = function(statistics){
		$scope.percentStatistics = {};
		$scope.percentStatistics.patientsWithMissedTherapy = statistics.patientsWithMissedTherapy; 
		$scope.percentStatistics.patientsWithHmrNonCompliance = statistics.patientsWithHmrNonCompliance;
		$scope.percentStatistics.patientsWithSettingDeviation = statistics.patientsWithSettingDeviation; 
		$scope.percentStatistics.patientsWithNoEventRecorded = statistics.patientsWithNoEventRecorded;
	}

	$scope.getClinicsForHCP = function(userId) {
		DoctorService.getClinicsAssociatedToHCP(userId).then(function(response){
			localStorage.setItem('clinicId', response.data.clinics[0].id);
			$scope.clinics = response.data.clinics;
			$scope.selectedClinic = response.data.clinics[0];
			$scope.weeklyChart();
			$scope.getStatistics($scope.selectedClinic.id, userId);
	  }).catch(function(response){
			notyService.showError(response);
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
	  notyService.showError(response);
	});
	};

	//---HCP PieChart JS =============
	$scope.missedtherapy = {
		animate:{
			duration: hcpDashboardConstants.statistics.duration,
			enabled:true
		},
		barColor: hcpDashboardConstants.statistics.missedTherapy,
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
		barColor: hcpDashboardConstants.statistics.nonCompliance,
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
		barColor: hcpDashboardConstants.statistics.settingDeviation,
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
		barColor: hcpDashboardConstants.statistics.noEvents,
		trackColor: hcpDashboardConstants.statistics.color.track,
		scaleColor: hcpDashboardConstants.statistics.scaleColor,
		lineWidth: hcpDashboardConstants.statistics.lineWidth,
		lineCap: hcpDashboardConstants.statistics.lineCap
	};

  $scope.goToPatientDashboard = function(value){ 
	  if(value === 'hcppatientdashboard' || value === 'clinicadminpatientdashboard'){
		var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
		$state.go(value, {'clinicId': clinicId});
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
			if($scope.selectedGraph === 'TREATMENT'){
				$scope.plotNoDataAvailable();
				$scope.showTreatmentLegends = false;
			} else{
				$scope.getCumulativeGraphData();
			}
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
						$scope.serverCumulativeGraphData = graphUtil.convertIntoServerTimeZone($scope.serverCumulativeGraphData,hcpDashboardConstants.cumulativeGraph.name);
						$scope.formatedCumulativeGraphData = graphUtil.convertIntoCumulativeGraph($scope.serverCumulativeGraphData);
						$scope.cumulativeGraphRange = graphUtil.getYaxisRangeCumulativeGraph($scope.serverCumulativeGraphData);
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
			chart.yDomain([0,$scope.cumulativeGraphRange.maxNoOfPatients]);
			chart.xAxis.tickFormat(function(d) {
				if(window.event !== undefined && (window.event.type === 'mousemove')){
					return dateService.getDateFromTimeStamp(d,patientDashboard.dateFormat,'/') + '  ('+ d3.time.format('%I:%M %p')(new Date(d)) + ')'
				}else{
					var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
					if(days > 10){
						return d3.time.format('%d%b%y')(new Date(d));
					} else{
						return d3.time.format('%d%b%y %H:%M')(new Date(d));
					}
				}
			});
				chart.yAxis
					.tickFormat(function(d) {  
							return d;
				});
				chart.yAxis.tickFormat(d3.format('d'));	
				d3.select('#cumulativeGraph svg')
					.datum($scope.formatedCumulativeGraphData)
					.call(chart);
				nv.utils.windowResize(chart.update);
		$scope.CustomizationInCumulativeGraph();
			return chart;
		});
		}

  $scope.CustomizationInCumulativeGraph = function() {
		d3.selectAll('#cumulativeGraph svg').selectAll('.nv-axislabel').
		attr("y" , "-40");
		d3.selectAll('#cumulativeGraph svg').selectAll('.nv-axis .tick').append('circle').
		attr("cx" , "0").
		attr("cy" , "0").
		attr("r" , "2").
		attr("fill" , "#aeb5be");
  }  
	$scope.getTreatmentGraphData = function() {
		hcpDashBoardService.getTreatmentGraphPoints($scope.hcpId, $scope.selectedClinic.id, dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.serverDateFormat,'-'), $scope.groupBy).then(function(response){
			if( response !== null && response.data !== null && response.data.treatmentStatitics !== undefined) {
				$scope.showTreatmentLegends = true;
				$scope.serverTreatmentGraphData = response.data.treatmentStatitics;
				$scope.serverTreatmentGraphData = graphUtil.convertIntoServerTimeZone($scope.serverTreatmentGraphData,hcpDashboardConstants.treatmentGraph.name);
				$scope.formatedTreatmentGraphData = graphUtil.convertIntoTreatmentGraph($scope.serverTreatmentGraphData);
				$scope.handlelegends();
				$scope.treatmentGraphRange = graphUtil.getYaxisRangeTreatmentGraph($scope.serverTreatmentGraphData);
				$scope.createTreatmentGraphData(); 
				$scope.drawTreatmentGraph();
			} else {
				$scope.showTreatmentLegends = false;
				$scope.plotNoDataAvailable();
			}
		}).catch(function(response) {
			 $scope.showTreatmentLegends = false;
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
	
	$scope.reCreateTreatmentGraph = function(item) {
		$scope.removeGraph();
		$scope.handlelegends(item);
		$scope.createTreatmentGraphData();
		$scope.drawTreatmentGraph();
	};	

	$scope.handlelegends = function(item) {
		var count = 0 ;
		if($scope.treatment.treatmentPerDay){
			count++;
		}
		if($scope.treatment.treatmentLength){
			count++;
		}
		if(count === 0) {
			if(item === 'treatmentPerDay'){
				$scope.treatment.treatmentPerDay = false;
				$scope.treatment.treatmentLength = true;
			}else if(item === 'treatmentLength'){
				$scope.treatment.treatmentPerDay = true;
				$scope.treatment.treatmentLength = false;
			}

		} else if(count === 1 ) {
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
		} else if(count === 2) {
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
			$scope.calculateTimeDuration(0);
		}
		$scope.getTreatmentGraphData();
	};

	$scope.toolTipContentForTreatment = function(data){
      return function(key, x, y, e, graph) {
        var toolTip = '';
        angular.forEach(data, function(value) {
          if(value.startTime === e.point.x){
              toolTip =
                '<h6>' + dateService.getDateFromTimeStamp(value.startTime,patientDashboard.dateFormat,'/') + '  ('+ d3.time.format('%I:%M %p')(new Date(value.startTime)) + ')'  + '</h6>' +
                '<ul class="graph_ul">' +
                  '<li><span class="pull-left">' + 'Average Length Of Treatment : ' + '</span><span class="pull-right value">' +  value.avgTreatmentDuration  + '  minutes' + '</span></li>' +
                  '<li><span class="pull-left">' + 'Average Treatments Per Day : ' +'</span><span class="pull-right value">' + value.avgTreatments +'</span></li>' +
                '</ul>';
          }
        });
      return toolTip;   
      }
    };

	$scope.drawTreatmentGraph = function() {
		d3.select('#treatmentGraph svg').selectAll("*").remove();
			nv.addGraph(function() {
			var chart = nv.models.multiChart()
			.showLegend(false)
			.margin({top: 30, right: 30, bottom: 50, left: 30})
			.color(d3.scale.category10().range());
			
			chart.tooltipContent($scope.toolTipContentForTreatment($scope.serverTreatmentGraphData));
			chart.yDomain1([0,$scope.yAxis1Max]);
			chart.yDomain2([0,$scope.yAxis2Max]); 
			//this function to put x-axis labels
			chart.xAxis.tickFormat(function(d) {
					var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
					if(days > 10){
						return d3.time.format('%d%b%y')(new Date(d));
					} else{
						return d3.time.format('%d%b%y %H:%M')(new Date(d));
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
			var recHeight = document.getElementsByTagName('rect')[0].getAttribute('height');
			var recWidth = document.getElementsByTagName('rect')[0].getAttribute('width');
			d3.select("#treatmentGraph svg").select(".nv-wrap").insert("rect", ":first-child").
			attr("fill" , "#e3ecf7").
			attr("y" , 0 - recHeight).
			attr("height" , recHeight).
			attr("width" , recWidth);
			
			d3.selectAll('#treatmentGraph svg').selectAll('.nv-axislabel').
				attr("y" , "-20");
			d3.selectAll('#treatmentGraph svg').selectAll('.nv-axis .tick').append('circle').
				attr("cx" , "0").
				attr("cy" , "0").
				attr("r" , "2").
				attr("fill" , "#aeb5be");
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
