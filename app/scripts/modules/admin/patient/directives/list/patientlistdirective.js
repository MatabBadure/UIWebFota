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
        $scope.genders = searchFilterService.processGenderOptions();
        $scope.adherenceReset = searchFilterService.processYesNoOptions();
        $scope.noTransmissionRecorded = searchFilterService.processYesNoOptions();
        $scope.belowFrequencySetting = searchFilterService.processYesNoOptions();
        $scope.belowTherapyMinutes = searchFilterService.processYesNoOptions();
        $scope.missedTherapyDays = searchFilterService.processYesNoOptions();
        $scope.activeInactive = searchFilterService.processActiveInactiveOptions();
        $scope.deviceType = searchFilterService.processDeviceTypeOptions();
        $scope.deviceStatus = searchFilterService.processActiveInactiveOptions();
        $scope.localLang = searchFilterService.multiselectPropertiesForAdvancedFilters()
        $scope.ageGroups = searchFilterService.processAgeRange();
        $scope.adherenceScoreRangeGroups= searchFilterService.processAdherenceScoreRange();
        $scope.diagnosis = {};
        $scope.isZipcode = false;
        $scope.form = {};

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
          $scope.isAdvancedFilters = false;
          $scope.noDataFlag = false;
          $scope.initAdvancedFilters();
          $scope.searchPatients();
          if($stateParams.clinicIds){
            $scope.getAssociatedPatientsToClinic($stateParams.clinicIds);
          }
/*          patientService.getDiagnosticList('').then(function(response){
           $scope.searchDiagnosis = {};
          if(response.data.typeCode){
          $scope.searchDiagnosis = response.data;
        }
        else{
           $scope.searchDiagnosis = {'typeCode':[]};
        }
          
        }).catch(function(){
           $scope.searchDiagnosis = {'typeCode':[]};
        }); */
        };

        $scope.searchPatientsOnQueryChange = function(){
          if(($state.current.name === "patientUser" || $state.current.name === "rcadminPatients" || $state.current.name === "associatePatientUser" || $state.current.name === "customerservicePatientUser") && !$stateParams.clinicIds && !searchOnLoad){
            $scope.isAdvancedFilters = false;
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
          if($scope.isAdvancedFilters){
            $scope.advancedSearchPatients(false);
          }
          else{
          var filter = searchFilterService.getFilterStringForPatient($scope.searchFilter);
          patientService.getPatients($scope.searchItem, $scope.sortOption, $scope.currentPageIndex, $scope.perPageCount,filter)
            .then(function(response) {
              $scope.patients = response.data;
               $scope.isAdvancedFilters = false;
              var patientCount = $scope.patients.length;
              for (var i = 0 ; i < patientCount ; i++) {                
                $scope.patients[i].dob = $scope.getDateFromTimestamp($scope.patients[i].dob);
                $scope.patients[i].lastTransmissionDate = $scope.getDateFromTimestampforTransmissiondate($scope.patients[i].lastTransmissionDate);
              }
              $scope.total = response.headers()['x-total-count'];
              $scope.pageCount = Math.ceil($scope.total / 10);
              searchOnLoad = false;
              $scope.noDataFlag = false;
            }).catch(function(response) {
              $scope.noMatchFound = true;
               $scope.isAdvancedFilters = false;
            });
          }
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
        //$scope.searchItem = ""; 
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
        $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
       $("#city-dropdown").css("pointer-events","none");
      $("#state-dropdown").css("background-color", 'inherit');
       $("#state-dropdown").css("pointer-events","all");
       $("#country-dropdown").css("background-color", 'inherit');
       $("#country-dropdown").css("pointer-events","all");
      $scope.dateFlag = false;
      $scope.hmrRangeFlag = false;
      $scope.patientAdvancedFilters = {};
      $scope.patientAdvancedFilters.name = "";
      $scope.patientAdvancedFilters.hillromId = "";
      $scope.patientAdvancedFilters.email = "";
      $scope.patientAdvancedFilters.gender = "All";
      $scope.patientAdvancedFilters.age = [];
      $scope.selectedCountry = [];
      $scope.selectedCountryObj = 'US';
      $scope.selectedStates = [];
      $scope.selectedCities = [];
      $scope.patientAdvancedFilters.country = [];
      $scope.patientAdvancedFilters.state = [];
      $scope.patientAdvancedFilters.city = [];
      $scope.patientAdvancedFilters.zipcode = "";
      $scope.patientAdvancedFilters.clinicLevelStatus = "All";
      $scope.ageGroups = searchFilterService.processAgeRange();
      $scope.adherenceScoreRangeGroups= searchFilterService.processAdherenceScoreRange();
      $scope.diagnosis ="";                   
      $scope.searchDiagnosis = {};
      $scope.patientAdvancedFilters.diagnosis = "";
      $scope.patientAdvancedFilters.adherenceScoreRange = [];
      $scope.patientAdvancedFilters.deviceType = "All";
      $scope.patientAdvancedFilters.deviceStatus = "All";
      $scope.patientAdvancedFilters.deviceActiveDateFrom = "";
      $scope.patientAdvancedFilters.deviceActiveDateTo = "";
      $scope.patientAdvancedFilters.serialNo = "";
      $scope.patientAdvancedFilters.minHMRRange = "";
      $scope.patientAdvancedFilters.maxHMRRange = "";
      $scope.patientAdvancedFilters.adherenceReset = "All";
      $scope.patientAdvancedFilters.noTransmissionRecorded = "All";
      $scope.patientAdvancedFilters.belowFrequencySetting = "All";
      $scope.patientAdvancedFilters.belowTherapyMin = "All";
      $scope.patientAdvancedFilters.missedTherapyDays = "All";

      $scope.countries = searchFilterService.processCountries();
      angular.forEach($scope.countries, function(country){
        if(country.ticked == true){
            $scope.patientAdvancedFilters.country.push(country.name);
          }
          });
      addressService.getAllStatesAdv($scope.patientAdvancedFilters.country).then(function(response){
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
  if($scope.patientAdvancedFilters.deviceActiveDateFrom && $scope.patientAdvancedFilters.deviceActiveDateTo){
  if(new Date ($scope.enddatecheck) < new Date($scope.startdatecheck))
  {
     $scope.dateFlag = true;
  }
  else
  {
    $scope.dateFlag = false;
  }
  }
  else{
     $scope.dateFlag = false;
  }

  };
  $scope.maxRangeCheck = function(){
  if(Number.isInteger($scope.patientAdvancedFilters.minHMRRange) && Number.isInteger($scope.patientAdvancedFilters.maxHMRRange)){
     $scope.hmrRangeInvalid = false;
  if(parseInt($scope.patientAdvancedFilters.minHMRRange) >= parseInt($scope.patientAdvancedFilters.maxHMRRange))
  {
     $scope.hmrRangeFlag = true;

  }
  else
  {
    $scope.hmrRangeFlag = false;
  }
  }
  else{
    if($scope.patientAdvancedFilters.minHMRRange % 1 != 0 || $scope.patientAdvancedFilters.maxHMRRange % 1 != 0){
      $scope.hmrRangeInvalid = true;
    }
    else{
      $scope.hmrRangeInvalid = false;
    }
     $scope.hmrRangeFlag = false;
     
  }
if($scope.patientAdvancedFilters.minHMRRange === undefined){
  //do nothing
  $scope.minHmrInvalid = true;
}
else{
  $scope.minHmrInvalid = false;
}
if($scope.patientAdvancedFilters.maxHMRRange === undefined){
  //do nothing
  $scope.maxHmrInvalid = true;
}
else{
  $scope.maxHmrInvalid = false;
}
  }
  $scope.getCityStateforAdvancedFilters = function(zipcode){ 
          $scope.isZipcode = true; 
          delete $scope.serviceError;
          $scope.isServiceError = false;
          console.log("form:",$scope.form);
          if(zipcode){
            addressService.getCityStateByZip(zipcode).then(function(response){
              $scope.mapZipcode(response.data);
            }).catch(function(response){
              $scope.serviceError = response.data.ERROR;
              $scope.isServiceError = true;
               $scope.isZipcode = false; 
            });  
          }else{
            $scope.form2 = {};
            $scope.form2.zip = {};
            $scope.isZipcode = false; 
            $scope.selectedStates = [];
            $scope.selectedCities = [];
            $scope.states = searchFilterService.processStates($scope.rawStates);
            $scope.cities = searchFilterService.processCities();
            $scope.countries = searchFilterService.processCountries();
            $scope.patientAdvancedFilters.city = [];
             $scope.patientAdvancedFilters.state = [];
             $scope.patientAdvancedFilters.country = [];
            $("#country-dropdown").css("background-color", 'inherit');
            $("#country-dropdown").css("pointer-events","all");
            $("#state-dropdown").css("background-color", 'inherit');
            $("#state-dropdown").css("pointer-events","all");
            $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
            $("#city-dropdown").css("pointer-events","none");
            if($scope.form2.zip.$dirty && $scope.form2.zip.$showValidationMessage && $scope.form2.zip.$invalid){
            }else{
              $scope.serviceError = '';  
              $scope.isServiceError = true;
            }
          }
        };
    $scope.onCloseCountry = function(){
          if($scope.selectedCountry.length > 0){
          var selectedCountry = [];
          $scope.states = [];
          $scope.cities = [];
          $scope.patientAdvancedFilters.country = [];
          $scope.patientAdvancedFilters.city = [];
          $scope.patientAdvancedFilters.state = [];
          //push selected country in $scope.patientadvancedFilters.country angular.foreach etc
          
          //pass the country to the service and call API like in line no.323

          angular.forEach($scope.selectedCountry, function(country){
            $scope.patientAdvancedFilters.country.push(country.name);
          });

          addressService.getAllStatesAdv($scope.patientAdvancedFilters.country).then(function(response){
          if(!$scope.isZipcode){
          $("#state-dropdown").css("background-color", 'inherit');
          $("#state-dropdown").css("pointer-events","all");
          }
          $scope.rawStates = response.data;
           $scope.states = searchFilterService.processStates($scope.rawStates);
           angular.forEach($scope.states, function(state){

            $scope.patientAdvancedFilters.state.push(state.name);
          });  
          }).catch(function(){

          }); 
          //states pushing
          //call cities api  
             
         /* addressService.getCitybyStateAdv($scope.patientAdvancedFilters.country,$scope.patientAdvancedFilters.state).then(function(response){
          if(!$scope.isZipcode){
          $("#city-dropdown").css("background-color", 'inherit');
          $("#city-dropdown").css("pointer-events","all");
          }
           $scope.cities = response.data;
          }).catch(function(){
          });*/
          }
          else{
          delete $scope.state;
          $scope.states = searchFilterService.processStates($scope.rawStates);
          delete $scope.city;
         // $scope.state = Object.keys($scope.rawStates).join();
          $scope.cities = searchFilterService.processCities();
          $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#city-dropdown").css("pointer-events","none");
          $("#state-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#state-dropdown").css("pointer-events","none");
          $scope.patientAdvancedFilters.city = [];
          $scope.patientAdvancedFilters.state = [];

          }
          };
    $scope.onCloseState = function(){
          if($scope.selectedStates.length > 0){
          var selectedStates = [];
          $scope.cities = [];
          $scope.patientAdvancedFilters.city = [];
          $scope.patientAdvancedFilters.state = [];
          //push selected country in $scope.patientadvancedFilters.country angular.foreach etc

          //pass the country to the service and call API like in line no.323

          angular.forEach($scope.selectedStates, function(state){
            if(!$scope.isZipcode){
          $("#state-dropdown").css("background-color", 'inherit');
          $("#state-dropdown").css("pointer-events","all");
        }
            $scope.patientAdvancedFilters.state.push(state.name);
          });

         addressService.getCitybyStateAdv($scope.patientAdvancedFilters.country,$scope.patientAdvancedFilters.state).then(function(response){
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
            var cntry = ["US","CANADA"];
            addressService.getAllStatesAdv(cntry).then(function(response){
        $scope.rawStates = response.data;
        $scope.states = searchFilterService.processStates($scope.rawStates);
        $scope.cities = searchFilterService.processCities();
      }).catch(function(response){
        notyService.showError(response);
      });

          angular.forEach(responseData, function(cityState){
            angular.forEach($scope.countries, function(country){
            if(cityState.country === country.name){
              country.ticked = true;
              $scope.selectedCountry.push(country);
            }
            else{
              country.ticked = false;
            }
          });
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
          $("#country-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#country-dropdown").css("pointer-events","none");
          $("#state-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#state-dropdown").css("pointer-events","none");
          $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#city-dropdown").css("pointer-events","none");
          $scope.onCloseState();
    };

    $scope.resetAdvancedFilters = function(){
      $scope.initAdvancedFilters();
    }
    $scope.advancedSearchPatients = function(isFresh){
      if(isFresh){
        $scope.searchItem = "";
        $scope.currentPageIndex = 1;
          $scope.perPageCount = 10;
          $scope.pageCount = 0;
          $scope.total = 0;
      }
     
      if($scope.patientAdvancedFilters.zipcode){
        //do nothing
      }
      else{
        $scope.patientAdvancedFilters.zipcode = "";
      }
      if($scope.patientAdvancedFilters.minHMRRange){
        $scope.patientAdvancedFilters.minHMRRange = $scope.patientAdvancedFilters.minHMRRange.toString();
      }
      if($scope.patientAdvancedFilters.maxHMRRange){
        $scope.patientAdvancedFilters.maxHMRRange = $scope.patientAdvancedFilters.maxHMRRange.toString();
      }
      angular.forEach($scope.selectedCities, function(city){
            $scope.patientAdvancedFilters.city.push(city.name);
          });
      patientService.getPatientsAdvancedSearch($scope.sortOption, $scope.currentPageIndex, $scope.perPageCount, $scope.patientAdvancedFilters).then(function(response){
              $scope.patients = response.data;
               $scope.isAdvancedFilters = true;
              var patientCount = $scope.patients.length;
              for (var i = 0 ; i < patientCount ; i++) {                
                $scope.patients[i].dob = $scope.getDateFromTimestamp($scope.patients[i].dob);
                $scope.patients[i].lastTransmissionDate = $scope.getDateFromTimestampforTransmissiondate($scope.patients[i].lastTransmissionDate);
              }
              if($scope.patientAdvancedFilters.minHMRRange){
              $scope.patientAdvancedFilters.minHMRRange = Number($scope.patientAdvancedFilters.minHMRRange);
               }
               if($scope.patientAdvancedFilters.maxHMRRange){
               $scope.patientAdvancedFilters.maxHMRRange = Number($scope.patientAdvancedFilters.maxHMRRange);
              }
              $scope.total = response.headers()['x-total-count'];
              $scope.pageCount = Math.ceil($scope.total / 10);
               $scope.noDataFlag = true;
      }).catch(function(){
       if($scope.patientAdvancedFilters.minHMRRange){
              $scope.patientAdvancedFilters.minHMRRange = Number($scope.patientAdvancedFilters.minHMRRange);
               }
               if($scope.patientAdvancedFilters.maxHMRRange){
               $scope.patientAdvancedFilters.maxHMRRange = Number($scope.patientAdvancedFilters.maxHMRRange);
              }
        $scope.noMatchFound = true;
        $scope.noDataFlag = true;
         $scope.isAdvancedFilters = false;
      });
      console.log("$scope.patientAdvancedFilters",$scope.patientAdvancedFilters);
    };
    $scope.onCloseAgeRange = function(){
      if($scope.selectedAgeRange){
        $scope.patientAdvancedFilters.age = [];
        angular.forEach($scope.selectedAgeRange, function(ageRange){
          $scope.patientAdvancedFilters.age.push(ageRange.name);
        });
      }
    };
    $scope.onCloseAdherenceScoreRange = function(){
      if($scope.selectedAdherenceScoreRange){
        $scope.patientAdvancedFilters.adherenceScoreRange = [];
        angular.forEach($scope.selectedAdherenceScoreRange, function(adherenceScoreRange){
          $scope.patientAdvancedFilters.adherenceScoreRange.push(adherenceScoreRange.name);
        });
      } 
    };
    $scope.getMatchingDiagnosisList = function($viewValue){
      console.log("$viewValue",$viewValue);
      if($viewValue.length == 2 || $viewValue.length > 2){
        console.log("$viewValue.length",$viewValue.length);
            patientService.getDiagnosticList($viewValue).then(function(response){
           $scope.searchDiagnosis = {};
          if(response.data.typeCode){
          $scope.searchDiagnosis = response.data;
        }
        else{
           $scope.searchDiagnosis = {'typeCode':[]};
        }
          
        }).catch(function(){
           $scope.searchDiagnosis = {'typeCode':[]};
        });  
        return $scope.searchDiagnosis.typeCode;
    }
    };
    $scope.selectDiagnosis = function(diagnosis){
      if(diagnosis){
        if(diagnosis.type_code){
        $scope.patientAdvancedFilters.diagnosis = diagnosis.type_code;
      }
      else{
         $scope.patientAdvancedFilters.diagnosis = "";
      }
      }
      else{
        $scope.patientAdvancedFilters.diagnosis = "";
      }
    };
     //End of Implementation of GIMP- 20    
        $scope.init();
      }]
    };
  }]);
