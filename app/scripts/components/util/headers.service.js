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
      },
      getHeaderForXls: function() {
        var token = StorageService.get('logged').token,
          header = {
            'Content-Type': 'application/vnd.ms-excel',
            'Accept': 'application/vnd.ms-excel',
            'x-auth-token': token
          };
        return header;
      },
     getHeaderForPdf: function() {
        var token = StorageService.get('logged').token,
          header = {
            'Content-Type': 'application/pdf',
            'x-auth-token': token
          };
        return header;
      }, 
      getHeaderforUpload: function(){
        var token = StorageService.get('logged').token,
          header = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-auth-token': token,
            'Content-Type': undefined,
            'name':'uploadfile'
          };
        return header;
      }
    };
  }]);
