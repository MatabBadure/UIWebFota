'use strict';

angular.module('hillromvestApp')
    .factory('Language', ['$q', '$http', '$translate', 'LANGUAGES', function ($q, $http, $translate, LANGUAGES) {
        return {
            getCurrent: function () {
                var deferred = $q.defer();
                // The following commented code is for multi-language support
                var language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
                  //  var language = 'en'; //This line is added to make english default language should be removed and above line should be un-commented to support more languages 
                if (angular.isUndefined(language)) {
                    language = 'en';
                }

                deferred.resolve(language);
                return deferred.promise;
            },
            getAll: function () {
                var deferred = $q.defer();
                deferred.resolve(LANGUAGES);
                return deferred.promise;
            }
        };
    }])

/*
 Languages codes are ISO_639-1 codes, see http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 They are written in English to avoid character encoding issues (not a perfect solution)
 */
    .constant('LANGUAGES', [
        'en', 'fr'
        //JHipster will add new languages here
    ]
);




