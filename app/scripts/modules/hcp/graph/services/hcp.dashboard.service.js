'use strict';
/**
 * @ngdoc service
 * @name patientService
 * @description
 *
 */
angular.module('hillromvestApp')
  .factory('hcpDashBoardService', ['$http','headerService', 'hcpServiceConstants', 'URL', function ($http, headerService, hcpServiceConstants, URL) {
    return {

      /**
      * @ngdoc method
      * @name getCumulativeGraphPoints
      * @description To get array of data points for cumulative statistics graph.
      *
      */
      getCumulativeGraphPoints: function(hcpID, clinicID, fromTimeStamp, toTimeStamp, groupBy, deviceType) {
        var url = hcpServiceConstants.graph.baseURL;
        url  = url + '/' + hcpID + '/clinics/' + clinicID + '/cumulativeStatistics';
        url = url + '?from=' + fromTimeStamp + '&to=' + toTimeStamp + '&groupBy=' + groupBy;
        url = url + '&deviceType=' + deviceType;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },


      /**
      * @ngdoc method
      * @name getHcpStatistics
      * @description To get statistics for a hcp based on ID.
      *
      */
      getStatistics: function(clinicId, userId, deviceType){
        var url = URL.getStatistics.replace('USERID', userId).replace('CLINICID', clinicId).replace('DEVICETYPE', deviceType);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },



      /**
      * @ngdoc method
      * @name getTreatmentGraphPoints
      * @description To get array of data points for treatment statistics  graph.
      *
      */
      getTreatmentGraphPoints: function(hcpID, clinicID, fromTimeStamp, toTimeStamp, groupBy, deviceType) {
        var url = hcpServiceConstants.graph.baseURL;
        url  = url + '/' + hcpID + '/clinics/' + clinicID + '/treatmentStatistics';
        url = url + '?from=' + fromTimeStamp + '&to=' + toTimeStamp + '&groupBy=' + groupBy;
        url = url + '&deviceType=' + deviceType;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
    };
  }]);

