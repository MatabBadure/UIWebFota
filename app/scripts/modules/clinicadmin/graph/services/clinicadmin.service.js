'use strict';

angular.module('hillromvestApp')
  .factory('clinicadminService',['$http', 'headerService', 'URL', function ($http, headerService, URL) {
    return {
      getStatistics: function(clinicId, userId){
        var url = URL.getStatistics.replace('USERID', userId).replace('CLINICID', clinicId);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },
      getClinicsAssociated: function(userId){
        var url = URL.getClinicsAssociatedToCliniadmin.replace('USERID', userId);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      }
    };
}]);