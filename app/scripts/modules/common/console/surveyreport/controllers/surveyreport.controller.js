'use strict';
angular.module('hillromvestApp')
.controller('surveyReportController',['$scope', '$state', 'patientsurveyService', 'dateService',
	function($scope, $state, patientsurveyService, dateService) {
		$scope.init = function(){
			if($state.current.name === 'adminSurveyReport' || $state.current.name === 'rcddminSurveyReport' || $state.current.name === 'associateSurveyReport'){
				$scope.switchSurvey(1);
			}
		};

		$scope.getSurveyReport = function(type, fromDate, toDate){
			patientsurveyService.getSurveyGridReport(type, fromDate, toDate).then(function(response){
				console.log(response.data.surveyGridView);
				$scope.count = response.data.count;
				$scope.surveyGridView = response.data.surveyGridView;
			}).catch(function(response){
				console.log(response);
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

		$scope.init();
	}]);
