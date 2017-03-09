'use strict';
angular.module('hillromvestApp')
.controller('hcpGraphController',[ '$scope', '$state', 'clinicService','hcpDashBoardService', 'dateService', 'graphUtil', '$stateParams', 'hcpDashboardConstants', 'DoctorService', 'clinicadminService', 'notyService', 'StorageService','$filter', 'commonsUserService', 'exportutilService', '$rootScope','loginConstants',
	function($scope, $state, clinicService,hcpDashBoardService, dateService, graphUtil, $stateParams, hcpDashboardConstants, DoctorService, clinicadminService, notyService, StorageService,$filter,commonsUserService, exportutilService, $rootScope,loginConstants) {
	var chart;
	$scope.noDataAvailable = false;
	function getDaysIntervalInChart(noOfDataPoints){
      var pInterval = 8;
      var sInterval = 9;
      var remainder  = 4;
      if($rootScope.isIOS()){
        pInterval = 7;
        sInterval = 8;
        remainder = 3;
      }
      else if($rootScope.isMobile()){
        pInterval = 2;
        sInterval = 3;
        remainder = 1;
      }
      return ( (parseInt(noOfDataPoints/pInterval) > 0) && noOfDataPoints%pInterval > remainder) ? parseInt(noOfDataPoints/sInterval) : ((parseInt(noOfDataPoints/pInterval) > 0)? parseInt(noOfDataPoints/pInterval): 1) ; 
    };
	$scope.init = function() {
		$scope.VisiVest = true;
	    $scope.Monarch = true;
	    $scope.ClinicDashboardDeviceType = searchFilters.allCaps; //By default and when both the checkboxes are selected/unselected devicetype is set to Vest
		$scope.cumulativeStatitics = {};
		$scope.badgestatistics = {};
		$scope.cumulativeStatitics.isMissedTherapyDays = true;
		$scope.cumulativeStatitics.isNoTransmissionRecorded = true;
		$scope.cumulativeStatitics.isSettingDeviation = true;
		$scope.cumulativeStatitics.isHMRNonAdherence = true;
		$scope.hcpId = parseInt(StorageService.get('logged').userId);
		$scope.selectedGraph = 'CUMULATIVE';
		$scope.treatmentGraph = false;
		$scope.cumulativeGraph = true;
		$scope.format = 'weekly';
		$scope.selectedDateOption = 'WEEK';
		$scope.selectedDateOptionBadge = 'YESTERDAY';
		$scope.toTimeStamp = new Date().getTime();
		$scope.treatment = {};
   		$scope.percentStatistics = {};
		$scope.treatment.treatmentPerDay = true;
		$scope.treatment.treatmentLength = true;
		$scope.showTreatmentLegends = false;
		$scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(patientDashboard.maxDaysForWeeklyGraph);
		$scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		$scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.USdateFormat,'/');	
		$scope.badgetoTimeStamp = new Date().getTime();
		$scope.badgefromTimeStamp = new Date().getTime();
		$scope.badgestatistics.date = "";
		$scope.getBadgeDateFormat();
		$scope.prescribeDevice = false;
		$scope.isYesterday = true;
		$scope.statistics = {
			"date":$scope.toDate,
			"patientsWithSettingDeviation":0,
			"patientsWithHmrNonCompliance":0,
			"patientsWithMissedTherapy":0,
			"patientsWithNoEventRecorded":0,
			"totalPatientCount":0
		};
		$scope.clinicStatus = {
      'role':StorageService.get('logged').role,
      'editMode':false,
      'isCreate':false,
      'isMessage':false,
      'message': ''
    }
		if($state.current.name === 'hcpdashboard'){
		  $scope.getClinicsForHCP($scope.hcpId);
		} else if($state.current.name === 'clinicadmindashboard') {
			
			$scope.prescribeDevice = true;
			$scope.getClinicsForClinicAdmin($scope.hcpId);
		}
		else if($state.current.name === 'clinicDashboard' || $state.current.name === 'clinicDashboardAssociate' || $state.current.name === 'clinicDashboardRcadmin' || $state.current.name === 'clinicDashboardCustomerService'){
			$scope.getclinicAdminID($scope.toStateParams.clinicId);
		}
	  
	};

	$scope.setActivePatients = function(clinicId){
	//the visivest/monarch patients number API will come here
	var res = clinicadminService.getActivePatientsCount(clinicId).then(function(response){
	$scope.numberofVisiVestPatients = response.data.VEST;
	    $scope.numberofMonarchPatients = response.data.MONARCH;
	    var onlyActivePatients = true; //to call only active patients but not the getclinicadminid()
	    $scope.getclinicDashboardDataBasedonDevice(onlyActivePatients);
	    /*$scope.totalnumberofActivePatients = $scope.numberofVisiVestPatients + $scope.numberofMonarchPatients;*/	
	}).catch(function(response){
		 notyService.showError(response);
		});
	};
     // for patient list based on device selection starts from here
     $scope.getclinicDashboardDataBasedonDevice = function(onlyActivePatients){
     	if ($scope.VisiVest==true && $scope.Monarch!=true)
     	{
          $scope.ClinicDashboardDeviceType = searchFilters.VisiVest;
          $scope.totalnumberofActivePatients = $scope.numberofVisiVestPatients;
         // alert(searchFilters.VisiVest);
          
     	}
     	else if ($scope.Monarch==true && $scope.VisiVest!=true)
     	{
          $scope.ClinicDashboardDeviceType = searchFilters.Monarch;
          //alert($scope.ClinicDashboardDeviceType);
          $scope.totalnumberofActivePatients = $scope.numberofMonarchPatients;
          
     	}
     	else if ($scope.Monarch==true && $scope.VisiVest==true)
     	{
          $scope.ClinicDashboardDeviceType = searchFilters.allCaps;
          $scope.totalnumberofActivePatients = $scope.numberofVisiVestPatients + $scope.numberofMonarchPatients;
         // alert($scope.ClinicDashboardDeviceType);
          
     	}
     	else if ($scope.Monarch!=true && $scope.VisiVest!=true)
     	{
          $scope.ClinicDashboardDeviceType = searchFilters.allCaps;
          $scope.totalnumberofActivePatients = $scope.numberofVisiVestPatients + $scope.numberofMonarchPatients;
         // alert($scope.ClinicDashboardDeviceType);
          
     	}
     	var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
     	if(!onlyActivePatients){
     				if($state.current.name === 'clinicadmindashboard'){
     	$scope.getClinicsForClinicAdmin($scope.hcpId);
     }
     else if($state.current.name === 'hcpdashboard'){
$scope.getClinicsForHCP($scope.hcpId);
     }
     else{
     	$scope.getclinicAdminID(clinicId);
     }
     	
     }
       };
    // for patient list based on device selection ends from here 
	$scope.getclinicAdminID = function(clinicId){
      clinicService.getClinicAdmins(clinicId).then(function(response){
        $scope.clinicAdmins = response.data.clinicAdmin;
        $scope.getClinicsForClinicAdmin(new Number($scope.clinicAdmins[0].id));
      }).catch(function(response){});
    };

     $scope.switchTab = function(state){
      if($scope.clinicStatus.role === loginConstants.role.acctservices){
        $state.go(state+loginConstants.role.Rcadmin, {
          'clinicId': $stateParams.clinicId
        });
      }else if($scope.clinicStatus.role === loginConstants.role.associates){
        $state.go(state+'Associate', {
          'clinicId': $stateParams.clinicId
        });
      }else if($scope.clinicStatus.role === loginConstants.role.customerservices){
        $state.go(state+'CustomerService', {
          'clinicId': $stateParams.clinicId
        });
      }else{
        $state.go(state, {
          'clinicId': $stateParams.clinicId
        });
      }
    };

	$scope.isLegendEnabled = function(legendFlag){
		var count = $scope.getCountLegends();
    if(count === 1){
    	$scope.disableLegend(legendFlag);
    	notyService.showMessage('At least one parameter should be selected.', 'warning');
    }else{
    	$scope.missedTherapyDaysIsDisabled = false;
    	$scope.noTransmissionRecordedIsDisabled = false;
    	$scope.settingDeviationIsDisabled = false;
    	$scope.hmrNonAdherenceIsDisabled = false;
    	$scope.showCumulativeGraph();
    }
	};

	$scope.disableLegend = function(legendFlag){
		if(legendFlag === "isMissedTherapyDays"){
			$scope.missedTherapyDaysIsDisabled = true;
		}else if(legendFlag === "isNoTransmissionRecorded"){
			$scope.noTransmissionRecordedIsDisabled = true;
		}else if(legendFlag === "isSettingDeviation"){
			$scope.settingDeviationIsDisabled = true;
		}else if(legendFlag === "isHMRNonAdherence"){
			$scope.hmrNonAdherenceIsDisabled = true;
		}
	};

  $scope.getCountLegends = function(){
    var count = 0 ;
    if($scope.cumulativeStatitics.isMissedTherapyDays === true ){
      count++;
    }
    if($scope.cumulativeStatitics.isNoTransmissionRecorded === true ){
      count++;
    }
    if($scope.cumulativeStatitics.isSettingDeviation === true ){
      count++;
    }
    if($scope.cumulativeStatitics.isHMRNonAdherence === true ){
      count++;
    }
    return count;
  };
/****Code commented for date range selection of clinic dashboard badges which has to be taken up in upcoming sprints ****/
	/*$scope.getStatistics = function(clinicId, userId){		
		if($state.current.name === 'hcpdashboard'){
				clinicadminService.getBadgeStatistics(clinicId, userId, $scope.badgefromDate,$scope.badgetoDate).then(function(response){

		  $scope.statistics = response.data.statitics;
		  var todate = $scope.badgestatistics.date = $scope.getYesterday();
		  $scope.badgetoDate = dateService.convertDateToYyyyMmDdFormat(new Date(dateService.convertToTimestamp(todate)));

		  $scope.getPercentageStatistics($scope.statistics);
		}).catch(function(response){
			var todate = $scope.badgestatistics.date = $scope.getYesterday();
		  	$scope.badgetoDate = dateService.convertDateToYyyyMmDdFormat(new Date(dateService.convertToTimestamp(todate))); 
		  notyService.showError(response);
		});
		} else if($state.current.name === 'clinicadmindashboard'){
			$scope.prescribeDevice = true;
		
		  clinicadminService.getBadgeStatistics(clinicId, userId, $scope.badgefromDate,$scope.badgetoDate).then(function(response){

		  $scope.statistics = response.data.statitics;

		 var todate = $scope.badgestatistics.date = $scope.getYesterday();
		  $scope.badgetoDate = dateService.convertDateToYyyyMmDdFormat(new Date(dateService.convertToTimestamp(todate)));

		  $scope.getPercentageStatistics($scope.statistics);
		}).catch(function(response){
		 var todate = $scope.badgestatistics.date = $scope.getYesterday();
		 $scope.badgetoDate = dateService.convertDateToYyyyMmDdFormat(new Date(dateService.convertToTimestamp(todate))); 

		  notyService.showError(response);
		});

		}
		else if($state.current.name === 'clinicDashboard' || $state.current.name === 'clinicDashboardAssociate' || $state.current.name === 'clinicDashboardRcadmin' || $state.current.name === 'clinicDashboardCustomerService'){

		clinicadminService.getBadgeStatistics(clinicId, userId, $scope.badgefromDate,$scope.badgetoDate).then(function(response){
		  
		  $scope.statistics = response.data.statitics;
	
		  var todate = $scope.badgestatistics.date = $scope.getYesterday();
		  $scope.badgetoDate = dateService.convertDateToYyyyMmDdFormat(new Date(dateService.convertToTimestamp(todate)));

		  $scope.getPercentageStatistics($scope.statistics);
		}).catch(function(response){
		 var todate = $scope.badgestatistics.date = $scope.getYesterday();
		 $scope.badgetoDate = dateService.convertDateToYyyyMmDdFormat(new Date(dateService.convertToTimestamp(todate))); 
		  notyService.showError(response);
		});

		}
   };*/
   $scope.getStatistics = function(clinicId, userId){	
   $scope.setActivePatients(clinicId);	
		if($state.current.name === 'hcpdashboard'){
			hcpDashBoardService.getStatistics(clinicId, userId, $scope.ClinicDashboardDeviceType).then(function(response){
				  $scope.statistics = response.data.statitics;
				  $scope.statistics.date = $scope.getYesterday();				  
				  $scope.toDate = dateService.getDateFromTimeStamp(new Date($scope.statistics.date),hcpDashboardConstants.USdateFormat,'/');
				  $scope.getPercentageStatistics($scope.statistics);
				}).catch(function(response){
				  notyService.showError(response);
				});
		} else if($state.current.name === 'clinicadmindashboard'){
			$scope.prescribeDevice = true;
		  clinicadminService.getStatistics(clinicId, userId, $scope.ClinicDashboardDeviceType).then(function(response){
		  $scope.statistics = response.data.statitics;
		  $scope.statistics.date = $scope.getYesterday();
		  $scope.toDate = dateService.getDateFromTimeStamp(new Date($scope.statistics.date),hcpDashboardConstants.USdateFormat,'/');
		  $scope.getPercentageStatistics($scope.statistics);
		}).catch(function(response){
		 $scope.toDate = $scope.statistics.date = $scope.getYesterday();
		  notyService.showError(response);
		});

		}
		else if($state.current.name === 'clinicDashboard' || $state.current.name === 'clinicDashboardAssociate' || $state.current.name === 'clinicDashboardRcadmin' || $state.current.name === 'clinicDashboardCustomerService'){
		  clinicadminService.getStatistics(clinicId, userId, $scope.ClinicDashboardDeviceType).then(function(response){
		  $scope.statistics = response.data.statitics;
		  $scope.statistics.date = $scope.getYesterday();
		  $scope.toDate = dateService.getDateFromTimeStamp(new Date($scope.statistics.date),hcpDashboardConstants.USdateFormat,'/');
		  $scope.getPercentageStatistics($scope.statistics);
		}).catch(function(response){
		 $scope.toDate = $scope.statistics.date = $scope.getYesterday();
		  notyService.showError(response);
		});

		}
   };

	$scope.getPercentageStatistics = function(statistics){
		$scope.percentStatistics.patientsWithMissedTherapy = $scope.calulatePercentage(statistics.patientsWithMissedTherapy, statistics.totalPatientCount);
		$scope.percentStatistics.patientsWithHmrNonCompliance = $scope.calulatePercentage(statistics.patientsWithHmrNonCompliance, statistics.totalPatientCount);
		$scope.percentStatistics.patientsWithSettingDeviation = $scope.calulatePercentage(statistics.patientsWithSettingDeviation, statistics.totalPatientCount);
		$scope.percentStatistics.patientsWithNoEventRecorded = $scope.calulatePercentage(statistics.patientsWithNoEventRecorded, statistics.totalPatientCount);
	};

  $scope.calulatePercentage = function( count, total){
    return Math.floor((count/total)*100);
  };

	$scope.getClinicsForHCP = function(userId) {
		DoctorService.getClinicsAssociatedToHCP(userId).then(function(response){
			$scope.getDashboardForHCPOrPatient(response, userId);
		  }).catch(function(response){
				notyService.showError(response);
		  });
	};
	$scope.getDashboardForHCPOrPatient = function(response, userId){
		if(response.data && response.data.clinics){
			$scope.clinics = $filter('orderBy')(response.data.clinics, "name");
			var isClinic = false;
			if($stateParams.clinicId !== undefined && $stateParams.clinicId !== null){
				isClinic = $scope.selectedClinic = commonsUserService.getSelectedClinicFromList($scope.clinics, $stateParams.clinicId);
			}
			if(!isClinic){
				$scope.selectedClinic = $scope.clinics[0];
			}
		}
			$scope.initCount($scope.selectedClinic.id);
		$scope.weeklyChart();
		if($scope.selectedClinic){
			$scope.getStatistics($scope.selectedClinic.id, userId);
		}else{					
			$scope.badgetoDate = $scope.badgestatistics.date = $scope.getYesterday();
			$scope.getPercentageStatistics($scope.statistics);
		}
		
	};
	$scope.getClinicsForClinicAdmin = function(userId) {
		clinicadminService.getClinicsAssociated(userId).then(function(response){
			$scope.getDashboardForHCPOrPatient(response, userId);
		}).catch(function(response){
		  notyService.showError(response);
		});
	};

	//---HCP PieChart JS =============
	$scope.missedtherapy = {
		animate:{
			duration: hcpDashboardConstants.statistics.duration,
			enabled:true
		},
		barColor: hcpDashboardConstants.statistics.missedTherapy,
		trackColor: hcpDashboardConstants.statistics.color.track,
		scaleColor: hcpDashboardConstants.statistics.scaleColor,
		lineWidth: hcpDashboardConstants.statistics.lineWidth,
		lineCap: hcpDashboardConstants.statistics.lineCap
	};

  $scope.hmr = {
		animate:{
			duration: hcpDashboardConstants.statistics.duration,
			enabled:true
		},
		barColor: hcpDashboardConstants.statistics.nonCompliance,
		trackColor: hcpDashboardConstants.statistics.color.track,
		scaleColor: hcpDashboardConstants.statistics.scaleColor,
		lineWidth: hcpDashboardConstants.statistics.lineWidth,
		lineCap: hcpDashboardConstants.statistics.lineCap
	};

  $scope.deviation = {
		animate:{
			duration: hcpDashboardConstants.statistics.duration,
			enabled:true
		},
		barColor: hcpDashboardConstants.statistics.settingDeviation,
		trackColor: hcpDashboardConstants.statistics.color.track,
		scaleColor: hcpDashboardConstants.statistics.scaleColor,
		lineWidth: hcpDashboardConstants.statistics.lineWidth,
		lineCap: hcpDashboardConstants.statistics.lineCap
	};

  $scope.noevent = {
		animate:{
			duration: hcpDashboardConstants.statistics.duration,
			enabled:true
		},
		barColor: hcpDashboardConstants.statistics.noEvents,
		trackColor: hcpDashboardConstants.statistics.color.track,
		scaleColor: hcpDashboardConstants.statistics.scaleColor,
		lineWidth: hcpDashboardConstants.statistics.lineWidth,
		lineCap: hcpDashboardConstants.statistics.lineCap
	};

  $scope.goToPatientDashboard = function(value){
		var clinicId = ($scope.selectedClinic) ? $scope.selectedClinic.id : $stateParams.clinicId;
		$state.go(value, {'clinicId': clinicId});
  };

	/*Dtate picker js*/
	$scope.opts = {
		maxDate: new Date(),
		format: patientDashboard.dateFormat,
		dateLimit: {"months":patientDashboard.maxDurationInMonths},
		eventHandlers: {
	  'apply.daterangepicker': function(ev, picker) {
			  $scope.calculateDateFromPicker(picker);
			  $scope.drawGraph();
			  $scope.selectedDateOption = '';
			}
		},
		opens: 'left'
	};

		/*Dtate picker js END*/

  $scope.switchClinic = function(clinic){
	if($scope.selectedClinic.id !== clinic.id){
	  $scope.selectedClinic = clinic;
	  $scope.getStatistics($scope.selectedClinic.id, StorageService.get('logged').userId);
	  $scope.drawGraph();
	}
	$state.go('clinicadmindashboard',{'clinicId': $scope.selectedClinic.id});
	$scope.initCount($scope.selectedClinic.id);
  };

	$scope.calculateDateFromPicker = function(picker) {
		$scope.fromTimeStamp = new Date(picker.startDate._d).getTime();
		$scope.toTimeStamp = new Date(picker.endDate._d).getTime();
		$scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		$scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		if ($scope.fromDate === $scope.toDate ) {
			$scope.fromTimeStamp = $scope.toTimeStamp;
		}
	};

	$scope.removeGraph = function() {
		d3.selectAll('svg').selectAll("*").remove();
	};


	$scope.drawGraph = function() {
	var days = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
	if(days <= patientDashboard.maxDaysForWeeklyGraph && days > 0) {
			$scope.weeklyChart($scope.fromTimeStamp);
		} else if ( days > patientDashboard.maxDaysForWeeklyGraph && days <= patientDashboard.minDaysForMonthlyGraph ) {
			$scope.monthlyChart($scope.fromTimeStamp);
		} else if ( days > patientDashboard.minDaysForMonthlyGraph) {
			 $scope.yearlyChart($scope.fromTimeStamp);
		} else if(days === 0) {
			$scope.chooseGraph();
		}
	};

	$scope.dates = {startDate: null, endDate: null};

	$scope.plotNoDataAvailable = function() {		
		$scope.noDataAvailable = true;
	};

	$scope.showCumulativeGraph = function() {
		$scope.selectedGraph = 'CUMULATIVE';
		$scope.treatmentGraph = false;
		$scope.cumulativeGraph = true;
		$scope.getCumulativeGraphData();
	};

	$scope.getCumulativeGraphData = function() {
		$scope.noDataAvailable = false;						
		if($scope.selectedClinic){					
			hcpDashBoardService.getCumulativeGraphPoints($scope.hcpId, $scope.selectedClinic.id, dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.serverDateFormat,'-'), $scope.groupBy, $scope.ClinicDashboardDeviceType).then(function(response){
				$scope.cumulativeChartData = response.data;	
				if($scope.cumulativeChartData && typeof($scope.cumulativeChartData) === "object"){ 
					angular.forEach($scope.cumulativeChartData.xAxis.categories, function(x, key){
		              $scope.cumulativeChartData.xAxis.categories[key] = dateService.convertToTimestamp(x);
		            });
		            angular.forEach($scope.cumulativeChartData.series, function(s, key1){
		            	if($scope.cumulativeChartData.series[key1].name.toLowerCase() === "missed therapy days"){
		            		$scope.cumulativeChartData.series[key1].color = "#ef6548";
		            	}
		            	if($scope.cumulativeChartData.series[key1].name.toLowerCase() === "no transmission recorded"){
		            		$scope.cumulativeChartData.series[key1].color = "#4eb3d3";
		            	}
		            	if($scope.cumulativeChartData.series[key1].name.toLowerCase() === "setting deviation"){
		            		$scope.cumulativeChartData.series[key1].color = "#41ae76";
		            	}
		            	if($scope.cumulativeChartData.series[key1].name.toLowerCase() === "hmr non-adherence"){
		            		$scope.cumulativeChartData.series[key1].color = "#8c6bb1";
		            	}
			            var marker = {};
			            marker.radius = (s.data && s.data.length < 50)? 3 : 2; 
			            angular.forEach(s.data, function(d, key2){
			              var tooltipDateText = $scope.cumulativeChartData.series[key1].data[key2].x ;
			              $scope.cumulativeChartData.series[key1].data[key2].marker = marker;
			              $scope.cumulativeChartData.series[key1].data[key2].x = $scope.cumulativeChartData.xAxis.categories[key2];
			              $scope.cumulativeChartData.series[key1].data[key2].toolText = {};
			              $scope.cumulativeChartData.series[key1].data[key2].toolText.dateText = tooltipDateText;
			              if($scope.cumulativeChartData.series[key1].data[key2].toolText.missedTherapy){
			                $scope.cumulativeChartData.series[key1].data[key2].color = "red";
			              }
			            });            
						setTimeout(function(){	
							$scope.removeAllCharts();						
							$scope.cumulativeChart("cumulativeGraph", $scope.cumulativeChartData);          
						}, 10); 
			          });
				}else{
					$scope.plotNoDataAvailable();
				}
			}).catch(function(response) {					
				$scope.plotNoDataAvailable();
			});							
		}else{
			$scope.plotNoDataAvailable();
		}
	};

	
	$scope.getTreatmentGraphData = function() {
		if($scope.selectedClinic){
			hcpDashBoardService.getTreatmentGraphPoints($scope.hcpId, $scope.selectedClinic.id, dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.serverDateFormat,'-'), $scope.groupBy, $scope.ClinicDashboardDeviceType).then(function(response){			
				$scope.treatmentChartData = response.data;
				if($scope.treatmentChartData && typeof($scope.treatmentChartData) === "object"){ 
					$scope.noDataAvailable = false;
					angular.forEach($scope.treatmentChartData.xAxis.categories, function(x, key){
		              $scope.treatmentChartData.xAxis.categories[key] = dateService.convertToTimestamp(x);
		            });
		            angular.forEach($scope.treatmentChartData.series, function(s, key1){
		            	if($scope.treatmentChartData.series[key1].name.toLowerCase() === "average length of treatment"){
							$scope.treatmentChartData.series[key1].yAxis = 1;
							$scope.secondaryAxisIndex = key1;
							$scope.treatmentChartData.series[key1].color = "#d95900";
		            	}else{
		            		$scope.primaryAxisIndex = key1;
		            		$scope.treatmentChartData.series[key1].color = "#4e95c4";
		            	}
			            var marker = {};
			            marker.radius = (s.data && s.data.length < 50)? 3 : 2; 
			            angular.forEach(s.data, function(d, key2){
			              var tooltipDateText = $scope.treatmentChartData.series[key1].data[key2].x ;
			              $scope.treatmentChartData.series[key1].data[key2].marker = marker;
			              $scope.treatmentChartData.series[key1].data[key2].x = $scope.treatmentChartData.xAxis.categories[key2];
			              $scope.treatmentChartData.series[key1].data[key2].toolText = {};
			              $scope.treatmentChartData.series[key1].data[key2].toolText.dateText = tooltipDateText;
			              if($scope.treatmentChartData.series[key1].data[key2].toolText.missedTherapy){
			                $scope.treatmentChartData.series[key1].data[key2].color = "red";
			              }
			            });            
						setTimeout(function(){
							$scope.removeAllCharts();								
							$scope.treatmentChart("treatmentGraph", $scope.treatmentChartData);          
						}, 10); 
		          });
				}else{					
					$scope.plotNoDataAvailable();
				}
			}).catch(function(response) {				
				$scope.plotNoDataAvailable();
			});
		}else{			
			$scope.plotNoDataAvailable();
		}				
	};

	$scope.calculateTimeDuration = function(durationInDays) {
		$scope.toTimeStamp = new Date().getTime();
		$scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		$scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
		$scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.USdateFormat,'/');
	};

	$scope.chooseGraph = function() {
		if($scope.cumulativeGraph) {
			$scope.getCumulativeGraphData();
		} else if ($scope.treatmentGraph) {
			$scope.getTreatmentGraphData();
		}
	};

	$scope.drawChart = function(datePicker,dateOption,groupByOption,durationInDays) {	
		$scope.selectedDateOption = dateOption;	
		if(datePicker === undefined){
			$scope.calculateTimeDuration(parseInt(durationInDays));
			$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
		}
		$scope.format = $scope.groupBy = groupByOption;
		$scope.chooseGraph();
	};

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

	$scope.showTreatmentGraph = function() {
		$scope.selectedGraph = 'TREATMENT';
		$scope.treatmentGraph = true;
		$scope.cumulativeGraph = false;
		if($scope.fromTimeStamp === $scope.toTimeStamp){
			$scope.calculateTimeDuration(0);
		}
		$scope.getTreatmentGraphData();
	};

	$scope.toolTipContentForTreatment = function(data){
      return function(key, x, y, e, graph) {
        var toolTip = '';
        angular.forEach($scope.serverTreatmentGraphDataForTooltip, function(value) {
          if(value.startTime === e.point.x){
              toolTip =
                '<h6>' + dateService.getDateFromTimeStamp(value.startTime,patientDashboard.dateFormat,'/') + '  ('+ d3.time.format('%I:%M %p')(new Date(value.startTime)) + ')'  + '</h6>' +
                '<ul class="graph_ul">' +
                  '<li><span class="pull-left">' + 'Average Length Of Treatment : ' + '</span><span class="pull-right value">' +  value.avgTreatmentDuration  + '  minutes' + '</span></li>' +
                  '<li><span class="pull-left">' + 'Average Treatments Per Day : ' +'</span><span class="pull-right value">' + value.avgTreatments +'</span></li>' +
                '</ul>';
          }
        });
      return toolTip;
      }
    };
	$scope.getBadgeDateFormat = function(){

		var fromdate = dateService.getDateFromTimeStamp($scope.badgefromTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		var todate = dateService.getDateFromTimeStamp($scope.badgetoTimeStamp,hcpDashboardConstants.USdateFormat,'/');


        $scope.fromdatedisplay = fromdate;
		$scope.todatedisplay = todate;
		//$scope.badgetoTimeStamp = new Date().getTime();
		//$scope.badgefromTimeStamp = dateService.getnDaysBackTimeStamp(patientDashboard.defaultDaysForBadges);
		$scope.badgefromDate = dateService.convertDateToYyyyMmDdFormat(new Date(dateService.convertToTimestamp(fromdate)));
		$scope.badgetoDate = dateService.convertDateToYyyyMmDdFormat(new Date(dateService.convertToTimestamp(todate)));


};
	$scope.getYesterday = function(){
		var d = new Date();	
		return dateService.getDateFromTimeStamp((d.setDate(d.getDate() - 1)),hcpDashboardConstants.USdateFormat,'/');	
	};

	$scope.init();

	$scope.gotoPatients = function(value){
		 	if ($scope.VisiVest==true && $scope.Monarch!=true)
     	{
          value = value+'+VisiVest';
          
     	}
     	else if ($scope.Monarch==true && $scope.VisiVest!=true)
     	{
         value = value+'+Monarch';
     	}
     	else if ($scope.Monarch==true && $scope.VisiVest==true)
     	{
          value = value+'+All';
          
     	}
     	else if ($scope.Monarch!=true && $scope.VisiVest!=true)
     	{
          value = value+'+All';
     	}
		if($state.current.name === 'clinicDashboard'){
			$state.go('clinicAssociatedPatients',{'filter':value, 'clinicId':$scope.selectedClinic.id});
		}
		else if($state.current.name === 'clinicDashboardRcadmin'){
			$state.go('clinicAssociatedPatientsRcadmin',{'filter':value, 'clinicId':$scope.selectedClinic.id});
		}
		else if($state.current.name === 'clinicDashboardAssociate'){
			$state.go('clinicAssociatedPatientsAssociate',{'filter':value, 'clinicId':$scope.selectedClinic.id});
		}else if($state.current.name === 'clinicDashboardCustomerService'){
			$state.go('clinicAssociatedPatientsCustomerService',{'filter':value, 'clinicId':$scope.selectedClinic.id});
		}
		else if($state.current.name === 'hcpdashboard'){
			$state.go('hcppatientdashboard',{'filter':value, 'clinicId':$scope.selectedClinic.id});
		} else if($state.current.name === 'clinicadmindashboard') {
			$state.go('clinicadminpatientdashboard',{'filter':value, 'clinicId':$scope.selectedClinic.id});
		}
  };



	$scope.treatmentChart = function(divId, chartData){
		$scope.drawDualAxisChart(divId, chartData);
	};

	$scope.cumulativeChart = function(divId, chartData){
		$scope.drawLineChart(divId, chartData);
	};

    $scope.drawLineChart = function(divId, chartData){ 
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		}); 
    	divId = (divId)? divId : "cumulativeGraph";
	    var chart = Highcharts.charts[document.getElementById(divId).getAttribute("data-highcharts-chart")]; // get old chart
	    var noOfDataPoints = (chartData && chartData.xAxis.categories)? chartData.xAxis.categories.length: 0;
        var daysInterval = getDaysIntervalInChart(noOfDataPoints);

		// set visibility to be the same as previous chart:
	  	if(chart) {
		    Highcharts.each(chartData.series, function(series, index) {
		      series.visible = Highcharts.pick(chart.series[index].visible, true);
		    });
	 	}          
      $('#'+divId).highcharts({
			credits: {
				enabled: false
			},
          chart: {
              type: 'line',
              zoomType: 'xy',
              backgroundColor:  "#e6f1f4",
              spacingBottom: 100
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
              lineWidth:2,
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
                    text: "No. of Patients",
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
			crosshairs: [{		                
                dashStyle: 'solid',
                color: '#b4e6f6'
            },
            false],
			formatter: function() {
		        var s = '<div style="font-size:12x; font-weight: bold; padding-bottom: 3px;">&nbsp;'+  Highcharts.dateFormat('%m/%d/%Y', this.x) +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';

		        $.each(this.points, function(i, point) {
		            s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ point.series.color +';padding:5px;width:90%;float:left"> ' + point.series.name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> ' 
		            + '<div style="padding:5px;width:5%"><b>' + point.y + '</b></div></div>';
		        });
		        s += '</div>';

		        return s;
		    },
		    hideDelay: 0,
			useHTML: true,				
			shared: true
		},
		plotOptions: {	
	        line: {
                lineWidth: 2,
                softThreshold: false
            },	        	
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
		legend:{
			enabled: true,
			floating: false,
			verticalAlign: "bottom",
			align:"center",
			y: 40
		},          
		series: chartData.series
      });
    };

    $scope.drawDualAxisChart = function(divId, chartData){
    	divId = (divId)? divId : "treatmentGraph";
		    var chart = Highcharts.charts[document.getElementById(divId).getAttribute("data-highcharts-chart")]; // get old chart
		    var noOfDataPoints = (chartData && chartData.xAxis.categories)? chartData.xAxis.categories.length : 0;		    
          	var daysInterval = getDaysIntervalInChart(noOfDataPoints);          
			// set visibility to be the same as previous chart:
		  	if(chart) {
			    Highcharts.each(chartData.series, function(series, index) {
			      series.visible = Highcharts.pick(chart.series[index].visible, true);
			    });
		 	}          
	      $('#'+divId).highcharts({
	      	  credits: {
		        enabled: false
		      },
	          chart: {
	              type: 'line',
	              zoomType: 'xy',
	              backgroundColor:  "#e6f1f4",
              	  spacingBottom: 100
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
			 yAxis: [{ // Primary yAxis
	            labels: {	                
	                style: {
	                      color: '#525151',//chartData.series[$scope.primaryAxisIndex].color,                     
	                      fontWeight: 'bold'
	                  } 
	            },
	            title: {
	                text: "Treatments",
	                style: {
	                  color: '#525151',
                      font: '10px Helvetica',
                      fontWeight: 'bold'
	                }
	            },
	            "minRange": 1,
	            "min": 0,
	            gridLineColor: '#FF0000',
                gridLineWidth: 0,
                lineWidth:2,
                allowDecimals:false
	        }, { // Secondary yAxis
	            title: {
	                text: "Minutes",
	                style: {
	                  color: '#525151',
                      font: '10px Helvetica',
                      fontWeight: 'bold'
	                }
	            },
	            labels: {
	                style: {
                      color: '#525151',//chartData.series[$scope.secondaryAxisIndex].color,                  
                      fontWeight: 'bold'
                  } 
	            },
	            "minRange": 1,
	            "min": 0,
	            gridLineColor: '#FF0000',
                gridLineWidth: 0,
                lineWidth:2,
                allowDecimals:false,
	            opposite: true
	        }],
			tooltip: {	
				backgroundColor: "rgba(255,255,255,1)",  				
				crosshairs: [{		                
	                dashStyle: 'solid',
	                color: '#b4e6f6'
	            },
	            false],
				formatter: function() {
			        var s = '<div style="font-size:12x; font-weight: bold; padding-bottom: 3px;">&nbsp;'+  Highcharts.dateFormat('%m/%d/%Y', this.x) +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';

			        $.each(this.points, function(i, point) {
			            s += '<div style="font-size:10px; font-weight: bold; width="100%"><div style="color:'+ point.series.color +';padding:5px;width:85%;float:left"> ' + point.series.name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> ' 
			            + '<div style="padding:5px;width:5%"><b>' + point.y + '</b></div></div>';
			        });
			        s += '</div>';

			        return s;
			    },
			    hideDelay: 0,
				useHTML: true,				
				shared: true
			},
			plotOptions: {	
		        line: {
	                lineWidth: 1,
	                softThreshold: false
	            },	        	
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
			legend:{
				enabled: true,
				floating: true,
				verticalAlign: "bottom",
				align:"center",
				y: 40
			},          
			series: chartData.series
	      });
    };

    $scope.downloadChartsAsPdf = function(){
    	if($scope.cumulativeGraph){
    		exportutilService.exportHCPCharts("cumulativeGraph", null, "hcpCharts", $scope.fromDate, $scope.toDate);
    	}else if($scope.treatmentGraph){
    		exportutilService.exportHCPCharts(null, "treatmentGraph", "hcpCharts", $scope.fromDate, $scope.toDate);
    	}
    	
    };

    $scope.removeAllCharts = function(){
      $("#cumulativeGraph").empty();
      $("#treatmentGraph").empty();      
    };
    	$scope.badgeopts = {
		maxDate: new Date(),
		format: patientDashboard.dateFormat,
		dateLimit: {"months":patientDashboard.maxDurationInMonths},
		eventHandlers: {
	  'apply.daterangepicker': function(ev, picker) {
	  	$scope.isYesterday = false;
			  $scope.calculateBadgeDateFromPicker(picker);
		$scope.getStatistics($scope.selectedClinic.id, StorageService.get('logged').userId);
			   $scope.selectedDateOptionBadge = 'CUSTOM';
			}
		},
		opens: 'left'
	};
    	// Week badge data
	$scope.weekBadge = function(datePicker) {
		$scope.isYesterday = false;
		$scope.badgeData(datePicker,'WEEK',6);
	};

	// Year badge data
	$scope.yearBadge = function(datePicker) {
		$scope.isYesterday = false;
		$scope.badgeData(datePicker,'YEAR',365);
	};

	// Month badge data
	$scope.monthBadge = function(datePicker) {
		$scope.isYesterday = false;
		$scope.badgeData(datePicker,'MONTH',30);
	};
	//yesterday badge data
	$scope.yesterdayBadge = function(datePicker) {
		$scope.isYesterday = true; 
		$scope.badgeData(datePicker,'YESTERDAY',0);
	};
		$scope.calculateTimeDurationBadge = function(durationInDays) {
		$scope.badgetoTimeStamp = new Date().getTime();
		//$scope.badgetoDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		$scope.badgefromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
		//$scope.badgefromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		$scope.getBadgeDateFormat();
	};
		$scope.calculateBadgeDateFromPicker = function(picker) {
		$scope.badgefromTimeStamp = new Date(picker.startDate._d).getTime();
		$scope.badgetoTimeStamp = new Date(picker.endDate._d).getTime();
		//$scope.badgefromDate = dateService.getDateFromTimeStamp($scope.badgefromTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		//$scope.badgetoDate = dateService.getDateFromTimeStamp($scope.badgetoTimeStamp,hcpDashboardConstants.USdateFormat,'/');
		$scope.getBadgeDateFormat();
		if ($scope.badgefromDate === $scope.badgetoDate ) {
			$scope.badgefromTimeStamp = $scope.badgetoTimeStamp;
		}
	};
    $scope.badgeData = function(datePicker,dateOption,durationInDays) {	
		$scope.selectedDateOptionBadge = dateOption;	
		if(datePicker === undefined){
			$scope.calculateTimeDurationBadge(parseInt(durationInDays));
			if(dateOption === 'YESTERDAY'){
			$scope.badgefromDate = $scope.badgetoDate;
		}
			$scope.badgedates = {startDate: $scope.badgefromDate, endDate: $scope.badgetoDate};
		}
		$scope.getStatistics($scope.selectedClinic.id, StorageService.get('logged').userId);
	};


}]);

