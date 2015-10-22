"use strict";
// DO NOT EDIT THIS FILE, EDIT THE GRUNT TASK NGCONSTANT SETTINGS INSTEAD WHICH GENERATES THIS FILE
angular.module('hillromvestApp')

.constant('ENV', 'dev')

.constant('VERSION', '0.0.1-SNAPSHOT')

.constant('URL', {
	'caregiverDashboard' : {
		'getPatients' : 'api/user/USERID/patients'
	},
	'getStatistics':'/api/users/USERID/clinics/CLINICID/statistics',
	'getAssociatedPatientsByFilter':'/api/users/USERID/clinics/CLINICID/patients?filterBy=FILTER&page=PAGENO&per_page=OFFSET',
	'getAssociatedPatientsWithNoEvents':'/api/users/USERID/clinics/CLINICID/patients/FILTER?&page=PAGENO&per_page=OFFSET',
	'getClinicsAssociatedToCliniadmin' : '/api/user/USERID/clinics',
	'getPatientInfoWithMRN': '/api/patient/PATIENTID/clinic/CLINICID/mrnId',
	'searchPatientsForHCPOrClinicadmin': '/api/user/admin/ROLE/USERID/patient/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&clinicId=CLINICID&filter=FILTER&sort_by=SORTBY',
	'getAssociatedHCP' : '/api/patient/PATIENTID/filteredhcp?filterByClinic=CLINICID',
	'searchAssociatedPatientsToClinic' : '/api/user/clinic/CLINICID/patient/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&filter=FILTER',
	'nonAssociatedPatientForClinic':'/api/clinics/CLINICID/notAssociatedPatients?searchString=',
	'getTransmissionDate':'/api/patient/PATIENTID/firsttrasmissiondate',
	'getHCPsToLinkToPatient':'/api/patient/PATIENTID/hcpbypatientclinics/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET',
	'searchAssociatedHcpsToClinic':'/api/user/clinicadmin/CLINICADMINID/hcp/search?searchString=SEARCHSTRING&clinicId=CLINICID&page=PAGE&per_page=PERPAGECOUNT&filter=FILTER',
	'getHCPsWithClinicName': 'api/user/hcp/search?searchString=&page=1&per_page=&sort_by=lastName&asc=true',
	'getUserSecurityQuestion': 'api/user/USERID/securityQuestion',
	'searchPatientsForHCP': '/api/user/ROLE/USERID/patient/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&clinicId=CLINICID&filter=FILTER&sort_by=SORTBY'
});
