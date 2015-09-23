'use strict';

angular.module('hillromvestApp')
.directive('activeMenu', function($translate, $locale, tmhDynamicLocale) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var language = attrs.activeMenu;

      scope.$watch(function() {
        return $translate.use();
      }, function(selectedLanguage) {
        if (language === selectedLanguage) {
          tmhDynamicLocale.set(language);
          element.addClass('active');
        } else {
          element.removeClass('active');
        }
      });
    }
  };
})

.directive('activeLink', function(location) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var clazz = attrs.activeLink;
      var path = attrs.href;
      path = path.substring(1); //hack because path does bot return including hashbang
      scope.location = location;
      scope.$watch('location.path()', function(newPath) {
        if (path === newPath) {
          element.addClass(clazz);
        } else {
          element.removeClass(clazz);
        }
      });
    }
  };
});


angular.module('hillromvestApp')
.directive('navigationBar', function (Auth, Principal, $state, Account, $location) {
  return {
    templateUrl: 'scripts/components/navbar/navbar.html',
    restrict: 'E',

    controller: function ($scope, $state) {
      $scope.userRole = localStorage.getItem('role');   
      $scope.isActive = function(tab) {
        var path = $location.path();
        if (path.indexOf(tab) !== -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.signOut = function(){
        Account.get().$promise
        .then(function (account) {
          $scope.isAuthenticated = true;

        })
        .catch(function() {
          $scope.isAuthenticated = false;
          $state.go('login');
        });
      };

      $scope.logout = function(){
        Auth.signOut().then(function(data) {
          Auth.logout();
          localStorage.clear();
          $scope.signOut();
        }).catch(function(err) {
        });
      };

      $scope.account = function(){
        if($scope.userRole === "ADMIN"){
          $state.go('adminProfile');
        }else if($scope.userRole === "PATIENT"){
          $state.go("patientProfile");
        }
      };

      $scope.goToHomePage = function(){
        if($scope.userRole === "ADMIN"){
          $state.go("patientUser");
        }else if($scope.userRole === "PATIENT"){
          $state.go("patientdashboard");
        }
      };

      $scope.goToPatientDashboard = function(){
        $state.go("patientdashboard");
      };
    }
  };
});

angular.module('hillromvestApp')
.directive('navbarPopover', function(Auth, $state, Account, $compile) {
    return {
        restrict: 'A',
        template: "<span id='pop-over-link' class='cursor-pointer'><span class='icon-logged-in-user'></span><span class='user-name'>{{username}}<span class='icon-arrow-down'></span></span></span>" +
                  "<span class='hide-popup' id='pop-over-content'><div id='account' ng-click='account()'><span class='hillrom-icon icon-user-account'></span><span>My Profile</span></div><div ng-click='logout()'><span class='hillrom-icon icon-logout'></span><span>Logout </span></div></span>",
        link: function(scope, elements, attrs) {
            $("#pop-over-link").popover({
                'placement': 'bottom',
                'trigger': 'click',
                'html': true,
                'content': function() {
                    return $compile($("#pop-over-content").html())(scope);
                }
            });
        },
        controller: function ($scope) {
          $scope.username = localStorage.getItem('userFirstName');
        }
    }
});

angular.module('hillromvestApp')
.directive('navigationBarPatient', function (Auth, Principal, $state, Account, $location) {
  return {
    templateUrl: 'scripts/components/navbar/navbarpatientuser.html',
    restrict: 'E',

    controller: function ($scope, UserService) {
      $scope.notifications = 0;
      $scope.isActive = function(tab) {
        var path = $location.path();
        if (path.indexOf(tab) !== -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.getNotifications = function(){
        UserService.getPatientNotification(localStorage.getItem("patientID"), new Date().getTime()).then(function(response){                  
          $scope.notifications = response.data;
          if($scope.notifications.length < 2){
            $scope.no_of_notifications = $scope.notifications.length;
          }else{
            $scope.no_of_notifications = 2;
          }          
        });
      };
      $scope.getNotifications();
    }
  };
});

angular.module('hillromvestApp')
.directive('navigationBarHcp',['Auth', 'Principal', '$state', 'Account', '$location', function (Auth, Principal, $state, Account, $location) {
  return {
    templateUrl: 'scripts/components/navbar/navbarhcp.html',
    restrict: 'E',

    controller: function ($scope, UserService) {
      $scope.notifications = 0;
      $scope.isActive = function(tab) {
        var path = $location.path();
        if (path.indexOf(tab) !== -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.account = function(){
        $state.go("hcpUserProfile");
      };

      $scope.getNotifications = function(){
        UserService.getPatientNotification(localStorage.getItem("patientID"), new Date().getTime()).then(function(response){                  
          $scope.notifications = response.data;
          if($scope.notifications.length < 2){
            $scope.no_of_notifications = $scope.notifications.length;
          }else{
            $scope.no_of_notifications = 2;
          }          
        });
      };

      $('html').on('mouseup', function(e) {
        if(!$(e.target).closest('.popover').length) {
          $('.popover').each(function(){
            $(this.previousSibling).popover('hide');
          });
        }
      });

      $("#account").on('click', function(e) {
        e.stopPropagation();
    });
    }
  };
}]);


angular.module('hillromvestApp')
.directive('navigationBarClinicadmin',['$state', '$location', function ($state, $location) {
  return {
    templateUrl: 'scripts/components/navbar/navbarclinicadmin.html',
    restrict: 'E',

    controller: function ($scope, UserService) {
      $scope.notifications = 0;
      $scope.isActive = function(tab) {
        var path = $location.path();
        if (path.indexOf(tab) !== -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.account = function(){
        $state.go("clinicadminUserProfile");
      };
    }
  };
}]);
