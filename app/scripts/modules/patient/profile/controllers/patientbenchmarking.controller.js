'use strict';

angular.module('hillromvestApp')
.controller('patientBenchmarkingController', ['$scope', '$state', '$rootScope', 'patientService', 'UserService', 'StorageService', 'dateService', 'benchmarkingConstants',
  function ($scope, $state, $rootScope, patientService, UserService, StorageService, dateService, benchmarkingConstants) {
  	$scope.durationRange = "Week";
  	$scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(6);
  	$scope.toTimeStamp = new Date().getTime();
	$scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
	$scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
	$scope.parameterType = benchmarkingConstants.adherenceScore;
	$scope.benchMarkType = benchmarkingConstants.average;

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
          $scope.initBenchmarkingChart();        
        }
      },
      opens: 'left'
    }
    $scope.dates = {startDate: null, endDate: null};

  	$scope.init= function(){
  		var currentRoute = $state.current.name;
  		if(currentRoute === "patientBenchmarking"){
  			$scope.initBenchmarking();
  		}
  	};

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

    $scope.drawBenchmarkingChart = function(){
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		});   
		
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
                categories: $scope.benchmarkingData.categories,
                reversed: false,
                labels: {
                    step: 1
                }
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: $scope.benchmarkingData.categories,
                linkedTo: 0,
                labels: {
                    step: 1
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
                }
            },
			tooltip: { 
				backgroundColor: "rgba(255,255,255,1)", 
				useHTML: true , 
				hideDelay: 0,  
				enabled: true,        
				formatter: function() {
					console.log(this.point);
				}
			},
			plotOptions: {
				series: {
                    stacking: 'normal'
                }
			},         
			legend:{
				enabled: true
			},          
			series: $scope.benchmarkingData.series
		});
    };

    $scope.initBenchmarkingChart = function(){
    	$scope.benchmarkingData = patientBenchMarking;
		setTimeout(function(){            
			$scope.drawBenchmarkingChart();   
		}, 100); 
    	// api call for chart data
    	//patientId, parameterType, benchmarkingType, fromDate, toDate, clinicId
    	/*patientService.getPatientBenchmarking(StorageService.get('logged').patientID , $scope.parameterType, $scope.benchmarkingType, convertServerDateFormat($scope.fromTimeStamp), convertServerDateFormat($scope.toTimeStamp), $scope.clinicsDetails.selectedClinic.id).then(function(response){
    		$scope.benchmarkingData = patientBenchMarking;    		
    		setTimeout(function(){            
				$scope.drawBenchmarkingChart();   
			}, 100);  
    	}).catch(function(){
			$scope.benchmarkingData = patientBenchMarking;
			setTimeout(function(){            
				$scope.drawBenchmarkingChart();   
			}, 100);  
		});*/
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
						$scope.initBenchmarkingChart();			
					});	
				}
			}
		});  		
  	};

  	$scope.init();

}]);
