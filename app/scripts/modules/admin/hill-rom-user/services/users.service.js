'use strict';
/**
 * @ngdoc service
 * @name UserService
 * @description A service that makes ajax call to REST api to perform operations related to Hill-Rom-users.
 *
 */
angular.module('hillromvestApp')
  .factory('UserService',['$http', 'headerService', 'URL', function($http, headerService, URL) {
    return {

      /**
       * @ngdoc method
       * @name createUser
       * @description To create user.
       *
       */
      createUser: function(data) {
        var url = admin.hillRomUser.baseURL;
        return $http.post(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
       * @ngdoc method
       * @name deleteUser
       * @description To delete user.
       *
       */
      deleteUser: function(id) {
        var url = admin.hillRomUser.baseURL;
        return $http.delete(url + '/' + id, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
       * @ngdoc method
       * @name editUser
       * @description To edit user
       *
       */
      editUser: function(data) {
        var url = admin.hillRomUser.baseURL;
        return $http.put('api/user/' + data.id, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
       * @ngdoc method
       * @name getState
       * @description To get list of states.
       *
       */
      getState: function() {
        return $http.get('scripts/modules/admin/hill-rom-user/services/state.json')
          .success(function(response) {
            return response;
          });
      },

      /**
       * @ngdoc method
       * @name getUsers
       * @description To get list of users matching with search text and other parameter passed to REST api.
       *
       */
      getUsers: function(url, searchString, sortOption, pageNo, offset, filter) {
        var sortOrder;
        var filterBy = (filter && filter != undefined) ? filter : stringConstants.emptyString;
        if (searchString === undefined) {
          searchString = '';
        }
        if (sortOption === "" || sortOption === undefined || sortOption === null) {
          sortOption = sortConstant.lastName + searchFilters.amp +searchFilters.asc +searchFilters.equal + true;
        } 

        return $http.get(url + searchString + '&page=' + pageNo + '&per_page=' + offset + '&sort_by=' + sortOption + '&filter='+filter, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
       * @ngdoc method
       * @name getUser
       * @description To get complete information about a user based on user's ID.
       *
       */
      getUser: function(id, url) {
        var url = url || ('api/user/' + id);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      getRelationships: function() {
        var url = admin.patient.baseURL + 'relationships';
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });        
      },
      getNotesOfUserInInterval: function(id, fromDate, toDate, pageNo, offset) { 
        var url = admin.hillRomUser.notes + '?from=' + fromDate + '&to=' + toDate + '&userId='+id +'&page='+pageNo+'&per_page='+offset;    
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }, 

      getNotesOfUser: function(id, date) {
        ///api/users/{id}/notes?date=:date
        var url = admin.hillRomUser.users + '/' + id +'/notes?date='+date; 
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }, 

      createNote: function(id, data){
        var url = admin.hillRomUser.notes;
        return $http.post(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      deleteNote: function(noteId){
        var url = admin.hillRomUser.notes+'/'+noteId;
        return $http.delete(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      updateNote: function(noteId, date, data){        
        var url = admin.hillRomUser.notes+'/'+noteId;
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getPatientNotification : function(userId, timestamp){
        //api/users/:id/notifications?date=:timestamp
        var url = admin.hillRomUser.users+'/'+userId+'/notifications?date='+timestamp;        
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });

      },

      updatePatientUserNotification : function(userId, data){
        var url = admin.hillRomUser.users+'/'+userId+'/notificationsetting';        
        return $http.put(url, data,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });

      },
      getPatientUserNotification : function(userId){
        var url = '/api/user/'+userId;        
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });

      },

      resendActivationLink : function(userId){
        var url = URL.resendActivationLink.replace('USERID', userId);
        return $http.put(url, null,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      reactivateUser : function(userId){
        var url = URL.reactiavteUser.replace('USERID', userId);
        return $http.put(url, null, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
    };
  }]);
