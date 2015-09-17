'use strict';

angular.module('hillromvestApp')
  .factory('hcpDashboardService',['$http', 'headerService', function ($http, headerService) {
    return {
      getPatientsDetails : function(){
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },

      getStatistics: function(clinicId, userId){
        var url = '/api/users/'+userId+'/clinics/'+clinicId+'/statistics'
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      }
    };
}]);