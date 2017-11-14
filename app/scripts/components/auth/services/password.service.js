'use strict';

angular.module('hillromvestApp')
    .factory('Password', ['$http', 'headerService', 'URL', function ($http, headerService, URL) {
    return {
            changePassword: function(data) {
                return $http.post(URL.changePassword, data, {
                    headers: headerService.getHeader()
                }).success(function (data, status, headers, config) {
                    return {'response': data, 'status': status, 'headers' : headers, 'config' : config};
                });
            },

            updatePassword: function(id, data){
                var url = URL.updatePassword.replace('USERID', id);
                return $http.put(url, data, {
                    headers: headerService.getHeader()
                }).success(function (data, status, headers, config) {
                    return {'response': data, 'status': status, 'headers' : headers, 'config' : config};
                });
            }
        }
    }]);


angular.module('hillromvestApp')
    .factory('PasswordResetInit', ['$resource', 'URL', function ($resource, URL) {
    	return $resource(URL.resetPasswordInit, {}, {
    	 })
    }]);

angular.module('hillromvestApp')
    .factory('PasswordResetFinish', ['$resource', 'URL', function ($resource, URL) {
        return{
        	resetPassFinish : function(key){
                var url = URL.resetPasswordFinish.replace('KEY', key);
        		return  $resource(url, {}, {
                });
        	}

        }
    }]);
