'use strict';
angular.module('hillromvestApp')
  .factory('headerService', ['StorageService', function(StorageService) {
    return {
      getHeader: function() {
        var token = StorageService.get('logged').token,
          header = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-auth-token': token,
            'X-Frame-Options': 'SAMEORIGIN',
            'X-XSS-Protection': '0',
            'X-Content-Type-Options': 'nosniff'

          };
        return header;
      }
    };
  }]);
