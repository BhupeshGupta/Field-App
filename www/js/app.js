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

.run(function ($ionicPlatform, SessionService, SettingsFactory) {
    $ionicPlatform.ready(function () {
        SettingsFactory.loadAppConfig();
    });
})

.constant('AppVersion', '1.0.2')

.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
    $urlRouterProvider.otherwise('/');
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
            settings: function (SessionService, $state, $timeout) {
                if (SessionService.isLoggedIn()) {
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
            user: function (SessionService) {
                SessionService.setupUser();
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
})

.filter('htmlToPlaintext', function () {
    return function (text) {
        return String(text).replace(/<[^>]+>/gm, '');
    };
});
