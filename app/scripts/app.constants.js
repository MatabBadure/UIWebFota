"use strict";
// DO NOT EDIT THIS FILE, EDIT THE GRUNT TASK NGCONSTANT SETTINGS INSTEAD WHICH GENERATES THIS FILE
angular.module('hillromvestApp')

.constant('ENV', 'dev')

.constant('VERSION', '0.0.1-SNAPSHOT')

.constant('URL', {
	'caregiverDashboard' : {
		'getPatients' : 'api/user/USERID/patients'
	},
	'clinicBaseURL': 'api/clinics',
	'userBaseUrl' : '/api/user/',
	'patientRelationships' : 'api/patient/relationships',
	'searchUsers': 'api/user/search?searchString=',
	'searchHcpUser': 'api/user/hcp/search?searchString=',
	'getStatistics':'/api/users/USERID/clinics/CLINICID/statistics',
	'getAssociatedPatientsByFilter':'/api/users/USERID/clinics/CLINICID/patients?filterBy=FILTER&page=PAGENO&per_page=OFFSET',
	'getAssociatedPatientsWithNoEvents':'/api/users/USERID/clinics/CLINICID/patients/FILTER?&page=PAGENO&per_page=OFFSET',
	'getClinicsAssociatedToCliniadmin' : '/api/user/USERID/clinics',
	'getPatientInfoWithMRN': '/api/patient/PATIENTID/clinic/CLINICID/mrnId',
	'searchPatientsForHCPOrClinicadmin': '/api/user/ROLE/USERID/patient/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&clinicId=CLINICID&filter=FILTER&sort_by=SORTBY',
	'getAssociatedHCP' : '/api/patient/PATIENTID/filteredhcp?filterByClinic=CLINICID',
	'searchAssociatedPatientsToClinic' : '/api/user/clinic/CLINICID/patient/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&filter=FILTER&sort_by=SORTBY',
	'nonAssociatedPatientForClinic':'/api/clinics/CLINICID/notAssociatedPatients?searchString=&filter=isDeleted:0;',
	'getTransmissionDate':'/api/patient/PATIENTID/firsttrasmissiondate',
	'getHCPsToLinkToPatient':'/api/patient/PATIENTID/hcpbypatientclinics/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET',
	'searchAssociatedHcpsToClinic':'/api/user/clinicadmin/CLINICADMINID/hcp/search?searchString=SEARCHSTRING&clinicId=CLINICID&page=PAGE&per_page=PERPAGECOUNT&filter=FILTER&sort_by=SORTBY',
	'getHCPsWithClinicName': 'api/user/hcp/search?searchString=&page=1&per_page=&sort_by=lastName&asc=true&filter=isDeleted:0',
	'getUserSecurityQuestion': 'api/user/USERID/securityQuestion',
	'searchPatientsForHCP': '/api/user/ROLE/USERID/patient/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&clinicId=CLINICID&filter=FILTER&sort_by=SORTBY',
	'searchPatientsForHCPOrClinicadminFromSuperAdmin': '/api/user/admin/ROLE/USERID/patient/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&clinicId=CLINICID&filter=FILTER&sort_by=SORTBY',
	'reactiavtePatient':'/api/user/PATIENTID/reactivate',
	'resendActivationLink':'/api/user/USERID/reactivation',
	'reactiavteUser': '/api/user/USERID/reactivate',
	'getAdeherenceData':'/api/user/USERID/adherenceTrend?from=FROMDATE&to=TODATE',
	'getAssociatedHCPtoClinic': '/api/user/hcp/search?searchString=SEARCHSTRING&clinicId=CLINICID&filter=FILTER&page=PAGENO&per_page=OFFSET&sort_by=SORTBY',
	'getClinicsByClinicadmin' : '/api/user/CLINICADMIN/clinics',
	'getAllUsersByRole': '/api/user/all?role=ROLE',
	'associateHcpToClinic':'/api/clinics/CLINICID/associatehcp',
	'clinicAssociatedHCPs': '/api/clinics/hcp?filter=id:CLINICID',
	'associatePatientToClinic':'/api/patient/PATIENTID/associateclinics',
	'disassociatePatientFromClinic': '/api/patient/PATIENTID/dissociateclinics',
	'searchClinics': 'api/clinics/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&sort_by=SORTBY&filter=FILTER',
	'associateClinicAdmin': '/api/clinics/CLINICID/associateclinicadmin',
	'disassociateClinicAdmmin': '/api/clinics/CLINICID/dissociateclinicadmin',
	'clinicAssoctPatients': '/api/clinics/patients?filter=id:CLINICID&page=PAGENO&per_page=OFFSET',
	'disassociateHcpFromClinic': '/api/user/HCPID/dissociateclinic',
	'clinicAdminByClinicId': '/api/clinics/CLINICID/clinicadmin',
	'allActiveParentClinics': '/api/clinics?page=1&per_page=&filter=deleted:false,parent:true&sort_by=name&asc=true',
	'allActiveClinics': '/api/clinics?per_page=&filter=deleted:false',
	'patientInClinic': '/api/clinics/patients?filter=',
	'getHcpUserById': '/api/user/HCPID/hcp',
	'hcpsInClinic' : '/api/clinics/hcp?filter=',
	'patientsAssociatedToHcp' : '/api/hcp/HCPID/patients?filterByClinic=',
	'clinicsAssociatedToHcp': '/api/hcp/HCPID/clinics',
	'associateHcpToPatient' : 'api/patient/PATIENTID/associatehcp',
	'associatedHcpsToPatient' : 'api/patient/PATIENTID/hcp',
	'disassociateHCPFromPatient' : 'api/patient/PATIENTID/dissociatehcp',
	'clinicsAssociatedToPatient' : 'api/patient/PATIENTID/clinics',
	'disassociateClinicsFromPatient' : 'api/patient/PATIENTID/dissociateclinics',
	'associateClinicToPatient' : 'api/patient/PATIENTID/associateclinics',
	'deviceAssociatedToPatient' : 'api/patient/PATIENTID/vestdevice',
	'caregiverAssociatedToPatient' : 'api/patient/PATIENTID/caregiver',
	'disassociateCaregiversFromPatient' : 'api/patient/PATIENTID/caregiver/CAREGIVERID',
	'protocolById' : 'api/patient/PATIENTID/protocol/PROTOCOLID',
	'addEditProtocol' : 'api/patient/PATIENTID/protocol',
	'caregiverById' : 'api/patient/PATIENTID/caregiver/CAREGIVERID',
	'addDevice' : 'api/patient/PATIENTID/linkvestdevice',
	'deactivateDevice' : 'api/patient/PATIENTID/deactivatevestdevice/SERIALNUMBER',
	'patientSearch' : 'api/user/patient/search?searchString=',
	'patientById' : '/api/user/PATIENTID/patient',
	'therapyDataAsCSV' : 'api/users/PATIENTID/exportTherapyDataCSV?from=STARTDATE&to=ENDDATE',
	'deviceDataAsCSV' : 'api/users/PATIENTID/exportVestDeviceDataCSV?from=STARTDATE&to=ENDDATE',
	'account' : 'api/account',
	'activate' : 'api/activate',
	'resetPasswordInit' : 'api/account/reset_password/init',
	'resetPasswordFinish' : 'api/account/reset_password/finish?key=KEY',
	'changePassword' : 'api/account/change_password',
	'updatePassword' : '/api/user/USERID/update_password',
	'authenticate' : 'api/authenticate',
	'logout' : '/api/logout',
	'updateEmailPassword' : 'api/account/update_emailpassword',
	'updatePasswordSecurityQuestion' : 'api/account/update_passwordsecurityquestion',
	'changeSecurityQuestion' : '/api/user/USERID/changeSecurityQuestion',
	'securityQuestions' : 'api/securityQuestions',
	'recaptcha' : '/api/recaptcha',
	'validateActivationKey' : 'api/validateActivationKey?key=KEYDATA',
	'validateResetKey' : 'api/validateResetKey?key=KEYDATA',
	'getCityStateZipByState' : '/api/cityStateZipMapByState?state=STATE',	
	'getAllStates' : '/api/allstates',
	'getCityStateByZip': '/api/cityStateZipMapByZip?zipcode=ZIPCODE',
	'validateCredentials': '/api/validateCredentials',
	'getLoginAnalytics': '/api/loginAnalytics?from=FROM&to=TO&filters=FILTERS&duration=DURATION',
	'isSurvey': '/api/survey/user/USER_ID',
	'getSurvey': '/api/survey/SURVEY_ID',
	'saveSuvey': '/api/survey',
	'getSurveyGridReport': '/api/survey/gridview/SURVEY_ID?fromDate=FROM_DATE&toDate=TO_DATE',
	'getSurveycomments': '/api/survey/answerbyquestion/QUESTIONID'
});
