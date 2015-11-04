'use strict';
angular.module('hillromvestApp')
  .factory('notyService', ['noty','$rootScope', function(noty, $rootScope) {
    var flashTime = 2000 //2 seconds.
    return {
      showMessage: function(message, type) {
        if(!$rootScope.prevFlashTime ||
          ($rootScope.prevFlashMsg !== message ||
          (new Date()-$rootScope.prevFlashTime) > (flashTime + 300))) {
          noty.showNoty({
            text: message,
            ttl: flashTime,
            type: type
          });
          $rootScope.prevFlashMsg = message;
          $rootScope.prevFlashTime = new Date();
        }
      },

      showError: function(response) {
        if(response.data){
          if(response.data.ERROR){
            this.showMessage(response.data.ERROR, 'warning');
          }else if(response.data.message){
            this.showMessage(response.data.message, 'warning');
          }
        }
      }
    };
  }]);