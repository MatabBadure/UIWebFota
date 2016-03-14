'use strict';
angular.module('hillromvestApp')
.controller('benchmarkingController', ['$scope', 'addressService', 'notyService', '$rootScope', 'benchmarkingService', 'dateService',
	function($scope, addressService, notyService, $rootScope, benchmarkingService, dateService) {

		$scope.calculateDateFromPicker = function(picker) {
	    $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();	      
		  $scope.toTimeStamp = (new Date().getTime() < new Date(picker.endDate._d).getTime())? new Date().getTime() : new Date(picker.endDate._d).getTime();
	    $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
	    $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');

	    $scope.serverFromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-');
	    $scope.serverToDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-');
	    if ($scope.fromDate === $scope.toDate ) {
	      $scope.fromTimeStamp = $scope.toTimeStamp;
	    }	      
	  };

	  $scope.calculateTimeDuration = function(durationInDays) {
      $scope.toTimeStamp = new Date().getTime();
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.serverFromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-');
	    $scope.serverToDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-');
    };

		$scope.opts = {
			maxDate: new Date(),
			format: patientDashboard.dateFormat,
			eventHandlers: {'apply.daterangepicker': function(ev, picker) {  
					$scope.calculateDateFromPicker(picker);     				
					$scope.customDateRangeView();
				},
				'click.daterangepicker': function(ev, picker) {
					$("#dp2cal").data('daterangepicker').setStartDate($scope.fromDate);
					$("#dp2cal").data('daterangepicker').setEndDate($scope.toDate);
				}
			},
			opens: 'left'
		}

		$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};

		$scope.customDateRangeView = function(){
			console.log('It comes here....!', $scope.serverFromDate, $scope.serverToDate);
		};
		
		$scope.init = function(){
			$scope.calculateTimeDuration(5);

			$scope.xaxis = 'ageGroup';
			$scope.yaxis = 'adherenceScore';
			addressService.getAllStates().then(function(response){
				$scope.processStates(response.data);
			}).catch(function(response){
				notyService.showError(response);
			});
			// $scope.states = [ {name: 'one', 'true': true}, {name: 'two', 'true': true}, {name: 'three', 'true': true}, {name: 'four', 'true': true}];

			$scope.ageGroups = [
				{ ageRange: '0-5', 'true': true }, 
				{ ageRange: '6-10', 'true': true }, 
				{ ageRange: '11-15',  'true': true }, 
				{ ageRange: '16-20',  'true': true}, 
				{ ageRange: '21-25', 'true': true}, 
				{ ageRange: '26-30', 'true': true}, 
				{ ageRange: '30-35', 'true': true}, 
				{ ageRange: '35-40', 'true': true}, 
				{	ageRange: '41-45', 'true': true}, 
				{	ageRange: '46-50', 'true': true}, 
				{	ageRange: '51-55', 'true': true}, 
				{	ageRange: '56-60', 'true': true},
				{	ageRange: '61-65', 'true': true},
				{	ageRange: '66-70', 'true': true},
				{	ageRange: '71-75', 'true': true},
				{	ageRange: '76-80', 'true': true},
				{	ageRange: '81-above', 'true': true}
			];

			$scope.clinicSizes = [
				{ size: '1-25', 'true': true},
				{ size: '26-50', 'true': true},
				{ size: '51-75', 'true': true},
				{ size: '76-100', 'true': true},
				{ size: '101-150', 'true': true},
				{ size: '151-200', 'true': true},
				{ size: '201-250', 'true': true},
				{ size: '251-300', 'true': true},
				{ size: '301-350', 'true': true},
				{ size: '351-400', 'true': true},
				{ size: '401-above', 'true': true}
			];

			$scope.isAgeGroup = true;
			$scope.localLang = {
				selectAll       : "Tick all",
				selectNone      : "Tick none",
		    search          : "Type here to search...",
		    nothingSelected : "Nothing is selected",
		    allSelected : "All Selected"
			}
		};

		$scope.processStates = function(states){
			$scope.states = [];
			angular.forEach(states, function(state){
				var obj = {
					'name': state,
					'ticked': true
				};
				$scope.states.push(obj);
			});
		};

		$scope.init();

		$scope.onOpen = function(){
			console.log('On open called...!');
		};

		$scope.onClose = function(){
			console.log('On close called...!', $scope.selectedStates, $scope.selectedStates.length);
			if($scope.selectedStates.length === 1){
				$scope.state = $scope.selectedStates[0].name
				console.log($scope.state);
			}
		};

		$scope.onXaxisChange = function(){
			console.log('onXaxisChange...!', $scope.xaxis);
			$scope.isAgeGroup = $scope.isAgeGroup ? false: true;
			console.log($scope.isAgeGroup);
		};

		$scope.onYaxisChange = function(){
			console.log($scope.yaxis);
		};

		$scope.onAgeGroupClose =function(){
			console.log($scope.selectedAges);
			$scope.age = $scope.selectedAges[0].ageRange
			$scope.getBenchmarkingReport($scope.serverFromDate, $scope.serverToDate, $scope.xaxis, $scope.yaxis);
		};

		$scope.onClinicRangeClose = function(){
			console.log($scope.selectedClinicSizes);
		};

		$scope.getBenchmarkingReport = function(fromDate, toDate, XAxis, YAxis, type, benchmarkType, country, state, city,  range){
			console.log(fromDate, toDate, XAxis, YAxis);
			// benchmarkingService.getBenchmarkingReport(fromDate, toDate, type, benchmarkType, country, state, city, YAxis, XAxis, range).then(function(response){

			// }).catch(function(response){

			// });
		};

	}]);