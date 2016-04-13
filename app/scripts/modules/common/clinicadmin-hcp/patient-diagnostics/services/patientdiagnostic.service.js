'use strict';

angular.module('hillromvestApp')
.factory('patientDiagnosticService', ['$http', 'headerService', 'URL', function ($http, headerService, URL) {
	return {
	  getTestResultsByPatientId : function(patientID){
      var url = URL.getTestResultByPatientId.replace('PATIENTID', patientID);
      return $http.get(url, {
        headers: headerService.getHeader()
      }).success(function (response) {
        return response;
      });
    },

    addTestResult : function(patientID, data){
      console.log('DATA :: ', data)
    	var url = URL.getTestResultByPatientId.replace('PATIENTID', patientID);
      return $http.post(url, data, {
        headers: headerService.getHeader()
      }).success(function(response) {
        return response;
      });
    }
	};
}]);