'use strict';

angular.module('hillromvestApp')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('requestReset', {
                parent: 'account',
                url: '/reset/request',
                data: {
                    roles: [],
                    pageTitle: 'reset.request.pageTitle'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/account/reset/request/reset.request.html',
                        controller: 'RequestResetController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('reset');
                        return $translate.refresh();
                    }]
                }
            });
    }]);
