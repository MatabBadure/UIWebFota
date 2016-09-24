'use strict';

angular.module('hillromvestApp')
  .factory('hcpPatientService',['$http', 'headerService', 'URL', function ($http, headerService, URL) {
    return {
    	getAssociatedPatientsByFilter : function(filter, clinicId, userId, pageNo, offset){
        var url = URL.getAssociatedPatientsByFilter.replace('USERID',userId).replace('CLINICID',clinicId).replace('FILTER',filter).replace('PAGENO', pageNo).replace('OFFSET', offset);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },

      getAssociatedPatientsWithNoEvents : function(filter, clinicId, userId, pageNo, offset){
        var url = URL.getAssociatedPatientsWithNoEvents.replace('USERID', userId).replace('CLINICID', clinicId).replace('FILTER', filter).replace('PAGENO', pageNo).replace('OFFSET', offset);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },
      updatePatientNotes :  function(notes) {
        var url  = URL.addPatientNotes;
        return $http.post(url, notes, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
    };
}]);