window.ionic.Platform.ready(function () {
    angular.bootstrap(document, ['starter']);
});

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var receipt_module = angular.module('starter', [
    'ionic',
    'ngCordova',
    'ion-autocomplete',
    'pascalprecht.translate',
    'ngStorage'
])

.constant('ApiEndpoint', {
    url: '/api'
})

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

//.run(function ($ionicPlatform, UserService, SettingsFactory) {
//    $ionicPlatform.ready(function () {
//        UserService.get_startup_data().then(function (data) {
//            if (data.data.server_date !== moment().format('YYYY-MM-DD'))
//                $ionicPopup.alert({
//                    template: '<p>There seems to be date issue. Please check device date.</p>',
//                    title: 'Error'
//                });
//
//            // Save to settings settings
//            var settings = SettingsFactory.get();
//            settings.startup = {
//                user: data.data.user_info[data.data.user.name],
//                can_write: data.data.user.can_write
//            };
//            SettingsFactory.set(settings);
//            console.log(JSON.stringify(settings));
//        });
//
//    });
//})
.constant('AppVersion', '1.1')

.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
    $urlRouterProvider.otherwise('/home');
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);

    $stateProvider.state('root', {
        templateUrl: 'components/main/main.html',
        controller: 'MainController',
        controllerAs: 'mc',
        abstract: true
    })

    .state('root.developer', {
        url: '/developer',
        templateUrl: 'components/developer/developer.html',
        controller: 'DeveloperController'
    })

    .state('root.login', {
        url: '/',
        templateUrl: 'components/login/login.html',
        controller: 'LoginController',
        resolve: {
            settings: function (SettingsFactory, $state, $timeout) {
                var settings = SettingsFactory.get();
                if (typeof settings.sid !== 'undefined') {
                    $timeout(function () {
                        $state.go('root.home');
                    }, 0);
                }
            }
        }
    })

    .state('root.db', {
        url: '/db',
        templateUrl: 'components/db/db.html',
        controller: 'DbController',
        controllerAs: 'dbc'
    })


    .state('root.home', {
        url: '/home',
        templateUrl: 'components/home/home.html',
        controller: 'HomeController',
        resolve: {
            user: function (UserService) {
                return UserService.loadUser();
            }
        }
    })

    .state('root.invoice', {
            url: '/invoice',
            templateUrl: 'components/invoice/invoice.html',
            controller: 'InvoiceFlowController'
        })
        .state('root.invoice.step1', {
            url: '/step1',
            views: {
                'invoice_view': {
                    templateUrl: 'components/invoice/forms/step_1.html'
                }
            }
        })
        .state('root.invoice.step1-1', {
            url: '/step1-1',
            views: {
                'invoice_view': {
                    templateUrl: 'components/invoice/forms/step_1-1.html'
                }
            }
        })
        .state('root.invoice.step2', {
            url: '/step2',
            views: {
                'invoice_view': {
                    templateUrl: 'components/invoice/forms/step_2.html'
                }
            }
        })
        .state('root.invoice.step3', {
            url: '/step3',
            views: {
                'invoice_view': {
                    templateUrl: 'components/invoice/forms/step_3.html'
                }
            }
        })
        .state('root.invoice.step4', {
            url: '/step4',
            views: {
                'invoice_view': {
                    templateUrl: 'components/invoice/forms/step_4.html'
                }
            }
        })

    .state('root.cheque', {
            url: '/cheque',
            templateUrl: 'components/cheque/cheque.html',
            controller: 'chequeFlowController',
            controllerAs: 'cc'
        })
        .state('root.cheque.details', {
            url: '/cheque/cheque_details',
            views: {
                'cheque_view': {
                    templateUrl: 'components/cheque/forms/cheque_detail.html'
                }
            }
        })
        .state('root.cheque.review', {
            url: '/cheque/cheque_review',
            views: {
                'cheque_view': {
                    templateUrl: 'components/cheque/forms/cheque_review.html'
                }
            }
        })

    .state('root.cash', {
            url: '/cheque',
            templateUrl: 'components/cash/cash.html',
            controller: 'cashFlowController',
            controllerAs: 'cc'
        })
        .state('root.cash.details', {
            url: '/cash/cash/cash_details',
            views: {
                'cash_view': {
                    templateUrl: 'components/cash/forms/cash_details.html'
                }
            }
        })
        .state('root.cash.review', {
            url: '/cash/cash_review',
            views: {
                'cash_view': {
                    templateUrl: 'components/cash/forms/cash_signature.html'
                }
            }
        });
});
