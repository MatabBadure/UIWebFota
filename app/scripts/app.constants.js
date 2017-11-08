
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
	'chargerBaseURL':'/api/chargerdevicedata',
	'chargerDataList' : 'api/chargerdevicedatalist',
	'clickedListData' : 'api/chargerdevicedata/ID',
	'patientRelationships' : 'api/patient/relationships',
	'getReasonForJustification': 'api/codeValues/justification_reset',
	'resetAdherenceScore': 'api/adherenceReset',
	'searchUsers': 'api/user/search?searchString=',
	'getAdherenceDays' : 'api/codeValues/adherence_setting',
	'searchHcpUser': 'api/user/hcp/search?searchString=',
	'addPatientNotes':'api/memoNotes',
	'getStatistics':'/api/users/USERID/clinics/CLINICID/statistics?deviceType=DEVICETYPE',
	'getAssociatedPatientsByFilter':'/api/users/USERID/clinics/CLINICID/patients?filterBy=FILTER&page=PAGENO&per_page=OFFSET',
	'getAssociatedPatientsWithNoEvents':'/api/users/USERID/clinics/CLINICID/patients/FILTER?&page=PAGENO&per_page=OFFSET',
	'getClinicsAssociatedToCliniadmin' : '/api/user/USERID/clinics',
	'getPatientInfoWithMRN': '/api/patient/PATIENTID/clinic/CLINICID/USERID/mrnId',
	'searchPatientsForHCPOrClinicadmin': '/api/user/ROLE/USERID/patient/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&clinicId=CLINICID&filter=FILTER&sort_by=SORTBY',
	'getAssociatedHCP' : '/api/patient/PATIENTID/filteredhcp?filterByClinic=CLINICID',
	'searchAssociatedPatientsToClinic' : '/api/user/clinic/CLINICID/patient/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&filter=FILTER&sort_by=SORTBY',
	'nonAssociatedPatientForClinic':'/api/clinics/CLINICID/notAssociatedPatients?searchString=&filter=isDeleted:0;',
	'getTransmissionDate':'/api/patient/PATIENTID/firsttrasmissiondate?&deviceType=DEVICETYPE',
	'getHCPsToLinkToPatient':'/api/patient/PATIENTID/hcpbypatientclinics/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET',
	'searchAssociatedHcpsToClinic':'/api/user/clinicadmin/CLINICADMINID/hcp/search?searchString=SEARCHSTRING&clinicId=CLINICID&page=PAGE&per_page=PERPAGECOUNT&filter=FILTER&sort_by=SORTBY',
	'getHCPsWithClinicName': 'api/user/hcp/search?searchString=&page=1&per_page=&sort_by=lastName&asc=true&filter=isDeleted:0',
	'getUserSecurityQuestion': 'api/user/USERID/securityQuestion',
	'searchPatientsForHCP': '/api/user/ROLE/USERID/patient/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&clinicId=CLINICID&filter=FILTER&sort_by=SORTBY',
	'searchPatientsForHCPOrClinicadminFromSuperAdmin': '/api/user/admin/ROLE/USERID/patient/search?searchString=SEARCHSTRING&page=PAGENO&per_page=OFFSET&clinicId=CLINICID&filter=FILTER&sort_by=SORTBY',
	'reactiavtePatient':'/api/user/PATIENTID/reactivate',
	'resendActivationLink':'/api/user/USERID/reactivation',
	'reactiavteUser': '/api/user/USERID/reactivate',
	'getAdeherenceData':'/api/user/USERID/adherenceTrend?from=FROMDATE&to=TODATE&deviceType=DEVICETYPE',
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
	'deviceAssociatedToPatient' : 'api/patient/PATIENTID/vestdevice?deviceType=DEVICETYPE',
	'caregiverAssociatedToPatient' : 'api/patient/PATIENTID/caregiver',
	'disassociateCaregiversFromPatient' : 'api/patient/PATIENTID/caregiver/CAREGIVERID',
	'protocolById' : 'api/patient/PATIENTID/protocol/PROTOCOLID?deviceType=DEVICETYPE',
	'getProtocol' : 'api/patient/PATIENTID/protocol?deviceType=DEVICETYPE',
	'addEditProtocol' : 'api/patient/PATIENTID/protocol/DEVICETYPE',	
	'caregiverById' : 'api/patient/PATIENTID/caregiver/CAREGIVERID',
	'addDevice' : 'api/patient/PATIENTID/linkdevice?deviceType=DEVICETYPE&deviceValue=DEVICEVALUE',
	'deactivateDevice' : 'api/patient/PATIENTID/deactivatedevice/SERIALNUMBER?deviceType=DEVICETYPE',
	'patientSearch' : 'api/user/patient/search?searchString=',
	'patientById' : '/api/user/PATIENTID/patient',
	'therapyDataAsCSV' : 'api/users/PATIENTID/exportTherapyDataCSV?from=STARTDATE&to=ENDDATE',
	'deviceDataAsCSV' : 'api/users/PATIENTID/exportVestDeviceDataCSV?from=STARTDATE&to=ENDDATE&deviceType=DEVICETYPE',
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
	'getCitiesByState': '/api/availableCities?state=STATE',
	'validateCredentials': '/api/validateCredentials',
	'getLoginAnalytics': '/api/loginAnalytics?from=FROM&to=TO&filters=FILTERS&duration=DURATION',
	'isSurvey': '/api/survey/user/USER_ID',
	'getSurvey': '/api/survey/SURVEY_ID',
	'saveSuvey': '/api/survey',
	'getSurveyGridReport': '/api/survey/gridview/SURVEY_ID?fromDate=FROM_DATE&toDate=TO_DATE',
	'getSurveycomments': '/api/survey/answerbyquestion/QUESTIONID?fromDate=FROM_DATE&toDate=TO_DATE',
	'getGraphSurveyGridReport': '/api/survey/SURVEY_ID/graph?from=FROM_DATE&to=TO_DATE',
	'getBenchmarking': '/api/benchmark/parameter?type=TYPE&benchmarkType=BENCHMARKTYPE&xAxisParameter=XAXIS&range=RANGE&from=FROM&to=TO',
	'availableStates':'/api/availableStates',
	'getPateintBenchmarking': '/api/user/patient/PATIENTID/benchmark?parameterType=PARAMETERTYPE&benchmarkType=BENCHMARKTYPE&from=FROM&to=TO&clinicId=CLINICID',
	'getHCPBenchmarking': '/api/user/hcp/USERID/benchmark?from=FROM&to=TO&benchmarkType=BENCHMARKTYPE&parameterType=PARAMETERTYPE&clinicId=CLINICID',
	'getClinicAdminBenchmarking': '/api/user/clinicadmin/USERID/benchmark?from=FROM&to=TO&benchmarkType=BENCHMARKTYPE&parameterType=PARAMETERTYPE&clinicId=CLINICID',
	'getClinicDisease':'/api/benchmark/statistics?from=FROM&to=TO&xAxisParameter=XAXIS&ageGroupRange=AGERANGE&clinicSizeRange=CLINICRANGE',
	'getClinicDiseaseNonXaxis':'/api/benchmark/statistics?from=FROM&to=TO&xAxisParameter=&ageGroupRange=all&clinicSizeRange=all&ignoreXAxis=true',
	'getTestResultByPatientId':'/api/testresult/user/PATIENTID?from=FROM_DATE&to=TO_DATE',
	'testResult': '/api/testresult/user/PATIENTID',
	'getTestResultById': '/api/testresult/ID',
	'updateTestRESULT' : '/api/testresult/user/PATIENTID',
	'addTestResultByClinicadminHCP' : '/api/testresult/patient/PATIENTID/user/USERID',
	'getClinicSpeciality' : 'api/codeValues/clinic_speciality',
	'sendMessage' : 'api/message',
	'getSentItems' : 'api/messagesSent/ID?isClinic=ISCLINIC&page=PAGE&per_page=PER_PAGE&sort_by=SORT_OPTION',
	'archiveMessages' : 'api/messages/archived',
	'markReadUnread' : 'api/messages/readunread',
	'getInboxItems' : 'api/messagesReceived/ID?isClinic=BOOL&mailBoxType=MAILBOXTYPE&page=PAGE&per_page=PER_PAGE&sort_by=SORT_OPTION',
	'getInboxItemsCA' : 'api/messagesReceived/ID?isClinic=BOOL&clinicId=CLINICID&mailBoxType=MAILBOXTYPE&page=PAGE&per_page=PER_PAGE&sort_by=SORT_OPTION',
	'getUnreadCount' : 'api/messages/ID/readunredCount?isClinic=BOOL',
	'getUnreadCountCA' : 'api/messages/ID/readunredCount?isClinic=BOOL&clinicId=CLINICID',
	'getMessageBody' : 'api/messageDetails/MESSAGEID',
	'getSentItemsCA' : 'api/messagesSent/ID?isClinic=ISCLINIC&clinicId=CLINICID&page=PAGE&per_page=PER_PAGE&sort_by=SORT_OPTION',
	'getThreaddata':'api/messagesReceivedThreads/ID/ROOTID?userId=USERID&clinicId=CLINICID',
	'uploadfile' : 'api/announcement/uploadFile',
	'createAnnouncement' : 'api/announcement/create',
	'listAllAnnouncements' : 'api/announcements/getAll?page=PAGE&per_page=PER_PAGE&sort_by=SORT_OPTION&userType=USER_TYPE',
	'editAnnouncement' : 'api/announcement/ID/details',
	'deleteAnnouncement' : 'api/announcement/ID/delete',
	'listAnnouncementsPatient':'api/announcements/getAll?page=PAGE&per_page=PER_PAGE&sort_by=SORT_OPTION&userType=USER_TYPE&USERID',
	'listAnnouncements':'api/announcements/getAll?page=PAGE&per_page=PER_PAGE&sort_by=SORT_OPTION&userType=USER_TYPE&USERID&filterClinicId=CLINICID',
	'downloadPdf' : 'api/announcement/files/FILE_NAME',
	'updateAnnouncements' : 'api/announcement/update',
	'getPatientType' : 'api/codeValues/announcement_patient_type', 
	'getlatestAdherenceWindow' : 'api/patient/USERID/clinics',
	'getBadgeStatistics':'/api/users/USERID/clinics/CLINICID/badgestatistics?from=FROM_DATE&to=TO_DATE',
	'getActivePatients':'api/activePatCountForDevice/CLINICID',
	'adherenceResetProgress': '/api/adherenceResetProgress/CLINICID',
	'getAdherenceScoreResetHistory' : 'api/user/ID/AdherenceResetHistoryForPatient?&page=PAGE&per_page=PER_PAGE&deviceType=DEVICETYPE',
	'getgarmentTypeCodeValues_Vest' : 'api/codeValues/garment_type_vest',
	'getgarmentSizeCodeValues_Vest' : 'api/codeValues/garment_size_vest',
	'getgarmentColorCodeValues_Vest' : 'api/codeValues/garment_color_vest',
	'getgarmentTypeCodeValues_Monarch' : 'api/codeValues/garment_type_monarch',
	'getgarmentSizeCodeValues_Monarch' : 'api/codeValues/garment_size_monarch',
	'getgarmentColorCodeValues_Monarch' : 'api/codeValues/garment_color_monarch',
	'executeTimsJob' : 'api/executeTIMSJob',
	'timsScriptLogDetails' : 'api/retrieveLogData/logs',
	'fotaVerify' : 'api/FOTA/create',
	'uploadfileFota' : 'api/FOTA/uploadFile',
	'softDelete' : 'api/FOTA/softDeleteFOTA/partNoD/isOldFileD',
	'fotaCRC32Calculation' : 'api/FOTA/CRC32Calculation',
	'fotaDeviceList' : 'api/FOTADeviceList?status=STATUS&page=PAGE&per_page=PER_PAGE&searchString=SEARCHSTRING&sort_by=SORT_OPTION',
	'getFirmwareList' : 'api/FOTAList?page=PAGE&per_page=PER_PAGE&status=STATUS&searchString=SEARCHSTRING&sort_by=SORT_OPTION',
	'getFirmwareInfo': 'api/FOTA/ID/getFirmware',
	'approverCRC32':'api/FOTA/validateApproverCRC32',
	'firmwareSoftDelete':'api/FOTA/ID/userRole/firmwareDelete',
	'firmwareDownload':'api/FOTA/ID/download',
	'loglist' : 'api/listLogDirectory?page=PAGE&per_page=PER_PAGE&sort_by=SORT_OPTION&status=FILTER&fromDate=FROM_DATE&toDate=TO_DATE',
	'optimusdevicedatalist' : 'api/optimusdevicedatalist?page=PAGE&per_page=PER_PAGE',
	'optimusDeviceData' : 'api/optimusDeviceData/ID',
	'optimusdevicedata' : 'api/optimusdevicedata',
	'clinicAdvancedfilter' : 'api/advancedSearch/clinic?&page=PAGE&per_page=PER_PAGE&sort_by=SORT_OPTION&asc=true'

});