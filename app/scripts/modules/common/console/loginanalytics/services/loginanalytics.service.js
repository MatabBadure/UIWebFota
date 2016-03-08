'use strict';
/**
 * @ngdoc service
 * @name loginanalyticsService
 * @description
 *
 */
angular.module('hillromvestApp')
  .factory('loginanalyticsService',['$http','headerService','URL', function ($http, headerService, URL) {
    return {

      /**
      * @ngdoc method
      * @name getLoginAnalytics
      * @description To get login analytics of the users (Patient, HCP, Clinic Admin, Caregiver)
      * only Admin/RC Admin/Associate can view it.
      *
      */
      getLoginAnalytics: function(fromDate, toDate, filters, duration) {
        var url = URL.getLoginAnalytics.replace('FROM', fromDate).replace('TO', toDate).replace('FILTERS', filters).replace('DURATION', duration);
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }

    };
  }]);