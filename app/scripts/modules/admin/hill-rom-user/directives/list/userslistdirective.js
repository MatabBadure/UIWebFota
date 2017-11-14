'use strict';
/**
 * @ngdoc directive
 * @name userList
 *
 * @description
 * User List  Directive To List all the User and Select one for Disassociate or Edit
 */
angular.module('hillromvestApp')
  .directive('userList', function() {
    return {
      templateUrl: 'scripts/modules/admin/hill-rom-user/directives/list/list.html',
      restrict: 'E',
      scope: {
        onSelect: '&',
        onCreate: '&',
        userStatus: '=userStatus'
      },
      link: function(scope) {
        var user = scope.user;
        scope.$on('resetList', function () {
          scope.searchUsers();
        })
      },
      controller: ['$scope', '$timeout', '$state', 'UserService', 'searchFilterService', 'sortOptionsService', 'URL', 'StorageService', 'loginConstants',
      function($scope, $timeout, $state, UserService, searchFilterService,sortOptionsService, URL, StorageService, loginConstants) {
        var searchOnLoad = true;
        $scope.init = function() {
          $scope.getUserRoles();
          $scope.isUsersTab = true;          
          $scope.userRole = StorageService.get('logged').role;
          $scope.sortUserList = sortOptionsService.getSortOptionsForUserList();
          $scope.currentPageIndex = 1;
          $scope.perPageCount = 10;
          $scope.pageCount = 0;
          $scope.total = 0;
          $scope.sortOption ="";
          $scope.showModal = false;
          $scope.sortIconDefault = true;
          $scope.sortIconUp = false;
          $scope.sortIconDown = false;
          $scope.searchItem = "";
          $scope.searchFilter = searchFilterService.initSearchFiltersForHCP();
          $scope.searchUsers();
        };

        var timer = false;
        $scope.$watch('searchItem', function () {
          if(!searchOnLoad){
            if (timer) {
              $timeout.cancel(timer)
            }
            timer= $timeout(function () {
                $scope.searchUsers();
            },1000)
          }
        });

        /**
         * @ngdoc function
         * @name selectUser
         * @description
         * Function to select the User from the List suggested on search
         */
        $scope.selectUser = function(user) {
          var role = StorageService.get('logged').role;
          if(role === loginConstants.role.associates){
            $state.go('associateHillRomUserView', { userId: user.id });
          }else if(role === loginConstants.role.acctservices){
             $state.go('rcadmin-hillRomUserEdit', { userId: user.id });
          }else if(role === loginConstants.role.customerservices){
            $state.go('customerserviceHillRomUserView', { userId: user.id });
          }else{
            $state.go('hillRomUserEdit', { userId: user.id });
          }
        };

        $scope.createUser = function() {
           var role = StorageService.get('logged').role;
          if(role === loginConstants.role.acctservices){
          $state.go('rcadmin-hillRomUserNew');
          }
          else
          $state.go('hillRomUserNew');
        };

        /**
         * @ngdoc function
         * @name sortList
         * @description
         * Function to Search User on entering text on the textfield.
         */
        $scope.searchUsers = function(track) {          
          if (track !== undefined) {
            if (track === "PREV" && $scope.currentPageIndex > 1) {
              $scope.currentPageIndex--;
            } else if (track === "NEXT" && $scope.currentPageIndex < $scope.pageCount) {
              $scope.currentPageIndex++;
            } else {
              return false;
            }
          } else {
            $scope.currentPageIndex = 1;
          }
          if($scope.roleData.roleSelected.value !== "All"){
            $scope.sortUserList.role = sortOptionsService.setSortOptionToDefault();            
          }
          var filter = searchFilterService.getFilterStringForHillromUser($scope.searchFilter, $scope.roleData.roleSelected.value);
          var url = URL.searchUsers;
          UserService.getUsers(url, $scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount, filter).then(function(response) {
            $scope.users = response.data;
            $scope.total = response.headers()['x-total-count'];
            $scope.pageCount = Math.ceil($scope.total / 10);
            searchOnLoad = false;
          }).catch(function(response) {});
        };

        $scope.sortType = function(sortParam){
          var toggledSortOptions = {};
          $scope.sortOption = "";
          if(sortParam === sortConstant.lastName){                        
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortUserList.lastName);
            $scope.sortUserList = sortOptionsService.getSortOptionsForUserList();
            $scope.sortUserList.lastName = toggledSortOptions;
            $scope.sortOption = sortConstant.lastName + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchUsers();
          }else if(sortParam === sortConstant.role && $scope.roleData.roleSelected.value === "All"){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortUserList.role);
            $scope.sortUserList = sortOptionsService.getSortOptionsForUserList();
            $scope.sortUserList.role = toggledSortOptions;
            $scope.sortOption = sortConstant.name + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchUsers();          
          }else if(sortParam === sortConstant.hillromId){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortUserList.hillromId);
            $scope.sortUserList = sortOptionsService.getSortOptionsForUserList();
            $scope.sortUserList.hillromId = toggledSortOptions;
            $scope.sortOption = sortConstant.hillromId + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchUsers();
          }else if(sortParam === sortConstant.email){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortUserList.email);
            $scope.sortUserList = sortOptionsService.getSortOptionsForUserList();
            $scope.sortUserList.email = toggledSortOptions;
            $scope.sortOption = sortConstant.email + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchUsers();
          }else if(sortParam === sortConstant.mobileNumber){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortUserList.mobileNumber);
            $scope.sortUserList = sortOptionsService.getSortOptionsForUserList();
            $scope.sortUserList.mobileNumber = toggledSortOptions;
            $scope.sortOption = sortConstant.mobilePhone + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchUsers();
          }else if(sortParam === sortConstant.status){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortUserList.status);
            $scope.sortUserList = sortOptionsService.getSortOptionsForUserList();
            $scope.sortUserList.status = toggledSortOptions;
            $scope.sortOption = sortConstant.isDeleted + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchUsers();
          }          
              
        };
        $scope.searchOnFilters = function(){    
          $scope.searchUsers();
        };

        $scope.getUserRoles = function(){
          $scope.roleData = {};
          $scope.userRoleList = [];          
          var x = {};
          x.text = "All"; x.value = "All";
          $scope.userRoleList.push(x);
          var roles = ['ADMIN', 'ACCT_SERVICES', 'ASSOCIATES', 'CUSTOMER_SERVICES', 'PATIENT', 'HCP', 'CARE_GIVER', 'CLINIC_ADMIN', 'FOTA_ADMIN','FOTA_APPROVER'];
          angular.forEach(roles, function(role){
              x = {};
              x.value = role;              
              switch(role){
                case 'ADMIN': 
                  x.text = "Super Admin"; 
                  break;
                case 'PATIENT': 
                  x.text = "Patient User";
                  break;
                case 'HCP':
                  x.text = "HCP"; 
                  break;
                case 'CLINIC_ADMIN': 
                  x.text = "Clinic Admin";
                  break;
                case 'CARE_GIVER': 
                  x.text = "Caregiver";
                  break;
                case 'ACCT_SERVICES':
                  x.text = "RC Admin";
                  break;
                case 'ASSOCIATES':
                  x.text = "Associates";                
                  break;
                case 'CUSTOMER_SERVICES':
                  x.text = "Customer Service";                
                  break;
                  case 'FOTA_ADMIN':
                  x.text = "FOTA Admin";                
                  break;
                  case 'FOTA_APPROVER':
                  x.text = "FOTA Approver";                
                  break;
              } 
              $scope.userRoleList.push(x);                         
          });          
          $scope.roleData.roleSelected = $scope.userRoleList[0];
          $scope.roleData.userRoles = $scope.userRoleList;
        };
        $scope.init();
      }]
    };
  });
