'use strict';
/**
 * @ngdoc service
 * @name patientService
 * @description
 *
 */
angular.module('hillromvestApp')
  .factory('caregiverDashBoardService',['$http','headerService','URL', function ($http, headerService, URL) {
    return {

      /**
      * @ngdoc method
      * @name getPatients
      * @description To get array of patients for a caregiver.
      *
      */
      getPatients: function(id) {
        var url = URL.caregiverDashboard.getPatients.replace('USERID',id);
        return $http.get(url, {
          headers: headerService.getHeader()
        })
      }

    };
  }]);