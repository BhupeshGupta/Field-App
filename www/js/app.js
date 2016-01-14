// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var receipt_module = angular.module('starter', [
    'ionic',
    'ngCordova',
    'ion-autocomplete',
    'ionic-datepicker',
//    'pascalprecht.translate'
])

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

.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('root', {
            templateUrl: 'components/main/main.html',
            abstract: true
        })
        .state('root.login', {
            url: '/',
            templateUrl: 'components/login/login.html',
            controller: 'LoginController'
        })
        .state('root.home', {
            url: '/home',
            templateUrl: 'components/home/home.html',
            controller: 'HomeController'
        })

        .state('root.invoice', {
            url: '/invoice',
            templateUrl: 'components/invoice/invoice.html',
            controller: 'InvoiceFlowController'
        })
        .state('root.invoice.selection', {
            url: '/invoice',
            views: {
                'invoice_view': {
                    templateUrl: 'components/invoice/forms/invoice_selection_screen.html'
                }
            }
        })
        .state('root.invoice.enter_data_manually', {
            url: '/invoice/enter_data_manually',
            views: {
                'invoice_view': {
                    templateUrl: 'components/invoice/forms/invoice_manually.html'
                }
            }
        })
        .state('root.invoice.invoicereview', {
            url: '/invoice/invoicereview',
            views: {
                'invoice_view': {
                    templateUrl: 'components/invoice/forms/invoice_upload.html'
                }
            }
        })
    
        .state('root.cheque', {
            url: '/cheque',
            templateUrl: 'components/cheque/cheque.html',
            controller: 'chequeFlowController'
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
            controller: 'cashFlowController'
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
                    templateUrl: 'components/cash/forms/cash_signature.html',
                    controller: 'take_signature_controller'
                }
            }
        });
});
