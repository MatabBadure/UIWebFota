'use strict';

angular.module('hillromvestApp')
  .factory('hcpPatientService',['$http', 'headerService', function ($http, headerService) {
    return {
    	getAssociatedPatientsByFilter : function(filter, clinicId, userId){
        var url = '/api/users/'+userId+'/clinics/'+clinicId+'/patients?filterBy='+filter
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },

      getAssociatedPatientsWithNoEvents : function(filter, clinicId, userId){
        var url = '/api/users/'+userId+'/clinics/'+clinicId+'/patients/'+filter
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      }


    };
}]);