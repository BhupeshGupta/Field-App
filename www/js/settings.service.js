angular.module('starter')
    .factory('SettingsFactory', settingsFactory);

function settingsFactory($localStorage, $http) {
    var SETTINGS_PREFIX = 'settings_';
    var urlConfigCache = SETTINGS_PREFIX + 'urlConf';

    var defaultSettings = {
        serverBaseUrl: '/api',
        reviewServerBaseUrl: '/review',
        language: 'hi'
    };

    if (!$localStorage.settings) {
        $localStorage.settings = defaultSettings;
    }

    function setupConfig() {
        angular.extend($localStorage.settings, $localStorage[urlConfigCache]);
    }

    setupConfig();

    function loadAppConfig() {
        return $http.get($localStorage.settings.serverBaseUrl + "/app_conf.json?" + moment().valueOf())
            .then(function (data) {
                $localStorage[urlConfigCache] = data.data;
                setupConfig();
            });
    }

    return {
        get: function () {
            return $localStorage.settings;
        },
        getERPServerBaseUrl: function () {
            return this.get().serverBaseUrl;
        },
        getReviewServerBaseUrl: function () {
            return 'http://192.168.31.124:1337';
        },
        loadAppConfig: loadAppConfig
    };

}
