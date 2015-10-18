'use strict';

angular.module('hillromvestApp')
.controller('graphController',
  ['$scope', '$state', 'patientDashBoardService', 'StorageService', 'dateService', 'graphUtil', 'patientService', 'UserService', '$stateParams', 'notyService', '$timeout', 'graphService', 'caregiverDashBoardService', 'loginConstants',
  function($scope, $state, patientDashBoardService, StorageService, dateService, graphUtil, patientService, UserService, $stateParams, notyService, $timeout, graphService, caregiverDashBoardService, loginConstants) {

    var chart;
    var hiddenFrame, htmlDocument;
    $scope.init = function() {
      $scope.yAxisRangeForHMRLine = $scope.yAxisRangeForCompliance = $scope.compliance = {};
      $scope.lazyLoadParamsPieChart = [
        'scripts/third_party_library/angular.easypiechart.js'
        ];
        $scope.lazyLoadParamsDatePicker = [
        'bower_components/angular-daterangepicker/js/angular-daterangepicker.js'
        ];
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
      } else if(currentRoute === 'patientOverview' || currentRoute === 'hcppatientOverview' || currentRoute === 'clinicadminpatientOverview') {
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
    };


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
        $scope.getDayHMRGraphData();
      } else if(days === 0 && $scope.selectedGraph === 'COMPLIANCE'){
        $scope.plotNoDataAvailable();
        $scope.isComplianceExist = false;
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
          $scope.hmrRunRate = response.data.hmrRunRate;
          $scope.adherenceScore = response.data.score;
        }
      });
    }

    $scope.getMissedTherapyDaysCount = function() {
      patientDashBoardService.getMissedTherapyDaysCount($scope.patientId).then(function(response){
        if(response.status === 200 ){
          $scope.missedtherapyDays = response.data.count;
        }
      });
    }

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
      if(StorageService.get('logged').role === 'HCP'){
        $state.go('hcp'+status, {'patientId': $stateParams.patientId});
      }else{
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
          if(value.startTime === e.point.x && value.hmr !== 0 ){
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
      $scope.selectedGraph = 'HMR';
      $scope.complianceGraph = false;
      $scope.hmrGraph = true;
      $scope.removeGraph();
      $scope.drawGraph();
    };
    $scope.getNonDayHMRGraphData = function() {
      patientDashBoardService.getHMRGraphPoints($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.groupBy).then(function(response){
        $scope.completeGraphData = response.data;
        if($scope.completeGraphData.actual === undefined){
          $scope.graphData = [];
          $scope.plotNoDataAvailable();
        } else {
          $scope.noDataAvailable = false;
          $scope.completeGraphData = graphUtil.convertIntoServerTimeZone($scope.completeGraphData,patientDashboard.hmrNonDayGraph);
          $scope.yAxisRangeForHMRLine = graphUtil.getYaxisRangeLineGraph($scope.completeGraphData);
          $scope.graphData = graphUtil.convertToHMRStepGraph($scope.completeGraphData,patientDashboard.HMRLineGraphColor);
          /* waiting until svg element loads*/
          var count =5;
          $scope.waitFunction = function waitHandler() {
             var svgCount = document.getElementsByTagName('svg').length;
            if(svgCount > 0 || count === 0 ) {
              $scope.drawHMRLineGraph();
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
      $scope.removeGraph();
      $scope.handlelegends();
      $scope.createComplianceGraphData();
      $scope.drawComplianceGraph();
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

    $scope.getDayHMRGraphData = function() {
      patientDashBoardService.getHMRBarGraphPoints($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-')).then(function(response){
        $scope.completeGraphData = response.data;
        if($scope.completeGraphData.actual === undefined){
           $scope.hmrBarGraphData = [];
           $scope.yAxisRangeForHMRBar = {};
           $scope.yAxisRangeForHMRBar.min = 0;
           $scope.yAxisRangeForHMRBar.max = 0;
           $scope.plotNoDataAvailable();
         } else {
          $scope.noDataAvailable = false;
          $scope.completeGraphData = graphUtil.convertIntoServerTimeZone($scope.completeGraphData,patientDashboard.hmrDayGraph);
          $scope.completeGraphData = graphUtil.formatDayWiseDate($scope.completeGraphData.actual);
          $scope.yAxisRangeForHMRBar = graphUtil.getYaxisRangeBarGraph($scope.completeGraphData);
          $scope.hmrBarGraphData = graphUtil.convertToHMRBarGraph($scope.completeGraphData,patientDashboard.HMRBarGraphColor);
          $scope.drawHMRBarGraph();
          //
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


              d3.selectAll('#hmrBarGraph svg').selectAll(".nv-axis .tick").append('circle').
              attr("cx" , 0).
              attr("cy", 0).
              attr("r" , 2.3).
              attr("fill" , '#aeb5be');
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
          //
         }
      }).catch(function(response) {
        $scope.hmrBarGraphData = [];
        $scope.plotNoDataAvailable();
      });
    };

    $scope.getComplianceGraphData = function(format) {
      patientDashBoardService.getHMRGraphPoints($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.groupBy).then(function(response){
        $scope.completeComplianceData = response.data;
        if($scope.completeComplianceData.actual === undefined){
          $scope.complianceGraphData = [];
          $scope.plotNoDataAvailable();
          $scope.isComplianceExist = false;
        }else if($scope.completeComplianceData.actual.length < 2){
          $scope.plotNoDataAvailable();
          $scope.isComplianceExist = false;
        }
         else {
          //recommended values
          $scope.noDataAvailable = false;
          $scope.completeComplianceData = graphUtil.convertIntoServerTimeZone($scope.completeComplianceData,patientDashboard.complianceGraph);
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
        $scope.getNonDayHMRGraphData();
      } else if ($scope.complianceGraph) {
        $scope.getComplianceGraphData();
      }
    }

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
    //hmrDayChart
    $scope.dayChart = function() {
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
        $scope.getDayHMRGraphData();
      }
    };


    $scope.showComplianceGraph = function() {
      $scope.noDataAvailable = false;
      $scope.selectedGraph = 'COMPLIANCE';
      $scope.complianceGraph = true;
      $scope.hmrGraph = false;
      if($scope.fromTimeStamp === $scope.toTimeStamp){
        $scope.calculateTimeDuration(6);
      }
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
      .margin({top: 30, right: 70, bottom: 50, left: 70})
      .showLegend(false)
      .color(d3.scale.category10().range());
     // chart.noData("Nothing to see here.");
      chart.tooltipContent($scope.toolTipContentForCompliance($scope.completeComplianceData.actual));
      //this function to put x-axis labels
      chart.xAxis.tickFormat(function(d) {
          var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
          if(days > 10){
            return d3.time.format('%d%b%y')(new Date(d));
          } else{
            return d3.time.format('%d%b%y %H:%M')(new Date(d));
          }
        });
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

        y1AxisMark.append('g').
        attr('class','maxRecommendedLevel').
        attr('transform','translate(-45,'+ y1AxisMaxTransform + ')').
        append('text').
        text('MAX').
        style('fill','green');

        y2AxisMark.append('g').
        attr('class','minRecommendedLevel').
        attr('transform','translate(20,'+ (y2AxisMinTransform + 3) + ')').
        append('text').
        text('MIN').
        style('fill','red');

        y2AxisMark.append('g').
        attr('class','maxRecommendedLevel').
        attr('transform','translate(20,'+ (y2AxisMaxTransform + 3) + ')').
        append('text').
        text('MAX').
        style('fill','green');
      }
      return chart;
    });
  };


    /*this should initiate the list of caregivers associated to the patient*/
    $scope.initPatientCaregiver = function(){
      $scope.getCaregiversForPatient(StorageService.get('logged').patientID);
    };

    $scope.getPatientById = function(patientId){
      patientService.getPatientInfo(patientId).then(function(response){
        $scope.slectedPatient = response.data;
      });
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
      $scope.getMissedTherapyDaysCount();
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

      $scope.drawHMRLineGraph = function() {
        nv.addGraph(function() {
           chart = nv.models.lineChart()
          .margin({top: 30, right: 50, bottom: 50, left: 50})
          .showLegend(false)
          //.interpolate('step-after')
          .color(d3.scale.category10().range());
         // chart.noData("Nothing to see here.");
          chart.tooltipContent($scope.toolTipContentStepChart());
          chart.lines.dispatch.on('elementClick', function(event) {
            $scope.dayGraphForNode(event.point.x);
          });
          //this function to put x-axis labels
          chart.xAxis.tickFormat(function(d) {
          var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
          if(days > 10){
            return d3.time.format('%d%b%y')(new Date(d));
          } else{
            return d3.time.format('%d%b%y %H:%M')(new Date(d));
          }
        });

          chart.yAxis.tickFormat(d3.format('d'));
          chart.forceY([$scope.yAxisRangeForHMRLine.min, $scope.yAxisRangeForHMRLine.max]);
          chart.yAxis.axisLabel('Hours');
            d3.select('#hmrLineGraph svg')
          .datum($scope.graphData)
          .transition().duration(500).call(chart);
         var circlesInHMR = d3.select('#hmrLineGraph svg').select('.nv-scatterWrap').select('.nv-group.nv-series-0').selectAll('circle')[0];
         var count = 0;
         var missedTherapyCircles = [];
         angular.forEach($scope.completeGraphData.actual,function(value){
          if(value.missedTherapy === true){
            missedTherapyCircles.push(circlesInHMR[count]);
          }
          count++;
         })
         angular.forEach(missedTherapyCircles,function(circle){
          d3.select('#hmrLineGraph svg').select('.nv-scatterWrap').select('.nv-group.nv-series-0').append('circle')
          .attr('cx',circle.attributes.cx.value)
          .attr('cy',circle.attributes.cy.value)
          .attr('r',4.5)
          .attr('class','missed_therapy_node');
         })

         d3.selectAll('#hmrLineGraph svg').selectAll(".nv-axis .tick").append('circle').
        attr("cx" , 0).
        attr("cy", 0).
        attr("r" , 2).
        attr("fill" , '#aeb5be');

        d3.selectAll('#hmrLineGraph svg').selectAll(".nv-axis .nv-axislabel").
        attr("y" , -40);
          //
          return chart;
      }, function(){
        $timeout(function() {
        $(hiddenFrame).remove();
        var printId1 = "#lineGraphWrapper";
        if($scope.selectedGraph === "COMPLIANCE"){
          printId1 = "#complianceGraphWrapper";
        }
        //var printId2 = "#complianceGraphWrapper";
        var graphData = ($scope.hmrGraph) ? $scope.completeGraphData : $scope.completeComplianceData;
        var element1 = document.querySelectorAll(printId1)[0],
        //element2 = document.querySelectorAll(printId2)[0],
        html1 = (element1) ? element1.innerHTML: "",
        //html2 = element2.innerHTML,
        //htmlDocument,
        doc;

        hiddenFrame = $('<iframe id="pdfID" style="display: none"></iframe>').appendTo('body')[0];
        //$scope.complianceGraph =  true;
        //$scope.hmrLineGraph = true;
        //$scope.getComplianceGraphData();
        //$scope.drawGraph();
        hiddenFrame.contentWindow.printAndRemove = function() {

            //$scope.drawComplianceGraph();
        $timeout( function(){
          // hiddenFrame.contentWindow.focus();
          if(doc.readyState == 'complete') {
              // hiddenFrame.contentWindow.print();
            //hiddenFrame.contentWindow.print();
          }
          //$(hiddenFrame).remove();
          // $("#complianceGraphWrapper").hide();
          // d3.selectAll('#complianceGraph svg').selectAll("*").remove();
          // $scope.complianceGraph =  false;
        }, 0);
      };

      var patientDetails = ($scope.slectedPatient) ? $scope.slectedPatient : null;
      var pdfClinic = ($scope.associatedClinics && $scope.associatedClinics.length > 0) ? $scope.associatedClinics[0] : null;
      var completeAddress = (pdfClinic !== null && pdfClinic.city) ? pdfClinic.city : stringConstants.emptyString;
      completeAddress += (pdfClinic !== null && pdfClinic.state) ? ((completeAddress.length > 1) ? (stringConstants.comma+pdfClinic.state) : pdfClinic.state) : completeAddress; 
      completeAddress += (pdfClinic !== null && pdfClinic.address) ? ((completeAddress.length > 1) ? (stringConstants.comma+pdfClinic.address) : pdfClinic.address) : completeAddress;
      completeAddress += (pdfClinic !== null && pdfClinic.zipcode) ? ((completeAddress.length > 1) ? (stringConstants.comma+pdfClinic.zipcode) : pdfClinic.zipcode) : completeAddress;
      var pdfClinicName = (pdfClinic !== null && pdfClinic.name) ? pdfClinic.name : stringConstants.notAvailable; 
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
      var pdfSettingDeviation = stringConstants.notAvailable;
      htmlDocument = "<!doctype html>" +
            '<html style="background: white;"><head>' +
            '<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />'+
            '<meta http-equiv="X-UA-Compatible" content="IE=edge">' +
            '<link rel="stylesheet" href="bower_components/nvd3/src/nv.d3.css" />' +
            '<link rel="stylesheet" href="styles/style.css">' +
            '</head>' +
            '<body onload="printAndRemove();">' + // Print only after document is loaded
            '<div class="pdf__heading-primary">'+pdfClinicName+'</div>' +
            '<div class="pdf__heading-secondary">'+completeAddress+'</div>' +
            '<div class="pdf__heading-secondary pdf--heading-border">'+pdfClinicPhone+'</div>' +
            '<div class="title">'+
            '<span class="title--heading">'+stringConstants.reportGenerationDateLabel+'</span>'+
            '<span class="title--desc">'+reportGenerationDate+'</span>'+
            '</div>' +
            '<div class="title">'+
            '<span class="title--heading">'+stringConstants.dateRangeOfReportLabel+stringConstants.colon+'</span>'+
            '<span class="title--desc">'+$scope.fromDate+stringConstants.minus+$scope.toDate+'</span>'+
            '</div>' +
            '<div class="pdf-container table-right">'+
              '<table border=1>' +
              '<thead>'+
              '<tr>'+
              '<th colspan="2">'+stringConstants.patientInformationLabel+'</th>' + 
              '</tr>'+
              '</thead>'+
              '<tr><td class="heading">'+stringConstants.mrn+stringConstants.colon+'</td><td class="desc">'+patientMrnId+'</td></tr>' +
              '<tr><td class="heading">'+stringConstants.name+stringConstants.colon+'</td><td class="desc-highlight">'+patientName+'</td></tr>' +
              '<tr><td class="heading">'+stringConstants.address+stringConstants.colon+'</td><td class="desc">'+completePatientAddress+'</td></tr>' +
              '<tr><td class="heading">'+stringConstants.phone+stringConstants.colon+'</td><td class="desc">'+patientPhone+'</td></tr>' +
              '<tr><td class="heading">'+stringConstants.DOB+stringConstants.colon+'</td><td class="desc">'+patientDOB+'</td></tr>' +
              '<tr><td class="heading">'+stringConstants.adherenceScore.replace(/ /g, '&nbsp')+stringConstants.colon+'</td><td class="desc-highlight">'+patientAdherence+'</td></tr>' +
              '</table>' +
            '</div>' +
            '<div class="pdf-container table-left">'+
              '<table border=1>' +
                '<thead>'+
                  '<tr>'+
                    '<th colspan="2">'+stringConstants.deviceInformationLabel+'</th>' + 
                  '</tr>'+
                '</thead>'+
              '<tr><td class="heading">'+stringConstants.type+stringConstants.colon+'</td><td class="desc-highlight">'+patientDeviceType.replace(/ /g, '&nbsp')+'</td></tr>' +
              '<tr><td class="heading">'+stringConstants.serialNumber+stringConstants.colon+'</td><td class="desc">'+patientDeviceSlNo+'</td></tr>' +
              '</table>' +
              '<table class="pdf--margin-top" border=1 ng-if="true">' +
                '<thead>'+
                  '<tr>'+
                    '<th colspan="2">'+stringConstants.NotificationLabel+'</th>' + 
                  '</tr>'+
                '</thead>'+ 
              '<tr><td class="heading">'+stringConstants.missedTherapyDays+stringConstants.colon+
              '</td><td class="desc-highlight">'+pdfMissedTherapyDays+'</td></tr>' +
              '<tr><td class="heading">'+stringConstants.hmrNonAdherence+stringConstants.colon+
              '</td><td class="desc-highlight">'+pdfHMRNonAdherenceScore+'</td></tr>' +
              '<tr><td class="heading">'+stringConstants.settingDeviation+stringConstants.colon+
              '</td><td class="desc-highlight">'+pdfSettingDeviation+'</td></tr>' +
              '</table>' +
            '</div>' +
            '<div class="graph-title"></div>'+
            '<div>'+
              html1 +
            '</div>'+
            '</body>' +
            "</html>";
          doc = hiddenFrame.contentWindow.document.open();
          doc.write(htmlDocument);
          doc.close();
},500);
      });
    }




//end
    $scope.drawHMRBarGraph = function() {
        nv.addGraph(function() {
           chart = nv.models.multiBarChart()
          .margin({top: 30, right: 50, bottom: 50, left: 50})
          .showControls(false)
          .showLegend(false)
          .color(d3.scale.category10().range());
         // chart.noData("Nothing to see here.");
          chart.tooltipContent($scope.toolTipContentBarChart());
          //this function to put x-axis labels
          chart.xAxis.tickFormat(function(d) {
            return d3.time.format('%I:%M %p')(new Date(d));
            return dateService.getTimeIntervalFromTimeStamp(d);
        });

          chart.yAxis.tickFormat(d3.format('d'));
          chart.forceY([$scope.yAxisRangeForHMRBar.min, $scope.yAxisRangeForHMRBar.max]);
          chart.yAxis.axisLabel('Hours');
          d3.select('#hmrBarGraph svg')
          .datum($scope.hmrBarGraphData)
          .transition().duration(500).call(chart);
          return chart;
      });
    }

    $scope.downloadAsPdf = function(){
      /*var graphData = ($scope.hmrGraph) ? $scope.completeGraphData : $scope.completeComplianceData;
      graphService.getPdfForSVGGraph(graphData);   */ 
       $scope.drawHMRLineGraph();
      setTimeout(function() {
      hiddenFrame.contentWindow.print();
      },700);
    };

    $scope.downloadRawDataAsCsv = function(){
      patientService.getDeviceDataAsCSV($scope.patientId, $scope.fromTimeStamp, $scope.toTimeStamp).then(function(response){
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
      $scope.selectedDateOption = 'DAY';
      $scope.toDate = $scope.fromDate =  dateService.getDateFromTimeStamp(timestamp,patientDashboard.dateFormat,'/');
      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.fromDate};
      $scope.removeGraph();
       if($scope.hmrGraph) {
        $scope.format = 'dayWise';
        $scope.hmrLineGraph = false;
        $scope.hmrBarGraph = true;       
        $scope.toTimeStamp = $scope.fromTimeStamp = timestamp;
        $scope.getDayHMRGraphData();
      }
    };
    
}]);
