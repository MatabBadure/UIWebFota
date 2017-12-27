angular.module('hillromvestApp')
.controller('clinicadminclinicController',['$scope', '$location','$state', 'clinicadminService', 'notyService', '$stateParams', 'clinicService', 'UserService', 'StorageService', '$timeout' ,'commonsUserService',
  function($scope, $location,$state, clinicadminService, notyService, $stateParams, clinicService, UserService, StorageService, $timeout , commonsUserService) {

    $scope.init = function(){
      $scope.totalPatientsforAdherenceCal = 0;
      $scope.processedPatientsforAdherenceCal = 0;
      $scope.statusForColor = false;
      $scope.waitforcalculation = false;
      clinicService.getClinicSpeciality().then(function(response){
         $scope.specialities =  response.data.typeCode;
      }).catch(function(response){
      
      });
      var currentRoute = $state.current.name;
      if (currentRoute === 'clinicadminclinicdashboard' || currentRoute === 'adherenceSettingPage') {   
      $scope.clinicDashboardInit(); 
      $scope.getisMessagesOpted();
      $scope.initCount($stateParams.clinicId);
    }
    if(currentRoute === 'adherenceSettingPage'){
      $scope.getAdherenceScoreSettingDays();  
    }
    }; 

$scope.getAdherenceScoreSettingDays = function(){
 clinicService.getAdherenceScoreDays().then(function(response){
          $scope.adherenceDays =  response.data.typeCode;
      /*   var adherenceDayslength = Number($scope.adherenceDays.length);
         for(var i = 0 ;i<adherenceDayslength;i++)
         {
          var res = $scope.adherenceDays[i].type_code.split(" ");
           if(Number(res[0]) === $scope.clinic.adherenceSetting)
           {
           $scope.selectedNumberOfDays = $scope.adherenceDays[i].type_code;
              break;
           }
  
         }
        $scope.adherenceDaysList = $scope.adherenceDays;*/
      }).catch(function(response){
      
      });
};
     $scope.isActive = function(tab) {
          var path = $location.path();
          if (path.indexOf(tab) !== -1) {
            return true;
          } else {
            return false;
          }
        };


    $scope.switchTab = function(tab)
    {
        $state.go(tab, {"clinicId": $stateParams.clinicId});
    };

    $scope.clinicDashboardInit = function(){
      var benchmarkingClinic = (StorageService.get('benchmarkingClinic') && StorageService.get('benchmarkingClinic').clinic) ? StorageService.get('benchmarkingClinic').clinic.id : null;
      $scope.stateParamclinicId = ($stateParams.clinicId) ? $stateParams.clinicId : (benchmarkingClinic ? benchmarkingClinic : null) ;      
      $scope.clinicStatus={'editMode' : true};
      $scope.getClinicsAssociatedToClinicadmin();
      $scope.getStates();
      $scope.getClinic($scope.stateParamclinicId);
    };

    $scope.getStates = function(){
      UserService.getState().then(function(response) {
        $scope.states = response.data.states;
      }).catch(function(response) {
        notyService.showError(response);
      });
    };

    $scope.getClinicsAssociatedToClinicadmin = function(){
      clinicadminService.getClinicsAssociated(StorageService.get('logged').userId).then(function(response){
        $scope.clinics = response.data.clinics;
        angular.forEach($scope.clinics, function(clinic){
          if(clinic.id === $scope.stateParamclinicId){
            $scope.selectedClinic =  clinic;
          }
        });
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.getClinic = function(clinicId){
      clinicService.getClinic(clinicId).then(function(response){
        $scope.clinic = response.data.clinic;
        $scope.clinic.zipcode = commonsUserService.formatZipcode($scope.clinic.zipcode);
        if($scope.clinic.parent){
          $scope.clinic.type = "parent";
        }else{
           $scope.clinic.type = "child";
        }
        if($scope.clinic.deleted){
          $scope.clinic.status = 'Inactive';
        }else{
          $scope.clinic.status = 'Active';
        }
        
        if($scope.clinic.adherenceSetting == 3){
          $scope.selectedNumberOfDays = $scope.clinic.adherenceSetting+" Days(Default)";
        }
        else if($scope.clinic.adherenceSetting == 1){
          $scope.selectedNumberOfDays = $scope.clinic.adherenceSetting+" Day";
        }
        else{
          $scope.selectedNumberOfDays = $scope.clinic.adherenceSetting+" Days";
        }
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.editClinic = function(){
      if($scope.form.$invalid){
        return false;
      }
      var data = $scope.clinic;
      clinicService.updateClinic(data).then(function(response){
        $scope.showModal = false;
        notyService.showMessage(response.data.message, 'success');
      }).catch(function(response){
        notyService.showError(response);
      });
    };

    $scope.setDays = function(){
      if($scope.form.$invalid){
        return false;
      }
      var daysCount = $scope.selectedNumberOfDays;
      var res = daysCount.split(" ");
      var dayValue = Number(res[0]);
      var data = {
        'adherenceSetting':dayValue,
        'adherenceSettingFlag':'true'
      };
      $scope.showSetDayModal = false;
      $scope.waitforcalculation = true;
      clinicService.updateDaysForCalculation(data,$stateParams.clinicId).then(function(response){
       

        $scope.showProgressBar = function(){
        
        var myEl = angular.element( document.querySelector( '.spinner' ) );
       myEl.css('display','none');

       clinicService.adherenceResetProgress($stateParams.clinicId).then(function(response){ 
         
         $scope.adherenceResetProgressData = response.data;
         $scope.adherenceResetProgressStatus = response.data.sta;
         $scope.processedPatientsforAdherenceCal = response.data.cur;
         $scope.totalPatientsforAdherenceCal = response.data.tot;
       
        if($scope.adherenceResetProgressStatus == "inprogress"){
          
        $timeout($scope.showProgressBar, 1000);
        }
        else
        {
          if($scope.adherenceResetProgressStatus == "completed")
          {
            $scope.waitforcalculation = false;

        notyService.showMessage("Adherence re-calculation sucessfully completed.", 'success');
        $state.go('adherenceSettingPage',{"clinicId": $stateParams.clinicId});
        $scope.showSetDayModal = false;
          }
        }
     }).catch(function(response){
        /*$scope.showSetDayModal = false;
        $scope.waitforcalculation = false;
        notyService.showError(response);*/
      });
    };
     $scope.showProgressBar();


     ///////////////   
        
      }).catch(function(response){
        $scope.showSetDayModal = false;
        $scope.waitforcalculation = false;
        notyService.showError(response);
      });
    };

    $scope.cancelEditClinic = function(){
      $state.go('clinicadmindashboard');
    };

    $scope.cancelEditSetDays= function(){
      $state.go('adherenceSettingPage');
    };

    $scope.switchClinic = function(clinic){
      if($state.current.name === 'adherenceSettingPage'){
$state.go('adherenceSettingPage',{"clinicId": clinic.id});
      }
      else
      $state.go('clinicadminclinicdashboard', {'clinicId':clinic.id})
    };

    $scope.showSetDays = function(){
      if($scope.form.$invalid){
        return false;
      }else {
        $scope.showSetDayModal= true;
      }
    };
    
    $scope.showUpdateClinicModal = function(){
      if($scope.form.$invalid){
        return false;
      }else {
        $scope.showModal = true;
      }
    };

    $scope.init();

  }]);
