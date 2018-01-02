'use strict';
angular.module('hillromvestApp')
.controller('messagecontroller', [ '$scope','$state','$filter','$compile','$rootScope','$stateParams','messageService', 'dateService','patientService','DoctorService','StorageService','notyService','toastr','clinicService','clinicadminService','sortOptionsService', 'commonsUserService',
  function ($scope,$state,$filter,$compile,$rootScope,$stateParams,messageService,dateService,patientService,DoctorService,StorageService,notyService,toastr,clinicService,clinicadminService,sortOptionsService,commonsUserService) {
   $scope.dummyvalue = 12 ;
   $scope.messageAttributes = {}; 
   $scope.ReplymessageAttributes = {};
   $scope.selectedClinics = [];
   $scope.selectedPatients = [];
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
      $scope.messagebodyflag = false;
$scope.messagelistflag = true;
$scope.messageBodyObject = {};
  $scope.archivemessagelistflag = false;
  $scope.archivemessagebodyflag = false;
  $scope.sentmessagelistflag = false;
  $scope.sentmessagebodyflag = false;
  $scope.sentmessageBody = {};
  $scope.archivemessageBodyObject = {};
  $scope.toID = [];
  $rootScope.UnreadMessages = "";
   $scope.preferredTimezone = $scope.getTimezonePreference();
  /* console.log("clinic ID");
   console.log(StorageService.get('logged').userId);*/
 
  $scope.getClinicsForHCP = function() {
    var userId = StorageService.get('logged').userId;
    DoctorService.getClinicsAssociatedToHCP(userId).then(function(response){
      //$scope.getDashboardForHCPOrPatient(response, userId);
      if(response.data && response.data.clinics){
      $scope.clinicsHCP = $filter('orderBy')(response.data.clinics, "name");
       if($stateParams.clinicId && $stateParams.clinicId != 'others'){
         $scope.selectedClinicForHCP = commonsUserService.getSelectedClinicFromList($scope.clinicsHCP, $stateParams.clinicId);
       $scope.switchClinicHCP($scope.selectedClinicForHCP);
     
      }
      else{
        $scope.selectedClinicForHCP = angular.copy($scope.clinicsHCP[0]);
        $scope.switchClinicHCP($scope.selectedClinicForHCP);
      }
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
   $scope.getClinicsAssociatedToHCP = function(){
    clinicadminService.getClinicsAssociated(StorageService.get('logged').userId).then(function(response){
      if(response.data && response.data.clinics){
        $scope.clinics = $filter('orderBy')(response.data.clinics, "name");
        if($stateParams.clinicId){
          $scope.selectedClinicForCA = commonsUserService.getSelectedClinicFromList($scope.clinics, $stateParams.clinicId);
        $scope.switchClinic($scope.selectedClinicForCA);
        }else if($scope.clinics && $scope.clinics.length > 0){
        //  $scope.selectedClinicForCA=angular.copy($scope.clinics[0]);
          //$rootScope.ClinicForCA = $scope.selectedClinicForCA;
          $scope.switchClinic($scope.clinics[0]);
 }
      }
    }).catch(function(response){
    
    });
  };
   $scope.getAllPatientsByClinicId = function(){
    clinicService.getClinicAssoctPatients($scope.selectedClinicForCA.id,1,100).then(function(response){
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
      //$scope.getAllPatientsByClinicId();
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
  $rootScope.UnreadMessages = response.data[0][1];
}
else{
  $rootScope.UnreadMessages = 0;
}
}
else {
  $rootScope.UnreadMessages = 0;
}
   }).catch(function(response){
    if(response.message == 'No message available'){
    $rootScope.UnreadMessages = 0;  
  }
    });

}
else if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
  messageService.getUnreadMessagesCountCA(StorageService.get('logged').userId,1,$stateParams.clinicId).then(function(response){
if(response.data.length){
if(response.data[0][0] == false){
  $rootScope.UnreadMessages = response.data[0][1];
}
else{
  $rootScope.UnreadMessages = 0;
}
}
else {
  $rootScope.UnreadMessages = 0;
}
   }).catch(function(response){
    if(response.message == 'No message available'){
    $rootScope.UnreadMessages = 0;  
  }
    });

}
else if(StorageService.get('logged').role === 'HCP'){
  messageService.getUnreadMessagesCountCA(StorageService.get('logged').userId,1,$stateParams.clinicId).then(function(response){
if(response.data.length){
if(response.data[0][0] == false){
  $rootScope.UnreadMessages = response.data[0][1];
}
else{
  $rootScope.UnreadMessages = 0;
}
}
else {
  $rootScope.UnreadMessages = 0;
}
   }).catch(function(response){
    if(response.message == 'No message available'){
    $rootScope.UnreadMessages = 0;  
  }
    });

}
};
//$scope.getunreadcount();
 /******For sorting the list of messages ******/
$scope.sortType = function(option,isswitchtab){
var toggledSortOptions = {};
 var toggleSortOptiondefault = {}; 
        toggleSortOptiondefault.isDefault = true;
            toggleSortOptiondefault.isDown = false;
            toggleSortOptiondefault.isUp = false;
$scope.sortOption = "";
if(option === 'From'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortMessageList.from);
      $scope.sortMessageList.from = toggledSortOptions;

     // $scope.sortOption = sortConstant.from + sortOptionsService.getSortByASCString(toggledSortOptions);

    //  $scope.sortOption = $scope.sortOption + "&sort_by=messages.messageDatetime&asc=false";
     if(StorageService.get('logged').role === 'PATIENT'){
      $scope.sortOption = sortConstant.fromCA + sortOptionsService.getSortByASCString(toggledSortOptions);
      }

      else if(StorageService.get('logged').role === 'CLINIC_ADMIN' || StorageService.get('logged').role === 'HCP'){
      $scope.sortOption = sortConstant.from + sortOptionsService.getSortByASCString(toggledSortOptions);
    }
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
      if(isswitchtab){
    $scope.sortMessageList.date = toggleSortOptiondefault;
   }
      $scope.sortMessageList.subject = toggleSortOptiondefault;
       $scope.sortMessageList.from = toggleSortOptiondefault;
      $scope.Inbox();
    }
    $scope.isAllSelected = false;      
  };
  $scope.sortTypeSentItems = function(option,isswitchtab){
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
     // $scope.SentsortOption = $scope.SentsortOption + "&sort_by=messages.messageDatetime&asc=false";
      }
      else if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
      $scope.SentsortOption = sortConstant.sentToCA + sortOptionsService.getSortByASCString(toggledSortOptions);
    //  $scope.SentsortOption = $scope.SentsortOption + "&sort_by=messages.messageDatetime&asc=false";
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
   if(isswitchtab){
    $scope.sortSentMessageList.date = toggleSortOptiondefault;
   }
   $scope.sortSentMessageList.subject= toggleSortOptiondefault;
    $scope.sortSentMessageList.to= toggleSortOptiondefault;
    $scope.SentItems();
    }
  };
  $scope.sortTypeArchive = function(option,isswitchtab){
var toggledSortOptions = {};
$scope.archivesortOption = "";
var toggleSortOptiondefault = {}; 
toggleSortOptiondefault.isDefault = true;
toggleSortOptiondefault.isDown = false;
toggleSortOptiondefault.isUp = false;
if(option === 'From'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortArchiveMessageList.from);
      $scope.sortArchiveMessageList.from = toggledSortOptions;
    //  $scope.archivesortOption = sortConstant.from + sortOptionsService.getSortByASCString(toggledSortOptions);
    // $scope.archivesortOption = $scope.archivesortOption + "&sort_by=messages.messageDatetime&asc=false";
    if(StorageService.get('logged').role === 'PATIENT'){

      $scope.archivesortOption = sortConstant.fromCA + sortOptionsService.getSortByASCString(toggledSortOptions);
      }
      else if(StorageService.get('logged').role === 'CLINIC_ADMIN' || StorageService.get('logged').role === 'HCP'){
      $scope.archivesortOption = sortConstant.from + sortOptionsService.getSortByASCString(toggledSortOptions);
    }
      $scope.sortArchiveMessageList.date = toggleSortOptiondefault;
       $scope.sortArchiveMessageList.subject = toggleSortOptiondefault;
      $scope.ArchiveBox();
    }
if(option === 'Subject'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortArchiveMessageList.subject);
      $scope.sortArchiveMessageList.subject = toggledSortOptions;
      $scope.archivesortOption = sortConstant.subject + sortOptionsService.getSortByASCString(toggledSortOptions);
       $scope.sortArchiveMessageList.date = toggleSortOptiondefault;
       $scope.sortArchiveMessageList.from = toggleSortOptiondefault;
      $scope.ArchiveBox();
    }
if(option === 'Date'){                        
      toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortArchiveMessageList.date);
      $scope.sortArchiveMessageList.date = toggledSortOptions;
      $scope.archivesortOption = sortConstant.date + sortOptionsService.getSortByASCString(toggledSortOptions);
      if(isswitchtab){
    $scope.sortArchiveMessageList.date = toggleSortOptiondefault;
   }
       $scope.sortArchiveMessageList.subject = toggleSortOptiondefault;
       $scope.sortArchiveMessageList.from = toggleSortOptiondefault;
      $scope.ArchiveBox();
    }
       $scope.isAllSelected = false;      
       
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

  $scope.init =function(){
     $scope.initialiseAllLists(); 
  $scope.flag= 'inbox';
   $scope.replyattributes = {};
  $scope.PageNumber=1;
  $scope.currentPageIndex = 1;
  $scope.pageCount = 0;
  $scope.perPageCount = 10;
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
       
  // $scope.sortType('Date');
  $scope.sortOption = "";
   $scope.getunreadcount();
  $scope.sortType('Date',1);
 // $scope.Inbox();
$scope.SelectedPatientsID=[];
  $scope.SelectedClinicsID=[];
   $scope.localLang = {
        selectAll       : "Select all",
        selectNone      : "Select none",
        search          : "Type here to search...",
        nothingSelected : "Please select the recipient",
        allSelected : "All Selected",
        Cancel : "Cancel",
        OK:"OK"
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
  $scope.perPageCount = 10;
  $scope.isAllSelected = false;
  $scope.readflag = false;
  $scope.unreadflag = false;
   $scope.newCounterInbox = 0;
    $scope.newCounterSent = 0;
     $scope.newCounterArchive =0;
     $scope.replyFlag = false;
     var isswitchtab =1;
       $scope.nomessagebodyavailableHCP = false;
       $scope.nodataflagHCP = false;
       $scope.noarchivedataflagHCP = false;
$scope.replyattributes.replyData = "";
  $scope.nomessagebodyavailableCA = false;
  $scope.noarchivedataflagCA = false;
   $scope.nosentdataflagCA = false;
  $scope.nodataflagCA = false;

  $scope.nomessagebodyavailable = false;
  $scope.noarchivedataflag = false;
  $scope.nosentdataflag = false;
  $scope.nodataflag = false;

  

  $scope.nodataflag = false;
if(tabName == 'inbox'){
  $scope.messagelistflag = true;
  $scope.messagebodyflag = false;
  $scope.sentmessagebodyflag = false;
  $scope.archivemessagebodyflag = false;
  $scope.getunreadcount();
  $scope.sortOption = "";
  $scope.InboxMessageList = "";
  $scope.InboxListRawData = {};
  $scope.sortType('Date',isswitchtab);
//$scope.Inbox();
}
if(tabName == 'archive'){
  $scope.archivesortOption = "";
    $scope.archivemessagelistflag = true;
    $scope.sentmessagebodyflag = false;
  $scope.archivemessagebodyflag = false;
  $scope.noarchivedataflagHCP = false;
  $scope.messagebodyflag = false;
   $scope.totalMessages = 0;
  $scope.ArchiveListRawData = {};
$scope.ArchiveMessageList = "";
  $scope.sortTypeArchive('Date',isswitchtab);

//$scope.ArchiveBox();
}
if(tabName == 'sentitems'){
  $scope.SentsortOption = "";
  $scope.flag = 'sentitems';
  $scope.sentmessagelistflag = true;
  $scope.sentmessagebodyflag = false;
  $scope.messagebodyflag = false;
$scope.archivemessagebodyflag = false;
$scope.sentmessageList = "";
$scope.sentmessageListRawData = "";
  //$scope.SentItems();
   $scope.totalMessages = 0;
    $scope.sortTypeSentItems('Date',isswitchtab);
}
if(tabName == 'new'){
  $scope.messageAttributes.subject = "";
  $scope.messageAttributes.messageData = "";
  $scope.flag = 'new';
   if(StorageService.get('logged').role === 'PATIENT'){
    $scope.initclinicsList();
    $scope.SelectedClinicsID = [];
   }
   else if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
    $scope.getAllPatientsByClinicId();
    $scope.SelectedPatientsID = [];
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
messageService.fetchArchiveItems(toPassID,isClinic,$scope.PageNumber,$scope.perPageCount,$scope.archivesortOption).then(function(response){
$scope.ArchiveListRawData = response.data;
$scope.pageCount = $scope.ArchiveListRawData.totalPages;
$scope.totalMessages = $scope.ArchiveListRawData.totalElements;

$scope.ArchiveMessageList = angular.extend({},$scope.ArchiveMessageList, $scope.ArchiveListRawData.content);
    for(var i=0;i<$scope.ArchiveListRawData.content.length;i++){
    //tempDate.push(dateService.getDateTimeFromTimeStamp($scope.ArchiveListRawData.content[i][4],patientDashboard.dateFormat ,'/'));
if($scope.preferredTimezone){
var dateInitial = moment.tz($scope.ArchiveListRawData.content[i][4],patientDashboard.serverDateTimeZone);
 var dateFinal = moment.tz(dateInitial,$scope.preferredTimezone).format(patientDashboard.timestampMMDDYYHHMMSS);
 tempDate.push(dateFinal);
}
else{
  tempDate.push(dateService.getDateTimeFromTimeStamp($scope.ArchiveListRawData.content[i][4],patientDashboard.dateFormat ,'/'));
}
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
else if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
toPassID = StorageService.get('logged').userId; 
isClinic = 1;
messageService.fetchArchiveItemsCA_HCP(toPassID,isClinic,$scope.selectedClinicForCA.id,$scope.PageNumber,$scope.perPageCount,$scope.archivesortOption).then(function(response){
$scope.ArchiveListRawData = response.data;
$scope.pageCount = $scope.ArchiveListRawData.totalPages;
$scope.totalMessages = $scope.ArchiveListRawData.totalElements;

$scope.ArchiveMessageList = angular.extend({},$scope.ArchiveMessageList, $scope.ArchiveListRawData.content);
    for(var i=0;i<$scope.ArchiveListRawData.content.length;i++){
   //tempDate.push(dateService.getDateTimeFromTimeStamp($scope.ArchiveListRawData.content[i][4],patientDashboard.dateFormat ,'/')); 
 if($scope.preferredTimezone){
  var dateInitial = moment.tz($scope.ArchiveListRawData.content[i][4],patientDashboard.serverDateTimeZone);
 var dateFinal = moment.tz(dateInitial,$scope.preferredTimezone).format(patientDashboard.timestampMMDDYYHHMMSS);
 tempDate.push(dateFinal);
}
else{
  tempDate.push(dateService.getDateTimeFromTimeStamp($scope.ArchiveListRawData.content[i][4],patientDashboard.dateFormat ,'/'));
}
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
else if(StorageService.get('logged').role === 'HCP'){
 toPassID = StorageService.get('logged').userId; 
isClinic = 1; 
messageService.fetchArchiveItemsCA_HCP(toPassID,isClinic,$scope.selectedClinicForHCP.id,$scope.PageNumber,$scope.perPageCount,$scope.archivesortOption).then(function(response){
$scope.ArchiveListRawData = response.data;
$scope.pageCount = $scope.ArchiveListRawData.totalPages;
$scope.totalMessages = $scope.ArchiveListRawData.totalElements;
$scope.ArchiveMessageList = angular.extend({},$scope.ArchiveMessageList, $scope.ArchiveListRawData.content);
    for(var i=0;i<$scope.ArchiveListRawData.content.length;i++){
  // tempDate.push(dateService.getDateTimeFromTimeStamp($scope.ArchiveListRawData.content[i][4],patientDashboard.dateFormat ,'/')); 
 if($scope.preferredTimezone){
 var dateInitial = moment.tz($scope.ArchiveListRawData.content[i][4],patientDashboard.serverDateTimeZone);
 var dateFinal = moment.tz(dateInitial,$scope.preferredTimezone).format(patientDashboard.timestampMMDDYYHHMMSS);
 tempDate.push(dateFinal);
}
else{
  tempDate.push(dateService.getDateTimeFromTimeStamp($scope.ArchiveListRawData.content[i][4],patientDashboard.dateFormat ,'/')); 
}
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
   //tempDate.push(dateService.getDateTimeFromTimeStamp($scope.InboxListRawData.content[i][4],patientDashboard.dateFormat ,'/')); 
   if($scope.preferredTimezone){
 var dateInitial = moment.tz($scope.InboxListRawData.content[i][4],patientDashboard.serverDateTimeZone);
 var dateFinal = moment.tz(dateInitial,$scope.preferredTimezone).format(patientDashboard.timestampMMDDYYHHMMSS);
 tempDate.push(dateFinal);
}
else{
  tempDate.push(dateService.getDateTimeFromTimeStamp($scope.InboxListRawData.content[i][4],patientDashboard.dateFormat ,'/'));
}
 }
if($scope.InboxListRawData.content.length){
  for(var i=0;i<$scope.InboxListRawData.content.length;i++){
    $scope.InboxMessageList[i][4] = $scope.GetDateifToday(tempDate[i]);
}
}

/* if($scope.InboxMessageList.length){
  $scope.getMessageBody($scope.InboxMessageList[0]);
 }*/
  if($scope.totalMessages == 0){
  $scope.nodataflag = true;
  $scope.nomessagebodyavailable = true;
 }
 }).catch(function(response){

      });

}
else if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
toPassID = StorageService.get('logged').userId; //to be changed to $scope.selectedClinicForMessagesID when inbox with clinic Id is implemented
isClinic = 1;
  messageService.fetchInboxItemsCA(toPassID,isClinic,$stateParams.clinicId,$scope.PageNumber,$scope.perPageCount,$scope.sortOption).then(function(response){
$scope.InboxListRawData = response.data;
$scope.pageCount = $scope.InboxListRawData.totalPages;
$scope.totalMessages = $scope.InboxListRawData.totalElements;
$scope.InboxMessageList = angular.extend({},$scope.InboxMessageList, $scope.InboxListRawData.content);
    for(var i=0;i<$scope.InboxListRawData.content.length;i++){
     //tempDate.push(dateService.getDateTimeFromTimeStamp($scope.InboxListRawData.content[i][4],patientDashboard.dateFormat ,'/')); 
      if($scope.preferredTimezone){ 
 var dateInitial = moment.tz($scope.InboxListRawData.content[i][4],patientDashboard.serverDateTimeZone);
 var dateFinal = moment.tz(dateInitial,$scope.preferredTimezone).format(patientDashboard.timestampMMDDYYHHMMSS);
 tempDate.push(dateFinal);
}
else{
  tempDate.push(dateService.getDateTimeFromTimeStamp($scope.InboxListRawData.content[i][4],patientDashboard.dateFormat ,'/'));
}
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
  messageService.fetchInboxItemsCA(toPassID,isClinic,$stateParams.clinicId,$scope.PageNumber, $scope.perPageCount,$scope.sortOption).then(function(response){
    $scope.InboxListRawData = response.data;
    $scope.pageCount = $scope.InboxListRawData.totalPages;
    $scope.totalMessages = $scope.InboxListRawData.totalElements;
    $scope.InboxMessageList = angular.extend({},$scope.InboxMessageList, $scope.InboxListRawData.content);
    for(var i=0;i<$scope.InboxListRawData.content.length;i++){
     //tempDate.push(dateService.getDateTimeFromTimeStamp($scope.InboxListRawData.content[i][4],patientDashboard.dateFormat ,'/')); 
     if($scope.preferredTimezone){ 
 var dateInitial = moment.tz($scope.InboxListRawData.content[i][4],patientDashboard.serverDateTimeZone);
 var dateFinal = moment.tz(dateInitial,$scope.preferredTimezone).format(patientDashboard.timestampMMDDYYHHMMSS);
 tempDate.push(dateFinal);
}
else{
  tempDate.push(dateService.getDateTimeFromTimeStamp($scope.InboxListRawData.content[i][4],patientDashboard.dateFormat ,'/'));
}
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
   toastr.error('Please enter To field');
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
  if($scope.SelectedPatientsID.length==0)
  {
   toastr.error('Please enter To field');
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
  $scope.perPageCount = 10;
   $scope.PageNumber=1; 
  messageService.sendMessageService($scope.sampleData).then(function(response){
     notyService.showMessage(response.data.statusMsg, 'success');
     $scope.SwitchTabs('inbox');
      $scope.submitted = false;
       $scope.close();
   $scope.closeCA();
 }).catch(function(response){
       $scope.close();
   $scope.closeCA();
   notyService.showError(response);
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
  if($scope.ReplymessageAttributesObject[0][0].messageType === 'ROOT'){
if(StorageService.get('logged').role === 'PATIENT'){
  $scope.sampleData = {
    "fromUserId" : StorageService.get('logged').patientID, 
    "messageSubject" : "RE: "+$scope.ReplymessageAttributesObject[0][0].messageSubject,
    "messageSizeMbs": $scope.dummyvalue,
    "messageType": 'RE',
    "isArchived":"false",
    "isRead":"false",
    "toMessageId":$scope.ReplymessageAttributesObject[0][0].toMessageId,
    "rootMessageId":$scope.ReplymessageAttributesObject[0][0].rootMessageId,
    "messageText":$scope.replyattributes.replyData,
    "toClinicIds":[$scope.toID]
  };
  }
  else if((StorageService.get('logged').role === 'CLINIC_ADMIN'))
  {
 $scope.sampleData = {
  "fromUserId" : StorageService.get('logged').userId,
  "fromClinicId" : $scope.selectedClinicForCA.id,//$scope.selectedClinicForMessagesID,
  "messageSubject" : "RE: "+$scope.ReplymessageAttributesObject[0][0].messageSubject,
  "messageSizeMbs": $scope.dummyvalue,
  "messageType": 'RE',
  "isArchived":"false",
  "isRead":"false",
  "toMessageId":$scope.ReplymessageAttributesObject[0][0].toMessageId,
  "rootMessageId":$scope.ReplymessageAttributesObject[0][0].rootMessageId,
  "messageText":$scope.replyattributes.replyData,
  "toUserIds":[$scope.toID]
};
}
}
else if($scope.ReplymessageAttributesObject[0][0].messageType === 'RE'){
  if(StorageService.get('logged').role === 'PATIENT'){
  $scope.sampleData = {
    "fromUserId" : StorageService.get('logged').patientID, 
    "messageSubject" :$scope.ReplymessageAttributesObject[0][0].messageSubject,
    "messageSizeMbs": $scope.dummyvalue,
    "messageType": 'RE',
    "isArchived":"false",
    "isRead":"false",
    "toMessageId":$scope.ReplymessageAttributesObject[0][0].toMessageId,
    "rootMessageId":$scope.ReplymessageAttributesObject[0][0].rootMessageId,
    "messageText":$scope.replyattributes.replyData,
    "toClinicIds":[$scope.toID]
  };
  }
  else if((StorageService.get('logged').role === 'CLINIC_ADMIN'))
  {
 $scope.sampleData = {
  "fromUserId" : StorageService.get('logged').userId,
  "fromClinicId" : $scope.selectedClinicForCA.id,//$scope.selectedClinicForMessagesID,
  "messageSubject" :$scope.ReplymessageAttributesObject[0][0].messageSubject,
  "messageSizeMbs": $scope.dummyvalue,
  "messageType": 'RE',
  "isArchived":"false",
  "isRead":"false",
  "toMessageId":$scope.ReplymessageAttributesObject[0][0].toMessageId,
  "rootMessageId":$scope.ReplymessageAttributesObject[0][0].rootMessageId,
  "messageText":$scope.replyattributes.replyData,
  "toUserIds":[$scope.toID]
};
}
}
  messageService.sendMessageService($scope.sampleData).then(function(response){
     notyService.showMessage(response.data.statusMsg, 'success');
     document.getElementById("replybox").style.display = "none";
      $scope.submitted = false;
      $scope.replyattributes.replyData = "";
       $scope.close();
     $scope.closeCA();
     $scope.replyFlag = false;
 }).catch(function(response){
      $scope.close();
     $scope.closeCA();
      });
    $scope.ReplymessageAttributesObject = {};
    $scope.replyattributes.replyData = "";
    $scope.replyFlag = false;  
};
/******End of-On click of Reply******/
/*******To fetch sent items on click of sent items menu option******/
$scope.SentItems = function(){
  $scope.incrementerSent();
  $scope.MessageDetails =null;
  var toPassID = 0;
  var isclinic = 0;
  var tempDate = [];
  $scope.totalMessages = 0;
if(StorageService.get('logged').role === 'PATIENT'){
toPassID = StorageService.get('logged').patientID;
isclinic = 0;
messageService.fetchSentItems(toPassID,isclinic,$scope.PageNumber,$scope.perPageCount,$scope.SentsortOption).then(function(response){
    $scope.sentmessageListRawData = response.data;
      $scope.pageCount = $scope.sentmessageListRawData.totalPages;
      $scope.totalMessages = $scope.sentmessageListRawData.totalElements;
      $scope.numberOfMessages = $scope.sentmessageListRawData.numberOfElements;
      $scope.checkFirst = $scope.sentmessageListRawData.first;

 $scope.MessageDetails = angular.copy($scope.sentmessageListRawData.content[0]);
        $scope.sentmessageList = angular.extend({},$scope.sentmessageList, $scope.sentmessageListRawData.content);
    for(var i=0;i<$scope.sentmessageListRawData.content.length;i++){
    // tempDate.push(dateService.getDateTimeFromTimeStamp($scope.sentmessageList[i][1],patientDashboard.dateFormat ,'/'));
    if($scope.preferredTimezone){ 
var dateInitial = moment.tz($scope.sentmessageList[i][1],patientDashboard.serverDateTimeZone);
 var dateFinal = moment.tz(dateInitial,$scope.preferredTimezone).format(patientDashboard.timestampMMDDYYHHMMSS);
 tempDate.push(dateFinal);
}
else{
  tempDate.push(dateService.getDateTimeFromTimeStamp($scope.sentmessageList[i][1],patientDashboard.dateFormat ,'/'));
}
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
      if($scope.preferredTimezone){
   var dateInitial = moment.tz($scope.sentmessageList[i][1],patientDashboard.serverDateTimeZone);
   var dateFinal = moment.tz(dateInitial,$scope.preferredTimezone).format(patientDashboard.timestampMMDDYYHHMMSS);
 tempDate.push(dateFinal); 
}
else{
  tempDate.push(dateService.getDateTimeFromTimeStamp($scope.sentmessageList[i][1],patientDashboard.dateFormat ,'/'));
}
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
          $scope.isAllSelected = false;
          $scope.unreadflag = false;
          $scope.readflag = false;
        }
        else if (track === 'NEXT' && $scope.currentPageIndex < $scope.pageCount){
            $scope.PageNumber++;
            $scope.currentPageIndex++;
            $scope.isAllSelected = false;
            $scope.unreadflag = false;
            $scope.readflag = false;
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
       var patientsname = patient.lastName + ' , ' + patient.firstName;
        var obj = {
          'name': patientsname,
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
  $scope.selectpatient = function(){
 $scope.SelectedPatientsID = [];
 for(var j=0;j<$scope.selectedPatients.length;j++){
    for(var i=0;i<$scope.patients.length;i++){
if($scope.selectedPatients[j].name == ($scope.patients[i].lastName + ' , ' + $scope.patients[i].firstName)){
        $scope.SelectedPatientsID.push($scope.patients[i].id);
       }

    }
 }
  };
  $scope.ArchiveMessages = function(){
    $scope.isAllSelected = false;
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
        "id": $scope.checkedArray[i],
        "userId": userid,
        "messageId": "",
        "archived": "true",
        "read": ""
      }
        responseData.push(res) ;
    }
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
    $scope.isAllSelected = false;
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
        "id": $scope.checkedArrayforRead[i],
        "userId": userid,
        "messageId": "",
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
        "id":$scope.checkedArrayforRead[i],
        "userId": userid,
        "messageId": "",
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
        $scope.isAllSelected = false;
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
        "id": $scope.checkedArrayforUnRead[i],
        "userId": userid,
        "messageId": "",
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
        "id":$scope.checkedArrayforUnRead[i],
        "userId": userid,
        "messageId": "",
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
/*$scope.selectedClinicForCA = null;*/

$state.go('Messages_CA', {'clinicId':clinic.id});
$scope.selectedClinicForCA = angular.copy(clinic);
//$scope.SwitchTabs('inbox',1);
//$rootScope.ClinicForCA = $scope.selectedClinicForCA;
  };

   $scope.switchClinicHCP = function(clinic){
$state.go('Messages_HCP', {'clinicId':clinic.id});
$scope.selectedClinicForHCP = angular.copy(clinic);
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
          $scope.checkedArray.push(itm[0]);
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
          $scope.checkedArrayforRead.push(itm[0]);
      }
     
    });
  };

  $scope.getSeletedDataForUnRead = function(){
    angular.forEach($scope.InboxMessageList, function(itm){
      if (itm.selected) 
      {
          $scope.checkedArrayforUnRead.push(itm[0]);
      }
    });
  };
    $scope.getSeletedDataForArchiveRead = function(){
    angular.forEach($scope.ArchiveMessageList, function(itm){
      if (itm.selected) 
      {
          $scope.checkedArrayforRead.push(itm[0]);
      }
     
    });
  };

  $scope.getSeletedDataForArchiveUnRead = function(){
    angular.forEach($scope.ArchiveMessageList, function(itm){
      if (itm.selected) 
      {
          $scope.checkedArrayforUnRead.push(itm[0]);
      }
    });
  };
  /******End of getting the ID of selected checkboxes ******/ 

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

$scope.getMessageBody = function(arrayobject){
 var inboxObject = {};
    inboxObject = angular.copy(arrayobject);
    $scope.toID = [];
    var userid = "";
    var clinicid = "";
   
    var id=arrayobject[3];
      var rootid=0;
  var tempDate = [];
 
    if(StorageService.get('logged').role === 'PATIENT')
      {
        userid = StorageService.get('logged').patientID; 

$scope.toID = arrayobject[9];
clinicid = arrayobject[9];
         if(inboxObject[7] == 'ROOT'){
         rootid=inboxObject[3];
       }
       else{
        rootid=inboxObject[13];
       }
      }
      else if(StorageService.get('logged').role === 'CLINIC_ADMIN'){
      userid = arrayobject[10]; 
      clinicid = $scope.selectedClinicForCA.id;
        $scope.toID = arrayobject[10];
      if(inboxObject[7] == 'ROOT'){
         rootid=inboxObject[3];
       }
       else{
        rootid=inboxObject[12];
       }
    }
    else if(StorageService.get('logged').role === 'HCP'){
             userid = arrayobject[10]; 
      clinicid = $scope.selectedClinicForHCP.id;
      if(inboxObject[7] == 'ROOT'){
         rootid=inboxObject[3];
       }
       else if(inboxObject[7] == 'RE'){
        rootid=inboxObject[12];
       }
    }
messageService.getthreaddata(id,rootid,userid,clinicid).then(function(response){
  $scope.messageBodyObject = response.data;
  for(var i=0;i<response.data.length;i++){
    //tempDate.push(dateService.getDateTimeFromTimeStamp(response.data[i][0].messageDatetime,patientDashboard.dateFormat ,'/')); 
    if($scope.preferredTimezone){
  var dateInitial = moment.tz(response.data[i][0].messageDatetime,patientDashboard.serverDateTimeZone);
 var dateFinal = moment.tz(dateInitial,$scope.preferredTimezone).format(patientDashboard.timestampMMDDYYHHMMSS);
 tempDate.push(dateFinal);
}
else{
  tempDate.push(dateService.getDateTimeFromTimeStamp(response.data[i][0].messageDatetime,patientDashboard.dateFormat ,'/'));
}
  }
if(response.data.length){
  for(var i=0;i<response.data.length;i++){
    $scope.messageBodyObject[i][0].messageDatetime = $scope.GetDateifToday(tempDate[i]);
}
}
}).catch(function(response){
        notyService.showError(response);
      });
if($scope.flag == 'inbox'){
  $scope.messagelistflag = false;
$scope.messagebodyflag = true;
}
else if($scope.flag == 'archive'){
  $scope.archivemessagelistflag = false;
  $scope.archivemessagebodyflag = true;
}
  $scope.checkedArrayforRead.push(inboxObject[0]);
    $scope.markAsRead();
  
  }; 

   $scope.getMessageBodySent = function(arrayobject){
    var name = arrayobject[6];
var date = arrayobject[1];
var id = arrayobject[2];
var tempDate = [];
messageService.getMessageBodyService(id).then(function(response){
    $scope.sentmessageBody = response.data;
   if(response.data){
    if($scope.preferredTimezone){
  var dateInitial = moment.tz(response.data.messageDatetime,patientDashboard.serverDateTimeZone);
 var dateFinal = moment.tz(dateInitial,$scope.preferredTimezone).format(patientDashboard.timestampMMDDYYHHMMSS);
   $scope.sentmessageBody.date = $scope.GetDateifToday(dateFinal);
 }
 else{
  $scope.sentmessageBody.date = arrayobject[1];
 }
}
if(StorageService.get('logged').role === 'CLINIC_ADMIN'){       
  $scope.sentmessageBody.name = arrayobject[6];
}
else if(StorageService.get('logged').role === 'PATIENT'){

 $scope.sentmessageBody.name = arrayobject[6];

}
$scope.sentmessagelistflag = false;
      $scope.sentmessagebodyflag = true; 
}).catch(function(response){
      });
  
   };
   $scope.getMessageBodyarchive = function(arrayobject){
    var name = arrayobject[6];
var date = arrayobject[4];
var id = arrayobject[3];
var tempDate = [];
 $scope.checkedArrayforRead.push(arrayobject[3]);
    $scope.markAsRead();
messageService.getMessageBodyService(id).then(function(response){
    $scope.archivemessageBodyObject  = response.data;
    if(response.data){
      if($scope.preferredTimezone){
      var dateInitial = moment.tz(response.data.messageDatetime,patientDashboard.serverDateTimeZone);
       var dateFinal = moment.tz(dateInitial,$scope.preferredTimezone).format(patientDashboard.timestampMMDDYYHHMMSS);
        $scope.archivemessageBodyObject.date = $scope.GetDateifToday(dateFinal);
      }
      else{
        $scope.archivemessageBodyObject.date = arrayobject[4];
      }
   
  }
       if(StorageService.get('logged').role === 'CLINIC_ADMIN' || StorageService.get('logged').role === 'HCP'){
        if(!arrayobject[8] && arrayobject[9]){
 $scope.archivemessageBodyObject.name = arrayobject[9];
}
else if(!arrayobject[9] && arrayobject[8]){
  $scope.archivemessageBodyObject.name = arrayobject[8] ;
}
else if(arrayobject[9] && arrayobject[8]){
  $scope.archivemessageBodyObject.name = arrayobject[8] + ' ' + arrayobject[9];
}
}
else if(StorageService.get('logged').role === 'PATIENT'){

 $scope.archivemessageBodyObject.name = arrayobject[8];

}
 $scope.archivemessagelistflag = false;
  $scope.archivemessagebodyflag = true;
}).catch(function(response){
      });
  
   };



  $scope.replyToMessage = function(arrayobject){
    $scope.ReplymessageAttributesObject = {};
$scope.ReplymessageAttributesObject = angular.copy(arrayobject);
document.getElementById("replybox").style.display = "block";
$scope.replyFlag = true;
  };
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
$scope.goToBack = function(flag)
{  
  $scope.replyFlag = false;
  $scope.replyattributes.replyData = "";
  if(flag=="inbox")
  {
     $scope.messagelistflag = true;
     $scope.messagebodyflag = false;
  }
  else if(flag=="sentitems")
  {
       $scope.sentmessagelistflag = true;
      $scope.sentmessagebodyflag = false; 
  }
  else if(flag=="archive")
  {
     $scope.archivemessagelistflag = true;
     $scope.archivemessagebodyflag = false;
  }
} 
$scope.init();
  }]);