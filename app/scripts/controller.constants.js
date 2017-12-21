
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
	"maxDaysForWeeklyGraph" : 6,
	"hmrDayGraph" : "HMRBAR_GRAPH",
	"hmrNonDayGraph" : "HMRLINE_GRAPH",
	"complianceGraph" : "COMPLIANCE_GRAPH",
	"defaultDaysForBadges" : 1,
	"timestampMMDDYY" : "MM/DD/YYYY",
	"timestampMMDDYYHHMMSS" : "MM/DD/YYYY HH:MM:SS",
	"serverDateTimeZone" : "Etc/GMT+6"
}

var profile = {
	'EMAIL_UPDATED_SUCCESSFULLY' : 'Email updated successfully. Please login again.',
	'PASSWORD_REST_ERROR' : 'Current password you entered is invalid.',

}

var notyMessages = {
	"typeWarning": "warning",
	"typeSuccess": "success",
	"maxComplianceError" : "Please deselect one parameter.",
	"minComplianceError": "At least one parameter should be selected."
}

requestParam = {
	"pageNo": 0,
	"offset": 10
}

var stringConstants = {
	"emptyString": ""
}

var footerConstants = {
	"contactus": "contactus",
	"privacyPolicy":  "privacyPolicy",
	"termsOfUse" : "termsOfUse",
	"privacyPractices" : "privacyPractices",
	"careSite": "careSite"
}

var resetpassword = {
	error : {
		"email_is_not_registered" : "E-Mail address isn't registered.",
		"unauthorized_email" : "Your account is not active in our system. So you cannot reset your password.",
		"contact_message_for_unauthorized_mail" : " In case you have forgotten your default password, please contact Hill-Rom Respiratory Care Customer Support at 800-426-4224 or you can reach us at HCCSWEB@Hill-Rom.com",
		"conatct_message" : " Please contact Hill-Rom Respiratory Care Customer Support at 800-426-4224 or you can reach us at HCCSWEB@Hill-Rom.com. "
	}
}

angular.module('hillromvestApp').constant('hcpDashboardConstants', {
    cumulativeGraph : {
		label : {
			"missedTherapy" : "MissedTherapy Days",
			"nonCompliance" : "HMR Non-Adherence",
			"settingDeviation" : "Setting Deviation",
			"noEvents" : "No Transmission Recorded"
		},
		color : {
			"missedTherapy" : "#ef6548",
			"nonCompliance" : "#8c6bb1",
			"settingDeviation" : "#41ae76",
			"noEvents" : "#4eb3d3"
		},
		yAxis : {
			"label" : "No. of patients"
		},
		"name" : "CUMULATIVE_GRAPH"
	},
	treatmentGraph : {
		label : {
			"treatmentPerDay" : "Treatments",
			"treatmentLength" : "Minutes"
		},
		color : {
			"treatmentPerDay" : "#4e95c4",
			"treatmentLength" : "#ff9829"
		},
		"type" : "area",
		"name" : "TREATMENT_GRAPH"
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
			"track" : "#ccc"
		},
		"missedTherapy" : "#ef6548",
		"nonCompliance" : "#8c6bb1",
		"settingDeviation" : "#41ae76",
		"noEvents" : "#4eb3d3"

	},
	serverDateFormat : "YYYY-MM-DD",
	USdateFormat : "MM-DD-YYYY"
})

.constant('loginConstants',{
	role : {
		"patient" : "PATIENT",
		"hcp" : "HCP",
		"caregiver" : "CARE_GIVER",
		"acctservices": "ACCT_SERVICES",
		"clinicadmin": "CLINIC_ADMIN",
		"admin": "ADMIN",
		"Rcadmin": "Rcadmin",
		"Rc": "Rc",
		"associates" : "ASSOCIATES",
		"customerservices" : "CUSTOMER_SERVICES",
		"FOTAAdmin" : "FOTA_ADMIN",
		"FOTAApprover" : "FOTA_APPROVER"

	}
})

.constant('loginAnalyticsConstants',{
	legends : {
		"ALL" : "all",
		"PATIENT" : "patient",
		"HCP" : "hcp",
		"CLINICADMIN": "clinicadmin",
		"CAREGIVER": "caregiver"
	},
	duration:{
		"DAY": "Day",
		"WEEK": "Week",
		"MONTH": "Month",
		"YEAR": "Year",
		"CUSTOM": "Custom"
	},
	string:{
		"COMMA": ","
	},
	filters:{
		"PATIENT": "PATIENT",
		"HCP": "HCP",
		"CLINICADMIN": "CLINIC_ADMIN",
		"CAREGIVER": "CARE_GIVER"
	},
	colors:{
		"PATIENT": "#ff9829",
		"HCP": "#35978f",
		"CLINICADMIN": "#4d95c4",
		"CAREGIVER": "#8b6baf"
	},

})
.constant('surveyConstants',{
	questions : {
		"patient_name": "Patient name",
		"patient_phone_number": "Patient phone number",
		"hours_of_use": "Hours of use",
		"serial_number": "Serial number",
		"patient_dob": "Patient date of birth",
		"survey_date": "Date",
		"space": " ",
		"main_phone_number": "Main phone number",
		"secondary_phone_number": "Secondary phone number",
		"address": "Address",
		"city": "City",
		"zipcode":"Zip code",
		"state": "State",
		"email_address": "Email"
	}
})
.constant('surveyGraphConstants',{
	legends : {
		"YES": "yes",
		"NO": "no",
		"STRONGLYDISAGREE": "strongly disagree",
		"SOMEWHATDISAGREE": "somewhat disagree",
		"NEUTRAL": "neutral",
		"SOMEWHATAGREE": "somewhat agree",
		"STRONGLYAGREE": "strongly agree",
		"UNABLETOASSESS":"unable to assess"
	},
	surveycolor : {
		"YES": "#34978f",
		"NO": "#f7972d",
		"strongly_disagree": "#dd1f2e",
		"somewhat_disagree": "#e65024",
		"neutral": "#f7972d",
		"somewhat_agree": "#3c9677",
		"strongly_agree": "#55ad46",
		"unable_to_assess": "#231f20"
	},
})
.constant('patientGraphsConstants',{
	colors: {
		"pressure": "#ff9829",
		"frequency": "#34978f",
		"duration": "#4e95c4"
	},
	units:{
		"frequency": "(Hz.)",
		"duration": "(Mins)"
	}
})
.constant('benchmarkingConstants',{
	string: {
		"adherenceScore": "adherenceScore",
		"average": "average",
		"myAvgAdherenceScore": "My Avg. Adherence Score",
		"clinicAvgAdherenceScore": " Avg. Adherence Score",
		"graphTitleMyAvgAdherenceScore": "My Average Adherence Score",
		"graphTitleVs": " Vs. ",
		"grapTitleClinicAdherenceScore": " Average Adherence Score",
		"grapTitleClinic": "Clinic",
		"graphTitleClinicAvg":"Clinic Patients Average ",
		"graphTitleAverage": "Average",
		"all": "All",
		"stateParam": "&state=",
		"cityParam": "&city="
	}
})

var benchmarkingParams = [
					{"parameter" : "adherenceScore", "name": "Adherence Score"},
					{"parameter" : "missedTherapy", "name": "Cumulative Missed Days"},
					{"parameter" : "settingDeviation", "name": "Cumulative Frequency Deviation Days"},
					{"parameter" : "HMRDeviation", "name": "HMR Non-Adherence"},
					{"parameter" : "HMRRunRate", "name": "Average Session Minutes"}
				]

var geographyOption = [
					{"name": "National"},
					{"name": "State"},
					{"name": "City"}
				]

var benchmarks = [
	{"benchmark" : "Average", "name": "Average"}
]

var patientBMParams = [
	{"parameter" : "adherenceScore", "name": "Adherence Score"}
]