'use strict';

angular.module('hillromvestApp')
  .factory('clinicadminHcpService',['$http', 'headerService', 'URL', function ($http, headerService, URL) {
    return {
      searchAssociatedHcpsToClinic: function(searchItem, filter, sortOption, currentPageIndex, perPageCount, userId, clinicId){
        var url = URL.searchAssociatedHcpsToClinic;
        url = url.replace('CLINICADMINID', userId).replace('SEARCHSTRING',searchItem).replace('CLINICID',clinicId).replace('FILTER',filter).replace('PERPAGECOUNT',perPageCount).replace('PAGE',currentPageIndex).replace('SORTBY', sortOption);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      }
    };
}]);