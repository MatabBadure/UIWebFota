'use strict';

angular.module('hillromvestApp')
.factory('patientDiagnosticService', ['$http', 'headerService', 'URL', function ($http, headerService, URL) {
	return {
	  getTestResultsByPatientId : function(patientID, from, to){
      var url = URL.getTestResultByPatientId.replace('PATIENTID', patientID).replace('FROM_DATE', from).replace('TO_DATE', to);
      return $http.get(url, {
        headers: headerService.getHeader()
      }).success(function (response) {
        return response;
      });
    },

    addTestResult : function(patientID, data){      
    	var url = URL.testResult.replace('PATIENTID', patientID);
      return $http.post(url, data, {
        headers: headerService.getHeader()
      }).success(function(response) {
        return response;
      });
    },

    getTestResultById : function(id){      
      var url = URL.getTestResultById.replace('ID', id);
      return $http.get(url, {
        headers: headerService.getHeader()
      }).success(function (response) {
        return response;
      });
    },

    updateTestResult: function(patientID, data){      
      var url = URL.getTestResultById.replace('ID', patientID);
      return $http.put(url, data, {
        headers: headerService.getHeader()
      }).success(function(response) {
        return response;
      });
    },

    addTestResultByClinicadminHCP: function(patientID, userId, data){
      var url = URL.addTestResultByClinicadminHCP.replace('PATIENTID', patientID).replace('USERID', userId);
      return $http.post(url, data, {
        headers: headerService.getHeader()
      }).success(function(response) {
        return response;
      });
    }
	};
}]);