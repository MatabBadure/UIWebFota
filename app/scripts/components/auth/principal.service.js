'use strict';

angular.module('hillromvestApp')
    .factory('Principal',[function Principal() {
        var _identity,
            _authenticated = false;

        return {
            isIdentityResolved: function () {
                return angular.isDefined(_identity);
            },
            isAuthenticated: function () {
                return _authenticated;
            },
            isInRole: function (role) {
                if (!_authenticated || !_identity || !_identity.roles) {
                    return false;
                }

                return _identity.roles.indexOf(role) !== -1;
            },
            isInAnyRole: function (roles) {
                if (!_authenticated || !_identity.roles) {
                    return false;
                }

                for (var i = 0; i < roles.length; i++) {
                    if (this.isInRole(roles[i])) {
                        return true;
                    }
                }

                return false;
            },
            authenticate: function (identity) {
                _identity = identity;
                _authenticated = identity !== null;
            },
            setIdentity: function (identity) {
                   _identity = identity;
            },
            getIdentity: function() {
                return _identity;
            },
            setAuthenticate: function(authenticate) {
                _authenticated = authenticate;
            }
        };
    }]).service('PrincipalService', ['Account', '$q', 'Principal', '$rootScope', function(Account, $q, Principal, $rootScope) {
        this.identity = function(force) {
             var deferred = $q.defer();
              if (force === true) {
                    Principal.setIdentity(undefined);
                }

                // check and see if we have retrieved the identity data from the server.
                // if we have, reuse it by immediately resolving
                if (angular.isDefined(Principal.getIdentity())) {
                    deferred.resolve(Principal.getIdentity());

                    return deferred.promise;
                }

                // retrieve the identity data from the server, update the identity object, and then resolve.
                Account.get().$promise
                    .then(function (account) {
                        Principal.setIdentity(account.data);
                        Principal.setAuthenticate(true);
                        $rootScope.isAuthenticated = true;
                        deferred.resolve(account.data);
                    })
                    .catch(function() {
                        Principal.setIdentity(null);
                        Principal.setAuthenticate(false);
                        $rootScope.isAuthenticated = false;
                        deferred.resolve(null);
                    });
                return deferred.promise;
        }
    }]);
