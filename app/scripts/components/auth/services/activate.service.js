'use strict';

angular.module('hillromvestApp')
    .factory('Activate', ['$resource', 'URL', function ($resource, URL) {
        return $resource(URL.activate, {}, {
            'get': { method: 'GET', params: {}, isArray: false}
        });
    }]);