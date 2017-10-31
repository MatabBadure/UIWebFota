'use strict';

angular.module('hillromvestApp')
    .service('commonsUserService', ['$window', function ($window) {
    	this.getSelectedClinicFromList= function(clinics, clinicId){
    		var selectedClinic = false;
    		angular.forEach(clinics, function(clinic) {
				if(clinic.id === clinicId){
					selectedClinic = clinic;
				}
			});
			return selectedClinic;
    	};
        
        this.formatDataForTypehead = function(data){
          angular.forEach(data, function(object){
            angular.forEach(object, function(value, key){
              if(!value){
                object[key] = "";
              }else{
                object[key] = value + " ";
              }
            });   
          });
          return data;
        };
        this.isValidDOBDate = function(dob){
            var parts   = dob.split("/"),
            month   = parseInt(parts[0], 10),
            day     = parseInt(parts[1], 10),
            year    = parseInt(parts[2], 10),
            monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
            currentDate = new Date(),
            dobTimestamp = new Date(dob).getTime(),
            currentDateTimestamp = currentDate.getTime(),
            maxYearRange = currentDate.getFullYear(),            
            maxMonthRange = 12,
            maxDayRange = 28;
            var isValidTimestamp = (dobTimestamp > currentDateTimestamp ) ? false : true;
            if(month === 2){
              if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
                maxDayRange = 29;
              }
            }else{
              maxDayRange = monthLength[month - 1];
            }
            // date picker considers month>12 as decemeber + (12-1) month, so month check is necessary,
            // minimum age has been considered as 250
            // so year range check is required
            if(!isValidTimestamp || (year < (maxYearRange -250) || year > maxYearRange || month <= 0 || month > maxMonthRange || day <= 0 || day > maxDayRange)){
              return false;
            }else{
              return true;
            }
        };

        this.formatZipcode = function(zipcode){
          //while(zipcode && zipcode.toString().length < 5){
          //  zipcode = '0' + zipcode;
          //}
          return zipcode;
        };
    	
       this.getBrowser = function(){
          var userAgent = $window.navigator.userAgent;
          var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
          for(var key in browsers) {
              if (browsers[key].test(userAgent)) {
                  return key;
              }
         };
         return 'unknown';
       }
    }]);