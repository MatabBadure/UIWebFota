'use strict';

angular.module('hillromvestApp')
    .service('searchFilterService', [function () {
        this.initSearchFilters = function() {
            var searchFilter = {};
            searchFilter.isActive = true;
            searchFilter.isInActive = false;
            searchFilter.isNoEvent = false;
            searchFilter.isSettingDeviation = false;
            searchFilter.isHMRNonCompliant = false;
            searchFilter.isMissedTherapy = false;
            return searchFilter;
        }

        this.getFilterString = function(filter) {
           var filterString = searchFilters.isActive + searchFilters.equal;
           filterString += (filter.isActive) ? 1 : 0; 
           filterString += searchFilters.amp;
           filterString += searchFilters.isDeleted + searchFilters.equal;
           filterString += (filter.isInActive) ? 1 : 0; 
           filterString += searchFilters.amp;
           filterString += searchFilters.isSettingsDeviated + searchFilters.equal;
           filterString += (filter.isSettingsDeviated) ? 1 : 0; 
           filterString += searchFilters.amp;
           filterString += searchFilters.isHMRNonCompliant + searchFilters.equal;
           filterString += (filter.isHMRNonCompliant) ? 1 : 0; 
           filterString += searchFilters.amp;
           filterString += searchFilters.isMissedTherapy + searchFilters.equal;
           filterString += (filter.isMissedTherapy) ? 1 : 0; 
           filterString += searchFilters.amp;
           filterString += searchFilters.isNoEvent + searchFilters.equal;
           filterString += (filter.isNoEvent) ? 1 : 0; 
           return filterString;
        };

    }]);
