console.log("Services.js ran");


// Default Http Header Change
receipt_module.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
});


// Global Loading
receipt_module.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope, $q) {
        return {
            request: function (config) {
                if (config.loading && config.loading == true)
                    $rootScope.$broadcast('loading:show');
                return config
            },
            response: function (response) {
                $rootScope.$broadcast('loading:hide');
                return response
            },
            requestError: function (err) {
                $rootScope.$broadcast('loading:hide');
                return err;
            },
            responseError: function (err) {
                $rootScope.$broadcast('loading:hide');
                return $q.reject(err);
            }
        }
    })
});
receipt_module.run(function ($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i><br/>Loading...',
            animation: 'fade-in',
            showBackdrop: true,
            delay: 1000
        })
    })

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide()
    })
});

// UA & Error Interceptor
receipt_module.config(function ($httpProvider) {
    var popUp = null;
    $httpProvider.interceptors.push(function ($q, $injector, $rootScope, $timeout, $cordovaNetwork) {
        return {
            request: function (config) {
                // Create and append user id
                config.headers['User-Id'] = JSON.stringify(window.device);

                //                // Check for internet connectivity
                //                if ($cordovaNetwork.isOffline() && !popUp) {
                //                    // Solve circular dependency
                //                    var $ionicPopup = $injector.get('$ionicPopup');
                //                    $ionicPopup.alert({
                //                        title: 'Error',
                //                        template: '<p>Please connect to internet!</p>'
                //                    });
                //                    config.timeout = 0;
                //                }

                return config
            },
            responseError: function (rejection) {
                var stat = rejection.status;
                var msg = '';
                
                // Solve circular dependency
                var $ionicPopup = $injector.get('$ionicPopup');
                
                console.log(rejection);
                
                // ERP specific error extraction
                if (rejection.data && rejection.data.message)
                    msg = rejection.data.message;
                else if (rejection.data && rejection.data._server_messages)
                    msg = rejection.data._server_messages;
                
                // Generic error extraction
                else if (stat == 403) {
                    msg = 'Login Required';
                    $timeout(function () {
                        $rootScope.$broadcast('user:logout')
                    }, 0);
                } else if (stat == 500)
                    msg = 'Internal Server Error';
                else if (stat == 501)
                    msg = 'Server Error';
                else if (stat == 502)
                    msg = 'Server is Offline';
                else if (stat == 503)
                    msg = 'Server is Overload or down';
                else if (stat == 504)
                    msg = 'Server is Offline';

                if (msg != '')
                    $ionicPopup.alert({
                        title: 'Error',
                        template: msg
                    });

                return $q.reject(rejection);
            }
        }
    })
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


receipt_module.factory('UserService', function ($http, SettingsFactory, $rootScope, $q) {
    $rootScope.userLoaded = false;
    
    var factory = {    
        login: function (usr, pwd) {
            var data = {
                usr: usr,
                pwd: pwd
            };
            var url = SettingsFactory.getServerBaseUrl() + '/api/method/login?' + $.param(data);
            return $http({
                url: url,
                method: 'POST',
                loading: true
            });
        },

        // function used by loadUser function
        get_startup_data: function () {
            var data = {
                cmd: 'startup',
                _type: 'POST'
            };
            return $http({
                url: SettingsFactory.getServerBaseUrl(),
                data: $.param(data),
                method: 'POST'
            });
        },

        loadUser: function (force) {
            var defferd = $q.defer();
            if (!$rootScope.userLoaded) {
                console.log($rootScope.startup);
                
               this.get_startup_data().then(function (data) {
                   $rootScope.startup = {
                       user: data.data.user_info[data.data.user.name],
                       can_write: data.data.user.can_write,
                       server_time: data.data.server_date
                   };
                   defferd.resolve();
                   $rootScope.userLoaded = true;
               }).catch(function () {
                   defferd.reject();
                   $rootScope.$broadcast('user:logout');
               })
            }
            else
                defferd.resolve();

            return defferd.promise;
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
                filters: JSON.stringify(filters)
            }
            var url = SettingsFactory.getServerBaseUrl() + '?' + $.param(data);
            return $http({
                url: url,
                loading: true,
                method: 'GET'
            });
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
