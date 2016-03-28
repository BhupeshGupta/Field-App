// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


receipt_module.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('root.good_receipt', {
            url: '/good_receipt',
            templateUrl: 'components/good_receipt/good_receipt.html',
            controller: 'GoodsReceiptController',
            controllerAs: 'grc'
        })
        .state('root.good_receipt.step1', {
            url: '/step1',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/step_1.html'
                }
            }
        })
        .state('root.good_receipt.step2', {
            url: '/step2',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/step_2.html'
                }
            }
        })
        .state('root.good_receipt.step3', {
            url: '/step3',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/step_3.html'
                }
            }
        })
        .state('root.good_receipt.step4', {
            url: '/step4',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/step_4.html'
                }
            }
        })
        .state('root.good_receipt.step5', {
            url: '/step5',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/step_5.html'
                }
            }
        })
        .state('root.good_receipt.step6', {
            url: '/step6',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/step_6.html'
                }
            }
        })
        .state('root.good_receipt.step7', {
            url: '/step7',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/step_7.html'
                }
            }
        })
        .state('root.good_receipt.step8', {
            url: '/step8',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/step_8.html'
                }
            }
        })


    .state('root.payment_receipt', {
            url: '/payment_receipt',
            abstract: true,
            templateUrl: 'components/payment_receipt/payment_receipt.html',
            controller: 'PaymentReceiptController',
            controllerAs: 'prc'
        })
        .state('root.payment_receipt.step1', {
            url: '/step1',
            views: {
                'payment_receipt_content_view': {
                    templateUrl: 'components/payment_receipt/forms/step_1.html'
                }
            }
        });
});


angular.module('starter')
    .constant('gr_config', {
        filled: [
            {
                img_url: 'img/cyl1.png',
                id: 'FC19',
                name: 'FC19'
            },
            {
                img_url: 'img/cyl2.png',
                id: 'FC35',
                name: 'FC35'
            },
            {
                img_url: 'img/cyl3.png',
                id: 'FC47.5',
                name: 'FC47.5'
            },
            {
                img_url: 'img/cyl4.png',
                id: 'FC47.5L',
                name: 'FC47.5LOT'
            }
        ],
        empty: [
            {
                img_url: 'img/r_cyl1.png',
                id: 'EC19',
                name: 'EC19'
            },
            {
                img_url: 'img/r_cyl2.png',
                id: 'EC35',
                name: 'EC35'
            },
            {
                img_url: 'img/r_cyl3.png',
                id: 'EC47.5',
                name: 'EC47.5'
            },
            {
                img_url: 'img/r_cyl4.png',
                id: 'EC47.5L',
                name: 'EC47.5LOT'
            }
        ]
    });


// Signature
receipt_module.value('canvas_signature', {
    back_image: '',
    signature: '',
    signature_pad: ''
});


// File Settings
receipt_module.value('app_settings', {
    server_base_url: 'https://erp.arungas.com'
});

// Login Session ID
receipt_module.value('login_sid', {
    sid: '',
    name: ''
});


// Angular Translate
receipt_module.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy(null);
});
