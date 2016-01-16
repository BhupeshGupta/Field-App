console.log("Services.js ran");


// Default Http Header Change
receipt_module.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
});

receipt_module.service('getInvoiceMetaData', function ($http, SettingsFactory) {
    this.get_meta = function (meta) {
        return $http({
            url: SettingsFactory.getServerBaseUrl() + '/?' + $.param({
                cmd: "flows.flows.controller.ephesoft_integration.get_meta",
                doc: meta,
                _type: 'POST',
            }),
            method: 'GET',
            cache: false
        });
    };
});


receipt_module.factory('SettingsFactory', [function () {
    var _settingsKey = "appSettings",
        defaultSettings = {
            serverBaseUrl: '/api',
            language: 'en'
        };

    function _retrieveSettings() {
        var settings = localStorage[_settingsKey];
        if (settings)
            return angular.fromJson(settings);
        return defaultSettings;
    }

    function _saveSettings(settings) {
        localStorage[_settingsKey] = angular.toJson(settings);
    }
    return {
        get: _retrieveSettings,
        set: _saveSettings,
        getServerBaseUrl: function () {
            return _retrieveSettings().serverBaseUrl;
        },
        getSid: function () {
            return _retrieveSettings().sid;
        }
    }
}]);


receipt_module.factory('UserService', function ($http, SettingsFactory) {
    var factory = {
        login: function (usr, pwd) {
            var data = {
                usr: usr,
                pwd: pwd
            };
            var url = SettingsFactory.getServerBaseUrl() + '/api/method/login?' + $.param(data);
            return $http.post(url);
        }
    };

    return factory;
});


receipt_module.factory('DocumentService', function ($http, SettingsFactory) {
    var factory = {
        search: function (documentType, query, filters) {
            var data = {
                txt: query,
                doctype: documentType,
                cmd: 'frappe.widgets.search.search_link',
                _type: 'GET',
                sid: SettingsFactory.getSid(),
                filters: JSON.stringify(filters)
            }
            var url = SettingsFactory.getServerBaseUrl() + '?' + $.param(data);
            return $http.get(url);
        },
        create: function (documentType, document) {
            return $http.post(
                SettingsFactory.getServerBaseUrl() + '/api/resource/' + documentType + '/',
                $.param({
                    data: JSON.stringify(document)
                })
            );
        }
    };

    return factory;
});
