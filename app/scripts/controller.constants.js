
var hillRomUser = {
    'title' : 'Mr.',
    'role' : ''
}

var reset = {
	finish : {
		'passwordNotMatched' : "The password and its confirmation do not match",
		'otherError' : 'Error occured'
	}
}

var admin_cont = {
	hcp : {
		'credentialsList' : ['MD', 'RN', 'NP', 'RT', 'Other'],
		'other' : 'Other'
	}
}
var apiresponse = {
	"HMR_NON_COMPLIANCE_AND_SETTINGS_DEVIATION" : "Your recommended compliance therapy is low.",
	"HMR_NON_COMPLIANCE": "Your recommended compliance therapy is low.",
	"MISSED_THERAPY":"Your recommended compliance therapy is low."

}
var patientDashboard = {
	"HMRBarGraphColor" : "#4e95c4",
	"HMRLineGraphColor" : "#4e95c4",
	"dateFormat" : "MM-DD-YYYY",
	"maxDurationInMonths" : 12,
	"serverDateFormat" : "YYYY-MM-DD",
	"INDdateFormat" : "DD-MM-YYYY",
	"minDaysForMonthlyGraph" : 31,
	"maxDaysForWeeklyGraph" : 6
}

var profile = {
	'EMAIL_UPDATED_SUCCESSFULLY' : 'Email updated successfully. Please login again.'
}

var notyMessages = {
	"typeWarning": "warning",
	"typeSuccess": "success",
	"maxComplianceError" : "Please deselect one item.",
	"minComplianceError": "At least one item should be selected."
}


angular.module('hillromvestApp').constant('hcpDashboardConstants', {
    cumulativeGraph : {
		label : {
			"missedTherapy" : "MissedTherapy Days",
			"nonCompliance" : "HMR Non-Compliance",
			"settingDeviation" : "Setting Deviation",
			"noEvents" : "No Events Recorded"
		},
		color : {
			"missedTherapy" : "red",
			"nonCompliance" : "green",
			"settingDeviation" : "blue",
			"noEvents" : "orange"
		},
		yAxis : {
			"label" : "No. of patients"
		}
	},
	treatmentGraph : {
		label : {
			"treatmentPerDay" : "Treatments",
			"treatmentLength" : "Minutes"
		},
		color : {
			"treatmentPerDay" : "orange",
			"treatmentLength" : "green"
		},
		"type" : "area"
	},
	message : {
		"noData" : "No Data Available!"
	},
	statistics : {
		"duration" : 3000,
		"scaleColor" : false,
		"lineWidth" : 12,
		"lineCap" : "circle",
		color : {
			"track" : "#ccc",
			"quarter" : "#69be7f",
			"half" : "#f7a462",
			"threeQuarters" : "blue",
			"full" : "#e28181"

		}
	},
	serverDateFormat : "YYYY-MM-DD",
	USdateFormat : "MM-DD-YYYY"
})

.constant('loginConstants',{
	role : {
		"patient" : "PATIENT",
		"hcp" : "HCP"

	}
})