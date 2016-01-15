'use strict';

receipt_module.controller('MainController', function ($scope, $state, SettingsFactory) {

    $scope.logout = function () {
        var settings = SettingsFactory.get();
        delete settings['sid'];
        SettingsFactory.set(settings);

        $state.go('root.login');
    };

});
