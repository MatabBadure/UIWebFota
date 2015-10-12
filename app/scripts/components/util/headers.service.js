'use strict';
angular.module('hillromvestApp')
  .factory('headerService', ['StorageService', function(StorageService) {
    return {
      getHeader: function() {
        var token = StorageService.get('logged').token,
          header = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-auth-token': token
          };
        return header;
      }
    };
  }]);
