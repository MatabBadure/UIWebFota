'use strict';

angular.module('hillromvestApp')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('entity', {
                abstract: true,
                parent: 'site'
              })
            .state('admin', {
                parent: 'entity',
                url: '/admin',
                abstract: true,
            })
            .state('associate', {
                parent: 'entity',
                url: '/associate',
                abstract: true,
            })
             .state('customerservice', {
                parent: 'entity',
                url: '/customerservice',
                abstract: true,
            })
              .state('RnDadmin', {
                parent: 'entity',
                url: '/RnDadmin',
                abstract: true,
            })
            // creating this base route and view to setup nested views for Patients
            .state('patient-dashboard', {
               // parent: 'entity',
                url:'/patient',
                views:{
                    'content':{
                    templateUrl:'scripts/modules/patient/graph/views/patient-section.html'
            }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
             .state('patient-dashboard-profile', {
               // parent: 'entity',
                url:'/patient',
                views:{
                    'content':{
                    templateUrl:'scripts/modules/patient/profile/profile-tabs/patient-profile-section.html'
                // defining the empty controller here coz I can't figure out where to create this controller
            }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('clinic-admin-user-profile', {               
                url:'/clinicadmin-profile',
                params:  {clinicId: null},
                parent: 'entity',
                abstract: true,                
            })
            .state('hcp-user-profile', {               
                url:'/hcp-profile',
                params: {"clinicId": null},
                parent: 'entity',
                abstract: true,   
            })
            .state('caregiver-dashboard', {
                url:'/caregiver',
                views:{
                    'content':{
                    templateUrl:'scripts/modules/caregiver/graph/views/caregiver-section.html',
                    controller: 'caregiverNavbarController'
            }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
                
            })

            .state('caregiver-dashboard-profile', {
                url:'/caregiver-p',
                views:{
                    'content':{
                    templateUrl:'scripts/modules/caregiver/profile/views/profile-section.html',
                    controller: 'caregiverNavbarController'
            }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
                
            })

            .state('hcp-dashboard', {
                parent: 'entity',
                url:'/hcp',
                abstract: true,
            })
            .state('clinicadmin-dashboard', {
                parent: 'entity',
                url:'/clinicadmin',
                abstract: true,
            })
            .state('patientUser', {
                parent: 'admin',
                url: '/patients?clinicIds',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.page-title.patients'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/views/list/view.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('associatedPatients', {
                parent: 'admin',
                url: '/patients',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/views/list/view.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientNew', {
                parent: 'patientUser',
                url: '/new',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/views/create-edit/view.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientEdit', {
                parent: 'patientUser',
                url: '/{patientId}',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/views/create-edit/view.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientEditClinics', {
                parent: 'patientUser',
                url: '/{patientId}/pclinics',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/views/clinic-edit/view.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientHcpAssociation', {
                parent: 'patientUser',
                url: '/{patientId}/hcp',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/views/hcp/view.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientOverview', {
                parent: 'patientUser',
                url: '/{patientId}/overview',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.page-title.overview'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/overview/patient-details.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('hcppatientOverview', {
                parent: 'hcppatientList',
                url: '/overview',
                data: {
                    roles: [],
                    pageTitle: 'patient.page-title.overview'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/patient/directives/patient-details.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientDemographic', {
                parent: 'patientUser',
                url: '/{patientId}/demographic',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.page-title.patient-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/patient-demographics/detail.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('hcppatientDemographic', {
                parent: 'hcppatientList',
                url: '/demographic',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'patient.page-title.patient-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/patient/views/patientdemographics.html',
                        controller: 'hcpPatientController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientDemographicEdit', {
                parent: 'patientUser',
                url: '/{patientId}/demographicedit',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.page-title.patient-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/patient-demographics/edit.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientClinics', {
                parent: 'patientUser',
                url: '/{patientId}/clinicInfo',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.page-title.clinic-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/clinic/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('hcppatientClinics', {
                parent: 'hcppatientList',
                url: '/clinicInfo',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'patient.page-title.clinic-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/patient/views/clinicinformation.html',
                        controller: 'hcpPatientController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('hcppatientProtocol', {
                parent: 'hcppatientList',
                url: '/protocol-device',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'patient.page-title.careplan-device'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/patient/views/deviceprotocol.html',
                        controller: 'hcpPatientController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('hcppatientCraegiver', {
                parent: 'hcppatientList',
                url: '/caregivers',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'patient.page-title.caregiver-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/patient/views/caregiverinformation.html',
                        controller: 'hcpPatientController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })


            .state('patientProtocol', {
                parent: 'patientUser',
                url: '/{patientId}/protocol-device',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.page-title.careplan-device'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/device-protocol/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientAddDevice', {
                parent: 'patientProtocol',
                url: '/addDevice',
                params:{device: null},
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/device-protocol/add-device.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientAddProtocol', {
                parent: 'patientProtocol',
                url: '/{protocolDevType}/addProtocol',
                params: {protocol: null},
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/device-protocol/add-protocol.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientCraegiver', {
                parent: 'patientUser',
                url: '/{patientId}/caregiver',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.page-title.caregiver-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/caregiver/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hillRomUser', {
                parent: 'admin',
                url: '/hillRomUsers',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'user.page-title.users'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/hill-rom-user/views/list/view.html',
                        controller: 'UsersController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hillRomUser');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hillRomUserNew', {
                parent: 'hillRomUser',
                url: '/new',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/hill-rom-user/views/create-edit/view.html',
                        controller: 'UsersController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hillRomUser');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hillRomUserEdit', {
                parent: 'hillRomUser',
                url: '/{userId}',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'user.page-title.user'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/hill-rom-user/views/create-edit/view.html',
                        controller: 'UsersController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hillRomUser');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hcpUser', {
                parent: 'admin',
                url: '/hcpUsers?clinicIds',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'doctor.page-title.hcps'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/hcp/views/list/view.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hcpNew', {
                parent: 'hcpUser',
                url: '/new',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/hcp/views/create-edit/view.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hcpEdit', {
                parent: 'hcpUser',
                url: '/{doctorId}/hcpEdit',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'doctor.page-title.hcp-update'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/hcp/views/create-edit/view.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hcpProfile', {
                parent: 'hcpUser',
                url: '/{doctorId}/hcpProfile',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'doctor.page-title.hcp-profile'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/hcp/directives/hcp-info/overview/overview.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('associatedClinic', {
                parent: 'hcpUser',
                url: '/{doctorId}/associatedClinic',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'doctor.page-title.associated-clinics'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/hcp/directives/hcp-info/associated-clinic/clinic-list.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicUser', {
              parent: 'admin',
              url: '/clinics',
              data: {
                roles: ['ADMIN'],
                pageTitle: 'clinic.page-title.clinics'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/list/list.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

            .state('clinicNew', {
              parent: 'clinicUser',
              url: '/new?parentId',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'clinic.title'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/create-edit/create.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

            .state('clinicEdit', {
              parent: 'clinicUser',
              url: '/{clinicId}',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'clinic.title'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/create-edit/create.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

            .state('clinicAssociatedHCP', {
              parent: 'clinicEdit',
              url: '/associatedHCP',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'clinic.page-title.associated-HCPs'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/clinic-info/hcp/associatedhcp.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

            .state('clinicAssociatedPatients', {
              parent: 'clinicEdit',
              url: '/associatedPatients/{filter}',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'clinic.page-title.associated-patients'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/clinic-info/patients/associatedpatients.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

            .state('clinicAdmin', {
              parent: 'clinicEdit',
              url: '/clinicadmin-clinic-edit',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'clinic.page-title.clinic-admin'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/clinic-info/clinic-admin/clinic-admin.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

            .state('patient', {
                parent: 'entity',
                url: '/patient',
                abstract: true,
            })
            .state('patientCraegiverAdd', {
                parent: 'patientCraegiver',
                url: '/caregiver-add',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/caregiver/create.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientCraegiverEdit', {
                parent: 'patientCraegiver',
                url: '/{caregiverId}/caregiver-edit',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/caregiver/create.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('graphView', {
                url: '/graphs',
                data: {
                    roles: [],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/patient/graph/views/HMR-graph.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientdashboard', {
                parent: 'patient-dashboard',
                url: '/patient-dashboard',
                data: {
                    roles: ['PATIENT'],
                    pageTitle: 'patient.page-title.my-dashboard'
                },
                views: {
                    'patient-view': {
                        templateUrl: 'scripts/modules/patient/graph/views/dashboard-landing.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientdashboardCaregiver', {
                parent: 'patient-dashboard',
                url: '/caregiver',
                data: {
                    roles: ['ADMIN','PATIENT'],
                    pageTitle: 'patient.page-title.caregivers'
                },
                views: {
                    'patient-view': {
                        templateUrl: 'scripts/modules/patient/graph/views/caregiverlist.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientdashboardCaregiverAdd', {
                parent: 'patient-dashboard',
                url: '/caregiver-add',
                data: {
                    roles: ['ADMIN','PATIENT'],
                    pageTitle: 'patient.page-title.add-caregiver'
                },
                views: {
                    'patient-view': {
                        templateUrl: 'scripts/modules/patient/graph/views/caregiveradd.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientdashboardCaregiverEdit', {
                parent: 'patient-dashboard',
                url: '/{caregiverId}/caregiver-edit',
                data: {
                    roles: ['ADMIN','PATIENT'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'patient-view': {
                        templateUrl: 'scripts/modules/patient/graph/views/caregiveradd.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientdashboardDeviceProtocol', {
                parent: 'patient-dashboard',
                url: '/device-protocol',
                data: {
                    roles: ['ADMIN','PATIENT'],
                    pageTitle: 'patient.page-title.careplan-device'
                },
                views: {
                    'patient-view': {
                        templateUrl: 'scripts/modules/patient/graph/views/deviceprotocol.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientdashboardClinicHCP', {
                parent: 'patient-dashboard',
                url: '/clinic-hcp',
                data: {
                    roles: ['ADMIN','PATIENT'],
                    pageTitle: 'patient.page-title.clinics-hcps'
                },
                views: {
                    'patient-view': {
                        templateUrl: 'scripts/modules/patient/graph/views/clinichcp.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientProfile', {
                parent: 'patient-dashboard',
                url: '/p-profile',
                data: {
                    roles: ['PATIENT'],
                    pageTitle: 'patient.page-title.patient-info'
                },
                views: {
                    'patient-view': {
                        templateUrl: 'scripts/modules/patient/profile/profile-tabs/my-profile.html',
                        controller: 'patientprofileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('adminProfile', {
                parent: 'admin',
                url: '/profile',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'profile.page-title.my-profile'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/profile/profile-tabs/my-profile.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

        /*
        below code for charger dummy data (Suggested by raghy)
        */
            .state('charger', {
                parent: 'admin',
                url: '/sandbox/charger',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'profile.page-title.sandbox'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/profile/profile-tabs/charger.html',
                        controller: 'chargercontroller'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('optimus', {
                parent: 'admin',
                url: '/sandbox/optimus',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'profile.page-title.sandbox'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/profile/profile-tabs/optimus.html',
                        controller: 'chargercontroller'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('editAdminProfile', {
                parent: 'adminProfile',
                url: '/update',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/profile/profile-tabs/edit-my-profile.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })

            .state('adminUpdatePassword', {
                parent: 'admin',
                url: '/updatepassword',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'profile.page-title.update-password'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/profile/profile-tabs/update-password.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })

            .state('profilePassword', {
                parent: 'profile',
                url: '/password',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/profile/views/profile/password.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time 
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicProfile', {
              parent: 'clinicUser',
              url: '/{clinicId}/clinic-info',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'clinic.page-title.clinic-profile'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/clinic-profile/profile.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('patientResetPassword', {
                parent: 'patient-dashboard-profile',
                url: '/p-reset',
                data: {
                    roles: ['PATIENT'],
                    pageTitle: 'profile.page-title.profile-settings'
                },
                views: {
                    'patient-profile-view': {
                        templateUrl: 'scripts/modules/patient/profile/profile-tabs/update-password.html',
                        controller: 'patientprofileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientSettings', {
                parent: 'patient-dashboard-profile',
                url: '/notification-settings',
                data: {
                    roles: ['PATIENT'],
                    pageTitle: 'profile.page-title.notification-settings'
                },
                views: {
                    'patient-profile-view': {
                        templateUrl: 'scripts/modules/patient/profile/profile-tabs/settings.html',
                        controller: 'patientprofileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('pageUnderConstruction', {
                parent: 'site',
                url: '/pageconstruction',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/dummyPages/view.html',
                        controller: 'LogoutController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('error');
                        return $translate.refresh();
                    }]
                }
            })

            .state('hcpdashboard', {
                parent: 'hcp-dashboard',
                url: '/hcp-dashboard/{clinicId}',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'doctor.page-title.my-dashboard'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/graph/views/dashboard-landing.html',
                        controller: 'hcpGraphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('HCPGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hcppatientdashboard', {
                parent: 'hcp-dashboard',
                url: '/{clinicId}/hcp-patients-view/{filter}',
                params: {"clinicId": null},                
                data: {
                    roles: ['HCP'],
                    pageTitle: 'patient.page-title.patients'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/patient/directives/list.html',
                        controller: 'hcpPatientController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hcppatientList', {
                 url:'/hcp-patient/{clinicId}/{patientId}',
                 views:{
                  'content':{
                    templateUrl:'scripts/modules/hcp/patient/directives/list.html',
                    controller: 'hcpPatientController'
                  }
                },
                resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                  }],
                  authorize: ['Auth',
                  function(Auth) {
                    return Auth.authorize(false);
                  }
                  ]
                }
              })

            .state('hcpDashboardProfile', {
                parent: 'hcp-dashboard',
                url: '/hcp-profile',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'hcp.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/profile/views/my-profile.html',
                        controller: 'hcpProfileController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            
            .state('hcpUserProfile', {
                parent: 'hcp-user-profile',
                url: '/{clinicId}/profile',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'profile.page-title.my-profile'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/profile/profile-tabs/my-profile.html',
                        controller: 'hcpProfileController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('hcpUpdatePassword', {
                parent: 'hcp-user-profile',
                url: '/{clinicId}/updatepassword',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'profile.page-title.update-password'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/profile/profile-tabs/update-password.html',
                        controller: 'hcpProfileController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })

            .state('editHCPProfile', {
                parent: 'hcp-user-profile',
                url: '{clinicId}/update',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'profile.page-title.profile-update'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/profile/profile-tabs/edit-my-profile.html',
                        controller: 'hcpProfileController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]

                  }
               })   

            .state('clinicadmindashboard', {
                parent: 'clinicadmin-dashboard',
                url: '/clinicadmin-dashboard/{clinicId}',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'doctor.page-title.my-dashboard'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/graph/views/dashboard-landing.html',
                        controller: 'hcpGraphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('HCPGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminUserProfile', {
                parent: 'clinic-admin-user-profile',
                url: '/{clinicId}/profile',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'profile.page-title.my-profile'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/profile/profile-tabs/my-profile.html',
                        controller: 'clinicadminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('ClinicAdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminUpdatePassword', {
                parent: 'clinic-admin-user-profile',
                url: '/{clinicId}/updatepassword',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'profile.page-title.update-password'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/profile/profile-tabs/update-password.html',
                        controller: 'clinicadminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('ClinicAdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })

            .state('editClinicadminProfile', {
                parent: 'clinic-admin-user-profile',
                url: '/{clinicId}/update',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'profile.page-title.profile-update'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/profile/profile-tabs/edit-my-profile.html',
                        controller: 'clinicadminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('ClinicAdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })

            .state('clinicadminpatientdashboard', {
                parent: 'clinicadmin-dashboard',
                url: '/clinicadmin-patient/{clinicId}/{filter}',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'patient.page-title.patients'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/patient/directives/list.html',
                        controller: 'clinicadminPatientController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('ClinicAdminPatientModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminhcpdashboard', {
                parent: 'clinicadmin-dashboard',
                url: '/{clinicId}/clinicadmin-hcp',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'doctor.page-title.hcps'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/hcp/views/list.html',
                        controller: 'clinicadminHcpController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicDashboard', {
                parent: 'clinicUser',
                url: '/{clinicId}/clinicadmin-dashboard',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'doctor.page-title.my-dashboard'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/graph/views/dashboard-landing-admin.html',
                        controller: 'hcpGraphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('HCPGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicDashboardRcadmin', {
              parent: 'rcadmin',
              url: '/{doctorId}/{clinicId}/clinicadmin-dashboard',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'clinic.page-title.clinic-profile'
              },
              views: {
                  'rcadmin-view': {
                      templateUrl: 'scripts/modules/clinicadmin/graph/views/dashboard-landing-admin.html',
                      controller: 'hcpGraphController'
                  }
              },
              resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('HCPGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminclinicdashboard', {
                parent: 'clinicadmin-dashboard',
                url: '/{clinicId}/clinicadmin-clinic',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'clinic.page-title.clinics'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/clinic/views/clinicdetail.html',
                        controller: 'clinicadminclinicController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('clinic');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })


     .state('adherenceSettingPage', {
                parent: 'clinicadmin-dashboard',
                url: '/{clinicId}/adherenceSettingPage',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'clinic.page-title.adherence-settings'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/clinic/views/adherenceSetting.html',
                        controller: 'clinicadminclinicController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('clinic');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminnewhcp', {
                parent: 'clinicadminhcpdashboard',
                url: '/new',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'hcp.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/hcp/views/create.html',
                        controller: 'clinicadminHcpController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminedithcp', {
                parent: 'clinicadminhcpdashboard',
                url: '/edit/{doctorId}',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'hcp.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/hcp/views/create.html',
                        controller: 'clinicadminHcpController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminhcpoverview', {
                parent: 'clinicadminhcpdashboard',
                url: '/overview/{hcpId}',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'hcp.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/hcp/views/hcpoverview.html',
                        controller: 'clinicadminHcpController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminpatientOverview', {
                parent: 'clinicadminpatientdashboard',
                url: '/{patientId}/overview',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'patient.page-title.overview'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/patient/directives/patient-details.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('clinicadminpatientDemographic', {
                parent: 'clinicadminpatientdashboard',
                url: '/{patientId}/demographic',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'patient.page-title.patients'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/patient/views/patientdemographics.html',
                        controller: 'clinicadminPatientController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('ClinicAdminPatientModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminpatientClinics', {
                parent: 'clinicadminpatientdashboard',
                url: '/{patientId}/clinicInfo',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'patient.page-title.clinic-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/patient/views/clinicinformation.html',
                        controller: 'clinicadminPatientController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('ClinicAdminPatientModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('caregiverDashboard', {
                parent: 'caregiver-dashboard',
                url: '/caregiver-dashboard/{patientId}',
                data: {
                    roles: ['CARE_GIVER'],
                    pageTitle: 'caregiver.title'
                },
                views: {
                    'caregiver-view': {
                        templateUrl: 'scripts/modules/caregiver/graph/views/dashboard-landing.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('caregiverDashboardClinicHCP', {
                parent: 'caregiver-dashboard',
                url: '/clinic-hcp/{patientId}',
                data: {
                    roles: ['CARE_GIVER'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'caregiver-view': {
                        templateUrl: 'scripts/modules/patient/graph/views/clinichcp.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('caregiverDashboardDeviceProtocol', {
                parent: 'caregiver-dashboard',
                url: '/device-protocol/{patientId}',
                data: {
                    roles: ['CARE_GIVER'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'caregiver-view': {
                        templateUrl: 'scripts/modules/patient/graph/views/deviceprotocol.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientDashboardPatientInfo', {
                parent: 'caregiver-dashboard',
                url: '/patient-info/{patientId}',
                data: {
                    roles: ['CARE_GIVER'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'caregiver-view': {
                        templateUrl: 'scripts/modules/patient/profile/profile-tabs/my-profile.html',
                        controller: 'patientprofileController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientDashboardNotification', {
                parent: 'caregiver-dashboard',
                url: '/notification-settings/{patientId}',
                data: {
                    roles: ['CARE_GIVER'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'caregiver-view': {
                        templateUrl: 'scripts/modules/patient/profile/profile-tabs/settings.html',
                        controller: 'patientprofileController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('caregiverProfile', {
                parent: 'caregiver-dashboard-profile',
                url: '/profile/:patientId',
                data: {
                    roles: ['CARE_GIVER'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'caregiver-profile-view': {
                        templateUrl: 'scripts/modules/caregiver/profile/views/my-profile.html',
                        controller: 'caregiverProfileController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('caregiverProfileEdit', {
                parent: 'caregiver-dashboard-profile',
                url: '/profile-edit/:patientId',
                data: {
                    roles: ['CARE_GIVER'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'caregiver-profile-view': {
                        templateUrl: 'scripts/modules/caregiver/profile/views/edit-my-profile.html',
                        controller: 'caregiverProfileController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })


            .state('caregiverChangePassword', {
                parent: 'caregiver-dashboard-profile',
                url: '/change-password/:patientId',
                data: {
                    roles: ['CARE_GIVER'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'caregiver-profile-view': {
                        templateUrl: 'scripts/modules/caregiver/profile/views/update-password.html',
                        controller: 'caregiverProfileController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminpatientProtocol', {
                parent: 'clinicadminpatientdashboard',
                url: '/{patientId}/protocol-device',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'patient.page-title.careplan-device'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/patient/views/deviceprotocol.html',
                        controller: 'clinicadminPatientController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('ClinicAdminPatientModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminpatientCraegiver', {
                parent: 'clinicadminpatientdashboard',
                url: '/{patientId}/caregivers',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'patient.page-title.caregiver-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/patient/views/caregiverinformation.html',
                        controller: 'clinicadminPatientController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('ClinicAdminPatientModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadmminpatientDemographicEdit', {
                parent: 'clinicadminpatientdashboard',
                url: '/{patientId}/demographicedit',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'patient.page-title.patient-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/patient/views/patientdemographicsedit.html',
                        controller: 'clinicadminPatientController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('ClinicAdminPatientModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminSettings', {
                parent: 'clinic-admin-user-profile',
                url: '/{clinicId}/notification-settings',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'profile.page-title.notification-settings'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/profile/profile-tabs/settings.html',
                        controller: 'clinicadminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('ClinicAdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('hcpSettings', {
                parent: 'hcp-user-profile',
                url: '/{clinicId}/notification-settings',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'profile.page-title.notification-settings'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/profile/profile-tabs/settings.html',
                        controller: 'hcpProfileController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('patientEditProtocol', {
                parent: 'patientProtocol',
                url: '/{protocolId}/{protocolDevice}/editProtocol',
                data: {
                    roles: ['ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/device-protocol/add-protocol.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('contactus', {
                parent: 'account',
                url: '/contactus',
                data: {
                    roles: [],
                    pageTitle: 'login.page-title.contact-us'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/components/footer_static_pages/contact_us.html',
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            })
            .state('privacyPolicy', {
                parent: 'account',
                url: '/privacyPolicy',
                data: {
                    roles: [],
                    pageTitle: 'login.page-title.privacy-policy'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/components/footer_static_pages/privacy_policy.html',
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            })
            .state('termsOfUse', {
                parent: 'account',
                url: '/termsOfUse',
                data: {
                    roles: [],
                    pageTitle: 'login.page-title.terms-use'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/components/footer_static_pages/terms_of_use.html',
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            })
            .state('privacyPractices', {
                parent: 'account',
                url: '/privacyPractices',
                data: {
                    roles: [],
                    pageTitle: 'login.page-title.privacy-practices'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/components/footer_static_pages/HIPPA_notice_of_privacy_practices.html',
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            })
            .state('careSite', {
                parent: 'account',
                url: '/careSite',
                data: {
                    roles: [],
                    pageTitle: 'login.page-title.care-site'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/components/footer_static_pages/hill_rom_respiratory.html',
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            })
            .state('rcadmin', {
                url:'/rcadmin',
                views:{
                    'content':{
                    templateUrl:'scripts/modules/rcadmin/patient/view/rcadmin-section.html'
            }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('rcadminPatients', {
                parent: 'rcadmin',
                url: '/rcadmin-patients?clinicIds',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.page-title.patients'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/views/list/view.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('rcadminPatientNew', {
                parent: 'rcadmin',
                url: '/patients-new',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/views/create-edit/view.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientOverviewRcadmin', {
                parent: 'rcadmin',
                url: '/{patientId}/patients-overview',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.page-title.overview'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/overview/patient-details.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientDemographicRcadmin', {
                parent: 'rcadmin',
                url: '/{patientId}/patients-demographic',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.page-title.patient-info'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/patient-demographics/detail.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientClinicsRcadmin', {
                parent: 'rcadmin',
                url: '/{patientId}/patients-clinicInfo',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.page-title.clinic-info'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/clinic/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientProtocolRcadmin', {
                parent: 'rcadmin',
                url: '/{patientId}/patients-protocol-device',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.page-title.careplan-device'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/device-protocol/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientCraegiverRcadmin', {
                parent: 'rcadmin',
                url: '/{patientId}/patients-caregiver',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.page-title.caregiver-info'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/caregiver/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientDemographicEditRcadmin', {
                parent: 'rcadmin',
                url: '/{patientId}/patients-demographicedit',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.page-title.patient-info'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/patient-demographics/edit.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientAddProtocolRcadmin', {
                parent: 'rcadmin',
                url: '/{patientId}/{protocolDevType}/patients-addProtocol',
                params: {protocol: null},
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/device-protocol/add-protocol.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientAddDeviceRcadmin', {
                parent: 'rcadmin',
                url: '/{patientId}/patients-addDevice',
                params:{device: null},
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/device-protocol/add-device.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientEditProtocolRcadmin', {
                parent: 'rcadmin',
                url: '/{patientId}/{protocolId}/{protocolDevice}/patients-editProtocol',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/device-protocol/add-protocol.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientCraegiverEditRcadmin', {
                parent: 'rcadmin',
                url: '/{patientId}/{caregiverId}/patients-caregiver-edit',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/caregiver/create.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hcpUserRcadmin', {
                parent: 'rcadmin',
                url: '/rcadmin-hcps?clinicIds',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'doctor.page-title.hcps'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/hcp/views/list/view.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hcpProfileRcadmin', {
                parent: 'rcadmin',
                url: '/{doctorId}/hcps-hcpProfile',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'doctor.page-title.hcp-profile'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/hcp/directives/hcp-info/overview/overview.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('associatedClinicRcadmin', {
                parent: 'rcadmin',
                url: '/{doctorId}/hcps-associatedClinic',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'doctor.page-title.associated-clinics'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/hcp/directives/hcp-info/associated-clinic/clinic-list.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('hcpEditRcadmin', {
                parent: 'rcadmin',
                url: '/{doctorId}/hcps-hcpEdit',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'doctor.page-title.hcp-update'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/hcp/views/create-edit/view.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('clinicProfileRcadmin', {
              parent: 'rcadmin',
              url: '/{doctorId}/{clinicId}/clinics-clinic-info',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'clinic.page-title.clinic-profile'
              },
              views: {
                  'rcadmin-view': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/clinic-profile/profile.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('clinicUserRcadmin', {
              parent: 'rcadmin',
              url: '/rcadmin-clinics',
              data: {
                roles: ['ACCT_SERVICES'],
                pageTitle: 'clinic.page-title.clinics'
              },
              views: {
                  'rcadmin-view': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/list/list.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('clinicAssociatedHCPRcadmin', {
              parent: 'rcadmin',
              url: '/{clinicId}/clinics-associatedHCP',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'clinic.page-title.associated-HCPs'
              },
              views: {
                  'rcadmin-view': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/clinic-info/hcp/associatedhcp.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('clinicAssociatedPatientsRcadmin', {
              parent: 'rcadmin',
              url: '/{clinicId}/clinics-associatedPatients/{filter}',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'clinic.page-title.associated-patients'
              },
              views: {
                  'rcadmin-view': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/clinic-info/patients/associatedpatients.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('clinicAdminRcadmin', {
              parent: 'rcadmin',
              url: '/{clinicId}/clinics-clinic-edit',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'clinic.page-title.clinic-admin'
              },
              views: {
                  'rcadmin-view': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/clinic-info/clinic-admin/clinic-admin.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('hcpNewRcadmin', {
                parent: 'rcadmin',
                url: '/hcps-hcp-new',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/hcp/views/create-edit/view.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');

                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('clinicEditRcadmin', {
              parent: 'rcadmin',
              url: '/{clinicId}/clinics-edit',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'clinic.title'
              },
              views: {
                  'rcadmin-view': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/create-edit/create.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('clinicNewRcadmin', {
              parent: 'rcadmin',
              url: '/clinics-new?parentId',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'clinic.title'
              },
              views: {
                  'rcadmin-view': {
                      templateUrl: 'scripts/modules/admin/clinic/directives/create-edit/create.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('patientCraegiverAddRcadmin', {
                parent: 'rcadmin',
                url: '/{patientId}/patients-caregiver-add',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/patient/directives/patient-info/caregiver/create.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('adminProfileRc', {
                parent: 'rcadmin',
                url: '/profile',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'profile.page-title.my-profile'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/profile/profile-tabs/my-profile.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('editAdminProfileRc', {
                parent: 'rcadmin',
                url: '/update',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/profile/profile-tabs/edit-my-profile.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })
            .state('adminUpdatePasswordRc', {
                parent: 'rcadmin',
                url: '/updatepassword',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'profile.page-title.update-password'
                },
                views: {
                    'rcadmin-view': {
                        templateUrl: 'scripts/modules/admin/profile/profile-tabs/update-password.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })
            .state('activateUser', {
                parent: 'account',
                url: '/activate',
                data: {
                    roles: [],
                    pageTitle: 'login.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/account/login/activatepatient.html',
                        controller: 'LoginController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            })
            .state('activationLinkErrorPage', {
                parent: 'account',
                url: '/activationError?key',
                data: {
                    roles: [],
                    pageTitle: 'activate.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/account/activate/activationLinkErrorPage.html'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('activate');
                        return $translate.refresh();
                    }]
                }
            })
            .state('postActivateLogin', {
                parent: 'account',
                url: '/userLogin',
                data: {
                    roles: [],
                    pageTitle: 'login.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/account/login/postActivateLogin.html',
                        controller: 'LoginController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            })
            .state('associatePatientUser', {
                parent: 'associate',
                url: '/patients',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'patient.page-title.patients'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/patient/views/list/view.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('associateHcpUser', {
                parent: 'associate',
                url: '/hcpUsers',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'doctor.page-title.hcps'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/hcp/views/list/view.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            
            .state('associateClinicUser', {
              parent: 'associate',
              url: '/clinics',
              data: {
                roles: ['ASSOCIATES'],
                pageTitle: 'clinic.page-title.clinics'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/associate/clinic/views/list/view.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('associateHillRomUser', {
                parent: 'associate',
                url: '/hillRomUsers',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'user.page-title.users'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/hill-rom-user/views/list/view.html',
                        controller: 'UsersController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hillRomUser');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('associateProfile', {
                parent: 'associate',
                url: '/profile',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'profile.page-title.my-profile'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/profile/profile-tabs/my-profile.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('associateUpdatePassword', {
                parent: 'associate',
                url: '/updatepassword',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'profile.page-title.update-password'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/profile/profile-tabs/update-password.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })

            .state('associatepatientOverview', {
                parent: 'associatePatientUser',
                url: '/{patientId}/overview',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'patient.page-title.overview'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/patient/views/patient-info/overview/patient-overview.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            
            .state('associatepatientDemographic', {
                parent: 'associatePatientUser',
                url: '/{patientId}/demographic',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'patient.page-title.patient-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/patient/views/patient-info/patient-demographics/detail.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('associatepatientClinics', {
                parent: 'associatePatientUser',
                url: '/{patientId}/clinicInfo',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'patient.page-title.clinic-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/patient/views/patient-info/clinic/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('associatepatientProtocol', {
                parent: 'associatePatientUser',
                url: '/{patientId}/protocol-device',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'patient.page-title.careplan-device'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/patient/views/patient-info/device-protocol/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            
            .state('associatepatientCraegiver', {
                parent: 'associatePatientUser',
                url: '/{patientId}/caregiver',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'patient.page-title.caregiver-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/patient/views/patient-info/caregiver/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('editAssociateProfile', {
                parent: 'associateProfile',
                url: '/update',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/profile/profile-tabs/edit-my-profile.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })

            .state('hcpProfileAssociates', {
                parent: 'associateHcpUser',
                url: '/{doctorId}/hcpProfile',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'doctor.page-title.hcp-profile'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/hcp/views/hcp-info/overview/overview.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('associatedClinicAssociates', {
                parent: 'associateHcpUser',
                url: '/{doctorId}/associatedClinic',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'doctor.page-title.associated-clinics'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/hcp/views/hcp-info/associated-clinic/clinic-list.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('associateHillRomUserView', {
                parent: 'associateHillRomUser',
                url: '/{userId}',
                data: {
                    roles: ['ASSOCIATES'],
                    pageTitle: 'user.page-title.user'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/associate/hill-rom-user/views/user-info/view.html',
                        controller: 'UsersController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hillRomUser');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('clinicProfileAssociate', {
              parent: 'associateClinicUser',
              url: '/{clinicId}/clinic-info',
              data: {
                  roles: ['ASSOCIATES'],
                  pageTitle: 'clinic.page-title.clinic-profile'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/associate/clinic/views/clinic-info/clinic-profile/profile.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

            .state('clinicDashboardAssociate', {
              parent: 'associateClinicUser',
              url: '/{clinicId}/clinicadmin-dashboard',
              data: {
                  roles: ['ASSOCIATES'],
                  pageTitle: 'clinic.page-title.clinic-profile'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/clinicadmin/graph/views/dashboard-landing-associates.html',
                      controller: 'hcpGraphController'
                  }
              },
              resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('HCPGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            
            .state('clinicAssociatedHCPAssociate', {
              parent: 'associateClinicUser',
              url: '/{clinicId}/associatedHCP',
              data: {
                  roles: ['ASSOCIATES'],
                  pageTitle: 'clinic.page-title.associated-HCPs'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/associate/clinic/views/clinic-info/hcp/associatedhcp.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

            .state('clinicAssociatedPatientsAssociate', {
              parent: 'associateClinicUser',
              url: '/{clinicId}/associatedPatients/{filter}',
              data: {
                  roles: ['ASSOCIATES'],
                  pageTitle: 'clinic.page-title.associated-patients'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/associate/clinic/views/clinic-info/patients/associatedpatients.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('clinicAdminAssociate', {
              parent: 'associateClinicUser',
              url: '/{clinicId}/clinicadmin-clinic-edit',
              data: {
                  roles: ['ASSOCIATES'],
                  pageTitle: 'clinic.page-title.clinic-admin'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/associate/clinic/views/clinic-info/clinic-admin/clinic-admin.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('survey', {               
                url:'/patient',
                parent: 'entity',
                abstract: true,                
            })
            /* Disable Patient Survey
            .state('patientSurvey', {
              parent: 'survey',
              url: '/{surveyId}/survey',
              data: {
                  roles: ['PATIENT'],
                  pageTitle: 'console.console-tabs.patient-survey'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/patient/survey/views/survey.html',
                      controller: 'patientSurveyController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
*/
            .state('console', {               
                url:'/console',
                parent: 'entity',
                abstract: true,                
            })
            .state('adminSurveyReport', {
              parent: 'console',
              url: '/admin/survey-report',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'console.page-title.survey'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/surveyreport/views/admin/view.html',
                      controller: 'surveyReportController'
                  }
              },
              resolve: {
                loadMyCtrl:['$ocLazyLoad', function($ocLazyLoad){
                    return $ocLazyLoad.load('surveyModule');
                }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('rcddminSurveyReport', {
              parent: 'console',
              url: '/rcadmin/survey-report',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'console.page-title.survey'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/surveyreport/views/rcadmin/view.html',
                      controller: 'surveyReportController'
                  }
              },
              resolve: {
                loadMyCtrl:['$ocLazyLoad', function($ocLazyLoad){
                    return $ocLazyLoad.load('surveyModule');
                }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('associateSurveyReport', {
              parent: 'console',
              url: '/associates/survey-report',
              data: {
                  roles: ['ASSOCIATES'],
                  pageTitle: 'console.page-title.survey'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/surveyreport/views/associates/view.html',
                      controller: 'surveyReportController'
                  }
              },
              resolve: {
                loadMyCtrl:['$ocLazyLoad', function($ocLazyLoad){
                    return $ocLazyLoad.load('surveyModule');
                }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

            .state('adminLoginAnalytics', {
              parent: 'console',
              url: '/admin/useranalytics',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'console.page-title.login-analytics'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/loginanalytics/views/admin/view.html',
                      controller: 'loginAnalyticsController'
                  }
              },
              resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('rcadminLoginAnalytics', {
              parent: 'console',
              url: '/rcadmin/useranalytics',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'console.page-title.login-analytics'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/loginanalytics/views/rcadmin/view.html',
                      controller: 'loginAnalyticsController'
                  }
              },
              resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('associatesLoginAnalytics', {
              parent: 'console',
              url: '/associates/useranalytics',
              data: {
                  roles: ['ASSOCIATES'],
                  pageTitle: 'console.page-title.login-analytics'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/loginanalytics/views/associates/view.html',
                      controller: 'loginAnalyticsController'
                  }
              },
              resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

            .state('adminBenchmarking', {
              parent: 'console',
              url: '/admin/benchmarking',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'console.page-title.benchmarking'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/benchmarking/views/admin/view.html',
                      controller: 'benchmarkingController'
                  }
              },
              resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('BenchmarkingModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('adminClinicDiseaseBenchmarking', {
              parent: 'adminBenchmarking',
              url: '/clinicanddisease',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'console.page-title.benchmarking'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/benchmarking/views/admin/view.html',
                      controller: 'benchmarkingController'
                  }
              },
              resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('BenchmarkingModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('rcadminBenchmarking', {
              parent: 'console',
              url: '/rcadmin/benchmarking',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'console.page-title.benchmarking'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/benchmarking/views/rcadmin/view.html',
                      controller: 'benchmarkingController'
                  }
              },
              resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('BenchmarkingModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('rcadminClinicDiseaseBenchmarking', {
              parent: 'rcadminBenchmarking',
              url: '/clinicanddisease',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'console.page-title.benchmarking'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/benchmarking/views/rcadmin/view.html',
                      controller: 'benchmarkingController'
                  }
              },
              resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('BenchmarkingModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('associatesBenchmarking', {
              parent: 'console',
              url: '/associates/benchmarking',
              data: {
                  roles: ['ASSOCIATES'],
                  pageTitle: 'console.page-title.benchmarking'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/benchmarking/views/associates/view.html',
                      controller: 'benchmarkingController'
                  }
              },
              resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('BenchmarkingModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('associatesClinicDiseaseBenchmarking', {
              parent: 'associatesBenchmarking',
              url: '/clinicanddisease',
              data: {
                  roles: ['ASSOCIATES'],
                  pageTitle: 'console.page-title.benchmarking'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/benchmarking/views/associates/view.html',
                      controller: 'benchmarkingController'
                  }
              },
              resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('BenchmarkingModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('clinicAdminUpdateProtocol', {
                parent: 'clinicadminpatientProtocol',
                url: '/{protocolId}/{protocolDevice}/editProtocol',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/patient/views/update-protocol.html',
                        controller: 'changePrescriptionController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('clinicadminGenerateProtocol', {
                parent: 'clinicadminpatientProtocol',
                url: '/{protocolId}/protocoldetail',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/patient/views/generate-protocol.html',
                        controller: 'changePrescriptionController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
.state('rcadminAnnouncements', {
              parent: 'console',
              url: '/rcadmin/announcements',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'console.page-title.announcements'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/announcements/views/rcadmin/view.html',
                      controller: 'announcementsController'
                  }
              },
              resolve: {
                /*loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],*/
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
.state('rcadminAnnouncementsEdit', {
              parent: 'console',
              url: '/rcadmin/announcements-edit/{Id}',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'console.page-title.announcements'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/announcements/views/rcadmin/edit.html',
                      controller: 'announcementsController'
                  }
              },
              resolve: {
                /*loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],*/
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
.state('rcadminAnnouncementsNew', {
              parent: 'console',
              url: '/rcadmin/announcements-new',
              data: {
                  roles: ['ACCT_SERVICES'],
                  pageTitle: 'console.page-title.announcements'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/announcements/views/rcadmin/new.html',
                      controller: 'announcementsController'
                  }
              },
              resolve: {
                /*loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],*/
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
.state('adminAnnouncements', {
              parent: 'console',
              url: '/admin/announcements',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'console.page-title.announcements'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/announcements/views/admin/view.html',
                      controller: 'announcementsController'
                  }
              },
              resolve: {
                /*loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],*/
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
.state('adminAnnouncementsEdit', {
              parent: 'console',
              url: '/admin/announcements-edit/{Id}',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'console.page-title.announcements'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/announcements/views/rcadmin/edit.html',
                      controller: 'announcementsController'
                  }
              },
              resolve: {
                /*loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],*/
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
.state('adminAnnouncementsNew', {
              parent: 'console',
              url: '/admin/announcements-new',
              data: {
                  roles: ['ADMIN'],
                  pageTitle: 'console.page-title.announcements'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/announcements/views/rcadmin/new.html',
                      controller: 'announcementsController'
                  }
              },
              resolve: {
                /*loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],*/
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
/*
            .state('patientBenchmarking', {
                parent: 'patient-dashboard',
                url: '/p-benchmarking',
                data: {
                    roles: ['PATIENT'],
                    pageTitle: 'patient.page-title.patient-benchmarking'
                },
                views: {
                    'patient-view': {
                        templateUrl: 'scripts/modules/patient/profile/profile-tabs/benchmarking.html',
                        controller: 'patientBenchmarkingController'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientBenchmarkingModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
*/            

            .state('hcpUpdateProtocol', {
                parent: 'hcppatientProtocol',
                url: '/{protocolId}/{protocolDevice}/editProtocol',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/patient/views/update-protocol.html',
                        controller: 'changePrescriptionController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('hcpGenerateProtocol', {
                parent: 'hcppatientProtocol',
                url: '/{protocolId}/protocoldetail',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/patient/views/generate-protocol.html',
                        controller: 'changePrescriptionController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
/*
            .state('hcpBenchmarking', {
                parent: 'hcp-user-profile',
                url: '/benchmarking',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'profile.page-title.benchmarking'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/common/clinicadmin-hcp/benchmarking/views/hcpbenchmarking.html',
                        controller: 'hcpCAdminBenchmarkingController'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('HCPCABenchmarkingModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
*/            
/*
            .state('clinicAdminBenchmarking', {
                parent: 'clinic-admin-user-profile',
                url: '/benchmarking',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'profile.page-title.benchmarking'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/common/clinicadmin-hcp/benchmarking/views/cabenchmarking.html',
                        controller: 'hcpCAdminBenchmarkingController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('HCPCABenchmarkingModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
*/            
            .state('patientDiagnostic', {
                parent: 'patient-dashboard',
                url: '/patientDiagnostic',
                data: {
                    roles: ['PATIENT'],
                    pageTitle: 'profile.page-title.benchmarking'
                },
                views: {
                    'patient-view': {
                        templateUrl: 'scripts/modules/common/clinicadmin-hcp/patient-diagnostics/views/patientDiagnostic.html',
                        controller: 'patientDiagnosticController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientDiagnosticModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('patientDiagnosticAdd', {
                parent: 'patient-dashboard',
                url: '/patientDiagnostic/add',
                data: {
                    roles: ['PATIENT'],
                    pageTitle: 'profile.page-title.benchmarking'
                },
                views: {
                    'patient-view': {
                        templateUrl: 'scripts/modules/common/clinicadmin-hcp/patient-diagnostics/views/diagnosticadd.html',
                        controller: 'patientDiagnosticController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientDiagnosticModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('HCPDiagnostic', {
                parent: 'hcppatientList',
                url: '/{patientId}/patientDiagnostic',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'profile.page-title.benchmarking'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/common/clinicadmin-hcp/patient-diagnostics/views/hcpPatientDiagnostic.html',
                        controller: 'patientDiagnosticController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientDiagnosticModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('HCPDiagnosticAdd', {
                parent: 'hcppatientList',
                url: '/{resultId}/patientDiagnostic/add',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'profile.page-title.benchmarking'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/common/clinicadmin-hcp/patient-diagnostics/views/hcpPatientDiagnostic.html',
                        controller: 'patientDiagnosticController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientDiagnosticModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('HCPDiagnosticEdit', {
                parent: 'hcppatientList',
                url: '/patientDiagnostic/add',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'profile.page-title.benchmarking'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/common/clinicadmin-hcp/patient-diagnostics/views/hcpPatientDiagnosticAdd.html',
                        controller: 'patientDiagnosticController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientDiagnosticModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('CADiagnostic', {
                parent: 'clinicadminpatientdashboard',
                url: '/{patientId}/patientDiagnostic',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'profile.page-title.benchmarking'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/common/clinicadmin-hcp/patient-diagnostics/views/clinicadminPatientDiagnostic.html',
                        controller: 'patientDiagnosticController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientDiagnosticModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('CADiagnosticAdd', {
                parent: 'clinicadminpatientdashboard',
                url: '/{resultId}/{patientId}/patientDiagnostic/add',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'profile.page-title.benchmarking'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/common/clinicadmin-hcp/patient-diagnostics/views/clinicadminPatientDiagnostic.html',
                        controller: 'patientDiagnosticController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientDiagnosticModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('CADiagnosticEdit', {
                parent: 'clinicadminpatientdashboard',
                url: '/{patientId}/patientDiagnostic/add',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'profile.page-title.benchmarking'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/common/clinicadmin-hcp/patient-diagnostics/views/clinicadminPatientDiagnosticAdd.html',
                        controller: 'patientDiagnosticController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientDiagnosticModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('changePrescriptionTermsConditions', {
                parent: 'account',
                url: '/prescription-terms',
                data: {
                    roles: ['HCP', 'CLINIC_ADMIN'],
                    pageTitle: 'login.page-title.privacy-policy'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/components/staticPages/protocolTermsCondition.html',
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            })
        

            .state('hcppatientdemographicEdit', {
                parent: 'hcppatientDemographic',
                url: '/{patientId}/hcppatientdemographicedit',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'patient.page-title.patient-info'
                },
                views: {
                    'content@': {
                         templateUrl: 'scripts/modules/hcp/patient/views/patientdemographicsedit.html',
                        controller: 'hcpPatientController'
                    }
                },
               resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

 .state('Messages', {
                parent: 'patient-dashboard',
                url: '/messages',
                data: {
                    roles: ['PATIENT'],
                    pageTitle: 'patient.page-title.messages'
                },
                views: {
                    'content@': {
                    templateUrl:'scripts/modules/common/messagesMain/views/message-section.html',
                controller: 'messagecontroller'
                    }
                },
               resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('MessagesModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
.state('Messages_CA', {
                parent: 'clinicadmin-dashboard',
                url: '/messages_CA/{clinicId}',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'patient.page-title.messages'
                },
                views: {
                    'content@': {
                    templateUrl:'scripts/modules/common/messagesMain/views/messages_CA.html',
                controller: 'messagecontroller'
                    }
                },
               resolve: {
                  loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('MessagesModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
.state('Messages_HCP', {
                parent: 'hcp-dashboard',
                url: '/messages_HCP/{clinicId}',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'patient.page-title.messages'
                },
                views: {
                    'content@': {
                    templateUrl:'scripts/modules/common/messagesMain/views/messages_HCP.html',
                controller: 'messagecontroller'
                    }
                },
               resolve: {
                  loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('MessagesModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

	    .state('rcadmin-hillRomUser', {
                parent: 'rcadmin',
                url: '/rcadmin-hillRomUser',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'user.page-title.users'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/rcadmin/hill-rom-user/views/list/view.html',
                        controller: 'UsersController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hillRomUser');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('rcadmin-hillRomUserNew', {
                parent: 'rcadmin-hillRomUser',
                url: '/new',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/rcadmin/hill-rom-user/views/create-edit/view.html',
                        controller: 'UsersController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hillRomUser');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('rcadmin-hillRomUserEdit', {
                parent: 'rcadmin-hillRomUser',
                url: '/{userId}',
                data: {
                    roles: ['ACCT_SERVICES'],
                    pageTitle: 'user.page-title.user'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/rcadmin/hill-rom-user/views/create-edit/view.html',
                        controller: 'UsersController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hillRomUser');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
.state('customerservicePatientUser', {
                parent: 'customerservice',
                url: '/patients',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'patient.page-title.patients'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/patient/views/list/view.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
.state('customerservicepatientOverview', {
                parent: 'customerservicePatientUser',
                url: '/{patientId}/overview',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'patient.page-title.overview'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/patient/views/patient-info/overview/patient-overview.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
.state('customerservicepatientDemographic', {
                parent: 'customerservicePatientUser',
                url: '/{patientId}/demographic',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'patient.page-title.patient-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/patient/views/patient-info/patient-demographics/detail.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient');$translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
.state('customerservicepatientClinics', {
                parent: 'customerservicePatientUser',
                url: '/{patientId}/clinicInfo',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'patient.page-title.clinic-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/patient/views/patient-info/clinic/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

            .state('customerservicepatientProtocol', {
                parent: 'customerservicePatientUser',
                url: '/{patientId}/protocol-device',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'patient.page-title.careplan-device'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/patient/views/patient-info/device-protocol/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            
            .state('customerservicepatientCraegiver', {
                parent: 'customerservicePatientUser',
                url: '/{patientId}/caregiver',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'patient.page-title.caregiver-info'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/patient/views/patient-info/caregiver/list.html',
                        controller: 'patientsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
             .state('customerserviceClinicUser', {
              parent: 'customerservice',
              url: '/clinics',
              data: {
                roles: ['CUSTOMER_SERVICES'],
                pageTitle: 'clinic.page-title.clinics'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/customerservices/clinic/views/list/view.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('clinicProfileCustomerService', {
              parent: 'customerserviceClinicUser',
              url: '/{clinicId}/clinic-info',
              data: {
                  roles: ['CUSTOMER_SERVICES'],
                  pageTitle: 'clinic.page-title.clinic-profile'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/customerservices/clinic/views/clinic-info/clinic-profile/profile.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('clinicDashboardCustomerService', {
              parent: 'customerserviceClinicUser',
              url: '/{clinicId}/clinicadmin-dashboard',
              data: {
                  roles: ['CUSTOMER_SERVICES'],
                  pageTitle: 'clinic.page-title.clinic-profile'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/clinicadmin/graph/views/dashboard-landing-associates.html',
                      controller: 'hcpGraphController'
                  }
              },
              resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('HCPGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            
            .state('clinicAssociatedHCPCustomerService', {
              parent: 'customerserviceClinicUser',
              url: '/{clinicId}/associatedHCP',
              data: {
                  roles: ['CUSTOMER_SERVICES'],
                  pageTitle: 'clinic.page-title.associated-HCPs'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/customerservices/clinic/views/clinic-info/hcp/associatedhcp.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

            .state('clinicAssociatedPatientsCustomerService', {
              parent: 'customerserviceClinicUser',
              url: '/{clinicId}/associatedPatients/{filter}',
              data: {
                  roles: ['CUSTOMER_SERVICES'],
                  pageTitle: 'clinic.page-title.associated-patients'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/customerservices/clinic/views/clinic-info/patients/associatedpatients.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
            .state('clinicAdminCustomerService', {
              parent: 'customerserviceClinicUser',
              url: '/{clinicId}/clinicadmin-clinic-edit',
              data: {
                  roles: ['CUSTOMER_SERVICES'],
                  pageTitle: 'clinic.page-title.clinic-admin'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/customerservices/clinic/views/clinic-info/clinic-admin/clinic-admin.html',
                      controller: 'clinicsController'
                  }
              },
              resolve: {
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('clinic');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
             .state('customerserviceHcpUser', {
                parent: 'customerservice',
                url: '/hcpUsers',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'doctor.page-title.hcps'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/hcp/views/list/view.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
             .state('hcpProfileCustomerService', {
                parent: 'customerserviceHcpUser',
                url: '/{doctorId}/hcpProfile',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'doctor.page-title.hcp-profile'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/hcp/views/hcp-info/overview/overview.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
             .state('associatedClinicCustomerService', {
                parent: 'customerserviceHcpUser',
                url: '/{doctorId}/associatedClinic',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'doctor.page-title.associated-clinics'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/hcp/views/hcp-info/associated-clinic/clinic-list.html',
                        controller: 'DoctorsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('doctor');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
             .state('customerserviceHillRomUser', {
                parent: 'customerservice',
                url: '/hillRomUsers',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'user.page-title.users'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/hill-rom-user/views/list/view.html',
                        controller: 'UsersController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hillRomUser');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
             .state('customerserviceHillRomUserView', {
                parent: 'customerserviceHillRomUser',
                url: '/{userId}',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'user.page-title.user'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/hill-rom-user/views/user-info/view.html',
                        controller: 'UsersController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hillRomUser');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })

             .state('customerserviceSurveyReport', {
              parent: 'console',
              url: '/customerservice/survey-report',
              data: {
                  roles: ['CUSTOMER_SERVICES'],
                  pageTitle: 'console.page-title.survey'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/surveyreport/views/customerservice/view.html',
                      controller: 'surveyReportController'
                  }
              },
              resolve: {
                loadMyCtrl:['$ocLazyLoad', function($ocLazyLoad){
                    return $ocLazyLoad.load('surveyModule');
                }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

             .state('customerserviceBenchmarking', {
              parent: 'console',
              url: '/customerservice/benchmarking',
              data: {
                  roles: ['CUSTOMER_SERVICES'],
                  pageTitle: 'console.page-title.benchmarking'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/benchmarking/views/customerservice/view.html',
                      controller: 'benchmarkingController'
                  }
              },
              resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('BenchmarkingModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
             .state('customerserviceClinicDiseaseBenchmarking', {
              parent: 'customerserviceBenchmarking',
              url: '/clinicanddisease',
              data: {
                  roles: ['CUSTOMER_SERVICES'],
                  pageTitle: 'console.page-title.benchmarking'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/benchmarking/views/customerservice/view.html',
                      controller: 'benchmarkingController'
                  }
              },
              resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('BenchmarkingModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })
             .state('customerserviceLoginAnalytics', {
              parent: 'console',
              url: '/customerservice/useranalytics',
              data: {
                  roles: ['CUSTOMER_SERVICES'],
                  pageTitle: 'console.page-title.login-analytics'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/loginanalytics/views/customerservice/view.html',
                      controller: 'loginAnalyticsController'
                  }
              },
              resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            })

             .state('customerserviceProfile', {
                parent: 'customerservice',
                url: '/profile',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'profile.page-title.my-profile'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/profile/profile-tabs/my-profile.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('editcustomerserviceProfile', {
                parent: 'customerserviceProfile',
                url: '/update',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'patient.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/profile/profile-tabs/edit-my-profile.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })
             .state('customerserviceUpdatePassword', {
                parent: 'customerservice',
                url: '/updatepassword',
                data: {
                    roles: ['CUSTOMER_SERVICES'],
                    pageTitle: 'profile.page-title.update-password'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/customerservices/profile/profile-tabs/update-password.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
                 })
.state('clinicadminannouncements', {
                parent: 'clinicadmin-dashboard',
                url: '/{clinicId}/clinicadmin-announcements',
                data: {
                    roles: ['CLINIC_ADMIN'],
                    pageTitle: 'console.page-title.announcements'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/clinicadmin/announcements/views/announcements.html',
                        controller: 'clinicadminannouncementsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('clinic');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
.state('hcpannouncements', {
                parent: 'hcp-dashboard',
                url: '/{clinicId}/hcp-announcements',
                data: {
                    roles: ['HCP'],
                    pageTitle: 'console.page-title.announcements'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/hcp/announcements/views/announcements.html',
                        controller: 'clinicadminannouncementsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('clinic');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
.state('patientannouncements', {
                parent: 'patient-dashboard',
                url: '/patient-announcements',
                data: {
                    roles: ['PATIENT'],
                    pageTitle: 'console.page-title.announcements'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/patient/announcements/views/announcements.html',
                        controller: 'patientsannouncementsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('clinic');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
            .state('associateAnnouncements', {
              parent: 'console',
              url: '/associates/announcements',
              data: {
                  roles: ['ASSOCIATES'],
                  pageTitle: 'console.page-title.announcements'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/announcements/views/associate/view.html',
                      controller: 'announcementsController'
                  }
              },
              resolve: {
                /*loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],*/
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            }).state('customerserviceAnnouncements', {
              parent: 'console',
              url: '/customerservice/announcements',
              data: {
                  roles: ['CUSTOMER_SERVICES'],
                  pageTitle: 'console.page-title.announcements'
              },
              views: {
                  'content@': {
                      templateUrl: 'scripts/modules/common/console/announcements/views/customerservice/view.html',
                      controller: 'announcementsController'
                  }
              },
              resolve: {
                /*loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('LoginAnalyticsModule');
                    }],*/
                  translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                      $translatePartialLoader.addPart('console');
                      return $translate.refresh();
                  }],
                  authorize: ['Auth',
                      function(Auth) {
                          return Auth.authorize(false);
                      }
                  ]
              }
            }) 
            .state('caregiverdashboardCaregiver', {
                parent: 'caregiver-dashboard',
                url: '/caregiver-list/{patientId}',
                data: {
                    roles: ['CARE_GIVER'],
                    pageTitle: 'patient.page-title.caregivers'
                },
                views: {
                    'caregiver-view': {
                        templateUrl: 'scripts/modules/caregiver/graph/views/caregiverlist.html',
                        controller: 'graphController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientGraphModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
                .state('timslog', {

                parent: 'admin',
                url: '/tims',
                data: {
                     roles: ['ADMIN'],
                    pageTitle: 'profile.page-title.tims'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/tims/views/log_info.html',
                        controller: 'timsController'
                    }
                },
                  resolve: {
                 loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                 authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }

                 })

   .state('executeJob', {
                parent: 'admin',
                url: '/execute_job',
                data: {
                     roles: ['ADMIN'],
                    pageTitle: 'profile.page-title.tims'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/tims/views/execute_job.html',
                        controller: 'timsController'
                    }
                },
                  resolve: {
                 loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                         $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                 authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
                
              })
                .state('executedLog', {
                parent: 'clinic-admin-user-profile',
                url: '/executedLog/{fileurl}',
                data: {
                     roles: ['ADMIN'],
                    pageTitle: 'profile.page-title.tims'
                },
                views: {
                    'content@': {
                         templateUrl: 'scripts/modules/tims/views/executedLog.html',
                        controller: 'timsController'
                    }
                },
                  resolve: {
                 loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                         $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                 authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
                
            })

                .state('caregiverpatientDiagnostic', {
                parent: 'caregiver-dashboard',
                url: '/patientDiagnostic/{patientId}',
                data: {
                    roles: ['CARE_GIVER'],
                    pageTitle: 'profile.page-title.benchmarking'
                },
                views: {
                    'caregiver-view': {
                        templateUrl: 'scripts/modules/caregiver/graph/views/patientDiagnostic.html',
                        controller: 'patientDiagnosticController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('PatientDiagnosticModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
                .state('fotaHome', {
                parent: 'RnDadmin',
                url: '/fota',
                data: {
                     roles: ['R&D_ADMIN','CUSTOMER_SERVICES'],
                    pageTitle: 'profile.page-title.fota'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/RnDadmin/FotaHome/views/fotahome.html',
                        controller: 'fotaController'
                    }
                },
                  resolve: {
                 loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                 authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }

                 })
                .state('RnDadminProfile', {
                parent: 'RnDadmin',
                url: '/profile',
                data: {
                    roles: ['R&D_ADMIN','CUSTOMER_SERVICES'],
                    pageTitle: 'profile.page-title.my-profile'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/RnDadmin/FotaHome/views/my-profile.html',
                        controller: 'adminProfileController'
                    }
                },
                resolve: {
                    //Lazy loading of controllers and external dependencies so boost intial load
                    //time
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('AdminProfileModule');
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
        .state('caregiverannouncements', {
                parent: 'caregiver-dashboard',
                url: '/caregiver-patient-announcements/{patientId}',
                data: {
                    roles: ['CARE_GIVER'],
                    pageTitle: 'console.page-title.announcements'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/modules/patient/announcements/views/announcements.html',
                        controller: 'patientsannouncementsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('patient-user');
                        return $translate.refresh();
                    }],
                    authorize: ['Auth',
                        function(Auth) {
                            return Auth.authorize(false);
                        }
                    ]
                }
            })
}]);

