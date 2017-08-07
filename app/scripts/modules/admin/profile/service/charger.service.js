'use strict';
angular.module('hillromvestApp')
  .factory('chargerservice', ['$http', 'headerService', 'URL' ,
    function($http, headerService, URL) {
    return {
      getListDataForCharger: function() {
        var url = URL.chargerDataList;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

       getClickedDataForCharger: function(id) {
        var url = URL.clickedListData.replace('ID',id);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
   

    getListDataForOptimus: function(page,perpage){
      var url = URL.optimusdevicedatalist.replace('PAGE',page).replace('PER_PAGE',perpage);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
    },

    getClickedDataForOptimus: function(id){
      var url = URL.optimusDeviceData.replace('ID',id);
      return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
    }
  };
   }]);
