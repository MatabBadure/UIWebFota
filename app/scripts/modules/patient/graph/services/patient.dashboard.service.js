'use strict';
/**
 * @ngdoc service
 * @name patientService
 * @description
 *
 */
angular.module('hillromvestApp')
  .factory('patientDashBoardService',['$http', 'headerService','URL','$rootScope', function ($http, headerService, URL,$rootScope) {
    return {

      /**
      * @ngdoc method
      * @name getHMRGraphPoints
      * @description To get array of data points for HMR data graph.
      *
      */
      getHMRGraphPoints: function(id, deviceTypeforGraph, fromTimeStamp, toTimeStamp, duration, date) {
        var url = patient.graph.baseURL;
        url  = url + '/' + id + '/therapyData';
        if ( fromTimeStamp !== undefined && toTimeStamp !== undefined && duration !== undefined) {
          url = url + '?from=' + fromTimeStamp + '&to=' + toTimeStamp + '&duration=' + duration;
        } else if(date !== undefined){
          url = url + '?date=' + date;
        }

         url = url +'&deviceType='+ deviceTypeforGraph; 
         //url = url +'&deviceType='+localStorage.getItem('deviceType'); 
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getAdherenceTrendGraphPoints: function(id, deviceTypeforGraph, fromTimeStamp, toTimeStamp, duration, date) {
        var url = patient.graph.baseURL;
        url  = url + '/' + id + '/adherenceTrendGraphData';
        if ( fromTimeStamp !== undefined && toTimeStamp !== undefined && duration !== undefined) {
          url = url + '?from=' + fromTimeStamp + '&to=' + toTimeStamp + '&duration=' + duration;
        } else if(date !== undefined){
          url = url + '?date=' + date;
        }

        url = url +'&deviceType='+ deviceTypeforGraph; 
        // url = url +'&deviceType='+localStorage.getItem('deviceType'); 
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getHMRBarGraphPoints: function(id, date) {
        var url = patient.graph.baseURL;
        url  = url + '/' + id + '/therapyData';
        url = url + '?from=' + date + '&to=' + date ;
          url = url +'&deviceType='+localStorage.getItem('deviceType'); 
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },


      /**
      * @ngdoc method
      * @name getMissedTherapy
      * @description To get missed therapy for defined time duration.
      *
      */
      //The service will be changed based on the url and parameters
      getMissedTherapy: function(id, fromTimeStamp, toTimeStamp, groupBy, date) {
        var url = admin.hillRomUser.baseURL;
        url  = url + '/' + id + '/missedTherapy';
        if ( fromTimeStamp !== undefined && toTimeStamp !== undefined && groupBy !== undefined) {
          url = url + '?from=' + fromTimeStamp + '&to=' + toTimeStamp + '&groupBy=' + groupBy;
        } else if(date !== undefined){
          url = url + '?date=' + date;
        }
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },


      getMissedTherapyDaysCount: function(id) {
        var url = patient.graph.baseURL;
        url  = url + '/' + id + '/missedTherapyCount';
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
      * @ngdoc method
      * @name getMissedTherapy
      * @description To get missed therapy for defined time duration.
      *
      */
      //The service will be changed based on the url and parameters
      getHMRrunAndScoreRate: function(id, timeStamp) {
        var url = patient.graph.baseURL;
        url  = url + '/' + id + '/compliance?date=' + timeStamp;
        url = url +'&deviceType='+localStorage.getItem('deviceType');
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
      * @ngdoc method
      * @name getcomplianceGraphPoints
      * @description To get array of data points for compliance graph.
      *
      */
      getcomplianceGraphPoints: function(id, fromTimeStamp, toTimeStamp, groupBy) {
        var url = admin.hillRomUser.baseURL;
        url  = url + '/' + id + '/complianceLevel';
        if ( fromTimeStamp !== undefined && toTimeStamp !== undefined && groupBy !== undefined) {
          url = url + '?from=' + fromTimeStamp + '&to=' + toTimeStamp + '&groupBy=' + groupBy;
        } else if(date !== undefined){
          url = url + '?date=' + date;
        }
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },


      /**
      * @ngdoc method
      * @name getAllNotifications
      * @description To get list of notifications for patient user.
      *
      */
      getAllNotifications: function(id) {
        var url = admin.hillRomUser.baseURL;
        url  = url + '/' + id + '/notifications ';
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
      * @ngdoc method
      * @name updateNotificationStatus
      * @description To update notification's status.
      *
      */
      updateNotificationStatus: function(id,data) {
        var url = patient.notification.updateNotificationStatus;
        url  = url + '/' + id ;
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },


      getAdeherenceData : function(userId, startDate, endDate){
        var url = URL.getAdeherenceData.replace('USERID', userId).replace('FROMDATE', startDate).replace('TODATE', endDate).replace('DEVICETYPE',localStorage.getItem('deviceType'));
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }, 


      getcomplianceGraphData: function(id, deviceTypeforGraph, fromTimeStamp, toTimeStamp, duration, date){
        var url = patient.graph.baseURL;
        url  = url + '/' + id + '/complianceGraphData';
      
        if ( fromTimeStamp !== undefined && toTimeStamp !== undefined && duration !== undefined) {
          url = url + '?from=' + fromTimeStamp + '&to=' + toTimeStamp + '&duration=' + duration;
        } else if(date !== undefined){
          url = url + '?date=' + date;
        } 

        url = url +'&deviceType='+ deviceTypeforGraph; 
       // url = url +'&deviceType='+localStorage.getItem('deviceType');    
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      convertSVGToImg : function(data){
        var url = "/api/graph/pdfDownload";
        return $http.post(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
    };
  }]);