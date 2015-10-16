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
    	
    }]);