'use strict';

receipt_module.controller('LoginController', ['$scope', '$state', 'SessionService', 'SettingsFactory', '$localStorage',
    function ($scope, $state, SessionService, SettingsFactory, $localStorage) {
        console.log("Hi from Login Controller");

        $scope.login_func = function () {
            SessionService.login($scope.loginData.username, $scope.loginData.password).then(
                function (response) {
                    $state.go('root.home');

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
