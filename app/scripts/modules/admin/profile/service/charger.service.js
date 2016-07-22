'use strict';
angular.module('hillromvestApp')
  .factory('chargerservice', ['$http', 'headerService', 'URL' ,
    function($http, headerService, URL) {
    return {
      getData: function() {
        var url = URL.chargerBaseURL;
        return $http.get(url, {
          /*headers: headerService.getHeader()*/
        }).success(function(response) {
          return response;
        });
      }
    };
   }]);
