'use strict';

angular.module('hillromvestApp')
  .directive('patientList', function($state, $stateParams) {
    return {
      templateUrl: 'scripts/modules/admin/patient/directives/list/patientlist.html',
      restrict: 'E',
      scope: {
        onSelect: '&',
        onCreate: '&',
        patientStatus: '=patientStatus'
      },
      link: function(scope, element, attrs) {
        var patient = scope.patient;
        if($state.current.name === "patientUser" && !$stateParams.clinicIds){
        scope.$on('resetList', function () {
          scope.searchPatients();
        })
      }
      },
      controller: ['$scope', '$timeout', 'patientService', '$state', '$stateParams', 'notyService','searchFilterService', 'sortOptionsService',
      function($scope, $timeout, patientService, $state, $stateParams, notyService, searchFilterService, sortOptionsService) {
        var searchOnLoad = true;
        $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
        $scope.init = function() {
          $scope.searchFilter = searchFilterService.initSearchFiltersForPatient();
          $scope.patients = [];
          $scope.patientInfo = {};
          $scope.currentPageIndex = 1;
          $scope.perPageCount = 10;
          $scope.pageCount = 0;
          $scope.total = 0;
          $scope.noMatchFound = false;
          $scope.sortOption ="";
          $scope.showModal = false;
          $scope.sortIconDefault = true;
          $scope.sortIconUp = false;
          $scope.sortIconDown = false;
          $scope.searchItem = "";
          $scope.searchPatients();
          if($stateParams.clinicIds){
            $scope.getAssociatedPatientsToClinic($stateParams.clinicIds);
          }
        };


        var timer = false;
        $scope.$watch('searchItem', function() {
          if($state.current.name === "patientUser" && !$stateParams.clinicIds && !searchOnLoad){
            if (timer) {
              $timeout.cancel(timer)
            }
            timer = $timeout(function() {
                $scope.searchPatients();
            }, 1000);
          }
        });

        $scope.selectPatient = function(patient) {
          $state.go('patientOverview', {
            'patientId': patient.id
          });
        };

        $scope.createPatient = function() {
          $state.go('patientNew');
        };

        $scope.searchPatients = function(track) {
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
          var filter = searchFilterService.getFilterStringForPatient($scope.searchFilter);
          patientService.getPatients($scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount,filter)
            .then(function(response) {
              $scope.patients = response.data;
              var patientCount = $scope.patients.length;
              for (var i = 0 ; i < patientCount ; i++) {
                var _date = new Date($scope.patients[i].dob);
                var _month = (_date.getMonth()+1).toString();
                _month = _month.length > 1 ? _month : '0' + _month;
                var _day = (_date.getDate()).toString();
                _day = _day.length > 1 ? _day : '0' + _day;
                var _year = (_date.getFullYear()).toString();
                _year = _year.slice(-2);
                var dob = _month+"/"+_day+"/"+_year;
                $scope.patients[i].dob = dob;
              }
              $scope.total = response.headers()['x-total-count'];
              $scope.pageCount = Math.ceil($scope.total / 10);
              searchOnLoad = false;
            }).catch(function(response) {
              $scope.noMatchFound = true;
            });
        };

        $scope.getAssociatedPatientsToClinic = function(clinicIds){
          var clinicIdsArr = "";
            if(clinicIds.indexOf(",") > -1){
              clinicIdsArr = clinicIds.split(",");
            }else{
              clinicIdsArr = [];
              clinicIdsArr.push(clinicIds);
            }
          patientService.getPatientsInClinic(clinicIdsArr).then(function (response) {
            $scope.patients = response.data.patientUsers;
            if($scope.patients == 'undefined' || !$scope.patients || ($scope.patients && $scope.patients.length <= 0)){
              notyService.showMessage(response.data.message, 'warning');
            }
          }).catch(function (response) {});
        };

        $scope.sortType = function(sortParam){ 
          var toggledSortOptions = {};
          $scope.sortOption = "";
          if(sortParam === sortConstant.lastName){                        
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.lastName);
            $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
            $scope.sortPatientList.lastName = toggledSortOptions;
            $scope.sortOption = sortConstant.plastName + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchPatients();
          }else if(sortParam === sortConstant.mrnId){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.mrnId);
            $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
            $scope.sortPatientList.mrnId = toggledSortOptions;
            $scope.sortOption = sortConstant.mrnid + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchPatients();
          }else if(sortParam === sortConstant.dob){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.dob);
            $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
            $scope.sortPatientList.dob = toggledSortOptions;
            $scope.sortOption = sortConstant.pdob + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchPatients();
          }else if(sortParam === sortConstant.city){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.city);
            $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
            $scope.sortPatientList.city = toggledSortOptions;
            $scope.sortOption = sortConstant.pcity + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchPatients();
          }else if(sortParam === sortConstant.transmission){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.transmission);
            $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
            $scope.sortPatientList.transmission = toggledSortOptions;
            $scope.sortOption = sortConstant.last_date + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchPatients();
          }else if(sortParam === sortConstant.status){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.status);
            $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
            $scope.sortPatientList.status = toggledSortOptions;
            $scope.sortOption = sortConstant.isDeleted + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchPatients();
          }else if(sortParam === sortConstant.adherence){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.adherence);
            $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
            $scope.sortPatientList.adherence = toggledSortOptions;
            $scope.sortOption = sortConstant.adherence + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchPatients();
          }        
          
        };
        $scope.searchOnFilters = function(){           
          $scope.searchPatients();
        };        

        $scope.init();
      }]
    };
  });
