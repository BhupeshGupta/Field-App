'use strict';

receipt_module.controller('LoginController', ['$scope', '$state', 'UserService', 'SettingsFactory', '$localStorage',
    function ($scope, $state, UserService, SettingsFactory, $localStorage) {
        console.log("Hi from Login Controller");

        $scope.login_func = function () {
            UserService.login($scope.loginData.username, $scope.loginData.password).then(
                function (response) {
                    var settings = SettingsFactory.get();
                    settings.full_name = response.data.full_name;
                    settings.sid = response.data.sid;
                    SettingsFactory.set(settings);

                    console.log(JSON.stringify(SettingsFactory.get()));

                    $state.go('root.home');

                    UserService.getAppConfig();

                    $localStorage.login = {
                        username: $scope.loginData.username
                    };
                    $localStorage.password = '';
                },
                function (error) {
                    console.log("Invalid Login!");
                }
            );
            console.log("Hi from Login Function");
        };

        $scope.loginData = $localStorage.login || {
            username: '',
            password: ''
        };

}]);
