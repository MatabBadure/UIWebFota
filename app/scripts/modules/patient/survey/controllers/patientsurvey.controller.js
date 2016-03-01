'use strict';
angular.module('hillromvestApp')
.controller('patientSurveyController',['$scope', '$state', 'patientsurveyService', '$stateParams', 'StorageService', '$rootScope',
	function($scope, $state, patientsurveyService, $stateParams, StorageService, $rootScope) {
		$scope.initPatientSurvey = function(){
				$rootScope.surveyId = null;				
				patientsurveyService.getSurvey($stateParams.surveyId).then(function(response){
					//console.log("survey response : ", response);
					if(response.status === 200){
						$scope.survey = response.data;
					}else{
						$scope.survey = null;
					}
					
				});			
		};

		$scope.showCancelSurveyPopup = function(){
			$scope.showSurveyCancelModal = true;
		};
	
		$scope.cancelSurvey = function(){
			$state.go("patientdashboard");
		};

		$scope.saveSurvey = function(){
			//console.log("edited survey : ", $scope.survey);
		};
		$scope.init = function(){
			if($state.current.name === 'patientSurvey'){
				//console.log("It is survey page for patients : patient id : ", parseInt(StorageService.get('logged').patientID));
				$scope.initPatientSurvey();
			}
		};
		$scope.init();
	}]);
