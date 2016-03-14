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
      getBenchmarkingReport: function(fromDate, toDate, XAxis, YAxis, type, benchmarkType, country, state, city, range) {
        var url = URL.getLoginAnalytics.replace('FROM', fromDate).replace('TO', toDate);
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }

    };
  }]);