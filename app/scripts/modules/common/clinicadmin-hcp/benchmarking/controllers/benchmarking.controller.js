'use strict';

angular.module('hillromvestApp')
.controller('hcpCAdminBenchmarkingController', ['$scope', '$state', '$rootScope', 'patientService', 'UserService', 'StorageService', 'dateService', 'benchmarkingConstants', 'patientGraphsConstants', 'exportutilService', 'clinicadminService', 'DoctorService', 'loginConstants', 'clinicService',
  function ($scope, $state, $rootScope, patientService, UserService, StorageService, dateService, benchmarkingConstants, patientGraphsConstants, exportutilService, clinicadminService, DoctorService, loginConstants, clinicService) {  	
	$scope.parameterType = benchmarkingConstants.string.adherenceScore;
	$scope.benchMarkType = benchmarkingConstants.string.average;
	$scope.isGraphLoaded = false;
  $scope.geographyParam = benchmarkingConstants.string.stateParam + benchmarkingConstants.string.all;

  function resetBenchmarkParameters(){
    $scope.benchmarkingParam = benchmarkingParams;
    $scope.parameters = {};
    $scope.parameters.selectedParam = $scope.benchmarkingParam[0];
  };

  function resetBenchmarkGeoLocation(){
    $scope.geographyOption = geographyOption;
    $scope.geoLocation = {};
    $scope.geoLocation.selectedGeo = $scope.geographyOption[0];    
  };
  resetBenchmarkParameters();
  resetBenchmarkGeoLocation();

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
  $scope.graphTitle = benchmarkingConstants.string.graphTitleClinicAvg + $scope.parameters.selectedParam.name + benchmarkingConstants.string.graphTitleVs + benchmarkingConstants.string.grapTitleClinic + benchmarkingConstants.string.graphTitleAverage + $scope.parameters.selectedParam.name;  	
    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    }); 
		var isZoomReset = false;  
		$scope.benchmarkingData.series[0].color = patientGraphsConstants.colors.pressure;
		$scope.benchmarkingData.series[1].color = patientGraphsConstants.colors.frequency;		
		var divId = (divId)? divId : "hcpcabenchmarkingGraph";

    $('#hcpcabenchmarkingGraph').highcharts({			
      chart: {
        type: 'bar',
        zoomType: 'xy',
        backgroundColor:  "#e6f1f4"
      },
      title: {
        text: $scope.benchmarkingData.series[0].name + benchmarkingConstants.string.graphTitleVs + $scope.benchmarkingData.series[1].name,
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
        } ,
        title: {
          text: 'Age Group'
        }               
      }, 
      { // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: $scope.benchmarkingData.xAxis.categories,
        linkedTo: 0,
        title: {
          text: 'Age Group'
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
          var dateLabel = (dayDiff === 0)? Highcharts.dateFormat("%m/%e/%Y",$scope.fromTimeStamp) : Highcharts.dateFormat("%m/%e/%Y",$scope.fromTimeStamp)+' - '+Highcharts.dateFormat("%m/%e/%Y",$scope.toTimeStamp);
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
    $("#hcpcabenchmarkingGraph").empty();
  }

  $scope.reDrawChartOnClinicChange = function(clinicSelected){
    // weekView is being called in order to reset the previously selected date range.
    // in order to retain the prev selected data range ng-chage invoke initBenchmarkingChart instead of weekView

    //resetBenchmarkParameters();
    //resetBenchmarkGeoLocation();    
    //$scope.weekView();
    $scope.clinicsDetails.selectedClinic = clinicSelected;    
    $scope.redrawBenchmarkingChart();  
  };

  $scope.initBenchmarkingChart = function(){ 
    if($scope.clinicsDetails.selectedClinic){
      var getbenchmarking = null;
      console.log("to date : ",convertServerDateFormat($scope.toTimeStamp));
      if($rootScope.userRole === loginConstants.role.hcp){
        getbenchmarking = UserService.getHCPBenchmarking(StorageService.get('logged').userId , $scope.parameterType, $scope.benchMarkType, convertServerDateFormat($scope.fromTimeStamp), convertServerDateFormat($scope.toTimeStamp), $scope.clinicsDetails.selectedClinic.id, $scope.geographyParam);
      }else if($rootScope.userRole === loginConstants.role.clinicadmin){
        getbenchmarking = UserService.getClinicAdminBenchmarking(StorageService.get('logged').userId , $scope.parameterType, $scope.benchMarkType, convertServerDateFormat($scope.fromTimeStamp), convertServerDateFormat($scope.toTimeStamp), $scope.clinicsDetails.selectedClinic.id, $scope.geographyParam);
      }

      getbenchmarking.then(function(response){
        if(response.data && response.data.series && response.data.series.length === 2){
          var responseData = response.data; 
          $scope.benchmarkingData = response.data;         
          setTimeout(function(){            
            $scope.drawBenchmarkingChart();   
          }, 100);          
        }else{
          plotNoDataAvailable();
        }        
      });      
    }else{    		
      plotNoDataAvailable();
    }    	   	
  };

  $scope.redrawBenchmarkingChart = function(){
    // if selected geo is state or city, get the corresponding state and city of the clinic
    $scope.parameterType = $scope.parameters.selectedParam.parameter;
    if($scope.geoLocation.selectedGeo &&  ($scope.geoLocation.selectedGeo.name !== $scope.geographyOption[0].name)){        
      clinicService.getClinic($scope.clinicsDetails.selectedClinic.id).then(function(response){                
        if(response && response.data && response.data.clinic){
          if($scope.geoLocation.selectedGeo.name === $scope.geographyOption[1].name){
            $scope.geographyParam = benchmarkingConstants.string.stateParam + response.data.clinic.state;          
          }else if($scope.geoLocation.selectedGeo.name === $scope.geographyOption[2].name){           
            $scope.geographyParam = benchmarkingConstants.string.cityParam + response.data.clinic.city;      
          }
          $scope.initBenchmarkingChart();
        }               
      });
    }else{
      $scope.geographyParam = benchmarkingConstants.string.stateParam + benchmarkingConstants.string.all;
      $scope.initBenchmarkingChart();
    }    
  };

  $scope.exportPatientBMPDF = function(){		
    exportutilService.downloadPatientBMAsPDF("hcpcabenchmarkingGraph", "hcpcabenchmarkingCanvas",$scope.fromDate, $scope.toDate);			
  };

  $scope.initCABenchmarking = function(){
    UserService.getState().then(function(response) {
      $scope.states = response.data.states;        
    });
    $scope.clinicsDetails = {}; 
    clinicadminService.getClinicsAssociated(StorageService.get('logged').userId).then(function(response){          
      if(response.data.clinics){
        $scope.clinics = response.data.clinics; 
        if($scope.clinics && $scope.clinics.length > 0){
          $scope.clinicsDetails.selectedClinic = $scope.clinics[0];
        }     
      }
      UserService.getUser(StorageService.get('logged').userId).then(function(response){
        $scope.patientBenchmark = response.data.user;           
        $scope.weekView();                            
      });
    });    
  };

  $scope.initHCPBenchmarking = function(){
    UserService.getState().then(function(response) {
      $scope.states = response.data.states;       
    });
    $scope.clinicsDetails = {}; 
    DoctorService.getClinicsAssociatedToHCP(StorageService.get('logged').userId).then(function(response){      
      if(response.data.clinics){
        $scope.clinics = response.data.clinics; 
        if($scope.clinics && $scope.clinics.length > 0){
          $scope.clinicsDetails.selectedClinic = $scope.clinics[0];
        }     
      }
      UserService.getUser(StorageService.get('logged').userId).then(function(response){
        $scope.patientBenchmark = response.data.user;           
        $scope.weekView();                            
      });
    });    
  };


  $scope.init= function(){
    var currentRoute = $state.current.name;
    if(currentRoute === "hcpBenchmarking"){
      $scope.initHCPBenchmarking();
    }else if(currentRoute === "clinicAdminBenchmarking"){
      $scope.initCABenchmarking();
    }
  };

  $scope.init();

}]);
