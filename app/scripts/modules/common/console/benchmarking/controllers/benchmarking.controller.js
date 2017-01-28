'use strict';
angular.module('hillromvestApp')
.controller('benchmarkingController', ['$scope', 'addressService', 'notyService', '$rootScope', 'benchmarkingService', 'dateService', 'exportutilService', 'pdfServiceConstants', '$state', 'StorageService', 'loginConstants',
	function($scope, addressService, notyService, $rootScope, benchmarkingService, dateService, exportutilService, pdfServiceConstants, $state, StorageService, loginConstants) {

		$scope.pointWidth = $rootScope.isIOS()  ? 30 : 50;
		$scope.calculateDateFromPicker = function(picker) {
	    $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();	      
		  $scope.toTimeStamp = (new Date().getTime() < new Date(picker.endDate._d).getTime())? new Date().getTime() : new Date(picker.endDate._d).getTime();
	    $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
	    $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');

	    $scope.serverFromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-');
	    $scope.serverToDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-');
	    if ($scope.fromDate === $scope.toDate ) {
	      $scope.fromTimeStamp = $scope.toTimeStamp;
	    }	      
	  };

	  $scope.calculateTimeDuration = function(durationInDays) {
      $scope.toTimeStamp = new Date().getTime();
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.serverFromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-');
	    $scope.serverToDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-');
    };

		$scope.opts = {
			maxDate: new Date(),
			format: patientDashboard.dateFormat,
			eventHandlers: {'apply.daterangepicker': function(ev, picker) {  
					$scope.calculateDateFromPicker(picker);     				
					$scope.customDateRangeView();
				},
				'click.daterangepicker': function(ev, picker) {
					$("#dp2cal").data('daterangepicker').setStartDate($scope.fromDate);
					$("#dp2cal").data('daterangepicker').setEndDate($scope.toDate);
				}
			},
			opens: 'left'
		}

		$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};

		$scope.customDateRangeView = function(){
			$scope.toggleDuration(false, false, false, false, true);
			$scope.getGraphData();
		};


		$scope.toggleDuration = function(day, week, month, year, custom){
		 	$scope.durationview = {};
		 	$scope.durationview.day = day;
		 	$scope.durationview.week = week;
		 	$scope.durationview.month = month;
		 	$scope.durationview.year = year;
		 	$scope.durationview.custom = custom;
		 };
		
		$scope.init = function(){
			$scope.calculateTimeDuration(5);
			$scope.xaxis = 'ageGroup';
			$scope.isGraphLoaded = false;
			addressService.getAvailableStates().then(function(response){
				$scope.rawStates = response.data;
				$scope.processStates($scope.rawStates);
			}).catch(function(response){
				notyService.showError(response);
			});

			$scope.ageGroups = [
				{ ageRange: '0-5', 'true': true },
				{ ageRange: '6-10', 'true': true},
				{ ageRange: '11-15',  'true': true},
				{ ageRange: '16-20',  'true': true},
				{ ageRange: '21-25', 'true': true},
				{ ageRange: '26-30', 'true': true},
				{ ageRange: '31-35', 'true': true},
				{ ageRange: '36-40', 'true': true},
				{ ageRange: '41-45', 'true': true},
				{ ageRange: '46-50', 'true': true},
				{ ageRange: '51-55', 'true': true},
				{ ageRange: '56-60', 'true': true},
				{ ageRange: '61-65', 'true': true},
				{ ageRange: '66-70', 'true': true},
				{ ageRange: '71-75', 'true': true},
				{ ageRange: '76-80', 'true': true},
				{ ageRange: '81-above', 'true': true}
			];

			$scope.clinicSizes = [
				{ size: '1-25', 'true': true},
				{ size: '26-50', 'true': true},
				{ size: '51-75', 'true': true},
				{ size: '76-100', 'true': true},
				{ size: '101-150', 'true': true},
				{ size: '151-200', 'true': true},
				{ size: '201-250', 'true': true},
				{ size: '251-300', 'true': true},
				{ size: '301-350', 'true': true},
				{ size: '351-400', 'true': true},
				{ size: '401-above', 'true': true}
			];

			$scope.isAgeGroup = true;
			$scope.localLang = {
				selectAll       : "Tick all",
				selectNone      : "Tick none",
		    search          : "Type here to search...",
		    nothingSelected : "Nothing is selected",
		    allSelected : "All Selected",
		    Cancel : "Cancel",
        	OK:"OK"
			}

			$scope.toggleDuration(false, true, false, false, false);

			if($state.current.name === 'adminClinicDiseaseBenchmarking' || $state.current.name === 'rcadminClinicDiseaseBenchmarking' || $state.current.name === 'associatesClinicDiseaseBenchmarking' || $state.current.name === 'customerserviceClinicDiseaseBenchmarking'){
				$scope.benchmarkType = "CF";
				$scope.type = 'noOfPatients';
				$scope.ageRange = 'all';
				$scope.clinicRange = 'all';
				$scope.getClinicDiseaseReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.ageRange, $scope.clinicRange, $scope.state, $scope.city);
			}else if($state.current.name === 'adminBenchmarking' || $state.current.name === 'rcadminBenchmarking' || $state.current.name === 'associatesBenchmarking' || $state.current.name === 'customerserviceBenchmarking'){
				$scope.benchmarkType = "Average";
				$scope.type = 'adherenceScore';
				$scope.range = 'all';
				$scope.getBenchmarkingReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.type, $scope.benchmarkType, $scope.range, $scope.state, $scope.city);
			}
		};

		$scope.processStates = function(states){
			$scope.states = [];
			angular.forEach(states, function(state, key){
				var obj = {
					'name': key,
					'ticked': true
				};
				$scope.states.push(obj);
			});
		};

		$scope.onClose = function(){
			if($scope.selectedStates.length > 0){
				var selectedStates = [];
				if($scope.selectedStates.length === 1){
					var state = $scope.selectedStates[0].name;
					$scope.cities = [];
					angular.forEach($scope.rawStates[state.toString()], function(city){
						var obj = {
							'name':city,
							'ticked':true 
						};
						$scope.cities.push(obj);
					});
					if($scope.cities.length > 0 ){
						var cities = [];
						angular.forEach($scope.cities, function(city){
							cities.push(city.name);
						});
						$scope.city = cities.join();
					}
				}else{
					delete $scope.city;
				}
				angular.forEach($scope.selectedStates, function(selectedState){
					selectedStates.push(selectedState.name);
				});
				$scope.state = selectedStates.join();
			}else{
				delete $scope.city;
				$scope.state = Object.keys($scope.rawStates).join();
			}
			$scope.getGraphData();
		};

		$scope.onCitiesClose = function(){
			if($scope.selectedCities.length > 0 ){
				var cities = [];
				angular.forEach($scope.selectedCities, function(city){
					cities.push(city.name);
				});
				$scope.city = cities.join();
			}else{
				if($scope.cities.length > 0){
					var cities = [];
					angular.forEach($scope.cities, function(city){
						cities.push(city.name);
					});
					$scope.city = cities.join();
				}
			}
			$scope.getGraphData();
		};

		$scope.onXaxisChange = function(){
			$scope.isAgeGroup = $scope.isAgeGroup ? false: true;
			if($scope.xaxis === 'ageGroup'){
				$scope.onAgeGroupClose();
			}else if($scope.xaxis === 'clinicSize'){
				$scope.onClinicRangeClose();
			}else if($scope.xaxis === 'both'){
				$scope.getClinicDiseaseReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.ageRange, $scope.clinicRange, $scope.state, $scope.city);
			}
		};

		$scope.onYaxisChange = function(){
			$scope.getBenchmarkingReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.type, $scope.benchmarkType, $scope.range, $scope.state, $scope.city);
		};

		$scope.onAgeGroupClose =function(){
			if($scope.selectedAges.length > 0){
				var ranges = [];
				angular.forEach($scope.selectedAges, function(selectedAge){
					ranges.push(selectedAge.ageRange);
				});
				$scope.range = ranges.join();
				$scope.ageRange = ranges.join();
				$scope.getGraphData();
			}
		};

		$scope.onClinicRangeClose = function(){
			if($scope.selectedClinicSizes.length > 0 ){
				var ranges = [];
				angular.forEach($scope.selectedClinicSizes, function(selectedClinic){
					ranges.push(selectedClinic.size);
				});
				$scope.range = ranges.join();
				$scope.clinicRange = ranges.join();
				$scope.getGraphData();
			}
		};

		$scope.getGraphData = function(){
			if($state.current.name === 'adminBenchmarking' || $state.current.name === 'rcadminBenchmarking' || $state.current.name === 'associatesBenchmarking' || $state.current.name === 'customerserviceBenchmarking'){
				$scope.getBenchmarkingReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.type, $scope.benchmarkType, $scope.range, $scope.state, $scope.city);	
			}else if($state.current.name === 'adminClinicDiseaseBenchmarking' || $state.current.name === 'rcadminClinicDiseaseBenchmarking' || $state.current.name === 'associatesClinicDiseaseBenchmarking' || $state.current.name === 'customerserviceClinicDiseaseBenchmarking'){
				if($scope.isIgnoreXaxis){
					$scope.getClinicDiseaseReportIgnoreXaxis();
				}else{
					$scope.getClinicDiseaseReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.ageRange, $scope.clinicRange, $scope.state, $scope.city);
				}
			}
		};

		$scope.getBenchmarkingReport = function(fromDate, toDate, XAxis, type, benchmarkType,range, state, city){
			benchmarkingService.getBenchmarkingReport(fromDate, toDate, XAxis, type, benchmarkType, range, state, city).then(function(response){
				$scope.benchmarkingGraph = response.data;
				$scope.isNoDataAvailable = false;
				setTimeout(function() {
        	$scope.drawBenchmarkingchart();
    		}, 10);
			}).catch(function(response){
				if(response.status === 400){
					$scope.isNoDataAvailable = true;
				}
			});
		};

		$scope.getClinicDiseaseReport = function(fromDate, toDate, xaxis, ageRange, clinicRange, state, city){
			benchmarkingService.getClinicDiseaseReport(fromDate, toDate, xaxis, ageRange, clinicRange, state, city).then(function(response){
				$scope.clinicDiseaseGraphData = response.data;
				$scope.isNoDataAvailable = false;
				setTimeout(function() {
        	$scope.drawClinicDiseaseChart();
    		}, 10);
			}).catch(function(response){
				if(response.status === 400){
					$scope.isNoDataAvailable = true;
				}
			});
		};

		$scope.dayView = function(){
			$scope.toggleDuration(true, false, false, false, false);
			$scope.calculateTimeDuration(0);
			$scope.getGraphData();
		};

		$scope.weekView = function(){
			$scope.toggleDuration(false, true, false, false, false);
			$scope.calculateTimeDuration(5);
			$scope.getGraphData();
		};

		$scope.monthView = function(){
			$scope.toggleDuration(false, false, true, false, false);
			$scope.calculateTimeDuration(30);
			$scope.getGraphData();
		};

		$scope.yearView = function(){
			$scope.toggleDuration(false, false, false, true, false);
			$scope.calculateTimeDuration(365);
			$scope.getGraphData();
		};

		$scope.drawBenchmarkingchart = function(){
			var chart = Highcharts.chart('benchmarkingGraph', {
				credits: {
					enabled: false
				},	
				chart:{
					type: 'column',
					zoomType: 'xy',
					backgroundColor: "#e6f1f4"
				},
        title: {
          text: ''
        },
		    xAxis:{
					type: 'category',
					categories: $scope.benchmarkingGraph.xAxis.categories,
					labels:{
			      style: {
				      color: '#525151',
				      fontWeight: 'bold'
				    }
			    },
			    title: {
		        text: ($scope.xaxis === 'ageGroup') ? 'Age Group':'Clinic Size',
		        style: {
			        color: '#525151',
			        font: '10px Helvetica',
			        fontWeight: 'bold'
			      }
		      },
				},
				yAxis: {
					minRange: 1,
					gridLineColor: '#FF0000',
		      gridLineWidth: 0,
		      lineWidth:1,
		      min: 0,
		      title: {
		        text: $scope.benchmarkingGraph.series[0].name,
		        style: {
			        color: '#525151',
			        font: '10px Helvetica',
			        fontWeight: 'bold'
			      }
		      },
		      allowDecimals:false,
		      labels:{
		       	style: {
			        color: '#525151',
			        //font: '10px Helvetica',
			        fontWeight: 'bold'
			      }
		      }
		    },
        legend: {
		      align: 'center',
			    verticalAlign: 'bottom',
			    x: 0,
			    y: 0
		    },
		    plotOptions: {
		      series: {
		      	showInLegend: false,
		      	pointWidth: $scope.pointWidth
		      }
		    },
				tooltip: {
					crosshairs: [{
		        dashStyle: 'solid',
		        color: '#b4e6f6'
		        },
		      false],
					formatter: function() {
						var date = ($scope.fromDate === $scope.toDate) ? $scope.fromDate : $scope.fromDate +' - '+$scope.toDate;
						var xAxis = ($scope.xaxis === 'ageGroup')? 'Age Group': 'Clinic Size';
						var s = '<div style="font-size:12px ;padding-bottom: 3px;">&nbsp;'+ date + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div style="font-size:10px; padding-bottom: 3px;">'+ xAxis + ' : ' + this.x +'</div><div>';
			    	$.each(this.points, function(i, point) {
			    	//var serName =	(point.series.name.toLowerCase() === "cumulative frequency deviation days") ? "Cumulative Freq-Dev Days": point.series.name;
			      	s += '<div style="font-size:10px; width:100%"><div style="color:'+ point.series +';padding:0;width:auto;float:left"> ' +  point.series.name + ' : </div> ' 
			        + ' <div style="padding:0;width:auto">&nbsp;<b>' + point.y + '</b></div><div style="line-height:24px">Total No. of Patients : '+ point.point.toolText.totalPatients +' </div></div>';
			    	});
			    	s += '</div>';
		        return s;
			    },
			    hideDelay: 0,
					useHTML: true,
   				shared: true
				},
				series: $.extend(true, [], $scope.benchmarkingGraph.series),
				loading: true,
				size: {}
		  });
		};

		$scope.drawClinicDiseaseChart = function(){
			var xAxisTitle = '';
			if($scope.isIgnoreXaxis){
				xAxisTitle = 'Geography';	
			}else{
				xAxisTitle =  ($scope.xaxis === 'ageGroup') ? 'Age Group':($scope.xaxis === 'both')? 'Both': 'Clinic Size';	
			}
			if($scope.xaxis === 'both'){				
				$('#clinicdiseaseGraph').highcharts({
					credits: {
						enabled: false
					},
					chart: {
			      type: 'column',
			      zoomType: 'xy',
						backgroundColor: "#e6f1f4"
	        },
		      title: {
		        text: ''
		      },
		      xAxis: {
		        categories: $scope.clinicDiseaseGraphData.xAxis.categories,
		        labels:{
							style: {
								color: '#525151',							
								fontWeight: 'bold'
							}
						}
			    },
			    yAxis: {
			     	allowDecimals:false,
			     	gridLineColor: '#FF0000',
						gridLineWidth: 0,
						lineWidth:1,
			     	minRange: 1,
			      min: 0,
			      title: {
			        text: 'No. of patients'
			      },
			      labels:{
							style: {
								color: '#525151',								
								fontWeight: 'bold'
							}
						},
			      stackLabels: {
			        enabled: true,
			          style: {
			            fontWeight: 'bold',
			            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
			          }
			        }
			      },
			      legend: {
			        align: 'center',
					    verticalAlign: 'bottom',
					    x: 0,
					    y: 0
			      },
			      tooltip: {
							crosshairs: [{
								dashStyle: 'solid',
								color: '#b4e6f6'
							},
							false],
							formatter: function() {	
								var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;text-align:center"> Age Group : '+  this.x +'</div>';
								s += '<div style="font-size:12x; padding-bottom: 3px;text-align:center"> Total No. Of Patients : '+  this.points[0].total +'</div>';
								s += '<div style="font-size:12x;padding-bottom: 3px;float:left;text-align:center">Clinic Size  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div style="font-size:12x; padding-bottom: 3px;text-align:right">Patients &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
								$.each(this.points, function(i, point) {
									s += '<div style="font-size:10px; font-weight: bold; width:88%;padding:0 12px"><div style="color:'+ point.series.color +';padding:5px 0;width:80%;float:left"> ' + point.series.name + '</div> ' 
									+ '<div style="padding:5px;width:10%"><b>' + point.y + '</b></div></div>';
								});
								s += '</div>';
								return s;
							},
							hideDelay: 0,
							useHTML: true,
							shared: true
			      },
			      plotOptions: {
			       	series: {
								events: {
									legendItemClick: function () {
										var self = this,
										allow = false;
										if(self.visible) {
											$.each(self.chart.series, function(i, series) {
												if(series !== self && series.visible) {
													allow = true;
												}
											});
											if(!allow){
												notyService.showMessage(notyMessages.minComplianceError, notyMessages.typeWarning );
											}
											return allow;
										}
									}
								}
							},
			        column: {
								stacking: 'normal',
								dataLabels: {
									enabled: true,
									color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
									style: {
										textShadow: '0 0 3px black'
									},
									formatter: function() {
							      if (this.y != 0) {
							        return this.y ;
							      } else {
							        return null;
							      }
							    }
								}
							}
			      },
			      series: $scope.clinicDiseaseGraphData.series 
					});
				}else{
					var chart = Highcharts.chart('clinicdiseaseGraph', {
						credits: {
							enabled: false
						},
					chart:{
						type: 'column',
						zoomType: 'xy',
						backgroundColor: "#e6f1f4"
					},
        	title: {
          	text: ''
        	},
		    	xAxis:{
						type: 'category',
						categories: $scope.clinicDiseaseGraphData.xAxis.categories,
						labels:{
			      	style: {
				      	color: '#525151',
				      	fontWeight: 'bold'
				    	}
			    	},
			    	title: {
		        	text: xAxisTitle,
		        	style: {
			        	color: '#525151',
			        	font: '10px Helvetica',
			        	fontWeight: 'bold'
			      	}
		      	},
					},
					yAxis: {
						minRange: 1,
						gridLineColor: '#FF0000',
		      	gridLineWidth: 0,
		      	lineWidth:1,
		      	min: 0,
		      	title: {
		        	text: $scope.clinicDiseaseGraphData.series[0].name,
		        	style: {
			        	color: '#525151',
			        	font: '10px Helvetica',
			        	fontWeight: 'bold'
			      	}
		      	},
		      	allowDecimals:false,
		      	labels:{
		       		style: {
			        	color: '#525151',
			        	//font: '10px Helvetica',
			        	fontWeight: 'bold'
			      	}
		      	},
		      	stackLabels: {
             	enabled: ($scope.xaxis === 'both')? true: false,
             	style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            	}
          	}
		    	},
        	legend: {
		      	align: 'center',
			    	verticalAlign: 'bottom',
			    	x: 0,
			    	y: 0
		    	},
		    	plotOptions: {
		      	series: {
		      		showInLegend: false,
		      		pointWidth: $scope.pointWidth
		      	},
		      	column: {
							stacking: ($scope.xaxis === 'both') ? 'normal': false,
							dataLabels: {
								enabled: true,
								color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
								style: {
									textShadow: '0 0 3px black'
								},
								formatter: function() {
						      if (this.y != 0 && $scope.xaxis === 'both') {
						        return this.y ;
						      } else {
						        return null;
				          }
						    }
							}
						}
		    	},
					tooltip: {
						crosshairs: [{
		        	dashStyle: 'solid',
		        	color: '#b4e6f6'
		      	},
		      	false],
						formatter: function() {
							var date = ($scope.fromDate === $scope.toDate) ? $scope.fromDate : $scope.fromDate +' - '+$scope.toDate;
							var xAxis = ($scope.isIgnoreXaxis) ? 'Geography' : ($scope.xaxis === 'ageGroup')? 'Age Group': 'Clinic Size';
							var s = '<div style="font-size:12px ;padding-bottom: 5px;">'+ date + '</div><div style="font-size:10px; padding-bottom: 3px;">'+ xAxis + ' : ' + this.x +'</div><div>';
				    	$.each(this.points, function(i, point) {
			      		s += '<div style="font-size:10px; width:100%"><div style="color:'+ point.series +';padding:0;width:auto;float:left">  Total No. of Patients  : </div> ' 
			        	+ ' <div style="padding:0;width:auto">&nbsp;<b>' + point.y + '</b></div></div>';
			    		});
			    		s += '</div>';
		        	return s;
			    	},
			    	hideDelay: 0,
						useHTML: true,
   					shared: true
					},
					series: $.extend(true, [], $scope.clinicDiseaseGraphData.series),
					loading: true,
					size: {}
		  	});
			}
		};

		$scope.exportPDF = function(){
			exportutilService.exportBenchmarkPDF('benchmarkingGraph', 'benchmarkCanvas', $scope.fromDate, $scope.toDate, pdfServiceConstants.text.benchmarking);
		};

		$scope.ignoreXaxis = function(){
			if($scope.isIgnoreXaxis){
				/* This Should be made Generic*/
				$scope.xaxis = 'ageGroup';
				if($scope.selectedStates.length === 0){
					$scope.state = Object.keys($scope.rawStates).join();
				}else{
					var selectedStates = [];
					angular.forEach($scope.selectedStates, function(selectedState){
						selectedStates.push(selectedState.name);
					});
					$scope.state = selectedStates.join();	
				}
				$scope.getClinicDiseaseReportIgnoreXaxis();
			}else{
				$scope.getClinicDiseaseReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.ageRange, $scope.clinicRange, $scope.state, $scope.city);
			}
		};

		$scope.getClinicDiseaseReportIgnoreXaxis = function(){
			benchmarkingService.getClinicDiseaseReportIgnoreXaxis($scope.serverFromDate, $scope.serverToDate, $scope.state, $scope.city).then(function(response){
				$scope.clinicDiseaseGraphData = response.data;
				setTimeout(function() {
        	$scope.drawClinicDiseaseChart();
    		}, 10);
			}).catch(function(response){
			  notyService.showError(response);
			});
		};

		$scope.switchBenchmarking = function(state){
			switch(StorageService.get('logged').role){
				case loginConstants.role.admin: 
					if(state === 'parameter'){
						$state.go('adminBenchmarking');
					}else if(state === 'clinicDisease'){
						$state.go('adminClinicDiseaseBenchmarking');
					}
				break;
				case loginConstants.role.acctservices: 
					if(state === 'parameter'){
						$state.go('rcadminBenchmarking');
					}else if(state === 'clinicDisease'){
						$state.go('rcadminClinicDiseaseBenchmarking');
					}
				break;
				
				case loginConstants.role.associates: 
					if(state === 'parameter'){
						$state.go('associatesBenchmarking');
					}else if(state === 'clinicDisease'){
						$state.go('associatesClinicDiseaseBenchmarking');
					}
				break;
				case loginConstants.role.customerservices: 
					if(state === 'parameter'){
						$state.go('customerserviceBenchmarking');
					}else if(state === 'clinicDisease'){
						$state.go('customerserviceClinicDiseaseBenchmarking');
					}
				break;
			}
		};

		$scope.downloadClinicDiseasePDF = function(){
			var pdfTitle = $scope.benchmarkType+' ';
			if($scope.type === 'noOfPatients') {
				pdfTitle = pdfTitle+ 'No. of Patients for';
			}
			if($scope.xaxis === 'ageGroup' && !$scope.isIgnoreXaxis){ 
				pdfTitle = pdfTitle + ' Age Group'; 
			}else if($scope.xaxis === 'clinicSize' && !$scope.isIgnoreXaxis){
				pdfTitle = pdfTitle + ' Clinic Size'; 
			}else if($scope.xaxis === 'both' && !$scope.isIgnoreXaxis){
				pdfTitle = pdfTitle + ' Age Group and Clinic Size';
			}else if($scope.isIgnoreXaxis){
				pdfTitle = pdfTitle + ' Geography';
			}
			exportutilService.exportBenchmarkPDF('clinicdiseaseGraph', 'clinicdiseaseCanvas', $scope.fromDate, $scope.toDate, pdfTitle);
		};

	}]);