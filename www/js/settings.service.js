angular.module('starter')
    .factory('SettingsFactory', settingsFactory);

function settingsFactory($localStorage) {
    var SETTINGS_PREFIX = 'settings_';
    var urlConfigCache = SETTINGS_PREFIX + 'urlConf';

    var defaultSettings = {
        serverBaseUrl: 'https://erp.arungas.com',
        reviewServerBaseUrl: '/review',
        language: 'hi',
        autoVoucherId: true
    };

    if (!$localStorage.settings) {
        $localStorage.settings = defaultSettings;
    }

    function setupConfig(config) {
        if ($localStorage[urlConfigCache]) {
            $localStorage[urlConfigCache] = config;
        }
        angular.extend($localStorage.settings, config || $localStorage[urlConfigCache]);
    }

    setupConfig();

    return {
        get: function () {
            return $localStorage.settings;
        },
        getERPServerBaseUrl: function () {
            if (window.location.protocol != 'http:')
                return this.get().serverBaseUrl;
            else
                return '/api';
        },
        getReviewServerBaseUrl: function () {
            return 'http://192.168.31.124:1337';
        },
        setupConfig: setupConfig
    };

}
