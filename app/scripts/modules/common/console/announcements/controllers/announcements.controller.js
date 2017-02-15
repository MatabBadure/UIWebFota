'use strict';
angular.module('hillromvestApp')
.controller('announcementsController', ['$scope', '$rootScope', '$state', '$stateParams', '$q', 'addressService', 'notyService', 'benchmarkingService', 'dateService', 'exportutilService', 'pdfServiceConstants', 'StorageService', 'loginConstants', 'announcementservice', 'sortOptionsService', 'clinicService',
	function($scope, $rootScope, $state, $stateParams, $q, addressService, notyService, benchmarkingService, dateService, exportutilService, pdfServiceConstants, StorageService, loginConstants, announcementservice,sortOptionsService,clinicService) {

$scope.checkedone = "";
$scope.checkedtwo = "";
/*$scope.announcementDesc = "";
$scope.startDate = "";
$scope.endDate = "";*/
$scope.resetsubmitted = false;
$scope.DeleteModal = false;
$scope.pageNumber = 1;
$scope.perPage = 5;
$scope.totalPages = 0;
$scope.totalElemenets = 0;
$scope.currentPageIndex = 1;
$scope.sortOption = "";
$scope.usertype = "";
$scope.announcementsList = {};
$scope.announcementsList.length="";
$scope.announcementId = "";
$scope.announcement = {};
$scope.specialities = "";
$scope.patientTypes = "";
$scope.announcement.patientType = "";
$scope.announcement.clinicType = "";
$scope.deleteID = "";
 $scope.nodatadiv = false;
 $scope.files =[];
 $scope.nonPDF = false;
$scope.sortAnnouncementList = sortOptionsService.getSortOptionsForAnnouncements();   
$scope.init = function(){	
   clinicService.getClinicSpeciality().then(function(response){
         $scope.specialities =  response.data.typeCode;
      }).catch(function(response){});
   announcementservice.getPatientType().then(function(response){
         $scope.patientTypes =  response.data.typeCode;
     
      }).catch(function(response){});
if($state.current.name === 'rcadminAnnouncements' || $state.current.name === 'adminAnnouncements' || $state.current.name === 'associateAnnouncements' || $state.current.name === 'customerserviceAnnouncements'){
$scope.sortType('latest');
}
else if($state.current.name === 'rcadminAnnouncementsEdit' || $state.current.name === 'adminAnnouncementsEdit'){
  $scope.announcementId = $stateParams.Id;
   $scope.sortType('latest');
  $scope.announcement = {};
  $scope.geteditAnnouncement();
}
else if($state.current.name === 'rcadminAnnouncementsNew' || $state.current.name === 'adminAnnouncementsNew'){
  $scope.announcement = {};
}

};
$scope.redirectBack = function(){
  if(StorageService.get('logged').role == 'ACCT_SERVICES'){
      $state.go('rcadminAnnouncements');
    }
    else if(StorageService.get('logged').role == 'ADMIN'){
      $state.go('adminAnnouncements');
    }
 };
      $scope.sortType = function(option){
var toggledSortOptions = {};
var toggleSortOptiondefault = {}; 
toggleSortOptiondefault.isDefault = true;
toggleSortOptiondefault.isDown = false;
toggleSortOptiondefault.isUp = false;
$scope.currentPageIndex = 1;
$scope.pageNumber = 1;
$scope.sortOption = "";
if(option === 'latest'){                        
      $scope.sortOption = sortConstant.announcementModifiedDate + "&asc=false";
      $scope.sortAnnouncementList.announcementsubject = toggleSortOptiondefault;
      $scope.sortAnnouncementList.announcementStartdate = toggleSortOptiondefault;
      $scope.sortAnnouncementList.announcementEnddate = toggleSortOptiondefault;
    $scope.sortAnnouncementList.nameOfannouncement = toggleSortOptiondefault;
    $scope.getAllAnnouncements();
    }
if(option === 'name'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortAnnouncementList.nameOfannouncement);
      $scope.sortAnnouncementList.nameOfannouncement = toggledSortOptions;
      $scope.sortOption = sortConstant.announcementName + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.sortAnnouncementList.announcementsubject = toggleSortOptiondefault;
      $scope.sortAnnouncementList.announcementStartdate = toggleSortOptiondefault;
      $scope.sortAnnouncementList.announcementEnddate = toggleSortOptiondefault;
    $scope.getAllAnnouncements();
    }

if(option === 'subject'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortAnnouncementList.announcementsubject);
      $scope.sortAnnouncementList.announcementsubject = toggledSortOptions;
      $scope.sortOption = sortConstant.announcementSubject + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.sortAnnouncementList.announcementStartdate = toggleSortOptiondefault;
      $scope.sortAnnouncementList.announcementEnddate = toggleSortOptiondefault;
      $scope.sortAnnouncementList.nameOfannouncement = toggleSortOptiondefault;
$scope.getAllAnnouncements();
    }
if(option === 'startDate'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortAnnouncementList.announcementStartdate);
      $scope.sortAnnouncementList.announcementStartdate = toggledSortOptions;
      $scope.sortOption = sortConstant.announcementStartDate + sortOptionsService.getSortByASCString(toggledSortOptions);
   $scope.sortAnnouncementList.announcementsubject = toggleSortOptiondefault;
      $scope.sortAnnouncementList.announcementEnddate = toggleSortOptiondefault;
      $scope.sortAnnouncementList.nameOfannouncement = toggleSortOptiondefault;
$scope.getAllAnnouncements();
}
   if(option === 'endDate'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortAnnouncementList.announcementEnddate);
      $scope.sortAnnouncementList.announcementEnddate = toggledSortOptions;
      $scope.sortOption = sortConstant.announcementEndDate + sortOptionsService.getSortByASCString(toggledSortOptions);
     $scope.sortAnnouncementList.announcementsubject = toggleSortOptiondefault;
      $scope.sortAnnouncementList.announcementStartdate = toggleSortOptiondefault;
      $scope.sortAnnouncementList.nameOfannouncement = toggleSortOptiondefault;
$scope.getAllAnnouncements();
    }  
  };
      $scope.getAllAnnouncements = function(){
        var usertype = 'ADMIN';
       
announcementservice.ListAllAnnouncement($scope.pageNumber,$scope.perPage,$scope.sortOption,usertype).then(function(response){
     
       $scope.totalPages = response.data.Announcement_List.totalPages;
      $scope.totalElements = response.data.Announcement_List.totalElements;
      $scope.announcementsList = response.data.Announcement_List.content;
     
      if($scope.announcementsList.length == 0){
        $scope.nodatadiv = true;
      }
    }).catch(function(response){
      notyService.showError(response);
    });
      }; 
      $scope.announcementPagination = function(track){
        var usertype = 'ADMIN';
          if (track !== undefined) {
            if (track === "PREV" && $scope.currentPageIndex > 1) {
              $scope.currentPageIndex--;
            } else if (track === "NEXT" && $scope.currentPageIndex < $scope.totalPages) {
              $scope.currentPageIndex++;
            } else {
              return false;
            }
          } else {
            $scope.currentPageIndex = 1;
          } 
          announcementservice.ListAllAnnouncement($scope.currentPageIndex,$scope.perPage,$scope.sortOption,usertype).then(function(response){
    
       $scope.totalPages = response.data.Announcement_List.totalPages;
      $scope.totalElements = response.data.Announcement_List.totalElements;
      $scope.announcementsList = response.data.Announcement_List.content;
    
      if($scope.announcementsList.length == 0){
        $scope.nodatadiv = true;
      }
    }).catch(function(response){
      notyService.showError(response);
    });
      };
$scope.editAnnouncement = function()
{
announcementservice.editAnnouncement().then(function(response){
     
    }).catch(function(response){
      notyService.showError(response);
    });
};
$scope.geteditAnnouncement = function(){
  announcementservice.geteditdetails($scope.announcementId).then(function(response){

      $scope.announcementFileTempName = response.data.Announcement.pdfFilePath;
      $scope.announcementFileName = $scope.announcementFileTempName.split("/").pop();
      $scope.announcement = response.data.Announcement;
       if($scope.announcement.sendTo == 'Patient'){
       $scope.checkedtwo = false;
         $scope.checkedone = true;
       $scope.announcement.clinic = undefined;
       $scope.announcement.clinicType == undefined;
       }
       if($scope.announcement.sendTo == 'Clinic'){
       $scope.checkedone = false;
     $scope.checkedtwo = true;
       $scope.announcement.patientType == undefined;
       }
      /*if($scope.announcement.sendTo == 'All'){
        $scope.checkedtwo = true;
       $scope.checkedone = true;
       $scope.announcement.clinic = 'All';
         $scope.announcement.patientType = 'All';
      }*/
      if($scope.announcement.clinicType == 'All'){
$scope.announcement.clinic = 'All';
$scope.checkedtwo = true;
      }
      else {
      $scope.announcement.clinic = 'Specialty';
      $scope.checkedtwo = true;
      }
    /* if($scope.announcement.patientType == 'All'){
        $scope.checkedone = true;
        $scope.checkedtwo = false;
       $scope.announcement.clinic = undefined;
       $scope.announcement.clinicType == undefined;
        
      }*/
      if(($scope.announcement.sendTo == 'Patient') && ($scope.announcement.patientType == 'All')){
        $scope.checkedone = true;
        $scope.checkedtwo = false;
       $scope.announcement.clinic = undefined;
       $scope.announcement.clinicType == undefined;
        
      }
      if(($scope.announcement.sendTo == 'Patient') && ($scope.announcement.patientType != 'All')){
        $scope.checkedone = true;
        $scope.checkedtwo = false;
       $scope.announcement.clinic = undefined;
       $scope.announcement.clinicType == undefined;
        
      }
       if($scope.announcement.patientType == 'All' && $scope.announcement.clinicType == 'All'){
        $scope.checkedone = true;
        $scope.checkedtwo = true;
        $scope.announcement.clinic = 'All';

      }
      if($scope.announcement.patientType){
        $scope.checkedone = true;
      }
      
       $scope.filePath = $scope.announcementFileTempName;
    }).catch(function(response){
      notyService.showError(response);
    });

};
$scope.deleteAnnouncement = function(){
 
announcementservice.deleteAnnouncement($scope.deleteID).then(function(response){
      
      notyService.showMessage(response.data.announcementMsg, 'success'); 
      $scope.DeleteModal = false;
      $scope.getAllAnnouncements();
    }).catch(function(response){
      notyService.showError(response);
       $scope.DeleteModal = false;
    });
};
$scope.showModalOverwriteCall = function(){
 $scope.showModalOverwrite = true;
};
$scope.HandleBrowseClick = function()
{   
  $scope.showModalOverwrite = false;
  $scope.fileinput = document.getElementById("browse");
    $scope.fileinput.click();
};

$scope.Handlechange = function(element)
{
   $scope.fileinput = document.getElementById("browse");
    var textinput = document.getElementById("filename");
    textinput.value = $scope.fileinput.value;
     $scope.files = element.files;
    var ext = $scope.files[0].name.split('.');
    for(var i =0;i<ext.length;i++){
      if(ext[i]=="pdf"){
$scope.uploadFile();
$scope.nonPDF = false;
 break;
}
else{
  $scope.nonPDF = true;
}
    }  
};
/*scope.setFiles = function(element) {
    scope.$apply(function(scope) {
      console.log('files:', element.files);
      // Turn the FileList object into an Array
        scope.files = []
        for (var i = 0; i < element.files.length; i++) {
          scope.files.push(element.files[i])
        }
      scope.progressVisible = false
      });
    };*/
$scope.setRoute = function(flag){
$state.go($state.current.name+'New',{'Id':$stateParams.Id});
};
$scope.vm = {};
$scope.vm.myClick = function($event) {
        if(!$event){
      $scope.announcement.patientType = undefined;
    }
        $scope.checkedone = $event;
    };
    $scope.vm.myClickClinic= function($event) {
        if(!$event){
          $scope.announcement.clinicType = undefined;
          $scope.announcement.clinic = undefined;
        }

        $scope.checkedtwo = $event;
       
    };


    $scope.endDateCheck = function()
{
  $scope.startdatecheck = $scope.announcement.startDate;
  $scope.enddatecheck = $scope.announcement.endDate;
  if(new Date ($scope.enddatecheck) < new Date($scope.startdatecheck))
  {
     $scope.dateFlag = true;
  }
  else
  {
    $scope.dateFlag = false;
  }
  
  }



$scope.showPatientUpdateModal = function(form){
  
   if((form.$invalid )||($scope.checkedone == false && $scope.checkedtwo == false) || ($scope.checkedtwo == true && $scope.announcement.clinic == undefined) || ($scope.checkedtwo == true && $scope.announcement.clinic == 'Speciality' && $scope.announcement.clinicType == undefined) || ($scope.checkedone == true && $scope.announcement.patientType == undefined) || ($scope.files.length == 0) || ($scope.dateFlag == true) || ($scope.nonPDF == true)){
        $scope.resetsubmitted = true;
        $scope.showModal = false;
        return false;
      }
      else{
$scope.showModal = true;
$scope.resetsubmitted = false;
}
};
$scope.showannouncementUpdateModal = function(form){

   if((form.$invalid )||($scope.checkedone == false && $scope.checkedtwo == false) || ($scope.checkedtwo == true && $scope.announcement.clinic == undefined) || ($scope.checkedtwo == true && $scope.announcement.clinic == 'Speciality' && $scope.announcement.clinicType == undefined) || ($scope.checkedone == true && $scope.announcement.patientType == undefined) || ($scope.dateFlag == true) || ($scope.nonPDF == true)){
        $scope.resetsubmitted = true;
        $scope.showModalUpdate = false;
        return false;
      }
      else{
$scope.showModalUpdate = true;
$scope.resetsubmitted = false;
}
};
$scope.clearAll = function(){
      $scope.announcement.patientType = undefined;
          $scope.announcement.clinic = undefined;
          $scope.announcement.clinicType = undefined;
};
$scope.close = function(){
$scope.showModal = false;
$scope.showModalUpdate = false;
$scope.DeleteModal = false;

};
$scope.closeoverwrite = function(){
$scope.showModalOverwrite = false;
$scope.showModal = false;
$scope.showModalUpdate = false;
$scope.filePath = $scope.announcementFileTempName;
};
$scope.showDeleteModal = function(announcementID){
  $scope.deleteID = announcementID;
  
$scope.DeleteModal = true;
};
$scope.uploadFile = function(){
  
announcementservice.uploadfile($scope.files).then(function(response){

  $scope.filePath = response.data.filepath;
      
      $scope.showModalOverwrite = false;
    }).catch(function(response){
       $scope.showModalOverwrite = false;
      notyService.showError(response);
    });
};
$scope.edit = function(id){
$scope.announcementId = id;

if(StorageService.get('logged').role == 'ACCT_SERVICES'){
$state.go('rcadminAnnouncementsEdit',{'Id':id});
}
else if(StorageService.get('logged').role == 'ADMIN'){
$state.go('adminAnnouncementsEdit',{'Id':id});
}
};
$scope.createAnnouncement = function(){
      var resEnd = [];
      var resStart =[];
      var clinictype = "";

  var sendTo = "";
  if($scope.announcement.clinic && $scope.announcement.patientType){
sendTo = "All";
}  
  else if($scope.announcement.clinic && !$scope.announcement.patientType){
sendTo = "Clinic";
  }
  else if(!$scope.announcement.clinic && $scope.announcement.patientType){
   sendTo = "Patient"; 
  }
  if($scope.announcement.clinic == "All"){
clinictype = "All";
  }
  else{
  clinictype = $scope.announcement.clinicType; 
  }

  var startDate = "";
  var endDate = "";

   resStart = $scope.announcement.startDate.toString().split("/");
  startDate = resStart[2]+"-"+resStart[0]+"-"+resStart[1];

   resEnd = $scope.announcement.endDate.toString().split("/");
  endDate = resEnd[2]+"-"+resEnd[0]+"-"+resEnd[1];
var data = {
  "name" : $scope.announcement.name, 
  "subject":$scope.announcement.subject, 
  "startDate":startDate, 
  "endDate":endDate, 
  "sentTo":sendTo,
  "patientType":$scope.announcement.patientType,
  "clicicType":clinictype,
  "pdfFilePath":$scope.filePath
};
announcementservice.createAnnouncement(data).then(function(response){
      notyService.showMessage(response.data.statusMsg);
      $scope.showModal = false;
      if(StorageService.get('logged').role == 'ACCT_SERVICES'){
      $state.go('rcadminAnnouncements');
    }
    else if(StorageService.get('logged').role == 'ADMIN'){
      $state.go('adminAnnouncements');
    }
    }).catch(function(response){
      notyService.showError(response);
       $scope.showModal = false;
    });
};
$scope.updateAnnouncement = function(){
      var resEnd = [];
      var resStart =[];
      var clinictype = "";

  var sendTo = "";
  if($scope.announcement.clinic && $scope.announcement.patientType){
sendTo = "All";
  }
  else if($scope.announcement.clinic && !$scope.announcement.patientType){
sendTo = "Clinic";
  }
  else if(!$scope.announcement.clinic && $scope.announcement.patientType){
   sendTo = "Patient"; 
  }
  if($scope.announcement.clinic == "All"){
clinictype = "All";
  }
  else{
  clinictype = $scope.announcement.clinicType; 
  }
 
  var startDate = "";
  var endDate = "";

   resStart = $scope.announcement.startDate.toString().split("/");
  startDate = resStart[2]+"-"+resStart[0]+"-"+resStart[1];

   resEnd = $scope.announcement.endDate.toString().split("/");
  endDate = resEnd[2]+"-"+resEnd[0]+"-"+resEnd[1];

  var data ={ 
    "id" : $stateParams.Id, 
  "name" :  $scope.announcement.name,
   "subject":$scope.announcement.subject,
    "startDate":startDate,
     "endDate":endDate, 
     "sentTo":sendTo,
     "patientType":$scope.announcement.patientType,
     "clicicType":clinictype,
  "pdfFilePath":$scope.filePath
};

/*var data = {
  "name" : $scope.announcement.name, 
  "subject":$scope.announcement.subject, 
  "startDate":startDate, 
  "endDate":endDate, 
  "sentTo":sendTo,
  "patientType":$scope.announcement.patientType,
  "clicicType":clinictype,
  "pdfFilePath":$scope.filePath
};*/
announcementservice.updateAnnouncement(data).then(function(response){
      notyService.showMessage(response.data.announcementMsg);
    $scope.showModalUpdate = false;
      if(StorageService.get('logged').role == 'ACCT_SERVICES'){
      $state.go('rcadminAnnouncements');
    }
    else if(StorageService.get('logged').role == 'ADMIN'){
      $state.go('adminAnnouncements');
    }
    }).catch(function(response){
      notyService.showError(response);
      $scope.showModalUpdate = false;
    });
};

$scope.init();
	}]);