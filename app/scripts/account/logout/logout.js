'use strict';

angular.module('hillromvestApp')
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider
            .state('logout', {
                parent: 'account',
                url: '/logout',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/main/main.html',
                        controller: 'LogoutController'
                    }
                }
            });
    }]);
