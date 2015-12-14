'use strict';

angular.module('hillromvestApp')
    .factory('Account', ['$resource', 'StorageService', 'URL', function Account($resource, StorageService, URL) {
        return $resource(URL.account, {}, {
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
