'use strict';

angular.module('hillromvestApp')
    .controller('LogoutController', function ($scope, Auth, $state, Principal, Account) {
    	$scope.logout = function(){

    		//This it Temp Fix
    		Auth.signOut().then(function(data) {
          		Auth.logout();
          		localStorage.clear();
          		Account.get().$promise
			        .then(function (account) {
			        })
			        .catch(function() {
			          $scope.isAuthenticated = false;
			          $state.go('login');
			        });
        	}).catch(function(err) {
        	});
    	};
    });
