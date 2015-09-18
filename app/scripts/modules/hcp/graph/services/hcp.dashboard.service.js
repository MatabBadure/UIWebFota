'use strict';
/**
 * @ngdoc service
 * @name patientService
 * @description
 *
 */
angular.module('hillromvestApp')
  .factory('hcpDashBoardService', ['$http','headerService',function ($http, headerService) {
    return {

      /**
      * @ngdoc method
      * @name getCumulativeGraphPoints
      * @description To get array of data points for cumulative statistics graph.
      *
      */
      getCumulativeGraphPoints: function(id, fromTimeStamp, toTimeStamp, groupBy) {
        var url = hcp.graph.baseURL;
        url  = url + '/' + id + '/therapyData';
        if ( fromTimeStamp !== undefined && toTimeStamp !== undefined && groupBy !== undefined) {
          url = url + '?from=' + fromTimeStamp + '&to=' + toTimeStamp + '&groupBy=' + groupBy;
        } else if(date !== undefined){
          url = url + '?date=' + date;
        }
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
        var url = hcp.graph.baseURL;
        url  = url + '/' + id + '/complianceLevel';
        if ( fromTimeStamp !== undefined && toTimeStamp !== undefined && groupBy !== undefined) {
          url = url + '?from=' + fromTimeStamp + '&to=' + toTimeStamp + '&groupBy=' + groupBy;
        } else if(date !== undefined){
          url = url + '?date=' + date;
        }
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

    };
  }]);