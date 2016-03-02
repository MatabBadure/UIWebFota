'use strict';
angular.module('hillromvestApp')
.controller('patientSurveyController',['$scope', '$state', 'patientsurveyService', '$stateParams', 'StorageService', '$rootScope', 'notyService', 'patientService', 'dateService', 'surveyConstants',
	function($scope, $state, patientsurveyService, $stateParams, StorageService, $rootScope, notyService, patientService, dateService, surveyConstants) {
		var logged = StorageService.get('logged') || {};
		$scope.initPatientSurvey = function(){
			$rootScope.surveyId = null;	
			if(logged && logged.patientID){
				patientService.getPatientInfo(logged.patientID).then(function(response){
					$scope.patient = response.data;

					patientsurveyService.getSurvey($stateParams.surveyId).then(function(response){						
						if(response.status === 200){
							$scope.survey = response.data;	
							$scope.isPhoneNumber = true;						
							angular.forEach($scope.survey.questions, function(question, key){
								var questionText = $scope.survey.questions[key].questionText;
								if(questionText.toLowerCase().indexOf(surveyConstants.questions.patient_name.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = $scope.patient.firstName + surveyConstants.questions.space + $scope.patient.lastName;
								}
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.patient_phone_number.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = ($scope.patient.mobilePhone)?  ($scope.patient.mobilePhone) : ($scope.patient.primaryPhone? $scope.patient.primaryPhone: null);
									if(!$scope.survey.questions[key].answerValue1){
										$scope.isPhoneNumber = false;
									}
								}
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.hours_of_use.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = $scope.patient.hoursOfUsage;
								}
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.serial_number.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = $scope.patient.serialNumber;									
								}
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.patient_dob.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = $scope.patient.dob;
								}
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.survey_date.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = dateService.getDateFromTimeStamp(new Date().getTime(),patientDashboard.dateFormat,'/');
								}
								else if($scope.survey.questions[key].answers && $scope.survey.questions[key].answers.length > 0){
									$scope.survey.questions[key].answerValue1 = $scope.survey.questions[key].answers[0];
								}							
							});
						}else{
							$scope.survey = null;
						}
					});		
				}).catch(function(response){
					 notyService.showError(response);
					$state.go("patientdashboard");
				});
			}										
		};

		$scope.showCancelSurveyPopup = function(){
			$scope.showSurveyCancelModal = true;
		};
	
		$scope.cancelSurvey = function(){
			$state.go("patientdashboard");
		};

		$scope.saveSurvey = function(){
			$scope.submitted = true;
			if(logged.patientID){
				var surveyEdited = {};
				surveyEdited.surveyId = $scope.survey.surveyId;
				surveyEdited.userId = logged.patientID;
				surveyEdited.userSurveyAnswer = [];
				angular.forEach($scope.survey.questions, function(question, key){
					var surveyAnswer = {};
					surveyAnswer.surveyQuestion = {};
					surveyAnswer.surveyQuestion.id = question.id;
					surveyAnswer.surveyQuestion.questionText = question.questionText;					
					surveyEdited.userSurveyAnswer[key] = surveyAnswer;
					if(($scope.survey.questions[key].answerValue1 && $scope.survey.questions[key].answerValue1.length > 0) || $scope.survey.questions[key].answerValue1 === 0 ){
						surveyEdited.userSurveyAnswer[key].answerValue1 = $scope.survey.questions[key].answerValue1;
              		}
              		if($scope.survey.questions[key].answerValue2 && $scope.survey.questions[key].answerValue2.length > 0){
						surveyEdited.userSurveyAnswer[key].answerValue1 = $scope.survey.questions[key].answerValue2;
              		}
              		if($scope.survey.questions[key].answerValue3 && $scope.survey.questions[key].answerValue3.length > 0){
						surveyEdited.userSurveyAnswer[key].answerValue1 = $scope.survey.questions[key].answerValue3;
              		}  

              		if($scope.survey.questions[key].typeCodeFormat.type_code === "Checkbox"){
              			if(!$scope.survey.questions[key].answerValue1){
              				surveyEdited.userSurveyAnswer[key].answerValue1 =  "No";
              			}else{
              				surveyEdited.userSurveyAnswer[key].answerValue1 =  "Yes";
              			}              		
              		}
              		
				});
				if($scope.surveyForm.$invalid){
					return false;
				}else{
					patientsurveyService.saveSuvey(surveyEdited).then(function(){
						notyService.showMessage("Survey taken successfully.",'success' );
						$state.go("patientdashboard");
					}).catch(function(response){
						 notyService.showError(response);
						$state.go("patientdashboard");
					});		
				}
						
			}else{
				$state.go("login");
			}
			
		};
		$scope.init = function(){
			if($state.current.name === 'patientSurvey'){				
				$scope.initPatientSurvey();
			}
		};
		$scope.init();
	}]);
