'use strict';

angular.module('hillromvestApp')
    .service('searchFilterService', [function () {
        this.initSearchFiltersForPatient = function() {
            var searchFilter = {};
            searchFilter.isActive = true;
            searchFilter.isInActive = false;
            searchFilter.isNoEvent = false;
            searchFilter.isSettingDeviation = false;
            searchFilter.isHMRNonCompliant = false;
            searchFilter.isMissedTherapy = false;
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
           return filterString;
        }

        this.getFilterStringForClinics = function(filter) {
          var filterString = searchFilters.emptyString;
            if(filter.isActive && !filter.isInActive){
              filterString = searchFilters.isDeleted + searchFilters.colon + 0;
            }else if(!filter.isActive && filter.isInActive){
              filterString = searchFilters.isDeleted + searchFilters.colon + 1;
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

    }]);
