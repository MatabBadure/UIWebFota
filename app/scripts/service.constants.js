
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
    amp: '&',
    colon: ':',
    semicolon: ';',
    emptyString: '',
    patientList : "patientList",
    clinicList: "clinicList",
    hcpList: "hcpList",
    asc:"asc"
}

var sortConstant = {
    sortIconDefaultClass : 'sort-icon--default', 
    sortIconDefault : 'sortIconDefault',
    sortIconDownClass : 'sort-icon-down', 
    sortIconDown : 'sortIconDown', 
    sortIconUpClass :'sort-icon-up',
    sortIconUp : 'sortIconUp',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    zipcode: 'zipcode',
    address: 'address',
    city: 'city',
    dob : "dob",
    gender: "gender",
    state: "state",
    adherence: "adherence",
    mrnId: "mrnId",
    transmission: "transmission",
    status: "status",
    sortClass: "sortClass",
    plastName: "plastName",
    pemail: "pemail",
    pfirstName: "pfirstName",
    pzipcode: "pzipcode",
    paddress: "paddress",
    pcity: "pcity",
    pdob: "pdob",
    pgender: "pgender",
    state: "state",
    adherence: "adherence",
    mrnid: "mrnid",
    last_date: "last_date",
    isDeleted: "isDeleted",
    credentials: "credentials",
    npiNumber: "npiNumber",
    clinicName: "clinicName",
    hcity: "hcity",
    hstate: "hstate",
    hillromId: "hillromId",
    phoneNumber: "phoneNumber",
    name: "name",
    type: "type",
    parent: "parent",
    deleted: "deleted",
    role: "role",
    mobileNumber: "mobileNumber",
    mobilePhone: "mobilePhone",
    hcp: "hcp",
    hcpname: "hcpname",
    pHillromId: "phillrom_id",
    patientDoB: "patientDoB"
}

var stringConstants = {
    reportGenerationDateLabel: "Report Generation Date",
    dateRangeOfReportLabel: "Date Range Of Report",
    patientInformationLabel: "Patient Information",
    deviceInformationLabel: "Device Information",
    NotificationLabel: "Notification",
    minus: "-",
    colon: ":",
    mrn: "MRN",
    name: "Name",
    address: "Address",
    phone: "Phone",
    DOB: "DOB",
    adherenceScore: "Adherence Score",
    type: "Type",
    serialNumber: "Serial Number",
    missedTherapyDays: "Missed Therapy Days",
    hmrNonAdherence: "HMR Non-Adherence",
    settingDeviation: "Setting Deviation",
    dateLabel: "Date",
    hcpNameLabel: "HCP Name",
    signatureLabel: "Signature",
    space: " ",
    notAvailable: "N/A",
    deviceType : "The Vest System",
    emptyString: "",
    comma: ", ",
    runrate: "HMR Runrate"

}

angular.module('hillromvestApp').constant('hcpServiceConstants', {
    graph : {
		baseURL : 'api/users'
	}
});


