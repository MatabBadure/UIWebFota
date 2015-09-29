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
            return searchFilter;
        }

        this.initSearchFiltersForClinic = function() {
            var searchFilter = {};
            searchFilter.isActive = true;
            searchFilter.isInActive = false;
            return searchFilter;
        }

        this.initSearchFiltersForHCP = function() {
            var searchFilter = {};
            searchFilter.isActive = true;
            searchFilter.isInActive = false;
            return searchFilter;
        }


        this.getFilterStringForPatient = function(filter) {
           var filterString = searchFilters.isActive + searchFilters.colon;
           filterString += (filter.isActive) ? 1 : 0; 
           filterString += searchFilters.semicolon;
           filterString += searchFilters.isDeleted + searchFilters.colon;
           filterString += (filter.isInActive) ? 1 : 0; 
           filterString += searchFilters.semicolon;
           filterString += searchFilters.isSettingsDeviated + searchFilters.colon;
           filterString += (filter.isSettingsDeviated) ? 1 : 0; 
           filterString += searchFilters.semicolon;
           filterString += searchFilters.isHMRNonCompliant + searchFilters.colon;
           filterString += (filter.isHMRNonCompliant) ? 1 : 0; 
           filterString += searchFilters.semicolon;
           filterString += searchFilters.isMissedTherapy + searchFilters.colon;
           filterString += (filter.isMissedTherapy) ? 1 : 0; 
           filterString += searchFilters.semicolon;
           filterString += searchFilters.isNoEvent + searchFilters.colon;
           filterString += (filter.isNoEvent) ? 1 : 0; 
           return filterString;
        }

        this.getFilterStringForClinics = function() {
          var filterString = searchFilters.isActive + searchFilters.colon;
          filterString += (filter.isActive) ? 1 : 0; 
          filterString += searchFilters.semicolon;
          filterString += searchFilters.isDeleted + searchFilters.colon;
          filterString += (filter.isInActive) ? 1 : 0; 
          return searchFilter;
        }

        this.getFilterStringForHCP = function() {
          var filterString = searchFilters.isActive + searchFilters.colon;
          filterString += (filter.isActive) ? 1 : 0; 
          filterString += searchFilters.semicolon;
          filterString += searchFilters.isDeleted + searchFilters.colon;
          filterString += (filter.isInActive) ? 1 : 0; 
          return searchFilter;
        }

    }]);
