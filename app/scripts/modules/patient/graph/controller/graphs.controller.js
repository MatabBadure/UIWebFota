'use strict';

angular.module('hillromvestApp')
.controller('graphController',
  ['$scope', '$state', 'patientDashBoardService', 'StorageService', 'dateService', 'graphUtil', 'patientService', 'UserService', '$stateParams', 'notyService', '$timeout', 'graphService', 'caregiverDashBoardService', 'loginConstants', '$location','$filter', 'commonsUserService',
  function($scope, $state, patientDashBoardService, StorageService, dateService, graphUtil, patientService, UserService, $stateParams, notyService, $timeout, graphService, caregiverDashBoardService, loginConstants, $location, $filter, commonsUserService) {

    var chart;
    var hiddenFrame, htmlDocument;    
    var g_pdfMetaData={};   
    $scope.isGraphLoaded = false;    
    $scope.addCanvasToDOM = function (){ 
      $scope.removeGraph();
      $scope.isGraphDownloadable = false;               
      if($("#hmrCanvasContainer").length > 0){
        $("#hmrCanvasContainer").remove();
      }      
      if($("#complianceCanvasContainer").length > 0){
        $("#complianceCanvasContainer").remove();
      }      
      if($("#compliance1CanvasContainer").length > 0){
        $("#compliance1CanvasContainer").remove();
      }    
      $('<div id=hmrCanvasContainer style="display:none" ><br/><canvas id=hmrBarLineCanvas width=1300 height=350></canvas></div>').appendTo("body");
      $('<div id=complianceCanvasContainer style="display:none">compliance canvas<br/><canvas id=complianceCanvas width=1300 height=350></canvas></div>').appendTo("body");
      $('<div id=compliance1CanvasContainer style="display:none">compliance 1 canvas<br/><canvas id=compliance1Canvas width=1300 height=350></canvas></div>').appendTo("body");
    }; 

    $scope.isIE = function(){      
      if(window.navigator.userAgent.indexOf("MSIE") !== -1){
        return true
      }else{
        return false;
      }
    };
    var isIEBrowser = $scope.isIE();
    $scope.init = function() {
      $scope.yAxisRangeForHMRLine = $scope.yAxisRangeForCompliance = $scope.compliance = {};
      $scope.hmrLineGraph = true;
      $scope.hmrBarGraph = false;
      $scope.hmrGraph = true;
      $scope.isComplianceExist = false;
      $scope.format = 'weekly';
      $scope.selectedGraph = 'HMR';
      $scope.selectedDateOption = 'WEEK';
      $scope.disableDatesInDatePicker();
      $scope.role = StorageService.get('logged').role;
      $scope.patientId = parseInt(StorageService.get('logged').patientID);
      $scope.role = StorageService.get('logged').role;
      $scope.patientId = parseInt(StorageService.get('logged').patientID);
      $scope.caregiverID = parseInt(StorageService.get('logged').userId);
      var currentRoute = $state.current.name;
      if( $scope.role === loginConstants.role.caregiver){
        $scope.getPatientListForCaregiver($scope.caregiverID);
      }
      var server_error_msg = "Some internal error occurred. Please try after sometime.";
      $scope.showNotes = $scope.hmrBarGraph = $scope.isComplianceExist = $scope.compliance.frequency = false;
      $scope.compliance.pressure = $scope.compliance.duration = $scope.hmrLineGraph = $scope.hmrGraph = true;
      $scope.toTimeStamp = new Date().getTime();
      $scope.compliance.secondaryYaxis = 'pressure';
      $scope.compliance.primaryYaxis = 'duration';
      $scope.hmrRunRate = $scope.adherenceScore = $scope.missedtherapyDays = $scope.minFrequency = $scope.maxFrequency = $scope.minPressure = $scope.maxPressure = $scope.minDuration = $scope.maxDuration = $scope.yAxis1Min = $scope.yAxis2Min = $scope.notePageCount = $scope.totalNotes = 0;
      $scope.edit_date = dateService.convertDateToYyyyMmDdFormat(new Date());
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(6);
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.curNotePageIndex = 1;
      $scope.perPageCount = 4;
      $scope.patientTab = currentRoute;
      if ($state.current.name === 'patientdashboard') {
        $scope.hasTransmissionDate = false;
        $scope.initPatientDashboard();
      }else if(currentRoute === 'patientdashboardCaregiver'){
        $scope.initPatientCaregiver();
      }else if(currentRoute === 'patientdashboardCaregiverAdd'){
        $scope.initpatientCraegiverAdd();
      }else if(currentRoute === 'patientdashboardCaregiverEdit'){
        $scope.initpatientCaregiverEdit();
      }else if(currentRoute === 'patientdashboardDeviceProtocol'){
        $scope.initPatientDeviceProtocol();
      }else if(currentRoute === 'patientdashboardClinicHCP'){
        $scope.initPatientClinicHCPs();
      } else if(currentRoute === 'patientOverview' || currentRoute === 'hcppatientOverview' || currentRoute === 'clinicadminpatientOverview' || currentRoute === 'patientOverviewRcadmin' || currentRoute === 'associatepatientOverview') {
        $scope.getAssociatedClinics($stateParams.patientId);
        $scope.getPatientDevices($stateParams.patientId);
        $scope.patientId = parseInt($stateParams.patientId);
        $scope.getPatientById($scope.patientId);
        $scope.initGraph();
        //$scope.weeklyChart();
      }
      $scope.compliance = {};
      $scope.compliance.pressure = true;
      $scope.compliance.duration = true;
      $scope.compliance.frequency = false;
      $scope.handlelegends();
      $scope.toTimeStamp = new Date().getTime();
      $scope.compliance.secondaryYaxis = 'pressure';
      $scope.compliance.primaryYaxis = 'duration';
      $scope.hmrRunRate = 0;
      $scope.adherenceScore = 0;
      $scope.missedtherapyDays = 0;
      $scope.settingsDeviatedDaysCount = 0;
      $scope.minFrequency = 0;
      $scope.maxFrequency = 0;
      $scope.minPressure = 0;
      $scope.maxPressure = 0;
      $scope.minDuration = 0;
      $scope.maxDuration = 0;
      $scope.yAxisRangeForHMRLine = {};
      $scope.yAxisRangeForCompliance = {};
      $scope.yAxis1Min = 0;
      $scope.yAxis2Min = 0;
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(6);
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.curNotePageIndex = 1;
      $scope.perPageCount = 4;
      $scope.notePageCount = 0;
      $scope.totalNotes = 0;
      $scope.addCanvasToDOM();
    };

    $scope.isGraphReady = function(){
      var hmrGraphId = null; var complianceGraphId = null; var compliance1GraphId = null;
      if($scope.complianceGraph){
        hmrGraphId = "#complianceGraphHMR";
        complianceGraphId = "#complianceGraph";
        compliance1GraphId = "#complianceGraph1";
      }else if ($scope.hmrBarGraph){
        hmrGraphId = "#hmrBarGraph";
        complianceGraphId = "#hmrBarGraphCompliance";
        compliance1GraphId = "#hmrBarGraphCompliance1";
      } else if ($scope.hmrLineGraph){
        hmrGraphId = "#hmrLineGraphSVG";
        complianceGraphId = "#hmrLineGraphCompliance";
        compliance1GraphId = "#hmrLineGraphCompliance1";
      }
      if(($(hmrGraphId).find("svg").length > 0) && ($(complianceGraphId).find("svg").length > 0) && ($(compliance1GraphId).find("svg").length > 0)){
        $scope.isGraphDownloadable = true;
      }else{
        $scope.isGraphDownloadable = false;
      }
    }


    angular.element('#edit_date').datepicker({
          endDate: '+0d',
          autoclose: true}).
          on('changeDate', function(ev) {
          var selectedDate = angular.element('#edit_date').datepicker("getDate");
          var _month = (selectedDate.getMonth()+1).toString();
          _month = _month.length > 1 ? _month : '0' + _month;
          var _day = (selectedDate.getDate()).toString();
          _day = _day.length > 1 ? _day : '0' + _day;
          var _year = (selectedDate.getFullYear()).toString();
          var dob = _month+"/"+_day+"/"+_year;
          $scope.patient.dob = dob;
          var age = dateService.getAge(selectedDate);
          angular.element('.age').val(age);
          $scope.patient.age = age;
          if (age === 0) {
            $scope.form.$invalid = true;
          }
          angular.element("#edit_date").datepicker('hide');
          $scope.$digest();
        });

    /*caregiver code*/
    $scope.getPatientListForCaregiver = function(caregiverID){
      caregiverDashBoardService.getPatients(caregiverID).then(function(response){
        $scope.patients = response.data.patients;
        if(StorageService.get('logged')  && StorageService.get('logged').patientID){
          angular.forEach($scope.patients, function(value){
            if(value.userId === parseInt(StorageService.get('logged').patientID)){
              $scope.$emit('getSelectedPatient', value);
              $scope.selectedPatient = value;
              $scope.patientId = StorageService.get('logged').patientID;
            }
          });
        } else{
          $scope.selectedPatient = response.data.patients[0];
          $scope.$emit('getSelectedPatient', $scope.selectedPatient);
          $scope.patientId = $scope.selectedPatient.userId;
          var logged = StorageService.get('logged');
          logged.patientID = $scope.patientId
          StorageService.save('logged', logged);
        }
        $scope.$emit('getPatients', $scope.patients);
        if($state.current.name === 'caregiverDashboardClinicHCP'){
          $scope.initPatientClinicHCPs();
        } else if($state.current.name === 'caregiverDashboardDeviceProtocol'){
          $scope.initPatientDeviceProtocol();
        } else if($state.current.name === 'caregiverDashboard'){
          $scope.initGraph();
        }
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.isActive = function(tab) {
      var path = $location.path();
      if (path.indexOf(tab) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    $scope.$on('switchPatientCareGiver',function(event,patient){
      $scope.switchPatient(patient);
    });

    $scope.$on('switchCaregiverTab',function(event,state){
      $scope.switchCaregiverTab(state);
    });

    $scope.switchPatient = function(patient){
      if($scope.selectedPatient.userId !== patient.userId){
        $scope.selectedPatient = patient;
        $scope.patientId = $scope.selectedPatient.userId;
        $scope.$emit('getSelectedPatient', $scope.selectedPatient);
        var logged = StorageService.get('logged');
        logged.patientID = $scope.patientId
        StorageService.save('logged',logged);
         if($state.current.name === 'caregiverDashboardClinicHCP'){
          $scope.initPatientClinicHCPs();
        } else if($state.current.name === 'caregiverDashboardDeviceProtocol'){
          $scope.initPatientDeviceProtocol();
        } else if($state.current.name === 'caregiverDashboard'){
          $scope.initGraph();
        }
      }
    };

    $scope.switchCaregiverTab = function(status){
      $scope.caregiverTab = status;
      $state.go(status, {'caregiverId': $stateParams.caregiverId});
    };
    /*caregiver code ends*/
    $scope.calculateDateFromPicker = function(picker) {
      $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();
      $scope.toTimeStamp = new Date(picker.endDate._d).getTime();
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      if ($scope.fromDate === $scope.toDate ) {
        $scope.fromTimeStamp = $scope.toTimeStamp;
      }
    };

    $scope.removeGraph = function() {
      d3.selectAll('#complianceGraph svg').selectAll("*").remove();
      d3.selectAll('#HMRLineGraph svg').selectAll("*").remove();
      d3.selectAll('svg').selectAll("*").remove();
    }

    $scope.hmrBarSetMinMax = function() {
      var values = [];
      values.push($scope.yAxisRangeForHMRBar.min);
      values.push($scope.yAxisRangeForHMRBar.max);
      return values;
    }

    $scope.hmrLineSetMinMax = function() {
      var values = [];
      values.push($scope.yAxisRangeForHMRLine.min);
      values.push($scope.yAxisRangeForHMRLine.max);
      return values;
    }

    $scope.drawGraph = function() {
      var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
      if(days === 0 && $scope.selectedGraph === 'HMR'){
        $scope.format = 'dayWise';
        $scope.hmrLineGraph = false;
        $scope.hmrBarGraph = true;
        $scope.removeGraph();
        $scope.getDayHMRGraphData(false, false, "hmrBarGraphWrapper", true);
      } else if(days === 0 && $scope.selectedGraph === 'COMPLIANCE'){        
        $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');        
        $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');        
        $scope.getComplianceGraphData();
      } else if(days <= patientDashboard.maxDaysForWeeklyGraph) {
        $scope.weeklyChart($scope.fromTimeStamp);
      } else if ( days > patientDashboard.maxDaysForWeeklyGraph && days <= patientDashboard.minDaysForMonthlyGraph ) {
        $scope.monthlyChart($scope.fromTimeStamp);
      } else if ( days > patientDashboard.minDaysForMonthlyGraph) {
         $scope.yearlyChart($scope.fromTimeStamp);
      }
    };

    $scope.disableDatesInDatePicker = function() {
      var datePickerCount = document.getElementsByClassName('input-mini').length;
      var count = 5;
      $scope.waitFunction = function waitHandler() {
         datePickerCount = document.getElementsByClassName('input-mini').length;
        if(datePickerCount > 0 || count === 0 ) {
          //$scope.customizationForBarGraph();
          while(datePickerCount >0){
            document.getElementsByClassName('input-mini')[datePickerCount-1].setAttribute("disabled", "true");
            datePickerCount --;
          }
          return false;
        } else {
          count --;
        }
        $timeout(waitHandler, 1000);
      }
      $scope.waitFunction();
    }
    $scope.plotNoDataAvailable = function() {
      $scope.noDataAvailable = true;
      $scope.removeGraph();
    };
    $scope.opts = {
      maxDate: new Date(),
      format: patientDashboard.dateFormat,
      dateLimit: {"months":patientDashboard.maxDurationInMonths},
      eventHandlers: {'apply.daterangepicker': function(ev, picker) {           
        $scope.removeGraph();
        $scope.addCanvasToDOM();
        $scope.hideNotesCSS();
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
          $scope.missedtherapyDays = response.data.missedTherapyCount;
          $scope.settingsDeviatedDaysCount = response.data.settingsDeviatedDaysCount;
          $scope.hmrRunRate = response.data.hmrRunRate;
          $scope.adherenceScore = response.data.score;
        }
      });
    };

    $scope.adherence = {
        animate:{
            duration:3000,
            enabled:true
        },
        barColor:'#41ae76',
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
        barColor:'#8c6bb1',
        trackColor: '#ccc',
        scaleColor: false,
        lineWidth:12,
        lineCap:'circle'
    };
  $scope.missedtherapy = {
          animate:{
              duration:3000,
              enabled:true
          },
          barColor:'#ef6548',
          trackColor: '#ccc',
          scaleColor: false,
          lineWidth:12,
          lineCap:'circle'
      };

    $scope.settingDeviation = {
          animate:{
              duration:3000,
              enabled:true
          },
          barColor:'#4eb3d3',
          trackColor: '#ccc',
          scaleColor: false,
          lineWidth:12,
          lineCap:'circle'
      };


 /*---Simple pye chart JS END-----*/
    $scope.isActivePatientTab = function(tab) {
      if ($scope.patientTab.indexOf(tab) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    $scope.switchPatientTab = function(status){
      $scope.patientTab = status;
      if($scope.role === 'HCP'){
        $state.go('hcp'+status, {'patientId': $stateParams.patientId});
      }else if($scope.role === loginConstants.role.acctservices){
        $state.go(status+loginConstants.role.Rcadmin, {'patientId': $stateParams.patientId});
      }else if($scope.role === loginConstants.role.associates){
        $state.go('associate' + status, {'patientId': $stateParams.patientId});
      }else {
        $state.go(status, {'patientId': $stateParams.patientId});
      }
    };

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

    $scope.toolTipContentStepChart = function(){
      return function(key, x, y, e, graph) {
        var toolTip = '';
        angular.forEach($scope.completeGraphData.actual, function(value) {
          if(value.timestamp === e.point.x){
            toolTip = graphUtil.getToolTipForStepChart(value);
          }
        });
      return toolTip;
      }
    };

    $scope.toolTipContentBarChart = function(){
      return function(key, x, y, e, graph) {
        var toolTip = '';
        angular.forEach($scope.completeGraphData, function(value) {
          if(value.start === e.point.x){
              toolTip = graphUtil.getToolTipForBarChart(value);
          }
        });
      return toolTip;
      }
    };

    $scope.toolTipContentForCompliance = function(data){
      return function(key, x, y, e, graph) {
        var toolTip = '';
        angular.forEach(data, function(value) {
          if(value.start === e.point.x){
              toolTip =  graphUtil.getToolTipForCompliance(value);
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

    $scope.xAxisTickValuesBarChart = function() {
      return function(d){
        var tickVals = [];
        var values = d[0].values;
        for(var i in values){
          tickVals.push(values[i][0]);
        }
        return tickVals;
      };
    };

    $scope.showHmrGraph = function() {     
      $scope.addCanvasToDOM();
      $scope.selectedGraph = 'HMR';
      $scope.complianceGraph = false;
      $scope.hmrGraph = true;
      $scope.removeGraph();
      $scope.drawGraph();
    };

    $scope.getHiddenComplianceForPDF = function(pressure, frequency, duration, hiddenDivName, hiddenSVGId, graphType, callback, callbackDivId, callbackSvgId, callbackGraphType) {     
      patientDashBoardService.getcomplianceGraphData($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.groupBy).then(function(complianceResponse){            
          if(complianceResponse.data && complianceResponse.data.actual){
            $scope.hiddencompliance = {};
            $scope.completeComplianceData = complianceResponse.data;          
            $scope.hiddencompliance.pressure = pressure;
            $scope.hiddencompliance.frequency = frequency;
            $scope.hiddencompliance.duration = duration;            
            $scope.completeComplianceData = graphUtil.convertIntoServerTimeZone($scope.completeComplianceData,patientDashboard.complianceGraph);
            $scope.minFrequency = $scope.completeComplianceData.recommended.minFrequency;
            $scope.maxFrequency = $scope.completeComplianceData.recommended.maxFrequency;
            $scope.minPressure = $scope.completeComplianceData.recommended.minPressure;
            $scope.maxPressure = $scope.completeComplianceData.recommended.maxPressure;
            $scope.minDuration = $scope.completeComplianceData.recommended.minMinutesPerTreatment * $scope.completeComplianceData.recommended.treatmentsPerDay;          
            $scope.yAxisRangeForCompliance = graphUtil.getYaxisRangeComplianceGraph($scope.completeComplianceData);
            $scope.completecomplianceGraphData = graphUtil.convertIntoComplianceGraph($scope.completeComplianceData.actual);
            $scope.yAxis1Max = $scope.yAxisRangeForCompliance.maxDuration;
            $scope.createHiddenComplianceGraphData();
            $scope.isComplianceExist = true;
            if(callback){
              $scope.drawHiddenComplianceGraph(hiddenDivName, hiddenSVGId, "hidden", graphType, callback, callbackDivId, callbackSvgId, callbackGraphType);
            }else{
              $scope.drawHiddenComplianceGraph(hiddenDivName, hiddenSVGId, "hidden", graphType);
            }
                         
          }
        }); 
    };

     $scope.drawComplianceGraph = function() {
        $scope.drawHMRGraphForPDF();      
        $scope.getHiddenComplianceForPDF(!$scope.compliance.pressure, !$scope.compliance.frequency, !$scope.compliance.duration, "complianceGraph1", "compCompliance1", "compliance1"); 
        
        nv.addGraph(function() {
        var chart = nv.models.multiChart()
        .margin({top: 30, right: 70, bottom: 50, left: 70})
        .showLegend(false)
        .color(d3.scale.category10().range());
       // chart.noData("Nothing to see here.");
        chart.tooltipContent($scope.toolTipContentForCompliance($scope.completeComplianceData.actual));
        //this function to put x-axis labels
        var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp),
        totalDataPoints = $scope.complianceGraphData[0].values.length,
              tickCount = parseInt(totalDataPoints/12);
        if(days === 0 && $scope.completeComplianceData.actual.length === 1){
          chart.xAxis.showMaxMin(false).tickValues($scope.complianceGraphData[0].values.map( function(d){return d.x;} ) ).tickFormat(function(d) {
              return d3.time.format('%I:%M %p')(new Date(d));
              return dateService.getTimeIntervalFromTimeStamp(d);
          });
        }else{
          chart.xAxis.showMaxMin(true).tickFormat(function(d) {return d3.time.format('%d-%b-%y')(new Date(d));});
        }
              
        chart.yAxis1.tickFormat(d3.format('d'));
        chart.yAxis2.tickFormat(d3.format('d'));
        if($scope.yAxis1Min === 0 && $scope.yAxis1Max === 0){
          chart.yDomain1([$scope.yAxis1Min,1]);
        }else{
          chart.yDomain1([$scope.yAxis1Min,$scope.yAxis1Max]);
        }
        if($scope.yAxis2Min === 0 && $scope.yAxis2Max === 0){
          chart.yDomain2([$scope.yAxis2Min,1]);
        }else{
          chart.yDomain2([$scope.yAxis2Min,$scope.yAxis2Max]);
        }
        var data =  $scope.complianceGraphData;
           angular.forEach(data, function(value) {
                if(value.yAxis === 1){
                  chart.yAxis1.axisLabel(value.key);
                }
                 if(value.yAxis === 2){
                  chart.yAxis2.axisLabel(value.key);
                }
          });

          // TODO: Remove the sorting once the ordering fixed in the backend
          angular.forEach($scope.complianceGraphData, function(graphData){
            graphData.values = $filter('orderBy')(graphData.values, 'x');
          })
          // TODO: Remove the sorting once the ordering fixed in the backend

         d3.select('#complianceGraph svg')
        .datum($scope.complianceGraphData)
        .transition().duration(500).call(chart);
         d3.selectAll('#complianceGraph svg').style("visibility", "hidden");
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

           var missedTherapy = {};
           if($scope.complianceGraphData[0] && $scope.complianceGraphData[0].values.length > 20){
            missedTherapy.cssClass = "fill: #cf202f;stroke: #cf202f;stroke-width: 1.5;fill-opacity: 0;";//'missed_therapy_year_node';
            missedTherapy.radius = 0.7;
           } else {
            missedTherapy.cssClass = 'fill: #cf202f;stroke: #fff;stroke-width: 1.5;fill-opacity: 1;';//'missed_therapy_node';
            missedTherapy.radius = 3;
           }

           angular.forEach(missedTherapyCircles,function(circle){
            d3.select('#complianceGraph svg').selectAll('.nv-group.nv-series-0').append('circle')
            .attr('cx',circle.attributes.cx.value)
            .attr('cy',circle.attributes.cy.value)
            .attr('r',missedTherapy.radius)
            .attr('style', missedTherapy.cssClass);
           })

           /* Mark red color for missed therapy  -- end --*/
           setTimeout(function(){

           var bgHeight = d3.select('#complianceGraph svg').select('.y1 .tick line').attr("y2") > 0 ? d3.select('#complianceGraph svg').select('.y1 .tick line').attr("y2") : 0.5;
           var bgWidth = d3.select('#complianceGraph svg ').select('.y1 .tick line').attr("x2");
           d3.select('#complianceGraph svg .nv-axis g').append('rect')
                    .attr("height", Math.abs(bgHeight))
                    .attr("width", bgWidth)
                    .attr("x" , 0)
                    .attr("y" , bgHeight)
                    .attr("style", "fill: #aeb5be; stroke:  #aeb5be; stroke-width: 1; ");
                    //.attr("class" , "svg_bg");
           },500);

            /*UI Changes for Line Graph*/
          d3.selectAll('#complianceGraph svg').selectAll(".nv-axis .tick").append('circle').
          attr("cx" , 0).
          attr("cy", 0).
          attr("r" , 2.3).
          attr("fill" , '#aeb5be');



          var y1AxisMark = d3.select('#complianceGraph svg').selectAll('.y1.axis').selectAll('.nvd3.nv-wrap.nv-axis');
          var y2AxisMark = d3.select('#complianceGraph svg').selectAll('.y2.axis').selectAll('.nvd3.nv-wrap.nv-axis');
          var y1AxisMinMax = d3.select('#complianceGraph svg').selectAll('.y1.axis').selectAll('.nvd3.nv-wrap.nv-axis').select('.nv-axisMaxMin').attr("transform");
          var y2AxisMinMax = d3.select('#complianceGraph svg').selectAll('.y2.axis').selectAll('.nvd3.nv-wrap.nv-axis').select('.nv-axisMaxMin').attr("transform");
          /* fix for IE browser*/
          var delimiter = ' ';
          if(y1AxisMinMax.indexOf(",") > -1){
            delimiter = ','
          } else if(y2AxisMinMax.indexOf(" ") === -1){
            y2AxisMinMax = "translate(0 0)";
          }
          /*fix for IE browser ends*/
          var maxTransform = parseInt(y1AxisMinMax.split(delimiter)[1].replace(y1AxisMinMax,')',''));
          $scope.y1AxisTransformRate = (($scope.yAxis1Max - $scope.yAxis1Min) > 0) ? parseInt(y1AxisMinMax.split(delimiter)[1].replace(y1AxisMinMax,')',''))/($scope.yAxis1Max - $scope.yAxis1Min) : 0;
          $scope.y2AxisTransformRate = (($scope.yAxis2Max - $scope.yAxis2Min) > 0) ? parseInt(y2AxisMinMax.split(delimiter)[1].replace(y2AxisMinMax,')',''))/($scope.yAxis2Max - $scope.yAxis2Min) : 0;
          var y1LineLength = d3.select('#complianceGraph svg').selectAll('.y1.axis').selectAll('.nvd3.nv-wrap.nv-axis').selectAll('line').attr('x2');
          var y2LineLength = d3.select('#complianceGraph svg').selectAll('.y2.axis').selectAll('.nvd3.nv-wrap.nv-axis').selectAll('line').attr('x2');
          $scope.getMinMaxForComplianceGraph();
          var y1AxisMinTransform = maxTransform - parseInt($scope.y1AxisTransformRate * $scope.yAxis1MinMark);
          var y1AxisMaxTransform = maxTransform - parseInt($scope.y1AxisTransformRate * $scope.yAxis1MaxMark);
          var y2AxisMinTransform = maxTransform - parseInt($scope.y2AxisTransformRate * $scope.yAxis2MinMark);
          var y2AxisMaxTransform = maxTransform - parseInt($scope.y2AxisTransformRate * $scope.yAxis2MaxMark);

          
          y1AxisMark.append('g').
          attr('class','minRecommendedLevel').
          attr('transform','translate(-45, '+ y1AxisMinTransform + ')').
          append('text').
          text('MIN').
          style('fill','red');

          if(!$scope.isYAxis1Duration){  
            y1AxisMark.append('g').
            attr('class','maxRecommendedLevel').
            attr('transform','translate(-45,'+ y1AxisMaxTransform + ')').
            append('text').
            text('MAX').
            style('fill','green');
          }

          
          y2AxisMark.append('g').
          attr('class','minRecommendedLevel').
          attr('transform','translate(20,'+ (y2AxisMinTransform + 3) + ')').
          append('text').
          text('MIN').
          style('fill','red');

          if(!$scope.isYAxis2Duration){
            y2AxisMark.append('g').
            attr('class','maxRecommendedLevel').
            attr('transform','translate(20,'+ (y2AxisMaxTransform + 3) + ')').
            append('text').
            text('MAX').
            style('fill','green');
          }
        }
        d3.selectAll('#complianceGraph svg').selectAll(".x.axis .tick").selectAll('text').
          attr("dy" , 12);

          d3.selectAll('#complianceGraph svg').selectAll(".x.axis .nv-axisMaxMin").selectAll('text').
          attr("dy" , 12);

          if(days === 0 && $scope.completeComplianceData.actual.length === 1){
            d3.selectAll('#complianceGraph svg').selectAll(".x.axis .tick").selectAll('text').attr("dx" , 488);
          }
          if($scope.complianceGraphData[0] && $scope.complianceGraphData[0].values.length > 20) {
            setTimeout(function() {
              d3.selectAll('#complianceGraph svg').selectAll('.multiChart circle.nv-point').attr("r", "0");
              d3.selectAll('#complianceGraph svg').style("visibility", "visible");
          }, 500);
        } else {
          d3.selectAll('#complianceGraph svg').selectAll('.multiChart circle.nv-point').attr("r", "1.3");
          d3.selectAll('#complianceGraph svg').style("visibility", "visible");
        }
        if(!$scope.compliance.secondaryYaxis || $scope.compliance.secondaryYaxis.length <= 0){
          d3.selectAll('#complianceGraph svg').selectAll(".nvd3 .y2.axis").attr("visibility", "hidden");
        }

        d3.selectAll('#complianceGraph svg').selectAll(".nvd3 .nv-axis path.domain").attr('fill', '#ccc');
        d3.selectAll('#complianceGraph svg').selectAll(".nvd3 .nv-axis path.domain").attr('stroke-width', '1');
        d3.selectAll('#complianceGraph svg').selectAll(".nvd3 .nv-axis path.domain").attr('stroke', '#ccc');
        d3.selectAll('#complianceGraph svg').selectAll(".nvd3 .nv-axis path.domain").attr('stroke-opacity', '.75');
        d3.selectAll('#complianceGraph svg').selectAll(".nv-groups .nv-point").attr("style", "stroke-opacity: 1 !important;stroke-width: 3px !important;");                    
        return chart;
      },function(){
          $timeout(function() { 
            d3.selectAll('#complianceGraph svg').selectAll('g.nv-single-point g.nv-point-paths path').attr('stroke', '#aaa');
            d3.selectAll('#complianceGraph svg').selectAll('g.nv-single-point g.nv-point-paths path').attr('stroke-opacity', '0');
            d3.selectAll('#complianceGraph svg').selectAll('g.nv-single-point g.nv-point-paths path').attr('fill', '#eee');
            d3.selectAll('#complianceGraph svg').selectAll('g.nv-single-point g.nv-point-paths path').attr('fill-opacity', '0');                          
            if($('#complianceGraph').find('g.nv-single-point').length > 0){
              d3.selectAll('#complianceGraph svg').selectAll('g.nv-areaWrap path.nv-area.nv-area-0').attr("style", "stroke: #aaa; stroke-opacity: 0; fill: #eee; fill-opacity: 0;");
            }
            d3.selectAll('#complianceGraph svg').selectAll('.nvd3.nv-stackedarea path.nv-area').attr("fill-opacity", ".7");
            $scope.isGraphReady();          
          },1500);
        });
    };

    $scope.drawHMRGraphForPDF = function() {
      var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);    
      if(days === 0){        
        $scope.getDayHMRGraphData("complianceGraphHMR", "complianceHMR", "complianceGraphHMR", false, "hidden");
      } else {
        $scope.getNonDayHMRGraphData("complianceGraphHMR", "complianceHMR", "complianceGraphHMR", false, "hidden");
      } 
    };

    $scope.createHiddenComplianceGraphData = function() {
      delete $scope.complianceGraphData ;
      $scope.complianceGraphData = [];
      var count = 0;
      $scope.hiddencompliance.secondaryYaxis = '';
      $scope.hiddencompliance.primaryYaxis = '';
      angular.forEach($scope.completecomplianceGraphData, function(value) {
        if(value.key.indexOf("pressure") >= 0 && $scope.hiddencompliance.pressure === true){
          value.yAxis = ++count;
          value.color = '#ff9829';
          if(count === 1){
            $scope.yAxis1Max = $scope.yAxisRangeForCompliance.maxPressure;
            $scope.hiddencompliance.primaryYaxis = 'pressure';
          } else if(count === 2){
            $scope.yAxis2Max = $scope.yAxisRangeForCompliance.maxPressure;
            $scope.hiddencompliance.secondaryYaxis = 'pressure';
          }
          $scope.complianceGraphData.push(value);
        }
        if(value.key.indexOf("duration") >= 0 && $scope.hiddencompliance.duration === true){
          value.yAxis = ++count;
          value.color = '#4e95c4';
          if(count === 1){
            $scope.yAxis1Max = $scope.yAxisRangeForCompliance.maxDuration;
            $scope.hiddencompliance.primaryYaxis = 'duration';
          } else if(count === 2){
            $scope.yAxis2Max = $scope.yAxisRangeForCompliance.maxDuration;
            $scope.hiddencompliance.secondaryYaxis = 'duration';
          }
          $scope.complianceGraphData.push(value);
        }
        if(value.key.indexOf("frequency") >= 0  && $scope.hiddencompliance.frequency === true){
          value.yAxis = ++count;
          value.color = '#34978f';
          if(count === 1){
            $scope.yAxis1Max = $scope.yAxisRangeForCompliance.maxFrequency;
            $scope.hiddencompliance.primaryYaxis = 'frequency';
          } else if(count === 2){
            $scope.yAxis2Max = $scope.yAxisRangeForCompliance.maxFrequency;
            $scope.hiddencompliance.secondaryYaxis = 'frequency';
          }
          $scope.complianceGraphData.push(value);
        }
      });
      if( $scope.hiddencompliance.frequency === false && $scope.hiddencompliance.duration === false && $scope.hiddencompliance.pressure === false){
        $scope.yAxis1Max = 0;
        $scope.yAxis2Max = 0;
      }
    };
    $scope.getNonDayHMRGraphData = function(divId, svgId, wrapperDiv, isDrawCompliance, graphVisibility) {
      if(isDrawCompliance){            
        $scope.getHiddenComplianceForPDF(true, true, false, "hmrLineGraphCompliance", "hmrCompliance", "compliance", $scope.getHiddenComplianceForPDF, "hmrLineGraphCompliance1", "hmrCompliance1", "compliance1");
      }
      graphVisibility = graphVisibility ? graphVisibility : "visible";
      var graphId = '#hmrLineGraphSVG svg#hmrLineSVG';
      wrapperDiv = (wrapperDiv) ? wrapperDiv : "hmrLineGraphSVG";
      if(divId && svgId){
        graphId = '#'+divId+' svg#'+svgId;
      }
      patientDashBoardService.getHMRGraphPoints($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.groupBy).then(function(response){
        $scope.responseDataForGraph = response.data;
        $scope.completeGraphData = response.data;
        if($scope.completeGraphData.actual === undefined){
          $scope.graphData = [];
          $scope.plotNoDataAvailable();
        } else {
          $scope.toDate = ($scope.completeGraphData.actual) ? dateService.getDateFromTimeStamp(dateService.convertMMDDYYYYHHMMSSstamp($scope.completeGraphData.actual[$scope.completeGraphData.actual.length-1].timestamp),patientDashboard.dateFormat, '/' ) : dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
          $scope.noDataAvailable = false;
          $scope.completeGraphData = graphUtil.convertIntoServerTimeZone($scope.completeGraphData,patientDashboard.hmrNonDayGraph);
          $scope.yAxisRangeForHMRLine = graphUtil.getYaxisRangeLineGraph($scope.completeGraphData);
          $scope.graphData = graphUtil.convertToHMRStepGraph($scope.completeGraphData,patientDashboard.HMRLineGraphColor,$scope.yAxisRangeForHMRLine.unit);
          /* waiting until svg element loads*/
          var count =5;
          $scope.waitFunction = function waitHandler() {
             var svgCount = document.getElementsByTagName('svg').length;
            if(svgCount > 0 || count === 0 ) {
              $scope.drawHMRLineGraph(graphId, wrapperDiv, isDrawCompliance, graphVisibility);
              $timeout.cancel(waitHandler);
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
        $scope.plotNoDataAvailable();
      });
    };

    $scope.reCreateComplianceGraph = function() {
      $scope.addCanvasToDOM();      
      $scope.handlelegends();      
      $scope.getComplianceGraphData();
    };

    $scope.isLegendEnabled = function(legendFlag){
      $scope.minComplianceParamErrMsg = false;
      $scope.complianceParamErrMsg = false;
      var count = $scope.getCountLegends();
      if(count === 1){
        notyService.showMessage(notyMessages.minComplianceError, notyMessages.typeWarning );
        $scope.minComplianceParamErrMsg = true;
      }else if(count >= 2){
        notyService.showMessage(notyMessages.maxComplianceError, notyMessages.typeWarning );
        $scope.complianceParamErrMsg = true;
      }
    };

    $scope.getCountLegends = function(){
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
      return count;
    };

    $scope.handlelegends = function() {
      $scope.minComplianceParamErrMsg = false;
      $scope.complianceParamErrMsg = false;
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

    $scope.getDayHMRGraphData = function(divId, svgId, wrapperDiv, isDrawCompliance, graphVisibility) {
      graphVisibility = graphVisibility ? graphVisibility : "visible";
      var graphId = '#hmrBarGraph svg';
      wrapperDiv = (wrapperDiv) ? wrapperDiv : "hmrBarGraphWrapper";
      if(divId && svgId){
        graphId = '#'+divId+' svg#'+svgId;
      }
      patientDashBoardService.getHMRBarGraphPoints($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-')).then(function(response){
        $scope.completeGraphData = response.data;
        if($scope.completeGraphData.actual === undefined){
           $scope.hmrBarGraphData = [];
           $scope.yAxisRangeForHMRBar = {};
           $scope.yAxisRangeForHMRBar.min = 0;
           $scope.yAxisRangeForHMRBar.max = 0;
           $scope.plotNoDataAvailable();
         } else {
          var allMissedTherapy = ($scope.completeGraphData.actual.length === 1 && $scope.completeGraphData.actual[0].missedTherapy) ? true: false;
          if(!allMissedTherapy){            
            $scope.noDataAvailable = false;
            $scope.completeGraphData = graphUtil.convertIntoServerTimeZone($scope.completeGraphData,patientDashboard.hmrDayGraph);
            $scope.completeGraphData = graphUtil.formatDayWiseDate($scope.completeGraphData.actual);
            $scope.yAxisRangeForHMRBar = graphUtil.getYaxisRangeBarGraph($scope.completeGraphData);
            $scope.hmrBarGraphData = graphUtil.convertToHMRBarGraph($scope.completeGraphData,patientDashboard.HMRBarGraphColor,$scope.yAxisRangeForHMRBar.unit);
            $scope.drawHMRBarGraph(graphId);
            var barCount= d3.select(graphId).selectAll('.nv-group .nv-bar')[0].length;
            var count = 5;
            $scope.waitFunction = function waitHandler() {
               barCount = d3.select(graphId).selectAll('.nv-group .nv-bar')[0].length;
              if(barCount > 0 || count === 0 ) {
                $scope.customizationForBarGraph(graphId, isDrawCompliance, wrapperDiv, graphVisibility);
                return false;
              } else {
                count --;
              }
              $timeout(waitHandler, 1000);              
            }
            $scope.waitFunction();
          }else{
            $scope.hmrBarGraphData = [];
            $scope.yAxisRangeForHMRBar = {};
            $scope.yAxisRangeForHMRBar.min = 0;
            $scope.yAxisRangeForHMRBar.max = 0;
            $scope.plotNoDataAvailable();
          }
          //
         }
      }).catch(function(response) {
        $scope.hmrBarGraphData = [];
        $scope.plotNoDataAvailable();
      });
    };

    $scope.customizationForBarGraph = function(graphId, isDrawCompliance, wrapperDiv, graphVisibility) {
      var rect_width,  rect_height;
        rect_height = d3.select(graphId).select('.nv-barsWrap .nv-wrap rect').attr('height');
        rect_width = d3.select(graphId).select('.nv-barsWrap .nv-wrap rect').attr('width');


        d3.select(graphId).select('.nv-y .nv-wrap g').append('rect')
        .attr("width", rect_width)
        .attr("height" , rect_height)
        .attr("x" , 0)
        .attr("y" , 0 ).attr("style", "fill: #CCDBEA;opacity: 0.5;");
        //.attr("class" , 'svg_bg');

        d3.selectAll(graphId).selectAll(".nv-axis .tick").append('circle').
        attr("cx" , 0).
        attr("cy", 0).
        attr("r" , 2.3).
        attr("fill" , '#aeb5be');

        //d3.selectAll(graphId).selectAll(".nvd3 .nv-x line").attr("style", "opacity: 0 !important;"); 
        d3.selectAll(graphId).selectAll(".nv-axis .tick text ").attr("style", "fill: #5d6a7d; font-size: 10px;text-anchor: end;");
        d3.selectAll(graphId).selectAll(".nv-axisMaxMin text ").attr("style", "fill: #5d6a7d;font-size: 10px;font-weight: normal;text-anchor: end;");
        d3.selectAll(graphId).selectAll(".nv-axis .nv-axislabel").attr("style", "font: 12px Arial; fill: #5d6a7d;text-anchor: middle;");
        //d3.selectAll (graphId).selectAll(".nvd3 .nv-groups path.nv-line").attr("style", "fill: none; stroke-width: 1.5px;");


        angular.forEach(d3.select(graphId).selectAll('rect.nv-bar')[0], function(bar){
          d3.select(bar).attr("width", d3.select(bar).attr("width")/4);
          d3.select(bar).attr("x", d3.select(bar).attr("width")*1.5);
          d3.select(bar).style({'fill-opacity': '1'});
        });

        d3.select(graphId).style("visibility", graphVisibility);
        $(hiddenFrame).remove();       
        $scope.isGraphReady();
        if(isDrawCompliance){
          $timeout(function() {
            $scope.getHiddenComplianceForPDF(true, false, true, "hmrBarGraphCompliance", "hmrCompliance", "compliance", $scope.getHiddenComplianceForPDF, "hmrBarGraphCompliance1", "hmrCompliance1", "compliance1");           
          }, 500);  
        }
      //},1500);
    };

    $scope.getComplianceGraphData = function(format) {
      patientDashBoardService.getcomplianceGraphData($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.groupBy).then(function(response){
        $scope.completeComplianceData = response.data;        
        if($scope.completeComplianceData.actual === undefined){
          $scope.complianceGraphData = [];
          $scope.plotNoDataAvailable();
          $scope.isComplianceExist = false;
        }
         else {
          //recommended values
          $scope.toDate = ($scope.completeComplianceData.actual) ? dateService.getDateFromTimeStamp(dateService.convertMMDDYYYYHHMMSSstamp($scope.completeComplianceData.actual[$scope.completeComplianceData.actual.length-1].timestamp),patientDashboard.dateFormat, '/' ) : dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
          $scope.noDataAvailable = false;
          $scope.completeComplianceData = graphUtil.convertIntoServerTimeZone($scope.completeComplianceData,patientDashboard.complianceGraph);
          $scope.minFrequency = $scope.completeComplianceData.recommended.minFrequency;
          $scope.maxFrequency = $scope.completeComplianceData.recommended.maxFrequency;
          $scope.minPressure = $scope.completeComplianceData.recommended.minPressure;
          $scope.maxPressure = $scope.completeComplianceData.recommended.maxPressure;
          $scope.minDuration = $scope.completeComplianceData.recommended.minMinutesPerTreatment * $scope.completeComplianceData.recommended.treatmentsPerDay;          
          $scope.yAxisRangeForCompliance = graphUtil.getYaxisRangeComplianceGraph($scope.completeComplianceData);
          $scope.completecomplianceGraphData = graphUtil.convertIntoComplianceGraph($scope.completeComplianceData.actual);
          $scope.yAxis1Max = $scope.yAxisRangeForCompliance.maxDuration;
          $scope.createComplianceGraphData();
          $scope.isComplianceExist = true;
          $scope.drawComplianceGraph();          
        }
      }).catch(function(response) {
        $scope.complianceGraphData = [];
        $scope.plotNoDataAvailable();
        $scope.isComplianceExist = false;
      });
    };

    $scope.calculateTimeDuration = function(durationInDays) {
      $scope.toTimeStamp = new Date().getTime();
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
    };

    $scope.drawChart = function(datePicker,dateOption,groupByOption,durationInDays) {
      $scope.noDataAvailable = false;
      $scope.selectedDateOption = dateOption;
      $scope.removeGraph();
      if(datePicker === undefined){
        $scope.calculateTimeDuration(parseInt(durationInDays));
        $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      }
      $scope.format = $scope.groupBy = groupByOption;
      if($scope.hmrGraph) {
        $scope.hmrLineGraph = true;
        $scope.hmrBarGraph = false;
        $scope.getNonDayHMRGraphData(false, false, false, true);
      } else if ($scope.complianceGraph) {
        $scope.getComplianceGraphData();
      }
    }

    // Weekly chart
    $scope.weeklyChart = function(datePicker) {
      $scope.addCanvasToDOM();
      $scope.drawChart(datePicker,'WEEK','weekly',6);
    };

    // Yearly chart
    $scope.yearlyChart = function(datePicker) {
      $scope.addCanvasToDOM();
      $scope.drawChart(datePicker,'YEAR','yearly',365);
    };

    // Monthly chart
    $scope.monthlyChart = function(datePicker) {
      $scope.addCanvasToDOM();
      $scope.drawChart(datePicker,'MONTH','monthly',30);
    };
    //hmrDayChart
    $scope.dayChart = function() {
      $scope.addCanvasToDOM();
      $scope.selectedDateOption = 'DAY';
      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.fromDate};
      $scope.removeGraph();
       if($scope.hmrGraph) {
        $scope.format = 'dayWise';
        $scope.hmrLineGraph = false;
        $scope.hmrBarGraph = true;
        $scope.fromTimeStamp = new Date().getTime();
        $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
        $scope.toTimeStamp = $scope.fromTimeStamp;
        $scope.toDate = $scope.fromDate
        $scope.getDayHMRGraphData(false, false, false, true);
      }
    };


    $scope.showComplianceGraph = function() {
      $scope.addCanvasToDOM();
      $scope.compliance.pressure = $scope.compliance.duration = true;
      $scope.compliance.frequency = false;
      $scope.handlelegends();
      $scope.noDataAvailable = false;
      $scope.selectedGraph = 'COMPLIANCE';
      $scope.complianceGraph = true;
      $scope.hmrGraph = false;     
      $scope.getComplianceGraphData();
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
        value.color = '#ff9829';
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
        value.color = '#4e95c4';
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
        value.color = '#34978f';
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
            $scope.isYAxis1Duration = true;
            break;
        case "pressure":
            $scope.yAxis1MaxMark = $scope.maxPressure;
            $scope.yAxis1MinMark = $scope.minPressure;
            $scope.isYAxis1Duration = false;
            break;
        case "frequency":
            $scope.yAxis1MaxMark = $scope.maxFrequency;
            $scope.yAxis1MinMark = $scope.minFrequency;
            $scope.isYAxis1Duration = false;
            break;
        default:
            $scope.isYAxis1Duration = false;
            break;
    }
    switch($scope.compliance.secondaryYaxis) {
        case "duration":
            $scope.yAxis2MaxMark = $scope.maxDuration;
            $scope.yAxis2MinMark = $scope.minDuration;
            $scope.isYAxis2Duration = true;
            break;
        case "pressure":
            $scope.yAxis2MaxMark = $scope.maxPressure;
            $scope.yAxis2MinMark = $scope.minPressure;
            $scope.isYAxis2Duration = false;
            break;
        case "frequency":
            $scope.yAxis2MaxMark = $scope.maxFrequency;
            $scope.yAxis2MinMark = $scope.minFrequency;
            $scope.isYAxis2Duration = false;
            break;
        default:
            $scope.isYAxis2Duration = false;
            break;
    }
  };

  $scope.getMinMaxForHiddenComplianceGraph = function(){
    switch($scope.hiddencompliance.primaryYaxis) {
        case "duration":
            $scope.hiddenYAxis1MaxMark = $scope.maxDuration;
            $scope.hiddenYAxis1MinMark = $scope.minDuration;
            $scope.isHiddenYAxis1Duration = true;
            break;
        case "pressure":
            $scope.hiddenYAxis1MaxMark = $scope.maxPressure;
            $scope.hiddenYAxis1MinMark = $scope.minPressure;
            $scope.isHiddenYAxis1Duration = false;
            break;
        case "frequency":
            $scope.hiddenYAxis1MaxMark = $scope.maxFrequency;
            $scope.hiddenYAxis1MinMark = $scope.minFrequency;
            $scope.isHiddenYAxis1Duration = false;
            break;
        default:
            $scope.isHiddenYAxis1Duration = false;
            break;
    }
    switch($scope.hiddencompliance.secondaryYaxis) {
        case "duration":
            $scope.hiddenYAxis2MaxMark = $scope.maxDuration;
            $scope.hiddenYAxis2MinMark = $scope.minDuration;
            $scope.isHiddenYAxis2Duration = true;
            break;
        case "pressure":
            $scope.hiddenYAxis2MaxMark = $scope.maxPressure;
            $scope.hiddenYAxis2MinMark = $scope.minPressure;
            $scope.isHiddenYAxis2Duration = false;
            break;
        case "frequency":
            $scope.hiddenYAxis2MaxMark = $scope.maxFrequency;
            $scope.hiddenYAxis2MinMark = $scope.minFrequency;
            $scope.isHiddenYAxis2Duration = false;
            break;
        default:
            $scope.isHiddenYAxis2Duration = false;
            break;
    }
  };

  $scope.drawHiddenComplianceGraph = function(divId, svgId, graphVisibility, graphType, callback, callbackDivId, callbackSvgId, callbackGraphType) {
      var graphId = "#"+divId+" svg#"+svgId;   
      nv.addGraph(function() {
      var chart = nv.models.multiChart()
      .margin({top: 30, right: 70, bottom: 50, left: 70})
      .showLegend(false)
      .color(d3.scale.category10().range());     
      var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp),
      totalDataPoints = $scope.complianceGraphData[0].values.length,
            tickCount = parseInt(totalDataPoints/12);
      if(days === 0 && $scope.completeComplianceData.actual.length === 1){
        chart.xAxis.showMaxMin(false).tickValues($scope.complianceGraphData[0].values.map( function(d){return d.x;} ) ).tickFormat(function(d) {
            return d3.time.format('%I:%M %p')(new Date(d));
            return dateService.getTimeIntervalFromTimeStamp(d);
        });
      }else{
        chart.xAxis.showMaxMin(true).tickFormat(function(d) {return d3.time.format('%d-%b-%y')(new Date(d));});
      }
            
      chart.yAxis1.tickFormat(d3.format('d'));
      chart.yAxis2.tickFormat(d3.format('d'));
      if($scope.yAxis1Min === 0 && $scope.yAxis1Max === 0){
        chart.yDomain1([$scope.yAxis1Min,1]);
      }else{
        chart.yDomain1([$scope.yAxis1Min,$scope.yAxis1Max]);
      }
      if($scope.yAxis2Min === 0 && $scope.yAxis2Max === 0){
        chart.yDomain2([$scope.yAxis2Min,1]);
      }else{
        chart.yDomain2([$scope.yAxis2Min,$scope.yAxis2Max]);
      }
      var data =  $scope.complianceGraphData;
         angular.forEach(data, function(value) {
              if(value.yAxis === 1){
                chart.yAxis1.axisLabel(value.key);
              }
               if(value.yAxis === 2){
                chart.yAxis2.axisLabel(value.key);
              }
        });

        // TODO: Remove the sorting once the ordering fixed in the backend
        angular.forEach($scope.complianceGraphData, function(graphData){
          graphData.values = $filter('orderBy')(graphData.values, 'x');
        })
        // TODO: Remove the sorting once the ordering fixed in the backend

       d3.select(graphId)
      .datum($scope.complianceGraphData)
      .transition().duration(0).call(chart);
       d3.selectAll(graphId).style("visibility", "hidden");
        if( $scope.hiddencompliance.frequency === false && $scope.hiddencompliance.duration === false && $scope.hiddencompliance.pressure === false){

        } else {

          /* Mark red color for missed therapy  -- start --*/
         var circlesInCompliance = d3.select(graphId).select('.nv-group.nv-series-0').selectAll('circle')[0];
         var count = 0;
         var missedTherapyCircles = [];
         angular.forEach($scope.completeComplianceData.actual,function(value){
          if(value.missedTherapy === true){
            missedTherapyCircles.push(circlesInCompliance[count]);
          }
          count++;
         })

         var missedTherapy = {};
         if($scope.complianceGraphData[0] && $scope.complianceGraphData[0].values.length > 20){
          missedTherapy.cssClass = "fill: #cf202f;stroke: #cf202f;stroke-width: 1.5;fill-opacity: 0;";//'missed_therapy_year_node';
          missedTherapy.radius = 0.7;
         } else {
          missedTherapy.cssClass = 'fill: #cf202f;stroke: #fff;stroke-width: 1.5;fill-opacity: 1;';//'missed_therapy_node';
          missedTherapy.radius = 3;
         }

         angular.forEach(missedTherapyCircles,function(circle){
          d3.select(graphId).selectAll('.nv-group.nv-series-0').append('circle')
          .attr('cx',circle.attributes.cx.value)
          .attr('cy',circle.attributes.cy.value)
          .attr('r',missedTherapy.radius)
          .attr('style', missedTherapy.cssClass);
         })

         /* Mark red color for missed therapy  -- end --*/
         setTimeout(function(){

         var bgHeight = d3.select(graphId).select('.y1 .tick line').attr("y2") > 0 ? d3.select(graphId).select('.y1 .tick line').attr("y2") : 0.1;
         var bgWidth = d3.select(graphId).select('.y1 .tick line').attr("x2");
         d3.select(graphId+' .nv-axis g').append('rect')
                  .attr("height", Math.abs(bgHeight))
                  .attr("width", bgWidth)
                  .attr("x" , 0)
                  .attr("y" , bgHeight)
                  .attr("style", "fill: #aeb5be; stroke:  #aeb5be; stroke-width: 1;");
         },500);

          /*UI Changes for Line Graph*/
        d3.selectAll(graphId).selectAll(".nv-axis .tick").append('circle').
        attr("cx" , 0).
        attr("cy", 0).
        attr("r" , 2.3).
        attr("fill" , '#aeb5be').attr("stroke" , '#aeb5be').attr("stroke-width", "1");



        var y1AxisMark = d3.select(graphId).selectAll('.y1.axis').selectAll('.nvd3.nv-wrap.nv-axis');
        var y2AxisMark = d3.select(graphId).selectAll('.y2.axis').selectAll('.nvd3.nv-wrap.nv-axis');
        var y1AxisMinMax = d3.select(graphId).selectAll('.y1.axis').selectAll('.nvd3.nv-wrap.nv-axis').select('.nv-axisMaxMin').attr("transform");
        var y2AxisMinMax = d3.select(graphId).selectAll('.y2.axis').selectAll('.nvd3.nv-wrap.nv-axis').select('.nv-axisMaxMin').attr("transform");
        /* fix for IE browser*/
        var delimiter = ' ';
        if(y1AxisMinMax.indexOf(",") > -1){
          delimiter = ','
        } else if(y2AxisMinMax.indexOf(" ") === -1){
          y2AxisMinMax = "translate(0 0)";
        }
        /*fix for IE browser ends*/
        var maxTransform = parseInt(y1AxisMinMax.split(delimiter)[1].replace(y1AxisMinMax,')',''));
        $scope.y1AxisTransformRate = (($scope.yAxis1Max - $scope.yAxis1Min) > 0) ? parseInt(y1AxisMinMax.split(delimiter)[1].replace(y1AxisMinMax,')',''))/($scope.yAxis1Max - $scope.yAxis1Min) : 0;
        $scope.y2AxisTransformRate = (($scope.yAxis2Max - $scope.yAxis2Min) > 0) ? parseInt(y2AxisMinMax.split(delimiter)[1].replace(y2AxisMinMax,')',''))/($scope.yAxis2Max - $scope.yAxis2Min) : 0;
        var y1LineLength = d3.select(graphId).selectAll('.y1.axis').selectAll('.nvd3.nv-wrap.nv-axis').selectAll('line').attr('x2');
        var y2LineLength = d3.select(graphId).selectAll('.y2.axis').selectAll('.nvd3.nv-wrap.nv-axis').selectAll('line').attr('x2');
        $scope.getMinMaxForHiddenComplianceGraph();
        var y1AxisMinTransform = maxTransform - parseInt($scope.y1AxisTransformRate * $scope.hiddenYAxis1MinMark);
        var y1AxisMaxTransform = maxTransform - parseInt($scope.y1AxisTransformRate * $scope.hiddenYAxis1MaxMark);
        var y2AxisMinTransform = maxTransform - parseInt($scope.y2AxisTransformRate * $scope.hiddenYAxis2MinMark);
        var y2AxisMaxTransform = maxTransform - parseInt($scope.y2AxisTransformRate * $scope.hiddenYAxis2MaxMark);

        $(graphId ).find(" .y1.axis .nvd3.nv-wrap.nv-axis g.minRecommendedLevel").attr("text", "");
        $(graphId ).find(" .y2.axis .nvd3.nv-wrap.nv-axis g.maxRecommendedLevel").attr("text", "");
        
        y1AxisMark.append('g').
        attr('class','minRecommendedLevel').
        attr('transform','translate(-45, '+ y1AxisMinTransform + ')').
        append('text').
        text('MIN').
        style('fill','red');

        if(!$scope.isHiddenYAxis1Duration){  
          y1AxisMark.append('g').
          attr('class','maxRecommendedLevel').
          attr('transform','translate(-45,'+ y1AxisMaxTransform + ')').
          append('text').
          text('MAX').
          style('fill','green');
        }

        
        y2AxisMark.append('g').
        attr('class','minRecommendedLevel').
        attr('transform','translate(20,'+ (y2AxisMinTransform + 3) + ')').
        append('text').
        text('MIN').
        style('fill','red');

        if(!$scope.isHiddenYAxis2Duration){
          y2AxisMark.append('g').
          attr('class','maxRecommendedLevel').
          attr('transform','translate(20,'+ (y2AxisMaxTransform + 3) + ')').
          append('text').
          text('MAX').
          style('fill','green');
        }
      }
      d3.selectAll(graphId).selectAll(".x.axis .tick").selectAll('text').
        attr("dy" , 12);

        d3.selectAll(graphId).selectAll(".x.axis .nv-axisMaxMin").selectAll('text').
        attr("dy" , 12);

        if(days === 0 && $scope.completeComplianceData.actual.length === 1){
          d3.selectAll(graphId).selectAll(".x.axis .tick").selectAll('text').attr("dx" , 488);
        }
        if($scope.complianceGraphData[0] && $scope.complianceGraphData[0].values.length > 20) {
          setTimeout(function() {
            d3.selectAll(graphId).selectAll('.multiChart circle.nv-point').attr("r", "0");
            d3.selectAll(graphId).style("visibility", graphVisibility);
        }, 500);
      } else {
        d3.selectAll(graphId).selectAll('.multiChart circle.nv-point').attr("r", "1.3");
        d3.selectAll(graphId).style("visibility", graphVisibility);
      }
      if(!$scope.hiddencompliance.secondaryYaxis || $scope.hiddencompliance.secondaryYaxis.length <= 0){
        d3.selectAll(graphId).selectAll(".nvd3 .y2.axis").attr("visibility", "hidden");
      }
      d3.selectAll(graphId).selectAll(".nvd3 .nv-axis path.domain").attr('fill', '#ccc');
      d3.selectAll(graphId).selectAll(".nvd3 .nv-axis path.domain").attr('stroke-width', '1');
      d3.selectAll(graphId).selectAll(".nvd3 .nv-axis path.domain").attr('stroke', '#ccc');      
      d3.selectAll(graphId).selectAll(".nv-groups .nv-point").attr("style", "stroke-opacity: 1 !important;stroke-width: 3px !important;");      
      if(callback){
        $scope.getHiddenComplianceForPDF(!$scope.hiddencompliance.pressure, !$scope.hiddencompliance.frequency, !$scope.hiddencompliance.duration, callbackDivId, callbackSvgId, callbackGraphType); 
      }      
      return chart;
    },function(){
        $timeout(function() {
          d3.selectAll(graphId).selectAll('g.nv-single-point g.nv-point-paths path').attr('stroke', '#aaa');
          d3.selectAll(graphId).selectAll('g.nv-single-point g.nv-point-paths path').attr('stroke-opacity', '0');
          d3.selectAll(graphId).selectAll('g.nv-single-point g.nv-point-paths path').attr('fill', '#eee');
          d3.selectAll(graphId).selectAll('g.nv-single-point g.nv-point-paths path').attr('fill-opacity', '0');           
          if($(graphId).find('g.nv-single-point').length > 0){
            d3.selectAll(graphId).selectAll('g.nv-areaWrap path.nv-area.nv-area-0').attr("style", "stroke: #aaa; stroke-opacity: 0; fill: #eee; fill-opacity: 0;");
          } 
          d3.selectAll(graphId).selectAll('.nvd3.nv-stackedarea path.nv-area').attr("fill-opacity", ".7");         
          $scope.isGraphReady();         
        },500);
      });
  };


    /*this should initiate the list of caregivers associated to the patient*/
    $scope.initPatientCaregiver = function(){
      $scope.getCaregiversForPatient(StorageService.get('logged').patientID);
    };

    $scope.getPatientById = function(patientId){
      patientService.getPatientInfo(patientId).then(function(response){
        $scope.slectedPatient = response.data;
      }).catch(function(response){
        notyService.showError(response);
        if(response.status === 404){
          $scope.redirectToPatientDashboard();
        }
      });
    };

    $scope.redirectToPatientDashboard = function(){
      var role = StorageService.get('logged').role;
      switch(role){
        case 'ADMIN':$state.go('patientUser');
        break;
        case 'HCP':$state.go('hcppatientdashboard', {'clinicId':$stateParams.clinicId});
        break;
        case 'CLINIC_ADMIN':$state.go('clinicadminpatientdashboard',{'clinicId':$stateParams.clinicId});
        break;
        case 'ACCT_SERVICES':$state.go('rcadminPatients');
        break;
      }
    };

    $scope.getCaregiversForPatient = function(patientId){
      patientService.getCaregiversLinkedToPatient(patientId).then(function(response){
        $scope.caregivers = (response.data.caregivers) ? response.data.caregivers : [] ;
      }).catch(function(response){
        notyService.showMessage(response.data.ERROR,'warning' );
      });
    };

    $scope.linkCaregiver = function(){
      $state.go('patientdashboardCaregiverAdd', {'patientId': StorageService.get('logged').patientID});
    };

    $scope.initpatientCraegiverAdd = function(){
      $scope.getPatientById(StorageService.get('logged').patientID);
      $scope.careGiverStatus = "new";
      $scope.associateCareGiver = {};
      UserService.getState().then(function(response) {
        $scope.states = response.data.states;
      });
      UserService.getRelationships().then(function(response) {
        $scope.relationships = response.data.relationshipLabels;
        $scope.associateCareGiver.relationship = $scope.relationships[0];
      });
    };

    $scope.formSubmitCaregiver = function(){
      $scope.submitted = true;
      $scope.caregiverUpdateModal = false;
      if($scope.form.$invalid){
        return false;
      }
      var data = $scope.associateCareGiver;
      data.role = 'CARE_GIVER';
      if($scope.careGiverStatus === "new"){
        $scope.associateCaregiverstoPatient(StorageService.get('logged').patientID, data);
      }else if($scope.careGiverStatus === "edit"){
        $scope.updateCaregiver(StorageService.get('logged').patientID, $stateParams.caregiverId , data);
      }
    };

    $scope.showCaregiverUpdateModal = function(){
      $scope.submitted = true;
      if($scope.form.$invalid){
        return false;
      }else{
        $scope.caregiverUpdateModal = true;
      }
    };

    $scope.associateCaregiverstoPatient = function(patientId, careGiver){
        patientService.associateCaregiversFromPatient(patientId, careGiver).then(function(response){
        $scope.caregivers =  response.data.user;
        $scope.associateCareGiver = [];$scope.associateCareGiver.length = 0;
        $scope.switchPatientTab('patientdashboardCaregiver');
      }).catch(function(response){
        notyService.showMessage(response.data.ERROR,'warning' );
      });
    };

    $scope.goToCaregiverEdit = function(careGiverId){
      $state.go('patientdashboardCaregiverEdit', {'caregiverId': careGiverId});
    };

    $scope.disassociateCaregiver = function(caregiverId, index){
      $scope.closeModalCaregiver();
      patientService.disassociateCaregiversFromPatient(StorageService.get('logged').patientID, caregiverId).then(function(response){
        $scope.caregivers.splice(index, 1);
      }).catch(function(response){
        notyService.showMessage(server_error_msg);
      });
    };

    $scope.initpatientCaregiverEdit = function(caregiverId){
      $scope.careGiverStatus = "edit";
      $scope.getPatientById(StorageService.get('logged').patientID);
      $scope.editCaregiver(caregiverId);
    };

    $scope.editCaregiver = function(careGiverId){
        UserService.getState().then(function(response) {
          $scope.states = response.data.states;
        });
        UserService.getRelationships().then(function(response) {
          $scope.relationships = response.data.relationshipLabels;
        });
        var caregiverId = $stateParams.caregiverId;
        patientService.getCaregiverById(StorageService.get('logged').patientID, caregiverId).then(function(response){
          $scope.associateCareGiver = response.data.caregiver.userPatientAssocPK.user;
          $scope.associateCareGiver.relationship = response.data.caregiver.relationshipLabel;
        });
    };

    $scope.updateCaregiver = function(patientId, caregiverId , careGiver){
      var tempCaregiver = {};
      tempCaregiver.title = careGiver.title;
      tempCaregiver.firstName = careGiver.firstName;
      tempCaregiver.middleName = careGiver.middleName;
      tempCaregiver.lastName = careGiver.lastName;
      tempCaregiver.email = careGiver.email;
      tempCaregiver.address = careGiver.address;
      tempCaregiver.zipcode = careGiver.zipcode;
      tempCaregiver.city = careGiver.city;
      tempCaregiver.state = careGiver.state;
      tempCaregiver.relationship = careGiver.relationship;
      tempCaregiver.primaryPhone = careGiver.primaryPhone;
      tempCaregiver.mobilePhone = careGiver.mobilePhone;
      tempCaregiver.role = careGiver.role;

      patientService.updateCaregiver(patientId,caregiverId, tempCaregiver).then(function(response){
        $scope.associateCareGiver = [];$scope.associateCareGiver.length = 0;
        $scope.switchPatientTab('patientdashboardCaregiver');
      }).catch(function(response){
        notyService.showMessage(server_error_msg);
      });
    };

    $scope.initPatientDeviceProtocol = function(){
      $scope.devicesErrMsg = null;
      $scope.protocolsErrMsg = null;
      $scope.devices = []; $scope.devices.length = 0;
      patientService.getDevices(StorageService.get('logged').patientID || $scope.patientId).then(function(response){
        angular.forEach(response.data.deviceList, function(device){
          device.createdDate = dateService.getDateByTimestamp(device.createdDate);
          device.lastModifiedDate = dateService.getDateByTimestamp(device.lastModifiedDate);
        });
        if(response.data.deviceList){
          $scope.devices = response.data.deviceList;
        }else{
          $scope.devicesErrMsg = true;
        }
      });
      $scope.getProtocols(StorageService.get('logged').patientID || $scope.patientId);
    };

    $scope.getProtocols = function(patientId){
      $scope.protocols = []; $scope.protocols.length = 0;
      $scope.protocolsErrMsg = null;
      $scope.devicesErrMsg = null;
      patientService.getProtocol(patientId).then(function(response){
        if(response.data.protocol){
          $scope.protocols = response.data.protocol;
        }else if(response.data.message){
          $scope.protocolsErrMsg = response.data.message;
        }
        $scope.addProtocol = true;
        angular.forEach($scope.protocols, function(protocol){
          protocol.createdDate = dateService.getDateByTimestamp(protocol.createdDate);
          protocol.lastModifiedDate = dateService.getDateByTimestamp(protocol.lastModifiedDate);
          if(!protocol.deleted){
            $scope.addProtocol = false;
          }
        });
      });
    };

    $scope.initPatientClinicHCPs = function(){
      $scope.getClinicsOfPatient();
      $scope.getHCPsOfPatient();
    };

    $scope.getClinicsOfPatient = function(){
      patientService.getClinicsLinkedToPatient(StorageService.get('logged').patientID || $scope.patientId).then(function(response){
        if(response.data.clinics){
          $scope.clinics = response.data.clinics;
        }else if(response.data.message){
          $scope.clinicsOfPatientErrMsg = response.data.message;
        }
      });
    };

    $scope.getHCPsOfPatient = function(){
      patientService.getHCPsLinkedToPatient(StorageService.get('logged').patientID || $scope.patientId).then(function(response){
        if(response.data.hcpUsers){
          $scope.hcps = response.data.hcpUsers;
        }else if(response.data.message){
          $scope.hcpsOfPatientErrMsg = response.data.message;
        }
      });
    };

    $scope.updateNote = function(noteId, noteCreatedOn){
      // createdOn is in format YYYY-MM-DD
      var editedNoteText = $("#editedNoteText_"+noteId).val();
      var dateCreatedOn = dateService.convertYyyyMmDdToTimestamp(noteCreatedOn);
      if(editedNoteText && editedNoteText.length > 0  && (editedNoteText.trim()).length > 0){
        var data = {};
        data.noteText = editedNoteText;
        UserService.updateNote(noteId, new Date(dateCreatedOn).getTime(), data).then(function(response){
          $scope.showAllNotes();
          makeAllNotesReadable();
        }).catch(function(){
          $scope.errorMsg = "Some internal error occurred. Please try after sometime.";
          notyService.showMessage($scope.errorMsg,'warning' );
          $scope.cancelEditNote();
        });
      }else{
        $scope.noteError = "Please add some text.";
      }
    };

    $scope.createNote = function(){
        $scope.noteTextError =  null;
        if($scope.textNote && $scope.textNote.text.length > 0){
          if($scope.textNote.edit_date && $scope.textNote.edit_date != 'undefined' && $scope.textNote.edit_date.length > 0){
            var editDate = $scope.textNote.edit_date;
            var data = {};
            data.noteText = $scope.textNote.text;
            data.userId = StorageService.get('logged').patientID;
            data.date = editDate;
            UserService.createNote(StorageService.get('logged').patientID, data).then(function(response){
              $scope.addNote = false;
              $scope.textNote.edit_date = dateService.convertDateToYyyyMmDdFormat(new Date());
              $scope.textNote = "";
              $scope.showAllNotes();
              $scope.addNoteActive = false;
              $("#note_edit_container").removeClass("show_content");
              $("#note_edit_container").addClass("hide_content");
            }).catch(function(){
              notyService.showMessage(server_error_msg,'warning' );
            });
          }else{
            $scope.noteTextError = "Please select a date.";
            return false;
          }
        }else{
          $scope.noteTextError = "Please add some text.";
          return false;
        }

    };

    $scope.deleteNote = function(noteId){
      UserService.deleteNote(noteId).then(function(response){
      $scope.showAllNotes();
      }).catch(function(){
        notyService.showMessage(server_error_msg,'warning' );
      });
      $scope.closeNoteDeleteModal();
    };

    $scope.openDeleteNoteModal = function(note){
      $scope.deleteNoteModal = true;
      $scope.noteToDelete = note;
    };
    $scope.closeNoteDeleteModal = function(){
      $scope.deleteNoteModal = false;
    };

    $scope.openAddNote = function(){
      $scope.noteTextError =  null;
      $scope.textNote = {};
      $scope.textNote.edit_date = dateService.convertDateToYyyyMmDdFormat(new Date());
       $scope.textNote.text = "";
      $scope.addNoteActive = true;
      $("#note_edit_container").removeClass("hide_content");
      $("#note_edit_container").addClass("show_content");
    };

    $scope.cancelAddNote = function(){
      $scope.addNote = false;
      $scope.addNoteActive = false;
      $("#note_edit_container").removeClass("show_content");
      $("#note_edit_container").addClass("hide_content");
    };

    $scope.initGraph = function(){
      $scope.getHmrRunRateAndScore();
      $scope.handlelegends();
      $scope.weeklyChart();
    }
    $scope.initPatientDashboard = function(){
      $scope.getTransmissionDateForPatient(StorageService.get('logged').patientID);
      $scope.getAssociatedClinics(StorageService.get('logged').patientID);
      $scope.getPatientDevices(StorageService.get('logged').patientID);
      $scope.editNote = false;
      $scope.textNote = "";
      $scope.initGraph();
      $scope.getPatientById($scope.patientId);
      $scope.getPatientNotification();
    };

    $scope.openEditNote = function(noteId, noteText){
      $scope.errorMsg = null;
      $scope.noteError = null;
      $("#editedNoteText_"+noteId).val(noteText);
      //ALL NOTES
      makeAllNotesReadable();
      // CURRENT NOTE
      makeNoteeditable(noteId);

    };

    $scope.cancelEditNote = function(){
      //$scope.editNote = false;
      makeAllNotesReadable();

    };

    function makeAllNotesReadable(){
      // ALL NOTE : should be readable
      // viewable fields should be shown
      // editable fields should be hidden
      $(".view_content").removeClass("hide_content");
      $(".view_content").addClass("show_content");
      $(".edit_content").removeClass("show_content");
      $(".edit_content").addClass("hide_content");
    };

    function makeNoteeditable(noteId){
      // the edit/delete links for current note should be hidden
      $("#viewnoteact_"+noteId).removeClass("show_content");
      $("#viewnoteact_"+noteId).addClass("hide_content");
      //createdon is a view content but it should be hidden for current note
      $("#createdon_"+noteId).removeClass("show_content");
      $("#createdon_"+noteId).addClass("hide_content");
      // viewnote should also be hidden for current note
      $("#viewnote_"+noteId).removeClass("show_content");
      $("#viewnote_"+noteId).addClass("hide_content");
      // form for current note should be visible
      $("#editform_"+noteId).removeClass("hide_content");
      $("#editform_"+noteId).addClass("show_content");
    };

    $scope.getPatientNotification = function(){
      UserService.getPatientNotification(StorageService.get('logged').patientID, new Date().getTime()).then(function(response){
        $scope.patientNotifications = response.data;
        angular.forEach($scope.patientNotifications, function(notification, index) {
          var notificationType = notification.notificationType;
          if(notificationType.indexOf("HMR_NON_COMPLIANCE AND SETTINGS_DEVIATION") > -1){
            $scope.patientNotifications[index].message = apiresponse.HMR_NON_COMPLIANCE_AND_SETTINGS_DEVIATION;
            $scope.patientNotifications[index].class = "icon-lungs";
          }else if(notificationType.indexOf("HMR_NON_COMPLIANCE") > -1){
             $scope.patientNotifications[index].message = apiresponse.HMR_NON_COMPLIANCE;
             $scope.patientNotifications[index].class = "icon-lungs";
          }else if(notificationType.indexOf("MISSED_THERAPY") > -1){
             $scope.patientNotifications[index].message = apiresponse.MISSED_THERAPY ;
             $scope.patientNotifications[index].class = "icon-lungs";
          }
        });
      });
    }

    function scrollPageToTop(divId){
      $('html, body').animate({
          scrollTop: $("#"+divId).offset().top
      }, 2000);
    };


    $scope.$on('elementClick.directive', function(angularEvent, event) {
      $scope.hideNotesCSS();
      $scope.graphStartDate = null;
      $scope.graphEndDate = null;
      var selectedNodeIndex = null;
      var graphNodesLength = $scope.completeGraphData.actual.length;
      if(graphNodesLength && graphNodesLength > 0){
        angular.forEach($scope.completeGraphData.actual, function(value, index) {
          if(value.timestamp === event.point[0]){
            selectedNodeIndex = index;
            $scope.graphStartDate = value.timestamp;
          }
          angularEvent.targetScope.$parent.event = event;
          angularEvent.targetScope.$parent.$digest();
        });

        // selectedNodeIndex exists means start date is present
        if(selectedNodeIndex != null && selectedNodeIndex > -1 ){
          //the selected note is not the last one
          if(selectedNodeIndex < (graphNodesLength-1)){
            var d = new Date($scope.completeGraphData.actual[selectedNodeIndex+1].timestamp);
            d.setDate(d.getDate()-1);
            $scope.graphEndDate = d.getTime();
          }else if(selectedNodeIndex === (graphNodesLength-1)){
            //this is the last node so,get the end date from dattepicker
            $scope.graphEndDate = $scope.toTimeStamp;
          }
        }
      }
      $scope.getNotesBetweenDateRange($scope.graphStartDate,$scope.graphEndDate);
    });

    $scope.showAllNotes = function(page){
    if (page !== undefined) {
        if (page === "PREV" && $scope.curNotePageIndex > 1) {
         $scope.curNotePageIndex--;
        } else if (page === "NEXT" && $scope.curNotePageIndex < $scope.notePageCount) {
          $scope.curNotePageIndex++;
        } else {
          return false;
        }
      } else {
        $scope.curNotePageIndex = 1;
      }
      $scope.getNotesBetweenDateRange($scope.fromTimeStamp, $scope.toTimeStamp, true);
    };

    $scope.hideNoteContainer = function(){
      $scope.hideNotesCSS();
    }

    $scope.showNotesCSS = function(){
      $("#add_note_container").removeClass("hide_content");
      $("#add_note_container").addClass("show_content");
    };

    $scope.hideNotesCSS = function(){
      $("#add_note_container").removeClass("show_content");
      $("#add_note_container").addClass("hide_content");
    };


    $scope.getNotesBetweenDateRange = function(fromTimeStamp, toTimeStamp, scrollUp){
      var patientId = null;
      if(StorageService.get('logged').role === 'PATIENT'){
        patientId = StorageService.get('logged').patientID;
      }else{
        patientId = $stateParams.patientId;
      }
      var fromDate = dateService.convertDateToYyyyMmDdFormat(fromTimeStamp);
      var toDate = dateService.convertDateToYyyyMmDdFormat(toTimeStamp);
      UserService.getNotesOfUserInInterval(patientId, fromDate, toDate, $scope.curNotePageIndex, $scope.perPageCount ).then(function(response){
        $scope.showNotes = true;
        $scope.notes = response.data;
        $scope.totalNotes = response.headers()['x-total-count'];
        $scope.notePageCount = Math.ceil($scope.totalNotes / 4);
        $scope.showNotesCSS();
        if($scope.notes.length >= 1 || scrollUp){
          scrollPageToTop("add_note_container");
        }
        $scope.hideAddNote();
        return 1;
      }).catch(function(){
        $scope.notes = "";
        $scope.hideNotesCSS();
        $scope.hideAddNote();
        return 0;
      });
    };

    $scope.chageDateForGraph = function(){
      $scope.hideNotesCSS();
    };

    $scope.hideAddNote = function(){
      $("#note_edit_container").removeClass("show_content");
      $("#note_edit_container").addClass("hide_content");
    };
    $scope.getPatientDevices = function(patientId){
      patientService.getDevices(patientId).then(function(response){
        $scope.patientDevices = response.data.deviceList;
      });
    };
    $scope.getAssociatedClinics = function(patientId){
      patientService.getClinicsLinkedToPatient(patientId).then(function(response) {
        if(response.data.clinics){
          $scope.associatedClinics = response.data.clinics;
        }
      });
    };

    $scope.getTransmissionDateForPatient = function(patientId){
      patientService.getTransmissionDate(patientId).then(function(response) {
        if(response.data && response.data.firstTransmissionDate){
          $scope.hasTransmissionDate = true;
          $scope.transmissionDate = response.data.firstTransmissionDate;
        }
      });
    };

    $scope.init();

      $scope.getNotesOnGraphNode = function(selectedTimestamp){
        //
        $scope.hideNotesCSS();
        $scope.graphStartDate = null;
        $scope.graphEndDate = null;
        var selectedNodeIndex = null;
        var graphNodesLength = $scope.completeGraphData.actual.length;
        if(graphNodesLength && graphNodesLength > 0){
          angular.forEach($scope.completeGraphData.actual, function(value, index) {
            if(value.timestamp === selectedTimestamp){
              selectedNodeIndex = index;
              $scope.graphStartDate = value.timestamp;
            }
          });

          // selectedNodeIndex exists means start date is present
          if(selectedNodeIndex != null && selectedNodeIndex > -1 ){
            //the selected note is not the last one
            if(selectedNodeIndex < (graphNodesLength-1)){
              var d = new Date($scope.completeGraphData.actual[selectedNodeIndex+1].timestamp);
              d.setDate(d.getDate()-1);
              $scope.graphEndDate = d.getTime();
            }else if(selectedNodeIndex === (graphNodesLength-1)){
              //this is the last node so,get the end date from dattepicker
              $scope.graphEndDate = $scope.toTimeStamp;
            }
          }
        }
        $scope.getNotesBetweenDateRange($scope.graphStartDate,$scope.graphEndDate);
      //
      }

      $scope.drawHMRLineGraph = function(graphId, wrapperDiv, isDrawCompliance, graphVisibility) {        
        nv.addGraph(function() {

           chart = nv.models.lineChart()
          .margin({top: 30, right: 50, bottom: 50, left: 50})
          .showLegend(false)
          .color(d3.scale.category10().range());
          chart.tooltipContent($scope.toolTipContentStepChart());
          chart.lines.dispatch.on('elementClick', function(event) {
            angular.forEach($scope.completeGraphData.actual, function(data){
              if(data.start === event.point.x && data.missedTherapy !== true){
                $scope.dayGraphForNode(event.point.x);
              }
            })
          });
          //this function to put x-axis labels
          var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp),
            totalDataPoints = $scope.graphData[0].values.length,
            tickCount = parseInt(totalDataPoints/12);            
            var xTicksData = $scope.graphData[0].values;            
            if(tickCount > 0){
              xTicksData = [];
              if(totalDataPoints%12 === 0 ){
                for(var i=0; i < 12*tickCount; i = (i+tickCount) ){
                  xTicksData.push($scope.graphData[0].values[i]);
                }
              }else{
                for(var i=0; i < 12*(tickCount-1); i = (i+tickCount) ){
                  xTicksData.push($scope.graphData[0].values[i]);
                }
                xTicksData.push($scope.graphData[0].values[totalDataPoints-1]);
              }
            } 
           
            if($scope.graphData[0].values.length === 1){              
              chart.xAxis.showMaxMin(false).tickValues($scope.graphData[0].values.map( function(d){return d.x;} ) ).tickFormat(function(d) {
              return d3.time.format('%d-%b-%y')(new Date(d));});
            }else{              
              chart.xAxis.showMaxMin(true).tickFormat(function(d) {
              return d3.time.format('%d-%b-%y')(new Date(d));});
            }         

          chart.yAxis.tickFormat(d3.format('d'));
          if($scope.yAxisRangeForHMRLine.min === 0 && $scope.yAxisRangeForHMRLine.max === 0){
            chart.forceY([$scope.yAxisRangeForHMRLine.min, 1]);
          }else{
            chart.forceY([$scope.yAxisRangeForHMRLine.min, $scope.yAxisRangeForHMRLine.max]);
          }
          chart.yAxis.axisLabel($scope.yAxisRangeForHMRLine.ylabel);
            d3.select(graphId)
          .datum($scope.graphData)
          .transition().duration(0).call(chart);

         d3.selectAll(graphId).style("visibility", "hidden");
         d3.selectAll(graphId).select('.nv-lineChart g rect').attr("style", "fill: #e3ecf7;opacity: 1 !important;");
         var circlesInHMR = d3.select(graphId).select('.nv-scatterWrap').select('.nv-group.nv-series-0').selectAll('circle')[0];
         var count = 0;
         var missedTherapyCircles = [];
         angular.forEach($scope.completeGraphData.actual,function(value){
          if(value.missedTherapy === true){
            missedTherapyCircles.push(circlesInHMR[count]);
          }
          count++;
         })
         var missedTherapy = {};
         if($scope.graphData[0] && $scope.graphData[0].values.length > 20){
          missedTherapy.cssClass = 'fill: #cf202f;stroke: #cf202f;stroke-width: 1.5;fill-opacity: 0;';//'missed_therapy_year_node';
          missedTherapy.radius = 0.7;
         } else {
          missedTherapy.cssClass = 'fill: #cf202f;stroke: #fff;stroke-width: 1.5;fill-opacity: 1;'; //'missed_therapy_node';
          missedTherapy.radius = 3;
         }

         angular.forEach(missedTherapyCircles,function(circle){
          d3.select(graphId).select('.nv-scatterWrap').select('.nv-group.nv-series-0').append('circle')
          .attr('cx',circle.attributes.cx.value)
          .attr('cy',circle.attributes.cy.value)
          .attr('r',missedTherapy.radius)
          .attr('style',missedTherapy.cssClass);
         })

         d3.selectAll(graphId).selectAll(".nv-axis .tick").append('circle').
          attr("cx" , 0).
          attr("cy", 0).
          attr("r" , 2).
          attr("fill" , '#aeb5be');

        d3.selectAll(graphId).selectAll(".nv-y.nv-axis .tick text ").attr("style", "fill: #5d6a7d; font-size: 10px;text-anchor: end;");
        d3.selectAll(graphId).selectAll(".nv-y .nvd3 .nv-axisMaxMin text ").attr("style", "fill: #5d6a7d;font-size: 10px;font-weight: normal;text-anchor: end;");
        d3.selectAll(graphId).selectAll(".nv-x.nv-axis .tick text ").attr("style", "fill: #5d6a7d; font-size: 10px;text-anchor: middle;");
        d3.selectAll(graphId).selectAll(".nv-x .nvd3 .nv-axisMaxMin text ").attr("style", "fill: #5d6a7d;font-size: 10px;font-weight: normal;text-anchor: middle;");
        d3.selectAll(graphId).selectAll(".nv-axis .nv-axislabel").
        attr("y" , -40).attr("style", "font: 12px Arial; fill: #5d6a7d;");
        d3.selectAll (graphId).selectAll(".nvd3 .nv-groups path.nv-line").attr("style", "fill: none; stroke-width: 1.5px;");

        $timeout(function() {
        if($scope.graphData[0] && $scope.graphData[0].values.length > 20){
          setTimeout(function() {
              d3.selectAll(graphId).selectAll('.nv-lineChart circle.nv-point').attr("r", "0");
              d3.selectAll(graphId).style("visibility", graphVisibility);
          }, 500);
        } else {
          setTimeout(function() {
              d3.selectAll(graphId).selectAll('.nv-lineChart circle.nv-point').attr("r", "1.3");
              d3.selectAll(graphId).style("visibility", graphVisibility);
          }, 500);
        }
          $scope.isGraphReady();                 
          return chart;
        }, 1500);
      });
    }

//end
    $scope.drawHMRBarGraph = function(graphId) {
        nv.addGraph(function() {
           chart = nv.models.multiBarChart()
          .margin({top: 30, right: 50, bottom: 50, left: 50})
          .showControls(false)
          .showLegend(false)
          .color(d3.scale.category10().range());
         // chart.noData("Nothing to see here.");
          chart.tooltipContent($scope.toolTipContentBarChart());
          var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
          //this function to put x-axis labels
          if(days === 0 && $scope.hmrBarGraphData[0].values.length === 1){
            chart.xAxis.showMaxMin(true).tickValues($scope.hmrBarGraphData[0].values.map( function(d){return d.x;} ) ).tickFormat(function(d) {
              return d3.time.format('%I:%M %p')(new Date(d));
              return dateService.getTimeIntervalFromTimeStamp(d);
            });
          }else{
            chart.xAxis.tickValues($scope.hmrBarGraphData[0].values.map( function(d){return d.x;} ) ).tickFormat(function(d) {
              return d3.time.format('%I:%M %p')(new Date(d));
              return dateService.getTimeIntervalFromTimeStamp(d);
            });
          }
          
          if($scope.yAxisRangeForHMRBar.min === 0 && $scope.yAxisRangeForHMRBar.max === 0){
            chart.forceY([$scope.yAxisRangeForHMRBar.min,1]);
          }else{
            chart.forceY([$scope.yAxisRangeForHMRBar.min, $scope.yAxisRangeForHMRBar.max]);
          }
          chart.yAxis.tickFormat(d3.format('d'));
          chart.yAxis.axisLabelDistance(50);
          chart.yAxis.axisLabel($scope.yAxisRangeForHMRBar.ylabel);
          d3.select(graphId)
          .datum($scope.hmrBarGraphData)
          .transition().duration(0).call(chart);
          d3.select(graphId).style("visibility", "hidden");
          return chart;
      });
    }

    $scope.downloadAsPdf = function(){
      if($scope.isGraphDownloadable){
        $scope.downloadPDFFile();
      } else {        
        //$("#graph-loading-modal").show();
      }  
    };

    $scope.cloaseGraphLoadingModal = function(){
      $("#graph-loading-modal").hide();
    }

    $scope.downloadRawDataAsCsv = function(){      
      patientService.getDeviceDataAsCSV($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-')).then(function(response){
         graphService.downloadAsCSVFile(response.data, 'VestDeviceReport.csv', 'vestDevice');
      });
    };

    $scope.downloadProcessedDataAsCsv = function(){
      patientService.getTherapyDataAsCSV($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-')).then(function(response){
         graphService.downloadAsCSVFile(response.data, 'TherapyReport.csv', 'therapy');
      });
    };

    $scope.openModalCaregiver = function(caregiverId, index){
      $scope.showModalCaregiver = true;
      $scope.deleteCaregiver = {'id':caregiverId, 'index':index};
    };
    $scope.closeModalCaregiver = function(){
      $scope.showModalCaregiver = false;
    };

    /*on click of the nodes on graph, the graph should change to a day graph*/
    $scope.dayGraphForNode = function(timestamp) {
      $scope.addCanvasToDOM();
      $scope.selectedDateOption = 'DAY';
      $scope.toDate = $scope.fromDate =  dateService.getDateFromTimeStamp(timestamp,patientDashboard.dateFormat,'/');
      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.fromDate};
      $scope.removeGraph();
       if($scope.hmrGraph) {
        $scope.format = 'dayWise';
        $scope.hmrLineGraph = false;
        $scope.hmrBarGraph = true;
        $scope.toTimeStamp = $scope.fromTimeStamp = timestamp;
        $scope.getDayHMRGraphData(false, false, false, true);
      }
    };

    $scope.$watch("textNote.edit_date", function(){
      angular.element(document.querySelector('.datepicker')).hide();
    });

    $scope.getAdherenceScore = function(){
      var patientId;
      if($stateParams.patientId){
        patientId = $stateParams.patientId;
      }else if(StorageService.get('logged').patientID){
        patientId = StorageService.get('logged').patientID;
      }
      var oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
      var fromDate = dateService.convertDateToYyyyMmDdFormat(oneWeekAgo.getTime());
      var toDate = dateService.convertDateToYyyyMmDdFormat(new Date().getTime());
      patientDashBoardService.getAdeherenceData(patientId, fromDate, toDate).then(function(response){
        $scope.adherenceScores = response.data;
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.initPdfMetaData = function (strHtml, graphType){            
      var d = $('#duration').is(':checked')?"Duration":"", f = $('#frequency').is(':checked')?"Frequency":"", p=$('#pressure').is(':checked')?"Pressure":"";
      var a = [];if(p)a.push(p);if(f)a.push(f);if(d)a.push(d);
      stringConstants.graphTitle = ($scope.selectedGraph=='HMR')?"Hour Meeter:":'Patient Treatment '+a.join(' / ')+':';
      $scope.getTableDataForPDF();
      switch(graphType) {
          case 'hmr':                          
              $scope.addHTMLToNode("hmrBarLineDiv", strHtml);                                      
              break;
          case 'compliance':                         
              $scope.addHTMLToNode("complianceDiv", strHtml);              
              break;
          case 'compliance1':                          
              $scope.addHTMLToNode("compliance1Div", strHtml);              
              break;
          default:
              break;
        } 

        if(($("#hmrBarLineDiv").find("svg").length > 0) && ($("#complianceDiv").find("svg").length > 0) && ($("#compliance1Div").find("svg").length > 0)){
          $scope.isGraphDownloadable = true;
        }else{
          $scope.isGraphDownloadable = false;
        }        
    };

    $scope.addHTMLToNode = function(divId, strHtml){      
      $('#'+divId).html(strHtml);      
      $('#'+divId).find('svg')
      .attr('version',1.1)
      .attr('width','1300px')
      .attr('height','350px')
      .attr('font-family', 'helvetica')
      .attr('font-size', '12px').attr('class', 'complianceGraph col-md-16')
      .attr('xmlns','http://www.w3.org/2000/svg').attr('xmlns:xlink','http://www.w3.org/1999/xlink');      
    };    

    $scope.downloadPDFFile = function (){ 
      setTimeout(function(){
      var hmrGraphId = null; var complianceGraphId = null; var compliance1GraphId = null;
      var pdfPressure = ($scope.hiddencompliance.pressure) ? $scope.hiddencompliance.pressure : false; 
      var pdfFrequency = ($scope.hiddencompliance.frequency) ? $scope.hiddencompliance.frequency : false;
      var pdfDuration = ($scope.hiddencompliance.duration) ? $scope.hiddencompliance.duration : false;
      console.log("hidden pressure : "+$scope.hiddencompliance.pressure+" hidden frequency : "+$scope.hiddencompliance.frequency+" hidden duration : "+$scope.hiddencompliance.duration);
      console.log("pressure : "+$scope.compliance.pressure+" frequency : "+$scope.compliance.frequency+" duration : "+$scope.compliance.duration);
      if($scope.complianceGraph){
        hmrGraphId = "#complianceGraphHMR";
        complianceGraphId = "#complianceGraph";
        compliance1GraphId = "#complianceGraph1";
        pdfPressure = $scope.compliance.pressure; pdfFrequency = $scope.compliance.frequency; pdfDuration = $scope.compliance.duration;
      }else if ($scope.hmrBarGraph){
        hmrGraphId = "#hmrBarGraph";
        complianceGraphId = "#hmrBarGraphCompliance";
        compliance1GraphId = "#hmrBarGraphCompliance1";
      } else if ($scope.hmrLineGraph){
        hmrGraphId = "#hmrLineGraphSVG";
        complianceGraphId = "#hmrLineGraphCompliance";
        compliance1GraphId = "#hmrLineGraphCompliance1";
      }
      console.log("AFTER CALCULATION : pressure : "+$scope.compliance.pressure+" frequency : "+$scope.compliance.frequency+" duration : "+$scope.compliance.duration);
      var d = $('#duration').is(':checked')?"Duration":"", f = $('#frequency').is(':checked')?"Frequency":"", p=$('#pressure').is(':checked')?"Pressure":"";
      var a = [];if(p)a.push(p);if(f)a.push(f);if(d)a.push(d);
      stringConstants.graphTitle = ($scope.selectedGraph=='HMR')?"Hour Meeter:":'Patient Treatment '+a.join(' / ')+':';
      $scope.getTableDataForPDF();

      var pdf = new jsPDF('p', 'pt', 'a4', true), specialElementHandlers = {
       '#bypassme': function(element, renderer){
        return true;
      }};

      var pageHeight = pdf.internal.pageSize.height;
      var pageWidth = pdf.internal.pageSize.width;
                          
      var margins = {
          top: 70,
          bottom: 60,
          left: 15,
          width: 575,
          titleTop:40,
          tCellWidth:140,
          tCapWidth:280,
          t2TabLeft:(pageWidth/2)+5
      };
     
      var rDate = g_pdfMetaData.rGenDt, rTitle = g_pdfMetaData.rTitle, rTitle1=g_pdfMetaData.rTitle1;       
      pdf.setFont("helvetica");
      pdf.setFontType("bold");   
      pdf.setFontSize(6);
      pdf.setTextColor(0,0,0);
      pdf.text(margins.left,   margins.titleTop-15, dateService.getDateFromTimeStamp(new Date().getTime(), patientDashboard.dateFormat, "/"));

      pdf.setFont("helvetica");   
      pdf.setFontType("bold");
      pdf.setFontSize(6);
      pdf.setTextColor(0,0,0);
      pdf.text(margins.width-280,   margins.titleTop-15, "Hillrom | Overview");

      pdf.setFont("helvetica");  
      pdf.setFontType("bold"); 
      pdf.setFontSize(11);
      pdf.setTextColor(124,163,220);
      pdf.text(margins.width-30, margins.titleTop,rTitle);
      
      pdf.setFont("helvetica");   
      pdf.setFontType("bold");      
      pdf.setFontSize(7);
      pdf.setTextColor(114, 111, 111);
      pdf.text(margins.width-70,   margins.titleTop+10, rTitle1);
      
      pdf.setDrawColor(0);
      pdf.setFillColor(114, 111, 111);
      pdf.rect(margins.left, margins.titleTop+13, margins.width-5, .5, 'F');  //F is for Fill
      /*pdf.rect(margins.left, margins.titleTop+13, margins.width, 2, 'D');  //D is for Draw
      pdf.rect(margins.left, margins.titleTop+13, margins.width, 2, 'FD');*/

      pdf.setFont("helvetica"); 
      pdf.setFontType("normal");        
      pdf.setFontSize(6);
      pdf.setTextColor(0, 0, 0);
      pdf.text(margins.left,   margins.titleTop+30, "Report Generation Date ");

      pdf.setFont("helvetica"); 
      pdf.setFontType("normal");        
      pdf.setFontSize(6);
      pdf.setTextColor(128, 179, 227);
      pdf.text(margins.left+69,   margins.titleTop+30, dateService.getDateFromTimeStamp(new Date().getTime(),patientDashboard.dateFormat,'/'));

      pdf.setFont("helvetica"); 
      pdf.setFontType("normal");        
      pdf.setFontSize(6);
      pdf.setTextColor(0, 0, 0);
      pdf.text(margins.t2TabLeft,  margins.titleTop+30, "Date Range Of Report ");

      pdf.setFont("helvetica"); 
      pdf.setFontType("normal");        
      pdf.setFontSize(6);
      pdf.setTextColor(128, 179, 227);
      pdf.text(margins.t2TabLeft+65,  margins.titleTop+30, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/') + " - "+dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/'));

      pdf.cellInitialize();

      pdf.margins = 1;
      pdf.setFont("helvetica");
                     
      pdf.cellInitialize();
           
      var tabInfo = g_pdfMetaData.rTablePatInfo.tData;
      var rCount =0;

      for(var i=0;i<tabInfo.length;i=i+2){
           rCount++;
          if(i==0){  
            pdf.setDrawColor(0);
            pdf.setFillColor(124,163,220);
            pdf.rect(margins.left, margins.top+10, margins.tCapWidth, 20, 'F');           
            
            //pdf.setFont("helvetica"); 
            pdf.setFontType("bold");        
            pdf.setFontSize(6);
            pdf.setTextColor(234, 238, 242);
            pdf.cell(margins.left, margins.top+10, margins.tCapWidth, 20, g_pdfMetaData.rTablePatInfo.title); 
          }
          pdf.setFontType("normal");
          pdf.setTextColor(0,0,0)
          pdf.cell(margins.left, margins.top+30, 80, 21, tabInfo[i], rCount+1);                     
          pdf.cell(margins.left, margins.top+30, 200, 21, tabInfo[i+1], rCount+1);  
      }

      pdf.cellInitialize();
      tabInfo = g_pdfMetaData.rDeviceInfo.tData;
      var rCount =0;
      for(var i=0;i<tabInfo.length;i=i+2){
           rCount++;
          if(i==0){
            pdf.setDrawColor(0);
            pdf.setFillColor(124,163,220);
            pdf.rect(margins.t2TabLeft, margins.top+10, margins.tCapWidth, 20, 'F');           

            //pdf.setFont("helvetica"); 
            pdf.setFontType("bold");
            pdf.setFontSize(6);
            pdf.setTextColor(234, 238, 242);
            pdf.cell(margins.t2TabLeft, margins.top+10, margins.tCapWidth, 20, g_pdfMetaData.rDeviceInfo.title); 
          }
         pdf.setTextColor(0,0,0)
          pdf.setFontType("normal");
          pdf.cell(margins.t2TabLeft, margins.top+30, margins.tCellWidth, 20, tabInfo[i], rCount+1);   
          pdf.cell(margins.t2TabLeft, margins.top, margins.tCellWidth, 20, tabInfo[i+1], rCount+1);  
      }
           

      pdf.cellInitialize();
      tabInfo = g_pdfMetaData.rNoteInfo.tData;
      var rCount =0;
      for(var i=0;i<tabInfo.length;i=i+2){
          rCount++;
          if(i==0){
            pdf.setDrawColor(0);
            pdf.setFillColor(124,163,220);
            pdf.rect(margins.t2TabLeft, margins.top+75, margins.tCapWidth, 20, 'F');

            pdf.setFontType("bold");
            pdf.setFontSize(6);
            pdf.setTextColor(234, 238, 242);
            pdf.cell(margins.t2TabLeft, margins.top+75, margins.tCapWidth, 20, g_pdfMetaData.rNoteInfo.title); 
          }
          pdf.setTextColor(0,0,0)
          pdf.setFontType("normal");
          pdf.cell(margins.t2TabLeft, margins.top+95, margins.tCellWidth, 20, tabInfo[i].toString(), rCount+1);   
          pdf.cell(margins.t2TabLeft, margins.top, margins.tCellWidth, 20, tabInfo[i+1].toString(), rCount+1);  
      }

      //Patient Treatment Duration:; Frequency / Pressure: Hour Meter: 
      pdf.text(40,250, "HMR");      
      var imgY = 250;              
      if(hmrGraphId && $(hmrGraphId).find("svg").length > 0){  
        $(hmrGraphId).find('svg')
        .attr('version',1.1)
        .attr('width','1300px')
        .attr('height','350px')
        .attr('font-family', 'helvetica')
        .attr('font-size', '12px').attr('class', 'complianceGraph col-md-16')
        .attr('xmlns','http://www.w3.org/2000/svg');                       
        var canvas = document.getElementById('hmrBarLineCanvas');               
        var ctx = canvas.getContext('2d');
        var htmlString =  $(hmrGraphId).find("svg").parent().html().trim().replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');          
        canvg(canvas, htmlString);       
        var img = $("#hmrBarLineCanvas")[0].toDataURL('image/png', 1.0);
        pdf.addImage(img, 'png', 10, (imgY),margins.width+100, 170);        
        imgY = imgY + 200;
      }

     /* if(pdfPressure){
        pdf.setDrawColor(0);
        pdf.setFillColor(255, 152, 41);
        pdf.circle(50, imgY, 3, "F");
        pdf.text(60,imgY, "Presure");  
      }
      if(pdfFrequency){
        pdf.setDrawColor(0);
        pdf.setFillColor(52, 151, 143);
        pdf.circle(50, imgY, 3, "F");
        pdf.text(60,imgY, "Frequency");  
      }

      if(pdfFrequency){
        pdf.setDrawColor(0);
        pdf.setFillColor(52, 151, 143);
        pdf.circle(50, imgY, 3, "F");
        pdf.text(60,imgY, "Duration");  
      }*/
            
      //color for pressure // 52, 151, 143 : for frequency // 78, 149, 196 : for duration

      if(complianceGraphId && $(complianceGraphId).find("svg").length > 0){ 
        $(complianceGraphId).find('svg')
        .attr('version',1.1)
        .attr('width','1300px')
        .attr('height','350px')
        .attr('font-family', 'helvetica')
        .attr('font-size', '12px').attr('class', 'complianceGraph col-md-16')
        .attr('xmlns','http://www.w3.org/2000/svg');                                 
        var canvas = document.getElementById('complianceCanvas');               
        var ctx = canvas.getContext('2d');  
        var htmlString =  $(complianceGraphId).find("svg").parent().html().trim().replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');          
        canvg(canvas, htmlString);
        var img = $("#complianceCanvas")[0].toDataURL('image/png', 1.0);
        pdf.addImage(img, 'png', 10, (imgY),margins.width+100, 170);
        imgY = imgY + 200;
      }

      /*pdf.setDrawColor(0);
      pdf.setFillColor(78, 149, 196);
      pdf.circle(70, imgY, 3, "F");*/
      
      if(compliance1GraphId && $(compliance1GraphId).find("svg").length > 0){  
        $(compliance1GraphId).find('svg')
        .attr('version',1.1)
        .attr('width','1300px')
        .attr('height','350px')
        .attr('font-family', 'helvetica')
        .attr('font-size', '12px').attr('class', 'complianceGraph col-md-16')
        .attr('xmlns','http://www.w3.org/2000/svg');                
        var canvas = document.getElementById('compliance1Canvas');               
        var ctx = canvas.getContext('2d');
        var htmlString =  $(compliance1GraphId).find("svg").parent().html().trim().replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');                   
        canvg(canvas, htmlString);
        var img = $("#compliance1Canvas")[0].toDataURL('image/png', 1.0);
        pdf.addImage(img, 'png', 10, (imgY),margins.width+100, 170);
        imgY = imgY + 200;
      }
            
      if(pageHeight < imgY ){
        pdf.addPage();
        imgY=20;
      }
      pdf.text(40,imgY, "HCP Name: ");
      pdf.line(90, imgY+5, 350,imgY+5); //left, top, right, top

      pdf.text(375,imgY, "Date: ");
      pdf.line(400, imgY+5, 560, imgY+5);// left, top, right, top

      pdf.text(40,imgY+30, "Signature: ");
      pdf.line(90, imgY+35, 350,imgY+35); //left, top, right, top
      //show loader till this gets executed.
      pdf.save('VisiView™.pdf');      
      },500);   
      //pdf.save('VisiView™.pdf');                
    };

    $scope.getTableDataForPDF = function(){
      var patientDetails = ($scope.slectedPatient) ? $scope.slectedPatient : null;
      var pdfClinic = ($scope.associatedClinics && $scope.associatedClinics.length > 0) ? $scope.associatedClinics[0] : null;
      var pdfClinicAddress = (pdfClinic !== null && pdfClinic.address) ? pdfClinic.address : stringConstants.notAvailable;
      var pdfClinicPhone = (pdfClinic !== null && pdfClinic.phoneNumber) ? pdfClinic.phoneNumber : stringConstants.notAvailable;
      var reportGenerationDate = dateService.getDateFromTimeStamp(new Date().getTime(),patientDashboard.dateFormat,'/');
      var patientMrnId = (patientDetails !== null && patientDetails.mrnId)? $scope.slectedPatient.mrnId : stringConstants.notAvailable;
      var patientName = (patientDetails !== null && patientDetails.firstName)? $scope.slectedPatient.firstName+stringConstants.space+$scope.slectedPatient.lastName : stringConstants.notAvailable;
      var completePatientAddress = (patientDetails !== null && patientDetails.city) ? patientDetails.city : stringConstants.emptyString;
      completePatientAddress += (patientDetails !== null && patientDetails.state) ? ((completePatientAddress.length > 1) ? (stringConstants.comma+patientDetails.state) : patientDetails.state) : completePatientAddress;
      completePatientAddress += (patientDetails !== null && patientDetails.address) ? ((completePatientAddress.length > 1) ? (stringConstants.comma+patientDetails.address) : patientDetails.address) : completePatientAddress;
      completePatientAddress += (patientDetails !== null && patientDetails.zipcode) ? ((completePatientAddress.length > 1) ? (stringConstants.comma+patientDetails.zipcode) : patientDetails.zipcode) : completePatientAddress;
      var patientPhone = (patientDetails !== null && patientDetails.mobilePhone)? $scope.slectedPatient.mobilePhone : stringConstants.notAvailable;
      var patientDOB = (patientDetails !== null && patientDetails.dob)? dateService.getDateFromTimeStamp(patientDetails.dob,patientDashboard.dateFormat,'/') : stringConstants.notAvailable;
      var patientAdherence = (patientDetails !== null && patientDetails.adherence)? $scope.slectedPatient.adherence : stringConstants.notAvailable;
      var patientDeviceType = stringConstants.deviceType;
      var patientDeviceSlNo = ($scope.patientDevices && $scope.patientDevices[0] && $scope.patientDevices[0].serialNumber) ? $scope.patientDevices[0].serialNumber: stringConstants.notAvailable;
      var pdfMissedTherapyDays = ($scope.missedtherapyDays !== null && $scope.missedtherapyDays >= 0) ? $scope.missedtherapyDays : stringConstants.notAvailable;
      var pdfHMRNonAdherenceScore = ($scope.adherenceScore !== null && $scope.adherenceScore >= 0) ? $scope.adherenceScore : stringConstants.notAvailable;
      var pdfSettingDeviation = ($scope.settingsDeviatedDaysCount !== null && $scope.settingsDeviatedDaysCount >= 0) ? $scope.settingsDeviatedDaysCount : stringConstants.notAvailable;
        g_pdfMetaData = {
            rTitle: 'HillRom'
            ,rTitle1: 'VisiView™ Health Portal'
            ,rGenDtLbl : stringConstants.reportGenerationDateLabel
            , rGenDt : reportGenerationDate
            , rRngLble : stringConstants.dateRangeOfReportLabel+stringConstants.colon
            , rRngDt : $scope.fromDate+stringConstants.minus+$scope.toDate
            , rTablePatInfo : {
                title: stringConstants.patientInformationLabel
                , tData:  [
                  stringConstants.mrn+stringConstants.colon, patientMrnId
                  ,stringConstants.name+stringConstants.colon, patientName
                  ,stringConstants.address+stringConstants.colon, completePatientAddress
                  ,stringConstants.phone+stringConstants.colon, patientPhone
                  ,stringConstants.DOB+stringConstants.colon, patientDOB
                  ,stringConstants.adherenceScore, patientAdherence
                ]
            }
            , rDeviceInfo :{
               title: stringConstants.deviceInformationLabel
                , tData:[
                  stringConstants.type+stringConstants.colon, patientDeviceType
                  , stringConstants.serialNumber+stringConstants.colon, patientDeviceSlNo
                 ]
            }
            , rNoteInfo :{
               title: stringConstants.NotificationLabel
                , tData: [
                  stringConstants.missedTherapyDays+stringConstants.colon, pdfMissedTherapyDays
                  ,stringConstants.hmrNonAdherence+stringConstants.colon, pdfHMRNonAdherenceScore
                  ,stringConstants.settingDeviation+stringConstants.colon, pdfSettingDeviation
                ]
            }

          }
    };

    $scope.drawCanvas = function(id, html){            
      var canvas = document.getElementById(id);               
      var ctx = canvas.getContext('2d');      
        ctx.clearRect(0, 0,1300,350);
        var img = new Image();
        img.setAttribute('img','img');
        img.onload = function(){
          img.crossOrigin = 'Anonymous';
          ctx.drawImage(img,0,0); // Or at whatever offset you like
        };      
        img.onerror = function() {}
        img.onabort = function() {}      
        var imgsrc = 'data:image/svg+xml;base64,'+ window.btoa(html);
        var data = {"Encoded String": imgsrc};
        patientDashBoardService.convertSVGToImg(data).then(function(response){        
          img.src = response.data['Encoded String'];
        });
    };

    

}]);

