'use strict';
angular.module('hillromvestApp')
  .factory('notyService', ['toastr', function(toastr) {
    return {
      showMessage: function(message, type) {
        if(type === 'warning'){
          toastr.error(message);
        }else{
          toastr.success(message);
        }
      },
      
      showError: function(response) {
        if(response.data){
          if(response.data.ERROR){
            toastr.error(response.data.ERROR);
          }else if(response.data.message){
            toastr.error(response.data.message);
          }
        }
        else{
          toastr.error(response);
        }
      }
    };
  }]);