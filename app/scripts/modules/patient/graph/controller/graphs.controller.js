'use strict';

angular.module('hillromvestApp')
.controller('graphController',
  ['$scope', '$state', 'patientDashBoardService', 'StorageService', 'dateService', 'graphUtil', 'patientService', 'UserService', '$stateParams', 'notyService', '$timeout', 'graphService', 'caregiverDashBoardService', 'loginConstants', '$location','$filter',
  function($scope, $state, patientDashBoardService, StorageService, dateService, graphUtil, patientService, UserService, $stateParams, notyService, $timeout, graphService, caregiverDashBoardService, loginConstants, $location, $filter) {
    var chart;
    var hiddenFrame, htmlDocument;
    var g_str='<style>.nvd3 .nv-point-paths path {stroke: #aaa;stroke-opacity: 0;fill: #eee;fill-opacity: 0;border: 5px red solid;}.nv-point {    stroke-opacity: 1 !important;    stroke-width: 3px !important;}.missed_therapy_node {fill: #cf202f;stroke: #fff;stroke-width: 1.5;fill-opacity: 1;}.nv-lineChart g rect {fill: #e3ecf7;opacity: 1 !important;}.nvd3 .nv-groups path.nv-line {fill: none;}.svg_bg {fill: #e3ecf7;}.nvd3.nv-stackedarea path.nv-area {fill-opacity: .7;stroke-opacity: 0;transition: fill-opacity 250ms linear, stroke-opacity 250ms linear;    -moz-transition: fill-opacity 250ms linear, stroke-opacity 250ms linear;-webkit-transition: fill-opacity 250ms linear, stroke-opacity 250ms inear;}</style>';
    var g_pdfMetaData={};
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
      } else if(currentRoute === 'patientOverview' || currentRoute === 'hcppatientOverview' || currentRoute === 'clinicadminpatientOverview' || currentRoute === 'patientOverviewRcadmin') {
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
    $scope.initTmp();
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
    //JAY
    $scope.initTmp = function (){
      //alert("in INit");
      $('<div id=sd >HMR<br/><canvas id=cGraph width=1300 height=350></canvas></div>').appendTo("body");
      $('<div id=hd </div>').appendTo("body");
      $(".footer").remove();

    };
    $scope.initPdfMetaData = function (strHtml){
      $('#hd').html(strHtml);
        $('#hd').find('svg')
        .attr('version',1.1)
        .attr('width','1300px')
        .attr('height','350px')
        .attr('font-family', 'helvetica')
        .attr('font-size', '12px')
        .attr('xmlns','http://www.w3.org/2000/svg')
        .append('<defs>'+g_str+'</defs>');
        $scope.drawCanvas('cGraph',$("#hd").find("svg").parent().html());

      
      var patientDetails = ($scope.slectedPatient) ? $scope.slectedPatient : null;
      var pdfClinic = ($scope.associatedClinics && $scope.associatedClinics.length > 0) ? $scope.associatedClinics[0] : null;
      //var completeAddress = (pdfClinic !== null && pdfClinic.city) ? pdfClinic.city : stringConstants.emptyString;
      //completeAddress += (pdfClinic !== null && pdfClinic.state) ? ((completeAddress.length > 1) ? (stringConstants.comma+pdfClinic.state) : pdfClinic.state) : completeAddress;
      //completeAddress += (pdfClinic !== null && pdfClinic.address) ? ((completeAddress.length > 1) ? (stringConstants.comma+pdfClinic.address) : pdfClinic.address) : completeAddress;
      //completeAddress += (pdfClinic !== null && pdfClinic.zipcode) ? ((completeAddress.length > 1) ? (stringConstants.comma+pdfClinic.zipcode) : pdfClinic.zipcode) : completeAddress;
      //var pdfClinicName = (pdfClinic !== null && pdfClinic.name) ? pdfClinic.name : stringConstants.notAvailable;
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
            ,rTitle1: 'VisiView™ Health Portall'
            ,rGenDtLbl : stringConstants.reportGenerationDateLabel
            , rGenDt : reportGenerationDate
            , rRngLble : stringConstants.dateRangeOfReportLabel+stringConstants.colon
            , rRngDt : $scope.fromDate+stringConstants.minus+$scope.toDate
            , rTablePatInfo : {
                title: stringConstants.patientInformationLabel
                , tData:  [
                  stringConstants.mrn+stringConstants.colon, patientMrnId
                  ,stringConstants.name+stringConstants.colon, patientName
                  ,stringConstants.address+stringConstants.colon, completePatientAddress// + '5th Main, 7th Cross,\n MalleshPalya, /n Bangalore pin - 560123'
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

       /*var s =  document.createElement('svg');
        s.setAttribute("version", 1.1);
        s.setAttribute("id", "mySVG1");
        s.setAttribute("width", "1200px");
        s.setAttribute("height", "350px");
        s.setAttribute("font-size", "xx-small");
        s.setAttribute("font-family", "verdana");
        s.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        //s.innerHTML = $("svg").html();
        s.innerHTML = html;
        //$("#sDv").html("");
        $("#sd").append(s); //$("#sDv").append(s);
        $('#mySVG1').append('<defs>'+g_str+'</defs>');
      */        


          var myCanvas = document.getElementById(id);

          //myCanvas.setAttribute('id', 'canvas');     
      
          var ctx = myCanvas.getContext('2d');
            ctx.clearRect(0, 0,1300,350);
              var img = new Image();
              
              img.setAttribute('img','img');
              
            //img.setAttribute("width","1200px");
            //img.setAttribute("height","350px");
           // alert("in IMG OUT >" + !!document.createElement('canvas').getContext);

          img.onload = function(){
            //alert("in IMG");
            img.crossOrigin = 'Anonymous';
            ctx.drawImage(img,0,0); // Or at whatever offset you like
          };

          img.onerror = function() {
              alert("error image");
          }
           img.onabort = function() {
              alert("broken image");
          }


//ctx.drawImage(img,0,0);
          
                  
          //var imgsrc = 'data:image/svg+xml;base64,'+ window.btoa(html);
          
          var imgsrc = 'data:image/svg+xml;base64,'+ window.btoa(html);

          var data = {"Encoded String": imgsrc};
                  patientDashBoardService.convertSVGToImg(data).then(function(response){
                    //Success Block
                    console.log("response > ", response.data['Encoded String']);
                    img.src = response.data['Encoded String'];
                  }).catch(function(response){
                    //Error Block
                    console.log("erro > ", response);
                  });

          //var imgsrc = 'data:image/svg+xml;base64,'+ btoa($('#mySVG1')[0].outerHTML);
          
        
        //$("body").append(img);
        //myCanvas.setAttribute('width', img.width);
        //myCanvas.setAttribute('height',  img.height);
        //myCanvas.width=img.width;
        //myCanvas.height=img.height;
        //$('#sd').append(myCanvas);//$("#mDv").append(myCanvas);

    }

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
      alert("draw Graph")
      var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
      if(days === 0 && $scope.selectedGraph === 'HMR'){
        $scope.format = 'dayWise';
        $scope.hmrLineGraph = false;
        $scope.hmrBarGraph = true;
        $scope.removeGraph();
        $scope.getDayHMRGraphData();
      } else if(days === 0 && $scope.selectedGraph === 'COMPLIANCE'){
        //$scope.toTimeStamp = new Date().getTime();
        $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
        //$scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
        $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
        /*$scope.complianceGraphData = [];
        $scope.plotNoDataAvailable();
        $scope.isComplianceExist = false;*/
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
          $scope.graphData = graphUtil.convertToHMRStepGraph($scope.completeGraphData,patientDashboard.HMRLineGraphColor,$scope.yAxisRangeForHMRLine.unit);
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
      //alert("recreate compliance");
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
          $scope.hmrBarGraphData = graphUtil.convertToHMRBarGraph($scope.completeGraphData,patientDashboard.HMRBarGraphColor,$scope.yAxisRangeForHMRBar.unit);
          $scope.drawHMRBarGraph();
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

    $scope.customizationForBarGraph = function() {
      var rect_width,  rect_height;
      setTimeout(function(){
        rect_height = d3.select('#hmrBarGraph svg').select('.nv-barsWrap .nv-wrap rect').attr('height');
        rect_width = d3.select('#hmrBarGraph svg').select('.nv-barsWrap .nv-wrap rect').attr('width');


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

        angular.forEach(d3.select('#hmrBarGraph svg').selectAll('rect.nv-bar')[0], function(bar){
          d3.select(bar).attr("width", d3.select(bar).attr("width")/4);
          d3.select(bar).attr("x", d3.select(bar).attr("width")*1.5);
          d3.select(bar).style({'fill-opacity': '1'});
        });

        d3.select('#hmrBarGraph svg').style("visibility", "visible");
      },500);

    };

    $scope.getComplianceGraphData = function(format) {
      patientDashBoardService.getHMRGraphPoints($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.groupBy).then(function(response){
        $scope.completeComplianceData = response.data;
        if($scope.completeComplianceData.actual === undefined){
          $scope.complianceGraphData = [];
          $scope.plotNoDataAvailable();
          $scope.isComplianceExist = false;
        }/*else if($scope.completeComplianceData.actual.length < 2){
          $scope.plotNoDataAvailable();
          $scope.isComplianceExist = false;
        }*/
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
      /*if($scope.fromTimeStamp === $scope.toTimeStamp){
        $scope.calculateTimeDuration(6);
      }*/
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
    //d3.select('#complianceGraph svg').selectAll("*").remove();
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
        chart.xAxis.showMaxMin(true).tickValues($scope.complianceGraphData[0].values.map( function(d){return d.x;} ) ).tickFormat(function(d) {
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
          missedTherapy.cssClass = 'missed_therapy_year_node';
          missedTherapy.radius = 0.7;
         } else {
          missedTherapy.cssClass = 'missed_therapy_node';
          missedTherapy.radius = 3;
         }

         angular.forEach(missedTherapyCircles,function(circle){
          d3.select('#complianceGraph svg').selectAll('.nv-group.nv-series-0').append('circle')
          .attr('cx',circle.attributes.cx.value)
          .attr('cy',circle.attributes.cy.value)
          .attr('r',missedTherapy.radius)
          .attr('class', missedTherapy.cssClass);
         })

         /* Mark red color for missed therapy  -- end --*/
         setTimeout(function(){

         var bgHeight = d3.select('#complianceGraph svg').select('.x .tick line').attr("y2");
         var bgWidth = d3.select('#complianceGraph svg ').select('.y1 .tick line').attr("x2");
         d3.select('#complianceGraph svg .nv-axis g').append('rect')
                  .attr("height", Math.abs(bgHeight))
                  .attr("width", bgWidth)
                  .attr("x" , 0)
                  .attr("y" , bgHeight)
                  .attr("class" , "svg_bg");
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
      d3.selectAll('#complianceGraph svg').selectAll(".x.axis .tick").selectAll('text').
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
      return chart;
    },function(){
        $timeout(function() {
        $(hiddenFrame).remove();
        var printId1 = "#complianceGraphPrim";
        var graphData = $scope.completeComplianceData;
        var element1 = document.querySelectorAll(printId1)[0],
        html1 = (element1) ? element1.innerHTML: "",
        doc;
        $scope.initPdfMetaData(html1);

},1500);
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
          chart.xAxis.showMaxMin(true).tickFormat(function(d) {return d3.time.format('%d-%b-%Y')(new Date(d));});
          chart.yAxis.tickFormat(d3.format('d'));
          if($scope.yAxisRangeForHMRLine.min === 0 && $scope.yAxisRangeForHMRLine.max === 0){
            chart.forceY([$scope.yAxisRangeForHMRLine.min, 1]);
          }else{
            chart.forceY([$scope.yAxisRangeForHMRLine.min, $scope.yAxisRangeForHMRLine.max]);
          }
          chart.yAxis.axisLabel($scope.yAxisRangeForHMRLine.ylabel);
            d3.select('#hmrLineGraph svg')
          .datum($scope.graphData)
          .transition().duration(500).call(chart);

         d3.selectAll('#hmrLineGraph svg').style("visibility", "hidden");
         var circlesInHMR = d3.select('#hmrLineGraph svg').select('.nv-scatterWrap').select('.nv-group.nv-series-0').selectAll('circle')[0];
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
          missedTherapy.cssClass = 'missed_therapy_year_node';
          missedTherapy.radius = 0.7;
         } else {
          missedTherapy.cssClass = 'missed_therapy_node';
          missedTherapy.radius = 3;
         }

         angular.forEach(missedTherapyCircles,function(circle){
          d3.select('#hmrLineGraph svg').select('.nv-scatterWrap').select('.nv-group.nv-series-0').append('circle')
          .attr('cx',circle.attributes.cx.value)
          .attr('cy',circle.attributes.cy.value)
          .attr('r',missedTherapy.radius)
          .attr('class',missedTherapy.cssClass);
         })

         d3.selectAll('#hmrLineGraph svg').selectAll(".nv-axis .tick").append('circle').
          attr("cx" , 0).
          attr("cy", 0).
          attr("r" , 2).
          attr("fill" , '#aeb5be');




        d3.selectAll('#hmrLineGraph svg').selectAll(".nv-axis .nv-axislabel").
        attr("y" , -40);

        if($scope.graphData[0] && $scope.graphData[0].values.length > 20){
          setTimeout(function() {
              d3.selectAll('#hmrLineGraph svg').selectAll('.nv-lineChart circle.nv-point').attr("r", "0");
              d3.selectAll('#hmrLineGraph svg').style("visibility", "visible");
          }, 500);
        } else {
          setTimeout(function() {
              d3.selectAll('#hmrLineGraph svg').selectAll('.nv-lineChart circle.nv-point').attr("r", "1.3");
              d3.selectAll('#hmrLineGraph svg').style("visibility", "visible");
          }, 500);
        }

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
        $scope.initPdfMetaData(html1);

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
          chart.xAxis.tickValues($scope.hmrBarGraphData[0].values.map( function(d){return d.x;} ) ).tickFormat(function(d) {
            return d3.time.format('%I:%M %p')(new Date(d));
            return dateService.getTimeIntervalFromTimeStamp(d);
        });
          if($scope.yAxisRangeForHMRBar.min === 0 && $scope.yAxisRangeForHMRBar.max === 0){
            chart.forceY([$scope.yAxisRangeForHMRBar.min,1]);
          }else{
            chart.forceY([$scope.yAxisRangeForHMRBar.min, $scope.yAxisRangeForHMRBar.max]);
          }
          chart.yAxis.tickFormat(d3.format('d'));
          chart.yAxis.axisLabelDistance(50);
          chart.yAxis.axisLabel($scope.yAxisRangeForHMRBar.ylabel);
          d3.select('#hmrBarGraph svg')
          .datum($scope.hmrBarGraphData)
          .transition().duration(500).call(chart);
          d3.select('#hmrBarGraph svg').style("visibility", "hidden");
          return chart;
      });
    }

    $scope.downloadPDFFile = function (){
        //alert('downloadPDF');
     
        var pdf = new jsPDF('p', 'pt', 'a4', true), specialElementHandlers = {
             '#bypassme': function(element, renderer){
              return true;
            }};
                          
       var margins = {
          top: 70,
          bottom: 60,
          left: 40,
          width: 550,
          titleTop:40,
          tCellWidth:128,
          tCapWidth:256,
          t2TabLeft:305
      };

     
      //$('#sd').append('<div id=rpTitle style=font-family:verdana; font-size:30px>' + g_pdfMetaData.rTitle + '</div>');

//pdf.cellInitialize();
      
        //pdf.addSVG($("#hd div svg"), 20, 20, pdf.internal.pageSize.width - 20*2);

        var rDate = g_pdfMetaData.rGenDt, rTitle = g_pdfMetaData.rTitle, rTitle1=g_pdfMetaData.rTitle1;
       // Title
       //rTitle = $("#rpTitle");
          pdf.setFont("helvetica");
          
       
          pdf.setFontSize(16);
          pdf.setTextColor(124,163,220);
          pdf.text(margins.width-45, margins.titleTop,rTitle);
    
          
          pdf.setFontSize(8);
          pdf.setTextColor(0,0,0);
          pdf.text(margins.width-79,   margins.titleTop+10, rTitle1);
          pdf.line(margins.left, margins.titleTop+13, margins.width+10, margins.titleTop+13);

          pdf.text(margins.left,margins.top, g_pdfMetaData.rGenDtLbl + ': ' + g_pdfMetaData.rGenDt);
          
          pdf.text(margins.t2TabLeft, margins.top, g_pdfMetaData.rRngLble + g_pdfMetaData.rRngDt);
          
          // Pat Info Table:
          
           //var table = tableToJson(str);
            pdf.cellInitialize();

           pdf.margins = 1;
           pdf.setFont("helvetica");
           

           //pdf.setTextColor(88,88,88)
          
          pdf.cellInitialize();
           
           var tabInfo = g_pdfMetaData.rTablePatInfo.tData;
           var rCount =0;
           for(var i=0;i<tabInfo.length;i=i+2){
                 rCount++;
                if(i==0){
                  pdf.setFontType("bold");
                  pdf.cell(margins.left, margins.top+10, margins.tCapWidth, 20, g_pdfMetaData.rTablePatInfo.title); 
                }
                pdf.setFontType("normal");
                pdf.setTextColor(0,0,0)
                pdf.cell(margins.left, margins.top+30, 70, 20, tabInfo[i], rCount+1);  
                
                //if(tabInfo[i].trim()=="Address:"){
                 // alert(tabInfo[i+1].replace(/([\S\s]{15})/g , '\n'));
                //  pdf.cell(margins.left, margins.top, margins.tCellWidth, 20, tabInfo[i+1].replace(/([\S\s]{40})/g , '\n'), rCount+1);  
                //} else {
                  pdf.cell(margins.left, margins.top+30, 186, 20, tabInfo[i+1], rCount+1);  
                //}
                
            
           }

          pdf.cellInitialize();
           tabInfo = g_pdfMetaData.rDeviceInfo.tData;
           var rCount =0;
           for(var i=0;i<tabInfo.length;i=i+2){
                 rCount++;
                if(i==0){
                  pdf.setFontType("bold");
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
                  pdf.setFontType("bold");
                  pdf.cell(margins.t2TabLeft, margins.top+75, margins.tCapWidth, 20, g_pdfMetaData.rNoteInfo.title); 
                }
                pdf.setTextColor(0,0,0)
                 pdf.setFontType("normal");
                pdf.cell(margins.t2TabLeft, margins.top+95, margins.tCellWidth, 20, tabInfo[i].toString(), rCount+1);   
                 pdf.cell(margins.t2TabLeft, margins.top, margins.tCellWidth, 20, tabInfo[i+1].toString(), rCount+1);  
           }

                pdf.text(40,250, "Patient Treatment Duration:");
                //var img = $("#cHMR")[0].toDataURL('image/png', 1.0);

                pdf.text(40,765, "HCP Name: ");
                pdf.line(90, 770, 350,770); //left, top, right, top

                pdf.text(375,765, "Date: ");
                pdf.line(400, 770, 560, 770);// left, top, right, top

                pdf.text(40,795, "Signature: ");
                pdf.line(90, 800, 350,800); //left, top, right, top

                
                var img = $("#cGraph")[0].toDataURL('image/png', 1.0);

                pdf.addImage(img, 'png', 40, (250),margins.width+100, 170);
                  pdf.save('hillrom.pdf');
                /*
                var data = {"Encoded String": 'data:image/svg+xml;base64,'+ window.btoa($("#hd").find("svg").parent().html())};
                  patientDashBoardService.convertSVGToImg(data).then(function(response){
                    //Success Block
                    console.log("response > ", response.data['Encoded String']);
                    var img = response.data['Encoded String'];
                     pdf.addImage(img, 'png', 40, (250),margins.width+100, 170);
                  pdf.save('hillrom.pdf');
                  }).catch(function(response){
                    //Error Block
                    console.log("erro > ", response);
                  });
                  *
               
                 pdf.addImage(img, 'png', 40, (250),margins.width+100, 170);
                  pdf.save('hillrom.pdf');
               /* img.crossOrigin = "Anonymous";
                pdf.addImage(img, 'png', 40, (250),margins.width+100, 170);
                
                pdf.text(40,(250+170), "Frequency / Pressure: ");
                var img = $("#cPressure")[0].toDataURL('image/png', 1.0);
                //img.crossOrigin = "Anonymous";
                pdf.addImage(img, 'png', 40, (250+170),margins.width+100, 170);


                pdf.text(40,(250+(170*2)), "Hour Meter: ");
                var img = new Image();
                //img.crossOrigin = 'Anonymous';
                img.src = document.getElementById('cHMR').toDataURL("image/png");//$("#cHMR")[0].toDataURL('image/png', 1.0);
                //var img = $("#cHMR")[0].toDataURL('image/png`', 1.0);
                
                pdf.addImage(img, 'png', 40, (250+(170*2)),margins.width+100, 170);

          */
                
      
    

    }

    $scope.graphStateChange = function (p, f, d){
      $scope.compliance.pressure=p;
      $scope.compliance.frequency=f;
      $scope.compliance.duration=d;
      $("#pressure").attr("checked", p);
      $("#frequency").attr("checked", f);
      $("#duration").attr("checked", d);
      //$scope.handlelegends();
      $scope.reCreateComplianceGraph();
    }

    $scope.downloadAsPdf = function(){
      
      
      $scope.downloadPDFFile();

      

      //alert("set");
      /*g_pdfd.isPdfCall = true;
      //alert(g_isPdfCall + " : " + $scope.hmrGraph + " : " + $scope.complianceGraph);
       ac
      
      */
    //isDay:false,isWeek:false,isMonth:false,isYear:false
      /*  $.each(g_pdfd, function(k,v){
          alert(k + " : " +  v);
        });
      */
/*
      if( g_pdfd.isHMR){
        alert("go to compliance");
      } else if(g_pdfd.isCompliance){
        alert("go to HRM")
        if(g_pdfd.isDChkd && ()){

        }
      }

  if(g_pdfd.isCompliance){
    setTimeout(function () {$scope.showHmrGraph()},2000);
    } else {
    setTimeout(function () {$scope.showComplianceGraph()},2000);
  }
  */
  //alert("download");
  //$scope.downloadPDFFile();

      //setTimeout(function () {angular.element('li a[translate="graph.compliance"]').trigger("click");},100);
      
      /*setTimeout(function () {angular.element('#pressure').trigger("click");},3000);
      setTimeout(function () {angular.element('#frequency').trigger("click");},6000);
      setTimeout(function () {angular.element('#duration').trigger("click");},9000);
      setTimeout(function () {angular.element('#pressure').trigger("click");},12000);
       setTimeout(function () {$scope.downloadPDFFile();},15000);
        */

    //$scope.downloadPDFFile();
      /*var graphData = ($scope.hmrGraph) ? $scope.completeGraphData : $scope.completeComplianceData;
      graphService.getPdfForSVGGraph(graphData);   */
      //if($scope.selectedGraph === "hmr" && $scope.selectedDateOption !== "DAY")
        //$scope.downloadPDFFile();

        //alert(g_state.duration + " : " + g_state.pf + " : " + g_state.hmr);
       /* $.when( $("li a[translate='graph.hmr-data']").trigger("click") ).done(function( x ) {
          g_state.duration = "Im at HMR";
        });
*/
      //$scope.element('li a[translate='graph.compliance']').trigger('click');
        //$("li a[translate='graph.compliance']").trigger("click");
        //$.when( $("li a[translate='graph.compliance']").trigger("click") ).done(function( x ) {
          //$.when( $("#pressure").trigger("click") ).done(function( x ) {
              //g_state.duration="Im at Duration";
              //alert(g_state.duration + " : " + g_state.pf + " : " + g_state.hmr);
          //});
        //});

     

       // alert(g_state.duration + " : " + g_state.pf + " : " + g_state.hmr);
 
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

    $scope.$watch("textNote.edit_date", function(){
      angular.element(document.querySelector('.datepicker')).hide();
    })

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

}]);


