
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
	},
    timsFilePathConstant : '/usr/tomcat/apache-tomcat-8.0.28/TIMS/logs/'
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
    asc:"asc",
    isPending: "isPending",
    isActivated: "isActivated",
    authority: "authority",
    all: "All",
    activeInactive: "all",
    VisiVest: "VEST",
    Monarch: "MONARCH",
    devicetype : "deviceType=",
    allCaps : "ALL",
    Both: "BOTH",
    isSuccess: "isSuccess",
    isFail: "isFail",
    success: "Success",
    failure: "Failure",
    VisiVest_Full: "VisiVest",
    Monarch_Full: "Monarch",
    oneSize: "One Size"
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
    patientDoB: "patientDoB",
    comma: ",",
    isActivated: "isActivated",
    from: "messages.user.lastName",
    subject: "messages.messageSubject",
    date: "messages.messageDatetime",
    sentTo: "toClinic.name",
    sentSubject: "messages.messageSubject",
    sentDate: "messages.messageDatetime",
    sentToCA: "user.lastName",


    announcementName: "name",
    announcementSubject: "subject",
    announcementStartDate: "startDate",
    announcementEndDate: "endDate",
    announcementModifiedDate : "modifiedDate",
    announcementModifiedDatePatient : "modified_date",
    fromCA: "messages.fromClinic.name",
    loglink: "loglink",
    timsdate: "date"
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
    deviceType : "The VisiVest™ System",
    deviceTypeMonarch : "The Monarch™ System",
    deviceTypeBoth: "The VisiVest™ System , The Monarch™ System",
    emptyString: "",
    comma: ", ",
    runrate: "Total Therapy Hours Runrate",
    averageSessionMinutes: "Average Treatment Minutes",
    consecutiveMissedDays: "Consecutive Missed Therapy days",
    consecutiveFrequencyDeviationDays : "Consecutive Frequency Deviation Days"

}

angular.module('hillromvestApp').constant('hcpServiceConstants', {
    graph : {
		baseURL : 'api/users'
	}
});

angular.module('hillromvestApp').constant('pdfServiceConstants', {
    text : {
        hillrom : 'HillRom',
        visiviewHealthPortal: 'VisiView™ Health Portal',
        hillromOverview: "Hillrom | Overview",
        reportGenerationDate: "Report Generation Date ",
        hcpName: "HCP Name: ",
        date: "Date: ",
        signature: "Signature: ",
        name: "Name: ",
        colon: ":",
        fromDate: "From",
        toDate: "To",
        loginanalytic: "Login Analytic",
        hyphen: " - ",
        dateRangeOfReportLabel: "Date Range Of Report",
        survey: "Survey",
        benchmarking:"Benchmarking",
        complianceStatistics: "Statistics",
        protocolGraph: "Protocol Graph",
        hmrStatistics: "Total Therapy Hours",
        adherenceTrend: "Adherence Trend",
        survey: "Survey",
        cumulativeStatistics: "Cumulative Statistics",
        treatmentsStatistics: "Treatments Statistics",
        surveyForFiveDays: "Survey For 5 Days",
        surveyForThirtyDays: "Survey For 30 Days",
        surveyForNinetyDays: "Survey For Ninety Days",
        patientbenchmarkingStatistcs: " My Average Adherence Score Vs. Clinic Average Adherence Score",
        patientBMPageHeader : "Visi-View Respiratory Care",
        pdfpageHeader: "Hill-Rom Respiratory Care",
        noHMRGraphContentForPDF : "Protocol and Total Therapy Hours Graph is Not Available because of No Data",
        signatureContent : "Electronically signed by ",
        monarch:"Monarch"
    },
    style:{
        font:{
            helvetica: "helvetica",
            bold: "bold",
            normal: "normal"
        }
    },
    pdfDraw:{
        p: "p",
        pt: "pt",
        a4: "a4",
        line:{
            f: "F"
        }
    },
    loginanalytics:{
        day: "Day",
        patient: "Patient",
        hcp: "HCP",
        clinicadmin: "Clinic Admin",
        caregiver: "Caregiver"
    }
});



