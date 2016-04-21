'use strict';
angular.module('hillromvestApp')
.controller('patientSurveyController',['$scope', '$state', 'patientsurveyService', '$stateParams', 'StorageService', '$rootScope', 'notyService', 'patientService', 'dateService', 'surveyConstants', 'addressService', '$timeout',
	function($scope, $state, patientsurveyService, $stateParams, StorageService, $rootScope, notyService, patientService, dateService, surveyConstants, addressService, $timeout) {
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
							$scope.isMainPhoneNumber = true;
							$scope.isSecondaryNumber =true;	
							$scope.isAddress = true;
							$scope.isCity = true;
							$scope.isZipcode = true;
							$scope.isState = true;
							$scope.isEmail = true;

							angular.forEach($scope.survey.questions, function(question, key){ 
								var questionText = $scope.survey.questions[key].questionText;								
								if((questionText.toLowerCase().indexOf(surveyConstants.questions.email_address.toLowerCase())) !== -1){									
									$scope.survey.questions[key].answerValue1 = $scope.patient.email? $scope.patient.email : null;
									if(!$scope.survey.questions[key].answerValue1){
										$scope.isEmail = false;
									}
								}
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.patient_name.toLowerCase()) !== -1){
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
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.main_phone_number.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = $scope.patient.mobilePhone? $scope.patient.mobilePhone : null;
									if(!$scope.survey.questions[key].answerValue1){
										$scope.isMainPhoneNumber = false;
									}
								}
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.secondary_phone_number.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = $scope.patient.primaryPhone? $scope.patient.primaryPhone : null;
									if(!$scope.survey.questions[key].answerValue1){
										$scope.isSecondaryNumber = false;
									}
								}
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.address.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = $scope.patient.address? $scope.patient.address : null;
									if(!$scope.survey.questions[key].answerValue1){
										$scope.isAddress = false;
									}
								}
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.city.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = $scope.patient.city? $scope.patient.city : null;
									if(!$scope.survey.questions[key].answerValue1){
										$scope.isCity = false;
									}
								}
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.zipcode.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = $scope.patient.zipcode? $scope.patient.zipcode : null;
									if(!$scope.survey.questions[key].answerValue1){
										$scope.isZipcode = false;
									}
								}
								else if(questionText.toLowerCase().indexOf(surveyConstants.questions.state.toLowerCase()) !== -1){
									$scope.survey.questions[key].answerValue1 = $scope.patient.state? $scope.patient.state : null;
									if(!$scope.survey.questions[key].answerValue1){
										$scope.isState = false;
									}
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

		$rootScope.showCancelSurveyPopup = function(){
			$rootScope.showSurveyCancelModal = true;
			$rootScope.isSurveyCancelled = false;
		};
	
		$rootScope.cancelSurvey = function(){
		    $rootScope.isSurveyCancelled = true;
		    $rootScope.showSurveyCancelModal = false;
			$state.go("patientdashboard");
		};

		$rootScope.cancelConfirm = function(){
			$rootScope.showSurveyCancelModal = false;			
		};
	

		$scope.saveSurvey = function(){
			$rootScope.isSurveyCancelled = true;
		    $rootScope.showSurveyCancelModal = false;
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

					if(($scope.survey.questions[key].answerValue1 && ($scope.survey.questions[key].answerValue1).toString().length > 0) || $scope.survey.questions[key].answerValue1 === 0 ){
						surveyEdited.userSurveyAnswer[key].answerValue1 = $scope.survey.questions[key].answerValue1;
              		}
              		if($scope.survey.questions[key].answerValue2 && ($scope.survey.questions[key].answerValue2).toString().length > 0){
						surveyEdited.userSurveyAnswer[key].answerValue2 = $scope.survey.questions[key].answerValue2;
              		}
              		if($scope.survey.questions[key].answerValue3 && ($scope.survey.questions[key].answerValue3).toString().length > 0){
						surveyEdited.userSurveyAnswer[key].answerValue3 = $scope.survey.questions[key].answerValue3;
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
					$rootScope.isSurveyCancelled = false;
		    		$rootScope.showSurveyCancelModal = false;
		    		$timeout(function() {
		    			angular.element('input.ng-invalid').first().focus();
		    		});
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
		$scope.getCityState = function(zipcode){
		  delete $scope.serviceError;
          $scope.isServiceError = false;             
          if(zipcode){
            addressService.getCityStateByZip(zipcode).then(function(response){
              $scope.survey.questions[5].answerValue1= response.data[0].city;
              $scope.survey.questions[6].answerValue1 = response.data[0].state;
            }).catch(function(response){
              $scope.patient.state = null;
              $scope.patient.city = null;
              $scope.serviceError = response.data.ERROR;
              $scope.isServiceError = true;
            });  
          }else{
            delete $scope.survey.questions[5].answerValue1;
            delete $scope.survey.questions[6].answerValue1;
            	if($scope.surveyForm.zipcode.$dirty && $scope.surveyForm.zipcode.$showValidationMessage && $scope.surveyForm.zipcode.$invalid){
            }else{
              $scope.serviceError = 'Invalid Zipcode';  
              $scope.isServiceError = true;
            }
          }
        };

		$scope.init = function(){
			$rootScope.isSurveyCancelled = false;
		    $rootScope.showSurveyCancelModal = false;
			if($state.current.name === 'patientSurvey'){				
				$scope.initPatientSurvey();
			}
		};
		$scope.init();
	}]);
