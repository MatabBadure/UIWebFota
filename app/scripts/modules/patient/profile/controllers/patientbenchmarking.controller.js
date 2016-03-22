'use strict';

angular.module('hillromvestApp')
.controller('patientBenchmarkingController', ['$scope', '$state', '$rootScope', 'patientService', 'UserService', 'StorageService', 'dateService', 'benchmarkingConstants', 'patientGraphsConstants', 'exportutilService',
  function ($scope, $state, $rootScope, patientService, UserService, StorageService, dateService, benchmarkingConstants, patientGraphsConstants, exportutilService) {  	
	$scope.parameterType = benchmarkingConstants.string.adherenceScore;
	$scope.benchMarkType = benchmarkingConstants.string.average;
	$scope.isGraphLoaded = false;


	$scope.calculateTimeDuration = function(durationInDays) {
      $scope.toTimeStamp = new Date().getTime();
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
    };

  	$scope.calculateDateFromPicker = function(picker) {
      $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();
      $scope.toTimeStamp = new Date(picker.endDate._d).getTime();
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      if ($scope.fromDate === $scope.toDate ) {
        $scope.fromTimeStamp = $scope.toTimeStamp;
      }
    };

    function convertServerDateFormat(dateTimestamp){
    	return dateService.getDateFromTimeStamp(dateTimestamp,patientDashboard.serverDateFormat,'-');
    };

  	$scope.opts = {
      maxDate: new Date(),
      format: patientDashboard.dateFormat,
      dateLimit: {"months":12},
      eventHandlers: {'apply.daterangepicker': function(ev, picker) {
          $scope.durationRange = "Custom";     
          $scope.calculateDateFromPicker(picker);   
          $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};              
          $scope.initBenchmarkingChart();        
        }
      },
      opens: 'left'
    }
    $scope.dates = {startDate: null, endDate: null};

    $scope.dayView = function(isOtherDayTimestamp){
    	$scope.durationRange = "Day";
		if(isOtherDayTimestamp){
		$scope.fromTimeStamp = $scope.toTimeStamp = isOtherDayTimestamp;
		}else{
		$scope.fromTimeStamp = $scope.toTimeStamp = new Date().getTime();        
		}

		$scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
		$scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
		$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
		$scope.initBenchmarkingChart();
    };

    $scope.weekView = function(){
    	$scope.durationRange = "Week";
    	$scope.calculateTimeDuration(6);
		$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
		$scope.initBenchmarkingChart();
    };

    $scope.monthView = function(){
    	$scope.durationRange = "Month";
    	$scope.calculateTimeDuration(30);
		$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};		
		$scope.initBenchmarkingChart();
    };

    $scope.yearView = function(){
    	$scope.durationRange = "Year";
    	$scope.calculateTimeDuration(365);
		$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
		$scope.drawBenchmarkingChart();
    };

    $scope.customDateRangeView = function(){
    	$scope.durationRange = "Custom";
    	$scope.durationRange = "Custom";    
		$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
		$scope.initBenchmarkingChart();
    };

    Array.max = function( array ){
	    return Math.max.apply( Math, array );
	};
    $scope.drawBenchmarkingChart = function(){    	
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		}); 
		var isZoomReset = false;  
		$scope.benchmarkingData.series[0].color = patientGraphsConstants.colors.pressure;
		$scope.benchmarkingData.series[1].color = patientGraphsConstants.colors.frequency;		
		var divId = (divId)? divId : "patientBenchmarkingGraph";

		$('#patientBenchmarkingGraph').highcharts({			
			chart: {
                type: 'bar',
                zoomType: 'xy',
                backgroundColor:  "#e6f1f4"
            },
            title: {
                text: ''
            },
            xAxis: [{
                categories: $scope.benchmarkingData.xAxis.categories,
                reversed: false,
                labels: {
                    step: 1
                }                
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: $scope.benchmarkingData.xAxis.categories,
                linkedTo: 0
            }],
            yAxis: {            	
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return Math.abs(this.value);
                    }
                },
                allowDecimals:false,
                events: {                	
		            setExtremes: function (e) {
		                if(typeof e.min == 'undefined' && typeof e.max == 'undefined'){
							isZoomReset = true;
							console.log('reset zoom clicked', isZoomReset);   
		                }
		            },
		            afterSetExtremes: function(e){
		            	console.log("extremes are set", isZoomReset);
		            	if(isZoomReset){
		            		isZoomReset = false;
		            		var dExt;							
							var dMax = e.max;
							var dMin = e.min;            
							dMax >= dMin ? dExt = dMax : dExt = dMin;							
							var min = 0 - dExt; 							         
							this.setExtremes(min-1, dExt+1);
		            	}		            		               
		            }
		        }
            },

            plotOptions: {               
                series: {
                		stacking: 'normal',
                		// this event is to make the legends not clickable.
		                events: {
		                    legendItemClick: function () {
		                    	return false;		                    		
		                    }
		                }
		            }
            },

            legend: {		            		           
				enabled: true,
				// this is to remove the hand cursor from the legends.
				itemStyle:{
					cursor: 'default'
				}				
			},

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + ', age-group ' + this.point.category + '</b><br/>' +
                        'Average Adherence Score: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                },
                hideDelay: 0
            },

            series: $scope.benchmarkingData.series
		},function(chart) {// to make the chart be divided into two equal halves
            var dExt;
            var ext = chart.yAxis[0].getExtremes();
            var dMax = Math.abs(ext.dataMax);
            var dMin = Math.abs(ext.dataMin);            
            dMax >= dMin ? dExt = dMax : dExt = dMin;           
            var min = 0 - dExt;            
            chart.yAxis[0].setExtremes(min-1, dExt+1);
        });
    };

    $scope.initBenchmarkingChart = function(){
    	$scope.benchmarkingData = patientBenchMarking;
		setTimeout(function(){            
			$scope.drawBenchmarkingChart();   
		}, 100); 
    	// api call for chart data
    	//patientId, parameterType, benchmarkingType, fromDate, toDate, clinicId
    	patientService.getPatientBenchmarking(StorageService.get('logged').patientID , $scope.parameterType, $scope.benchMarkType, convertServerDateFormat($scope.fromTimeStamp), convertServerDateFormat($scope.toTimeStamp), $scope.clinicsDetails.selectedClinic.id).then(function(response){
    		$scope.benchmarkingData = patientBenchMarking;    
    		console.log("$scope.benchmarkingData : ",$scope.benchmarkingData);		
    		/*setTimeout(function(){            
				$scope.drawBenchmarkingChart();   
			}, 100);  */
    	}).catch(function(){
			/*$scope.benchmarkingData = patientBenchMarking;
			setTimeout(function(){            
				$scope.drawBenchmarkingChart();   
			}, 100);  */
		});
    };
    
  	$scope.initBenchmarking = function(){
  		$scope.clinicsDetails = {};   		
		patientService.getClinicsLinkedToPatient(StorageService.get('logged').patientID ).then(function(response){
			if(response.data.clinics){
				$scope.clinics = response.data.clinics;
				if($scope.clinics && $scope.clinics.length > 0){
					$scope.clinicsDetails.selectedClinic = $scope.clinics[0];
					UserService.getUser(StorageService.get('logged').patientID).then(function(response){
						$scope.patientBenchmark = response.data.user;						
						$scope.weekView();
						$scope.initBenchmarkingChart();									
					});	
				}
			}
		});  		
  	};

  	$scope.exportPatientBMPDF = function(){		
  		exportutilService.downloadPatientBMAsPDF("patientBenchmarkingGraph", "patientBenchmarkCanvas",$scope.fromDate, $scope.toDate);			
  	};

  	$scope.init= function(){
  		var currentRoute = $state.current.name;
  		if(currentRoute === "patientBenchmarking"){
  			$scope.initBenchmarking();
  		}
  	};

  	$scope.init();

}]);
