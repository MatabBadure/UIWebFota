'use strict';
angular.module('hillromvestApp')
.controller('surveyReportController',['$scope', '$state', 'patientsurveyService', 'dateService', '$timeout', 'notyService',
	function($scope, $state, patientsurveyService, dateService, $timeout, notyService) {
		
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

		$scope.opts = {
			maxDate: new Date(),
			format: patientDashboard.dateFormat,
			eventHandlers: {'apply.daterangepicker': function(ev, picker) {  
					$scope.calculateDateFromPicker(picker);     				
					$scope.customDateRangeView();
				},
				'click.daterangepicker': function(ev, picker) {
					$("#dp1cal").data('daterangepicker').setStartDate($scope.fromDate);
					$("#dp1cal").data('daterangepicker').setEndDate($scope.toDate);
				}
			},
			opens: 'left'
		}

		$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};

		$scope.customDateRangeView = function(){
			$scope.getSurveyReport($scope.surveyType, $scope.serverFromDate, $scope.serverToDate);
		};
		
		$scope.init = function(){
			if($state.current.name === 'adminSurveyReport' || $state.current.name === 'rcddminSurveyReport' || $state.current.name === 'associateSurveyReport'){
				$scope.switchSurvey(1);
			}
		};

		$scope.getSurveyReport = function(type, fromDate, toDate){
			patientsurveyService.getSurveyGridReport(type, fromDate, toDate).then(function(response){
				$scope.count = response.data.count;
				$scope.surveyGridView = response.data.surveyGridView;
			}).catch(function(response){
				notyService.showError(response);
			});
		};

		$scope.switchSurvey = function(type){
			$scope.surveyType = type;
			switch(type){
				case 1: 
					var fromDate = dateService.getDateFromTimeStamp(new Date(),patientDashboard.serverDateFormat,'-');
					$scope.getSurveyReport(type, fromDate, fromDate);
				break;

				case 2:
					var fromDate = dateService.getDateFromTimeStamp(new Date(),patientDashboard.serverDateFormat,'-');
					$scope.getSurveyReport(type, fromDate, fromDate);
				break;

				case 3:
					var fromDate = dateService.getDateFromTimeStamp(new Date(),patientDashboard.serverDateFormat,'-');
					$scope.getSurveyReport(type, fromDate, fromDate);
				break;
				default:
				break;
			}
		};

		$scope.showComments = function(survey){
			$scope.selectedSurvey = survey;
			patientsurveyService.getSurveyComments(survey.id).then(function(response){
				$scope.showCommentModal = true;
			}).catch(function(response){
				notyService.showError(response);
			});
			$scope.showCommentModal = true;
		};

		$scope.hideComments = function(){
			$scope.showCommentModal = false;
		};

		$scope.init();
	}]);
