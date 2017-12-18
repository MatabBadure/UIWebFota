'use strict';

angular.module('hillromvestApp')
    .factory('AuthServerProvider', ['$http', 'StorageService', 'headerService', 'URL',
        function($http, StorageService, headerService, URL) {
        return {
            login: function(credentials) {
                var data = {
                  'username' : credentials.username,
                  'password' : credentials.password
                };
                return $http.post(URL.authenticate, data, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }).success(function (data, status, headers, config) {
                    return {'response': data, 'status': status, 'headers' : headers, 'config' : config};
                });
            },
            signOut: function() {
                return $http.post(URL.logout, {}, {
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
                return $http.put(URL.updateEmailPassword, data, {
                    headers: headerService.getHeader()
                }).success(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                }).error(function (data, status, headers, config) {

                });
            },


            configurePassword: function (data) {
                return $http.put(URL.updatePasswordSecurityQuestion, data, {
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
                var url = URL.changeSecurityQuestion.replace('USERID', id);
                return $http.put(url, data, {
                    headers: headerService.getHeader()
                }).success(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                }).error(function (data, status, headers, config) {

                });
            },

            getSecurityQuestions: function () {
                return $http.get(URL.securityQuestions)
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
                return $http.post(URL.recaptcha, data).
                   success(function(response) {
                   return response;
               });
            },

            isValidActivationKey: function (keyData){
                var url = URL.validateActivationKey.replace('KEYDATA', keyData)
                return $http.get(url)
                .success(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                }).error(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                });
            },
            
            isValidResetKey: function (keyData){
                var url = URL.validateResetKey.replace('KEYDATA', keyData);
                return $http.get(url)
                .success(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                }).error(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                });
            },
            //Gimp-32  
            reActivateAccountAgeLimit: function(data){
                var url = URL.resetAccountAgeLimit;
                return $http.put(url, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }).success(function (data, status, headers, config) {
                    return {'response' : data, 'status' : status, 'headers' : headers, 'config' : config};
                }).error(function (data, status, headers, config) {

                });
            }
            //End of Gimp-32  
        };
    }]);
