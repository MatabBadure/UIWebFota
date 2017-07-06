'use strict';
/**
 * @ngdoc service
 * @name UserService
 * @description A service that makes ajax call to REST api to perform operations related to Hill-Rom-users.
 *
 */
angular.module('hillromvestApp')
  .factory('TimService',['$http', 'headerService', 'URL', function($http, headerService, URL) {
    return {
    	 executeTimsJob: function() {
         var url  = URL.executeTimsJob;
         console.log("executeTimsJob url:",url);
                 console.log("StorageService.get('logged').token",StorageService.get('logged').token);

        return $http.post(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
  };
  }]);