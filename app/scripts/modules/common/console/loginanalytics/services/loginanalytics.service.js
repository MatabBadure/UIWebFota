'use strict';
/**
 * @ngdoc service
 * @name patientService
 * @description
 *
 */
angular.module('hillromvestApp')
  .factory('loginanalyticsService',['$http','headerService','URL', function ($http, headerService, URL) {
    return {

      /**
      * @ngdoc method
      * @name getPatients
      * @description To get array of patients for a caregiver.
      *
      */
      getLoginAnalytics: function(fromDate, toDate, filters, duration) {
        var url = URL.getLoginAnalytics.replace('FROM', fromDate).replace('TO', toDate).replace('FILTERS', filters).replace('DURATION', duration);
        return $http.put(url, null,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }

    };
  }]);