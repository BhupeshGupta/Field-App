console.log("Services.js ran");


// Default Http Header Change
receipt_module.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
});

receipt_module.service('getInvoiceMetaData', function ($http, ApiEndpoint) {
    this.get_meta = function (meta) {
        return $http({
            url: ApiEndpoint.url + '/?' + $.param({
                cmd: "flows.flows.controller.ephesoft_integration.get_meta",
                doc: meta,
                _type: 'POST',
            }),
            method: 'GET',
            cache: false
        });
    };
});


receipt_module.factory('SettingsFactory', [function() {

    var _settingsKey = "appSettings",
        defaultSettings = {
            serverBaseUrl: 'https://erp.arungas.com'
        };

    function _retrieveSettings() {
        var settings = localStorage[_settingsKey];
        if(settings)
            return angular.fromJson(settings);
        return defaultSettings;
    }

    function _saveSettings(settings) {
        localStorage[_settingsKey] = angular.toJson(settings);
    }

    return {
        get: _retrieveSettings,
        set: _saveSettings
    }
}]);


receipt_module.factory('UserService', function ($http, ApiEndpoint) {
    var factory = {
        login: function (usr, pwd) {
            var data = {
                usr: usr,
                pwd: pwd
            };
            //app_settings.server_base_url
            var url = ApiEndpoint.url + '/api/method/login?' + $.param(data);
            return $http.post(url);
        }
    };

    return factory;
});
