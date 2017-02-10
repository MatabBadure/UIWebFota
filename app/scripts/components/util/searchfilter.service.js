'use strict';

angular.module('hillromvestApp')
    .service('searchFilterService', [function () {
        this.initSearchFiltersForPatient = function(filter, isActive) {
            var searchFilter = {};
            if(isActive){
              searchFilter.isActive = true;
            }
            if(filter){
              switch(filter){
                case 'isActive':searchFilter.isActive = true;
                break;
                case 'isInActive':searchFilter.isInActive = true;
                break;
                case 'noevents':searchFilter.isNoEvent = true;
                break;
                case 'setting_deviation':searchFilter.isSettingsDeviated = true;
                break;
                case 'non_hmr_compliance':searchFilter.isHMRNonCompliant = true;
                break;
                case 'missed_therapy':searchFilter.isMissedTherapy = true;
                break;
                case 'isPending':searchFilter.isPending = true;
                break;
              }
            }else{
              searchFilter.isActive = true;
              searchFilter.isInActive = false;
              searchFilter.isNoEvent = false;
              searchFilter.isSettingsDeviated = false;
              searchFilter.isHMRNonCompliant = false;
              searchFilter.isMissedTherapy = false;
              searchFilter.isPending = false;
              searchFilter.VisiVest = true;
              searchFilter.Monarch = true;
            }
            searchFilter.userList = searchFilters.patientList;
            return searchFilter;
        }

        this.initSearchFiltersForClinic = function() {
            var searchFilter = {};
            searchFilter.isActive = true;
            searchFilter.isInActive = false;
            searchFilter.userList = searchFilters.clinicList;
            return searchFilter;
        }

        this.initSearchFiltersForHCP = function() {
            var searchFilter = {};
            searchFilter.isActive = true;
            searchFilter.isInActive = false;
            searchFilter.userList = searchFilters.hcpList;
            return searchFilter;
        }


        this.getFilterStringForPatient = function(filter) {
           var filterString = searchFilters.emptyString;
           if(filter.isActive && !filter.isInActive){
              filterString = searchFilters.isDeleted + searchFilters.colon + 0 + searchFilters.semicolon;
           }else if(!filter.isActive && filter.isInActive){
              filterString = searchFilters.isDeleted + searchFilters.colon + 1 + searchFilters.semicolon;
           }
           if(filter.isSettingsDeviated){
             filterString += searchFilters.isSettingsDeviated + searchFilters.colon + 1 + searchFilters.semicolon;
           }
           if(filter.isHMRNonCompliant){
             filterString += searchFilters.isHMRNonCompliant + searchFilters.colon + 1 + searchFilters.semicolon;
           }
           if(filter.isMissedTherapy){
             filterString += searchFilters.isMissedTherapy + searchFilters.colon + 1 + searchFilters.semicolon; 
           }
           if(filter.isNoEvent){
            filterString += searchFilters.isNoEvent + searchFilters.colon + 1 + searchFilters.semicolon; 
           }
            if(filter.VisiVest && filter.Monarch){
            // the following commented code is for later use when on selection of both devices All should be passed- incomplete from Back-end as of now
           // filterString += searchFilters.deviceType + searchFilters.all + searchFilters.colon + 1 + searchFilters.semicolon;
            filterString += searchFilters.amp + searchFilters.devicetype + searchFilters.VisiVest ;
           }
             else if(filter.VisiVest && !filter.Monarch){
            filterString += searchFilters.amp + searchFilters.devicetype + searchFilters.VisiVest ; 
           }
           else if(filter.Monarch && !filter.VisiVest){
            filterString += searchFilters.amp + searchFilters.devicetype + searchFilters.Monarch ; 
           }
            else if(!filter.VisiVest && !filter.Monarch){
            // the following commented code is for later use when on selection of both devices All should be passed- incomplete from Back-end as of now
           // filterString += searchFilters.deviceType + searchFilters.all + searchFilters.colon + 1 + searchFilters.semicolon;
            filterString += searchFilters.amp + searchFilters.devicetype + searchFilters.VisiVest ;
           }
           return filterString;
        }

        this.getFilterStringForClinics = function(filter) {
          var filterString = searchFilters.emptyString;
            if(filter.isActive && !filter.isInActive){
              filterString = searchFilters.isDeleted + searchFilters.colon + 0 + searchFilters.semicolon;
            }else if(!filter.isActive && filter.isInActive){
              filterString = searchFilters.isDeleted + searchFilters.colon + 1 + searchFilters.semicolon;
            }
          return filterString;
        }

        this.getFilterStringForHCP = function(filter) {
          var filterString = searchFilters.emptyString;                   
          if(filter.isActive && !filter.isInActive){
            filterString = searchFilters.isDeleted + searchFilters.colon + 0 + searchFilters.semicolon;
          }else if(!filter.isActive && filter.isInActive){
            filterString = searchFilters.isDeleted + searchFilters.colon + 1 + searchFilters.semicolon;
          }
          return filterString;
        }

        /*Method to Link (associate) */
        this.getMatchingUser = function($viewValue, list, active){
          var userList = [];
          if(active){
            for (var i=0; i< list.length; i++) {
              if ((list[i].firstName.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 || list[i].lastName.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ||(list[i].lastName.toLowerCase()+' '+list[i].firstName.toLowerCase()).indexOf($viewValue.toLowerCase()) != -1 ) && !list[i].deleted) {
                userList.push(list[i]);
              }
            }
          }else{
            for (var i=0; i< list.length; i++) {
              if (list[i].firstName.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 || list[i].lastName.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ||(list[i].lastName.toLowerCase()+' '+list[i].firstName.toLowerCase()).indexOf($viewValue.toLowerCase()) != -1 ) {
                userList.push(list[i]);
              }
            }
          }
          return userList;
        }

        this.getMatchingClinic = function($viewValue, list){
          var clinics = [];
          for (var i=0; i< list.length; i++) {
            if (list[i].name.toLowerCase().indexOf($viewValue.toLowerCase()) != -1) {
              clinics.push(list[i]);
            }
          }
          return clinics;
        }

        /*Method to Link (associate) Patient to clinic (Match to Name, Email and HillromId)*/
        this.getMatchingUserByNameEmailId = function($viewValue, list){
          var userList = [];
          for (var i=0; i< list.length; i++) {
            if (list[i].firstName.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 || list[i].lastName.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 ||(list[i].lastName.toLowerCase()+' '+list[i].firstName.toLowerCase()).indexOf($viewValue.toLowerCase()) != -1 || list[i].email.toLowerCase().indexOf($viewValue.toLowerCase()) != -1 || list[i].hillromId.toLowerCase().indexOf($viewValue.toLowerCase()) != -1) {
              userList.push(list[i]);
            }
          }
          return userList;
        }

        this.getFilterStringForHillromUser = function(filter, userRole) {
          var filterString = searchFilters.emptyString;
          var filterString = (userRole === searchFilters.all) ? filterString : searchFilters.authority + searchFilters.colon + userRole + searchFilters.semicolon;                    
          if(filter.isActive && !filter.isInActive){
            filterString += searchFilters.isDeleted + searchFilters.colon + 0 + searchFilters.semicolon;
          }else if(!filter.isActive && filter.isInActive){
            filterString += searchFilters.isDeleted + searchFilters.colon + 1 + searchFilters.semicolon;
          }else if(filter.isActive && filter.isInActive){
            filterString += searchFilters.isDeleted + searchFilters.colon + searchFilters.activeInactive + searchFilters.semicolon;
          }
          if(filter.isPending){
            filterString += searchFilters.isActivated + searchFilters.colon + 0 + searchFilters.semicolon;
          }else if(!filter.isPending){
            filterString += searchFilters.isActivated + searchFilters.colon + 1 + searchFilters.semicolon;
          }                    
          return filterString;                                
        }


    }]);
