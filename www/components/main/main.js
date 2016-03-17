'use strict';

receipt_module.controller('MainController', function ($scope, $state, SettingsFactory, $ionicPopup, $translate, $rootScope, $cordovaGeolocation, $timeout) {

    var vm = this;
    vm.selectedLangage = SettingsFactory.get().language;

    $scope.logout = function () {
        $rootScope.$broadcast('user:logout');
    };

    $scope.open_developer_pane = function () {
        $ionicPopup.prompt({
            title: 'Developer Password',
            template: 'Enter developer password',
            inputType: 'password',
            inputPlaceholder: 'Password'
        }).then(function (res) {
            if (res == 'youwontknow')
                $state.go('root.developer');
        });
    };

    $scope.switchLanguage = function (language) {
        console.log("Switching language to " + language);
        $translate.use(language);

        // Save settings
        var settings = SettingsFactory.get();
        settings.language = language;
        SettingsFactory.set(settings);

        vm.selectedLangage = language;
    };

    // Set language pref while loading
    $translate.use(SettingsFactory.get().language);


    $scope.location_lock = 0;

    // Endless loop to get location
    document.addEventListener('deviceready', function () {
        var posOptions = {
            timeout: 5000,
            enableHighAccuracy: true
        };

        var myPopup = null;
        var get_location = function () {
            $cordovaGeolocation.getCurrentPosition(posOptions)
                .then(function (position) {
                    console.log(position);
                    $scope.location_lock = 1;
                    console.log("Location Locked");
                    console.log(myPopup);
                    if (myPopup)
                        myPopup.close();
                }, function (err) {
                    $scope.location_lock = 2;
                    get_location();
                    if (!myPopup) {
                        myPopup = $ionicPopup.show({
                            template: '<p>Please enable GPS</p>',
                            title: 'Wait',
                            scope: $scope,
                            buttons: []
                        });
                    }
                });
        };
        get_location();
    });

});

receipt_module.run(function ($rootScope, SettingsFactory, $state) {
    $rootScope.$on('user:logout', function () {
        var settings = SettingsFactory.get();
        delete settings.sid;
        SettingsFactory.set(settings);

        $state.go('root.login');
    });
});
