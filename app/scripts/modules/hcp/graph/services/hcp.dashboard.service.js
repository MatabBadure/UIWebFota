'use strict';

angular.module('hillromvestApp')
  .factory('hcpDashboardService',['$http', 'headerService', 'URL', function ($http, headerService, URL) {
    return {
      getStatistics: function(clinicId, userId){
        var url = URL.getStatistics.replace('USERID', userId).replace('CLINICID', clinicId);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      }
    };
}]);