'use strict';

angular.module('hillromvestApp')
    .factory('Register', ['$resource', function ($resource) {
        return $resource('api/register', {}, {
        });
    }]);