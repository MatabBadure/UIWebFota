'use strict';
angular.module('hillromvestApp')
  .factory('notyService', function(localStorageService, noty) {
    return {
      showMessage: function(message, type) {
        noty.showNoty({
          text: message,
          ttl: 5000,
          type: type
        });
      },

      showError: function(response) {
        if(response.data.ERROR){
          this.showMessage(response.data.ERROR, 'warning');
        }else if(response.data.message){
          this.showMessage(response.data.message, 'warning');  
        }
      }
    };
  });