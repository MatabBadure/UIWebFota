'use strict';

angular.module('hillromvestApp')
.controller('graphController',
  ['$scope', '$state', 'patientDashBoardService', 'StorageService', 'dateService', 'graphUtil', 'patientService', 'UserService', '$stateParams', 'notyService', '$timeout', 'graphService', 'caregiverDashBoardService', 'loginConstants', '$location','$filter', 'commonsUserService', 'clinicadminPatientService', '$rootScope', 'patientGraphsConstants', 'exportutilService',
  function($scope, $state, patientDashBoardService, StorageService, dateService, graphUtil, patientService, UserService, $stateParams, notyService, $timeout, graphService, caregiverDashBoardService, loginConstants, $location, $filter, commonsUserService, clinicadminPatientService, $rootScope, patientGraphsConstants, exportutilService) { 
      $scope.loading = false;
    $scope.isGraphLoaded = false;    
    $scope.expandedSign = "+";
    $scope.DisableAddProtocol = false; 
    $scope.displayFlag = true;
          $scope.customPointsChecker = 0;
          $scope.lastdeviceType = "";      
    $scope.isIE = function(){        
      if(window.navigator.userAgent.indexOf("MSIE") !== -1){
        return true
      }else{
        return false;
      }
    };
    var isIEBrowser = $scope.isIE();
    $scope.init = function() {
      $scope.currentPageIndex = 1;
      $scope.pageCount = 0;
      $scope.nextDate= new Date();
      $scope.disableDatesInDatePicker();  
       $scope.role = StorageService.get('logged').role; 
      $scope.hmrRunRate = 0;
      $scope.adherenceScore = 0;
      $scope.missedtherapyDays = 0;
      $scope.settingsDeviatedDaysCount = 0;            
      $scope.curNotePageIndex = 1;
      $scope.perPageCount = 4;
      $scope.notePageCount = 0;
      $scope.totalNotes = 0;
      $scope.isHMR = false; 
      $scope.noDataAvailable = false;
      $scope.noDataAvailable1 = false;   
      $scope.noHistoryAvailable = false;     
      $scope.noDataAvailableForHMR = false; 
      $scope.noDataAvailableForHMR1 = false; 
      $scope.noDataAvailableForAdherence = false;  
      $scope.noDataStatus = true;
      $scope.forhidingVestHmrGraph = true;
      $scope.forhidingVestProtocolGraph = true
      $scope.forhidingMonarchProtocolGraph = false;
      $scope.forhidingMonarchHmrGraph = false;

      $scope.initCount("");
            var currentRoute = $state.current.name;

            if($scope.getDeviceTypeforBothIcon() === searchFilters.allCaps){
                $scope.deviceTypeforGraphSelected = searchFilters.VisiVest;
                $scope.deviceTypeforGraphProtocol = searchFilters.VisiVest;
            }
            else{
              $scope.deviceTypeforGraphSelected = $scope.getDeviceType();
               $scope.deviceTypeforGraphProtocol = $scope.getDeviceType();
            }
/*      if( $scope.role === loginConstants.role.caregiver){
        $scope.getPatientListForCaregiver($scope.caregiverID);
      }*/
      if(StorageService.get('logged').role === loginConstants.role.admin || StorageService.get('logged').role === loginConstants.role.acctservices || StorageService.get('logged').role === loginConstants.role.associates || StorageService.get('logged').role === loginConstants.role.customerservices){
     $scope.isHillRomUser = true;   
      }
      else{
        $scope.isHillRomUser = false;    
      }
       var server_error_msg = "Some internal error occurred. Please try after sometime.";
      $scope.showNotes = false;      
      $scope.toTimeStamp = new Date().getTime(); 
      $scope.toTimeStampHistory = new Date().getTime();     
      $scope.hmrRunRate = $scope.adherenceScore = $scope.missedtherapyDays = $scope.notePageCount = $scope.totalNotes = 0;
      $scope.edit_date = dateService.convertDateToYyyyMmDdFormat(new Date());
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(6);
      $scope.fromTimeStampHistory = dateService.getnDaysBackTimeStamp(6);
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.fromDateHistory = dateService.getDateFromTimeStamp($scope.fromTimeStampHistory,patientDashboard.dateFormat,'/');
      $scope.toDateHistory = dateService.getDateFromTimeStamp($scope.toTimeStampHistory,patientDashboard.dateFormat,'/');
      $scope.curNotePageIndex = 1;
      $scope.perPageCount = 4;
      $scope.patientTab = currentRoute;
      $scope.caregiverID = parseInt(StorageService.get('logged').userId);
 
          if($scope.role === 'PATIENT'){
          $scope.patientId = parseInt(StorageService.get('logged').patientID);
      }
      else if($scope.role === 'CARE_GIVER'){
            $scope.getPatientListForCaregiver($scope.caregiverID);
      }

      if ($state.current.name === 'patientdashboard') {
  
        $rootScope.surveyTaken = false;
        $scope.hasTransmissionDate = false;
        $scope.initPatientDashboard();        
      }else if(currentRoute === 'patientdashboardCaregiver'){
    
        $scope.initPatientCaregiver();
      }
     else if(currentRoute === 'patientdashboardCaregiverAdd'){
        $scope.initpatientCraegiverAdd();
      }else if(currentRoute === 'patientdashboardCaregiverEdit'){
        $scope.initpatientCaregiverEdit();
      }else if(currentRoute === 'patientdashboardDeviceProtocol'){
        $scope.initPatientDeviceProtocol();
      }else if(currentRoute === 'patientdashboardClinicHCP'){
        $scope.initPatientClinicHCPs();
      }  else if(currentRoute === 'patientOverview' || currentRoute === 'hcppatientOverview' || currentRoute === 'clinicadminpatientOverview' || currentRoute === 'patientOverviewRcadmin' || currentRoute === 'associatepatientOverview' || currentRoute === 'customerservicepatientOverview') {
        $scope.getAssociatedClinics($stateParams.patientId);
        $scope.getPatientDevices($stateParams.patientId);
        $scope.patientId = parseInt($stateParams.patientId);
        if(currentRoute === 'clinicadminpatientOverview'){
          $scope.getMRNByPatientIdAndClinicId($stateParams.patientId, $stateParams.clinicId,StorageService.get('logged').userId);
        }else{
          $scope.getPatientById($scope.patientId);
        }
        $scope.initGraph();        
      }

       $scope.deviceTypeforGraph = localStorage.getItem('deviceType');
       $scope.deviceTypeforGraphProtocol = localStorage.getItem('deviceType');
       $scope.deviceTypeforGraphTrend = localStorage.getItem('deviceTypeforBothIcon'); 
       
        if($scope.deviceTypeforGraph == "ALL")
       {
          $scope.deviceTypeforGraph = "VEST";
       }
      
      if($scope.deviceTypeforGraphProtocol == "ALL")
       {
          $scope.deviceTypeforGraphProtocol = "VEST";
       }

                  

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
      var currentname = $state.current.name;
     
      caregiverDashBoardService.getPatients(caregiverID).then(function(response){

                $scope.patients = response.data.patients;
                if($stateParams.patientId){
                  for(var i=0;i<response.data.patients.length;i++){
                    if($stateParams.patientId == response.data.patients[i].userId){
                  $scope.selectedPatient = response.data.patients[i];
                 // localStorage.setItem('deviceType',response.data.patients[i].deviceType);
                 if(response.data.patients[i].deviceType == 'ALL'){
          localStorage.setItem('deviceType', 'VEST');
          localStorage.setItem('deviceTypeforGraph', 'ALL');
          localStorage.setItem('deviceTypeforBothIcon', 'ALL');


            }
            else{
            localStorage.setItem('deviceType', response.data.patients[i].deviceType);
            localStorage.setItem('deviceTypeforGraph', response.data.patients[i].deviceType);
            localStorage.setItem('deviceTypeforBothIcon', response.data.patients[i].deviceType);
          }
                  $scope.patientId = $stateParams.patientId;
                  var logged = StorageService.get('logged');                   
                 
            logged.patientID = $scope.patientId               
                
            StorageService.save('logged', logged);

                       $scope.$emit('getSelectedPatient', $scope.selectedPatient);
                           break;   
                }
           
                }

                } else{
                 $scope.selectedPatient = response.data.patients[0];
                  //localStorage.setItem('deviceType',response.data.patients[0].deviceType);
         if(response.data.patients[0].deviceType == 'ALL'){
          localStorage.setItem('deviceType', 'VEST');
          localStorage.setItem('deviceTypeforGraph', 'ALL');
            }
            else{
            localStorage.setItem('deviceType', response.data.patients[0].deviceType);
            localStorage.setItem('deviceTypeforGraph', response.data.patients[0].deviceType);
          }          
                  $scope.patientId = $scope.selectedPatient.userId;
                     $scope.$emit('getSelectedPatient', $scope.selectedPatient);
                     var logged = StorageService.get('logged');                    
            logged.patientID = $scope.patientId               
            StorageService.save('logged', logged);
                }  
           $scope.$emit('getPatients', $scope.patients);
                  if(currentname === 'caregiverDashboardClinicHCP'){
          $scope.initPatientClinicHCPsforCaregiver();
        } else if(currentname === 'caregiverDashboardDeviceProtocol'){
          $scope.initPatientDeviceProtocolforCaregiver();
        } else if(currentname === 'caregiverDashboard'){
          $scope.initCaregiverDashboard();          
        } else if(currentname === 'caregiverdashboardCaregiver'){
        $scope.initPatientCaregiver();
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

/*    $scope.$on('switchPatientCareGiver',function(event,patient){
      $scope.switchPatient(patient);
    });

    $scope.$on('switchCaregiverTab',function(event,state){
      $scope.switchCaregiverTab(state);
    });*/

    $scope.switchCaregiverTab = function(status){
      $scope.caregiverTab = status;
      if($stateParams.patientId){
      $state.go(status, {'patientId':$stateParams.patientId});
      }
      else{
       $state.go(status, {'patientId': $scope.selectedPatient.userId});
      }    
    };
    $scope.switchPatient = function(patient){
       if(patient.deviceType == 'ALL'){
          localStorage.setItem('deviceType', 'VEST');
          localStorage.setItem('deviceTypeforGraph', 'ALL');
          localStorage.setItem('deviceTypeforBothIcon', 'ALL');
       }
           else{
            localStorage.setItem('deviceType', patient.deviceType);
            localStorage.setItem('deviceTypeforGraph', patient.deviceType);
            localStorage.setItem('deviceTypeforBothIcon', patient.deviceType);
          }
        $scope.selectedPatient = patient;
        $scope.patientId = $scope.selectedPatient.userId;
         var currentname = $state.current.name;
        $state.go(currentname,{'patientId':$scope.patientId});
    };

    /*caregiver code ends*/
    $scope.calculateDateFromPicker = function(picker,flag) {
      if(flag == 'AdherenceScoreHistory')
      {
      $scope.fromTimeStampHistory = new Date(picker.startDate._d).getTime();
      $scope.toTimeStampHistory = new Date(picker.endDate._d).getTime();
      $scope.fromDateHistory = dateService.getDateFromTimeStamp($scope.fromTimeStampHistory,patientDashboard.dateFormat,'/');
      $scope.toDateHistory = dateService.getDateFromTimeStamp($scope.toTimeStampHistory,patientDashboard.dateFormat,'/');
      }
    else{
      $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();
      $scope.toTimeStamp = new Date(picker.endDate._d).getTime();
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      if ($scope.fromDate === $scope.toDate ) {
        $scope.fromTimeStamp = $scope.toTimeStamp;
      }
    }
    };

    $scope.disableDatesInDatePicker = function() {
      var datePickerCount = document.getElementsByClassName('input-mini').length;
      var count = 5;
      $scope.waitFunction = function waitHandler() {
         datePickerCount = document.getElementsByClassName('input-mini').length;
        if(datePickerCount > 0 || count === 0 ) {          
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
      dateLimit: {"months":24},
      eventHandlers: {'apply.daterangepicker': function(ev, picker) {
          $scope.durationRange = "Custom";     
          $scope.calculateDateFromPicker(picker,'NotAdherenceScoreHistory');  
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
      }
      else if($scope.role === loginConstants.role.customerservices){
        $state.go('customerservice' + status, {'patientId': $stateParams.patientId});
      }else {
        $state.go(status, {'patientId': $stateParams.patientId});
      }
    };
    
   $scope.calculateTimeDuration = function(durationInDays,flag) {
      if(flag == 'AdherenceScoreHistory'){
      $scope.toTimeStampHistory = new Date().getTime();
      $scope.toDateHistory = dateService.getDateFromTimeStamp($scope.toTimeStampHistory,patientDashboard.dateFormat,'/');
      $scope.fromTimeStampHistory = dateService.getnDaysBackTimeStamp(durationInDays);;
      $scope.fromDateHistory = dateService.getDateFromTimeStamp($scope.fromTimeStampHistory,patientDashboard.dateFormat,'/');
      }
      else{
      $scope.toTimeStamp = new Date().getTime();
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
         }
    };
    /*this should initiate the list of caregivers associated to the patient*/
    $scope.initPatientCaregiver = function(){
      if(StorageService.get('logged').role === 'PATIENT'){
      $scope.getCaregiversForPatient(StorageService.get('logged').patientID);
    }
    else{
      $scope.getCaregiversForPatient($scope.selectedPatient.userId);
    }
    };
    
    $scope.getMRNByPatientIdAndClinicId = function(patientId, clinicId,userID){
      clinicadminPatientService.getPatientInfo(patientId, clinicId,userID).then(function(response){
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
        case 'CUSTOMER_SERVICES':$state.go('customerservicePatientUser');
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
       $scope.protocols = []; $scope.protocols.length = 0;
      $scope.getProtocols(StorageService.get('logged').patientID || $scope.patientId);
    };
        $scope.initPatientDeviceProtocolforCaregiver = function(){
      $scope.devicesErrMsg = null;
      $scope.protocolsErrMsg = null;
      $scope.devices = []; $scope.devices.length = 0;
      patientService.getDevices($scope.selectedPatient.userId).then(function(response){
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
       $scope.protocols = []; $scope.protocols.length = 0;
      $scope.getProtocols($scope.selectedPatient.userId);
    };

    $scope.getProtocols = function(patientId){
      $scope.protocols = []; $scope.protocols.length = 0;
      $scope.protocolsErrMsg = null;
      $scope.devicesErrMsg = null;
       $scope.normalProtocol = new Array(new Array());
         $scope.normalProtocol[0] = [];
          $scope.normalProtocol[1] = [];
        $scope.customProtocol = new Array(new Array());
         $scope.customProtocol[0] = [];
          $scope.customProtocol[1] = [];
    $scope.DisableAddProtocol = false;
      patientService.getProtocol(patientId).then(function(response){
        if(response.data.protocol){
          $scope.protocols = response.data.protocol;
        }else if(response.data.message){
          $scope.protocolsErrMsg = response.data.message;
        }
        if($scope.getDeviceTypeforBothIcon() === searchFilters.allCaps){
         console.log("$scope.protocols",$scope.protocols)
        angular.forEach($scope.protocols, function(protocol, key){
          var protocolkey = protocol.protocolKey;
          var protocolobject = {}
            if(protocol.type === 'Normal'){
              console.log("$scope.normalProtocol in if",$scope.normalProtocol);
              if($scope.normalProtocol[0].length){
              if($scope.normalProtocol[0][0].protocolKey === protocolkey){
            protocolobject = protocol;
              $scope.normalProtocol[0].push(protocolobject);
             }
             else{
            protocolobject = protocol;
              $scope.normalProtocol[1].push(protocolobject);
             }
           }
       else{
             protocolobject = protocol;
              $scope.normalProtocol[0].push(protocolobject);
            }
      }
            else if(protocol.type === 'Custom'){
              console.log("$scope.customProtocol in if",$scope.customProtocol);
              if($scope.customProtocol[0].length){
              if($scope.customProtocol[0][0].protocolKey === protocolkey){
            protocolobject = protocol;
              $scope.customProtocol[0].push(protocolobject);
             }
             else{
            protocolobject = protocol;
              $scope.customProtocol[1].push(protocolobject);
             }
           }
           else{
            protocolobject = protocol;
              $scope.customProtocol[0].push(protocolobject);
           }
            }
          });
        }
         $scope.DisableAddProtocol = false;
        var vestFlag = false;
        var monarchFlag = false;
        $scope.lastdeviceType = $scope.protocols[0].deviceType;

        $scope.addProtocol = true;
           var vestFlag = false;
        var monarchFlag = false;
        angular.forEach($scope.protocols, function(protocol){
          protocol.createdDate = dateService.getDateByTimestamp(protocol.createdDate);
          protocol.lastModifiedDate = dateService.getDateByTimestamp(protocol.lastModifiedDate);
          if(!protocol.deleted){
            $scope.addProtocol = false;
          }
          if(protocol.deviceType === searchFilters.VisiVest){
            vestFlag = true;
           // alert("vestFlag = true");
          }
          if(protocol.deviceType === searchFilters.Monarch){
            monarchFlag = true;
           // alert("monarchFlag = true");
          }
        });
         if(vestFlag && monarchFlag){
          $scope.DisableAddProtocol = true;
        //  alert($scope.DisableAddProtocol);
        }
        else{
          $scope.DisableAddProtocol = false;
          // alert($scope.DisableAddProtocol);
        }
      });
    };

    $scope.initPatientClinicHCPs = function(){
      $scope.getClinicsOfPatient();
      $scope.getHCPsOfPatient();
    };
        $scope.initPatientClinicHCPsforCaregiver = function(){
      $scope.getClinicsOfPatientforCaregiver();
      $scope.getHCPsOfPatientforCaregiver();
    };

    $scope.getClinicsOfPatient = function(){
      patientService.getClinicsLinkedToPatient(StorageService.get('logged').patientID || $scope.patientId).then(function(response){
        if(response.data.clinics){
          $scope.clinics = response.data.clinics;
        }else if(response.data.message){
          $scope.clinicsOfPatientErrMsg = response.data.message;
        }
        
        patientService.getLatestAdherenceSetting(StorageService.get('logged').patientID).then(function(responseforPatient){
          if(responseforPatient.data){
            if(responseforPatient.data.latestadherence){
          $scope.adherenceDays = responseforPatient.data.latestadherence;
        }
        else
          $scope.adherenceDays = 3;
          var adherenceInNumber = $scope.adherenceDays;
          if(adherenceInNumber==1)
          {
            $scope.adherenceDaysForPatient = $scope.adherenceDays + " Day";
          }
          else
          {
            $scope.adherenceDaysForPatient = $scope.adherenceDays + " Days";
          }
        }else if(responseforPatient.data.message){
          $scope.clinicsOfPatientErrMsg = response.data.message;
        }
        });
      });
    };
        $scope.getClinicsOfPatientforCaregiver = function(){
      patientService.getClinicsLinkedToPatient($scope.selectedPatient.userId).then(function(response){
        if(response.data.clinics){
          $scope.clinics = response.data.clinics;
        }else if(response.data.message){
          $scope.clinicsOfPatientErrMsg = response.data.message;
        }
        
        patientService.getLatestAdherenceSetting($scope.selectedPatient.userId).then(function(responseforPatient){
          if(responseforPatient.data){
            if(responseforPatient.data.latestadherence){
          $scope.adherenceDays = responseforPatient.data.latestadherence;
        }
        else
          $scope.adherenceDays = 3;
          var adherenceInNumber = $scope.adherenceDays;
          if(adherenceInNumber==1)
          {
            $scope.adherenceDaysForPatient = $scope.adherenceDays + " Day";
          }
          else
          {
            $scope.adherenceDaysForPatient = $scope.adherenceDays + " Days";
          }
        }else if(responseforPatient.data.message){
          $scope.clinicsOfPatientErrMsg = response.data.message;
        }
        });
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
     $scope.getHCPsOfPatientforCaregiver = function(){
      patientService.getHCPsLinkedToPatient($scope.selectedPatient.userId).then(function(response){
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
        data.deviceType = localStorage.getItem('deviceType');
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
            var editDate =  dateService.convertDateToYyyyMmDdFormat(new Date(dateService.convertToTimestamp($scope.textNote.edit_date))); //$scope.textNote.edit_date;
            var data = {}; 
            data.noteText = $scope.textNote.text;
            data.userId = StorageService.get('logged').patientID;
            data.date = editDate;
            data.deviceType = localStorage.getItem('deviceType');
            UserService.createNote(StorageService.get('logged').patientID, data).then(function(response){
              $scope.addNote = false;
              $scope.textNote.edit_date = dateService.convertDateToYyyyMmDdFormat(new Date());
              $scope.textNote = "";
              $scope.showAllNotes();
              $scope.addNoteActive = false;
              $("#note_edit_container").removeClass("show_content");
              $("#note_edit_container").addClass("hide_content");
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
      var formattedDate = dateService.getDateTimeFromTimeStamp(new Date().getTime(),patientDashboard.dateFormat,'/');
      if(formattedDate && formattedDate.indexOf(" ") !== -1){
        formattedDate =  formattedDate.split(" ");
        $scope.textNote.edit_date = formattedDate[0];//dateService.convertDateToYyyyMmDdFormat(new Date());
      }      
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
      /*var pInterval = 12;
      var sInterval = 13;
      var remainder  = 6;*/
      var pInterval = 8;
      var sInterval = 9;
      var remainder  = 4;
      if($rootScope.isIOS()){
        pInterval = 7;
        sInterval = 8;
        remainder = 3;
      }else if($rootScope.isMobile()){
        pInterval = 2;
        sInterval = 3;
        remainder = 1;
      }
      return ( (parseInt(noOfDataPoints/pInterval) > 0) && noOfDataPoints%pInterval > remainder) ? parseInt(noOfDataPoints/sInterval) : ((parseInt(noOfDataPoints/pInterval) > 0)? parseInt(noOfDataPoints/pInterval): 1) ; 
    };
   
     $scope.switchtoDevice = function() {    
    $scope.selectedDeviceTypeforGraph = $scope.deviceTypeforGraphSelected;
    $scope.deviceTypeforGraphSelectedProtocol = searchFilters.VisiVest;
    if($scope.selectedDeviceTypeforGraph == "VEST")    
    {   
        $scope.deviceTypeforGraph = "VEST";  
        $scope.getTransmissionDateForPatient($scope.patientId);
        $scope.getHMR();
        $scope.forhidingMonarchHmrGraph = false;
        $scope.forhidingVestHmrGraph = true;
             
             
    }   
    if($scope.selectedDeviceTypeforGraph == "MONARCH")   
    {   
        $scope.deviceTypeforGraph = "MONARCH"; 
        $scope.getTransmissionDateForPatient($scope.patientId); 
        $scope.getHMR(); 
        $scope.forhidingMonarchHmrGraph = true;
        $scope.forhidingVestHmrGraph = false;  
    }   
  };

   $scope.switchtoDeviceProtocol = function() {    
    $scope.selectedDeviceTypeforGraphProtocol = $scope.deviceTypeforGraphSelectedProtocol; 
     $scope.deviceTypeforGraphSelected = searchFilters.VisiVest;
    if($scope.selectedDeviceTypeforGraphProtocol == "VEST")    
    {   
        $scope.deviceTypeforGraphProtocol = "VEST";  
        $scope.getTransmissionDateForPatient($scope.patientId);
        $scope.getCompliance() ;
         $scope.forhidingMonarchProtocolGraph = false;
        $scope.forhidingVestProtocolGraph = true;
             
    }   
    if($scope.selectedDeviceTypeforGraphProtocol == "MONARCH")   
    {   
        $scope.deviceTypeforGraphProtocol = "MONARCH";  
        $scope.getTransmissionDateForPatient($scope.patientId);
        $scope.getCompliance() ;  
         $scope.forhidingMonarchProtocolGraph = true;
        $scope.forhidingVestProtocolGraph = false;
    }   
  };

    $scope.getComplianceGraph = function(){ 
      patientDashBoardService.getcomplianceGraphData($scope.patientId, $scope.deviceTypeforGraphProtocol, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.durationRange).then(function(response){
        $scope.compilencechartData = response.data;
        var responseData = response.data;              
        var xData = [];
        $scope.chartData = {};
        $scope.chartData.datasets = [];
        $scope.noDataAvailable = false;
        if(responseData){ 
          $scope.noDataAvailable = false;        
          xData = responseData.xAxis.categories; 
          responseData.xAxis.xLabels = []; 
          var startDay = (responseData.xAxis && responseData.xAxis.categories.length > 0) ? responseData.xAxis.categories[0].split(" "): null;  
          $scope.complianceXAxisLabelCount = 0;
          angular.forEach(responseData.xAxis.categories, function(x, key){              
            // this is for year view or custom view having datapoints more than 7
            // x-axis will be plotted accordingly, chart type will be datetime
            var curDay = responseData.xAxis.categories[key].split(" ");
            $scope.isSameDay = ($scope.isSameDay && (curDay[0] === startDay[0]) )? true : false;  
            if(curDay[0] !== startDay[0]){
              startDay[0] = curDay[0];
              $scope.complianceXAxisLabelCount++;
            }
            var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",dateService.convertToTimestamp(x));
            dateTextLabel += (Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)))? ' ( ' + Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)) + ' )' : '';
            
            responseData.xAxis.xLabels.push(dateTextLabel);            
              xData[key] = dateService.convertToTimestamp(x);                          
            });       

          angular.forEach(responseData.series, function(s, key1){
            var marker = {};
            marker.radius = (s.data && s.data.length < 50)? 2 : 0.5;
            $scope.markerRadius = marker.radius; 
            angular.forEach(s.data, function(d, key2){
              var tooltipDateText = responseData.series[key1].data[key2].x ;
              responseData.series[key1].data[key2].x = xData[key2];
              responseData.series[key1].data[key2].marker = marker;
              responseData.series[key1].data[key2].toolText.dateText = responseData.xAxis.xLabels[key2] ;
              if(responseData.series[key1].data[key2].toolText.missedTherapy){
                responseData.series[key1].data[key2].color = "red";
              }
            });
            if(responseData.series[key1].name === "Avg Pressure/Intensity"){
              responseData.series[key1].unit = ""; 
              responseData.series[key1].color = patientGraphsConstants.colors.pressure;
            }else if(responseData.series[key1].name === "Avg Pressure/Intensity"){
              responseData.series[key1].unit = ""; 
              responseData.series[key1].color = patientGraphsConstants.colors.pressure;
            }
            else if(responseData.series[key1].name === "Avg Frequency"){
              responseData.series[key1].unit = patientGraphsConstants.units.frequency; 
              responseData.series[key1].color = patientGraphsConstants.colors.frequency;
            }else if(responseData.series[key1].name === "Avg Duration"){
              responseData.series[key1].unit = patientGraphsConstants.units.duration; 
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
         // $scope.removeAllCharts();
        }       
      }).catch(function(){
        $scope.noDataAvailable = true;
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
          var daysInterval = getDaysIntervalInChart($scope.complianceXAxisLabelCount);         
          
          $('<div class="chart">')
            .appendTo('#'+divId)
            .highcharts({
              credits: {
                enabled: false
              },
              chart: {
                marginLeft: 40, 
                //spacingTop: 30,
                spacingBottom: 30,                
                backgroundColor:  "#e6f1f4"
              },
              title: {
                text: dataset.name + " " +dataset.unit,
                align: 'left',
                margin: 25,
                x: 30,
                style:{
                  color: dataset.color,
                  fontWeight: 'bold',
                  fontSize: '14px'
                }                
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
                    return Highcharts.dateFormat("%m/%d/%Y", this.value);
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
                          enabled: true,
                           radius: $scope.markerRadius
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
                    fontSize: '14px'
                },
                hideDelay: 0//,
                //useHTML: true                
              },
              series: [{
                data: dataset.data,
                name: dataset.name,
                type: dataset.type,
                color: dataset.color,                
                fillOpacity: 0.3,
                 tooltip: {
                    valueSuffix: ' ' + dataset.unit
                }
              }]
            });
        });
    };

      $scope.discardLessHMRData = function(object){
         for(var i = 0; i < object.series[0].data.length; i++) {
                var obj = object.series[0].data[i];
                if(obj.y == 0){
                   object.series[0].data.splice(i, 1);
                   i--;
                }
                 else if((obj.toolText.duration == 0 && !obj.toolText.missedTherapy)){
                  object.series[0].data.splice(i, 1);
                  i--;
                }
            }
            return object;
      };
    
    $scope.getHMRGraph = function(){
      console.log("checkeing for hmr graph, line no:3161:",$scope.deviceTypeforGraph);
      patientDashBoardService.getHMRGraphPoints($scope.patientId, $scope.deviceTypeforGraph, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.durationRange).then(function(response){
        $scope.hmrChartDataRaw = response.data;
        if($scope.hmrChartDataRaw){
         $scope.hmrChartDataRaw = $scope.discardLessHMRData($scope.hmrChartDataRaw);
          }
          $scope.hmrChartData = $scope.hmrChartDataRaw;
        $scope.noDataAvailableForHMR  = false;       
        if($scope.hmrChartData && typeof($scope.hmrChartData) === "object"){ 
          $scope.noDataAvailableForHMR = false;      
          $scope.hmrChartData.xAxis.xLabels=[]; 
          $scope.isSameDayHMRGraph = true;
          var startDay = ($scope.hmrChartData.xAxis && $scope.hmrChartData.xAxis.categories.length > 0) ? $scope.hmrChartData.xAxis.categories[0].split(" "): null;  
            $scope.hmrXAxisLabelCount = 0;
            angular.forEach($scope.hmrChartData.xAxis.categories, function(x, key){ 
              var curDay = $scope.hmrChartData.xAxis.categories[key].split(" ");
              $scope.isSameDayHMRGraph = ($scope.isSameDayHMRGraph && (curDay[0] === startDay[0]) )? true : false;  
              if(curDay[0] !== startDay[0]){
                startDay[0] = curDay[0];
                $scope.hmrXAxisLabelCount++;
              }
            });       
            angular.forEach($scope.hmrChartData.xAxis.categories, function(x, key){              
              // this is for year view or custom view having datapoints more than 7
              // x-axis will be plotted accordingly, chart type will be datetime
              if($scope.durationRange !== "Day" && !$scope.isSameDayHMRGraph){
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
            $scope.markerRadius = marker.radius;
            angular.forEach(s.data, function(d, key2){
              var tooltipDateText = $scope.hmrChartData.series[key1].data[key2].x ;
              $scope.hmrChartData.series[key1].data[key2].marker = marker;
              if($scope.durationRange === "Day" || $scope.isSameDayHMRGraph){
                delete $scope.hmrChartData.series[key1].data[key2].x;
              }else{
                $scope.hmrChartData.series[key1].data[key2].x = $scope.hmrChartData.xAxis.categories[key2];
              }
              $scope.hmrChartData.series[key1].data[key2].toolText.dateText = $scope.hmrChartData.xAxis.xLabels[key2];
              if($scope.hmrChartData.series[key1].data[key2].toolText.missedTherapy){
                $scope.hmrChartData.series[key1].data[key2].color = "red";
              }
             /* if(!$scope.hmrChartData.series[key1].data[key2].toolText.missedTherapy && localStorage.getItem('deviceType') == 'MONARCH'){
                $scope.hmrChartData.series[key1].data[key2].color = "#7cb5ee";
              }*/

            });            
            
          }); 

          setTimeout(function(){
            if($scope.durationRange === "Day" || $scope.isSameDayHMRGraph){          
              $scope.HMRCategoryChart();
            }else{
              $scope.HMRAreaChart();
            }            
          }, 100);          
        } else{
          $scope.noDataAvailableForHMR = true;
          //$scope.removeAllCharts();
        }
      }).catch(function(){
        $scope.noDataAvailableForHMR = true;
      });
    };


    $scope.getAdhereneTrendGraph = function()
    {
      patientDashBoardService.getAdherenceTrendGraphPoints($scope.patientId, $scope.deviceTypeforGraphTrend, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.durationRange).then(function(response){
      $scope.adherenceTrendData = response.data;
      $scope.noDataAvailableForAdherence= false;       
        if($scope.adherenceTrendData && typeof($scope.adherenceTrendData) === "object"){ 
         $scope.noDataAvailableForAdherence = false;      
          $scope.adherenceTrendData.xAxis.xLabels=[]; 
          $scope.isSameDayAdherenceTrend = true;
          var startDay = ($scope.adherenceTrendData.xAxis && $scope.adherenceTrendData.xAxis.categories.length > 0) ? $scope.adherenceTrendData.xAxis.categories[0].split(" "): null;  
            $scope.adherenceTrendXAxisLabelCount = 0;
            angular.forEach($scope.adherenceTrendData.xAxis.categories, function(x, key){ 
              var curDay = $scope.adherenceTrendData.xAxis.categories[key].split(" ");
              $scope.isSameDayAdherenceTrend = ($scope.isSameDayAdherenceTrend && (curDay[0] == startDay[0]) )? true : false;  
                 if(curDay[0] !== startDay[0]){
                startDay[0] = curDay[0];
                $scope.adherenceTrendXAxisLabelCount++;
              }
            });       
            angular.forEach($scope.adherenceTrendData.xAxis.categories, function(x, key){              
              // this is for year view or custom view having datapoints more than 7
              // x-axis will be plotted accordingly, chart type will be datetime
              if($scope.durationRange !== "Day" && !$scope.isSameDayAdherenceTrend){
                $scope.adherenceTrendData.xAxis.xLabels.push(dateService.convertToTimestamp(x));
                $scope.adherenceTrendData.xAxis.categories[key] = dateService.convertToTimestamp(x);               
              }else{
                $scope.adherenceTrendData.xAxis.xLabels.push(x);
                $scope.adherenceTrendData.xAxis.categories[key] = Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)) ;
              }
            });
          angular.forEach($scope.adherenceTrendData.series, function(s, key1){
            var marker = {};
            marker.radius = (s.data && s.data.length < 50)? 2 : 0.5;
            $scope.markerRadius = marker.radius;
            angular.forEach(s.data, function(d, key2){
              var tooltipDateText = $scope.adherenceTrendData.series[key1].data[key2].x ;
              $scope.adherenceTrendData.series[key1].data[key2].marker = marker;
              if($scope.durationRange === "Day" || $scope.isSameDayAdherenceTrend){
                delete $scope.adherenceTrendData.series[key1].data[key2].x;
              }else{
                $scope.adherenceTrendData.series[key1].data[key2].x = $scope.adherenceTrendData.xAxis.categories[key2];
              }
              $scope.adherenceTrendData.series[key1].data[key2].toolText.dateText = $scope.adherenceTrendData.xAxis.xLabels[key2];
              if($scope.adherenceTrendData.series[key1].data[key2].toolText.scoreReset){
                $scope.adherenceTrendData.series[key1].data[key2].color = "#8c6bb1";
              }
              if(!$scope.adherenceTrendData.series[key1].data[key2].toolText.scoreReset)
              {
                $scope.adherenceTrendData.series[key1].data[key2].color = '#41ae76';
              }
            });            
            
          }); 
          setTimeout(function(){ 
            if($scope.durationRange === "Day" || $scope.isSameDayAdherenceTrend){           
              $scope.AdherenceTrendCategoryChart();
            }else{
           $scope.AdherenceTrendAreaChart();
            }            
          }, 100);          
        } else{
          $scope.noDataAvailableForAdherence = true;
          //$scope.removeAllCharts();
        }
      }).catch(function(){
        $scope.noDataAvailableForAdherence = true;
         // $scope.removeAllCharts();
      });
    };

    $scope.HMRAreaChart = function(divId){ 
      var noOfDataPoints = ($scope.hmrChartData && $scope.hmrChartData.xAxis.categories)?$scope.hmrChartData.xAxis.categories.length: 0;      
      var daysInterval = getDaysIntervalInChart($scope.hmrXAxisLabelCount);           
   /*   Highcharts.setOptions({
          global: {
              useUTC: false
          }
      }); */
      var fillcolor = '#7cb5ee'; 
      if(localStorage.getItem('deviceType')  == 'MONARCH'){
        var fillcolor = '#d95900';
      }     
      divId = (divId)? divId : "HMRGraph";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          credits: {
            enabled: false
          },
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
                  return  Highcharts.dateFormat("%m/%d/%Y",this.value);
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
                  var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",this.point.toolText.dateText);
                  if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");
                    if(parseInt(splitSession[1]) > 0){
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",this.x) + ' )';
                    }
                  }
                  if($scope.deviceTypeforGraph  == 'MONARCH'){
                  var pointDetails = '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> Session No </div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.sessionNo  + '</b></div>';                 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> ' + this.point.series.name + '</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Intensity</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.intensity + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Frequency</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.frequency + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Duration</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.duration + '</b></div>'; 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Cough Pauses</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.coughPauses + '</b></div>';
                
                    }
                    else{
                    var pointDetails = '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> Session No </div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.sessionNo  + '</b></div>';                 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> ' + this.point.series.name + '</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Pressure</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.pressure + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Frequency</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.frequency + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Duration</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.duration + '</b></div>'; 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Cough Pauses</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.coughPauses + '</b></div>';
                
                    }
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
               fillColor : fillcolor,
                marker: {
                      enabled: true,
                       radius: $scope.markerRadius
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                turboThreshold : $scope.hmrChartData.series[0].data.length,
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
      var fillcolor = '#7cb5ee';
      if(localStorage.getItem('deviceType')  == 'MONARCH'){
        fillcolor = '#d95900';
      }   
      divId = (divId)? divId : "HMRGraph";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          credits: {
            enabled: false
          },
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
                return  Highcharts.dateFormat("%m/%d/%Y",this.value);
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
                  var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",dateX);                  
                  if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");                    
                    if(parseInt(splitSession[1]) > 0){                      
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",dateX) + ' )';                      
                    }
                  }
                   if(this.point.toolText.errorCodes){
                     var lengthofErrorCodes = this.point.toolText.errorCodes.length;
                   }
                   else{
                    var lengthofErrorCodes = 0;
                   }
                   //
                    if(this.point.toolText.btChangeEvents){
                     var lengthofbtChangeEvents = this.point.toolText.btChangeEvents.length;
                   }
                   else{
                    var lengthofbtChangeEvents = 0;
                   }
                   //
                    if(this.point.toolText.powerChangeEvents){
                     var lengthofpowerChangeEvents = this.point.toolText.powerChangeEvents.length;
                   }
                   else{
                    var lengthofpowerChangeEvents = 0;
                   }
                   //
                  if(localStorage.getItem('deviceType') == 'MONARCH'){   

                  var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  dateTextLabel +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
                   //Only for Hill-Rom Users
                     if($scope.isHillRomUser){   
                  if((!this.point.toolText.startBatteryLevel && !this.point.toolText.endBatteryLevel) || (lengthofpowerChangeEvents)){
                  s += '<div style="font-size:11px; font-weight: bold; width:100%;" ><div style="padding:2px 0;" > <span class="acicon">Powered by AC</span> </div> ' 
                  + '</div>'; 
                }
                 if((this.point.toolText.startBatteryLevel && this.point.toolText.endBatteryLevel)){

                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:3px 0;width:50%;float:left;"> Start Battery Level</div> ' 
                  + '<div style="padding:3px;width:50%;">End Battery Level</div></div>';

                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="width:50%;float:left;" > <span class="dcstarticon">'+this.point.toolText.startBatteryLevel+' %</span></div> ' 
                  + '<div style="width:50%;" ><span class="dcendicon">'+this.point.toolText.endBatteryLevel+' %</span></div></div>';
                  }
                   if((this.point.toolText.startBatteryLevel && this.point.toolText.endBatteryLevel === 0)){
                      s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:3px 0;width:50%;float:left;"> Start Battery Level</div> ' 
                  + '<div style="padding:3px;width:50%;">End Battery Level</div></div>';

                   s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="width:50%;float:left;" > <span class="dcstarticon">'+this.point.toolText.startBatteryLevel+' %</span></div> ' 
                  + '<div style="width:50%;" ><span class="dcendicon">'+this.point.toolText.endBatteryLevel+' %</span></div></div>';
                  }
                   if((this.point.toolText.startBatteryLevel === 0 && this.point.toolText.endBatteryLevel)){
                      s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:3px 0;width:50%;float:left;"> Start Battery Level</div> ' 
                  + '<div style="padding:3px;width:50%;">End Battery Level</div></div>';

                   s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="width:50%;float:left;" > <span class="dcstarticon">'+this.point.toolText.startBatteryLevel+' %</span></div> ' 
                  + '<div style="width:50%;" ><span class="dcendicon">'+this.point.toolText.endBatteryLevel+' %</span></div></div>';
                  }
                    if(lengthofbtChangeEvents){
                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:2px 0;"> <span class="mobileicon">Mobile Control </span><span class="pendanticon">Pendant Control </span></div> ' 
                  + '</div>'; 
                  }
                  else{
                     s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:2px 0;"><span class="pendanticondefault">Pendant Control </span></div> ' 
                  + '</div>'; 
                  }
                  if(lengthofErrorCodes){
                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:2px 0;"><span class="erroricon">' 
                 angular.forEach(this.point.toolText.errorCodes, function(errorCodeValue, errorCodeKey){
                 var hexString = errorCodeValue.toString(16);
               //  errorCodeValue = parseInt(hexString, 16);
                  s += '0x' + hexString;
                  if(errorCodeKey != lengthofErrorCodes-1){
                    s += ',';
                  }
                 });
                  s +=' </span></div> ' 
                  + '</div>'; 
                }
              }
            
                //End Only for Hill-Rom Users 
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> Session No </div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.sessionNo  + '</b></div></div>';                 
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> ' + this.point.series.name + '</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Intensity</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.intensity + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Frequency</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.frequency + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Duration</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.duration + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Cough Pauses</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.coughPauses + '</b></div></div>';
                  s += '</div>';
                  }
                  else{
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
                  }
                  return s;
                }, 
                hideDelay: 0,
                useHTML: true 
          },
          plotOptions: {
            series: {
                pointWidth: 50,
                fillColor : fillcolor,
                marker: {
                      enabled: true,
                      radius: $scope.markerRadius
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                turboThreshold : $scope.hmrChartData.series[0].data.length,
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

    /*
    Function for Adherence Trend
    */
    $scope.AdherenceTrendAreaChart = function(divId){ 
      var noOfDataPoints = ($scope.adherenceTrendData && $scope.adherenceTrendData.xAxis.categories)?$scope.adherenceTrendData.xAxis.categories.length: 0;      
      var daysInterval = getDaysIntervalInChart($scope.adherenceTrendXAxisLabelCount);           
      Highcharts.setOptions({
          global: {
              useUTC: false
          }
      });      
      divId = (divId)? divId : "AdherenceTrendGraph";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          credits: {
            enabled: false
          },
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
                  return  Highcharts.dateFormat("%m/%d/%Y",this.value);
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
                    text: $scope.adherenceTrendData.series[0].name,
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
                  var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",this.point.toolText.dateText);
                  /*if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");
                    if(parseInt(splitSession[1]) > 0){
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",this.x) + ' )';
                    }
                  }*/
                  var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  dateTextLabel +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> Adherence Score</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.y  + '</b></div></div>';                 
                  return s;
                }
               
                
          },
          plotOptions: {
            series: {
                //allowPointSelect: true,
                marker: {
                      enabled: true,
                       radius: $scope.markerRadius
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                 turboThreshold : $scope.adherenceTrendData.series[0].data.length,
                cursor: 'pointer',
            }
          },         
          legend:{
            enabled: false
          },          
          series: $scope.adherenceTrendData.series
      });
    };


    /*
    Function for Adherence Trend
    */
      $scope.AdherenceTrendCategoryChart = function(divId){
      var chartType = "column";
      Highcharts.setOptions({
          global: {
              useUTC: false
          }
      });      
      divId = (divId)? divId : "AdherenceTrendGraph";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          credits: {
            enabled: false
          },
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
              categories: $scope.adherenceTrendData.xAxis.categories,
              labels:{
                style: {
                    color: '#525151',                    
                    fontWeight: 'bold'
                }               
              }, 
              formatter:function(){
                return  Highcharts.dateFormat("%m/%d/%Y",this.value);
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
                    text: $scope.adherenceTrendData.series[0].name,
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
                  var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",dateX);                  
                  if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");                    
                    if(parseInt(splitSession[1]) > 0){                      
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",dateX) + ' )';                      
                    }
                  }                 
                  var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  dateTextLabel +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> Adherence Score</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.y  + '</b></div></div>';                 
                  return s;
                }, 
                hideDelay: 0,
                useHTML: true 
          },
          plotOptions: {
            series: {
                pointWidth: 50,
                marker: {
                      enabled: true,
                      radius: $scope.markerRadius
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                 turboThreshold : $scope.adherenceTrendData.series[0].data.length,
                cursor: 'pointer',
            }
          },         
          legend:{
            enabled: false
          },          
          series: $scope.adherenceTrendData.series
      });
    };
     
    $scope.drawHMRCChart =function(){ 
        $scope.removeAllCharts();    
        $scope.getHMRGraph();
        $scope.getAdhereneTrendGraph();
        $scope.getComplianceGraph();
    };

    $scope.getYearChart = function(){
      $scope.durationRange = "Year";
      $scope.calculateTimeDuration(365,'NotAdherenceScoreHistory');
     // $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.getFirstTransmissionDate();
      $scope.drawHMRCChart();
      $scope.drawHMRCChart1();
    };

    $scope.getMonthChart = function(){
      $scope.durationRange = "Month";
      $scope.calculateTimeDuration(30,'NotAdherenceScoreHistory');
      //$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.getFirstTransmissionDate();
      $scope.drawHMRCChart();
      $scope.drawHMRCChart1();
    };

    $scope.getWeekChart = function(){
      $scope.durationRange = "Week";
      $scope.calculateTimeDuration(6,'NotAdherenceScoreHistory');
      //$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.getFirstTransmissionDate();
      $scope.drawHMRCChart();
      $scope.drawHMRCChart1();
    };

    $scope.getCustomDateRangeChart = function(){  
      $scope.durationRange = "Custom";    
     // $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.getFirstTransmissionDate();
      $scope.drawHMRCChart();
      $scope.drawHMRCChart1();
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
      $scope.drawHMRCChart1();
    };

    $scope.initGraph = function(){
      $scope.getHmrRunRateAndScore();      
      $scope.isHMR = false;
      $scope.isCompliance = true;
      $scope.isAdherenceTrend = false;
     
      $scope.getTransmissionDateForPatient($scope.patientId);
      
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
       var deviceType = '';
       if($scope.getDeviceTypeforBothIcon() === searchFilters.allCaps){
                if($scope.isHMR){
                  deviceType = $scope.deviceTypeforGraphSelected;
                }
                else if( $scope.isCompliance){
                  deviceType = $scope.deviceTypeforGraphProtocol;
                }
                else{
                  deviceType = searchFilters.VisiVest;
                }
        }
     else{
        deviceType = $scope.getDeviceType();
         }
      patientService.getTransmissionDate(patientId,deviceType).then(function(response) {
        if(response.data && response.data.firstTransmissionDate){
          $scope.hasTransmissionDate = true;
          var formattedTransmissionDate = dateService.getDateTimeFromTimeStamp(dateService.convertYyyyMmDdToTimestamp(response.data.firstTransmissionDate),patientDashboard.dateFormat,'/');
          $scope.transmissionDate = (formattedTransmissionDate && formattedTransmissionDate.indexOf(" "))? formattedTransmissionDate.split(" ")[0] : null; 
          $scope.hasTransmissionDateforCostomrange = dateService.getDateFromTimeStamp(response.data.firstTransmissionDate,patientDashboard.dateFormat,'/'); 
          //alert($scope.hasTransmissionDateforCostomrange); 
          setTimeout(function(){
          $scope.opts = {
          minDate: $scope.hasTransmissionDateforCostomrange
        };
        $scope.dateOpts = {
          minDate: $scope.hasTransmissionDateforCostomrange
          }; 
           }, 1000);     
        }
      });
    };
    $scope.getFirstTransmissionDate = function(){
       if(new Date ($scope.fromDate) < new Date ($scope.hasTransmissionDateforCostomrange)){
       
        $scope.dates = {startDate: $scope.hasTransmissionDateforCostomrange, endDate: $scope.toDate};

       }
      else {

        $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
        }
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
      var clinicDetail = ($scope.patientInfo.clinics && $scope.patientInfo.clinics.length === 1) ? $scope.patientInfo.clinics[0]: null ; 
      //exportutilService.exportHMRCGraphAsPDF("synchronizedChart", "HMRCCanvas", $scope.fromDate, $scope.toDate, $scope.patientInfo, clinicDetail);
          var myObject =$scope.hmrChartData;
         var hmrChartDataLength = Object.keys(myObject).length;
      
       if((localStorage.getItem('deviceTypeforBothIcon') == 'MONARCH')|| (localStorage.getItem('deviceTypeforBothIcon') == 'VEST')){

        if($scope.hmrChartData.length===0) {
          exportutilService.exportHMRCGraphAsPDFForAdherenceTrendHavingNoHMR("synchronizedChart", "HMRCCanvas", $scope.fromDate, $scope.toDate, $scope.patientInfo, clinicDetail);
        }
        else {
          exportutilService.exportHMRCGraphAsPDFForAdherenceTrend("synchronizedChart", "HMRCCanvas", $scope.fromDate, $scope.toDate, $scope.patientInfo, clinicDetail);
        }

      }else if((localStorage.getItem('deviceTypeforBothIcon') == 'ALL')){
         exportutilService.exportHMRCGraphAsPDFForAdherenceTrendForAll("synchronizedChart","synchronizedChart1", "HMRCCanvas", $scope.fromDate, $scope.toDate, $scope.patientInfo, clinicDetail,$scope.hmrChartData1);
      }    
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
    $scope.dateOpts = {
      maxDate: new Date(),
      format: patientDashboard.dateFormat,
      dateLimit: {"months":24},
      eventHandlers: {'apply.daterangepicker': function(ev, picker) {
          $scope.duration = "custom";
          $scope.calculateDateFromPicker(picker, 'AdherenceScoreHistory');
          var dayDiff = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
          if( dayDiff === 0){
            $scope.duration = "day";
          }
          $scope.getAdherenceScore($scope.duration);
        }
      },
      opens: 'left'
    }
 /******Adherence History Grid view Date selection-Hill-1848 ******/
    $scope.getAdherenceScore = function(customSelection){
      //$scope.dateslist = [[]];

      $scope.dayFlag = false;
      $scope.noHistoryAvailable = false;
      $scope.activeSelection = customSelection;
       $scope.currentPageIndex = 1;
          $scope.pageCount = 0;
      var patientId;
      if($stateParams.patientId){
        patientId = $stateParams.patientId;
      }else if(StorageService.get('logged').patientID){
        patientId = StorageService.get('logged').patientID;
      }

      if(customSelection == 'day'){
         $scope.calculateTimeDuration(1,'AdherenceScoreHistory');
          $scope.dayFlag = true;
       }
      else if(customSelection == 'week'){
      $scope.calculateTimeDuration(6,'AdherenceScoreHistory');
      }
      else if(customSelection == 'month'){
      $scope.calculateTimeDuration(30,'AdherenceScoreHistory');
      }
       else  if(customSelection == 'year'){
      $scope.calculateTimeDuration(365,'AdherenceScoreHistory');
      }
       else  if(customSelection == 'custom'){
        //For custom date selection, event handler of dateOpts calculates to and from date
        }
      else{
        $scope.activeSelection='week';
        $scope.calculateTimeDuration(6,'AdherenceScoreHistory');
      }
      $scope.loading = true;
    $scope.customdates = {startDate: $scope.fromDateHistory, endDate: $scope.toDateHistory};
     var fromDate = dateService.convertDateToYyyyMmDdFormat($scope.fromDateHistory);
      var toDate = dateService.convertDateToYyyyMmDdFormat($scope.toDateHistory);
      patientDashBoardService.getAdeherenceData(patientId, fromDate, toDate).then(function(response){

        $scope.adherenceScores = response.data;
        $scope.adherenceHistoryAllData = response.data;
        $scope.adherencetrendlength=0;
        for(var i=0; i <$scope.adherenceScores.length;i++){
                   $scope.adherencetrendlength= $scope.adherencetrendlength+$scope.adherenceScores[i].adherenceTrends.length;
        }
         $scope.pageCount = Math.ceil($scope.adherencetrendlength / 7);
        
        $scope.lengthTrack=0;
        $scope.adherencetrendData = new Array();
         if($scope.dayFlag == true){
        for(var j = 0 ; j<$scope.adherenceScores.length;j++){
$scope.adherencetrendData.push(new Object({"adherenceTrends": [] , "protocols": []}));
          for(var i=0; i <$scope.adherenceScores[j].adherenceTrends.length;i++){
                 if($scope.adherenceScores[j].adherenceTrends[i].date == $scope.toDate){
                 $scope.adherencetrendData[j].adherenceTrends[i]= angular.extend({},$scope.adherencetrendData[j].adherenceTrends[i],$scope.adherenceScores[j].adherenceTrends[i]);
                 $scope.adherencetrendData[j].protocols=angular.extend({},$scope.adherencetrendData[j].protocols,$scope.adherenceScores[j].protcols);
                $scope.noHistoryAvailable = false;
                }
                else{
                  $scope.adherencetrendlength=0;
                   $scope.noHistoryAvailable = true;
                }
        }
      }
    }
    else{
   loop1:    for(var j = 0 ; j<$scope.adherenceScores.length;j++){
        $scope.adherencetrendData.push(new Object({"adherenceTrends": [] , "protocols": []}));
          $scope.adherencetrendData[j].protocols=angular.extend({},$scope.adherencetrendData[j].protocols,$scope.adherenceScores[j].protcols);
          for(var i=0; i <$scope.adherenceScores[j].adherenceTrends.length;i++){
                   $scope.adherencetrendData[j].adherenceTrends[i]= angular.extend({},$scope.adherencetrendData[j].adherenceTrends[i],$scope.adherenceScores[j].adherenceTrends[i]);
                      $scope.lengthTrack++;//no. of records to be displayed in a page
                      if(i == ($scope.adherenceScores[j].adherenceTrends.length-1))
                       { //If records available are less than no. of records to be displayed in a page
                        $scope.nextDate=$scope.adherenceScores[j].adherenceTrends[i].date;
                        $scope.lessThanSeven = i;
                       }
                      if($scope.lengthTrack == 7){
                        $scope.nextDate=$scope.adherenceScores[j].adherenceTrends[i].date; //Store the date of the last row from the displayed records
                        $scope.lessThanSeven = 6;
                       break loop1; //break if the no. of records to be displayed in a page is reached
                      }
        }
      }
    }
       angular.element(document).ready(function () {  
     $scope.loading = false;
    });
   
      }).catch(function(response){
        $scope.noHistoryAvailable = true;
       // notyService.showError(response);
      });
      $scope.getFirstTransmissionDateforHistory();
    };

  /******End of Adherence History Grid view Date selection-Hill-1848 ******/  
  $scope.getFirstTransmissionDateforHistory = function(){
       if(new Date ($scope.fromDateHistory) < new Date ($scope.hasTransmissionDateforCostomrange)){
       
        $scope.customdates = {startDate: $scope.hasTransmissionDateforCostomrange, endDate: $scope.toDateHistory};

       }
      else {

        $scope.customdates = {startDate: $scope.fromDateHistory, endDate: $scope.toDateHistory};
        }
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

    /*
    For Adherenve Trend
    */
    $scope.getAdherenceTrend = function(){
      $scope.isHMR = false;
      $scope.isCompliance = false;
      $scope.isAdherenceTrend = true;
      if(($scope.adherenceTrendData.length == 0) || ($scope.adherenceTrendData==null))
      {
        $scope.noDataStatus = true;
      }
      else
      {
        $scope.noDataStatus = false
      }
      $scope.selectChart($scope.fromDate);
    };

    $scope.getHMR = function(){
      $scope.isHMR = true;
      $scope.isCompliance = false;
      $scope.isAdherenceTrend = false;
      $scope.noDataStatus = true;
      $scope.getTransmissionDateForPatient($scope.patientId);
      $scope.selectChart($scope.fromDate);

    };

    $scope.getCompliance = function(){
      $scope.isHMR = false;
      $scope.isCompliance = true;
      $scope.isAdherenceTrend = false;
      $scope.noDataStatus = true;
        $scope.getTransmissionDateForPatient($scope.patientId);
      $scope.selectChart($scope.fromDate);
    };

    $scope.initCaregiverDashboard = function(){
      $scope.getTransmissionDateForPatient($scope.patientId);
      $scope.getAssociatedClinics($scope.patientId);
      $scope.getPatientDevices($scope.patientId);      
      $scope.initGraph();
      $scope.getPatientById($scope.patientId);
      $scope.getWeekChart();    
    };


    $scope.initHMR = function(){
      $scope.isHMR = true;
      $scope.noDataAvailable = false; 
      $scope.noDataAvailable1 = false;    
    };

    $scope.removeAllCharts = function(){
     $("#HMRGraph").empty();
      $("#synchronizedChart").empty(); 
      $("#AdherenceTrendGraph").empty();    
    };
    $scope.removeAllCharts1 = function(){

     $("#HMRGraph1").empty();
      $("#synchronizedChart1").empty(); 

      $("#AdherenceTrendGraph").empty();    
    };

    $scope.viewProtocol = function(protcols){
      $scope.protocols=protcols;
     $scope.noProtocol= angular.equals({}, $scope.protocols);
      $scope.showProtocolModal = true;
    };

    $scope.closeProtocolModal = function(){
      $scope.showProtocolModal = false;
    };
    
    $scope.cancelSurvey = function(){
      $rootScope.surveyTaken = true;
      $scope.surveyConfirmModal = false;
      delete $rootScope.surveyId;      
    };


    $scope.toggleHeaderAccount = function(){
      $( "#collapseTwo" ).slideToggle( "slow" );
      $scope.expandedSign = ($scope.expandedSign === "+") ? "-" : "+";      
    }
    /******For Hill-1882******/
        $scope.GetAdherenceScoreReason = function(hoverdate,key){
      var MTDdates = ""; //Variable to store dates of Missed therapies
      var HNAdates = ""; //Variable to store dates of HMR Non Adherence
      var ASRdates = ""; //Variable to store dates of HMR Non Adherence
      var FDdates = ""; //Variable to store dates of Frequency Deviation
      var HNACounter = 0;
      var res ="";
      $scope.myPopoverData=""; 
    for(var j=0; j < ($scope.adherenceHistoryAllData.length) ; j++){
     var adherenceTrends = $scope.adherenceHistoryAllData[j].adherenceTrends;
      for(var i=0; i < (adherenceTrends.length) ; i++)
      {
        var date = adherenceTrends[i].date;
         var notificationPoints = Object.keys(adherenceTrends[i].notificationPoints); 
/******Collecting the dates to be displayed in details******/  
         if(notificationPoints.indexOf('Missed Therapy Days') >-1){
          if(HNACounter >= 2)
          {
             res = HNAdates.split(",");
            if(MTDdates == ""){
             MTDdates =res[res.length-2]+ ", "+res[res.length-1] + "," + date;
            }
            else{
            MTDdates =MTDdates + ", "+ res[res.length-2]+ ", "+res[res.length-1] + "," + date;
            }
            HNACounter = 0;
            HNAdates = "";
            FDdates = "";
            ASRdates = "";
          }
          else
          {
             HNACounter = 0;
             HNAdates = "";
             FDdates = "";
             ASRdates = "";
          if(MTDdates == ""){//To remove unnecessary comma
             MTDdates = date;
               }
           else{//add comma only for more than 1 date
             MTDdates = MTDdates + ", "+date;
           }
          }
         }
          else if(notificationPoints.indexOf('Below Treatment Minutes') > -1 && notificationPoints.indexOf('Setting Deviation') > -1){
             //for HMR Non-Adherence and Frequency Deviation
             HNACounter++;
             MTDdates= "";
             ASRdates = "";
             if(HNAdates == ""){
             HNAdates = date;
           }
            else{
             HNAdates = HNAdates +", "+ date;
           }
             if(FDdates == ""){
             FDdates = date;
           }
           else{
             FDdates = FDdates +", "+ date;
           }
         }
         else if(notificationPoints.indexOf('Below Treatment Minutes')>-1 && notificationPoints.indexOf('Setting Deviation') < 0){
             //for HMR Non-Adherence
              HNACounter++;
             MTDdates= "";
             FDdates = "";
             ASRdates = "";
             if(HNAdates == ""){
             HNAdates = date;
           }
           else{
             HNAdates = HNAdates +", "+ date;
           }
         }
           else if(notificationPoints.indexOf('Setting Deviation')>-1 && notificationPoints.indexOf('Below Treatment Minutes') < 0){
            //for Frequency Deviation
             HNACounter++;
             HNAdates = "";
             MTDdates= "";
             ASRdates = "";
             if(FDdates == ""){
             FDdates = date;
           }
           else{
             FDdates = FDdates +", "+ date;
           }     
         }
         else if(notificationPoints.indexOf('No Notification')>-1){
            HNACounter = 0;
           MTDdates = "";
           FDdates = "";
           HNAdates = "";
            ASRdates = "";
         }
         else if(notificationPoints.indexOf('Adherence Score Reset')>-1){
            HNACounter = 0;
            MTDdates= "";
            FDdates = "";
            HNAdates = "";
            if(ASRdates == ""){
             ASRdates = date;
           }
           else{
             ASRdates = ASRdates +", "+ date;
           }
         }
/******End of collecting the dates to be displayed in details******/  
 /*****Display only last ten dates *****/
        if(MTDdates != "")
           {
                MTDdates = $scope.GetLastTenDates(MTDdates);
            }
         if(HNAdates != "")
            {
                HNAdates = $scope.GetLastTenDates(HNAdates);
            }
          if(ASRdates != "")
           {  
                ASRdates = $scope.GetLastTenDates(ASRdates);
            }
          if(FDdates != "")
          {  
                FDdates = $scope.GetLastTenDates(FDdates);
           }
 /******End of Display only last ten dates ******/
/****** To fetch the details to be displayed ******/
        if(hoverdate == date){
         if(key == 'Missed Therapy Days'){
         $scope.myPopoverData=key+' on ('+MTDdates+' )';
             }
          else if(key == 'Below Treatment Minutes'){
         $scope.myPopoverData=key+' on ('+HNAdates+' )';
          }
          else if(key == 'Setting Deviation'){
            $scope.myPopoverData=key+' on ('+FDdates+' )';
          }
          else if(key == 'Adherence Score Reset')
          {
         $scope.myPopoverData=key+' on ('+ASRdates+' )';
          }
          else if(key == 'No Notification'){
            $scope.myPopoverData = "No notification available!";
          }
      }
/****** End of fetch the details to be displayed ******/
    }//End of for
  }//End of for
    };
    $scope.GetLastTenDates = function(allDates){
        var res = allDates.split(",");
         if(res.length > 10)
         {
          allDates = "";
           allDates = res[(res.length)-10];
          for(var i=((res.length)-9);i<=((res.length)-1);i++)
          {
            allDates = allDates+", " + res[i] ;
           }
          }
       return allDates;
    };
    /******Adherence History Pagination-Hill-1848 ******/
        $scope.AdherenceHistoryPagination = function(track) {
      var patientId;
      if($stateParams.patientId){
        patientId = $stateParams.patientId;
      }else if(StorageService.get('logged').patientID){
        patientId = StorageService.get('logged').patientID;
      }
  
      var referenceDate = $scope.convertStringToDate($scope.nextDate);
      var relativeReferenceDate = new Date();
      var fromDate = new Date();
      var toDate = new Date();
          if (track !== undefined) {
            if (track === "PREV" && $scope.currentPageIndex > 1) {
            relativeReferenceDate = dateService.convertDateToYyyyMmDdFormat($scope.getnDaysBeforeOrAfter(referenceDate,6-(6-$scope.lessThanSeven)));
            toDate = relativeReferenceDate;
            fromDate = dateService.convertDateToYyyyMmDdFormat($scope.getnDaysBeforeOrAfter(relativeReferenceDate,13-(6-$scope.lessThanSeven)));
              $scope.currentPageIndex--;
            } else if (track === "NEXT" && $scope.currentPageIndex < $scope.pageCount) {
            relativeReferenceDate = dateService.convertDateToYyyyMmDdFormat($scope.getnDaysBeforeOrAfter(referenceDate,-8));
            toDate = relativeReferenceDate;
            fromDate = dateService.convertDateToYyyyMmDdFormat($scope.getnDaysBeforeOrAfter(referenceDate,-1));
              $scope.currentPageIndex++;
            } else {
              return false;
            }
          } else {
            $scope.currentPageIndex = 1;
          }
          //call the API with from and to date
    
           $scope.loading = true;
        patientDashBoardService.getAdeherenceData(patientId,fromDate,toDate).then(function(response){
  
        $scope.adherenceScores = response.data;
        $scope.lengthTrack=0;
        $scope.adherencetrendData = new Array();
   loop1:    for(var j = 0 ; j<$scope.adherenceScores.length;j++){
     $scope.noHistoryAvailable = false;
                      $scope.adherencetrendData.push(new Object({"adherenceTrends": []},{"protocols": []}));
                      $scope.adherencetrendData[j].protocols=angular.extend({},$scope.adherencetrendData[j].protocols,$scope.adherenceScores[j].protcols);
                    for(var i=0; i <$scope.adherenceScores[j].adherenceTrends.length;i++){
                       $scope.adherencetrendData[j].adherenceTrends[i]= angular.extend({},$scope.adherencetrendData[j].adherenceTrends[i],$scope.adherenceScores[j].adherenceTrends[i]);
                       $scope.lengthTrack++;//no. of records to be displayed in a page
                       if(i == ($scope.adherenceScores[j].adherenceTrends.length-1))
                       {//If records available are less than no. of records to be displayed in a page
                        $scope.nextDate=$scope.adherenceScores[j].adherenceTrends[i].date;
                        $scope.lessThanSeven = i;
                       }
                       if($scope.lengthTrack == 7){
                        $scope.nextDate=$scope.adherenceScores[j].adherenceTrends[i].date; //Store the date of the last row from the displayed records
                        $scope.lessThanSeven = 6;
                        break loop1;//break if the no. of records to be displayed in a page is reached
                         }
                       }
              }
               $scope.adherencetrendlength =  $scope.adherencetrendlength;
                $scope.pageCount= $scope.pageCount;

     angular.element(document).ready(function () {
     
     $scope.loading = false;
    });
      }).catch(function(response){
        $scope.noHistoryAvailable = true;
        //$scope.nextDate =dateService.convertDateToYyyyMmDdFormat($scope.getnDaysBeforeOrAfter(toDate,1)); 
        var dateString = toDate;
var myDate = new Date(dateString);

//add a day to the date
myDate.setDate(myDate.getDate() + 1); 
$scope.nextDate = dateService.convertDateToYyyyMmDdFormat(myDate);


var res = $scope.nextDate.split("-");
$scope.nextDate = res[1]+"/"+res[2]+"/"+res[0];
        //notyService.showError(response);
      }); 
   };
    /******End of Adherence History Pagination-Hill-1848 ******/
   /******Function to convert string to Date ******/
   $scope.convertStringToDate = function(dateString){
    var parts=$scope.nextDate.split("/");
    return(new Date(parts[2],parts[0]-1,parts[1]));
   };
    /******End of Function to convert string to Date ******/
   /******Function to get n days before or after a given date******/
   $scope.getnDaysBeforeOrAfter = function(givenDate,n){
    var finalDate = new Date($scope.convertStringToDate(givenDate).getTime() - (n * 24 * 60 * 60 * 1000));
    var day =finalDate.getDate();
    var month=finalDate.getMonth();
    var year=finalDate.getFullYear();
    return (new Date(year,month,day));
   };
    /******End of Function to get n days before or after a given date******/

        $scope.protocolDeviceIconFilter = function(protocol){
      if(localStorage.getItem('deviceType') === searchFilters.allCaps){
      
      if(protocol.type === 'Normal'){
        $scope.customPointsChecker = 0;
        console.log("protocol is normal, we want device symbol so i am returning true");
        $scope.lastdeviceType = protocol.deviceType;
        $scope.displayFlag = true;
        return true;
      }
      else if(protocol.type === 'Custom'){
      if($scope.lastdeviceType != protocol.deviceType){
         $scope.customPointsChecker = 0;
      }
      $scope.customPointsChecker++;
      if($scope.customPointsChecker == 1){
        console.log("protocol is custom, we want device symbol so i am returning true");
         $scope.lastdeviceType = protocol.deviceType;
         $scope.displayFlag = true;
        return true;
      }
      else{
        console.log("protocol is custom,but we dont want device symbol so i am returning false");
         $scope.lastdeviceType = protocol.deviceType;
         $scope.displayFlag = false;
        return false;
      }
        }
      }
      else{
        return true;
      }
    };











    if((localStorage.getItem('deviceTypeforBothIcon') == 'ALL')){


$scope.getComplianceGraph = function(){ 
  $scope.deviceTypeforGraphProtocol="VEST";
      patientDashBoardService.getcomplianceGraphData($scope.patientId, $scope.deviceTypeforGraphProtocol, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.durationRange).then(function(response){
        $scope.compilencechartData = response.data;
        var responseData = response.data;              
        var xData = [];
        $scope.chartData = {};
        $scope.chartData.datasets = [];
        $scope.noDataAvailable = false;
        if(responseData){ 
          $scope.noDataAvailable = false;        
          xData = responseData.xAxis.categories; 
          responseData.xAxis.xLabels = []; 
          var startDay = (responseData.xAxis && responseData.xAxis.categories.length > 0) ? responseData.xAxis.categories[0].split(" "): null;  
          $scope.complianceXAxisLabelCount = 0;
          angular.forEach(responseData.xAxis.categories, function(x, key){              
            // this is for year view or custom view having datapoints more than 7
            // x-axis will be plotted accordingly, chart type will be datetime
            var curDay = responseData.xAxis.categories[key].split(" ");
            $scope.isSameDay = ($scope.isSameDay && (curDay[0] === startDay[0]) )? true : false;  
            if(curDay[0] !== startDay[0]){
              startDay[0] = curDay[0];
              $scope.complianceXAxisLabelCount++;
            }
            var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",dateService.convertToTimestamp(x));
            dateTextLabel += (Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)))? ' ( ' + Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)) + ' )' : '';
            
            responseData.xAxis.xLabels.push(dateTextLabel);            
              xData[key] = dateService.convertToTimestamp(x);                          
            });       

          angular.forEach(responseData.series, function(s, key1){
            var marker = {};
            marker.radius = (s.data && s.data.length < 50)? 2 : 0.5;
            $scope.markerRadius = marker.radius; 
            angular.forEach(s.data, function(d, key2){
              var tooltipDateText = responseData.series[key1].data[key2].x ;
              responseData.series[key1].data[key2].x = xData[key2];
              responseData.series[key1].data[key2].marker = marker;
              responseData.series[key1].data[key2].toolText.dateText = responseData.xAxis.xLabels[key2] ;
              if(responseData.series[key1].data[key2].toolText.missedTherapy){
                responseData.series[key1].data[key2].color = "red";
              }
            });
            if(responseData.series[key1].name === "Avg Pressure/Intensity"){
              responseData.series[key1].unit = ""; 
              responseData.series[key1].color = patientGraphsConstants.colors.pressure;
            }else if(responseData.series[key1].name === "Avg Pressure/Intensity"){
              responseData.series[key1].unit = ""; 
              responseData.series[key1].color = patientGraphsConstants.colors.pressure;
            }
            else if(responseData.series[key1].name === "Avg Frequency"){
              responseData.series[key1].unit = patientGraphsConstants.units.frequency; 
              responseData.series[key1].color = patientGraphsConstants.colors.frequency;
            }else if(responseData.series[key1].name === "Avg Duration"){
              responseData.series[key1].unit = patientGraphsConstants.units.duration; 
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
         // $scope.removeAllCharts();
        }       
      }).catch(function(){
        $scope.noDataAvailable = true;
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
          var daysInterval = getDaysIntervalInChart($scope.complianceXAxisLabelCount);         
          
          $('<div class="chart">')
            .appendTo('#'+divId)
            .highcharts({
              credits: {
                enabled: false
              },
              chart: {
                marginLeft: 40, 
                //spacingTop: 30,
                spacingBottom: 30,  
                 width:1080,
                height:250,               
                backgroundColor:  "#e6f1f4"
              },
              title: {
                text: dataset.name + " " +dataset.unit,
                align: 'left',
                margin: 25,
                x: 30,
                style:{
                  color: dataset.color,
                  fontWeight: 'bold',
                  fontSize: '14px'
                }                
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
                    return Highcharts.dateFormat("%m/%d/%Y", this.value);
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
                          enabled: true,
                           radius: $scope.markerRadius
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
                    fontSize: '14px'
                },
                hideDelay: 0//,
                //useHTML: true                
              },
              series: [{
                data: dataset.data,
                name: dataset.name,
                type: dataset.type,
                color: dataset.color,                
                fillOpacity: 0.3,
                 tooltip: {
                    valueSuffix: ' ' + dataset.unit
                }
              }]
            });
        });
    };

    
    $scope.getHMRGraph = function(){
      $scope.deviceTypeforGraph="VEST";
      patientDashBoardService.getHMRGraphPoints($scope.patientId, $scope.deviceTypeforGraph, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.durationRange).then(function(response){
        $scope.hmrChartDataRaw = response.data;
       if($scope.hmrChartDataRaw){
         $scope.hmrChartDataRaw = $scope.discardLessHMRData($scope.hmrChartDataRaw);
          }
          $scope.hmrChartData = $scope.hmrChartDataRaw;
        $scope.noDataAvailableForHMR  = false;       
        if($scope.hmrChartData && typeof($scope.hmrChartData) === "object"){ 
          $scope.noDataAvailableForHMR = false;      
          $scope.hmrChartData.xAxis.xLabels=[]; 
          $scope.isSameDayHMRGraph = true;
          var startDay = ($scope.hmrChartData.xAxis && $scope.hmrChartData.xAxis.categories.length > 0) ? $scope.hmrChartData.xAxis.categories[0].split(" "): null;  
            $scope.hmrXAxisLabelCount = 0;
            angular.forEach($scope.hmrChartData.xAxis.categories, function(x, key){ 
              var curDay = $scope.hmrChartData.xAxis.categories[key].split(" ");
              $scope.isSameDayHMRGraph = ($scope.isSameDayHMRGraph && (curDay[0] === startDay[0]) )? true : false;  
              if(curDay[0] !== startDay[0]){
                startDay[0] = curDay[0];
                $scope.hmrXAxisLabelCount++;
              }
            });       
            angular.forEach($scope.hmrChartData.xAxis.categories, function(x, key){              
              // this is for year view or custom view having datapoints more than 7
              // x-axis will be plotted accordingly, chart type will be datetime
              if($scope.durationRange !== "Day" && !$scope.isSameDayHMRGraph){
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
            $scope.markerRadius = marker.radius;
            angular.forEach(s.data, function(d, key2){
              var tooltipDateText = $scope.hmrChartData.series[key1].data[key2].x ;
              $scope.hmrChartData.series[key1].data[key2].marker = marker;
              if($scope.durationRange === "Day" || $scope.isSameDayHMRGraph){
                delete $scope.hmrChartData.series[key1].data[key2].x;
              }else{
                $scope.hmrChartData.series[key1].data[key2].x = $scope.hmrChartData.xAxis.categories[key2];
              }
              $scope.hmrChartData.series[key1].data[key2].toolText.dateText = $scope.hmrChartData.xAxis.xLabels[key2];
              if($scope.hmrChartData.series[key1].data[key2].toolText.missedTherapy){
                $scope.hmrChartData.series[key1].data[key2].color = "red";
              }
              if(!$scope.hmrChartData.series[key1].data[key2].toolText.missedTherapy && localStorage.getItem('deviceType') == 'MONARCH'){
                $scope.hmrChartData.series[key1].data[key2].color = "#7cb5ee";
              }

            });            
            
          }); 
          setTimeout(function(){
            if($scope.durationRange === "Day" || $scope.isSameDayHMRGraph){          
              $scope.HMRCategoryChart();
            }else{
              $scope.HMRAreaChart();
            }            
          }, 100);          
        } else{
          $scope.noDataAvailableForHMR = true;
          //$scope.removeAllCharts();
        }
      }).catch(function(){
        $scope.noDataAvailableForHMR = true;
      });
    };


    $scope.getAdhereneTrendGraph = function()
    {
    //  $scope.deviceTypeforGraphTrend="VEST";
      patientDashBoardService.getAdherenceTrendGraphPoints($scope.patientId, $scope.deviceTypeforGraphTrend, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.durationRange).then(function(response){
      $scope.adherenceTrendData = response.data;
      $scope.noDataAvailableForAdherence= false;       
        if($scope.adherenceTrendData && typeof($scope.adherenceTrendData) === "object"){ 
         $scope.noDataAvailableForAdherence = false;      
          $scope.adherenceTrendData.xAxis.xLabels=[]; 
          $scope.isSameDayAdherenceTrend = true;
          var startDay = ($scope.adherenceTrendData.xAxis && $scope.adherenceTrendData.xAxis.categories.length > 0) ? $scope.adherenceTrendData.xAxis.categories[0].split(" "): null;  
            $scope.adherenceTrendXAxisLabelCount = 0;
            angular.forEach($scope.adherenceTrendData.xAxis.categories, function(x, key){ 
              var curDay = $scope.adherenceTrendData.xAxis.categories[key].split(" ");
              $scope.isSameDayAdherenceTrend = ($scope.isSameDayAdherenceTrend && (curDay[0] == startDay[0]) )? true : false;  
                 if(curDay[0] !== startDay[0]){
                startDay[0] = curDay[0];
                $scope.adherenceTrendXAxisLabelCount++;
              }
            });       
            angular.forEach($scope.adherenceTrendData.xAxis.categories, function(x, key){              
              // this is for year view or custom view having datapoints more than 7
              // x-axis will be plotted accordingly, chart type will be datetime
              if($scope.durationRange !== "Day" && !$scope.isSameDayAdherenceTrend){
                $scope.adherenceTrendData.xAxis.xLabels.push(dateService.convertToTimestamp(x));
                $scope.adherenceTrendData.xAxis.categories[key] = dateService.convertToTimestamp(x);               
              }else{
                $scope.adherenceTrendData.xAxis.xLabels.push(x);
                $scope.adherenceTrendData.xAxis.categories[key] = Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)) ;
              }
            });
          angular.forEach($scope.adherenceTrendData.series, function(s, key1){
            var marker = {};
            marker.radius = (s.data && s.data.length < 50)? 2 : 0.5;
            $scope.markerRadius = marker.radius;
            angular.forEach(s.data, function(d, key2){
              var tooltipDateText = $scope.adherenceTrendData.series[key1].data[key2].x ;
              $scope.adherenceTrendData.series[key1].data[key2].marker = marker;
              if($scope.durationRange === "Day" || $scope.isSameDayAdherenceTrend){
                delete $scope.adherenceTrendData.series[key1].data[key2].x;
              }else{
                $scope.adherenceTrendData.series[key1].data[key2].x = $scope.adherenceTrendData.xAxis.categories[key2];
              }
              $scope.adherenceTrendData.series[key1].data[key2].toolText.dateText = $scope.adherenceTrendData.xAxis.xLabels[key2];
              if($scope.adherenceTrendData.series[key1].data[key2].toolText.scoreReset){
                $scope.adherenceTrendData.series[key1].data[key2].color = "#8c6bb1";
              }
              if(!$scope.adherenceTrendData.series[key1].data[key2].toolText.scoreReset)
              {
                $scope.adherenceTrendData.series[key1].data[key2].color = '#41ae76';
              }
            });            
            
          }); 
          setTimeout(function(){ 
            if($scope.durationRange === "Day" || $scope.isSameDayAdherenceTrend){           
              $scope.AdherenceTrendCategoryChart();
            }else{
           $scope.AdherenceTrendAreaChart();
            }            
          }, 100);          
        } else{
          $scope.noDataAvailableForAdherence = true;
         // $scope.removeAllCharts();
        }
      }).catch(function(){
        $scope.noDataAvailableForAdherence = true;
         // $scope.removeAllCharts();
      });
    };

    $scope.HMRAreaChart = function(divId){ 
      var noOfDataPoints = ($scope.hmrChartData && $scope.hmrChartData.xAxis.categories)?$scope.hmrChartData.xAxis.categories.length: 0;      
      var daysInterval = getDaysIntervalInChart($scope.hmrXAxisLabelCount);           
   /*   Highcharts.setOptions({
          global: {
              useUTC: false
          }
      }); */
      var fillcolor = '#7cb5ee'; 
      if(localStorage.getItem('deviceType')  == 'MONARCH'){
        var fillcolor = '#d95900';
      }     
      divId = (divId)? divId : "HMRGraph";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          credits: {
            enabled: false
          },
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
                  return  Highcharts.dateFormat("%m/%d/%Y",this.value);
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
                  var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",this.point.toolText.dateText);
                  if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");
                    if(parseInt(splitSession[1]) > 0){
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",this.x) + ' )';
                    }
                  }
                  if(localStorage.getItem('deviceType')  == 'MONARCH'){
                  var pointDetails = '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> Session No </div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.sessionNo  + '</b></div>';                 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> ' + this.point.series.name + '</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Intensity</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.intensity + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Frequency</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.frequency + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Duration</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.duration + '</b></div>'; 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Cough Pauses</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.coughPauses + '</b></div>';
                
                    }
                    else{
                    var pointDetails = '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> Session No </div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.sessionNo  + '</b></div>';                 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> ' + this.point.series.name + '</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Pressure</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.pressure + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Frequency</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.frequency + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Duration</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.duration + '</b></div>'; 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Cough Pauses</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.coughPauses + '</b></div>';
                
                    }
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
               fillColor : fillcolor,
                marker: {
                      enabled: true,
                       radius: $scope.markerRadius
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                turboThreshold : $scope.hmrChartData.series[0].data.length,
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
      var fillcolor = '#7cb5ee';
      if(localStorage.getItem('deviceType')  == 'MONARCH'){
        fillcolor = '#d95900';
      }   
      divId = (divId)? divId : "HMRGraph";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          credits: {
            enabled: false
          },
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
                return  Highcharts.dateFormat("%m/%d/%Y",this.value);
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
                  var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",dateX);                  
                  if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");                    
                    if(parseInt(splitSession[1]) > 0){                      
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",dateX) + ' )';                      
                    }
                  }
                   if(this.point.toolText.errorCodes){
             var lengthofErrorCodes = this.point.toolText.errorCodes.length;
           }
           else{
            var lengthofErrorCodes = 0;
           }
            //
                    if(this.point.toolText.btChangeEvents){
                     var lengthofbtChangeEvents = this.point.toolText.btChangeEvents.length;
                   }
                   else{
                    var lengthofbtChangeEvents = 0;
                   }
                   //
                    if(this.point.toolText.powerChangeEvents){
                     var lengthofpowerChangeEvents = this.point.toolText.powerChangeEvents.length;
                   }
                   else{
                    var lengthofpowerChangeEvents = 0;
                   }
                   //
                  if(localStorage.getItem('deviceType') == 'MONARCH'){    
                  var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  dateTextLabel +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
                      //Only for Hill-Rom Users
                     if($scope.isHillRomUser){   
                  if((!this.point.toolText.startBatteryLevel && !this.point.toolText.endBatteryLevel) || (lengthofpowerChangeEvents)){
                  s += '<div style="font-size:11px; font-weight: bold; width:100%;" ><div style="padding:2px 0;" > <span class="acicon">Powered by AC</span> </div> ' 
                  + '</div>'; 
                }
                 if((this.point.toolText.startBatteryLevel && this.point.toolText.endBatteryLevel)){

                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:3px 0;width:50%;float:left;"> Start Battery Level</div> ' 
                  + '<div style="padding:3px;width:50%;">End Battery Level</div></div>';

                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="width:50%;float:left;" > <span class="dcstarticon">'+this.point.toolText.startBatteryLevel+' %</span></div> ' 
                  + '<div style="width:50%;" ><span class="dcendicon">'+this.point.toolText.endBatteryLevel+' %</span></div></div>';
                  }
                  if((this.point.toolText.startBatteryLevel && this.point.toolText.endBatteryLevel === 0)){
                      s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:3px 0;width:50%;float:left;"> Start Battery Level</div> ' 
                  + '<div style="padding:3px;width:50%;">End Battery Level</div></div>';

                   s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="width:50%;float:left;" > <span class="dcstarticon">'+this.point.toolText.startBatteryLevel+' %</span></div> ' 
                  + '<div style="width:50%;" ><span class="dcendicon">'+this.point.toolText.endBatteryLevel+' %</span></div></div>';
                  }
                   if((this.point.toolText.startBatteryLevel === 0 && this.point.toolText.endBatteryLevel)){
                      s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:3px 0;width:50%;float:left;"> Start Battery Level</div> ' 
                  + '<div style="padding:3px;width:50%;">End Battery Level</div></div>';

                   s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="width:50%;float:left;" > <span class="dcstarticon">'+this.point.toolText.startBatteryLevel+' %</span></div> ' 
                  + '<div style="width:50%;" ><span class="dcendicon">'+this.point.toolText.endBatteryLevel+' %</span></div></div>';
                  }
                    if(lengthofbtChangeEvents){
                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:2px 0;"> <span class="mobileicon">Mobile Control </span><span class="pendanticon">Pendant Control </span></div> ' 
                  + '</div>'; 
                  }
                  else{
                     s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:2px 0;"><span class="pendanticondefault">Pendant Control </span></div> ' 
                  + '</div>'; 
                  }
                  if(lengthofErrorCodes){
                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:2px 0;"><span class="erroricon">' 
                 angular.forEach(this.point.toolText.errorCodes, function(errorCodeValue, errorCodeKey){
                 var hexString = errorCodeValue.toString(16);
               //  errorCodeValue = parseInt(hexString, 16);
                  s += '0x' + hexString;
                  if(errorCodeKey != lengthofErrorCodes-1){
                    s += ',';
                  }
                 });
                  s +=' </span></div> ' 
                  + '</div>'; 
                }
              }
            
                //End Only for Hill-Rom Users 
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> Session No </div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.sessionNo  + '</b></div></div>';                 
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> ' + this.point.series.name + '</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Intensity</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.intensity + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Frequency</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.frequency + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Duration</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.duration + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Cough Pauses</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.coughPauses + '</b></div></div>';
                  s += '</div>';
                  }
                  else{
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
                  }
                  return s;
                }, 
                hideDelay: 0,
                useHTML: true 
          },
          plotOptions: {
            series: {
                pointWidth: 50,
                fillColor : fillcolor,
                marker: {
                      enabled: true,
                      radius: $scope.markerRadius
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                turboThreshold : $scope.hmrChartData.series[0].data.length,
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

    /*
    Function for Adherence Trend
    */
    $scope.AdherenceTrendAreaChart = function(divId){ 
      var noOfDataPoints = ($scope.adherenceTrendData && $scope.adherenceTrendData.xAxis.categories)?$scope.adherenceTrendData.xAxis.categories.length: 0;      
      var daysInterval = getDaysIntervalInChart($scope.adherenceTrendXAxisLabelCount);           
      Highcharts.setOptions({
          global: {
              useUTC: false
          }
      });      
      divId = (divId)? divId : "AdherenceTrendGraph";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          credits: {
            enabled: false
          },
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
                  return  Highcharts.dateFormat("%m/%d/%Y",this.value);
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
                    text: $scope.adherenceTrendData.series[0].name,
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
                  var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",this.point.toolText.dateText);
                  /*if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");
                    if(parseInt(splitSession[1]) > 0){
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",this.x) + ' )';
                    }
                  }*/
                  var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  dateTextLabel +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> Adherence Score</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.y  + '</b></div></div>';                 
                  return s;
                }
               
                
          },
          plotOptions: {
            series: {
                //allowPointSelect: true,
                marker: {
                      enabled: true,
                       radius: $scope.markerRadius
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                 turboThreshold : $scope.adherenceTrendData.series[0].data.length,
                cursor: 'pointer',
            }
          },         
          legend:{
            enabled: false
          },          
          series: $scope.adherenceTrendData.series
      });
    };


    /*
    Function for Adherence Trend
    */
      $scope.AdherenceTrendCategoryChart = function(divId){
      var chartType = "column";
      Highcharts.setOptions({
          global: {
              useUTC: false
          }
      });      
      divId = (divId)? divId : "AdherenceTrendGraph";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          credits: {
            enabled: false
          },
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
              categories: $scope.adherenceTrendData.xAxis.categories,
              labels:{
                style: {
                    color: '#525151',                    
                    fontWeight: 'bold'
                }               
              }, 
              formatter:function(){
                return  Highcharts.dateFormat("%m/%d/%Y",this.value);
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
                    text: $scope.adherenceTrendData.series[0].name,
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
                  var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",dateX);                  
                  if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");                    
                    if(parseInt(splitSession[1]) > 0){                      
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",dateX) + ' )';                      
                    }
                  }                 
                  var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  dateTextLabel +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> Adherence Score</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.y  + '</b></div></div>';                 
                  return s;
                }, 
                hideDelay: 0,
                useHTML: true 
          },
          plotOptions: {
            series: {
                pointWidth: 50,
                marker: {
                      enabled: true,
                      radius: $scope.markerRadius
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                 turboThreshold : $scope.adherenceTrendData.series[0].data.length,
                cursor: 'pointer',
            }
          },         
          legend:{
            enabled: false
          },          
          series: $scope.adherenceTrendData.series
      });
    };


/*
$scope.displaycomp=function(){
   $scope.deviceTypeforGraphProtocol = "MONARCH";  
        $scope.getCompliance() ;     
}

*/


//monarch device

$scope.setSynchronizedChart1 = function(divId){
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
            if(chart && chart.renderTo.offsetParent && chart.renderTo.offsetParent.id === "synchronizedChart1"){              
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
            if(chart &&  chart.renderTo.offsetParent && chart.renderTo.offsetParent.id === "synchronizedChart1"){               
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

$scope.synchronizedChart1 = function(divId){
       
        // Get the data. The contents of the data file can be viewed at
        divId = (divId) ? divId : "synchronizedChart1";
        $("#"+divId).empty();
        $scope.setSynchronizedChart1(divId);
        function syncExtremes(e) {
              var thisChart = this.chart;

        if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
            Highcharts.each(Highcharts.charts, function(chart) {
              if(chart && chart.renderTo.offsetParent && chart.renderTo.offsetParent.id === "synchronizedChart1"){ 
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
        
        $.each($scope.chartData1.datasets, function(i, dataset) {         
          var  minRange = (dataset.plotLines.max) ? dataset.plotLines.max : dataset.plotLines.min;
          var yMaxPlotLine = dataset.plotLines.max;
          var yMinPlotLine = dataset.plotLines.min;
          var noOfDataPoints = ($scope.chartData1.xData)? $scope.chartData1.xData.length: 0;
          var daysInterval = getDaysIntervalInChart($scope.complianceXAxisLabelCount);         
          
          $('<div class="chart">')
            .appendTo('#'+divId)
            .highcharts({
              credits: {
                enabled: false
              },
              chart: {
                marginLeft: 40, 
                //spacingTop: 30,
                spacingBottom: 30,   
                 width:1080,
                height:250,              
                backgroundColor:  "#e6f1f4"
              },
              title: {
                text: dataset.name + " " +dataset.unit,
                align: 'left',
                margin: 25,
                x: 30,
                style:{
                  color: dataset.color,
                  fontWeight: 'bold',
                  fontSize: '14px'
                }                
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
                    return Highcharts.dateFormat("%m/%d/%Y", this.value);
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
                          enabled: true,
                           radius: $scope.markerRadius
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
                    fontSize: '14px'
                },
                hideDelay: 0//,
                //useHTML: true                
              },
              series: [{
                data: dataset.data,
                name: dataset.name,
                type: dataset.type,
                color: dataset.color,                
                fillOpacity: 0.3,
                 tooltip: {
                    valueSuffix: ' ' + dataset.unit
                }
              }]
            });
        });
    };

$scope.getComplianceGraph1 = function(){ 
      $scope.deviceTypeforGraphProtocol="MONARCH";
      patientDashBoardService.getcomplianceGraphData($scope.patientId, $scope.deviceTypeforGraphProtocol, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.durationRange).then(function(response){
        $scope.compilencechartData1 = response.data;
        var responseData = response.data;              
        var xData = [];
        $scope.chartData1 = {};
        $scope.chartData1.datasets = [];
        $scope.noDataAvailable1 = false;
        if(responseData){ 
          $scope.noDataAvailable1 = false;        
          xData = responseData.xAxis.categories; 
          responseData.xAxis.xLabels = []; 
          var startDay = (responseData.xAxis && responseData.xAxis.categories.length > 0) ? responseData.xAxis.categories[0].split(" "): null;  
          $scope.complianceXAxisLabelCount = 0;
          angular.forEach(responseData.xAxis.categories, function(x, key){              
            // this is for year view or custom view having datapoints more than 7
            // x-axis will be plotted accordingly, chart type will be datetime
            var curDay = responseData.xAxis.categories[key].split(" ");
            $scope.isSameDay = ($scope.isSameDay && (curDay[0] === startDay[0]) )? true : false;  
            if(curDay[0] !== startDay[0]){
              startDay[0] = curDay[0];
              $scope.complianceXAxisLabelCount++;
            }
            var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",dateService.convertToTimestamp(x));
            dateTextLabel += (Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)))? ' ( ' + Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)) + ' )' : '';
            
            responseData.xAxis.xLabels.push(dateTextLabel);            
              xData[key] = dateService.convertToTimestamp(x);                          
            });       

          angular.forEach(responseData.series, function(s, key1){
            var marker = {};
            marker.radius = (s.data && s.data.length < 50)? 2 : 0.5;
            $scope.markerRadius = marker.radius; 
            angular.forEach(s.data, function(d, key2){
              var tooltipDateText = responseData.series[key1].data[key2].x ;
              responseData.series[key1].data[key2].x = xData[key2];
              responseData.series[key1].data[key2].marker = marker;
              responseData.series[key1].data[key2].toolText.dateText = responseData.xAxis.xLabels[key2] ;
              if(responseData.series[key1].data[key2].toolText.missedTherapy){
                responseData.series[key1].data[key2].color = "red";
              }
            });
            if(responseData.series[key1].name === "Avg Pressure/Intensity"){
              responseData.series[key1].unit = ""; 
              responseData.series[key1].color = patientGraphsConstants.colors.pressure;
            }else if(responseData.series[key1].name === "Avg Pressure/Intensity"){
              responseData.series[key1].unit = ""; 
              responseData.series[key1].color = patientGraphsConstants.colors.pressure;
            }
            else if(responseData.series[key1].name === "Avg Frequency"){
              responseData.series[key1].unit = patientGraphsConstants.units.frequency; 
              responseData.series[key1].color = patientGraphsConstants.colors.frequency;
            }else if(responseData.series[key1].name === "Avg Duration"){
              responseData.series[key1].unit = patientGraphsConstants.units.duration; 
              responseData.series[key1].color = patientGraphsConstants.colors.duration;
            }
            $scope.chartData1.datasets.push(responseData.series[key1]);
          });
          $scope.chartData1.xData = xData;
          setTimeout(function(){            
              $scope.synchronizedChart1();           
          }, 100);          
        } else{
          $scope.noDataAvailable1 = true;
         // $scope.removeAllCharts();
        }       
      }).catch(function(){
        $scope.noDataAvailable1 = true;
      });
    };

    $scope.getHMRGraph1 = function(){
    $scope.deviceTypeforGraph="MONARCH";
      patientDashBoardService.getHMRGraphPoints($scope.patientId, $scope.deviceTypeforGraph, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), $scope.durationRange).then(function(response){
        $scope.hmrChartData1Raw = response.data;
       if($scope.hmrChartData1Raw){
         $scope.hmrChartData1Raw = $scope.discardLessHMRData($scope.hmrChartData1Raw);
          }
          $scope.hmrChartData1 = $scope.hmrChartData1Raw;
        $scope.noDataAvailableForHMR1  = false;       
        if($scope.hmrChartData1 && typeof($scope.hmrChartData1) === "object"){ 
          $scope.noDataAvailableForHMR1 = false;      
          $scope.hmrChartData1.xAxis.xLabels=[]; 
          $scope.isSameDayHMRGraph = true;
          var startDay = ($scope.hmrChartData1.xAxis && $scope.hmrChartData1.xAxis.categories.length > 0) ? $scope.hmrChartData1.xAxis.categories[0].split(" "): null;  
            $scope.hmrXAxisLabelCount = 0;
            angular.forEach($scope.hmrChartData1.xAxis.categories, function(x, key){ 
              var curDay = $scope.hmrChartData1.xAxis.categories[key].split(" ");
              $scope.isSameDayHMRGraph = ($scope.isSameDayHMRGraph && (curDay[0] === startDay[0]) )? true : false;  
              if(curDay[0] !== startDay[0]){
                startDay[0] = curDay[0];
                $scope.hmrXAxisLabelCount++;
              }
            });       
            angular.forEach($scope.hmrChartData1.xAxis.categories, function(x, key){              
              // this is for year view or custom view having datapoints more than 7
              // x-axis will be plotted accordingly, chart type will be datetime
              if($scope.durationRange !== "Day" && !$scope.isSameDayHMRGraph){
                $scope.hmrChartData1.xAxis.xLabels.push(dateService.convertToTimestamp(x));
                $scope.hmrChartData1.xAxis.categories[key] = dateService.convertToTimestamp(x);               
              }else{
                $scope.hmrChartData1.xAxis.xLabels.push(x);
                $scope.hmrChartData1.xAxis.categories[key] = Highcharts.dateFormat("%I:%M %p",dateService.convertToTimestamp(x)) ;
              }
            });         
          angular.forEach($scope.hmrChartData1.series, function(s, key1){
            var marker = {};
            marker.radius = (s.data && s.data.length < 50)? 2 : 0.5;
            $scope.markerRadius = marker.radius;
            angular.forEach(s.data, function(d, key2){
              var tooltipDateText = $scope.hmrChartData1.series[key1].data[key2].x ;
              $scope.hmrChartData1.series[key1].data[key2].marker = marker;
              if($scope.durationRange === "Day" || $scope.isSameDayHMRGraph){
                delete $scope.hmrChartData1.series[key1].data[key2].x;
              }else{
                $scope.hmrChartData1.series[key1].data[key2].x = $scope.hmrChartData1.xAxis.categories[key2];
              }
              $scope.hmrChartData1.series[key1].data[key2].toolText.dateText = $scope.hmrChartData1.xAxis.xLabels[key2];
              if($scope.hmrChartData1.series[key1].data[key2].toolText.missedTherapy){
                $scope.hmrChartData1.series[key1].data[key2].color = "red";
              }
/*              if(!$scope.hmrChartData1.series[key1].data[key2].toolText.missedTherapy && $scope.deviceTypeforGraph=="MONARCH" ){
                $scope.hmrChartData1.series[key1].data[key2].color = "#d95900";
              }*/

            });            
            
          }); 
          setTimeout(function(){
            if($scope.durationRange === "Day" || $scope.isSameDayHMRGraph){          
              $scope.HMRCategoryChart1();
            }else{
              $scope.HMRAreaChart1();
            }            
          }, 100);          
        } else{
          $scope.noDataAvailableForHMR1 = true;
         // $scope.removeAllCharts();
        }
      }).catch(function(){
      $scope.noDataAvailableForHMR1 = true;
      });
    };

   $scope.HMRAreaChart1 = function(divId){ 
      var noOfDataPoints = ($scope.hmrChartData1 && $scope.hmrChartData1.xAxis.categories)?$scope.hmrChartData1.xAxis.categories.length: 0;      
      var daysInterval = getDaysIntervalInChart($scope.hmrXAxisLabelCount);           
   /*   Highcharts.setOptions({
          global: {
              useUTC: false
          }
      }); */
      var fillcolor = '#7cb5ee'; 
      if(localStorage.getItem('deviceType')  == 'MONARCH'){
       fillcolor = '#d95900';
      } 
       if($scope.deviceTypeforGraph == 'MONARCH'){
         fillcolor = '#d95900';
      } 
          
      divId = (divId)? divId : "HMRGraph1";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          credits: {
            enabled: false
          },
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
                  return  Highcharts.dateFormat("%m/%d/%Y",this.value);
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
                    text: $scope.hmrChartData1.series[0].name,
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
                  var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",this.point.toolText.dateText);
                  if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");
                    if(parseInt(splitSession[1]) > 0){
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",this.x) + ' )';
                    }
                  }
                  if($scope.deviceTypeforGraph=="MONARCH"){
                  var pointDetails = '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> Session No </div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.sessionNo  + '</b></div>';                 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> ' + this.point.series.name + '</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Intensity</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.intensity + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Frequency</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.frequency + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Duration</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.duration + '</b></div>'; 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Cough Pauses</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.coughPauses + '</b></div>';
                
                    }
                    else{
                    var pointDetails = '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> Session No </div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.sessionNo  + '</b></div>';                 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left"> ' + this.point.series.name + '</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Pressure</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.pressure + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Frequency</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.frequency + '</b></div>';
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Duration</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.duration + '</b></div>'; 
                    pointDetails += '<div style="color:'+ this.point.color +';padding:5px 0;width:70%;float:left">Cough Pauses</div> ' 
                    + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.coughPauses + '</b></div>';
                
                    }
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
               fillColor : fillcolor,
                marker: {
                      enabled: true,
                       radius: $scope.markerRadius
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                turboThreshold : $scope.hmrChartData1.series[0].data.length,
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
          series: $scope.hmrChartData1.series
      });
    };
   $scope.HMRCategoryChart1 = function(divId){
      var chartType = "column";
      Highcharts.setOptions({
          global: {
              useUTC: false
          }
      });  
      var fillcolor = '#7cb5ee';
      if(localStorage.getItem('deviceType')  == 'MONARCH'){
        fillcolor = '#d95900';
      }   
      divId = (divId)? divId : "HMRGraph1";
      $('#'+divId).empty();
      $('#'+divId).highcharts({
          credits: {
            enabled: false
          },
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
              categories: $scope.hmrChartData1.xAxis.categories,
              labels:{
                style: {
                    color: '#525151',                    
                    fontWeight: 'bold'
                }               
              }, 
              formatter:function(){
                return  Highcharts.dateFormat("%m/%d/%Y",this.value);
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
                    text: $scope.hmrChartData1.series[0].name,
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
                  var dateTextLabel = Highcharts.dateFormat("%m/%d/%Y",dateX);                  
                  if(this.point.toolText.sessionNo && this.point.toolText.sessionNo.indexOf("/" > 0)){
                    var splitSession = this.point.toolText.sessionNo.split("/");                    
                    if(parseInt(splitSession[1]) > 0){                      
                      dateTextLabel += ' ( ' + Highcharts.dateFormat("%I:%M %p",dateX) + ' )';                      
                    }
                  }
                  if(this.point.toolText.errorCodes){
             var lengthofErrorCodes = this.point.toolText.errorCodes.length;
           }
           else{
            var lengthofErrorCodes = 0;
           }
           //
           if(this.point.toolText.btChangeEvents){
                     var lengthofbtChangeEvents = this.point.toolText.btChangeEvents.length;
                   }
                   else{
                    var lengthofbtChangeEvents = 0;
                   }
                   //
                    if(this.point.toolText.powerChangeEvents){
                     var lengthofpowerChangeEvents = this.point.toolText.powerChangeEvents.length;
                   }
                   else{
                    var lengthofpowerChangeEvents = 0;
                   }
                   //
                  if($scope.deviceTypeforGraph=="MONARCH"){   
                  var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  dateTextLabel +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
                 //Only for Hill-Rom Users
                  if($scope.isHillRomUser){
                  if((!this.point.toolText.startBatteryLevel && !this.point.toolText.endBatteryLevel) || (lengthofpowerChangeEvents)){
                  s += '<div style="font-size:11px; font-weight: bold; width:100%;" ><div style="padding:2px 0;" > <span class="acicon">Powered by AC</span> </div> ' 
                  + '</div>'; 
                }
                 if((this.point.toolText.startBatteryLevel && this.point.toolText.endBatteryLevel)){

                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:3px 0;width:50%;float:left;"> Start Battery Level</div> ' 
                  + '<div style="padding:3px;width:50%;">End Battery Level</div></div>';

                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="width:50%;float:left;" > <span class="dcstarticon">'+this.point.toolText.startBatteryLevel +' %</span></div> ' 
                  + '<div style="width:50%;" ><span class="dcendicon">'+this.point.toolText.endBatteryLevel+' %</span></div></div>';
                  }
                    if((this.point.toolText.startBatteryLevel && this.point.toolText.endBatteryLevel === 0)){
                      s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:3px 0;width:50%;float:left;"> Start Battery Level</div> ' 
                  + '<div style="padding:3px;width:50%;">End Battery Level</div></div>';

                   s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="width:50%;float:left;" > <span class="dcstarticon">'+this.point.toolText.startBatteryLevel+' %</span></div> ' 
                  + '<div style="width:50%;" ><span class="dcendicon">'+this.point.toolText.endBatteryLevel+' %</span></div></div>';
                  }
                   if((this.point.toolText.startBatteryLevel === 0 && this.point.toolText.endBatteryLevel)){
                      s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:3px 0;width:50%;float:left;"> Start Battery Level</div> ' 
                  + '<div style="padding:3px;width:50%;">End Battery Level</div></div>';

                   s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="width:50%;float:left;" > <span class="dcstarticon">'+this.point.toolText.startBatteryLevel+' %</span></div> ' 
                  + '<div style="width:50%;" ><span class="dcendicon">'+this.point.toolText.endBatteryLevel+' %</span></div></div>';
                  }
                    if(lengthofbtChangeEvents){
                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:2px 0;"><span class="mobileicon">Mobile Control</span><span class="pendanticon">Pendant Control </span></div> ' 
                  + '</div>'; 
                  }
                  else{
                     s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:2px 0;"><span class="pendanticondefault">Pendant Control </span></div> ' 
                  + '</div>'; 
                  }
                  if(lengthofErrorCodes){
                  s += '<div style="font-size:11px; font-weight: bold; width:100%"><div style="padding:2px 0;"><span class="erroricon">' 
                 angular.forEach(this.point.toolText.errorCodes, function(errorCodeValue, errorCodeKey){
                 var hexString = errorCodeValue.toString(16);
                 console.log("hexstring",hexString);
                 //errorCodeValue = parseInt(hexString, 16);
                  s += '0x' + hexString;
                  if(errorCodeKey != lengthofErrorCodes-1){
                    s += ',';
                  }
                 });
                  s +=' </span></div> ' 
                  + '</div>'; 
                }
              }
            
                //End Only for Hill-Rom Users
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> Session No </div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.sessionNo  + '</b></div></div>';                 
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left"> ' + this.point.series.name + '</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.y + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Intensity</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.intensity + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Frequency</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.frequency + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Duration</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.duration + '</b></div></div>';
                  s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ this.point.color +';padding:5px 0;width:80%;float:left">Cough Pauses</div> ' 
                  + '<div style="padding:5px;width:10%"><b>' + this.point.toolText.coughPauses + '</b></div></div>';
                  s += '</div>';
                  }
                  else{
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
                  }
                  return s;
                }, 
                hideDelay: 0,
                useHTML: true 
          },
          plotOptions: {
            series: {
                pointWidth: 50,
                fillColor : fillcolor,
                marker: {
                      enabled: true,
                      radius: $scope.markerRadius
                },
                states: {
                    hover: {
                        enabled: false
                    }                    
                },
                turboThreshold : $scope.hmrChartData1.series[0].data.length,
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
          series: $scope.hmrChartData1.series
      });
    };

 
    $scope.drawHMRCChart1 =function(){ 
        $scope.removeAllCharts1();    
        $scope.getHMRGraph1();
        $scope.getComplianceGraph1();
    };

}
}]);

