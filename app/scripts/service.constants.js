
var admin = {
  patient : {
  	baseURL : 'api/patient/',
  	searchURL : 'api/user/patient/search'
	},
	hillRomUser : {
		baseURL : 'api/user',
		users : 'api/users',
		notes : 'api/notes',
		patients : 'api/patients'
	}
}

var patient = {
	notification : {
		updateNotificationStatus : 'api/notifications'
	},
	graph : {
		baseURL : 'api/users'
	}
}

var searchFilters = {
	isActive : 'isActive', 
    isInActive : 'isInActive',
    isDeleted : 'isDeleted', 
    isSettingsDeviated : 'isSettingsDeviated', 
    isHMRNonCompliant :'isHMRNonCompliant',
    isMissedTherapy : 'isMissedTherapy',
    isNoEvent: 'isNoEvent',
    equal: '=',
    amp: '&'
}
angular.module('hillromvestApp').constant('hcpServiceConstants', {
    graph : {
		baseURL : 'api/users'
	}
});


