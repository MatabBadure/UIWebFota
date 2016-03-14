'use strict';
/**
 * @ngdoc service
 * @name loginanalyticsService
 * @description
 *
 */
angular.module('hillromvestApp')
  .factory('benchmarkingService',['$http','headerService','URL', function ($http, headerService, URL) {
    return {

      /**
      * @ngdoc method
      * @name getBenchmarking
      * @description 
      * only Admin/RC Admin/Associate can view it.
      */
      getBenchmarkingReport: function(fromDate, toDate, XAxis, type, benchmarkType, range, state, city) {
        var url = URL.getBenchmarking.replace('FROM', fromDate).replace('TO', toDate).replace('XAXIS',XAxis).replace('TYPE',type).replace('BENCHMARKTYPE',benchmarkType).replace('RANGE',range);
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }

    };
  }]);