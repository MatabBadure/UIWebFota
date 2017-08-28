'use strict';
/* jshint unused:false */

/**
 * @ngdoc overview
 * @name hillromvestApp
 * @description
 *
 * Main configuration of the application.
 */

angular.module('hillromvestApp').value('globalConfig', {
  locale: 'en-US',
  siteKey: '6LdXAi4UAAAAANmuHKtaEFqkCE_XLRE_qS4jgGxJ',
  passRegEx: '/^(?=^.{8,}$)(?=.*\\d)(?=.*[!@#$%^&*]+)(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/'
});