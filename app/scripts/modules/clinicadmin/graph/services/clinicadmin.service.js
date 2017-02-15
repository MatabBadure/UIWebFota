'use strict';

angular.module('hillromvestApp')
  .factory('clinicadminService',['$http', 'headerService', 'URL', function ($http, headerService, URL) {
    return {
      getStatistics: function(clinicId, userId, deviceType){
        var url = URL.getStatistics.replace('USERID', userId).replace('CLINICID', clinicId).replace('DEVICETYPE', deviceType);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },
        getBadgeStatistics: function(clinicId, userId,fromdate,todate){
        var url = URL.getBadgeStatistics.replace('USERID', userId).replace('CLINICID', clinicId).replace('FROM_DATE', fromdate).replace('TO_DATE', todate);
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