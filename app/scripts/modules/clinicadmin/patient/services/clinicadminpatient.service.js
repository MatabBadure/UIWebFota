'use strict';

angular.module('hillromvestApp')
  .factory('clinicadminPatientService',['$http', 'headerService', 'URL', function ($http, headerService, URL) {
    return {
    	getAssociatedPatientsByFilter : function(filter, clinicId, userId, pageNo, offset){
        var url = URL.getAssociatedPatientsByFilter.replace('USERID',userId).replace('CLINICID',clinicId).replace('FILTER',filter).replace('PAGENO', pageNo).replace('OFFSET', offset);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },

      getAssociatedPatientsWithNoEvents : function(filter, clinicId, userId, pageNo, offset){
        var url = URL.getAssociatedPatientsWithNoEvents.replace('USERID', userId).replace('CLINICID', clinicId).replace('FILTER', filter).replace('PAGENO', pageNo).replace('OFFSET', offset);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },


      getPatientInfo : function(patientId, clinicId,userID){
        var url = URL.getPatientInfoWithMRN.replace('PATIENTID', patientId).replace('CLINICID', clinicId).replace('USERID',userID);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },

      getAssociatedHCPOfPatientClinic : function(patientId, clinicId){
        var url = URL.getAssociatedHCP.replace('PATIENTID', patientId).replace('CLINICID', clinicId);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      }
    };
}]);