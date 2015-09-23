'use strict';

angular.module('hillromvestApp')
  .factory('hcpPatientService',['$http', 'headerService', 'URL', function ($http, headerService, URL) {
    return {
    	getAssociatedPatientsByFilter : function(filter, clinicId, userId){
        var url = URL.getAssociatedPatientsByFilter.replace('USERID',userId).replace('CLINICID',clinicId).replace('FILTER',filter);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },

      getAssociatedPatientsWithNoEvents : function(filter, clinicId, userId){
        var url = URL.getAssociatedPatientsWithNoEvents.replace('USERID', userId).replace('CLINICID', clinicId).replace('FILTER', filter);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      }
    };
}]);