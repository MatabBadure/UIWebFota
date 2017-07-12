'use strict';


angular.module('hillromvestApp')
.controller('timsController',['$scope', '$location','$state', 'clinicadminService', 'notyService', '$stateParams', 'clinicService', 'UserService', 'StorageService','$timeout', 'commonsUserService', 'TimService','searchFilterService','dateService',
  function($scope, $location,$state, clinicadminService, notyService, $stateParams, clinicService, UserService, StorageService, $timeout, commonsUserService,TimService,searchFilterService,dateService) {
		$scope.IsVisible = false;
		$scope.visible = true;
    $scope.currentPageIndex = 1;
    $scope.pageCount = 1;
    $scope.perPageCount = 5;
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
     $scope.badgestatistics = {};
      $scope.badgestatistics.date = "";
  	$scope.timsFilter = searchFilterService.initSearchFiltersForTims();
    $scope.timsLogDetails = "";
    

    // console.log("$scope.timsFilter",$scope.timsFilter);
    // console.log("$scope.fromDate",$scope.fromDate);
    // console.log("$scope.toDate",$scope.toDate);
    
     $scope.dateOpts1 = {
      maxDate: new Date(),
      format: patientDashboard.dateFormat,
      eventHandlers: {'apply.daterangepicker': function(ev, picker) {
          $scope.calculateDateFromPicker(picker);
          console.log("dateopts apply");
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
    console.log("$scope.fromDate in calculateblah blah ",$scope.fromDate);
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
      //console.log("filter in controller:",filter);
      TimService.getLogList($scope.currentPageIndex, $scope.perPageCount, filter, $scope.fromDate, $scope.toDate).then(function(response){
       
       $scope.loglist = response.data;
        
        if($scope.loglist){
          console.log("inside if $scope.loglist..=",$scope.loglist);
                 for (var i = 0 ; i < $scope.loglist.content.length ; i++) { 
                  console.log("inside for",$scope.loglist.content[i].lastMod);               
                $scope.loglist.content[i].lastMod =dateService.getDateFromTimeStamp(Number($scope.loglist.content[i].lastMod),patientDashboard.dateFormat,'/');
              }
        }
        console.log("$scope.loglist..=",$scope.loglist);
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
          console.log("timstamp",timestamp)
          var _date = new Date(timestamp);
          console.log("date...=",_date);
          var _month = (_date.getMonth()+1).toString();
          _month = _month.length > 1 ? _month : '0' + _month;
          var _day = (_date.getDate()).toString();
          _day = _day.length > 1 ? _day : '0' + _day;
          var _year = (_date.getFullYear()).toString();
          return _month+"/"+_day+"/"+_year;
        };


    $scope.timLoading = function () {
        TimService.executeTimsJob().then(function(response){
       $scope.timsScriptFileData = response;
       console.log("$scope.timsScriptFileData",$scope.timsScriptFileData);
      }).catch(function(response){
        notyService.showError(response);
      });
                //If DIV is visible it will be hidden and vice versa.
                //alert("Hi")
              $scope.IsVisible = $scope.IsVisible ? false :true;
              $scope.visible = $scope.IsVisible ? false :true;
          }
    
             $scope.timsOnFilters = function(){
             $scope.timslog();
             };

             $scope.redirectToLogDetails = function(fileurl){
              console.log("in redirectToLogDetails",fileurl);
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
             // data.logfilePath = admin.timsFilePathConstant + fileurl;
              console.log("stateParams.fileurl:",data);
              TimService.getTimsLogDetails(data).then(function(response){
                 $scope.timsLogDetails = response.data;
                 //$scope.timsLogDetails = $scope.timsLogDetails.logFileContent.replace(/(\r\n|\n|\r)/gm,"");
                 //alert("$scope.timsLogDetails", $scope.timsLogDetails.logFileContent);
                  $scope.timsLogDetailsText = $scope.timsLogDetails.logFileContent.replace("\n","\\n");
                  //console.log("$scope.timsLogDetailsText",$scope.timsLogDetailsText);
                  }).catch(function(response){
                    //notyService.showError(response);
                  });
             }  
              

               $scope.init();  
            
  
   }]);