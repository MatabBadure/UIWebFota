'use strict';
/**
 * @ngdoc service
 * @name UserService
 * @description A service that makes ajax call to REST api to perform operations related to Hill-Rom-users.
 *
 */
angular.module('hillromvestApp')
  .factory('fotaService',['$http', 'headerService', 'URL','StorageService', function($http, headerService, URL,StorageService) {
    return {
      
       create: function(data) {
        // add fotaVerify URL in app.constants.js
         var url  = URL.fotaVerify;
        return $http.post(url,data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
       uploadfile : function(file){
          var fd = new FormData();
           // add uploadfileFota URL in app.constants.js
          var url = URL.uploadfileFota;
          //the below code was added to match the format that was expected from backend for announcements pdf files
          angular.forEach(file,function(fil){
          fd.append('uploadfile',fil);
           });
           return $http.post(url, fd, {
          headers: headerService.getHeaderforUpload()
        }).success(function(response) {
          return response;
        });
      },
     /* checkExistingRecord : function(partNoV){
           // add uploadfileFota URL in app.constants.js
          var url = URL.getOldVersion.replace('partNoV',partNoV);
           return $http.post(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },*/
      softDelete : function(partNoD,isOldFileD){
        // add uploadfileFota URL in app.constants.js
          var url = URL.softDelete.replace('partNoD',partNoD).replace('isOldFileD',isOldFileD);
           return $http.post(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      CRC32Calculation : function(data){
        // add Calculate CRC 32 URL in app.constants.js
         var url  = URL.fotaCRC32Calculation;
        return $http.post(url,data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });

      },
      approverCRC32 : function(data){
        // add Calculate CRC 32 URL in app.constants.js
         var url  = URL.approverCRC32;
        return $http.post(url,data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });

      },
      getFirmwareList: function(page,perpage,filter,searchItem){
          var url = URL.getFirmwareList.replace('PAGE',page).replace('PER_PAGE',perpage).replace('STATUS',filter).replace('SEARCHSTRING',searchItem);
           return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });        
      },
      getFirmwareInfo: function(id){
          var url = URL.getFirmwareInfo.replace('ID',id);
           return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });        
      },
     getDownloadFirmware:function(id){
          var url = URL.firmwareDownload.replace('ID',id);
           return $http.get(url, {
          headers: headerService.getHeaderforUpload(),responseType: "arraybuffer"
        });   
      },

       firmwareSoftDelete: function(id,userRole){
          var url = URL.firmwareSoftDelete.replace('ID',id).replace('userRole',userRole);
           return $http.delete(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });        
      },
       getDeviceList: function(page,perpage,filter,searchItem){
          var url = URL.fotaDeviceList.replace('PAGE',page).replace('PER_PAGE',perpage).replace('STATUS',filter).replace('SEARCHSTRING',searchItem);
           return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });        
      }
  };
  }]);