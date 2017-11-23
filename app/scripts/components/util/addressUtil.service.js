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
        var url = URL.getCityStateByZip.replace('ZIPCODE', zipcode.replace(' ',''));
          return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },

      getCitiesByState: function(state){
        var url = URL.getCitiesByState.replace('STATE', state);
          return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },

      getAvailableStates: function() {
        var url = URL.availableStates;
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function (response) {
            return response;
        });
      },

      getAvailableStatesAdv: function() {
        var url = URL.availableStatesAdv;
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function (response) {
            return response;
        });
      },

       getAllStatesAdv: function(countries) {
        //var data = {"country": countries};
        var url = URL.stateByCountryCode.replace("COUNTRY",countries);
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function (response) {
            return response;
        });
      },

        getCitybyStateAdv: function(countries, states) {
          var data = {"country": countries, "state": states};
        var url = URL.cityByCountryAndState;
        return $http.post(url, data,{
          headers: headerService.getHeader()
        }).success(function (response) {
            return response;
        });
      }
      
    };
  }]);