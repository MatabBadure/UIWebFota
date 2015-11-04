'use strict';

angular.module('hillromvestApp')
    .factory('AuthServerProvider', ['$http', 'StorageService', 'headerService',
        function($http, StorageService, headerService) {
        return {
            login: function(credentials) {
                var data = {
                  'username' : credentials.username,
                  'password' : credentials.password
                };
                return $http.post('api/authenticate', data, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }).success(function (data, status, headers, config) {
                    return {'response': data, 'status': status, 'headers' : headers, 'config' : config};
                });
            },
            signOut: function() {
                return $http.post('/api/logout',{}, {
                    headers: {
                        'x-auth-token': StorageService.get('logged').token
                    }
                }).success(function (data, status, headers, config) {
                    return {'response': data, 'status': status, 'headers' : headers, 'config' : config};
                });
            },
            logout: function() {
                //Stateless API : No server logout
                StorageService.clearAll();
            },
            getToken: function () {
                return StorageService.get('logged').token;
            },
            hasValidToken: function () {
                var token = this.getToken();
                return token && token.expires && token.expires > new Date().getTime();
            },

            submitPassword: function (data) {
                return $http.put('api/account/update_emailpassword', data, {
                    headers: headerService.getHeader()
                }).success(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                }).error(function (data, status, headers, config) {

                });
            },


            configurePassword: function (data) {
                return $http.put('api/account/update_passwordsecurityquestion', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }).success(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                }).error(function (data, status, headers, config) {

                });
            },

            changeSecurityQuestion: function(data, id){
                return $http.put('/api/user/'+id+'/changeSecurityQuestion', data, {
                    headers: headerService.getHeader()
                }).success(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                }).error(function (data, status, headers, config) {

                });
            },

            getSecurityQuestions: function () {
                return $http.get('api/securityQuestions')
                .success(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                }).error(function (data, status, headers, config) {

                });
            },

            /*Temp Service Call From angular*/
            captcha: function (captchaData){
                var data = {
                    'response': captchaData
                };
                return $http.post('/api/recaptcha', data).
                   success(function(response) {
                   return response;
               });
            },

            isValidActivationKey: function (keyData){
                return $http.get('api/validateActivationKey?key='+keyData)
                .success(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                }).error(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                });
            }
        };
    }]);
