'use strict';

angular.module('hillromvestApp')
    .config(function($stateProvider) {
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
                url: '/addProtocol',
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
              url: '/associatedPatients',
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
            .state('patientProfileEdit', {
                parent: 'patient-dashboard',
                url: '/p-profile-edit',
                data: {
                    roles: ['PATIENT'],
                    pageTitle: 'patient.page-title.patient-info'
                },
                views: {
                    'patient-view': {
                        templateUrl: 'scripts/modules/patient/profile/profile-tabs/edit-my-profile.html',
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
                url: '/hcp-patients-view/{clinicId}',
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
                 url:'/hcp-patient',
                 params: {"clinicId" : null, "patientId": null},
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
                url: '/profile',
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
                url: '/updatepassword',
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
                url: '/update',
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
                url: '/profile',
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
                url: '/updatepassword',
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
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })

            .state('editClinicadminProfile', {
                parent: 'clinic-admin-user-profile',
                url: '/update',
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
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('profile');
                        return $translate.refresh();
                    }]
                }
            })

            .state('clinicadminpatientdashboard', {
                parent: 'clinicadmin-dashboard',
                url: '/clinicadmin-patient/{clinicId}',
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
                url: '/notification-settings',
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
                url: '/notification-settings',
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
                url: '/{protocolId}/editProtocol',
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
            });
});
