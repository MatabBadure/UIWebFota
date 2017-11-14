'use strict';

angular.module('hillromvestApp')
  .directive('doctorList', ['UserService', '$state', '$stateParams', 'searchFilterService', 'sortOptionsService',
    function(UserService, $state, $stateParams, searchFilterService, sortOptionsService) {
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
        if(($state.current.name === "hcpUser" || $state.current.name === "hcpUserRcadmin") && !$stateParams.clinicIds){
        scope.$on('resetList', function() {
          scope.searchDoctors();
        })
      }
      },
      controller: ['$scope', '$timeout', '$state','$stateParams', 'DoctorService', 'notyService', 'StorageService', 'loginConstants', 'URL',
      function($scope, $timeout, $state,$stateParams, DoctorService, notyService, StorageService, loginConstants, URL) {
        var searchOnLoad = true;
        $scope.sortHcpList = sortOptionsService.getSortOptionsForHcpList();
        $scope.role = StorageService.get('logged').role;
        $scope.init = function() {
          $scope.searchFilter = searchFilterService.initSearchFiltersForHCP();
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

        $scope.searchDoctorsOnQueryChange = function(){
          if(($state.current.name === "hcpUser" || $state.current.name === "hcpUserRcadmin" || $state.current.name === "associateHcpUser" || $state.current.name === "customerserviceHcpUser") && !$stateParams.clinicIds && !searchOnLoad){
            $scope.searchDoctors();
          }
        };

        $scope.selectDoctor = function(doctor) {
          if($scope.role === loginConstants.role.acctservices){
            $state.go('hcpProfileRcadmin',{
              'doctorId': doctor.id
            });
          }else if($scope.role === loginConstants.role.associates){
            $state.go('hcpProfileAssociates',{
              'doctorId': doctor.id
            });
          }else if($scope.role === loginConstants.role.customerservices){
            $state.go('hcpProfileCustomerService',{
              'doctorId': doctor.id
            });
          }
          else {
            $state.go('hcpProfile',{
              'doctorId': doctor.id
            });
          }
        };

        $scope.createDoctor = function() {
          if($scope.role === loginConstants.role.acctservices){
            $state.go('hcpNewRcadmin');
          }else{
            $state.go('hcpNew');
          }
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
          var url = URL.searchHcpUser;
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

        $scope.sortType = function(sortParam){ 
          var toggledSortOptions = {};
          $scope.sortOption = "";
          if(sortParam === sortConstant.lastName){                        
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortHcpList.lastName);
            $scope.sortHcpList = sortOptionsService.getSortOptionsForHcpList();
            $scope.sortHcpList.lastName = toggledSortOptions;
            $scope.sortOption = sortConstant.lastName + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchDoctors();
          }else if(sortParam === sortConstant.credentials){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortHcpList.credentials);
            $scope.sortHcpList = sortOptionsService.getSortOptionsForHcpList();
            $scope.sortHcpList.credentials = toggledSortOptions;
            $scope.sortOption = sortConstant.credentials + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchDoctors();
          }else if(sortParam === sortConstant.npiNumber){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortHcpList.npiNumber);
            $scope.sortHcpList = sortOptionsService.getSortOptionsForHcpList();
            $scope.sortHcpList.npiNumber = toggledSortOptions;
            $scope.sortOption = sortConstant.npiNumber + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchDoctors();
          }else if(sortParam === sortConstant.clinicName){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortHcpList.clinicName);
            $scope.sortHcpList = sortOptionsService.getSortOptionsForHcpList();
            $scope.sortHcpList.clinicName = toggledSortOptions;
            $scope.sortOption = sortConstant.clinicName + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchDoctors();
          }else if(sortParam === sortConstant.city){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortHcpList.city);
            $scope.sortHcpList = sortOptionsService.getSortOptionsForHcpList();
            $scope.sortHcpList.city = toggledSortOptions;
            $scope.sortOption = sortConstant.hcity + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchDoctors();
          }else if(sortParam === sortConstant.status){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortHcpList.status);
            $scope.sortHcpList = sortOptionsService.getSortOptionsForHcpList();
            $scope.sortHcpList.status = toggledSortOptions;
            $scope.sortOption = sortConstant.isDeleted + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchDoctors();
          }else if(sortParam === sortConstant.state){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortHcpList.state);
            $scope.sortHcpList = sortOptionsService.getSortOptionsForHcpList();
            $scope.sortHcpList.state = toggledSortOptions;
            $scope.sortOption = sortConstant.hstate + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchDoctors();
          }        
          
        };

        $scope.searchOnFilters = function(){           
          $scope.searchDoctors();
        };

        $scope.init();
      }]
    };
  }]);
