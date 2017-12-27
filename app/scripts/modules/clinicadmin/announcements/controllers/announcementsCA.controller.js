angular.module('hillromvestApp')
.controller('clinicadminannouncementsController',['$scope', '$location','$state', 'announcementservice', 'notyService', '$stateParams', 'clinicService', 'UserService', 'StorageService', 'commonsUserService', 'clinicadminService', 'DoctorService', '$filter',
  function($scope, $location,$state, announcementservice, notyService, $stateParams, clinicService, UserService, StorageService, commonsUserService,clinicadminService,DoctorService,$filter) {
    

 //to get unread messages count
$scope.init = function(){
      $scope.currentPageIndex = 1;
    $scope.perPageCount = 5;
    $scope.pageCount = 0;
    $scope.total = 0;
    $scope.totalPages = 0;
    $scope.userRole = StorageService.get('logged').role;
    $scope.userId = "";
    $scope.nodatadiv = false;
    $scope.selectedClinic = {};
if($scope.userRole === 'HCP'){
      $scope.getClinicsForHCP();

    } else if($scope.userRole === 'CLINIC_ADMIN') {
      $scope.prescribeDevice = true;
      $scope.getClinicsForClinicAdmin(); 
     
    }
    $scope.getisMessagesOpted();
    var clinicid = ($stateParams.clinicId)?($stateParams.clinicId):$scope.selectedClinic.id;
    $scope.initCount(clinicid);

};
    $scope.searchUsers = function(track) {          
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

        $scope.userId = 'userTypeId='+StorageService.get('logged').userId;
       var sortOption = sortConstant.announcementModifiedDate+'&asc=false';
      announcementservice.ListAnnouncement($scope.currentPageIndex, $scope.perPageCount,sortOption, $scope.userRole,$scope.userId,$scope.selectedClinic.id).then(function(response) {
          $scope.announcement = response.data.Announcement_List.content;
           $scope.totalPages = response.data.Announcement_List.totalPages;
         $scope.numberOfElements = response.data.Announcement_List.numberOfElements;
         $scope.totalElements = response.data.Announcement_List.totalElements;
          $scope.total = response.data.Announcement_List.totalElements;
          $scope.totalPages = response.data.Announcement_List.totalPages;
          if(response.data.Announcement_List.content.length == 0){
            $scope.nodatadiv = true;
          }
         // $scope.pageCount = Math.ceil($scope.total / 5);
          //console.log(JSON.stringify($scope.announcement));
      }).catch(function(response) {});
    };
      $scope.getClinicsForHCP = function() {
    DoctorService.getClinicsAssociatedToHCP(StorageService.get('logged').userId).then(function(response){
      if(response.data && response.data.clinics){
  $scope.clinics = $filter('orderBy')(response.data.clinics, "name");
 if($stateParams.clinicId !== undefined && $stateParams.clinicId !== null){
      $scope.selectedClinic = commonsUserService.getSelectedClinicFromList($scope.clinics, $stateParams.clinicId);
      }
      else{
  $scope.selectedClinic = $scope.clinics[0];
}
}
 $scope.searchUsers(); 
      }).catch(function(response){
        notyService.showError(response);
      });
  };
    $scope.getClinicsForClinicAdmin = function() {

    clinicadminService.getClinicsAssociated(StorageService.get('logged').userId).then(function(response){
if(response.data && response.data.clinics){
  $scope.clinics = $filter('orderBy')(response.data.clinics, "name");
 if($stateParams.clinicId){
     // $scope.selectedClinic = commonsUserService.getSelectedClinicFromList($scope.clinics, $stateParams.clinicId);
for(var i=0;i<$scope.clinics.length;i++){
  if($scope.clinics[i].id == $stateParams.clinicId){
    $scope.selectedClinic = $scope.clinics[i];
    break;
  }
}
     
      }
      else{
  $scope.selectedClinic = $scope.clinics[0];
}
}
 $scope.searchUsers(); 
    }).catch(function(response){
      notyService.showError(response);
    });
  };
  $scope.switchClinic = function(clinic){
    $scope.selectedClinic = clinic;

if($scope.userRole === 'HCP'){
     $state.go('hcpannouncements',{'clinicId':$scope.selectedClinic.id});
    } else if($scope.userRole === 'CLINIC_ADMIN') {
      $state.go('clinicadminannouncements',{'clinicId':$scope.selectedClinic.id});
    }
  
  };
    $scope.downloadChartsAsPdf = function(pdfName){
      var filename = pdfName.split('/').pop().split('.');
      announcementservice.DownloadAsPDF(filename[0]);
    }
$scope.init();
  

  }]);