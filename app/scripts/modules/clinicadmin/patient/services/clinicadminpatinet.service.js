'use strict';

angular.module('hillromvestApp')
  .factory('clinicadminPatientService',['$http', 'headerService', 'URL', function ($http, headerService, URL) {
    return {
    	getAssociatedPatientsByFilter : function(filter, clinicId, userId){
        var url = URL.getAssociatedPatientsByFilter.replace('USERID',userId).replace('CLINICID',clinicId).replace('FILTER',filter);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },

      getAssociatedPatientsWithNoEvents : function(filter, clinicId, userId){
        var url = URL.getAssociatedPatientsWithNoEvents.replace('USERID', userId).replace('CLINICID', clinicId).replace('FILTER', filter);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      }


    };
}]);