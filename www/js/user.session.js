angular.module('starter')

.factory('SessionService', function ($http, SettingsFactory, $rootScope, $q, $localStorage, $ionicPopup, $state) {

    var DEFAULT_STATE = {
        userLoaded: false,
        user: null,
        canWrite: []
    };

    var state = DEFAULT_STATE;

    // `session_` prefix
    $localStorage.$default({
        session_loggedIn: false
    });


    function login(usr, pwd) {
        var data = {
            usr: usr,
            pwd: pwd
        };

        var url = SettingsFactory.getERPServerBaseUrl() + '/api/method/login?' + $.param(data);

        return $http({
            url: url,
            method: 'POST',
            loading: true
        }).then(function (data) {
            $localStorage.session_loggedIn = true;
            return data;
        });
    }

    function _getStartupData() {
        var data = {
            cmd: 'startup',
            _type: 'POST'
        };
        return $http({
            url: SettingsFactory.getERPServerBaseUrl(),
            data: $.param(data),
            method: 'POST'
        });
    }

    function setupUser() {
        return $q(function (resolve, reject) {
            if (!$localStorage.session_loggedIn) {
                return reject();
            }

            if (state.userLoaded) {
                return resolve();
            }

            _getStartupData()
                .then(function (data) {
                    state.user = data.data.user_info[data.data.user.name];
                    state.canWrite = data.data.user.can_write;

                    if (state.user.image.indexOf('http') == -1)
                        state.user.image = SettingsFactory.getERPServerBaseUrl() + state.user.image;

                    if (data.data.server_date !== moment().format('YYYY-MM-DD'))
                        $ionicPopup.show({
                            template: '<p><strong>Date Mismatch.</strong><br>Please check device date and restart the app.</p>',
                            title: 'Error',
                        });

                    state.userLoaded = true;
                    $localStorage.session_loggedIn = true;

                    return resolve();
                })
                .catch(function () {
                    logout();
                    return reject();
                });
        });
    }

    function getUser() {
        return state.user;
    }

    function logout() {
        angular.extend(state, DEFAULT_STATE);
        $localStorage.session_loggedIn = false;
        $rootScope.$broadcast('user:logout');

        $state.go('root.login');
    }

    function isWriteAuth(doctype) {
        return true;
        //        $.inArray(doctype, state.canWirte) > -1;
    }

    function isLoggedIn() {
        return $localStorage.session_loggedIn;
    }

    function setupConfig() {

    }

    function getAppConfig() {
        return $http.get("https://erp.arungas.com/app_conf.json");
    }

    return {
        login: login,
        // function used by loadUser function
        setupUser: setupUser,
        logout: logout,
        isWriteAuth: isWriteAuth,
        isLoggedIn: isLoggedIn,
        getUser: getUser,
        // TODO: move to new service
        setupConfig: setupConfig,
        state: state
    };

});
