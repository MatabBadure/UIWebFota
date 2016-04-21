'use strict';

angular.module('hillromvestApp')
.controller('patientBenchmarkingController', ['$scope', '$state', '$rootScope', 'patientService', 'UserService', 'StorageService', 'dateService', 'benchmarkingConstants', 'patientGraphsConstants', 'exportutilService',
  function ($scope, $state, $rootScope, patientService, UserService, StorageService, dateService, benchmarkingConstants, patientGraphsConstants, exportutilService) {  	
	$scope.parameterType = benchmarkingConstants.string.adherenceScore;
	$scope.benchMarkType = benchmarkingConstants.string.average;
	$scope.isGraphLoaded = false;

  function resetBenchmarks(){
    $scope.benchmarks= benchmarks;    
    $scope.benchmarkings = {};
    $scope.benchmarkings.selectedBM = $scope.benchmarks[0];
  };

  function resetBenchmarkParameters(){
    $scope.benchmarkingParam = patientBMParams;
    $scope.parameters = {};
    $scope.parameters.selectedParam = $scope.benchmarkingParam[0];
  };

  resetBenchmarkParameters();
  resetBenchmarks();

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
      dateLimit: {"months":patientDashboard.maxDurationInMonths},
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
		$scope.initBenchmarkingChart();
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
    $scope.graphTitle = benchmarkingConstants.string.graphTitleMyAvgAdherenceScore + benchmarkingConstants.string.graphTitleVs + $scope.clinicsDetails.selectedClinic.name + benchmarkingConstants.string.grapTitleClinicAdherenceScore;  	
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
      credits: {
        enabled: false
      },		
			chart: {
                type: 'bar',
                zoomType: 'xy',
                backgroundColor:  "#e6f1f4"
            },
            title: {
                text: $scope.graphTitle,
                style:{
                	color: "#646568",
                	fontWeight: 'bold'
                }
            },
            xAxis: [{
                categories: $scope.benchmarkingData.xAxis.categories,
                reversed: false,
                labels: {
                    step: 1
                },
                title: {
	                text: 'Age Group',
                  style:{
                    color: "#646568",
                    fontWeight: 'bold'
                  }
	            }
                               
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: $scope.benchmarkingData.xAxis.categories,
                linkedTo: 0,
                title: {
	                text: 'Age Group',
                  style:{
                    color: "#646568",
                    fontWeight: 'bold'
                  }
	            }
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
		                }
		            },
		            afterSetExtremes: function(e){		            	
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
					var dayDiff = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);  
					var dateLabel = (dayDiff === 0)? Highcharts.dateFormat("%m/%d/%Y",$scope.fromTimeStamp) : Highcharts.dateFormat("%m/%d/%Y",$scope.fromTimeStamp)+' - '+Highcharts.dateFormat("%m/%d/%Y",$scope.toTimeStamp);
					var adherenceScore = (this.point.y < 0) ? -1 * (this.point.y): this.point.y;
					var s = '<div style="font-size:12x;font-weight: normal; padding: 5px;">'
							+'<div id="tooltip-header" style="display: flex;align-items: center;justify-content: center;padding: 3px;"><b>'+ dateLabel +'</b></div>'
							+'<div id="ageGroup" style="display: flex;align-items: center;justify-content: center;padding: 3px;">Age Group : '+ this.point.category +'</div>'	;
					if(this.point.toolText && this.point.toolText.totalPatients){
						s += '<div id="seriesName" style="display: flex;align-items: center;justify-content: center;padding: 3px;"> Total No. Of Patients : '+ this.point.toolText.totalPatients +'</div>';
					}
					s += '<div id="seriesName" style="display: flex;align-items: center;justify-content: center;padding: 3px;">'+this.series.name+' : '+ adherenceScore +'</div>'+'</div>';
					return s;
                },
                borderWidth: 1,
    			backgroundColor: "rgba(255,255,255,255)",
                useHTML: true,
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

    function plotNoDataAvailable(){
    	$scope.isNoDataAvailable = true;
    }

    function removeChart(){
    	$("#patientBenchmarkingGraph").empty();
    }

    $scope.reDrawChartOnClinicChange = function(){
    	// weekView is being called in order to reset the previously selected date range.
    	// in order to retain the prev selected data range ng-chage invoke initBenchmarkingChart instead of weekView
    	$scope.weekView();
    };

    $scope.initBenchmarkingChart = function(){ 
    	if($scope.clinicsDetails.selectedClinic){
	    	patientService.getPatientBenchmarking(StorageService.get('logged').patientID , $scope.parameterType, $scope.benchMarkType, convertServerDateFormat($scope.fromTimeStamp), convertServerDateFormat($scope.toTimeStamp), $scope.clinicsDetails.selectedClinic.id).then(function(response){
	    		var responseData = response.data; 
	    		$scope.benchmarkingData = {};    		
	    		if(responseData && responseData.series && responseData.series.length){
	    			$scope.benchmarkingData.series = [];
		    		$scope.benchmarkingData.series[0]={"name": benchmarkingConstants.string.myAvgAdherenceScore}
		    		$scope.benchmarkingData.series[1]={"name": $scope.clinicsDetails.selectedClinic.name  + benchmarkingConstants.string.clinicAvgAdherenceScore}
		    		$scope.benchmarkingData.xAxis = responseData.xAxis;
	    			$scope.isNoDataAvailable = false;
					angular.forEach(responseData.series, function(s, i) {
						if(s.name === "Self"){							
							s.name = $scope.benchmarkingData.series[0].name;
							$scope.benchmarkingData.series[0] = s;
		    			}else{		    				
		    				s.name = $scope.benchmarkingData.series[1].name; 
		    				$scope.benchmarkingData.series[1] = s;
		    			}
					}); 
					setTimeout(function(){            
						$scope.drawBenchmarkingChart();   
					}, 100);     			
	    		}else{
	    			plotNoDataAvailable();
	    		}				
	    		
	    	}).catch(function(){
				plotNoDataAvailable();
			});	
    	}else{    		
    		plotNoDataAvailable();
    	}    	   	
    	
    };
    
  	$scope.initBenchmarking = function(){
  		$scope.clinicsDetails = {};   		
		patientService.getClinicsLinkedToPatient(StorageService.get('logged').patientID ).then(function(response){
			if(response.data.clinics){
				$scope.clinics = response.data.clinics;	
				if($scope.clinics && $scope.clinics.length > 0){
					$scope.clinicsDetails.selectedClinic = $scope.clinics[0];
				}			
			}
			
			UserService.getUser(StorageService.get('logged').patientID).then(function(response){
				$scope.patientBenchmark = response.data.user;						
				$scope.weekView();														
			});	

		});  		
  	};

  	$scope.exportPatientBMPDF = function(){	
      var clinicDetails = ($scope.clinicsDetails.selectedClinic) ? $scope.clinicsDetails.selectedClinic : null;     
  		exportutilService.downloadPatientBMAsPDF("patientBenchmarkingGraph", "patientBenchmarkCanvas",$scope.fromDate, $scope.toDate, clinicDetails);			
  	};

  	$scope.init= function(){
  		var currentRoute = $state.current.name;
  		if(currentRoute === "patientBenchmarking"){
  			$scope.initBenchmarking();
  		}
  	};

  	$scope.init();

}]);
