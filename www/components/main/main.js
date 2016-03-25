'use strict';

receipt_module.controller('MainController', mainController);


function mainController(
    $scope, $state, SettingsFactory, $ionicPopup, $translate, $rootScope,
    $cordovaGeolocation, $timeout, UploadService, AppVersion,
    $localStorage, SessionService
) {

    var vm = this;
    vm.selectedLangage = SettingsFactory.get().language;
    vm.triggerUpload = triggerUpload;
    vm.pendingUploadCount = 'N/a';
    vm.appVersion = AppVersion;
    vm.SessionService = SessionService;

    getNumberOfPendingFilesCount();

    // TODO: config service
    //    UserService.getAppConfig().then(function (data) {
    //        $localStorage.appConfig = data.data;
    //    });

    function triggerUpload() {
        UploadService.upload();
    }

    function getNumberOfPendingFilesCount() {
        UploadService.count().then(function (count) {
            vm.pendingUploadCount = count;
        });
    }

    $rootScope.$on('uploadService:update', function () {
        getNumberOfPendingFilesCount();
    });

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
    //    document.addEventListener('deviceready', function () {
    //        var retryInterval = 5000;
    //
    //        var posOptions = {
    //            timeout: retryInterval,
    //            enableHighAccuracy: true
    //        };
    //
    //        var myPopup = null;
    //        var total_wait = 0;
    //        var get_location = function () {
    //            $cordovaGeolocation.getCurrentPosition(posOptions)
    //                .then(function (position) {
    //                    console.log(position);
    //                    $scope.location_lock = 1;
    //                    console.log("Location Locked");
    //                    console.log(myPopup);
    //                    if (myPopup)
    //                        myPopup.close();
    //                }, function (err) {
    //                    var wait_limit = ($localStorage.appConfig && $localStorage.appConfig.gpsStartupDelay) || 2 * 60 * 1000;
    //                    total_wait += retryInterval;
    //                    var pending_time = wait_limit - total_wait;
    //                    if (pending_time < 0 && myPopup) {
    //                        myPopup.close();
    //                    }
    //
    //                    $scope.gprTimer = (pending_time / 1000).toString() + ' Sec';
    //
    //                    $scope.location_lock = 2;
    //                    get_location();
    //                    if (!myPopup) {
    //                        myPopup = $ionicPopup.show({
    //                            template: '<p>Wating for location ({{gprTimer}})</p>',
    //                            title: 'Wait',
    //                            scope: $scope,
    //                            buttons: []
    //                        });
    //                    }
    //                });
    //        };
    //        get_location();
    //    });

}
