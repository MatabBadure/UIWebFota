'use strict';
/**
 * @ngdoc service
 * @name patientsurveyService
 * @description
 *
 */
angular.module('hillromvestApp')
  .factory('patientsurveyService',['$http','headerService','URL', function ($http, headerService, URL) {
    return {

      /**
      * @ngdoc method
      * @name getPatients
      * @description To get array of patients for a caregiver.
      *
      */
      isSurvey: function(patientId) {
        var url = URL.isSurvey.replace('USER_ID', patientId);
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      getSurvey: function(surveyId) {
        var url = URL.getSurvey.replace('SURVEY_ID', surveyId);
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      saveSuvey: function(survey) {
        var url = URL.saveSuvey;
        return $http.post(url, survey, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      getSurveyGridReport: function(surveyId, fromDate, toDate) {
        var url = URL.getSurveyGridReport.replace('SURVEY_ID', surveyId).replace('FROM_DATE', fromDate).replace('TO_DATE', toDate);
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getSurveyComments: function(questionId, fromDate, toDate){
        var url = URL.getSurveycomments.replace('QUESTIONID', questionId).replace('FROM_DATE', fromDate).replace('TO_DATE', toDate);
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getGraphSurveyGridReport: function(surveyId, fromDate, toDate){
        var url = URL.getGraphSurveyGridReport.replace('SURVEY_ID', surveyId).replace('FROM_DATE', fromDate).replace('TO_DATE', toDate);
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
    };
  }]);