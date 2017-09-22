angular.module('hillromvestApp')
.controller('patientsannouncementsController',['$scope', '$location','$state', 'announcementservice', 'notyService', '$stateParams', 'clinicService', 'UserService', 'StorageService', 'commonsUserService', 'patientDashBoardService', 'caregiverDashBoardService',
  function($scope, $location,$state, announcementservice, notyService, $stateParams, clinicService, UserService, StorageService, commonsUserService,patientDashBoardService,caregiverDashBoardService) {
    
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

 $scope.searchAnnouncements = function(track) {      
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
        var sortOption = sortConstant.announcementModifiedDatePatient+'&asc=false';
      announcementservice.ListAnnouncementPatient($scope.currentPageIndex, $scope.perPageCount, sortOption,$scope.userRole,$scope.userId).then(function(response) {
          $scope.announcement = response.data.Announcement_List.content;
          $scope.total = response.data.Announcement_List.totalElements;
          $scope.totalPages = response.data.Announcement_List.totalPages;
          if(response.data.Announcement_List.content.length == 0){
            $scope.nodatadiv = true;
          }

      }).catch(function(response) {});
    };

    $scope.init = function(){
      if($scope.userRole === 'PATIENT'){
      $scope.getuserIdForAnnouncements(StorageService.get('logged').patientID);
    }
    else if($scope.userRole === 'CARE_GIVER'){
      $scope.getPatientListForCaregiver(StorageService.get('logged').userId);
    }
  };
  $scope.getuserIdForAnnouncements = function(patientId){
    patientDashBoardService.getHMRrunAndScoreRate(patientId, $scope.toTimeStamp, $scope.getDeviceTypeforBothIcon()).then(function(response){
      $scope.userId ='patientId='+response.data.patient.id;
      $scope.searchAnnouncements();
          }).catch(function(response) {});
  }
    $scope.switchPatient = function(patient){
       if(patient.deviceType == 'ALL'){
          localStorage.setItem('deviceType_'+patient.user.id, 'VEST');
          localStorage.setItem('deviceTypeforBothIcon_'+patient.user.id, 'ALL');
       }
           else{
            localStorage.setItem('deviceType_'+patient.user.id, patient.deviceType);
            localStorage.setItem('deviceTypeforBothIcon_'+patient.user.id, patient.deviceType);
          }
        $scope.selectedPatient = patient;
        $scope.patientId = $scope.selectedPatient.userId;
         var currentname = $state.current.name;
        $state.go(currentname,{'patientId':$scope.patientId});
    };
    $scope.downloadChartsAsPdf = function(pdfName){
      if(pdfName){
      var filename = pdfName.split('/').pop().split('.');
      announcementservice.DownloadAsPDF(filename[0]);
    }
    else{
      notyService.showError('PDF file path is null');
    }      
    };
    $scope.getPatientListForCaregiver = function(caregiverID){
      var currentname = $state.current.name;
     
      caregiverDashBoardService.getPatients(caregiverID).then(function(response){
                $scope.patients = response.data.patients;
                if($stateParams.patientId){
                  for(var i=0;i<response.data.patients.length;i++){
                    if($stateParams.patientId == response.data.patients[i].userId){
  
                    $scope.patientId = $stateParams.patientId;
                   $scope.userId ='patientId='+response.data.patients[i].patientId;
                    $scope.selectedPatient = response.data.patients[i];
                    var logged = StorageService.get('logged');                   
                    logged.patientID = $scope.patientId ;                      
                    StorageService.save('logged', logged);
                    $scope.$emit('getSelectedPatient', $scope.selectedPatient);
                    break;   
                    }     
                }
                } else{
                 $scope.selectedPatient = response.data.patients[0];
                 $scope.patientId = $scope.selectedPatient.userId;
                 $scope.userId ='patientId='+response.data.patients[0].patientId;
                 $scope.$emit('getSelectedPatient', $scope.selectedPatient);
                 var logged = StorageService.get('logged');                    
                 logged.patientID = $scope.patientId               
                 StorageService.save('logged', logged);
                }  
           $scope.$emit('getPatients', $scope.patients);
      $scope.searchAnnouncements();
      }).catch(function(response){
        // notyService.showError(response);
      });
    };

    $scope.init();
  }]);