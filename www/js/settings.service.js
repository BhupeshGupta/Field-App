angular.module('starter')
    .factory('SettingsFactory', settingsFactory);

function settingsFactory($localStorage) {
    var SETTINGS_PREFIX = 'settings_';

    var defaultSettings = {
        serverBaseUrl: 'api',
        reviewServerBaseUrl: '/review',
        language: 'en'
    };

    function setupConfig() {

    }

    function loadAppConfig() {
        return $http.get("https://erp.arungas.com/app_conf.json")
            .then(function (data) {
                $localStorage[SETTINGS_PREFIX + 'urlConf'] = data.data;
            });
    }

    return {
        get: _retrieveSettings,
        set: _saveSettings,
        getERPServerBaseUrl: function () {
            return _retrieveSettings().serverBaseUrl;
        },
        getReviewServerBaseUrl: function () {
            return 'http://192.168.31.124:1337';
        }
    };

}
