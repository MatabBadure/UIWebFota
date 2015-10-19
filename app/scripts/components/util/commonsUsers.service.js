'use strict';

angular.module('hillromvestApp')
    .service('commonsUserService', [function () {
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
              }
            });   
          });
          return data;
        };
    	
    }]);