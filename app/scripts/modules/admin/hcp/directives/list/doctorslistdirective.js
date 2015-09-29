'use strict';

angular.module('hillromvestApp')
  .directive('doctorList', ['UserService', '$state', '$stateParams', 'searchFilterService', 
    function(UserService, $state, $stateParams, searchFilterService) {
    return {
      templateUrl: 'scripts/modules/admin/hcp/directives/list/list.html',
      restrict: 'E',
      scope: {
        onSelect: '&',
        onCreate: '&',
        doctorStatus: '=doctorStatus'
      },
      link: function(scope, element, attrs) {
        var doctor = scope.doctor;
        if($state.current.name === "hcpUser" && !$stateParams.clinicIds){
        scope.$on('resetList', function() {
          scope.searchDoctors();
        })
      }
      },

      controller: function($scope, $timeout, $state,$stateParams, DoctorService, notyService) {
        var searchOnLoad = true;
        $scope.init = function() {
          $scope.searchFilter = searchFilterService.initSearchFiltersForHCP();
          $scope.doctors = [];
          $scope.doctorInfo = {};
          $scope.currentPageIndex = 1;
          $scope.perPageCount = 10;
          $scope.pageCount = 0;
          $scope.total = 0;
          $scope.noMatchFound = false;
          $scope.sortOption = "";
          $scope.showModal = false;
          $scope.sortIconDefault = true;
          $scope.sortIconUp = false;
          $scope.sortIconDown = false;
          $scope.searchDoctors();
          if($stateParams.clinicIds){                      
            $scope.getAssociatedHCPsToClinic($stateParams.clinicIds);
          }
        };


        var timer = false;
        $scope.$watch('searchItem', function() {
          if($state.current.name === "hcpUser" && !$stateParams.clinicIds && !searchOnLoad){
          if (timer) {
            $timeout.cancel(timer)
          }
          timer = $timeout(function() {
            $scope.searchDoctors();
          }, 1000)
         }
        });

        $scope.selectDoctor = function(doctor) {
          $state.go('hcpProfile',{
            'doctorId': doctor.id
          });
        };

        $scope.createDoctor = function() {
          $state.go('hcpNew');
        };

        $scope.searchDoctors = function(track) {
          if (track !== undefined) {
            if (track === "PREV" && $scope.currentPageIndex > 1) {
              $scope.currentPageIndex--;
            } else if (track === "NEXT" && $scope.currentPageIndex < $scope.pageCount) {
              $scope.currentPageIndex++;
            } else {
              return false;
            }
          }else {
            $scope.currentPageIndex = 1;
          }

          var filter = searchFilterService.getFilterStringForHCP($scope.searchFilter);
          var url = 'api/user/hcp/search?searchString=';
          UserService.getUsers(url, $scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount, filter).then(function(response) {
            $scope.doctors = response.data;
            $scope.total = response.headers()['x-total-count'];
            $scope.pageCount = Math.ceil($scope.total / 10);
            if ($scope.total == 0) {
              $scope.noMatchFound = true;
            } else {
              $scope.noMatchFound = false;
            }
            searchOnLoad = false;
          }).catch(function(response) {

          });
        };
        $scope.getAssociatedHCPsToClinic = function(clinicIds){
           var clinicIdsArr = "";
            if(clinicIds.indexOf(",") > -1){
              clinicIdsArr = clinicIds.split(","); 
            }else{
              clinicIdsArr = [];
              clinicIdsArr.push(clinicIds);
            }                     
          DoctorService.getDoctorsInClinic(clinicIdsArr).then(function (response) {
            $scope.doctors = response.data.hcpUsers;   
            if($scope.doctors && $scope.doctors.length <= 0){
              notyService.showMessage(response.data.message, 'warning');
            }        
          }).catch(function (response) {});
        };

        $scope.sortType = function(){
          console.log('hello');
          if($scope.sortIconDefault){
            $scope.sortIconDefault = false;
            $scope.sortIconUp = false;
            $scope.sortIconDown = true;
          }
          else if($scope.sortIconDown){
            $scope.sortIconDefault = false;
            $scope.sortIconDown = false;
            $scope.sortIconUp = true;
          }
          else if($scope.sortIconUp){
            $scope.sortIconDefault = false;
            $scope.sortIconUp = false;
            $scope.sortIconDown = true;
          }
        };

        $scope.searchOnFilters = function(){           
          $scope.searchDoctors();
        };

        $scope.init();
      }
    };
  }]);
