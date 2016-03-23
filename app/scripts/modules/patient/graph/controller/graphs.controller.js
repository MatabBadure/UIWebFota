'use strict';

angular.module('hillromvestApp')
.controller('graphController',
  ['$scope', '$state', 'patientDashBoardService', 'StorageService', 'dateService', 'graphUtil', 'patientService', 'UserService', '$stateParams', 'notyService', '$timeout', 'graphService', 'caregiverDashBoardService', 'loginConstants', '$location','$filter', 'commonsUserService', 'clinicadminPatientService', '$rootScope', 'patientGraphsConstants', 'exportutilService',
  function($scope, $state, patientDashBoardService, StorageService, dateService, graphUtil, patientService, UserService, $stateParams, notyService, $timeout, graphService, caregiverDashBoardService, loginConstants, $location, $filter, commonsUserService, clinicadminPatientService, $rootScope, patientGraphsConstants, exportutilService) {
  
    $scope.isGraphLoaded = false;    
    
    $scope.isIE = function(){        
      if(window.navigator.userAgent.indexOf("MSIE") !== -1){
        return true
      }else{
        return false;
      }
    };
    var isIEBrowser = $scope.isIE();
    $scope.init = function() {                                                
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
      $scope.showNotes = false;      
      $scope.toTimeStamp = new Date().getTime();      
      $scope.hmrRunRate = $scope.adherenceScore = $scope.missedtherapyDays = $scope.notePageCount = $scope.totalNotes = 0;
      $scope.edit_date = dateService.convertDateToYyyyMmDdFormat(new Date());
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(6);
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.curNotePageIndex = 1;
      $scope.perPageCount = 4;
      $scope.patientTab = currentRoute;
      if ($state.current.name === 'patientdashboard') {
        $rootScope.surveyTaken = false;
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
        if(currentRoute === 'clinicadminpatientOverview'){
          $scope.getMRNByPatientIdAndClinicId($stateParams.patientId, $stateParams.clinicId);
        }else{
          $scope.getPatientById($scope.patientId);
        }
        $scope.initGraph();        
      }                    
      $scope.hmrRunRate = 0;
      $scope.adherenceScore = 0;
      $scope.missedtherapyDays = 0;
      $scope.settingsDeviatedDaysCount = 0;            
      $scope.curNotePageIndex = 1;
      $scope.perPageCount = 4;
      $scope.notePageCount = 0;
      $scope.totalNotes = 0;
      $scope.isHMR = true; 
      $scope.noDataAvailable = false;          
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
          $scope.initCaregiverDashboard();          
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
          $scope.initCaregiverDashboard();
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
    };
    
    $scope.opts = {
      maxDate: new Date(),
      format: patientDashboard.dateFormat,
      dateLimit: {"months":12},
      eventHandlers: {'apply.daterangepicker': function(ev, picker) {
          $scope.durationRange = "Custom";     
          $scope.calculateDateFromPicker(picker);  
          var dayDiff = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);          
          if( dayDiff === 0){
            $scope.durationRange = "Day";
          }
          $scope.selectChart($scope.fromDate);        
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
    
    $scope.calculateTimeDuration = function(durationInDays) {
      $scope.toTimeStamp = new Date().getTime();
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
    };

    /*this should initiate the list of caregivers associated to the patient*/
    $scope.initPatientCaregiver = function(){
      $scope.getCaregiversForPatient(StorageService.get('logged').patientID);
    };
    
    $scope.getMRNByPatientIdAndClinicId = function(patientId, clinicId){
      clinicadminPatientService.getPatientInfo(patientId, clinicId).then(function(response){
        $scope.slectedPatient = response.data.patientUser;
        $scope.slectedPatient.mrnId = response.data.patientUser.clinicMRNId.mrnId;
      }).catch(function(response){
        notyService.showError(response);
        if(response.status === 404){
          $scope.redirectToPatientDashboard();
        }
      });
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
          $scope.associateCareGiver.zipcode = commonsUserService.formatZipcode($scope.associateCareGiver.zipcode);
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

    function getDaysIntervalInChart(noOfDataPoints){
      var pInterval = 12;
      var sInterval = 13;
      var remainder  = 6;
      return ( (parseInt(noOfDataPoints/pInterval) > 0) && noOfDataPoints%pInterval > remainder) ? parseInt(noOfDataPoints/sInterval) : ((parseInt(noOfDataPoints/pInterval) > 0)? parseInt(noOfDataPoints/pInterval): 1) ; 
    };

    $scope.getComplianceGraph = function(){      
      patientDashBoardService.getcomplianceGraphData($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.durationRange).then(function(response){
        var responseData = response.data;              
        var xData = [];
        $scope.chartData = {};
        $scope.chartData.datasets = [];
        if(responseData){ 
          $scope.noDataAvailable = false;        
          xData = responseData.xAxis.categories; 
          responseData.xAxis.xLabels = []; 

          angular.forEach(responseData.xAxis.categories, function(x, key){              
            // this is for year view or custom view having datapoints more than 7
            // x-axis will be plotted accordingly, chart type will be datetime
            var dateTextLabel = Highcharts.dateFormat("%m/%e/%Y",dateService.convertToTimestamp(x));
            dateTextLabel += (Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)))? ' ( ' + Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)) + ' )' : '';
            
            responseData.xAxis.xLabels.push(dateTextLabel);            
              xData[key] = dateService.convertToTimestamp(x);                          
            });       

          angular.forEach(responseData.series, function(s, key1){
            var marker = {};
            marker.radius = (s.data && s.data.length < 50)? 2 : 0.5;    
            angular.forEach(s.data, function(d, key2){
              var tooltipDateText = responseData.series[key1].data[key2].x ;
              responseData.series[key1].data[key2].x = xData[key2];
              responseData.series[key1].data[key2].marker = marker;
              responseData.series[key1].data[key2].toolText.dateText = responseData.xAxis.xLabels[key2] ;
              if(responseData.series[key1].data[key2].toolText.missedTherapy){
                responseData.series[key1].data[key2].color = "red";
              }
            });
            if(responseData.series[key1].name === "Pressure"){
              responseData.series[key1].color = patientGraphsConstants.colors.pressure;
            }else if(responseData.series[key1].name === "Frequency"){
              responseData.series[key1].color = patientGraphsConstants.colors.frequency;
            }else if(responseData.series[key1].name === "Duration"){
              responseData.series[key1].color = patientGraphsConstants.colors.duration;
            }
            $scope.chartData.datasets.push(responseData.series[key1]);
          });
          $scope.chartData.xData = xData;
          setTimeout(function(){            
              $scope.synchronizedChart();           
          }, 100);          
        } else{
          $scope.noDataAvailable = true;
          $scope.removeAllCharts();
        }       
      });
    };

    $scope.setSynchronizedChart = function(divId){
       Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });        
         /**
         * In order to synchronize tooltips and crosshairs, override the
         * built-in events with handlers defined on the parent element.
         */
         
        $("#"+divId).bind('mousemove touchmove touchstart mouseover', function(e) {
          var chart,
          point,
          i,
          event;
          var charts = Highcharts.charts;               
          for (i = 0; i < Highcharts.charts.length; i = i + 1) {
            chart = Highcharts.charts[i];            
            if(chart && chart.renderTo.offsetParent && chart.renderTo.offsetParent.id === "synchronizedChart"){              
              event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
              point = chart.series[0].searchPoint(event, true); // Get the hovered point

              if (point) {
                chart.xAxis[0].crosshair = true;
                point.onMouseOver(); // Show the hover marker
                chart.tooltip.refresh(point); // Show the tooltip
                chart.xAxis[0].drawCrosshair(event, point); // Show the crosshair
              }
            }
          }
          if( $('.highcharts-button').length > 0 ){
            $('.highcharts-button').show();
          }
        });

        //$("#"+divId).bind('mouseleave', function(e) { 
        //  $(".button").unbind('click').click(
        $("#"+divId).unbind('mouseleave').mouseleave(function(e) {                    
          e.stopPropagation();         
          var chart,
          point,
          i,
          event;

          var charts = Highcharts.charts;   
          for (i = 0; i < Highcharts.charts.length; i = i + 1) {
            chart = Highcharts.charts[i];
            if(chart &&  chart.renderTo.offsetParent && chart.renderTo.offsetParent.id === "synchronizedChart"){               
              event = chart.pointer.normalize(e.originalEvent);
              point = chart.series[0].searchPoint(event, true);

              point.onMouseOut(); 
              chart.tooltip.hide(point);
              chart.xAxis[0].hideCrosshair(); 
              if( $('.highcharts-button').length > 0 ){
                $('.highcharts-button').hide();
              }
            }
          } 
        });
               
    };

    $scope.synchronizedChart = function(divId){
       
        // Get the data. The contents of the data file can be viewed at
        divId = (divId) ? divId : "synchronizedChart";
        $("#"+divId).empty();
        $scope.setSynchronizedChart(divId);
        function syncExtremes(e) {
              var thisChart = this.chart;

        if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
            Highcharts.each(Highcharts.charts, function(chart) {
              if(chart && chart.renderTo.offsetParent && chart.renderTo.offsetParent.id === "synchronizedChart"){ 
                if (chart !== thisChart) {
                  if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
                      trigger: 'syncExtremes'
                    });
                  }
                }
              }
            });
          }
        }
        
        $.each($scope.chartData.datasets, function(i, dataset) {         
          var  minRange = (dataset.plotLines.max) ? dataset.plotLines.max : dataset.plotLines.min;
          var yMaxPlotLine = dataset.plotLines.max;
          var yMinPlotLine = dataset.plotLines.min;
          var noOfDataPoints = ($scope.chartData.xData)? $scope.chartData.xData.length: 0;
          var daysInterval = getDaysIntervalInChart(noOfDataPoints);
          
          $('<div class="chart">')
            .appendTo('#'+divId)
            .highcharts({
              chart: {
                marginLeft: 40, 
                //spacingTop: 30,
                spacingBottom: 30,                
                backgroundColor:  "#e6f1f4"
              },
              title: {
                text: dataset.name,
                align: 'left',
                margin: 25,
                x: 30,
                style:{
                  color: dataset.color,
                  fontWeight: 'bold'
                }                
              },
              credits: {
                enabled: false
              },
              legend: {
                enabled: false
              },
              xAxis: {
                type: 'datetime',
                crosshair: true,
                minPadding: 0,
                maxPadding: 0,
                startOnTick: false,
                endOnTick: false,                
                events: {
                  setExtremes: syncExtremes
                },
                labels: {
                  style: {
                    color: '#525151',
                    fontWeight: 'bold'
                  },
                  formatter: function() {
                    return Highcharts.dateFormat("%m/%e/%Y", this.value);
                  }
                },
                lineWidth: 2,
                units: [
                  ['day', [daysInterval]]
                ] 
              },
              yAxis: {
                gridLineColor: '#FF0000',
                gridLineWidth: 0,
                lineWidth:2,
                minRange: minRange,
                min: 0,
                allowDecimals:false,
                title: {
                  text: null
                },
                plotLines: [{
                    value: yMinPlotLine,
                    color: '#99cf99',
                    dashStyle: 'Dash',
                    width: 1,                    
                    label: {
                        align: "right",
                        text: 'Min Threshold',
                        y: -5,
                        x: -10,
                        style: {
                            color: '#c1c1c1',
                            font: '10px Helvetica',
                            fontWeight: 'normal'
                        }/*,
                        textAlign: "left"*/
                    }
                }, {
                    value: yMaxPlotLine,
                    color: '#f19999',
                    dashStyle: 'Dash',
                    width: 1,                    
                    label: {
                      align: "right",
                      text: 'Max Threshold',
                      y: -5,
                      x: -10,
                      style: {
                          color: '#c1c1c1',
                          font: '10px Helvetica',
                          fontWeight: 'normal'
                      }/*,
                        textAlign: "left"*/
                    }
                }],
              },
              plotOptions: {  
                line: {
                    lineWidth: 3,
                    softThreshold: false,
                    marker: {
                          enabled: true
                    },
                    states: {
                        hover: {
                            enabled: false
                        }                    
                    } //putting down x-axis, when we have zero for all y-axis values
                }
              },
              tooltip: { 
                enabled: true, 
                positioner: function () {
                    return {
                        x: this.chart.chartWidth - this.label.width, // right aligned
                        y: -1 // align to title
                    };
                },            
                // formatter: function() {
                //   var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  this.point.toolText.dateText +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';                         
                //   s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> ' + this.point.series.name + '</div> ' 
                //   + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div></div>';
                //   s += '</div>';
                //   return s;
                // },
                borderWidth: 0, 
                backgroundColor: 'none',
                pointFormat: '<span style="color:{point.series.color}"> {series.name}: {point.y}</span>',//'{point.series.name}' + ' : ' +'{point.y}',
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '18px'
                },
                hideDelay: 0//,
                //useHTML: true                
              },
              series: [{
                data: dataset.data,
                name: dataset.name,
                type: dataset.type,
                color: dataset.color,
                fillOpacity: 0.3
              }]
            });
        });
    };

    
    $scope.getHMRGraph = function(){
      patientDashBoardService.getHMRGraphPoints($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.durationRange).then(function(response){
        $scope.hmrChartData = response.data;        
        $scope.noDataAvailable = false;       
        if($scope.hmrChartData && typeof($scope.hmrChartData) === "object"){ 
          $scope.noDataAvailable = false;      
          $scope.hmrChartData.xAxis.xLabels=[]; 
          $scope.isSameDay = true;
          var startDay = ($scope.hmrChartData.xAxis && $scope.hmrChartData.xAxis.categories.length > 0) ? $scope.hmrChartData.xAxis.categories[0].split(" "): null;  
            angular.forEach($scope.hmrChartData.xAxis.categories, function(x, key){ 
              var curDay = $scope.hmrChartData.xAxis.categories[key].split(" ");
              $scope.isSameDay = ($scope.isSameDay && (curDay[0] === startDay[0]) )? true : false;  
            });       
            angular.forEach($scope.hmrChartData.xAxis.categories, function(x, key){              
              // this is for year view or custom view having datapoints more than 7
              // x-axis will be plotted accordingly, chart type will be datetime
              if($scope.durationRange !== "Day" && !$scope.isSameDay){
                $scope.hmrChartData.xAxis.xLabels.push(dateService.convertToTimestamp(x));
                $scope.hmrChartData.xAxis.categories[key] = dateService.convertToTimestamp(x);               
              }else{
                $scope.hmrChartData.xAxis.xLabels.push(x);
                $scope.hmrChartData.xAxis.categories[key] = Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)) ;
              }
            });         
          angular.forEach($scope.hmrChartData.series, function(s, key1){
            var marker = {};
            marker.radius = (s.data && s.data.length < 50)? 2 : 0.5; 
            angular.forEach(s.data, function(d, key2){
              var tooltipDateText = $scope.hmrChartData.series[key1].data[key2].x ;
              $scope.hmrChartData.series[key1].data[key2].marker = marker;
              $scope.hmrChartData.series[key1].data[key2].x = $scope.hmrChartData.xAxis.categories[key2];
              $scope.hmrChartData.series[key1].data[key2].toolText.dateText = $scope.hmrChartData.xAxis.xLabels[key2];
              if($scope.hmrChartData.series[key1].data[key2].toolText.missedTherapy){
                $scope.hmrChartData.series[key1].data[key2].color = "red";
              }
            });            
            
          }); 
          setTimeout(function(){
            if($scope.durationRange === "Day" || $scope.isSameDay){          
              $scope.HMRCategoryChart();
            }else{
              $scope.HMRAreaChart();
            }            
          }, 100);          
        } else{
          $scope.noDataAvailable = true;
          $scope.removeAllCharts();
        }
      });
    };

    $scope.HMRAreaChart = function(divId){ 
      var noOfDataPoints = ($scope.hmrChartData && $scope.hmrChartData.xAxis.categories)?$scope.hmrChartData.xAxis.categories.length: 0;      
      var daysInterval = getDaysIntervalInChart(noOfDataPoints);      
      Highcharts.setOptions({
          global: {
              useUTC: false
          }
      });      
      divId = (divId)? divId : "HMRGraph";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          chart: {
              type: 'area',
              zoomType: 'xy',
              backgroundColor:  "#e6f1f4"
          },
          title: {
              text: ''
          },
          xAxis: {
              allowDecimals: false,
              type: 'datetime',         
              title: {
                    text: ''
                },
              minPadding: 0,
              maxPadding: 0,
              startOnTick: false,
              endOnTick: false,
              labels:{
                style: {
                  color: '#525151',                  
                  fontWeight: 'bold'
                },
                formatter:function(){
                  return  Highcharts.dateFormat("%m/%e/%Y",this.value);
                }               
              }, 
              lineWidth: 2,
              units: [
                ['day', [daysInterval]]
              ] 
          },
          yAxis: {
              gridLineColor: '#FF0000',
                gridLineWidth: 0,
                lineWidth:2,
                "minRange": 1,
                "min": 0,               
                title: {
                    text: $scope.hmrChartData.series[0].name,
                    style:{
                      color: '#525151',
                      font: '10px Helvetica',
                      fontWeight: 'bold'
                  }     
                },
                 allowDecimals:false,
                 labels:{
                  style: {
                      color: '#525151',                      
                      fontWeight: 'bold'
                  }               
                }
          },
          tooltip: { 
              backgroundColor: "rgba(255,255,255,1)", 
              useHTML: true , 
              hideDelay: 0,  
              enabled: true,        
              formatter: function() {
                  var s = '';
                  var headerStr = '';
                  var footerStr = '';
                  var noteStr = '';                  
                  var dateTextLabel = Highcharts.dateFormat("%m/%e/%Y",this.point.toolText.dateText);
                  if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");
                    if(parseInt(splitSession[1]) > 0){
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",this.x) + ' )';
                    }
                  }
                  var pointDetails = '<div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> Session No </div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.sessionNo  + '</b></div>';                 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> ' + this.point.series.name + '</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Pressure</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.pressure + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Frequency</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.frequency + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Duration</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.duration + '</b></div>'; 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Cough Pauses</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.coughPauses + '</b></div>';
                  if(this.point.toolText.noteText){
                    s = '<div style="font-size:10px; font-weight: bold; width:100%;display-inline:block;">' 
                    s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px; padding-right: 50px; float: left; width: 58%">'+  dateTextLabel +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                    s += '<div style="font-size:12x;font-weight: bold;padding-left: 4px; padding-bottom: 3px;float: right;width: 40%;padding-right:10px;">Note </div>'
                    s += '</div><div style="font-size:10px; font-weight: bold; width:100%;height: auto;display: flex;flex-flow: row column;">';
                    headerStr = '<div style="font-size:10px; font-weight: bold; width:55%; float: left; border-right: 1px solid #cccccc;">';                                     
                    footerStr = '</div>';
                    noteStr = '<div style="font-size:10px; font-weight: bold; width:45%; float: left;white-space:pre-wrap;white-space:-moz-pre-wrap;word-wrap: break-word;"><div style="padding:5px 5px;"> <span>'+ this.point.toolText.noteText+' </span></div></div>';
                    s += headerStr+pointDetails+footerStr+noteStr+'</div>';
                  }else{
                     s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  dateTextLabel +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div style="font-size:10px; font-weight: bold; width:100%">';
                     headerStr = '<div style="font-size:10px; font-weight: bold; width:100%">';
                     footerStr = '</div>';
                     noteStr = '';
                     s += headerStr+pointDetails+footerStr+noteStr+'</div>';
                  }
                   
                  return s;
                }
               
                
          },
          plotOptions: {
            series: {
                //allowPointSelect: true,
                marker: {
                      enabled: true
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            if(this.toolText && !this.toolText.missedTherapy){
                              $scope.getDayChart(this.x);
                            }                            
                        }
                    }
                  }
            }
          },         
          legend:{
            enabled: false
          },          
          series: $scope.hmrChartData.series
      });
    };

    $scope.HMRCategoryChart = function(divId){
      var chartType = "column";
      Highcharts.setOptions({
          global: {
              useUTC: false
          }
      });      
      divId = (divId)? divId : "HMRGraph";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          chart: {
              type: chartType,
              zoomType: 'xy',
              backgroundColor:  "#e6f1f4"
          },
          title: {
              text: ''
          },
          xAxis: {
              allowDecimals: false,
              type: 'category',         
              categories: $scope.hmrChartData.xAxis.categories,
              labels:{
                style: {
                    color: '#525151',                    
                    fontWeight: 'bold'
                }               
              }, 
              formatter:function(){
                return  Highcharts.dateFormat("%m/%e/%Y",this.value);
              },
              lineWidth: 2                
          },
          yAxis: {
              gridLineColor: '#FF0000',
                gridLineWidth: 0,
                lineWidth:2,
                "minRange": 1,
                "min": 0,               
                title: {
                    text: $scope.hmrChartData.series[0].name,
                    style:{
                      color: '#525151',
                      font: '10px Helvetica',
                      fontWeight: 'bold'
                  }     
                },
                 allowDecimals:false,
                 labels:{
                  style: {
                      color: '#525151',                      
                      fontWeight: 'bold'
                  }               
                }
          },
          tooltip: { 
              backgroundColor: "rgba(255,255,255,1)",            
              formatter: function() {
                  var dateX = dateService.convertToTimestamp(this.point.toolText.dateText);
                  var dateTextLabel = Highcharts.dateFormat("%m/%e/%Y",dateX);                  
                  if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");                    
                    if(parseInt(splitSession[1]) > 0){                      
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",dateX) + ' )';                      
                    }
                  }                 
                  var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  dateTextLabel +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> Session No </div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.sessionNo  + '</b></div></div>';                 
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> ' + this.point.series.name + '</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Pressure</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.pressure + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Frequency</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.frequency + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Duration</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.duration + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Cough Pauses</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.coughPauses + '</b></div></div>';
                  s += '</div>';
                  return s;
                }, 
                hideDelay: 0,
                useHTML: true 
          },
          plotOptions: {
            series: {
                pointWidth: 50,
                marker: {
                      enabled: true
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            if($scope.durationRange !== "Day" && this.toolText && !this.toolText.missedTherapy){                              
                              $scope.getDayChart(this.category);
                            } 
                        }
                    }
                  }
            }
          },         
          legend:{
            enabled: false
          },          
          series: $scope.hmrChartData.series
      });
    };
     
    $scope.drawHMRCChart =function(){ 
        $scope.removeAllCharts();    
        $scope.getHMRGraph();
        $scope.getComplianceGraph();
    };

    $scope.getYearChart = function(){
      $scope.durationRange = "Year";
      $scope.calculateTimeDuration(365);
      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.drawHMRCChart();
    };

    $scope.getMonthChart = function(){
      $scope.durationRange = "Month";
      $scope.calculateTimeDuration(30);
      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.drawHMRCChart();
    };

    $scope.getWeekChart = function(){
      $scope.durationRange = "Week";
      $scope.calculateTimeDuration(6);
      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.drawHMRCChart();
    };

    $scope.getCustomDateRangeChart = function(){  
      $scope.durationRange = "Custom";    
      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.drawHMRCChart();
    };

    $scope.getDayChart = function(isOtherDayTimestamp){
      $scope.durationRange = "Day";
      if(isOtherDayTimestamp){
        $scope.fromTimeStamp = $scope.toTimeStamp = isOtherDayTimestamp;
      }else{
        $scope.fromTimeStamp = $scope.toTimeStamp = new Date().getTime();        
      }
      
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.drawHMRCChart();
    };

    $scope.initGraph = function(){
      $scope.getHmrRunRateAndScore();      
      $scope.isHMR = true;
      //$scope.getWeekChart();
    };

    $scope.initPatientDashboard = function(){
      $scope.getTransmissionDateForPatient(StorageService.get('logged').patientID);
      $scope.getAssociatedClinics(StorageService.get('logged').patientID);
      $scope.getPatientDevices(StorageService.get('logged').patientID);
      $scope.editNote = false;
      $scope.textNote = "";
      $scope.initGraph();
      $scope.getPatientById($scope.patientId);
      $scope.getPatientNotification();      
      if(!$rootScope.surveyTaken && $rootScope.surveyId){
        $scope.surveyConfirmModal = true;                
      }
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
      
    $scope.downloadAsPdf = function(){      
      $scope.patientInfo = {};
      $scope.patientInfo.patient = $scope.slectedPatient;
      $scope.patientInfo.clinics = $scope.associatedClinics;
      $scope.patientInfo.patientDevices = $scope.patientDevices;
      $scope.patientInfo.missedtherapyDays = $scope.missedtherapyDays;
      $scope.patientInfo.adherenceScore = $scope.adherenceScore;
      $scope.patientInfo.settingsDeviatedDaysCount = $scope.settingsDeviatedDaysCount;
      $scope.patientInfo.hmrRunRate = $scope.hmrRunRate;      
      exportutilService.exportHMRCGraphAsPDF("synchronizedChart", "HMRCCanvas", $scope.fromDate, $scope.toDate, $scope.patientInfo);
    };

    $scope.cloaseXLSModal = function(){
      $("#no-xls-modal").css("display", "none");
    }

    $scope.cloasePDFModal = function(){
      $("#graph-loading-modal").css("display", "none");
    }

    $scope.downloadRawDataAsCsv = function(){      
      patientService.getDeviceDataAsCSV($scope.patientId, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-')).then(function(response){
        if(response && response.status === 204){
          //showpopup
          $("#no-xls-modal").css("display", "block");
        }else{
          saveAs(new Blob([response.data],{type:"application/vnd.ms-excel"}), "TherapyData.xls");          
        }
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
    
    $scope.takeSurveyNow = function(){          
        $state.go("patientSurvey", {'surveyId': $rootScope.surveyId});
    };

    $scope.selectChart = function(fromDate){
      switch($scope.durationRange) {
          case "Day":
              $scope.getDayChart(fromDate);
              break;
          case "Week":
              $scope.getWeekChart();
              break;
          case "Month":
              $scope.getMonthChart();
              break;
          case "Year":
              $scope.getYearChart();
              break;
          case "Custom":
              $scope.getCustomDateRangeChart();
              break;
          default:
              $scope.getWeekChart();
      }

    };

    $scope.getHMR = function(){
      $scope.isHMR = true;
      $scope.selectChart($scope.fromDate);
    };

    $scope.getCompliance = function(){
      $scope.isHMR = false;
      $scope.selectChart($scope.fromDate);
    };

    $scope.initCaregiverDashboard = function(){
      $scope.getTransmissionDateForPatient($scope.patientId);
      $scope.getAssociatedClinics($scope.patientId);
      $scope.getPatientDevices($scope.patientId);      
      $scope.initGraph();
      $scope.getPatientById($scope.patientId);     
    };

    $scope.initHMR = function(){
      $scope.isHMR = true;
      $scope.noDataAvailable = false;    
    };

    $scope.removeAllCharts = function(){
      $("#HMRGraph").empty();
      $("#synchronizedChart").empty();      
    };
    
}]);

