'use strict';
/**
 * @ngdoc service
 * @name UserService
 * @description A service that makes ajax call to REST api to perform operations related to Hill-Rom-users.
 *
 */
angular.module('hillromvestApp')
  .factory('TimService',['$http', 'headerService', 'URL','StorageService', function($http, headerService, URL,StorageService) {
    return {
    	 executeTimsJob: function() {
         var url  = URL.executeTimsJob;
         var data="";
        return $http.post(url,data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
  };
  }]);