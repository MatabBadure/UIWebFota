'use strict';
/**
 * @ngdoc service
 * @name UserService
 * @description A service that makes ajax call to REST api to perform operations related to Hill-Rom-users.
 *
 */
angular.module('hillromvestApp')
  .factory('UserService', function($http, localStorageService, headerService) {
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
        return $http.get('scripts/app/modules/admin/hill-rom-user/services/state.json')
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
      getUsers: function(url, searchString, sortOption, pageNo, offset) {
        var sortOrder;
        if (searchString === undefined) {
          searchString = '';
        }
        if (sortOption === "") {
          sortOption = "createdAt";
          sortOrder = false;
        } else {
          sortOrder = true;
        };

        return $http.get(url + searchString + '&page=' + pageNo + '&per_page=' + offset + '&sort_by=' + sortOption + '&asc=' + sortOrder, {
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
        ///api/patient/relationships
        var url = admin.patient.baseURL + 'relationships';
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
        /*return $http.get('scripts/app/modules/admin/hill-rom-user/services/relationship.json')
          .success(function(response) {
            return response;
          });*/
      },
      getNotesOfUser: function(id, date) {
        ///api/users/{id}/notes?date=:date
        var url = admin.hillRomUser.baseURL + id +'/notes?date=';
        if( date!= null && date.length > 0){
          url = url+date;
        }        
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }, 

      getNotesOfUser: function(id, date) {
        ///api/users/{id}/notes?date=:date
        var url = admin.hillRomUser.users + '/' + id +'/notes?date=';
        if( date!= null && date.length > 0){
          url = url+date;
        }        
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
        var url = admin.hillRomUser.patients+'/'+noteId+'/notes?date=';
        if(date != null && date.length > 0){
          url = url+date;
        }
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }


    };
  });
