'use strict';

angular.module('hillromvestApp')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('account', {
                abstract: true,
                parent: 'site'
            });
    }]);
