'use strict';

receipt_module.controller('MainController', function ($scope, $state, SettingsFactory, $ionicPopup, $translate) {

    $scope.logout = function () {
        var settings = SettingsFactory.get();
        delete settings['sid'];
        SettingsFactory.set(settings);

        $state.go('root.login');
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
    };
    
    // Set language pref while loading
    $translate.use(SettingsFactory.get().language);

});
