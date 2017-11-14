'use strict';

angular.module('hillromvestApp')
  .directive('patientList', ['$state', '$stateParams', function($state, $stateParams) {
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
      controller: ['$scope', '$timeout', 'patientService', '$state', '$stateParams', 'notyService','searchFilterService', 'sortOptionsService', 'StorageService', 'loginConstants', '$rootScope', 'addressService',
      function($scope, $timeout, patientService, $state, $stateParams, notyService, searchFilterService, sortOptionsService, StorageService,loginConstants,$rootScope,addressService) {
        var searchOnLoad = true;
        $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
                $scope.expandedSign = false;
          $scope.genders = [{
                name: "All",
                value:"all"
            }, {
                name: "Male",
                value:"male"
            }, {
                name: "Female",
                value:"female"
            }, {
                name: "Other",
                value:"other"
            }];
          $scope.yesNo = [{
                name: "All",
                value:"all"
            }, {
                name: "Yes",
                value:"yes"
            }, {
                name: "No",
                value:"no"
            }];
            $scope.activeInactive = [{
                name: "All",
                value:"all"
            }, {
                name: "Active",
                value:"active"
            }, {
                name: "Inactive",
                value:"inactive"
            }];
            $scope.deviceType = [{
                name: "All",
                value:"ALL"
            }, {
                name: "VisiVest",
                value:"VEST"
            }, {
                name: "Monarch",
                value:"MONARCH"
            }];
            $scope.deviceStatus = [{
                name: "All",
                value:"all"
            }, {
                name: "Active",
                value:"active"
            }, {
                name: "Inactive",
                value:"inactive"
            }];
             $scope.localLang = {
        selectAll       : "Tick all",
        selectNone      : "Tick none",
        search          : "Type here to search...",
        nothingSelected : "Nothing is selected",
        allSelected : "All Selected",
        Cancel : "Cancel",
          OK:"OK"
      }
                  $scope.ageGroups = [
        { 'name': '0-5', 'ticked': true },
        { 'name': '6-10', 'ticked': true},
        { 'name': '11-15',  'ticked': true},
        { 'name': '16-20',  'ticked': true},
        { 'name': '21-25', 'ticked': true},
        { 'name': '26-30', 'ticked': true},
        { 'name': '31-35', 'ticked': true},
        { 'name': '36-40', 'ticked': true},
        { 'name': '41-45', 'ticked': true},
        { 'name': '46-50', 'ticked': true},
        { 'name': '51-55', 'ticked': true},
        { 'name': '56-60', 'ticked': true},
        { 'name': '61-65', 'ticked': true},
        { 'name': '66-70', 'ticked': true},
        { 'name': '71-75', 'ticked': true},
        { 'name': '76-80', 'ticked': true},
        { 'name': '81-above', 'ticked': true}
      ];

      $scope.adherenceScoreRangeGroups= [
        { 'name': '0-5', 'ticked': true },
        { 'name': '6-10', 'ticked': true},
        { 'name': '11-15',  'ticked': true},
        { 'name': '16-20',  'ticked': true},
        { 'name': '21-25', 'ticked': true},
        { 'name': '26-30', 'ticked': true},
        { 'name': '31-35', 'ticked': true},
        { 'name': '36-40', 'ticked': true},
        { 'name': '41-45', 'ticked': true},
        { 'name': '46-50', 'ticked': true},
        { 'name': '51-55', 'ticked': true},
        { 'name': '56-60', 'ticked': true},
        { 'name': '61-65', 'ticked': true},
        { 'name': '66-70', 'ticked': true},
        { 'name': '71-75', 'ticked': true},
        { 'name': '76-80', 'ticked': true},
        { 'name': '81-above', 'ticked': true}
      ];
        $scope.init = function() {
          $scope.userRole = StorageService.get('logged').role;
          $scope.searchFilter = searchFilterService.initSearchFiltersForPatient();
          $scope.searchFilter.isHideStatusFilter = true;
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
          $scope.initAdvancedFilters();
          $scope.searchPatients();
          if($stateParams.clinicIds){
            $scope.getAssociatedPatientsToClinic($stateParams.clinicIds);
          }
        };

        $scope.searchPatientsOnQueryChange = function(){
          if(($state.current.name === "patientUser" || $state.current.name === "rcadminPatients" || $state.current.name === "associatePatientUser" || $state.current.name === "customerservicePatientUser") && !$stateParams.clinicIds && !searchOnLoad){
            $scope.searchPatients();
          }
        };

        $scope.selectPatient = function(patient) {
            localStorage.setItem('deviceType_'+patient.id, patient.deviceType);
            localStorage.setItem('deviceTypeforBothIcon_'+patient.id, patient.deviceType);
 
          if($scope.userRole === loginConstants.role.admin){
            $state.go('patientOverview', {
              'patientId': patient.id
            });
          }else if($scope.userRole === loginConstants.role.acctservices){
            $state.go('patientOverviewRcadmin', {
              'patientId': patient.id
            });
          }else if($scope.userRole === loginConstants.role.associates){
            $state.go('associatepatientOverview', {
              'patientId': patient.id
            });
          }else if($scope.userRole === loginConstants.role.customerservices){
            $state.go('customerservicepatientOverview', {
              'patientId': patient.id
            });
          }
        };

        $scope.createPatient = function() {
          if($scope.userRole === loginConstants.role.admin){
            $state.go('patientNew');
          }else if($scope.userRole === loginConstants.role.acctservices){
            $state.go('rcadminPatientNew');
          }
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
                $scope.patients[i].dob = $scope.getDateFromTimestamp($scope.patients[i].dob);
                $scope.patients[i].lastTransmissionDate = $scope.getDateFromTimestampforTransmissiondate($scope.patients[i].lastTransmissionDate);
              }
              $scope.total = response.headers()['x-total-count'];
              $scope.pageCount = Math.ceil($scope.total / 10);
              searchOnLoad = false;
            }).catch(function(response) {
              $scope.noMatchFound = true;
            });
        };
         $scope.getDateFromTimestampforTransmissiondate = function(timestamp){
          if(!timestamp){
            return searchFilters.emptyString;
          }

          var offset = -5.0;
          var clientDate = new Date(timestamp);
          var  utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
          var _date = new Date(utc + (3600000*offset));

         /* var timeZoneOffset = new Date(timestamp).getTimezoneOffset()*60*1000;
          var qualcommOffset = 6*60*60*1000;
          var timestamp = timestamp + timeZoneOffset - qualcommOffset;*/
         /* var _date = new Date(timestamp);*/
          var _month = (_date.getMonth()+1).toString();
          _month = _month.length > 1 ? _month : '0' + _month;
          var _day = (_date.getDate()).toString();
          _day = _day.length > 1 ? _day : '0' + _day;
          var _year = (_date.getFullYear()).toString();
          return _month+"/"+_day+"/"+_year;
        };


        $scope.getDateFromTimestamp = function(timestamp){
          if(!timestamp){
            return searchFilters.emptyString;
          }
          var _date = new Date(timestamp);
          var _month = (_date.getMonth()+1).toString();
          _month = _month.length > 1 ? _month : '0' + _month;
          var _day = (_date.getDate()).toString();
          _day = _day.length > 1 ? _day : '0' + _day;
          var _year = (_date.getFullYear()).toString();
          return _month+"/"+_day+"/"+_year;
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
          }else if(sortParam === sortConstant.hillromId){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.hillromId);
            $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
            $scope.sortPatientList.hillromId = toggledSortOptions;
            $scope.sortOption = sortConstant.pHillromId + sortOptionsService.getSortByASCString(toggledSortOptions);
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
          }else if(sortParam === sortConstant.clinicName){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortPatientList.clinicName);
            $scope.sortPatientList = sortOptionsService.getSortOptionsForPatientList();
            $scope.sortPatientList.clinicName = toggledSortOptions;
            $scope.sortOption = sortConstant.clinicName + sortOptionsService.getSortByASCString(toggledSortOptions);
            $scope.searchPatients();
          }        
          
        };
        $scope.searchOnFilters = function(){           
          $scope.searchPatients();
        }; 

        //Implementation of GIMP- 20       
        $scope.toggleHeaderAccount = function(){
      $( "#collapseTwo" ).slideToggle( "slow" );
      //$scope.expandedSign = ($scope.expandedSign === "+") ? "-" : "+"; 
      $scope.expandedSign = ($scope.expandedSign === true) ? false : true;  
      if($scope.expandedSign === true){
        $scope.searchItem = ""; 
        /*$scope.isAdvancedFilters = true;*/
       $("#searchListParam").attr("disabled", true);
       $("#searchListParam").css("background-color", 'rgb(235, 235, 228)'); 
     // $scope.initPaginationVars();
      }
      else{
         
       $("#searchListParam").attr("disabled", false);
       $("#searchListParam").css("background-color", 'inherit'); 
      }     
    }
    $scope.initAdvancedFilters = function(){
      $scope.dateFlag = false;
      $scope.patientAdvancedFilters = {};
      $scope.patientAdvancedFilters.name = "";
      $scope.patientAdvancedFilters.hillromId = "";
      $scope.patientAdvancedFilters.email = "";
      $scope.patientAdvancedFilters.gender = "";
      $scope.patientAdvancedFilters.age = "";
      $scope.selectedCountry = ["US"];
      $scope.selectedCountryObj = ["US"];
      $scope.selectedStates = [];
      $scope.selectedCities = [];
      $scope.patientAdvancedFilters.country = "US";
      $scope.patientAdvancedFilters.state = [];
      $scope.patientAdvancedFilters.city = [];
      $scope.patientAdvancedFilters.zipcode = "";
      $scope.patientAdvancedFilters.clinicLevelStatus = "";
      $scope.patientAdvancedFilters.diagnosis = "";
      $scope.patientAdvancedFilters.adherenceScoreRange = "";
      $scope.patientAdvancedFilters.deviceType = "";
      $scope.patientAdvancedFilters.deviceStatus = "";
      $scope.patientAdvancedFilters.deviceActiveDateFrom = "";
      $scope.patientAdvancedFilters.deviceActiveDateTo = "";
      $scope.patientAdvancedFilters.serialNo = "";
      $scope.patientAdvancedFilters.minHMRRange = "";
      $scope.patientAdvancedFilters.maxHMRRange = "";

      $scope.countries = searchFilterService.processCountries();
      addressService.getAllStatesAdv($scope.selectedCountryObj).then(function(response){
        $scope.rawStates = response.data;
        $scope.states = searchFilterService.processStates($scope.rawStates);
        $scope.cities = searchFilterService.processCities();
      }).catch(function(response){
        notyService.showError(response);
      });
    }
 $scope.endDateCheck = function()
{
  $scope.startdatecheck = $scope.patientAdvancedFilters.deviceActiveDateFrom;
  $scope.enddatecheck = $scope.patientAdvancedFilters.deviceActiveDateTo;
  if(new Date ($scope.enddatecheck) < new Date($scope.startdatecheck))
  {
     $scope.dateFlag = true;
  }
  else
  {
    $scope.dateFlag = false;
  }
  };
  $scope.maxRangeCheck = function(){
  $scope.minRange = $scope.patientAdvancedFilters.minHMRRange;
  $scope.maxRange = $scope.patientAdvancedFilters.maxHMRRange;
  if($scope.minRange > $scope.maxRange)
  {
     $scope.dateFlag = true;
  }
  else
  {
    $scope.dateFlag = false;
  }
  }
  $scope.getCityStateforAdvancedFilters = function(zipcode){ 
          $scope.isZipcode = true; 
          delete $scope.serviceError;
          $scope.isServiceError = false;
          if(zipcode){
            addressService.getCityStateByZip(zipcode).then(function(response){
              $scope.mapZipcode(response.data);
            }).catch(function(response){
              $scope.serviceError = response.data.ERROR;
              $scope.isServiceError = true;
               $scope.isZipcode = false; 
            });  
          }else{
            $scope.form = {};
            $scope.form.zip = {};
            $scope.isZipcode = false; 
            $scope.selectedStates = [];
            $scope.selectedCities = [];
            $scope.states = searchFilterService.processStates($scope.rawStates);
            $scope.cities = searchFilterService.processCities();
            $scope.patientAdvancedFilters.city = [];
             $scope.patientAdvancedFilters.state = [];
            $("#state-dropdown").css("background-color", 'inherit');
            $("#state-dropdown").css("pointer-events","all");
            $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
            $("#city-dropdown").css("pointer-events","none");
            if($scope.form.zip.$dirty && $scope.form.zip.$showValidationMessage && $scope.form.zip.$invalid){
            }else{
              $scope.serviceError = '';  
              $scope.isServiceError = true;
            }
          }
        };
             $scope.onCloseState = function(){
         if($scope.selectedStates.length > 0){
          var selectedStates = [];
          $scope.cities = [];
          $scope.patientAdvancedFilters.city = [];
          $scope.patientAdvancedFilters.state = [];
          angular.forEach($scope.selectedStates, function(state){
            $scope.patientAdvancedFilters.state.push(state.name);
          });

         addressService.getCitybyStateAdv($scope.selectedCountryObj,$scope.patientAdvancedFilters.state).then(function(response){
          if(!$scope.isZipcode){
          $("#city-dropdown").css("background-color", 'inherit');
          $("#city-dropdown").css("pointer-events","all");
        }
           $scope.cities = response.data;
          }).catch(function(){

          });

        }else{
          delete $scope.city;
          $scope.state = Object.keys($scope.rawStates).join();
          $scope.cities = searchFilterService.processCities();
          $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#city-dropdown").css("pointer-events","none");
          $scope.patientAdvancedFilters.city = [];
          $scope.patientAdvancedFilters.state = [];
      }
    };

   $scope.onCitiesClose = function(){
      if($scope.selectedCities.length > 0 ){
        $scope.patientAdvancedFilters.city = [];
        var cities = [];
        angular.forEach($scope.selectedCities, function(city){
          cities.push(city.name);
          $scope.patientAdvancedFilters.city.push(city.name);
        });
      }else{
        $scope.patientAdvancedFilters.city = [];
      }
    };
      $scope.clearMessages = function(){
          if($scope.patientAdvancedFilters.zipcode){
            delete $scope.serviceError;
          }
        };
    $scope.mapZipcode = function(responseData){
      if(responseData.length>0){
      $scope.selectedStates = [];
       $scope.isZipcode = true; 
            }
          angular.forEach(responseData, function(cityState){
            angular.forEach($scope.states, function(state){
            if(cityState.state === state.name){
              state.ticked = true;
              $scope.selectedStates.push(state);
            }
            else{
              state.ticked = false;
            }
          });
          });
          $("#state-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#state-dropdown").css("pointer-events","none");
          $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#city-dropdown").css("pointer-events","none");
          $scope.onCloseState();
    };

    $scope.resetAdvancedFilters = function(){
      $scope.initAdvancedFilters();
    }
    $scope.advancedSearchPatients = function(){
      $scope.isAdvancedFilters = true;
      if($scope.patientAdvancedFilters.zipcode){
        //do nothing
      }
      else{
        $scope.patientAdvancedFilters.zipcode = "";
      }
      angular.forEach($scope.selectedCities, function(city){
            $scope.patientAdvancedFilters.city.push(city.name);
          });
      console.log("$scope.patientAdvancedFilters",$scope.patientAdvancedFilters);
    }
    $scope.onCloseAgeRange = function(){
      if($scope.selectedAgeRange){
        $scope.patientAdvancedFilters.age = [];
        angular.forEach($scope.selectedAgeRange, function(ageRange){
          $scope.patientAdvancedFilters.age.push(ageRange.name);
        });
      }
    }
    $scope.onCloseAdherenceScoreRange = function(){
      if($scope.selectedAdherenceScoreRange){
        $scope.patientAdvancedFilters.adherenceScoreRange = [];
        angular.forEach($scope.selectedAdherenceScoreRange, function(adherenceScoreRange){
          $scope.patientAdvancedFilters.adherenceScoreRange.push(adherenceScoreRange.name);
        });
      } 
    }
     //End of Implementation of GIMP- 20    
        $scope.init();
      }]
    };
  }]);
