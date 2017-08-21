angular.module('hillromvestApp')
.controller('patientsannouncementsController',['$scope', '$location','$state', 'announcementservice', 'notyService', '$stateParams', 'clinicService', 'UserService', 'StorageService', 'commonsUserService', 'patientDashBoardService',
  function($scope, $location,$state, announcementservice, notyService, $stateParams, clinicService, UserService, StorageService, commonsUserService,patientDashBoardService) {
    
    $scope.currentPageIndex = 1;
    $scope.perPageCount = 5;
    $scope.pageCount = 0;
    $scope.total = 0;
    $scope.totalPages = 0;
    $scope.userRole = StorageService.get('logged').role;
    $scope.userId = "";
    $scope.nodatadiv = false;
       $scope.toTimeStamp = new Date().getTime(); 
$scope.initCount("");
/*patientService.getDevices(StorageService.get('logged').patientID).then(function(response){
console.log("vestwala");
  console.log(response);
$scope.userId ='patientId='+response.data.deviceList[0].patient.id;
  }).catch(function(response) {});*/

 angular.element(document).ready(function () {
        if($scope.userRole === 'PATIENT'){
patientDashBoardService.getHMRrunAndScoreRate(StorageService.get('logged').patientID, $scope.toTimeStamp, $scope.getDeviceTypeforBothIcon()).then(function(response){
  $scope.userId ='patientId='+response.data.patient.id;
  $scope.searchUsers();
      }).catch(function(response) {});

}
    });



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

      /*if($scope.userRole === 'PATIENT'){
         $scope.userId = 'patientId='+StorageService.get('logged').patientID;
       }
       else {
        $scope.userId = 'userTypeId='+StorageService.get('logged').userId;
       }*/
        var sortOption = sortConstant.announcementModifiedDatePatient+'&asc=false';
      announcementservice.ListAnnouncementPatient($scope.currentPageIndex, $scope.perPageCount, sortOption,$scope.userRole,$scope.userId).then(function(response) {
          $scope.announcement = response.data.Announcement_List.content;
          $scope.total = response.data.Announcement_List.totalElements;
          $scope.totalPages = response.data.Announcement_List.totalPages;
          if(response.data.Announcement_List.content.length == 0){
            $scope.nodatadiv = true;
          }
         // $scope.pageCount = Math.ceil($scope.total / 5);
          //console.log(JSON.stringify($scope.announcement));
      }).catch(function(response) {});
    };
    
    $scope.downloadChartsAsPdf = function(pdfName){
      var filename = pdfName.split('/').pop().split('.');
      announcementservice.DownloadAsPDF(filename[0]);
    }
  }]);