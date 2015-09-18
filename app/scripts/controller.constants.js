
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
	"maxDaysForWeeklyGraph" : 7
}

var profile = {
	'EMAIL_UPDATED_SUCCESSFULLY' : 'Email updated successfully. Please login again.'
}

var hcpDashboard = {
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
			"threeQuarters" : "5da0cc",
			"full" : "#e28181"

		}
	}
}

var notyMessages = {
	"typeWarning": "warning",
	"typeSuccess": "success",
	"maxComplianceError" : "Please deselect one item.",
	"minComplianceError": "At least one item should be selected."
}
