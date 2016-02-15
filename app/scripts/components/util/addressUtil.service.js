'use strict';
angular.module('hillromvestApp')
  .factory('addressService', ['$http', 'headerService', 'URL', function($http, headerService, URL){
    return {
      getCityStateZipByState: function(state) {
        var url = URL.getCityStateZipByState.replace('STATE', state);
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function (response) {
            return response;
        });
      },

      getAllStates: function() {
        var url = URL.getAllStates;
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function (response) {
            return response;
        });
      },
     
      getCityStateByZip: function(zipcode) {
        var url = URL.getCityStateByZip.replace('ZIPCODE', zipcode);
          return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      }
      
    };
  }]);