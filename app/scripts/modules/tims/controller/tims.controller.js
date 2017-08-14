'use strict';


angular.module('hillromvestApp')
.controller('timsController',['$scope', '$location','$state', 'clinicadminService', 'notyService', '$stateParams', 'clinicService', 'UserService', 'StorageService','$timeout', 'commonsUserService', 'TimService','searchFilterService','dateService','sortOptionsService',
  function($scope, $location,$state, clinicadminService, notyService, $stateParams, clinicService, UserService, StorageService, $timeout, commonsUserService,TimService,searchFilterService,dateService,sortOptionsService) {
    $scope.IsVisible = false;
    $scope.visible = true;
    $scope.currentPageIndex = 1;
    $scope.pageCount = 1;
    $scope.perPageCount = 10;
    $scope.PageNumber = 1;
    $scope.totalElements = 0;
    $scope.rangeFlag = 'week';
    $scope.rangeFlag = 'week';
    $scope.format = 'weekly';
    $scope.nextDate= new Date();
    $scope.badgetoTimeStamp = "";
    $scope.badgefromTimeStamp = "";
      $scope.selectedDateOption = 'WEEK';
      $scope.selectedDateOptionBadge = 'YESTERDAY';
      $scope.toTimeStamp = new Date().getTime();
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(patientDashboard.minDaysForMonthlyGraph);
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.badgetoTimeStamp = new Date().getTime();
      $scope.badgefromTimeStamp = new Date().getTime();
     // $scope.sortOption ="date&asc=false";
     $scope.sortOption = "";
     $scope.badgestatistics = {};
      $scope.badgestatistics.date = "";
    $scope.timsFilter = searchFilterService.initSearchFiltersForTims();
    $scope.timsLogDetails = "";
    $scope.showFreezeModal = false;
    

    
    $scope.sortTimsLogList = sortOptionsService.getSortOptionsForTimsLogList();

    
     $scope.dateOpts1 = {
      maxDate: new Date(),
      format: patientDashboard.dateFormat,
      eventHandlers: {'apply.daterangepicker': function(ev, picker) {
          $scope.calculateDateFromPicker(picker);
          $scope.timslog();
        }
      },
      opens: 'left'
    };
        $scope.customdates1 = {startDate: $scope.fromDate, endDate: $scope.toDate};

    $scope.calculateDateFromPicker = function(picker) {
    
      $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();
      $scope.toTimeStamp = new Date(picker.endDate._d).getTime();
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      if ($scope.fromDate === $scope.toDate ) {
        $scope.fromTimeStamp = $scope.toTimeStamp;
      }
    
    };
      $scope.init = function(){
        if($state.current.name === 'timslog'){
          $scope.timslog();
        }
         if($state.current.name === 'executedLog'){
          $scope.getTimsLogDetails();
        }
      }
          $scope.showExecteTimsDetail = function(){ 
      $scope.showModal = true;
    };

    $scope.timslog = function (track) {
       if (track !== undefined) {
        if (track === "PREV" && $scope.currentPageIndex > 1) {
          $scope.currentPageIndex--;
        }
        else if (track === "NEXT" && $scope.currentPageIndex < $scope.pageCount){
            $scope.currentPageIndex++;
        }
        else{
            return false;
        }
      }else {
          $scope.currentPageIndex = 1;
      }
      var filter = searchFilterService.getFilterStringForLog($scope.timsFilter);
      
      TimService.getLogList($scope.currentPageIndex, $scope.perPageCount, filter, $scope.fromDate, $scope.toDate, $scope.sortOption).then(function(response){
       
       $scope.loglist = response.data;
        
        if($scope.loglist){
          
                 for (var i = 0 ; i < $scope.loglist.content.length ; i++) { 
                               
                $scope.loglist.content[i].lastMod =dateService.getDateFromTimeStamp(Number($scope.loglist.content[i].lastMod),patientDashboard.dateFormat,'/');
              }
        }
      
       $scope.tims = response.data;
        $scope.totalElements = response.data.totalElements;
        $scope.pageCount = Math.ceil($scope.totalElements / $scope.perPageCount);
 
              }).catch(function(response){
                 notyService.showError(response);
              });
    };
    $scope.getDateFromTimestamp = function(timestamp){
          if(!timestamp){
            return searchFilters.emptyString;
          }
          timestamp = "1388379600000";
          
          var _date = new Date(timestamp);
         
          var _month = (_date.getMonth()+1).toString();
          _month = _month.length > 1 ? _month : '0' + _month;
          var _day = (_date.getDate()).toString();
          _day = _day.length > 1 ? _day : '0' + _day;
          var _year = (_date.getFullYear()).toString();
          return _month+"/"+_day+"/"+_year;
        };

        
    $scope.timLoading = function () {
        $scope.showModal = false;
         //$scope.showTimsModal = false;
        //$timeout($scope.showTimsModal, 1000);
       
        //alert("Hi");
        //setTimeout(function() {('showTimsModal').modal('hide');}, 4000);
        TimService.executeTimsJob().then(function(response){
           $scope.showFreezeModal = true;
          setTimeout(function(){  
             console.log("in settimeout");
             $scope.showFreezeModal = false; 
              $scope.timsScriptFileData = response;  
              console.log("$scope.showFreezeModal",$scope.showFreezeModal);
          console.log("response.data.timsMsg",response.data.timsMsg);
             // $scope.showFreezeModal = false;  
               notyService.showMessage(response.data.timsMsg);
         $state.go('timslog');    
            }, 5000); 
            
         //  $timeout(function(){}, 1000);    
      }).catch(function(response){
                console.log("response.data.timsMsg",response.data.timsMsg);
                notyService.showError(response.data.timsMsg);               
      });
               
              
    }
    
             $scope.timsOnFilters = function(){
             $scope.timslog();
             };

             $scope.redirectToLogDetails = function(fileurl){
             
              $state.go('executedLog', {
          'fileurl': fileurl
        });
             }

             $scope.getTimsLogDetails = function(){
              var fileurl = "";
              if($stateParams.fileurl){
                  fileurl = $stateParams.fileurl;
              }
              var data = {"logfilePath" : admin.timsFilePathConstant + fileurl};
             
              
              TimService.getTimsLogDetails(data).then(function(response){
                 $scope.timsLogDetails = response.data;
                 
                  $scope.timsLogDetailsText = $scope.timsLogDetails.logFileContent.replace("/\n/g","\\n");
                  
                  }).catch(function(response){
                    notyService.showError(response);
                  });
             }  

        $scope.sortType = function(sortParam){ 

          var toggledSortOptions = {};
          $scope.sortOption = "";
          if(sortParam === sortConstant.timsdate){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortTimsLogList.dateTims);
            $scope.sortTimsLogList = sortOptionsService.getSortOptionsForTimsLogList();
            $scope.sortTimsLogList.dateTims = toggledSortOptions;
            $scope.sortOption = sortConstant.timsdate + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.timslog();
          }
          else if(sortParam === sortConstant.loglink){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortTimsLogList.loglink);
            $scope.sortTimsLogList = sortOptionsService.getSortOptionsForTimsLogList();
            $scope.sortTimsLogList.loglink = toggledSortOptions;
            $scope.sortOption = sortConstant.loglink + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.timslog();
          }

        }
            $scope.sortType('date');
        
              

               $scope.init();  
            
  
   }]);
