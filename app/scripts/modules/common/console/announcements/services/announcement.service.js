'use strict';

angular.module('hillromvestApp')
  .factory('announcementservice',['$http', 'headerService', 'URL', 'deviceDetector', function ($http, headerService, URL, deviceDetector) {
    return {

deleteAnnouncement : function(id){
 var url = URL.deleteAnnouncement.replace('ID',id);
             return $http.post(url, id, {
           headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
     
      },
      getPatientType : function(){
        var url = URL.getPatientType;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
  updateAnnouncement : function(data){
   var url = URL.updateAnnouncements;
          return $http.post(url, data, {
           headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      uploadfile : function(file){
          var fd = new FormData();
          var url = URL.uploadfile;
          angular.forEach(file,function(fil){
          fd.append('uploadfile',fil);
           });
           return $http.post(url, fd, {
          headers: headerService.getHeaderforUpload()
        }).success(function(response) {
          return response;
        });
      },
      geteditdetails : function(id){
var url = URL.editAnnouncement.replace('ID',id);
return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      createAnnouncement : function(data){
         
           var url = URL.createAnnouncement;
        return $http.post(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      ListAllAnnouncement : function(pageNumber,perPage,sortOption,usertype){
       
           var url = URL.listAllAnnouncements.replace('PAGE',pageNumber).replace('PER_PAGE',perPage).replace('SORT_OPTION',sortOption).replace('USER_TYPE',usertype);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      ListAnnouncement : function(pageNumber,perPage,sortOption,usertype,userId,clinicid){
           var url = URL.listAnnouncements.replace('PAGE',pageNumber).replace('PER_PAGE',perPage).replace('SORT_OPTION',sortOption).replace('USER_TYPE',usertype).replace('USERID',userId).replace('CLINICID',clinicid);
      return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }, 
      ListAnnouncementPatient: function(pageNumber,perPage,sortOption,usertype,userId){
           var url = URL.listAnnouncementsPatient.replace('PAGE',pageNumber).replace('PER_PAGE',perPage).replace('SORT_OPTION',sortOption).replace('USER_TYPE',usertype).replace('USERID',userId);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }, 

      DownloadAsPDF : function(filename){
        var windowReference = "";
        var userAgent = window.navigator.userAgent;
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || deviceDetector.browser == 'safari') {
        windowReference = window.open();
      }
        var url = URL.downloadPdf.replace('FILE_NAME',filename);
        return $http.get(url, {
          headers: headerService.getHeaderForPdf(),
          responseType: 'arraybuffer'
        }).success(function(response) {
         var URL = window.URL || window.webkitURL;
                var byteArray = new Uint8Array(response);
                var blob = new Blob([byteArray], { type: 'application/pdf' });
                if ((window.navigator && window.navigator.msSaveOrOpenBlob) || (userAgent.indexOf("android") > -1)){
                    window.navigator.msSaveOrOpenBlob(blob);
                }
                else if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || deviceDetector.browser == 'safari') {
                 //Safari & Opera iOS
                  var objectUrl = URL.createObjectURL(blob);

                     windowReference.location = objectUrl; 
                }

                else {
                    var objectUrl = URL.createObjectURL(blob);
                    window.open(objectUrl);
                    /* windowReference.location = objectUrl; */
                }
    
        });
    
      } 

      
        };
}]);