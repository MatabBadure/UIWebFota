'use strict';

angular.module('hillromvestApp')
    .controller('MainController',['$scope', 'PrincipalService', function ($scope, PrincipalService) {
        PrincipalService.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });
    }]);
