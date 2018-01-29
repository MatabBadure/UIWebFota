'use strict';

angular.module('hillromvestApp')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('passwordReset', {
                parent: 'account',
                url: '/reset/password?key',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/account/reset/password/reset.password.html',
                        controller: 'ResetPasswordController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('reset');
                        return $translate.refresh();
                    }]
                }
            })
               .state('resetAccount', {
                parent: 'account',
                url: '/re-register?key',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/account/reset/password/reset.account.html',
                        controller: 'ResetPasswordController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('reset');
                        return $translate.refresh();
                    }]
                }
            })
    }]);
