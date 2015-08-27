'use strict';

angular.module('hillromvestApp')
    .factory('AuthServerProvider', function loginService($http, localStorageService, Base64) {
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
                        'x-auth-token': localStorage.getItem('token')
                    }
                }).success(function (data, status, headers, config) {
                    return {'response': data, 'status': status, 'headers' : headers, 'config' : config};
                });
            },
            logout: function() {
                //Stateless API : No server logout
                localStorageService.clearAll();
            },
            getToken: function () {
                return localStorageService.get('token');
            },
            hasValidToken: function () {
                var token = this.getToken();
                return token && token.expires && token.expires > new Date().getTime();
            },

            submitPassword: function (data) {
                return $http.put('api/account/update_emailpassword', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'x-auth-token': localStorage.getItem('token')
                    }
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
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'x-auth-token': localStorage.getItem('token')
                    }
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
            }
        };
    });
