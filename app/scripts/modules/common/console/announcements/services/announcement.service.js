'use strict';

angular.module('hillromvestApp')
  .factory('announcementservice',['$http', 'headerService', 'URL', function ($http, headerService, URL) {
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
    console.log("before url");
    var url = URL.updateAnnouncements;
        console.log("after url");
        console.log(url);
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
      ListAnnouncement : function(pageNumber,perPage,usertype,userId){
        console.log("userID");
        console.log(userId);
           var url = URL.listAnnouncements.replace('PAGE',pageNumber).replace('PER_PAGE',perPage).replace('USER_TYPE',usertype).replace('USERID',userId);
        console.log(url);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }, 
      DownloadAsPDF : function(filename){
        var url = URL.downloadPdf.replace('FILE_NAME','upload9_Test');
        return $http.get(url, {
          headers: headerService.getHeaderForPdf(),
          responseType: 'arraybuffer'
        }).success(function(response) {
          //var fileName = "test.pdf";
          //var a = document.createElement("a");
          //document.body.appendChild(a);
          var URL = window.URL || window.webkitURL;
          var file = new Blob([response], {type: 'application/pdf'});
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          //a.href = fileURL;
         //a.download = fileName;
         //a.click();
        });
      } 
      
        };
}]);