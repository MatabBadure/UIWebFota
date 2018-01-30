'use strict';

angular.module('hillromvestApp')
  .directive('doctorList', ['UserService', '$state', '$stateParams', 'searchFilterService', 'sortOptionsService','addressService','clinicService',
    function(UserService, $state, $stateParams, searchFilterService, sortOptionsService, addressService, clinicService) {
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
        $scope.credentialsList = admin_cont.hcp.credentialsList;
        $scope.localLang = searchFilterService.multiselectPropertiesForAdvancedFilters();
         $scope.activeInactive = searchFilterService.processActiveInactiveOptions();
         $scope.isAdvancedFilters = false;
        $scope.init = function() {
          $scope.searchFilter = searchFilterService.initSearchFiltersForHCP();
          $scope.doctorInfo = {};
          $scope.initHcpAdvancedFilters();
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
           $scope.noDataFlag = false;
          $scope.searchDoctors();
          if($stateParams.clinicIds){                      
            $scope.getAssociatedHCPsToClinic($stateParams.clinicIds);
          }
        };

        $scope.searchDoctorsOnQueryChange = function(){
          if(($state.current.name === "hcpUser" || $state.current.name === "hcpUserRcadmin" || $state.current.name === "associateHcpUser" || $state.current.name === "customerserviceHcpUser") && !$stateParams.clinicIds && !searchOnLoad){
            $scope.isAdvancedFilters = false;
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
           if($scope.isAdvancedFilters){
          $scope.advancedSearchHcps(false);
          }
           else{
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
             $scope.noDataFlag = false;
          }).catch(function(response) {

          });
        }
        };
        $scope.toggleHeaderAccount = function(){
      $( "#collapseTwo" ).slideToggle( "slow" );
      //$scope.expandedSign = ($scope.expandedSign === "+") ? "-" : "+"; 
      $scope.expandedSign = ($scope.expandedSign === true) ? false : true;  
      if($scope.expandedSign === true){
       // $scope.searchItem = ""; 
        /*$scope.isAdvancedFilters = true;*/
       $("#searchListParam").attr("disabled", true);
       $("#searchListParam").css("background-color", 'rgb(235, 235, 228)'); 
     // $scope.initPaginationVars();
      }
      else{
         
       $("#searchListParam").attr("disabled", false);
       $("#searchListParam").css("background-color", 'inherit'); 
      }     
    };
       $scope.initHcpAdvancedFilters = function(){
       $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
       $("#city-dropdown").css("pointer-events","none");
      $("#state-dropdown").css("background-color", 'inherit');
       $("#state-dropdown").css("pointer-events","all");
       $("#country-dropdown").css("background-color", 'inherit');
       $("#country-dropdown").css("pointer-events","all");
      $scope.isZipcode = false;
      $scope.hcpAdvancedFilter = {};
      $scope.hcpAdvancedFilter.name = "";
      //$scope.hcpAdvancedFilter.clinicType = "";
      $scope.hcpAdvancedFilter.specialty = "";
      $scope.hcpAdvancedFilter.credentials= "";
      $scope.selectedCountry = [];
      $scope.selectedCountryObj = 'US';
      $scope.selectedStates = [];
      $scope.selectedCities = [];
      $scope.hcpAdvancedFilter.country = [];
      $scope.hcpAdvancedFilter.state = [];
      $scope.hcpAdvancedFilter.city = [];
      $scope.hcpAdvancedFilter.zipcode = "";
      //$scope.hcpAdvancedFilter.adherenceWindowSelected = "";
      $scope.hcpAdvancedFilter.status = "All";
      $scope.countries = searchFilterService.processCountries();
      $scope.searchDoctorsOnQueryChange();
      //$scope.getAdherenceScoreSettingDays();
     /* $("#country-dropdown").css("background-color",'#eeeeee');
      $("#country-dropdown").css("pointer-events","none");*/
      clinicService.getClinicSpeciality().then(function(response){
         $scope.specialities =  response.data.typeCode;
      }).catch(function(response){});

      $scope.countries = searchFilterService.processCountries();

      angular.forEach($scope.countries, function(country){
        if(country.ticked == true){
            $scope.hcpAdvancedFilter.country.push(country.name);
          }
          });
      
      addressService.getAllStatesAdv($scope.hcpAdvancedFilter.country).then(function(response){
        $scope.rawStates = response.data;
        $scope.states = searchFilterService.processStates($scope.rawStates);
        $scope.cities = searchFilterService.processCities();
      }).catch(function(response){
        notyService.showError(response);
      });
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
            $scope.hcpAdvancedFilter.city = [];
            $scope.hcpAdvancedFilter.state = [];
            $scope.hcpAdvancedFilter.country = [];
            $scope.countries = searchFilterService.processCountries();
            $("#country-dropdown").css("background-color", 'inherit');
            $("#country-dropdown").css("pointer-events","all");
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
      $scope.onCloseCountry = function(){
          if($scope.selectedCountry.length > 0){
          var selectedCountry = [];
          $scope.states = [];
          $scope.cities = [];
          $scope.hcpAdvancedFilter.country = [];
          $scope.hcpAdvancedFilter.city = [];
          $scope.hcpAdvancedFilter.state = [];
          //push selected country in $scope.patientadvancedFilters.country angular.foreach etc
          
          //pass the country to the service and call API like in line no.323

          angular.forEach($scope.selectedCountry, function(country){
            $scope.hcpAdvancedFilter.country.push(country.name);
          });

          addressService.getAllStatesAdv($scope.hcpAdvancedFilter.country).then(function(response){
          if(!$scope.isZipcode){
          $("#state-dropdown").css("background-color", 'inherit');
          $("#state-dropdown").css("pointer-events","all");
          }
           $scope.rawStates = response.data;
           $scope.states = searchFilterService.processStates($scope.rawStates);
          }).catch(function(){

          }); 
          //states pushing
          //call cities api  
/*          angular.forEach($scope.selectedStates, function(state){
            $scope.hcpAdvancedFilter.state.push(state.name);
          });  */   
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
          $scope.states = searchFilterService.processStates();
          delete $scope.city;
         // $scope.state = Object.keys($scope.rawStates).join();
          $scope.cities = searchFilterService.processCities();
          $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#city-dropdown").css("pointer-events","none");
          $("#state-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#state-dropdown").css("pointer-events","none");
          $scope.hcpAdvancedFilter.city = [];
          $scope.hcpAdvancedFilter.state = [];

          }
          };
     $scope.onCloseState = function(){
         if($scope.selectedStates.length > 0){
          var selectedStates = [];
          $scope.cities = [];
          $scope.hcpAdvancedFilter.city = [];
          $scope.hcpAdvancedFilter.state = [];
          angular.forEach($scope.selectedStates, function(state){
            $scope.hcpAdvancedFilter.state.push(state.name);
          });

         addressService.getCitybyStateAdv($scope.hcpAdvancedFilter.country,$scope.hcpAdvancedFilter.state).then(function(response){
          if(!$scope.isZipcode){
          $("#city-dropdown").css("background-color", 'inherit');
          $("#city-dropdown").css("pointer-events","all");
        }
           $scope.cities = response.data;
           angular.forEach($scope.cities, function(cityObj){
          cityObj.name  = unescape(escape(cityObj.name));
        });
          }).catch(function(){

          });

        }else{
          delete $scope.city;
          $scope.state = Object.keys($scope.rawStates).join();
          $scope.cities = searchFilterService.processCities();
          $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#city-dropdown").css("pointer-events","none");
          $scope.hcpAdvancedFilter.city = [];
          $scope.hcpAdvancedFilter.state = [];
      }
    };

   $scope.onCitiesClose = function(){
      if($scope.selectedCities.length > 0 ){
        $scope.hcpAdvancedFilter.city = [];
        var cities = [];
        angular.forEach($scope.selectedCities, function(city){
          cities.push(city.name);
          $scope.hcpAdvancedFilter.city.push(city.name);
        });
      }else{
        $scope.hcpAdvancedFilter.city = [];
      }
    };
      $scope.clearMessages = function(){
          if($scope.hcpAdvancedFilter.zipcode){
            delete $scope.serviceError;
          }
        };
    $scope.mapZipcode = function(responseData){
      if(responseData.length>0){
      $scope.selectedStates = [];
       $scope.isZipcode = true; 
       $scope.states = [];
       $scope.cities = [];
       $scope.selectedCities = [];
       $scope.selectedStates = [];
       $scope.selectedCountry = [];

       $scope.hcpAdvancedFilter.country = [];
       $scope.hcpAdvancedFilter.state = [];
       $scope.hcpAdvancedFilter.city = [];
            }

            $scope.states.push({
              'name':responseData[0].state,
              'ticked':true
            });
            $scope.cities.push({
              'name':responseData[0].city,
              'ticked':true
            }); 
            $scope.selectedStates.push({
              'name':responseData[0].state,
              'ticked':true
            });
            $scope.selectedCities.push({
              'name':responseData[0].city,
              'ticked':true
            });

           $scope.hcpAdvancedFilter.state.push(responseData[0].state);
          // $scope.clinicAdvancedFilter.city.push(responseData[0].city);
          angular.forEach(responseData, function(cityState){
            angular.forEach($scope.countries, function(country){
            if(cityState.country === country.name){
              country.ticked = true;
              $scope.selectedCountry.push(country);
              $scope.hcpAdvancedFilter.country.push(country.name);
            }
            else{
              country.ticked = false;
            }
          });
          });

          $("#country-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#country-dropdown").css("pointer-events","none");
          $("#state-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#state-dropdown").css("pointer-events","none");
          $("#city-dropdown").css("background-color", 'rgb(235, 235, 228)');
          $("#city-dropdown").css("pointer-events","none");
    };


    $scope.resetAdvancedFilters = function(){
      $scope.initHcpAdvancedFilters();
    }
     $scope.advancedSearchHcps = function(isFresh){
      if(isFresh){
         $scope.searchItem = ""; 
        $scope.currentPageIndex = 1;
      $scope.perPageCount = 10;
      $scope.pageCount = 0;
      $scope.total = 0;
      }
      $scope.isAdvancedFilters = true;
      if($scope.hcpAdvancedFilter.zipcode){
       $scope.hcpAdvancedFilter.zipcode = $scope.hcpAdvancedFilter.zipcode.replace(' ','');
      }
      else{
        $scope.hcpAdvancedFilter.zipcode = "";
      }
      angular.forEach($scope.selectedCities, function(city){
            $scope.hcpAdvancedFilter.city.push(city.name);
          });
/*      for(var i=0;i<$scope.selectedCities.length;i++){
        $scope.hcpAdvancedFilter.city.push($scope.selectedCities[i].name);
      }*/
      
      DoctorService.getclinicsByAdvancedFilter($scope.hcpAdvancedFilter,$scope.clinicSortOption, $scope.currentPageIndex, $scope.perPageCount).then(function(response){
       $scope.doctors = {};
        $scope.doctors = response.data;
         $scope.total = response.headers()['x-total-count'];
        $scope.pageCount = Math.ceil($scope.total / 10);
        $scope.noDataFlag = true;
        }).catch(function(response){
          
          });
    }
    $scope.lastRadio = function(value,lastRadio){
      if(value.name === lastRadio){
        return 'advanced-filters-radio-last'
      }
      else return "";
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
          }else if(sortParam === sortConstant.name){
            toggledSortOptions = sortOptionsService.toggleSortParam($scope.sortHcpList.name);
            $scope.sortHcpList = sortOptionsService.getSortOptionsForHcpList();
            $scope.sortHcpList.name = toggledSortOptions;
            $scope.sortOption = sortConstant.name + sortOptionsService.getSortByASCString(toggledSortOptions);
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
