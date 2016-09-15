'use strict';
angular.module('hillromvestApp')
  .factory('chargerservice', ['$http', 'headerService', 'URL' ,
    function($http, headerService, URL) {
    return {
      getListDataFromService: function() {
        var url = URL.chargerDataList;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

       getClickedDataFromService: function(id) {
        var url = URL.clickedListData.replace('ID',id);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
    };
   }]);
