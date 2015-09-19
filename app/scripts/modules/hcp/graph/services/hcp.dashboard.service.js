'use strict';
/**
 * @ngdoc service
 * @name patientService
 * @description
 *
 */
angular.module('hillromvestApp')
  .factory('hcpDashBoardService', ['$http','headerService', 'hcpServiceConstants', function ($http, headerService, hcpServiceConstants) {
    return {

      /**
      * @ngdoc method
      * @name getCumulativeGraphPoints
      * @description To get array of data points for cumulative statistics graph.
      *
      */
      getCumulativeGraphPoints: function(id, fromTimeStamp, toTimeStamp, groupBy) {
        var url = hcpServiceConstants.graph.baseURL;
        url  = url + '/' + id + '/therapyData';
        url = url + '?from=' + fromTimeStamp + '&to=' + toTimeStamp + '&groupBy=' + groupBy;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },


      /**
      * @ngdoc method
      * @name getTreatmentGraphPoints
      * @description To get array of data points for treatment statistics  graph.
      *
      */
      getTreatmentGraphPoints: function(id, fromTimeStamp, toTimeStamp, groupBy) {
        var url = hcpServiceConstants.graph.baseURL;
        url  = url + '/' + id + '/complianceLevel';
        url = url + '?from=' + fromTimeStamp + '&to=' + toTimeStamp + '&groupBy=' + groupBy;
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
      getHcpStatistics: function(id) {
        var url = hcpServiceConstants.graph.baseURL;
        url  = url + '/' + id + '/complianceLevel';
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
    };
  }]);