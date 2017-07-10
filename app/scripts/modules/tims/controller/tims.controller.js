'use strict';


angular.module('hillromvestApp')
.controller('timsController',['$scope', '$location','$state', 'clinicadminService', 'notyService', '$stateParams', 'clinicService', 'UserService', 'StorageService','$timeout', 'commonsUserService', 'TimService','searchFilterService',
  function($scope, $location,$state, clinicadminService, notyService, $stateParams, clinicService, UserService, StorageService, $timeout, commonsUserService,TimService,searchFilterService) {
		$scope.IsVisible = false;
		$scope.visible = true;
    $scope.currentPageIndex = 1;
    $scope.pageCount = 0;
    $scope.perPageCount = 5;
    $scope.PageNumber=1;
  	$scope.timsFilter = searchFilterService.initSearchFiltersForTims();
    $scope.timsLogDetails = "";
    console.log("$scope.timsFilter",$scope.timsFilter)
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
    // $scope.timLoading = function(){
  		// $scope.IsVisible = false;
      
    // };

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
      console.log("filter in controller:",filter);
      TimService.getLogList($scope.currentPageIndex, $scope.perPageCount, filter).then(function(response){
       
       $scope.loglist = response.data;
        
       $scope.tims = response.data;
      //  $scope.total = response.headers()['x-total-count'];
        $scope.pageCount = Math.ceil(60 / $scope.perPageCount);
 
              }).catch(function(response){
                 notyService.showError(response);
              });
//call service
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
         $scope.dateOpts = {
      maxDate: new Date(),
      format: patientDashboard.dateFormat,
      dateLimit: {"months":24},
      eventHandlers: {'apply.daterangepicker': function(ev, picker) {
          $scope.duration = "custom";
          $scope.calculateDateFromPicker(picker, 'AdherenceScoreHistory');
          var dayDiff = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
          if( dayDiff === 0){
            $scope.duration = "day";
          }
          $scope.getAdherenceScore($scope.duration);
        }
      },
      opens: 'left'
    }

                $scope.calculateDateFromPicker = function (picker) {
                  $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();
                    $scope.toTimeStamp = new Date(picker.endDate._d).getTime();

                    $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp, hcpDashboardConstants.USdateFormat, '/');
                    
                    $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp, hcpDashboardConstants.USdateFormat, '/');
                    if ($scope.fromDate === $scope.toDate) {
                        $scope.fromTimeStamp = $scope.toTimeStamp;
                    }
                };
                $scope.dates = {startDate: null, endDate: null};

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
                  }).catch(function(response){
                    notyService.showError(response);
                  });
             }  
              

               $scope.init();  
            
  
   }]);