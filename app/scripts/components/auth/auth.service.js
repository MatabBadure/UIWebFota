'use strict';

angular.module('hillromvestApp')
    .factory('Auth',['$rootScope', '$state', '$q', '$translate', 'Principal', 'AuthServerProvider', 'Account', 'Activate', 'Password', 'PasswordResetInit', 'PasswordResetFinish', 'StorageService', 
        function Auth($rootScope, $state, $q, $translate, Principal, AuthServerProvider, Account, Activate, Password, PasswordResetInit, PasswordResetFinish, StorageService) {
        var auth =  {
            goToUserDashboard: function(){
                var logged = StorageService.get('logged');
                if(logged.userEmail){
                    if(Principal.isInRole('ADMIN')){
                        $state.go('patientUser');
                    }else if(Principal.isInRole('PATIENT')){
                        $state.go('patientdashboard');
                    }else if(Principal.isInRole('CLINIC ADMIN') || Principal.isInRole('CLINIC_ADMIN')){
                        $state.go('clinicadmindashboard');
                    }else if(Principal.isInRole('HCP')){
                        $state.go("hcpdashboard");
                    }else if(Principal.isInRole('CARE_GIVER')){
                        $state.go("caregiverDashboard");
                    }else if(Principal.isInRole('ACCT_SERVICES')){
                        $state.go("rcadminPatients");
                    }
                }else{
                    $state.go("postActivateLogin");
                }
            },

            login: function (credentials, callback) {
                var cb = callback || angular.noop;
                var deferred = $q.defer();

                AuthServerProvider.login(credentials).then(function (data) {
                    var logged = StorageService.get('logged') || {};
                    logged.token = data.data.id;
                    StorageService.save('logged', logged);
                    Principal.identity(true).then(function(account) {
                        logged = StorageService.get('logged') || {};
                        logged.role = account.roles[0];
                        StorageService.save('logged', logged);
                        $translate.use(account.langKey);
                        $translate.refresh();
                        deferred.resolve(data);
                    });
                    return cb(data);
                }).catch(function (err) {
                    StorageService.remove('token');
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));
                return deferred.promise;
            },

            signOut: function (newPassword, callback) {
                var cb = callback || angular.noop;
                var deferred = $q.defer();
                AuthServerProvider.signOut().then(function (data) {
                    deferred.resolve(data);
                    return cb(data);
                }).catch(function (err) {
                    deferred.reject(err);
                    return cb(err);
                });
                return deferred.promise;
            },

            logout: function () {
                StorageService.clearAll();
                AuthServerProvider.logout();
                Principal.authenticate(null);
            },

            authorize: function(force) {
                return Principal.identity(force)
                    .then(function() {
                        var isAuthenticated = Principal.isAuthenticated();

                        if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !Principal.isInAnyRole($rootScope.toState.data.roles)) {
                            if (isAuthenticated) {
                                // user is signed in but not authorized for desired state
                                // $state.go('accessdenied');
                                //$state.go('pageUnderConstruction');
                                auth.goToUserDashboard();
                            }
                            else {
                                // user is not authenticated. stow the state they wanted before you
                                // send them to the signin state, so you can return them when you're done
                                $rootScope.returnToState = $rootScope.toState;
                                $rootScope.returnToStateParams = $rootScope.toStateParams;

                                // now, send them to the signin state so they can log in
                                $state.go('login');
                            }
                        }

                        if(isAuthenticated && ($rootScope.toState.url == "/login" || $rootScope.toState.url == "/")){ 
                            auth.goToUserDashboard();
                        }
                    });
            },

            updateAccount: function (account, callback) {
                var cb = callback || angular.noop;

                return Account.save(account,
                    function () {
                        return cb(account);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },

            activateAccount: function (key, callback) {
                var cb = callback || angular.noop;

                return Activate.get(key,
                    function (response) {
                        return cb(response);
                    },
                    function (err) {
                        return cb(err);
                    }.bind(this)).$promise;
            },

            changePassword: function (newPassword, callback) {
                var cb = callback || angular.noop;
                var data = {"password":newPassword};
                var deferred = $q.defer();
                Password.changePassword(data).then(function (data) {
                    deferred.resolve(data);
                    return cb(data);
                }).catch(function (err) {
                    deferred.reject(err);
                    return cb(err);
                });
                return deferred.promise;
            },

            resetPasswordInit: function (mail, callback) {
                var cb = callback || angular.noop;
                var data ={"email":mail};
                return PasswordResetInit.save(data, function() {
                    return cb();
                }, function (err) {
                    return cb(err);
                }).$promise;
            },


            resetPasswordFinish: function(key, data, callback) {
                var cb = callback || angular.noop;
                var data = {"questionId":data.question.id,
                            "answer": data.answer,
                            "password":data.password
                           };
                return PasswordResetFinish.resetPassFinish(key).save(data, function () {
                    return cb();
                }, function (err) {
                    return cb(err);
                }).$promise;
            },

            submitPassword : function(obj, callback){
                var deferred = $q.defer();
                var cb = callback || angular.noop;
                AuthServerProvider.submitPassword(obj).then(function (data) {
                    deferred.resolve(data);
                    return cb(data);
                }).catch(function (err) {
                    //this.logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));
                return deferred.promise;
            },

            configurePassword : function(obj, callback){
                var deferred = $q.defer();
                var cb = callback || angular.noop;
                AuthServerProvider.configurePassword(obj).then(function (data) {
                    deferred.resolve(data);
                    return cb(data);
                }).catch(function (err) {
                    this.logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));
                return deferred.promise;
            },

             getSecurityQuestions : function(callback){
                var deferred = $q.defer();
                var cb = callback || angular.noop;
                AuthServerProvider.getSecurityQuestions().then(function (data) {
                    deferred.resolve(data);
                    return cb(data);
                }).catch(function (err) {
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));
                return deferred.promise;
            },


            /*Temp Fix from  angular*/
            captcha: function(captchaData, callback){
                var deferred = $q.defer();
                var cb = callback || angular.noop;
                AuthServerProvider.captcha(captchaData).then(function (data) {
                    deferred.resolve(data);
                    return cb(data);
                }).catch(function (err) {
                    //this.logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));
                return deferred.promise;
            }            
        };

        return auth;
    }]);
