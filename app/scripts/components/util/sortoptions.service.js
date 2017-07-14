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
            sortPatientList.hcp = sortIcons;
            sortPatientList.hillromId = sortIcons;
    		return sortPatientList;
    	};
         this.getSortOptionsForTimsLogList =  function(){
            var sortTimsLogList = {};
            sortTimsLogList.dateTims = sortIcons;
            sortTimsLogList.loglinkTims = sortIcons;
            return sortTimsLogList;
        }

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
            toggleSortOption.isDefault = false;
            toggleSortOption.isDown = true;
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
        };

        this.getSortOptionsForHcpList = function(){
            var sortHcpList = {};
            sortHcpList.firstName = sortIcons;
            sortHcpList.lastName =  sortIcons;
            sortHcpList.credentials = sortIcons;
            sortHcpList.npiNumber = sortIcons;
            sortHcpList.clinicName = sortIcons;
            sortHcpList.city = sortIcons;
            sortHcpList.state = sortIcons;
            sortHcpList.status = sortIcons;
            return sortHcpList;
        };

        this.getSortOptionsForClinicList = function(){
            var sortClinicList = {};
            sortClinicList.clinicName = sortIcons;
            sortClinicList.address =  sortIcons;
            sortClinicList.city = sortIcons;
            sortClinicList.state = sortIcons;
            sortClinicList.phoneNumber = sortIcons;
            sortClinicList.type = sortIcons;
            sortClinicList.hillromId = sortIcons;
            sortClinicList.status = sortIcons;
            return sortClinicList;
        };

        this.getSortOptionsForUserList = function(){
            var sortUserList = {};
            sortUserList.lastName = sortIcons;
            sortUserList.role =  sortIcons;
            sortUserList.hillromId = sortIcons;
            sortUserList.email = sortIcons;
            sortUserList.mobileNumber = sortIcons;
            sortUserList.status = sortIcons;
            return sortUserList;
        };

        this.setSortOptionToDefault = function(){            
            var defaultSortOption = {};  
            defaultSortOption.isDefault = true;
            defaultSortOption.isDown = false;
            defaultSortOption.isUp = false;
            return defaultSortOption;
        };
        this.getSortOptionsForMessages = function(){
            var sortMessageList = {};
            sortMessageList.from = sortIcons;
            sortMessageList.subject =  sortIcons;
            sortMessageList.date = sortIcons;
            sortMessageList.to = sortIcons;
            return sortMessageList;
        };
        this.getSortOptionsForAnnouncements = function(){
            var sortMessageList = {};
            sortMessageList.nameOfannouncement = sortIcons;
            sortMessageList.announcementsubject =  sortIcons;
            sortMessageList.announcementStartdate = sortIcons;
            sortMessageList.announcementEnddate = sortIcons;
            return sortMessageList;
        };
    }]);