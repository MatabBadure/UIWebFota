'use strict';

angular.module('hillromvestApp')
    .factory('Account', ['$resource', function Account($resource) {
        return $resource('api/account', {}, {
            'get': { method: 'GET', headers:{
            	'x-auth-token': function () {
                    var token = localStorage.getItem('token');
                    return token;
                }
            },params: {}, isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
            }
        });
    }]);
