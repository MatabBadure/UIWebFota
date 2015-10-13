'use strict';

angular.module('hillromvestApp')
    .service('sortOptionsService', [function () {
    	var sortIcons = {
    		"isDefault" : true,
    		"isDown" : false,
    		"isUp" : false
    	};

    	this.getSortOptionsForPatientList = function(){
    		var sortPatientList = {};
    		sortPatientList.firstName = sortIcons;
    		sortPatientList.lastName =  sortIcons;
    		sortPatientList.email = sortIcons;
    		sortPatientList.zipcode = sortIcons;
    		sortPatientList.address = sortIcons;
    		sortPatientList.city = sortIcons;
    		sortPatientList.dob = sortIcons;
    		sortPatientList.gender = sortIcons;
    		sortPatientList.state = sortIcons;
    		sortPatientList.adherence = sortIcons;
    		sortPatientList.mrnId = sortIcons;
    		sortPatientList.state = sortIcons;
    		sortPatientList.status = sortIcons;
    		sortPatientList.transmission = sortIcons;
    		sortPatientList.clinicName = sortIcons;
    		sortPatientList.adherence = sortIcons;
    		return sortPatientList;
    	};

    	this.toggleSortParam = function(sortOption){
    	  var toggleSortOption = {};    		
          if(sortOption.isDefault){
            toggleSortOption.isDefault = false;
            toggleSortOption.isDown = true;
            toggleSortOption.isUp = false;
          }
          else if(sortOption.isDown){
            toggleSortOption.isDefault = false;
            toggleSortOption.isDown = false;
            toggleSortOption.isUp = true;
          }
          else if(sortOption.isUp){
            toggleSortOption.isDefault = true;
            toggleSortOption.isDown = false;
            toggleSortOption.isUp = false;
          }          
          return toggleSortOption;
        };

        this.getSortByASCString = function(sortOption){
        	if(sortOption.isDown){
        		return searchFilters.amp +searchFilters.asc +searchFilters.equal + false; 
        	}else if(sortOption.isUp){
        		return searchFilters.amp +searchFilters.asc +searchFilters.equal + true; 
        	} else{
        		return searchFilters.emptyString;
        	}       	
        }

    }]);