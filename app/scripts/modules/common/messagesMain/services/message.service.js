'use strict';

angular.module('hillromvestApp')
  .factory('messageService',['$http', 'headerService', 'URL', function ($http, headerService,URL) {
    return {
        sendMessageService: function(data) {
        var url = URL.sendMessage;
        return $http.post(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
       fetchSentItems: function(id,isclinic,pageNumber,perPage,sortOption) {
        var url = URL.getSentItems.replace('ISCLINIC',isclinic).replace('ID',id).replace('PAGE',pageNumber).replace('PER_PAGE',perPage).replace('SORT_OPTION',sortOption);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      fetchSentItemsCA: function(id,isclinic,clinicid,pageNumber,perPage,sortOption) {
        var url = URL.getSentItemsCA.replace('ID',id).replace('ISCLINIC',isclinic).replace('CLINICID',clinicid).replace('PAGE',pageNumber).replace('PER_PAGE',perPage).replace('SORT_OPTION',sortOption);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

    fetchInboxItems: function(id,isClinic,pageNumber,perPage,sortOption){
      var url = URL.getInboxItems.replace('ID',id).replace('BOOL',isClinic).replace('PAGE',pageNumber).replace('PER_PAGE',perPage).replace('SORT_OPTION',sortOption).replace('MAILBOXTYPE','Inbox');
      return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
    },
    fetchInboxItemsCA: function(id,isClinic,clinicid,pageNumber,perPage,sortOption){
      var url = URL.getInboxItemsCA.replace('ID',id).replace('BOOL',isClinic).replace('CLINICID',clinicid).replace('PAGE',pageNumber).replace('PER_PAGE',perPage).replace('SORT_OPTION',sortOption).replace('MAILBOXTYPE','Inbox');
      return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
    },

     fetchArchiveItems: function(id,isClinic,pageNumber,perPage,sortOption){
      var url = URL.getInboxItems.replace('ID',id).replace('BOOL',isClinic).replace('PAGE',pageNumber).replace('PER_PAGE',perPage).replace('SORT_OPTION',sortOption).replace('MAILBOXTYPE','archive');
      return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
    },
       fetchArchiveItemsCA_HCP: function(id,isClinic,clinicid,pageNumber,perPage,sortOption){
      var url = URL.getInboxItemsCA.replace('ID',id).replace('BOOL',isClinic).replace('CLINICID',clinicid).replace('PAGE',pageNumber).replace('PER_PAGE',perPage).replace('SORT_OPTION',sortOption).replace('MAILBOXTYPE','archive');
      return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
    },

    getMessageBodyService: function(id){
      var url = URL.getMessageBody.replace('MESSAGEID',id);
      return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
    },
    
   
      addToArchive: function(data){
       // var url = URL.archiveMessages.replace('ID',userid).replace('MSG_ID',messageid).replace('ISARCHIVED',isarchived).replace('ISREAD',isread);
        var url = URL.archiveMessages;
       return $http.post(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
       
      },
      markAsReadUnread: function(data){
       var url = URL.markReadUnread;
         return $http.post(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        }); 
      },
      
      getUnreadMessagesCount: function(id,isClinic){
        var url = URL.getUnreadCount.replace('ID',id).replace('BOOL',isClinic);
         return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
       getUnreadMessagesCountCA: function(id,isClinic,clinicid){
        var url = URL.getUnreadCountCA.replace('ID',id).replace('BOOL',isClinic).replace('CLINICID',clinicid);
         return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
   /*   gettestthreaddata: function(id,rootid,bool,clinicid,isarchived,mailtype){
        var url = URL.getThreaddata.replace('ID',id).replace('ROOTID',rootid).replace('BOOL',bool).replace('CLINICID',clinicid).replace('ISARCHIVED',isarchived).replace('MAIL_TYPE',mailtype);
        console.log("checking url");
        console.log(url);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },*/
     getthreaddata: function(id,rootid,userid,clinicid){
        var url = URL.getThreaddata.replace('ID',id).replace('ROOTID',rootid).replace('USERID',userid).replace('CLINICID',clinicid);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
  };
     }]);