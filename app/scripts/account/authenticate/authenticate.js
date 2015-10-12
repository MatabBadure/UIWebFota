'use strict';

angular.module('hillromvestApp')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('authenticate', {
                parent: 'account',
                url: '/authenticate?key',
                data: {
                    roles: [],
                    pageTitle: 'authenticate.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/account/authenticate/authenticate.html',
                        controller: 'AuthenticateController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('authenticate');
                        return $translate.refresh();
                    }]
                }
            });
    }]);

