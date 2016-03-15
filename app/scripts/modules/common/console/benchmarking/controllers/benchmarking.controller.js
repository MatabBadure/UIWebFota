'use strict';
angular.module('hillromvestApp')
.controller('benchmarkingController', ['$scope', 'addressService', 'notyService', '$rootScope', 'benchmarkingService', 'dateService', 'exportutilService', 'pdfServiceConstants',
	function($scope, addressService, notyService, $rootScope, benchmarkingService, dateService, exportutilService, pdfServiceConstants) {

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
			$scope.getBenchmarkingReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.type, $scope.benchmarkType, $scope.range, $scope.state, $scope.city);
		};
		
		$scope.init = function(){
			$scope.calculateTimeDuration(5);
			$scope.benchmarkType = "Average";
			$scope.xaxis = 'ageGroup';
			$scope.range = 'all';
			$scope.type = 'adherenceScore';
			addressService.getAllStates().then(function(response){
				$scope.processStates(response.data);
			}).catch(function(response){
				notyService.showError(response);
			});
			// $scope.states = [ {name: 'one', 'true': true}, {name: 'two', 'true': true}, {name: 'three', 'true': true}, {name: 'four', 'true': true}];

			$scope.ageGroups = [
				{ ageRange: '0-5', 'true': true }, 
				{ ageRange: '6-10', 'true': true }, 
				{ ageRange: '11-15',  'true': true }, 
				{ ageRange: '16-20',  'true': true}, 
				{ ageRange: '21-25', 'true': true}, 
				{ ageRange: '26-30', 'true': true}, 
				{ ageRange: '30-35', 'true': true}, 
				{ ageRange: '35-40', 'true': true}, 
				{	ageRange: '41-45', 'true': true}, 
				{	ageRange: '46-50', 'true': true}, 
				{	ageRange: '51-55', 'true': true}, 
				{	ageRange: '56-60', 'true': true},
				{	ageRange: '61-65', 'true': true},
				{	ageRange: '66-70', 'true': true},
				{	ageRange: '71-75', 'true': true},
				{	ageRange: '76-80', 'true': true},
				{	ageRange: '81-above', 'true': true}
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
		    allSelected : "All Selected"
			}


			$scope.getBenchmarkingReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.type, $scope.benchmarkType, $scope.range, $scope.state, $scope.city);

		};

		$scope.processStates = function(states){
			$scope.states = [];
			angular.forEach(states, function(state){
				var obj = {
					'name': state,
					'ticked': true
				};
				$scope.states.push(obj);
			});
		};

		$scope.onClose = function(){
			if($scope.selectedStates.length > 0 && $scope.selectedStates.length !== $scope.states.length){
				var selectedStates = [];
				addressService.getCitiesByState($scope.selectedStates[0].name).then(function(response){
					console.log('SUCCESS :: ', response.data);
					$scope.cities = [];
					angular.forEach(response.data, function(city){
						var obj = {
							'name':city,
							'ticked':true 
						};
						$scope.cities.push(obj);
					});
				}).catch(function(response){
					console.log('ERROR :: ', response);
				});
				angular.forEach($scope.selectedStates, function(selectedState){
					selectedStates.push(selectedState.name);
				});
				$scope.state = selectedStates.join();
			}else{
				$scope.state = 'all';
			}
			$scope.getBenchmarkingReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.type, $scope.benchmarkType, $scope.range, $scope.state, $scope.city);
		};

		$scope.onXaxisChange = function(){
			$scope.isAgeGroup = $scope.isAgeGroup ? false: true;
			$scope.getBenchmarkingReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.type, $scope.benchmarkType, $scope.range, $scope.state, $scope.city);
		};

		$scope.onYaxisChange = function(){
			$scope.getBenchmarkingReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.type, $scope.benchmarkType, $scope.range, $scope.state, $scope.city);
		};

		$scope.onAgeGroupClose =function(){
			if($scope.selectedAges.length > 0 && $scope.selectedAges.length !== $scope.ageGroups.length){
				var ranges = [];
				angular.forEach($scope.selectedAges, function(selectedAge){
					ranges.push(selectedAge.ageRange);
				});
				$scope.range = ranges.join();
			}else{
				$scope.range = 'all';
			}
			$scope.getBenchmarkingReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.type, $scope.benchmarkType, $scope.range, $scope.state, $scope.city);
		};

		$scope.onClinicRangeClose = function(){
			if($scope.selectedClinicSizes.length > 0 && $scope.selectedClinicSizes.length !== $scope.clinicSizes.length){
				var ranges = [];
				angular.forEach($scope.selectedClinicSizes, function(selectedClinic){
					ranges.push(selectedClinic.size);
				});
				$scope.range = ranges.join();
			}else{
				$scope.range = 'all';	
			}
			$scope.getBenchmarkingReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.type, $scope.benchmarkType, $scope.range, $scope.state, $scope.city);
		};

		$scope.getBenchmarkingReport = function(fromDate, toDate, XAxis, type, benchmarkType,range, state, city){
			benchmarkingService.getBenchmarkingReport(fromDate, toDate, XAxis, type, benchmarkType, range, state, city).then(function(response){
				console.log('SUCCESS :: ', response);
				$scope.benchmarkingGraph = response.data;
				console.log($scope.benchmarkingGraph.xAxis.categories);
				console.log('$scope.benchmarkingGraph.series ::: ', $scope.benchmarkingGraph.series);
				$scope.drawBenchmarkingchart();
			}).catch(function(response){
				console.log('ERROR :: ', response);
			});
		};

		$scope.init();





		$scope.drawBenchmarkingchart = function(){
			var chart = Highcharts.chart('benchmarkingGraph', {
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
				      //font: '10px Helvetica',
				      fontWeight: 'bold'
				    }
			    }
				},
				yAxis: {
					gridLineColor: '#FF0000',
		      gridLineWidth: 0,
		      lineWidth:1,
		      min: 0,
		      title: {
		        text: 'Adherence Score',
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
		      }
		    },
				tooltip: {
					crosshairs: [{
		        dashStyle: 'solid',
		        color: '#b4e6f6'
		        },
		      false],
					formatter: function() {
						var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  this.x +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
			    	$.each(this.points, function(i, point) {
			      	s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ point.series.color +';padding:5px 0;width:80%;float:left"> ' + point.series.name + '</div> ' 
			        + '<div style="padding:5px;width:10%"><b>' + point.y + '</b></div></div>';
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
		  });//.setSize(1140, 400);
		};

		$scope.exportPDF = function(){
			exportutilService.exportBenchmarkPDF('benchmarkingGraph', 'benchmarkCanvas', $scope.fromDate, $scope.toDate, pdfServiceConstants.text.benchmarking);
		};

	}]);