var roleEnum = {
  ADMIN : 'ADMIN',
  PATIENT : 'PATIENT',
  HCP : 'HCP',
  ACCT_SERVICES : 'ACCT_SERVICES',
  ASSOCIATES : 'ASSOCIATES',
  HILLROM_ADMIN : 'HILLROM_ADMIN',
  CLINIC_ADMIN : 'CLINIC_ADMIN',
  ANONYMOUS : 'ANONYMOUS'
};


  var cumulativeGraphData = {  
    "cumulativeStatitics" : [
        {
            "id": 1,
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439471095802,
            "end": 1439471095802,
            "MissedTherapy": 21,
            "nonCompliance": 28,
            "settingDeviation": 10,
            "noEvent": 39
        },
    		{
            "id": 2,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439481095802,
            "end": 1439471095802,
            "MissedTherapy": 20,
            "nonCompliance": 21,
            "settingDeviation": 8,
            "noEvent": 35
        },
        {
            "id": 3,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439491095802,
            "end": 1439471095802,
            "MissedTherapy": 2,
            "nonCompliance": 8,
            "settingDeviation": 1,
            "noEvent": 9
        },
    		{
            "id": 4,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439501095802,
            "end": 1439471095802,
            "MissedTherapy": 12,
            "nonCompliance": 18,
            "settingDeviation": 15,
            "noEvent": 45
        },
        {
            "id": 5,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439511095802,
            "end": 1439471095802,
            "MissedTherapy": 23,
            "nonCompliance": 34,
            "settingDeviation": 20,
            "noEvent": 34
        },
    		{
            "id": 6,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439521095802,
            "end": 1439471095802,
            "MissedTherapy": 2,
            "nonCompliance": 2,
            "settingDeviation": 1,
            "noEvent": 3
        },
        {
            "id": 7,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439531095802,
            "end": 1439471095802,
            "MissedTherapy": 21,
            "nonCompliance": 28,
            "settingDeviation": 10,
            "noEvent": 39
        }
    ]
}

var treatmentGraphData = [  
        {
            "timeStamp": 1439471095802,
            "dailyTreatmentNumber": 7,
            "avgTreatmentDuration" : 20
        },
        {
            "timeStamp": 1439481095802,
            "dailyTreatmentNumber": 5,
            "avgTreatmentDuration" : 34
        },
        {
            "timeStamp": 1439491095802,
            "dailyTreatmentNumber": 2,
            "avgTreatmentDuration" : 23
        },
        {
            "timeStamp": 1439501095802,
            "dailyTreatmentNumber": 1,
            "avgTreatmentDuration" : 21
        },
        {
            "timeStamp": 1439511095802,
            "dailyTreatmentNumber": 6,
            "avgTreatmentDuration" : 16
        },
        {
            "timeStamp": 1439521095802,
            "dailyTreatmentNumber": 3,
            "avgTreatmentDuration" : 29
        },
        {
            "timeStamp": 1439531095802,
            "dailyTreatmentNumber": 5,
            "avgTreatmentDuration" : 5
        }
]


var HMRDayGraphData = [
        {
            "id": 1,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439471095802,
            "start": 1439471095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 12345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        },
            {
            "id": 2,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439481095802,
            "start": 1439481095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 13345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        },
        {
            "id": 3,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439491095802,
            "start": 1439491095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 14345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        },
            {
            "id": 4,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439501095802,
            "start": 1439501095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 15345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        },
        {
            "id": 5,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439511095802,
            "start": 1439511095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 16345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        },
            {
            "id": 6,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "timeStamp": 1439521095802,
            "start": 1439521095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 17345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        },
        {
            "id": 7,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "start": 1439531095802,
            "timeStamp": 1439531095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 18345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        },
            {
            "id": 8,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "start": 1439541095802,
            "timeStamp": 1439541095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 13345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        },
        {
            "id": 9,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "start": 1439551095802,
            "timeStamp": 1439551095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 14345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        },
            {
            "id": 10,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "start": 1439561095802,
            "timeStamp": 1439561095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 15345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        },
        {
            "id": 11,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "start": 1439571095802,
            "timeStamp": 1439571095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 16345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        },
            {
            "id": 12,
            "patientId": "HR2015000045",
            "userId": 156,
            "dailyTreatmentNumber": 1,
            "sessionType": "Program/Normal",
            "start": 1439581095802,
            "timeStamp": 1439581095802,
            "end": 1439471095802,
            "treatmentsPerDay": 2,
            "weightedAvgFrequency": 8.75,
            "weightedAvgPressure": 8.75,
            "secondsSpentInTreatment": 17345,
            "programmedCaughPauses": 2,
            "normalCaughPauses": 2,
            "caughPauses": 4,
            "note": {
                "id": 1,
                "createdOn": "2015-08-14",
                "noteText": "Feeling Good"
            }
        }
]

var complianceGraphData = [
  {
    "date": 1439571095802,
    "score": 89,
    "therapyData": {
        "id": 1,
        "patientId": "HR2015000045",
        "userId": 156,
        "dailyTreatmentNumber": 1,
        "sessionType": "Program/Normal",
        "start": 1439471095802,
        "end": 1439471095802,
        "treatmentsPerDay": 2,
        "weightedAvgFrequency": 8.75,
        "weightedAvgPressure": 18.75,
        "secondsSpentInTreatment": 12345,
        "programmedCaughPauses": 2,
        "normalCaughPauses": 2,
        "caughPauses": 4,
        "note": {
            "id": 1,
            "createdOn": "2015-08-14",
            "noteText": "Feeling Good"
        }
    }
  },
  {
    "date": 1439671095802,
    "score": 89,
    "therapyData": {
        "id": 1,
        "patientId": "HR2015000045",
        "userId": 156,
        "dailyTreatmentNumber": 1,
        "sessionType": "Program/Normal",
        "start": 1439471095802,
        "end": 1439471095802,
        "treatmentsPerDay": 2,
        "weightedAvgFrequency": 18.75,
        "weightedAvgPressure": 38.75,
        "secondsSpentInTreatment": 12545,
        "programmedCaughPauses": 2,
        "normalCaughPauses": 2,
        "caughPauses": 4,
        "note": {
            "id": 1,
            "createdOn": "2015-08-14",
            "noteText": "Feeling Good"
        }
    }
  },
  {
    "date": 1439771095802,
    "score": 89,
    "therapyData": {
        "id": 1,
        "patientId": "HR2015000045",
        "userId": 156,
        "dailyTreatmentNumber": 1,
        "sessionType": "Program/Normal",
        "start": 1439471095802,
        "end": 1439471095802,
        "treatmentsPerDay": 2,
        "weightedAvgFrequency": 28.75,
        "weightedAvgPressure": 2.75,
        "secondsSpentInTreatment": 12645,
        "programmedCaughPauses": 2,
        "normalCaughPauses": 2,
        "caughPauses": 4,
        "note": {
            "id": 1,
            "createdOn": "2015-08-14",
            "noteText": "Feeling Good"
        }
    }
  },
  {
    "date": 1439871095802,
    "score": 89,
    "therapyData": {
        "id": 1,
        "patientId": "HR2015000045",
        "userId": 156,
        "dailyTreatmentNumber": 1,
        "sessionType": "Program/Normal",
        "start": 1439471095802,
        "end": 1439471095802,
        "treatmentsPerDay": 2,
        "weightedAvgFrequency": 38.75,
        "weightedAvgPressure": 3.75,
        "secondsSpentInTreatment": 12745,
        "programmedCaughPauses": 2,
        "normalCaughPauses": 2,
        "caughPauses": 4,
        "note": {
            "id": 1,
            "createdOn": "2015-08-14",
            "noteText": "Feeling Good"
        }
    }
  },
  {
    "date": 1439971095802,
    "score": 89,
    "therapyData": {
        "id": 1,
        "patientId": "HR2015000045",
        "userId": 156,
        "dailyTreatmentNumber": 1,
        "sessionType": "Program/Normal",
        "start": 1439471095802,
        "end": 1439471095802,
        "treatmentsPerDay": 2,
        "weightedAvgFrequency": 48.75,
        "weightedAvgPressure": 48.75,
        "secondsSpentInTreatment": 13345,
        "programmedCaughPauses": 2,
        "normalCaughPauses": 2,
        "caughPauses": 4,
        "note": {
            "id": 1,
            "createdOn": "2015-08-14",
            "noteText": "Feeling Good"
        }
    }
  }
]
 

var associatedClinics = 
{
    "clinics": [
        {
            "id": "HR2015000000",
            "name": "LifeLine Hospitals Main",
            "address": "Sector-58",
            "zipcode": 23651,
            "city": "Noida",
            "state": "UT",
            "phoneNumber": "2242313112",
            "faxNumber": "1131313131",
            "hillromId": "HR2015000132",
            "clinicAdminId": 9,
            "parentClinic": null,
            "deleted": true,
            "parent": true,
            "createdAt": 1438688454000
        },
        {
            "id": "HR2015000001",
            "name": "LifeLine Hospitals Child",
            "address": "Sector 78",
            "zipcode": 65412,
            "city": "Gurgaon",
            "state": "UT",
            "phoneNumber": "2143464311",
            "faxNumber": "3134648431",
            "hillromId": "HR201500123",
            "clinicAdminId": 9,
            "parentClinic": {
                "id": "HR2015000000",
                "name": "LifeLine Hospitals Main",
                "address": "Sector-58",
                "zipcode": 23651,
                "city": "Noida",
                "state": "UT",
                "phoneNumber": "2242313112",
                "faxNumber": "1131313131",
                "hillromId": "HR2015000132",
                "clinicAdminId": 9,
                "parentClinic": null,
                "deleted": true,
                "parent": true,
                "createdAt": 1438688454000
            },
            "deleted": false,
            "parent": false,
            "createdAt": 1438688532000
        },
        {
            "id": "HR2015000002",
            "name": "LifeLine Hospitals Main",
            "address": "Sector-58",
            "zipcode": 23651,
            "city": "Noida",
            "state": "UT",
            "phoneNumber": "2242313112",
            "faxNumber": "1131313131",
            "hillromId": "HR2015000132",
            "clinicAdminId": 9,
            "parentClinic": null,
            "deleted": true,
            "parent": true,
            "createdAt": 1438688454000
        },
        {
            "id": "HR2015000003",
            "name": "LifeLine Hospitals Child",
            "address": "Sector 78",
            "zipcode": 65412,
            "city": "Gurgaon",
            "state": "UT",
            "phoneNumber": "2143464311",
            "faxNumber": "3134648431",
            "hillromId": "HR201500123",
            "clinicAdminId": 9,
            "parentClinic": {
                "id": "HR2015000000",
                "name": "LifeLine Hospitals Main",
                "address": "Sector-58",
                "zipcode": 23651,
                "city": "Noida",
                "state": "UT",
                "phoneNumber": "2242313112",
                "faxNumber": "1131313131",
                "hillromId": "HR2015000132",
                "clinicAdminId": 9,
                "parentClinic": null,
                "deleted": true,
                "parent": true,
                "createdAt": 1438688454000
            },
            "deleted": false,
            "parent": false,
            "createdAt": 1438688532000
        },
        {
            "id": "HR2015000004",
            "name": "LifeLine Hospitals Main",
            "address": "Sector-58",
            "zipcode": 23651,
            "city": "Noida",
            "state": "UT",
            "phoneNumber": "2242313112",
            "faxNumber": "1131313131",
            "hillromId": "HR2015000132",
            "clinicAdminId": 9,
            "parentClinic": null,
            "deleted": true,
            "parent": true,
            "createdAt": 1438688454000
        },
        {
            "id": "HR2015000005",
            "name": "LifeLine Hospitals Child",
            "address": "Sector 78",
            "zipcode": 65412,
            "city": "Gurgaon",
            "state": "UT",
            "phoneNumber": "2143464311",
            "faxNumber": "3134648431",
            "hillromId": "HR201500123",
            "clinicAdminId": 9,
            "parentClinic": {
                "id": "HR2015000000",
                "name": "LifeLine Hospitals Main",
                "address": "Sector-58",
                "zipcode": 23651,
                "city": "Noida",
                "state": "UT",
                "phoneNumber": "2242313112",
                "faxNumber": "1131313131",
                "hillromId": "HR2015000132",
                "clinicAdminId": 9,
                "parentClinic": null,
                "deleted": true,
                "parent": true,
                "createdAt": 1438688454000
            },
            "deleted": false,
            "parent": false,
            "createdAt": 1438688532000
        },
    ],
    "message": "Associated clinics with patient fetched successfully."
}
var careGivers = {
    "caregivers": [
        {
            "id": 16,
            "title": "Mr.",
            "firstName": "Nagendra",
            "middleName": "",
            "lastName": "Nag",
            "email": "rishabhjain+CG_hcp@neevtech.com",
            "gender": null,
            "zipcode": 56236,
            "activated": true,
            "langKey": "en",
            "resetKey": "66945600887392212927",
            "resetDate": 1438577209000,
            "termsConditionAccepted": true,
            "termsConditionAcceptedDate": 1438576050000,
            "authorities": [
                {
                    "name": "HCP"
                }
            ],
            "deleted": true,
            "lastLoggedInAt": 1438576050000,
            "dob": null,
            "hillromId": null,
            "speciality": "Optho",
            "credentials": "123456",
            "primaryPhone": "7654123002",
            "mobilePhone": "8657416856",
            "faxNumber": "6498562305",
            "address": "Dickenson Road",
            "city": "Blr",
            "state": "AL",
            "npiNumber": "986532",
            "clinics": []
        },
        {
            "id": 16,
            "title": "Mr.",
            "firstName": "Nagendra",
            "middleName": "",
            "lastName": "Nag",
            "email": "rishabhjain+CG_hcp@neevtech.com",
            "gender": null,
            "zipcode": 56236,
            "activated": true,
            "langKey": "en",
            "resetKey": "66945600887392212927",
            "resetDate": 1438577209000,
            "termsConditionAccepted": true,
            "termsConditionAcceptedDate": 1438576050000,
            "authorities": [
                {
                    "name": "HCP"
                }
            ],
            "deleted": true,
            "lastLoggedInAt": 1438576050000,
            "dob": null,
            "hillromId": null,
            "speciality": "Optho",
            "credentials": "123456",
            "primaryPhone": "7654123002",
            "mobilePhone": "8657416856",
            "faxNumber": "6498562305",
            "address": "Dickenson Road",
            "city": "Blr",
            "state": "AL",
            "npiNumber": "986532",
            "clinics": []
        }
    ],
    "message": "Caregiver Users fetched successfully."
}
var caregiver = {
    "caregiver": {
        "userRole": "CARE_GIVER",
        "relationshipLabel": "PARENT",
        "patient": {
            "id": "HR2015000001",
            "hillromId": "HR000121",
            "hubId": null,
            "serialNumber": "105DN00789649137",
            "bluetoothId": "BT 2552472",
            "title": "Ms.",
            "firstName": "Hermione",
            "middleName": null,
            "lastName": "Grenger",
            "dob": "1990-06-30",
            "email": "hermione@test.com",
            "gender": "Female",
            "langKey": "fr",
            "address": null,
            "zipcode": 12365,
            "city": null,
            "state": "AZ",
            "expired": false,
            "expiredDate": null,
            "webLoginCreated": true,
            "primaryPhone": "2452345614",
            "mobilePhone": "1534646123"
        },
        "user": {
            "id": 17,
            "title": "Dr",
            "firstName": "Manipal",
            "middleName": "Hompi",
            "lastName": "Ayer",
            "email": "rishabhjain+CG_hcp3@neevtech.com",
            "gender": null,
            "zipcode": 560009,
            "activated": false,
            "langKey": "en",
            "resetKey": null,
            "resetDate": null,
            "termsConditionAccepted": false,
            "termsConditionAcceptedDate": null,
            "authorities": [
                {
                    "name": "CARE_GIVER"
                }
            ],
            "deleted": false,
            "lastLoggedInAt": null,
            "dob": null,
            "hillromId": null,
            "speciality": null,
            "credentials": null,
            "primaryPhone": null,
            "mobilePhone": null,
            "faxNumber": null,
            "address": "Old Airport Road",
            "city": "Bangalore",
            "state": "Karnataka",
            "npiNumber": null,
            "clinics": null
        }
    },
    "message": "Caregiver User fetched successfully."
}

var adherenceScores = [{
        "from": "12/07/2015 00:33:11",
        "to": null,
        "protcols": [{
            "id": "HR2015000033",
            "type": "Custom",
            "treatmentsPerDay": 2,
            "minMinutesPerTreatment": 5,
            "treatmentLabel": "point1",
            "minFrequency": 19,
            "maxFrequency": null,
            "minPressure": 6,
            "maxPressure": null
        }, {
            "id": "HR2015000033",
            "type": "Custom",
            "treatmentsPerDay": 2,
            "minMinutesPerTreatment": 5,
            "treatmentLabel": "point2",
            "minFrequency": 19,
            "maxFrequency": null,
            "minPressure": 6,
            "maxPressure": null
        }, {
            "id": "HR2015000033",
            "type": "Custom",
            "treatmentsPerDay": 2,
            "minMinutesPerTreatment": 5,
            "treatmentLabel": "point3",
            "minFrequency": 19,
            "maxFrequency": null,
            "minPressure": 6,
            "maxPressure": null
        }, {
            "id": "HR2015000033",
            "type": "Custom",
            "treatmentsPerDay": 2,
            "minMinutesPerTreatment": 5,
            "treatmentLabel": "point4",
            "minFrequency": 19,
            "maxFrequency": null,
            "minPressure": 6,
            "maxPressure": null
        }],
        "adherenceTrends": [{
            "updatedScore": 0,
            "date": "01/29/2016",
            "notificationPoints": {
                "HMR Non-Adherence": 0
            }
        }, {
            "updatedScore": 0,
            "date": "01/30/2016",
            "notificationPoints": {
                "HMR Non-Adherence": 0
            }
        }, {
            "updatedScore": 0,
            "date": "01/31/2016",
            "notificationPoints": {
                "HMR Non-Adherence": 0
            }
        }, {
            "updatedScore": 0,
            "date": "02/01/2016",
            "notificationPoints": {
                "HMR Non-Adherence": 0
            }
        }, {
            "updatedScore": 0,
            "date": "02/02/2016",
            "notificationPoints": {
                "HMR Non-Adherence": 0
            }
        }, {
            "updatedScore": 0,
            "date": "02/03/2016",
            "notificationPoints": {
                "HMR Non-Adherence": 0
            }
        }]
    }, {
        "from": "12/07/2015 00:33:11",
        "to": null,
        "protcols": [{
            "id": "HR2015000033",
            "type": "Custom",
            "treatmentsPerDay": 2,
            "minMinutesPerTreatment": 5,
            "treatmentLabel": "point1",
            "minFrequency": 19,
            "maxFrequency": null,
            "minPressure": 6,
            "maxPressure": null
        }, {
            "id": "HR2015000033",
            "type": "Custom",
            "treatmentsPerDay": 2,
            "minMinutesPerTreatment": 5,
            "treatmentLabel": "point2",
            "minFrequency": 19,
            "maxFrequency": null,
            "minPressure": 6,
            "maxPressure": null
        }, {
            "id": "HR2015000033",
            "type": "Custom",
            "treatmentsPerDay": 2,
            "minMinutesPerTreatment": 5,
            "treatmentLabel": "point3",
            "minFrequency": 19,
            "maxFrequency": null,
            "minPressure": 6,
            "maxPressure": null
        }, {
            "id": "HR2015000033",
            "type": "Custom",
            "treatmentsPerDay": 2,
            "minMinutesPerTreatment": 5,
            "treatmentLabel": "point4",
            "minFrequency": 19,
            "maxFrequency": null,
            "minPressure": 6,
            "maxPressure": null
        }],
        "adherenceTrends": [{
            "updatedScore": 0,
            "date": "01/29/2016",
            "notificationPoints": {
                "HMR Non-Adherence": 0
            }
        }, {
            "updatedScore": 0,
            "date": "01/30/2016",
            "notificationPoints": {
                "HMR Non-Adherence": 0
            }
        }, {
            "updatedScore": 0,
            "date": "01/31/2016",
            "notificationPoints": {
                "HMR Non-Adherence": 0
            }
        }, {
            "updatedScore": 0,
            "date": "02/01/2016",
            "notificationPoints": {
                "HMR Non-Adherence": 0
            }
        }, {
            "updatedScore": 0,
            "date": "02/02/2016",
            "notificationPoints": {
                "HMR Non-Adherence": 0
            }
        }, {
            "updatedScore": 0,
            "date": "02/03/2016",
            "notificationPoints": {
            "HMR Non-Adherence": 0
            }
        }]
    }];

var loginAnalyticsData= {
    "dayData":
    {
        "xAxis": {
            "type": "categories",
            "categories": ['Patient', 'HCP', 'Clinic Admin', 'Caregiver'] 
        },
        "series": [{
            "name": "No. of logins",
            "data":[
                {"y": 10, "color": "#ff9829"},
                {"y": 20, "color": "#35978f"},
                {"y": 15, "color": "#4d95c4"},
                {"y": 22, "color": "#8b6baf"}
            ]
        }] 
    },
    "weekData":
    {
        "xAxis": {
            "type": "categories",
            "categories": ['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday', 'Friday', 'Saturday'] 
        },
        "series": [
            {
            "name": "Patient",
            "color": "#ff9829",
            "data":[
                {"y": 10},{"y": 10},{"y": 10},{"y": 10},
                {"y": 20},{"y": 10},{"y": 10}
                ]
            },
            {
            "name": "HCP",
            "color": "#35978f",
            "data":[
                {"y": 30},{"y": 20},{"y": 10},{"y": 15},
                {"y": 20},{"y": 10},{"y": 10}
                ]
            },
            {
            "name": "Clinic Admin",
            "color": "#4d95c4",
            "data":[
                {"y": 10},{"y": 10},{"y": 10},{"y": 10},
                {"y": 20},{"y": 10},{"y": 10}
                ]
            },
            {
            "name": "Caregiver",
            "color": "#8b6baf",
            "data":[
                {"y": 10},{"y": 10},{"y": 10},{"y": 10},
                {"y": 20},{"y": 10},{"y": 10}
                ]
            }
        ] 
    },
    "monthData":
    {
        "xAxis": {
            "type": "categories",
            "categories": [ 'Week1 (23-Jan-16 to 29-Jan-16)','Week2 (30-Jan-16 to 05-Feb-16)', 'Week3 (06-Feb-16 to 12-Feb-16)', 'Week4 (13-Feb-16 to 19-Feb-16)', 'Week5 (20-Feb-16 to 26-Feb-16)'] 
        },
        "series": [
            {
            "name": "Patient",
            "color": "#ff9829",
            "data":[
                {"y": 10},{"y": 10},{"y": 10},{"y": 10},{"y": 10}
                ]
            },
            {
            "name": "HCP",
            "color": "#35978f",
            "data":[
                {"y": 30},{"y": 20},{"y": 10},{"y": 15},{"y": 10}
                ]
            },
            {
            "name": "Clinic Admin",
            "color": "#4d95c4",
            "data":[
                {"y": 10},{"y": 10},{"y": 10},{"y": 10},{"y": 10}
                ]
            },
            {
            "name": "Caregiver",
            "color": "#8b6baf",
            "data":[
                {"y": 10},{"y": 10},{"y": 10},{"y": 10},{"y": 10}
                ]
            }
        ] 
    },

    "yearData":
    {
        "xAxis": {
            "type": "categories",
            "categories": ['January', 'February', 'March', 'April','May', 'June', 'July', 'August','September', 'October', 'November', 'December'] 
        },
        "series": [
            {
            "name": "Patient",
            "color": "#ff9829",
            "data":[
                {"y": 10},{"y": 10},{"y": 10},{"y": 10},
                {"y": 20},{"y": 10},{"y": 10},{"y": 10},
                {"y": 15},{"y": 10},{"y": 10},{"y": 10}
                ]
            },
            {
            "name": "HCP",
            "color": "#35978f",
            "data":[
                {"y": 30},{"y": 20},{"y": 10},{"y": 15},
                {"y": 20},{"y": 10},{"y": 10},{"y": 10},
                {"y": 15},{"y": 10},{"y": 10},{"y": 10}
                ]
            },
            {
            "name": "Clinic Admin",
            "color": "#4d95c4",
            "data":[
                {"y": 10},{"y": 10},{"y": 10},{"y": 10},
                {"y": 20},{"y": 10},{"y": 10},{"y": 10},
                {"y": 15},{"y": 10},{"y": 10},{"y": 10}
                ]
            },
            {
            "name": "Caregiver",
            "color": "#8b6baf",
            "data":[
                {"y": 10},{"y": 10},{"y": 10},{"y": 10},
                {"y": 20},{"y": 10},{"y": 10},{"y": 10},
                {"y": 15},{"y": 10},{"y": 10},{"y": 10}
                ]
            }
        ] 
    },
    "customDateRangeData":
    {
        "xAxis": {
            "type": "datetime"
         },
        "series": [
            {
            "name": "Patient",
            "color": "#ff9829",
            "data":[
                {"x": "11/13/2015 10:57:35","y": 13},
                {"x": "11/14/2015 10:57:35","y": 17},
                {"x": "11/15/2015 10:57:35","y": 19},
                {"x": "11/16/2015 10:57:35","y": 10},
                {"x": "11/17/2015 10:57:35","y": 10},
                {"x": "11/18/2015 10:57:35","y": 10},
                {"x": "11/19/2015 10:57:35","y": 10},
                {"x": "11/20/2015 10:57:35","y": 10},
                {"x": "11/21/2015 10:57:35","y": 10},
                {"x": "11/22/2015 10:57:35","y": 10},
                {"x": "11/23/2015 10:57:35","y": 10},
                {"x": "11/24/2015 10:57:35","y": 10},
                {"x": "11/25/2015 10:57:35","y": 10},
                {"x": "11/26/2015 10:57:35","y": 10},
                {"x": "11/27/2015 10:57:35","y": 10},
                {"x": "11/28/2015 10:57:35","y": 10},
                {"x": "11/29/2015 10:57:35","y": 10},
                {"x": "11/30/2015 10:57:35","y": 10},
                {"x": "01/01/2016 10:57:35","y": 10},
                {"x": "01/02/2016 10:57:35","y": 10},
                {"x": "01/03/2016 10:57:35","y": 10},
                {"x": "01/04/2016 10:57:35","y": 10},
                {"x": "01/05/2016 10:57:35","y": 10},
                {"x": "01/06/2016 10:57:35","y": 10},
                {"x": "01/07/2016 10:57:35","y": 10},
                {"x": "01/08/2016 10:57:35","y": 10},
                {"x": "01/09/2016 10:57:35","y": 10},
                {"x": "01/10/2016 10:57:35","y": 10},
                {"x": "01/11/2016 10:57:35","y": 10},
                {"x": "01/12/2016 10:57:35","y": 10}
                ]
            },
            {
            "name": "HCP",
            "color": "#35978f",
            "data":[
                {"x": "11/13/2015 10:57:35","y": 10},
                {"x": "11/14/2015 10:57:35","y": 20},
                {"x": "11/15/2015 10:57:35","y": 30},
                {"x": "11/16/2015 10:57:35","y": 15},
                {"x": "11/17/2015 10:57:35","y": 15},
                {"x": "11/18/2015 10:57:35","y": 16},
                {"x": "11/19/2015 10:57:35","y": 17},
                {"x": "11/20/2015 10:57:35","y": 18},
                {"x": "11/21/2015 10:57:35","y": 10},
                {"x": "11/22/2015 10:57:35","y": 10},
                {"x": "11/23/2015 10:57:35","y": 10},
                {"x": "11/24/2015 10:57:35","y": 10},
                {"x": "11/25/2015 10:57:35","y": 10},
                {"x": "11/26/2015 10:57:35","y": 10},
                {"x": "11/27/2015 10:57:35","y": 10},
                {"x": "11/28/2015 10:57:35","y": 15},
                {"x": "11/29/2015 10:57:35","y": 12},
                {"x": "11/30/2015 10:57:35","y": 10},
                {"x": "01/01/2016 10:57:35","y": 10},
                {"x": "01/02/2016 10:57:35","y": 10},
                {"x": "01/03/2016 10:57:35","y": 10},
                {"x": "01/04/2016 10:57:35","y": 3},
                {"x": "01/05/2016 10:57:35","y": 10},
                {"x": "01/06/2016 10:57:35","y": 10},
                {"x": "01/07/2016 10:57:35","y": 10},
                {"x": "01/08/2016 10:57:35","y": 0},
                {"x": "01/09/2016 10:57:35","y": 10},
                {"x": "01/10/2016 10:57:35","y": 10},
                {"x": "01/11/2016 10:57:35","y": 10},
                {"x": "01/12/2016 10:57:35","y": 10}
                ]
            },
            {
            "name": "Clinic Admin",
            "color": "#4d95c4",
            "data":[
                {"x": "11/13/2015 10:57:35","y": 10},
                {"x": "11/14/2015 10:57:35","y": 10},
                {"x": "11/15/2015 10:57:35","y": 11},
                {"x": "11/16/2015 10:57:35","y": 10},
                {"x": "11/17/2015 10:57:35","y": 10},
                {"x": "11/18/2015 10:57:35","y": 10},
                {"x": "11/19/2015 10:57:35","y": 10},
                {"x": "11/20/2015 10:57:35","y": 10},
                {"x": "11/21/2015 10:57:35","y": 10},
                {"x": "11/22/2015 10:57:35","y": 10},
                {"x": "11/23/2015 10:57:35","y": 10},
                {"x": "11/24/2015 10:57:35","y": 0},
                {"x": "11/25/2015 10:57:35","y": 10},
                {"x": "11/26/2015 10:57:35","y": 10},
                {"x": "11/27/2015 10:57:35","y": 8},
                {"x": "11/28/2015 10:57:35","y": 10},
                {"x": "11/29/2015 10:57:35","y": 10},
                {"x": "11/30/2015 10:57:35","y": 10},
                {"x": "01/01/2016 10:57:35","y": 10},
                {"x": "01/02/2016 10:57:35","y": 10},
                {"x": "01/03/2016 10:57:35","y": 10},
                {"x": "01/04/2016 10:57:35","y": 10},
                {"x": "01/05/2016 10:57:35","y": 10},
                {"x": "01/06/2016 10:57:35","y": 10},
                {"x": "01/07/2016 10:57:35","y": 10},
                {"x": "01/08/2016 10:57:35","y": 10},
                {"x": "01/09/2016 10:57:35","y": 0},
                {"x": "01/10/2016 10:57:35","y": 10},
                {"x": "01/11/2016 10:57:35","y": 10},
                {"x": "01/12/2016 10:57:35","y": 10}
                ]
            },
            {
            "name": "Caregiver",
            "color": "#8b6baf",
            "data":[
                {"x": "11/13/2015 10:57:35","y": 10},
                {"x": "11/14/2015 10:57:35","y": 10},
                {"x": "11/15/2015 10:57:35","y": 10},
                {"x": "11/16/2015 10:57:35","y": 0},
                {"x": "11/17/2015 10:57:35","y": 10},
                {"x": "11/18/2015 10:57:35","y": 10},
                {"x": "11/19/2015 10:57:35","y": 10},
                {"x": "11/20/2015 10:57:35","y": 10},
                {"x": "11/21/2015 10:57:35","y": 10},
                {"x": "11/22/2015 10:57:35","y": 10},
                {"x": "11/23/2015 10:57:35","y": 10},
                {"x": "11/24/2015 10:57:35","y": 10},
                {"x": "11/25/2015 10:57:35","y": 10},
                {"x": "11/26/2015 10:57:35","y": 0},
                {"x": "11/27/2015 10:57:35","y": 10},
                {"x": "11/28/2015 10:57:35","y": 10},
                {"x": "11/29/2015 10:57:35","y": 10},
                {"x": "11/30/2015 10:57:35","y": 10},
                {"x": "01/01/2016 10:57:35","y": 10},
                {"x": "01/02/2016 10:57:35","y": 10},
                {"x": "01/03/2016 10:57:35","y": 10},
                {"x": "01/04/2016 10:57:35","y": 10},
                {"x": "01/05/2016 10:57:35","y": 10},
                {"x": "01/06/2016 10:57:35","y": 10},
                {"x": "01/07/2016 10:57:35","y": 10},
                {"x": "01/08/2016 10:57:35","y": 10},
                {"x": "01/09/2016 10:57:35","y": 10},
                {"x": "01/10/2016 10:57:35","y": 10},
                {"x": "01/11/2016 10:57:35","y": 10},
                {"x": "01/12/2016 10:57:35","y": 10}
                ]
            }
        ] 
    }
};
