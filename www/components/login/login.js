'use strict';

receipt_module.controller('LoginController', ['$scope', '$state', 'UserService', 'SettingsFactory', function ($scope, $state, UserService, SettingsFactory) {
    console.log("Hi from Login Controller");

    $scope.login_func = function () {
        UserService.login($scope.loginData.username, $scope.loginData.password).then(
            function (response) {
                var settings = SettingsFactory.get();
                settings.full_name = response.data.full_name;
                settings.sid = response.data.sid
                SettingsFactory.set(settings);
                
                console.log(JSON.stringify(SettingsFactory.get()));
                
                $state.go('root.home');
            },
            function (error) {
                console.log("Invalid Login!");
            }
        );
        console.log("Hi from Login Function");
    };

    $scope.loginData = {
        username: 'Administrator',
        password: 'admin'
    };

}]);
