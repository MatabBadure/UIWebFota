'use strict';
angular.module('hillromvestApp')
.controller('messagecontroller', [ '$scope','$state','$filter','$compile','$rootScope','$stateParams','messageService', 'dateService','patientService','DoctorService','StorageService','notyService','toastr','clinicService','clinicadminService','sortOptionsService',
  function ($scope,$state,$filter,$compile,$rootScope,$stateParams,messageService,dateService,patientService,DoctorService,StorageService,notyService,toastr,clinicService,clinicadminService,sortOptionsService) {
   $scope.dummyvalue = 12 ;
   $scope.messageAttributes = {};	
   $scope.ReplymessageAttributes = {};
   $scope.selectedClinics = [];
   $scope.checkedArray = [];
   $scope.checkedArrayforRead = [];
   $scope.checkedArrayforUnRead = [];
   $scope.readflag = false;
   $scope.unreadflag = false;
   $scope.selectedClinicForCA = [];
    $scope.selectedClinicForHCP = [];
    $scope.nodataflag = false;
    $scope.counter = 0;
    $scope.noarchivemessageavailable = false;
    $scope.nosentmessageavailable = false;
    $scope.replyFlag = false;
    $scope.newCounterInbox = 0;
    $scope.newCounterArchive = 0;
    $scope.newCounterSent = 0;
    $scope.showNoMessageOnReply = false;
      $scope.showmodalOnReply = false;
      $scope.replyattributes = {};
      $scope.replyattributes.replyData = "";
  /* console.log("clinic ID");
   console.log(StorageService.get('logged').userId);*/
    $scope.getClinicsAssociatedToHCP = function(){
    clinicadminService.getClinicsAssociated(StorageService.get('logged').userId).then(function(response){
      if(response.data && response.data.clinics){
        $scope.clinics = $filter('orderBy')(response.data.clinics, "name");
        if($stateParams.clinicId){
          $scope.selectedClinicForCA = commonsUserService.getSelectedClinicFromList($scope.clinics, $stateParams.clinicId);
        $scope.switchClinic($scope.selectedClinicForCA);
        }else if($scope.clinics && $scope.clinics.length > 0){
          $scope.selectedClinicForCA=angular.copy($scope.clinics[0]);
          //$rootScope.ClinicForCA = $scope.selectedClinicForCA;
          $scope.switchClinic($scope.clinics[0]);
        }
        //$scope.switchClinic($scope.clinics[0]);
      }
    }).catch(function(response){
    
    });
  };
  $scope.getClinicsForHCP = function() {
    var userId = StorageService.get('logged').userId;
    DoctorService.getClinicsAssociatedToHCP(userId).then(function(response){
      //$scope.getDashboardForHCPOrPatient(response, userId);
      if(response.data && response.data.clinics){
      $scope.clinicsHCP = $filter('orderBy')(response.data.clinics, "name");
     /* if($stateParams.clinicId !== undefined && $stateParams.clinicId !== null){
         $scope.selectedClinicForHCP = commonsUserService.getSelectedClinicFromList($scope.clinicsHCP, $stateParams.clinicId);
       $scope.switchClinicHCP($scope.selectedClinicForHCP);
     
      }*/
        $scope.selectedClinicForHCP = angular.copy($scope.clinicsHCP[0]);
        $scope.switchClinicHCP($scope.selectedClinicForHCP);
        //$rootScope.ClinicForHCP = $scope.selectedClinicForHCP;
    }
      }).catch(function(response){
       
      });
  };
  $scope.initclinicsList = function(){
   patientService.getClinicsLinkedToPatient(StorageService.get('logged').patientID).then(function(response){
         $scope.clinicsListdata = response.data;
         $scope.clinicsList=[];
         for(var i=0;i<$scope.clinicsListdata.clinics.length;i++){
         $scope.clinicsList.push($scope.clinicsListdata.clinics[i].name);
         }
         $scope.SelectedClinic = angular.copy($scope.clinicsListdata.clinics[0]);
        $scope.processClinics($scope.clinicsList);
        //$scope.processClinics($scope.clinicsListdata.clinics);
       });
 };

   $scope.getAllPatientsByClinicId = function(){
    clinicService.getClinicAssoctPatients($scope.selectedClinicForCA.id,1,20).then(function(response){
      $scope.patients = [];
      angular.forEach(response.data.patientUsers, function(patientList){
        patientList.patient.hcp = patientList.hcp;
        $scope.patients.push(patientList.patient);

      //  $scope.total = (response.headers()['x-total-count']) ? response.headers()['x-total-count'] : $scope.patients.length;
      $scope.processpatients($scope.patients);
      });
    }).catch(function(response){
    });  
  };
    if(StorageService.get('logged').role === 'PATIENT'){
      $scope.initclinicsList();
   }
   if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
      $scope.getClinicsAssociatedToHCP();
      $scope.getAllPatientsByClinicId();
   }
   if(StorageService.get('logged').role === 'HCP'){
    $scope.getClinicsForHCP();
   }
   /*****Get unread messages *****/
   $scope.getunreadcount = function(){
  if(StorageService.get('logged').role === 'PATIENT'){
  messageService.getUnreadMessagesCount(StorageService.get('logged').patientID,0).then(function(response){
if(response.data.length){
if(response.data[0][0] == false){
  $scope.UnreadMessages = response.data[0][1];
}
else{
  $scope.UnreadMessages = 0;
}
}
else {
  $scope.UnreadMessages = 0;
}
   }).catch(function(response){
    if(response.message == 'No message available'){
    $scope.UnreadMessages = 0;  
  }
    });

}
if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
  messageService.getUnreadMessagesCountCA(StorageService.get('logged').userId,1,$scope.selectedClinicForCA.id).then(function(response){
if(response.data){
if(response.data[0][0] == false){
  $scope.UnreadMessages = response.data[0][1];
}
else{
  $scope.UnreadMessages = 0;
}
}
else {
  $scope.UnreadMessages = 0;
}
   }).catch(function(response){
    if(response.message == 'No message available'){
    $scope.UnreadMessages = 0;  
  }
    });

}
if(StorageService.get('logged').role === 'HCP'){
  messageService.getUnreadMessagesCountCA(StorageService.get('logged').userId,1,$scope.selectedClinicForHCP.id).then(function(response){
if(response.data){
if(response.data[0][0] == false){
  $scope.UnreadMessages = response.data[0][1];
}
else{
  $scope.UnreadMessages = 0;
}
}
else {
  $scope.UnreadMessages = 0;
}
   }).catch(function(response){
    if(response.message == 'No message available'){
    $scope.UnreadMessages = 0;  
  }
    });

}
};
//$scope.getunreadcount();
 /******For sorting the list of messages ******/
$scope.sortType = function(option){
var toggledSortOptions = {};
 var toggleSortOptiondefault = {}; 
        toggleSortOptiondefault.isDefault = true;
            toggleSortOptiondefault.isDown = false;
            toggleSortOptiondefault.isUp = false;
$scope.sortOption = "";
if(option === 'From'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortMessageList.from);
      $scope.sortMessageList.from = toggledSortOptions;
      $scope.sortOption = sortConstant.from + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.sortMessageList.subject = toggleSortOptiondefault;
      $scope.sortMessageList.date = toggleSortOptiondefault;
      $scope.Inbox();
    }
if(option === 'Subject'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortMessageList.subject);
      $scope.sortMessageList.subject = toggledSortOptions;
      $scope.sortOption = sortConstant.subject + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.sortMessageList.date = toggleSortOptiondefault;
      $scope.sortMessageList.from = toggleSortOptiondefault;
      $scope.Inbox();
    }
if(option === 'Date'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortMessageList.date);
      $scope.sortMessageList.date = toggledSortOptions;
      $scope.sortOption = sortConstant.date + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.sortMessageList.subject = toggleSortOptiondefault;
       $scope.sortMessageList.from = toggleSortOptiondefault;
      $scope.Inbox();
    }
          
  };
  $scope.sortTypeSentItems = function(option){
var toggledSortOptions = {};
$scope.SentsortOption = "";
var toggleSortOptiondefault = {}; 
        toggleSortOptiondefault.isDefault = true;
            toggleSortOptiondefault.isDown = false;
            toggleSortOptiondefault.isUp = false;
if(option === 'To'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortSentMessageList.to);
      $scope.sortSentMessageList.to = toggledSortOptions;
      if(StorageService.get('logged').role === 'PATIENT'){
      $scope.SentsortOption = sortConstant.sentTo + sortOptionsService.getSortByASCString(toggledSortOptions);
      }
      else if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
      $scope.SentsortOption = sortConstant.sentToCA + sortOptionsService.getSortByASCString(toggledSortOptions);
    }
    $scope.sortSentMessageList.subject = toggleSortOptiondefault;
      $scope.sortSentMessageList.date= toggleSortOptiondefault;
    $scope.SentItems();
    }
if(option === 'Subject'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortSentMessageList.subject);
      $scope.sortSentMessageList.subject = toggledSortOptions;
      $scope.SentsortOption = sortConstant.sentSubject + sortOptionsService.getSortByASCString(toggledSortOptions);
 $scope.sortSentMessageList.date= toggleSortOptiondefault;
$scope.sortSentMessageList.to= toggleSortOptiondefault;
  $scope.SentItems();
    }
if(option === 'Date'){                      
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortSentMessageList.date);
      $scope.sortSentMessageList.date = toggledSortOptions;
      $scope.SentsortOption = sortConstant.sentDate + sortOptionsService.getSortByASCString(toggledSortOptions);
   $scope.sortSentMessageList.subject= toggleSortOptiondefault;
    $scope.sortSentMessageList.to= toggleSortOptiondefault;
    $scope.SentItems();
    }
  };
  $scope.sortTypeArchive = function(option){
var toggledSortOptions = {};
$scope.sortOption = "";
var toggleSortOptiondefault = {}; 
        toggleSortOptiondefault.isDefault = true;
            toggleSortOptiondefault.isDown = false;
            toggleSortOptiondefault.isUp = false;
if(option === 'From'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortArchiveMessageList.from);
      $scope.sortArchiveMessageList.from = toggledSortOptions;
      $scope.sortOption = sortConstant.from + sortOptionsService.getSortByASCString(toggledSortOptions);
      $scope.sortArchiveMessageList.date = toggleSortOptiondefault;
       $scope.sortArchiveMessageList.subject = toggleSortOptiondefault;
      $scope.ArchiveBox();
    }
if(option === 'Subject'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortArchiveMessageList.subject);
      $scope.sortArchiveMessageList.subject = toggledSortOptions;
      $scope.sortOption = sortConstant.subject + sortOptionsService.getSortByASCString(toggledSortOptions);
       $scope.sortArchiveMessageList.date = toggleSortOptiondefault;
       $scope.sortArchiveMessageList.from = toggleSortOptiondefault;
      $scope.ArchiveBox();
    }
if(option === 'Date'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortArchiveMessageList.date);
      $scope.sortArchiveMessageList.date = toggledSortOptions;
      $scope.sortOption = sortConstant.date + sortOptionsService.getSortByASCString(toggledSortOptions);
       $scope.sortArchiveMessageList.subject = toggleSortOptiondefault;
       $scope.sortArchiveMessageList.from = toggleSortOptiondefault;
      $scope.ArchiveBox();
    }
          
  };
  /******End of sorting the list of messages ******/
  $scope.initialiseAllLists = function(){
 if(StorageService.get('logged').role === 'PATIENT'){
 $scope.initclinicsList();
   }
   if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
      $scope.getClinicsAssociatedToHCP();
    $scope.getAllPatientsByClinicId();
   }
   if(StorageService.get('logged').role === 'HCP'){
    $scope.getClinicsForHCP();
   }
 };
$scope.initialiseAllLists();
  $scope.init =function(){
  $scope.flag= 'inbox';
   $scope.replyattributes = {};
  $scope.PageNumber=1;
  $scope.currentPageIndex = 1;
  $scope.pageCount = 0;
  $scope.perPageCount = 5;
  $scope.totalMessages = 0;
   $scope.sentmessageList = '';
   $scope.readflag = false;
   $scope.unreadflag = false;
   $scope.submitted = false;
   $scope.nodataflag = false;
   $scope.noarchivedataflag = false;
   $scope.nosentdataflag = false;
      $scope.nodataflagCA = false;
   $scope.noarchivedataflagCA = false;
   $scope.nosentdataflagCA = false;
  $scope.nomessagebodyavailable = false;
  $scope.showNoMessageOnReply = false;
  $scope.showmodalOnReply = false;
  $scope.replyattributes.replyData = "";
   $scope.sortMessageList = sortOptionsService.getSortOptionsForMessages();
   $scope.sortSentMessageList = sortOptionsService.getSortOptionsForMessages();
   $scope.sortArchiveMessageList = sortOptionsService.getSortOptionsForMessages();
      $scope.initialiseAllLists();   
  // $scope.sortType('Date');
  $scope.sortOption = "";
   $scope.getunreadcount();
  $scope.sortType('Date');
 // $scope.Inbox();
$scope.SelectedPatientsID =[];
  $scope.SelectedClinicsID=[];
   $scope.localLang = {
        selectAll       : "Select all",
        selectNone      : "Select none",
        search          : "Type here to search...",
        nothingSelected : "Please Select the User",
        allSelected : "All Selected"
      };
      /******To get list of clinics associated with patient ******/
  };

/*******To set the menu item active on select ******/
$scope.isactive = function(value){
if(value == $scope.flag){
  return "selectclass";
}
else{
return "unselectclass";
}
};
/*******End of -To set the menu item active on select ******/
/******Switch tabs ******/
$scope.SwitchTabs = function(tabName){
  $scope.PageNumber=1;
  $scope.currentPageIndex = 1;
  $scope.pageCount = 0;
  $scope.perPageCount = 5;
  $scope.totalMessages = 0;
  $scope.isAllSelected = false;
  $scope.readflag = false;
  $scope.unreadflag = false;
   $scope.newCounterInbox = 0;
    $scope.newCounterSent = 0;
     $scope.newCounterArchive =0;
if(tabName == 'inbox'){
  $scope.getunreadcount();
  //$scope.sortType('Date');
$scope.Inbox();
}
if(tabName == 'archive'){
  $scope.sortTypeArchive('Date');
//$scope.ArchiveBox();
}
if(tabName == 'sentitems'){
  $scope.flag = 'sentitems';
  //$scope.SentItems();
    $scope.sortTypeSentItems('Date');
}
if(tabName == 'new'){
  $scope.flag = 'new';
   if(StorageService.get('logged').role === 'PATIENT'){
    $scope.initclinicsList();
   }
   else if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
    $scope.getAllPatientsByClinicId();
   }
}
};


$scope.ArchiveBox = function(){
$scope.incrementerArchive();
$scope.MessageDetails =null;

var toPassID = 0;
var isClinic = 0;
var tempDate = [];
$scope.totalMessages = 0;
if(StorageService.get('logged').role === 'PATIENT'){
toPassID = StorageService.get('logged').patientID;
isClinic = false;
messageService.fetchArchiveItems(toPassID,isClinic,$scope.PageNumber,$scope.perPageCount,$scope.sortOption).then(function(response){
$scope.ArchiveListRawData = response.data;
$scope.pageCount = $scope.ArchiveListRawData.totalPages;
$scope.totalMessages = $scope.ArchiveListRawData.totalElements;

$scope.ArchiveMessageList = angular.extend({},$scope.ArchiveMessageList, $scope.ArchiveListRawData.content);
    for(var i=0;i<$scope.ArchiveListRawData.content.length;i++){
    tempDate.push(dateService.getDateTimeFromTimeStamp($scope.ArchiveListRawData.content[i][4],patientDashboard.dateFormat ,'/'));
 }
 if($scope.ArchiveListRawData.content.length){
  for(var i=0;i<$scope.ArchiveListRawData.content.length;i++){
    $scope.ArchiveMessageList[i][4] = $scope.GetDateifToday(tempDate[i]);

}
}
 if($scope.totalMessages == 0){
  $scope.noarchivedataflagCA = true;
  $scope.noarchivemessageavailable = true;
 }

 }).catch(function(response){

      });
 $scope.flag= 'archive'; 
}
else if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
toPassID = StorageService.get('logged').userId; 
isClinic = 1;
messageService.fetchArchiveItemsCA_HCP(toPassID,isClinic,$scope.selectedClinicForCA.id,$scope.PageNumber,$scope.perPageCount,$scope.sortOption).then(function(response){
$scope.ArchiveListRawData = response.data;
$scope.pageCount = $scope.ArchiveListRawData.totalPages;
$scope.totalMessages = $scope.ArchiveListRawData.totalElements;

$scope.ArchiveMessageList = angular.extend({},$scope.ArchiveMessageList, $scope.ArchiveListRawData.content);
    for(var i=0;i<$scope.ArchiveListRawData.content.length;i++){
   tempDate.push(dateService.getDateTimeFromTimeStamp($scope.ArchiveListRawData.content[i][4],patientDashboard.dateFormat ,'/')); 
 }
  if($scope.ArchiveListRawData.content.length){
  for(var i=0;i<$scope.ArchiveListRawData.content.length;i++){
    $scope.ArchiveMessageList[i][4] = $scope.GetDateifToday(tempDate[i]);
   
}
}
if($scope.totalMessages == 0){
  $scope.noarchivedataflag = true;
  $scope.noarchivemessageavailable = true;
 }
 }).catch(function(response){

      });
 $scope.flag= 'archive'; 
}
else if(StorageService.get('logged').role === 'HCP'){
 toPassID = StorageService.get('logged').userId; 
isClinic = 1; 
messageService.fetchArchiveItemsCA_HCP(toPassID,isClinic,$scope.selectedClinicForHCP.id,$scope.PageNumber,$scope.perPageCount,$scope.sortOption).then(function(response){
$scope.ArchiveListRawData = response.data;
$scope.pageCount = $scope.ArchiveListRawData.totalPages;
$scope.totalMessages = $scope.ArchiveListRawData.totalElements;
$scope.ArchiveMessageList = angular.extend({},$scope.ArchiveMessageList, $scope.ArchiveListRawData.content);
    for(var i=0;i<$scope.ArchiveListRawData.content.length;i++){
   tempDate.push(dateService.getDateTimeFromTimeStamp($scope.ArchiveListRawData.content[i][4],patientDashboard.dateFormat ,'/')); 
 }
  if($scope.ArchiveListRawData.content.length){
  for(var i=0;i<$scope.ArchiveListRawData.content.length;i++){
    $scope.ArchiveMessageList[i][4] = $scope.GetDateifToday(tempDate[i]); 
}
}
if($scope.totalMessages == 0){
  $scope.noarchivedataflagHCP = true;
  $scope.noarchivemessageavailableHCP = true;
 }
 else{
  $scope.noarchivedataflagHCP = false;
  $scope.noarchivemessageavailableHCP = false;
 }
 }).catch(function(response){

      });
 $scope.flag= 'archive'; 
}
};
 /****** Fetch Inbox items******/
$scope.Inbox = function(){
  $scope.incrementerInbox();
$scope.counter++;
$scope.MessageDetails =null;
var toPassID = 0;
var isClinic = 0;
var tempDate = [];
$scope.totalMessages = 0;
if(StorageService.get('logged').role === 'PATIENT'){
toPassID = StorageService.get('logged').patientID;
isClinic = 0;
  messageService.fetchInboxItems(toPassID,isClinic,$scope.PageNumber,$scope.perPageCount,$scope.sortOption).then(function(response){
$scope.InboxListRawData = response.data;
$scope.pageCount = $scope.InboxListRawData.totalPages;
$scope.totalMessages = $scope.InboxListRawData.totalElements;
$scope.InboxMessageList = angular.extend({},$scope.InboxMessageList, $scope.InboxListRawData.content);
    for(var i=0;i<$scope.InboxListRawData.content.length;i++){
    tempDate.push(dateService.getDateTimeFromTimeStamp($scope.InboxListRawData.content[i][4],patientDashboard.dateFormat ,'/')); 
 }
if($scope.InboxListRawData.content.length){
  for(var i=0;i<$scope.InboxListRawData.content.length;i++){
    $scope.InboxMessageList[i][4] = $scope.GetDateifToday(tempDate[i]);
}
}
if($scope.totalMessages == 0){
  $scope.nodataflag = true;
  $scope.nomessagebodyavailable = true;
 }
/* if($scope.InboxMessageList.length){
  $scope.getMessageBody($scope.InboxMessageList[0]);
 }*/
 }).catch(function(response){

      });
}
else if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
toPassID = StorageService.get('logged').userId; //to be changed to $scope.selectedClinicForMessagesID when inbox with clinic Id is implemented
isClinic = 1;
  messageService.fetchInboxItemsCA(toPassID,isClinic,$scope.selectedClinicForCA.id,$scope.PageNumber,$scope.perPageCount,$scope.sortOption).then(function(response){
$scope.InboxListRawData = response.data;
$scope.pageCount = $scope.InboxListRawData.totalPages;
$scope.totalMessages = $scope.InboxListRawData.totalElements;
$scope.InboxMessageList = angular.extend({},$scope.InboxMessageList, $scope.InboxListRawData.content);
    for(var i=0;i<$scope.InboxListRawData.content.length;i++){
     tempDate.push(dateService.getDateTimeFromTimeStamp($scope.InboxListRawData.content[i][4],patientDashboard.dateFormat ,'/')); 
 }
 if($scope.InboxListRawData.content.length){
  for(var i=0;i<$scope.InboxListRawData.content.length;i++){
    $scope.InboxMessageList[i][4] = $scope.GetDateifToday(tempDate[i]); 
}
}
if($scope.totalMessages == 0){
  $scope.nodataflagCA = true;
   $scope.nomessagebodyavailableCA = true;
 }
 else{
  $scope.nodataflagCA = false;
   $scope.nomessagebodyavailableCA = false;
 }
 }).catch(function(response){

      });
}
else if(StorageService.get('logged').role === 'HCP'){
  toPassID = StorageService.get('logged').userId; //to be changed to $scope.selectedClinicForMessagesID when inbox with clinic Id is implemented
isClinic = 1;
  messageService.fetchInboxItemsCA(toPassID,isClinic,$scope.selectedClinicForHCP.id,$scope.PageNumber, $scope.perPageCount,$scope.sortOption).then(function(response){
    $scope.InboxListRawData = response.data;
    $scope.pageCount = $scope.InboxListRawData.totalPages;
    $scope.totalMessages = $scope.InboxListRawData.totalElements;
    $scope.InboxMessageList = angular.extend({},$scope.InboxMessageList, $scope.InboxListRawData.content);
    for(var i=0;i<$scope.InboxListRawData.content.length;i++){
     tempDate.push(dateService.getDateTimeFromTimeStamp($scope.InboxListRawData.content[i][4],patientDashboard.dateFormat ,'/')); 
 }
  if($scope.InboxListRawData.content.length){
  for(var i=0;i<$scope.InboxListRawData.content.length;i++){
    $scope.InboxMessageList[i][4] = $scope.GetDateifToday(tempDate[i]); 
}
}
 if($scope.totalMessages == 0){
  $scope.nodataflagHCP = true;
  $scope.nomessagebodyavailableHCP = true;
 }
 else{
  $scope.nodataflagHCP = false;
  $scope.nomessagebodyavailableHCP = false;
 }
 }).catch(function(response){
      
      });
}
 $scope.flag = 'inbox'; 

};
/****** End of Fetch Inbox items******/
/******Take a confirmation on sending message ******/
$scope.showUpdate = function(){
  $scope.submitted = true;
  if($scope.SelectedClinicsID.length==0)
  {
   toastr.error('Please fill out To field');
    $scope.showUpdateModal = false;
      $scope.showNoSubjectModal = false;
      $scope.showNoMessageModal = false;
      $scope.submitted = false;
  }
 else if($scope.messageAttributes.subject == null || $scope.messageAttributes.subject == ""){
$scope.showNoSubjectModal = true;
  }
  else if($scope.messageAttributes.messageData == null || $scope.messageAttributes.messageData == ""){
$scope.showNoMessageModal = true;
$scope.showUpdateModal = false;
$scope.showNoSubjectModal = false;
  }
      else{
        $scope.showUpdateModal = true;
      }    
        };
       
        $scope.close = function()
    {
      $scope.showUpdateModal = false;
      $scope.showNoSubjectModal = false;
      $scope.showNoMessageModal = false;
      $scope.submitted = false;
       $scope.showNoMessageOnReply = false;
$scope.showmodalOnReply = false;
    };
    $scope.showUpdateCA = function(){
  $scope.submitted = true;
  if($scope.SelectedPatientsID.length==0)
  {
   toastr.error('Please fill out To field');
    $scope.showUpdateModalCA = false;
      $scope.showNoSubjectModalCA = false;
      $scope.showNoMessageModalCA = false;
     // $scope.submittedCA = false;
  }
 else if($scope.messageAttributes.subject == null || $scope.messageAttributes.subject == ""){
$scope.showNoSubjectModalCA = true;
$scope.showNoMessageModalCA = false;
$scope.showUpdateModalCA = false;
  }
  else if($scope.messageAttributes.messageData == null || $scope.messageAttributes.messageData == ""){
$scope.showNoMessageModalCA = true;
$scope.showUpdateModalCA = false;
$scope.showNoSubjectModalCA = false;
  }
      else{
        $scope.showUpdateModalCA = true;
        $scope.showNoSubjectModalCA = false;
$scope.showNoMessageModalCA = false;
      }    
        };
       
        $scope.closeCA = function()
    {
      $scope.showUpdateModalCA = false;
      $scope.showNoSubjectModalCA = false;
      $scope.showNoMessageModalCA = false;
      $scope.submitted = false;
       $scope.showNoMessageOnReplyCA = false;
$scope.showmodalOnReplyCA = false;
    };
/******End of -Take a confirmation on sending message ******/
/*******On click of Send Message under compose mail ******/
$scope.SendMessage = function(){
  if(StorageService.get('logged').role === 'PATIENT'){
  $scope.sampleData = {
    "fromUserId" : StorageService.get('logged').patientID, 
    "messageSubject" : $scope.messageAttributes.subject,
    "messageSizeMbs": $scope.dummyvalue,
    "messageType": 'ROOT',
    "isArchived":"false",
    "isRead":"false",
    "toMessageId":'',
    "rootMessageId":'',
    "messageText":$scope.messageAttributes.messageData,
    "toClinicIds":$scope.SelectedClinicsID
  };
  }
  else if((StorageService.get('logged').role === 'CLINIC_ADMIN'))
  {
 $scope.sampleData = {
  "fromUserId" : StorageService.get('logged').userId,
  "fromClinicId" : $scope.selectedClinicForCA.id,//$scope.selectedClinicForMessagesID,
  "messageSubject" : $scope.messageAttributes.subject,
  "messageSizeMbs": $scope.dummyvalue,
  "messageType": 'ROOT',
  "isArchived":"false",
  "isRead":"false",
  "toMessageId":'',
  "rootMessageId":'',
  "messageText":$scope.messageAttributes.messageData,
  "toUserIds":$scope.SelectedPatientsID
};
  }


  $scope.flag= 'inbox';
    $scope.currentPageIndex = 1;
  $scope.pageCount = 0;
  $scope.perPageCount = 5;
   $scope.PageNumber=1; 
     $scope.totalMessages = 0;
  messageService.sendMessageService($scope.sampleData).then(function(response){
     notyService.showMessage(response.data.statusMsg, 'success');
     
      $scope.submitted = false;
 }).catch(function(response){
      
      });
    $scope.messageAttributes.subject = "";
   $scope.messageAttributes.messageData = "";
};
/*******End of On click of Send Message under compose mail ******/
/******On click of Reply******/
$scope.showmodalonReplyFunc = function(){
  if( ($scope.replyattributes.replyData == "") || ($scope.replyattributes.replyData == null) ){
    $scope.showNoMessageOnReply = true;
    $scope.showmodalOnReply = false;
}
else{
  $scope.showmodalOnReply = true;
  $scope.showNoMessageOnReply = false;
}
};
$scope.showmodalonReplyFuncCA = function(){
  if( ($scope.replyattributes.replyData == "") || ($scope.replyattributes.replyData == null) ){
    $scope.showNoMessageOnReplyCA = true;
    $scope.showmodalOnReplyCA = false;
}
else{
  $scope.showmodalOnReplyCA = true;
  $scope.showNoMessageOnReplyCA = false;
}
};
$scope.Reply = function(){
  //$scope.ReplymessageAttributes.subject = ;
 console.log($scope.ReplymessageAttributesObject);
if(StorageService.get('logged').role === 'PATIENT'){
  $scope.sampleData = {
    "fromUserId" : StorageService.get('logged').patientID, 
    "messageSubject" : "RE: "+$scope.ReplymessageAttributesObject[5],
    "messageSizeMbs": $scope.dummyvalue,
    "messageType": 'RE',
    "isArchived":"false",
    "isRead":"false",
    "toMessageId":$scope.ReplymessageAttributesObject[3],
    "rootMessageId":$scope.ReplymessageAttributesObject[3],
    "messageText":$scope.replyattributes.replyData,
    "toClinicIds":[$scope.ReplymessageAttributesObject[9]]
  };
  console.log("patient reply");
  console.log($scope.sampleData);
  }
  else if((StorageService.get('logged').role === 'CLINIC_ADMIN'))
  {
 $scope.sampleData = {
  "fromUserId" : StorageService.get('logged').userId,
  "fromClinicId" : $scope.selectedClinicForCA.id,//$scope.selectedClinicForMessagesID,
  "messageSubject" : "RE: "+$scope.ReplymessageAttributesObject[5],
  "messageSizeMbs": $scope.dummyvalue,
  "messageType": 'RE',
  "isArchived":"false",
  "isRead":"false",
  "toMessageId":$scope.ReplymessageAttributesObject[3],
  "rootMessageId":$scope.ReplymessageAttributesObject[3],
  "messageText":$scope.replyattributes.replyData,
  "toUserIds":[$scope.ReplymessageAttributesObject[10]]
};
console.log("CA reply");
console.log($scope.sampleData);
}

  messageService.sendMessageService($scope.sampleData).then(function(response){
     notyService.showMessage(response.data.statusMsg, 'success');
     console.log("data sent successfully")
     console.log(response);
      $scope.submitted = false;
      $scope.replyattributes.replyData = "";
 }).catch(function(response){
      
      });
    $scope.ReplymessageAttributesObject = {};
    $scope.replyattributes.replyData = "";
    $scope.close();
     $scope.closeCA();
};
/******End of-On click of Reply******/
/*******To fetch sent items on click of sent items menu option******/
$scope.SentItems = function(){
  $scope.incrementerSent();
  $scope.MessageDetails =null;
  var toPassID = 0;
  var isclinic = 0;
  var tempDate = [];
if(StorageService.get('logged').role === 'PATIENT'){
toPassID = StorageService.get('logged').patientID;
isclinic = 0;
messageService.fetchSentItems(toPassID,isclinic,$scope.PageNumber,$scope.perPageCount,$scope.SentsortOption).then(function(response){
    $scope.sentmessageListRawData = response.data;
      $scope.pageCount = $scope.sentmessageListRawData.totalPages;
      $scope.totalMessages = $scope.sentmessageListRawData.totalElements;
 $scope.MessageDetails = angular.copy($scope.sentmessageListRawData.content[0]);
        $scope.sentmessageList = angular.extend({},$scope.sentmessageList, $scope.sentmessageListRawData.content);
    for(var i=0;i<$scope.sentmessageListRawData.content.length;i++){
     tempDate.push(dateService.getDateTimeFromTimeStamp($scope.sentmessageList[i][1],patientDashboard.dateFormat ,'/')); 

 }
 if($scope.sentmessageListRawData.content.length){
  for(var i=0;i<$scope.sentmessageListRawData.content.length;i++){
    $scope.sentmessageList[i][1] = $scope.GetDateifToday(tempDate[i]); 
}
}
if($scope.totalMessages == 0){
  $scope.nosentdataflag = true;
  $scope.nosentmessageavailable = true;
 }
 }).catch(function(response){
     
      });
}
else if((StorageService.get('logged').role === 'CLINIC_ADMIN')){
  toPassID = StorageService.get('logged').userId; 
  isclinic = 1;
  messageService.fetchSentItemsCA(toPassID,isclinic,$scope.selectedClinicForCA.id,$scope.PageNumber,$scope.perPageCount,$scope.SentsortOption).then(function(response){
    $scope.sentmessageListRawData = response.data;
      $scope.pageCount = $scope.sentmessageListRawData.totalPages;
       $scope.totalMessages = $scope.sentmessageListRawData.totalElements;
 $scope.MessageDetails = angular.copy($scope.sentmessageListRawData.content[0]);
        $scope.sentmessageList = angular.extend({},$scope.sentmessageList, $scope.sentmessageListRawData.content);
    for(var i=0;i<$scope.sentmessageListRawData.content.length;i++){
     tempDate.push(dateService.getDateTimeFromTimeStamp($scope.sentmessageList[i][1],patientDashboard.dateFormat ,'/')); 
 }
 if($scope.sentmessageListRawData.content.length){
  for(var i=0;i<$scope.sentmessageListRawData.content.length;i++){
    $scope.sentmessageList[i][1] = $scope.GetDateifToday(tempDate[i]); 
}
}
if($scope.totalMessages == 0){
  $scope.nosentdataflagCA = true;
  $scope.nosentmessageavailable = true;
 }
 }).catch(function(response){
       
      });
}
//messageService.fetchSentItems(toPassID,$scope.PageNumber,$scope.perPageCount,$scope.SentsortOption).then(function(response){

 $scope.flag = 'sentitems';
};
/*******End of - To fetch sent items on click of sent items menu option******/

/******Sent Items fetch next/prev page ******/
$scope.Pagination = function(track){ 
if (track !== undefined) {
        if (track === 'PREV' && $scope.currentPageIndex > 1) {
          $scope.PageNumber--;
          $scope.currentPageIndex--;
        }
        else if (track === 'NEXT' && $scope.currentPageIndex < $scope.pageCount){
            $scope.PageNumber++;
            $scope.currentPageIndex++;
        }
        else{
            return false;
        }
      }else {
          $scope.PageNumber = 1;
      }
   if($scope.flag == 'inbox'){
    $scope.InboxMessageList = "";
    $scope.Inbox();
   }
   if($scope.flag == 'archive'){
    $scope.ArchiveMessageList = "";
    $scope.ArchiveBox();
   }
  else if($scope.flag == 'sentitems'){
    $scope.sentmessageList = "";
    $scope.SentItems();
}
};
/******Sent Items fetch next/prev page ******/

/******Display full message On click of a particular message from list ******/
/*$scope.displayfullmessage = function(messageid){
   $scope.MessageDetails =null;
   if($scope.flag == 'sentitems'){
  for(var i=0;i<$scope.sentmessageListRawData.content.length;i++){
    if($scope.sentmessageListRawData.content[i].id == messageid){
      console.log("$scope.sentmessageListRawData[i]");
      console.log(i);
      console.log($scope.sentmessageListRawData.content[i]);
      $scope.MessageDetails = angular.copy($scope.sentmessageListRawData.content[i]);
    }
  }
  var text = document.getElementById("messageBody");
  text.innerHTML = '<div style="border:1px solid #999" ng-show="false"><span style="color:#777777; font-size:12px; font-weight:bold;">'+
$scope.MessageDetails.id+'</span><span style="color:blue;font-size:10px;">'+$scope.MessageDetails.messageDatetime+'</span><div class="message-block"><span style="color:#999; font-size:12px; font-weight:normal;">'+$scope.MessageDetails.messageText +'</span></div></div>';
    console.log("message details-SentItems:");                  
  console.log($scope.MessageDetails);
}
else if($scope.flag == 'inbox'){
   for(var i=0;i<$scope.InboxListRawData.content.length;i++){
    if($scope.InboxListRawData.content[i].message.id == messageid){
      $scope.MessageDetails = angular.copy($scope.InboxListRawData.content[i].message);
      //$scope.InboxListRawData.content[i].messageTouserAssoc.isRead = true;   - instead of this set read/unread flag when API is ready
    }
  }
   var text = document.getElementById("messageBody");
  text.innerHTML = '<div style="border:1px solid #999" ng-click="alert("Helooo")"><span style="color:#777777; font-size:12px; font-weight:bold;">'+
$scope.MessageDetails.id+'</span><span style="color:blue;font-size:10px;">'+$scope.MessageDetails.messageDatetime+'</span><div class="message-block"><span style="color:#999; font-size:12px; font-weight:normal;">'+$scope.MessageDetails.messageText +'</span></div></div>';
    console.log("message details-SentItems:");                  
  console.log($scope.MessageDetails);
}
};*/
/******End of-Display full message On click of a particular message from list ******/

/******To load a section like inbox,compose message,archive etc ******/
  $scope.setflag = function(value){
    $scope.flag = value;
  };
  /*$scope.searchToItemsOnQueryChange = function(){
         
  };*/

  /******On getting list of clinics in init() set clinicnames variable for the TO: field in compose messaage ******/
  $scope.processClinics = function(clinics){
      $scope.clinicnames = [];
     angular.forEach(clinics, function(clinic, key){
        var obj = {
          'name': clinic,
          'ticked': true
        };
        $scope.clinicnames.push(obj);  
      });
    };
$scope.processpatients = function(patients){
$scope.patientnames = [];
     angular.forEach(patients, function(patient, key){
        var obj = {
          'name': patient.firstName + ' ' + patient.lastName,
          'ticked': true
        };
        $scope.patientnames.push(obj);  
      });
};

  $scope.selectClinic = function(){
    $scope.SelectedClinicsID = [];
    for(var j=0;j<$scope.selectedClinics.length;j++){
    for(var i=0;i<$scope.clinicsListdata.clinics.length;i++){
       if($scope.selectedClinics[j].name == $scope.clinicsListdata.clinics[i].name){
        $scope.SelectedClinicsID.push($scope.clinicsListdata.clinics[i].id);
       }
    }
} 
  };
  $scope.selectPatient = function(){
 $scope.SelectedPatientsID = [];
 for(var j=0;j<$scope.selectedPatients.length;j++){
    for(var i=0;i<$scope.patients.length;i++){
if($scope.selectedPatients[j].name == $scope.patients[i].name){
        $scope.SelectedPatientsID.push($scope.patients[i].id);
       }

    }
 }
  };

  $scope.selectAll = function(){
  };
  $scope.ArchiveMessages = function(){
    var userid= "";
    var responseData = [];
    $scope.getSeletedData();
    if(StorageService.get('logged').role === 'PATIENT')
    {
      userid = StorageService.get('logged').patientID;
    }
    else
    {
      //For clinic id
      userid = StorageService.get('logged').userId;
    }

    for(var i = 0 ; i<$scope.checkedArray.length;i++)
    {
      var res = {
        "userId": userid,
        "messageId": $scope.checkedArray[i],
        "archived": "true",
        "read": ""
      }
        responseData.push(res) ;
    }
   /* var responseData = [{
    "userId": userid,
    "messageId": $scope.checkedArray[0],
    "archived": "true",
    "read": "true"
  }];*/
    messageService.addToArchive(responseData).then(function(response){
      $scope.getunreadcount();
      $scope.InboxMessageList = "";
     $scope.Inbox();
    // $scope.ArchiveBox();
      //$scope.SwitchTabs('inbox');
    }).catch(function(response){
      
      });
  };
  $scope.markAsRead = function(){
    var userid = "";
    var responseData = [];
    var clinicid = 0;
      if($scope.flag === 'inbox'){
    $scope.getSeletedDataForRead();
   }
   else if($scope.flag === 'archive'){
       $scope.getSeletedDataForArchiveRead();
   }
    if(StorageService.get('logged').role === 'PATIENT')
    {
      userid = StorageService.get('logged').patientID;
      for(var i = 0 ; i<$scope.checkedArrayforRead.length;i++)
    {
      var res = {
        "userId": userid,
        "messageId": $scope.checkedArrayforRead[i],
        "archived": "",
        "read": "true"
      }
        responseData.push(res) ;
    }
    }
    else{
   if(StorageService.get('logged').role === 'CLINIC_ADMIN')
    {
      //For clinic id
      userid = StorageService.get('logged').userId;
clinicid = $scope.selectedClinicForCA.id;
    }
    else if(StorageService.get('logged').role === 'HCP')
    {
      //For clinic id
      userid = StorageService.get('logged').userId;
clinicid = $scope.selectedClinicForHCP.id;
    }
        for(var i = 0 ; i<$scope.checkedArrayforRead.length;i++)
    {
      var res = {
        "userId": userid,
        "messageId": $scope.checkedArrayforRead[i],
        "clinicId" : clinicid,
        "archived": "",
        "read": "true"
      }
        responseData.push(res) ;
    }
  }  
    messageService.markAsReadUnread(responseData).then(function(response){
       $scope.checkedArrayforRead = [];
      $scope.readflag = false;
      $scope.unreadflag = false; 
        $scope.getunreadcount();
      if($scope.flag === 'inbox'){
       $scope.InboxMessageList = "";
      // $scope.sortType('Date');
     $scope.Inbox();
   }
     else if($scope.flag === 'archive'){
$scope.ArchiveMessageList = "";
//$scope.sortTypeArchive('Date');
$scope.ArchiveBox();
     }
   
    }).catch(function(response){
      });
   
  };
  $scope.markAsUnread = function(){
    $scope.getSeletedDataForUnRead();
    var userid = "" ;
    var responseData = [];
        var clinicid = 0;
          if($scope.flag === 'inbox'){
    $scope.getSeletedDataForUnRead();
   }
   else if($scope.flag === 'archive'){
       $scope.getSeletedDataForArchiveUnRead();
   }
  if(StorageService.get('logged').role === 'PATIENT')
    {
      userid = StorageService.get('logged').patientID;
      for(var i = 0 ; i<$scope.checkedArrayforUnRead.length;i++)
    {
      var res = {
        "userId": userid,
        "messageId": $scope.checkedArrayforUnRead[i],
        "archived": "",
        "read": "false"
      }
        responseData.push(res) ;
    }
    }
    else{
   if(StorageService.get('logged').role === 'CLINIC_ADMIN')
    {
      //For clinic id
      userid = StorageService.get('logged').userId;
      clinicid = $scope.selectedClinicForCA.id;
    }
    else if(StorageService.get('logged').role === 'HCP')
    {
      userid = StorageService.get('logged').userId;
      clinicid = $scope.selectedClinicForHCP.id;
    }
        for(var i = 0 ; i<$scope.checkedArrayforUnRead.length;i++)
    {
      var res = {
        "userId": userid,
        "messageId": $scope.checkedArrayforUnRead[i],
        "clinicId" : clinicid,
        "archived": "",
        "read": "false"
      }
        responseData.push(res) ;
    }
  }
 
    messageService.markAsReadUnread(responseData).then(function(response){
$scope.checkedArrayforUnRead = [];
    $scope.unreadflag = false;
    $scope.readflag = false;
    $scope.getunreadcount();
     if($scope.flag == 'inbox'){
       $scope.InboxMessageList = "";
       $scope.Inbox();
     //$scope.sortType('Date');
   }
     else if($scope.flag == 'archive'){
$scope.ArchiveMessageList = "";
$scope.ArchiveBox();
//$scope.sortTypeArchive('Date');
     }

    }).catch(function(response){
        notyService.showError(response);
      });
    
  };

  $scope.printselectedItems = function(){
  };

  $scope.switchClinic = function(clinic){
    $scope.selectedClinicForCA = null;
$scope.selectedClinicForCA = angular.copy(clinic);
$scope.InboxMessageList = "";
$scope.SwitchTabs('inbox');
//$rootScope.ClinicForCA = $scope.selectedClinicForCA;
  };
   $scope.switchClinicHCP = function(clinic){
$scope.selectedClinicForHCP = null;
$scope.selectedClinicForHCP = angular.copy(clinic);
$scope.InboxMessageList = "";
$scope.SwitchTabs('inbox');
//$rootScope.ClinicForHCP = $scope.selectedClinicForHCP;
  };

/******For select all option ******/
   $scope.toggleAll = function() {
      
    if($scope.isAllSelected)
    {
      $scope.isAllSelected = false;
      $scope.unreadflag = false;
      $scope.readflag = false;
    }
    else
    {
      $scope.isAllSelected = true;
      $scope.unreadflag = true;
      $scope.readflag = true;
    }
     var toggleStatus = $scope.isAllSelected;
     angular.forEach($scope.InboxMessageList, function(itm){ 
      itm.selected = toggleStatus;
      });
  };
$scope.toggleAllForArchive = function() {
    if($scope.isAllSelected)
    {
      $scope.isAllSelected = false;
       $scope.unreadflag = false;
      $scope.readflag = false;
    }
    else
    {
      $scope.isAllSelected = true;
     $scope.unreadflag = true;
      $scope.readflag = true;
    }
     var toggleStatus = $scope.isAllSelected;
     angular.forEach($scope.ArchiveMessageList, function(itm){ 
      itm.selected = toggleStatus;
      });
   
  };
/******For getting the ID of selected checkboxes ******/  
  $scope.optionToggled = function(){
    var checkFlag = true;
    var readcount = 0;
    var unreadcount = 0;
    angular.forEach($scope.InboxMessageList, function(itm){
        
        if(itm.selected){
                      if(itm[2] == true){
          readcount++;
        }
        else if(itm[2] == false){
          unreadcount++;
          }
        }
        else if(!itm.selected){
          checkFlag = false;
           
        $scope.readflag = false;
      $scope.unreadflag = false;
        }
      });
    if(readcount!=0 && unreadcount!=0){
      $scope.unreadflag = true;
      $scope.readflag = true;
    }
    else if(unreadcount!=0 && readcount==0){
      $scope.readflag = true;
      $scope.unreadFlag = false;
    }
    else if(readcount!=0 && unreadcount==0)
    {
       $scope.unreadflag = true;
      $scope.readflag = false;
    }
      $scope.isAllSelected = checkFlag;
  };

  $scope.getSeletedData = function(){
    angular.forEach($scope.InboxMessageList, function(itm){
      if (itm.selected) 
      {
          $scope.checkedArray.push(itm[3]);
      }
    });
  };

   

   $scope.optionToggledForArchive = function(){
  var checkFlag = true;
    var readcount = 0;
    var unreadcount = 0;
    angular.forEach($scope.ArchiveMessageList, function(itm){
        
        if(itm.selected){
                      if(itm[2] == true){
          readcount++;
        }
        else if(itm[2] == false){
          unreadcount++;
          }
        }
        else if(!itm.selected){
          checkFlag = false;
           
        $scope.readflag = false;
      $scope.unreadflag = false;
        }
      });
    if(readcount!=0 && unreadcount!=0){
      $scope.unreadflag = true;
      $scope.readflag = true;
    }
    else if(unreadcount!=0 && readcount==0){
      $scope.readflag = true;
      $scope.unreadFlag = false;
    }
    else if(readcount!=0 && unreadcount==0)
    {
       $scope.unreadflag = true;
      $scope.readflag = false;
    }
      $scope.isAllSelected = checkFlag;
  };
   $scope.getSeletedDataForRead = function(){
    angular.forEach($scope.InboxMessageList, function(itm){
      if (itm.selected) 
      {
          $scope.checkedArrayforRead.push(itm[3]);
      }
     
    });
  };

  $scope.getSeletedDataForUnRead = function(){
    angular.forEach($scope.InboxMessageList, function(itm){
      if (itm.selected) 
      {
          $scope.checkedArrayforUnRead.push(itm[3]);
      }
    });
  };
    $scope.getSeletedDataForArchiveRead = function(){
    angular.forEach($scope.ArchiveMessageList, function(itm){
      if (itm.selected) 
      {
          $scope.checkedArrayforRead.push(itm[3]);
      }
     
    });
  };

  $scope.getSeletedDataForArchiveUnRead = function(){
    angular.forEach($scope.ArchiveMessageList, function(itm){
      if (itm.selected) 
      {
          $scope.checkedArrayforUnRead.push(itm[3]);
      }
    });
  };
  /******End of getting the ID of selected checkboxes ******/ 

/*  $scope.getMessageBody =function(id,name,date)
  {
    
    messageService.getMessageBodyService(id).then(function(response){
    $scope.messageBody = response.data;
    console.log("data");
    console.log($scope.messageBody.messageText);
     var text = document.getElementById("messageBodyArea");
  text.innerHTML = '<div><span>'+
$scope.messageBody.messageText+'</span><span>'+name+'</span><span>'+date+'</span></div>';
    }).catch(function(response){
        notyService.showError(response);
      });

  };
*/
/*$scope.getMessageBody =function(arrayobject)
  {
    var name = "";
    var date = "";
    var id = 0;
  $scope.nomessagebodyavailable = false;
    if($scope.flag == 'inbox' || $scope.flag == 'archive'){
name = arrayobject[8];
date = arrayobject[4];
id = arrayobject[3];
$scope.checkedArrayforRead.push(id);
    $scope.markAsRead();      
    }
    if($scope.flag == 'sentitems'){
      name = arrayobject[6];
date = arrayobject[1];
id = arrayobject[2];
    }
    messageService.getMessageBodyService(id).then(function(response){
    $scope.messageBody = response.data;
var formatedDateTime =  $scope.GetDateifToday(date);

    console.log($scope.messageBody);
    console.log($scope.messageBody.messageText);
     var text = document.getElementById("messageBodyArea");
     if(arrayobject){
     text.innerHTML = '<div class="row"><div class="col-md-15 msghead">'+name+'</div></div><div class="row"><div class="col-md-11 msgtitle">'+name+'</div><div class="col-md-4 msgtimestamp">'+formatedDateTime+'</div></div><div class="row"><div class="col-md-15 msgbody">'+
$scope.messageBody.messageText+'</div></div>'; 
     }
     else{
      $scope.nomessagebodyavailable = true;
     }

}).catch(function(response){
      });

  };*/
$scope.getMessageBodyOnPageload =function(arrayobject)
  {
    var name = "";
    var date = "";
    var id = 0;
    $scope.checkedArrayforRead = [];
    if($scope.flag == 'inbox' || $scope.flag == 'archive'){
      $scope.arrayobject = arrayobject;
name = arrayobject[8];
date = arrayobject[4];
id = arrayobject[3]; 

    messageService.getMessageBodyService(id).then(function(response){
    $scope.messageBody = response.data;
var formatedDateTime =  $scope.GetDateifToday(date);

    console.log($scope.messageBody);
    console.log($scope.messageBody.messageText);
    if($scope.newCounterInbox==1 || $scope.newCounterArchive==1 || $scope.newCounterSent==1)
        { 
     
     if(arrayobject){
      var text = document.getElementById("messageBodyArea");
     var innerHTML = '<div class="row"><div class="col-md-15 msghead">'+name+'</div></div><div class="row"><div class="col-md-11 msgtitle">'+name+'</div><div class="col-md-4 msgtimestamp">'+formatedDateTime+'</div></div><div class="row"><div class="col-md-15 msgbody">'+
$scope.messageBody.messageText+'</div></div><div class="row"><div class="col-md-15 msgreply alignright"><a ng-click="replyToMessage(arrayobject)">Reply</a></div></div>'; 
var displayMessage = angular.element(text);
 displayMessage.empty();
displayMessage.append( $compile(innerHTML)($scope) );
     }
     else{
      $scope.nomessagebodyavailable = true;
     }
   }
}).catch(function(response){
       
      });    
    }
    if($scope.flag == 'sentitems'){
      name = arrayobject[6];
date = arrayobject[1];
id = arrayobject[2];

    messageService.getMessageBodyService(id).then(function(response){
    $scope.messageBody = response.data;
var formatedDateTime =  $scope.GetDateifToday(date);

    console.log($scope.messageBody);
    console.log($scope.messageBody.messageText);
    if($scope.newCounterInbox==1 || $scope.newCounterArchive==1 || $scope.newCounterSent==1)
        { 
     var text = document.getElementById("messageBodyArea");
     if(arrayobject){
     text.innerHTML = '<div class="row"><div class="col-md-15 msghead">'+name+'</div></div><div class="row"><div class="col-md-11 msgtitle">'+name+'</div><div class="col-md-4 msgtimestamp">'+formatedDateTime+'</div></div><div class="row"><div class="col-md-15 msgbody">'+
$scope.messageBody.messageText+'</div></div>'; 
     }
     else{
      $scope.nomessagebodyavailable = true;
     }
   }
  

}).catch(function(response){
       
      });
    }
    
   

  }; 
  $scope.GetDateifToday = function(datevariable){
   Number.prototype.padLeft = function(base,chr){
   var  len = (String(base || 10).length - String(this).length)+1;
   return len > 0? new Array(len).join(chr || '0')+this : this;
   }
     var d = new Date,
      todayformat = [ (d.getMonth()+1).padLeft(),d.getDate().padLeft(),d.getFullYear()].join('/');

      var str = datevariable.toString();
      var res = str.split(" ", 3);
      var convertedDate=res[0];
      var convertedTime=res[1];
      var noSecond = convertedTime;
      var finalTimestamp;
      if(noSecond.length==8)
      {
      var timeWithoutSecond =  noSecond.split(":");
      timeWithoutSecond.pop();
       finalTimestamp =  timeWithoutSecond.join(":");
      }
      else
     {
          finalTimestamp =  noSecond;
      }
      var formatedDateTime;
      if(todayformat==convertedDate) 
      {
         formatedDateTime = "Today"+ " "+ finalTimestamp;
      }
      else
      {
        formatedDateTime = convertedDate+" "+finalTimestamp;
      }
      return formatedDateTime;
    };

  // $scope.GetDateifToday = function(datevariable){
  //  Number.prototype.padLeft = function(base,chr){
  //  var  len = (String(base || 10).length - String(this).length)+1;
  //  return len > 0? new Array(len).join(chr || '0')+this : this;
  //  }
  //    var d = new Date,
  //     todayformat = [ (d.getMonth()+1).padLeft(),d.getDate().padLeft(),d.getFullYear()].join('/');

  //     var str = datevariable.toString();
  //     var res = str.split(" ", 3);
  //     var convertedDate=res[0];
  //     var convertedTime=res[1];
  //     var noSecond = convertedTime;
  //     var timeWithoutSecond =  noSecond.split(":");
  //     timeWithoutSecond.pop();
  //     var finalTimestamp =  timeWithoutSecond.join(":");
  //     var formatedDateTime;
  //     if(todayformat==convertedDate) 
  //     {
  //        formatedDateTime = "Today"+ " "+ finalTimestamp;
  //     }
  //     else
  //     {
  //       formatedDateTime = convertedDate+" "+finalTimestamp;
  //     }
  //     return formatedDateTime;
  //   };
    $scope.getMessageBody =function(arrayobject)
  {
    var name = "";
    var date = "";
    var id = 0;
  $scope.nomessagebodyavailable = false;
  if(arrayobject){
    if($scope.flag == 'inbox' || $scope.flag == 'archive'){
       $scope.arrayobject = arrayobject;
name = arrayobject[8];
date = arrayobject[4];
id = arrayobject[3];
$scope.checkedArrayforRead.push(id);
    $scope.markAsRead(); 
      messageService.getMessageBodyService(id).then(function(response){
    $scope.messageBody = response.data;
var formatedDateTime =  $scope.GetDateifToday(date);
       var text = document.getElementById("messageBodyArea");
     var innerHTML = '<div class="row"><div class="col-md-15 msghead">'+name+'</div></div><div class="row"><div class="col-md-11 msgtitle">'+name+'</div><div class="col-md-4 msgtimestamp">'+formatedDateTime+'</div></div><div class="row"><div class="col-md-15 msgbody">'+
$scope.messageBody.messageText+'</div></div><div class="row"><div class="col-md-15 msgreply alignright"><a ng-click="replyToMessage(arrayobject)">Reply</a></div></div>'; 

    var displayMessage = angular.element(text);
 displayMessage.empty();
displayMessage.append( $compile(innerHTML)($scope) );
}).catch(function(response){
      });     
    }
    if($scope.flag == 'sentitems'){
      name = arrayobject[6];
date = arrayobject[1];
id = arrayobject[2];
messageService.getMessageBodyService(id).then(function(response){
    $scope.messageBody = response.data;
var formatedDateTime =  $scope.GetDateifToday(date);
       var text = document.getElementById("messageBodyArea");
     var innerHTML = '<div class="row"><div class="col-md-15 msghead">'+name+'</div></div><div class="row"><div class="col-md-11 msgtitle">'+name+'</div><div class="col-md-4 msgtimestamp">'+formatedDateTime+'</div></div><div class="row"><div class="col-md-15 msgbody">'+
$scope.messageBody.messageText+'</div></div>'; 

    var displayMessage = angular.element(text);
 displayMessage.empty();
displayMessage.append( $compile(innerHTML)($scope) );
}).catch(function(response){
      });  
    }
  }
    else{
      $scope.nomessagebodyavailable = true;
     }
  

  };
  /*$scope.getMessageBody =function(arrayobject)
  {
     $scope.arrayobject = arrayobject;
     $scope.checkedArrayforRead = [];
    $scope.checkedArrayforRead.push(arrayobject[3]);
    $scope.markAsRead();
   // $scope.selectedMessage = angular.copy(clinic);
    messageService.getMessageBodyService(arrayobject[3]).then(function(response){
    $scope.messageBody = response.data;
    console.log($scope.messageBody);
    console.log($scope.messageBody.messageText);
     var text = document.getElementById("messageBodyArea");
  var innerHTML = '<div class="row"><div class="col-md-15 msghead">'+arrayobject[8]+'</div></div><div class="row"><div class="col-md-11 msgtitle">'+arrayobject[8]+'</div><div class="col-md-4 msgtimestamp">'+arrayobject[4]+'</div></div><div class="row"><div class="col-md-15 msgbody">'+
$scope.messageBody.messageText+'</div></div><div class="row"><div class="col-md-15 msgreply alignright"><a ng-click="replyToMessage(arrayobject)">Reply</a></div></div>';

var displayMessage = angular.element(text);
 displayMessage.empty();
displayMessage.append( $compile(innerHTML)($scope) );

}).catch(function(response){
        notyService.showError(response);
      });

  };*/
  $scope.replyToMessage = function(arrayobject){
    console.log(arrayobject);
$scope.replyFlag = true;
$scope.ReplymessageAttributesObject = arrayobject;

  };

/*$scope.showUpdate = function(){
          $scope.submitted = true;
          if($scope.form.$invalid){
            return false;
          }
          $scope.showNoMessageModal = true;
        };

         $scope.close = function(value)
    {
      $scope.showNoMessageModal = value;
    };*/



/* 28  */
$scope.incrementerInbox = function()
{
  
   $scope.newCounterInbox++;
   //alert($scope.newCounterInbox);
}
$scope.incrementerArchive = function()
{  
  $scope.newCounterArchive++;
}
$scope.incrementerSent = function()
{
  
  $scope.newCounterSent++;
  // alert($scope.newCounterSent);
}
$scope.init();
  }]);