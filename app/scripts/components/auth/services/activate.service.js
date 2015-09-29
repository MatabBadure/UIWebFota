'use strict';

angular.module('hillromvestApp')
    .factory('Activate', ['$resource', function ($resource) {
        return $resource('api/activate', {}, {
            'get': { method: 'GET', params: {}, isArray: false}
        });
    }]);