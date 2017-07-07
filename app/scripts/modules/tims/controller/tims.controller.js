'use strict';


angular.module('hillromvestApp')
.controller('timsController',['$scope', '$location','$state', 'clinicadminService', 'notyService', '$stateParams', 'clinicService', 'UserService', 'StorageService','$timeout', 'commonsUserService', 'TimService',
  function($scope, $location,$state, clinicadminService, notyService, $stateParams, clinicService, UserService, StorageService, $timeout, commonsUserService,TimService) {
		$scope.IsVisible = false;
		$scope.visible = true;
  	

  	$scope.showUpdateClinicModal = function(){
  		
      $scope.showModal = true;
    };
    // $scope.timLoading = function(){
  		// $scope.IsVisible = false;
      
    // };
     $scope.timLoading = function () {

    //    $scope.getClinicById = function(clinicId){
    //     alert("Hi");
    //   clinicService.getClinic(clinicId).then(function(response){
    //     $scope.clinic = response.data.clinic;
    //   }).catch(function(response){
    //     notyService.showError(response);
    //     if(response.status === 400){
    //       $scope.redirectToManageClinic();
    //     }
    //   });
    // };
TimService.executeTimsJob().then(function(response){
       $scope.timsScriptFileData = response;
       console.log("$scope.timsScriptFileData",$scope.timsScriptFileData);
      }).catch(function(response){});

                //If DIV is visible it will be hidden and vice versa.
                //alert("Hi")
              $scope.IsVisible = $scope.IsVisible ? false :true;
              $scope.visible = $scope.IsVisible ? false :true;


          }


    $scope.opts = {
                    maxDate: new Date(),
                    format: patientDashboard.dateFormat,
                    dateLimit: {"months": patientDashboard.maxDurationInMonths},
                    eventHandlers: {
                        'apply.daterangepicker': function (ev, picker) {
                            $scope.calculateDateFromPicker(picker);
                            $scope.drawGraph();
                            $scope.selectedDateOption = '';
                        }
                    },
                    opens: 'left'
                };
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

 
    
  
   }]);