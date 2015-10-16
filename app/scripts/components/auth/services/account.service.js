'use strict';

angular.module('hillromvestApp')
    .factory('Account', ['$resource', 'StorageService', function Account($resource, StorageService) {
        return $resource('api/account', {}, {
            'get': { method: 'GET', headers:{
            	'x-auth-token': function () {
                    var token = null;
                    if(StorageService.get('logged')){
                        token = StorageService.get('logged').token;
                    }
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
