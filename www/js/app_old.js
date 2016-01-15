// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


receipt_module.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('root.good_receipt', {
            url: '/good_receipt',
            templateUrl: 'components/good_receipt/good_receipt.html',
            controller: 'good_receipt_controller'
        })
        .state('root.good_receipt.customer_name', {
            url: '/customer_name',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/customer_name.html'
                }
            }
        })
        .state('root.good_receipt.item_delievered_name', {
            url: '/item_delievered_name',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/item_delievered_name.html'
                }
            }
        })
        .state('root.good_receipt.item_delievered_quantity', {
            url: '/item_delievered_quantity',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/item_delievered_quantity.html'
                }
            }
        })
        .state('root.good_receipt.item_received_name', {
            url: '/item_received_name',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/item_received_name.html'
                }
            }
        })
        .state('root.good_receipt.item_received_quantity', {
            url: '/item_received_quantity',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/item_received_quantity.html'
                }
            }
        })
        .state('root.good_receipt.acknowledgement', {
            url: '/acknowledgement',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/acknowledgement.html'
                }
            }
        })
        .state('root.good_receipt.take_signature', {
            url: '/take_signature',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/take_signature.html',
                    controller: 'take_signature_controller'
                }
            }
        })
        .state('root.good_receipt.take_picture_location', {
            url: '/take_signature',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'components/good_receipt/forms/take_picture_location.html'
                }
            }
        })
        .state('root.payment_receipt', {
            url: '/payment_receipt',
            abstract: true,
            templateUrl: 'components/payment_receipt/payment_receipt.html',
            controller: 'payment_receipt_controller'
        })
        .state('root.payment_receipt.payment_receipt_information', {
            url: '/payment_receipt_information',
            views: {
                'payment_receipt_content_view': {
                    templateUrl: 'components/payment_receipt/forms/payment_receipt_information.html'
                }
            }
        })
        .state('root.payment_receipt.payment_receipt_acknowledgement', {
            url: '/payment_receipt_acknowledgement',
            views: {
                'payment_receipt_content_view': {
                    templateUrl: 'components/payment_receipt/forms/payment_receipt_acknowledgement.html'
                }
            }
        });
});


receipt_module.constant('images_link_empty', [
    {
        img_url: 'img/ec19.jpg',
        id: 'EC19',
        name: 'EC19'
    }, {
        img_url: 'img/ec35.jpg',
        id: 'EC35',
        name: 'EC35'
    }, {
        img_url: 'img/ec475vot.jpg',
        id: 'EC47.5',
        name: 'EC47.5'
    }, {
        img_url: 'img/ec475lot.png',
        id: 'EC47.5L',
        name: 'EC47.5LOT'
    }
]);

receipt_module.constant('images_link_filled', [
    {
        img_url: 'img/fc19.jpg',
        id: 'FC19',
        name: 'FC19'
    }, {
        img_url: 'img/fc35.jpg',
        id: 'FC35',
        name: 'FC35'
    }, {
        img_url: 'img/fc475vot.jpg',
        id: 'FC47.5',
        name: 'FC47.5'
    }, {
        img_url: 'img/fc475lot.png',
        id: 'FC47.5L',
        name: 'FC47.5LOT'
    }
]);


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
    $translateProvider.translations('en', {
        LOGIN: 'Login',
        USERNAME: 'Username',
        PASSWORD: 'Password',
        SELECT_RECEIPT: 'Select Receipt',
        LOG_OUT: 'Log Out',
        GOOD_RECEIPT: 'Good Receipt',
        PAYMENT_RECEIPT: 'Payment Receipt',
        ACKNOWLEDGEMENT: 'Acknowledgement',
        GOOD_RECEIPT_DETAILS: 'Good Receipt Details',
        CUSTOMER_NAME: 'Customer Name',
        ITEM_DELIEVERED_NAME: 'Item Delivered Name',
        ITEM_DELIEVERED_QUANTITY: 'Item Delivered Quantity',
        ITEM_RECEIVED_NAME: 'Item Received Name',
        ITEM_RECEIVED_QUANTITY: 'Item Received Quantity',
        VEHICLE_NUMBER: 'Vehicle Number',
        CUSTOMER_DOCUMENT_ID: 'Customer Document Id',
        TAKE_SIGNATURE: 'Take Signature',
        CONFIRM: 'Confirm',
        NEXT: 'Next',
        EMPTY: 'Empty',
        FILLED: 'Filled',
        QUANTITY: 'Quantity',
        PAYMENT_RECEIPT_INFORMATION: 'Payment Receipt Information',
        AMOUNT_PER_ITEM: 'Amount Per Item',
        PAYMENT_RECEIPT_ACKNOWLEDGEMENT: 'Payment Receipt Acknowledgement',
        PAYMENT_RECEIPT_DETAILS: 'Payment Receipt Details',
        SIGNATURE: 'Signature',
        SAVE: 'Save',
        CLEAR: 'Clear',
        STOCK_OWNER: 'Stock Owner',
        VOUCHER_ID: 'Voucher ID',
        TRANSACTION_TYPE: 'Transaction Type',
        TV_OUT: 'TV Out',
        REFILL: 'Refill',
        NEW_CONNECTION: 'New Connection',
        ITEM: 'Item',
        TAKE_NEW_IMAGE: 'Take New Image',
        SKIP: 'Skip',
        DETAILS: 'Details'
    });

    $translateProvider.translations('hi', {
        LOGIN: 'लॉग इन',
        USERNAME: 'यूजर का नाम',
        PASSWORD: 'पासवर्ड',
        SELECT_RECEIPT: 'चयन करें रसीद',
        LOG_OUT: 'लॉग आउट',
        GOOD_RECEIPT: 'चालान',
        PAYMENT_RECEIPT: 'भुगतान रसीद',
        ACKNOWLEDGEMENT: 'प्राप्ति सूचना',
        GOOD_RECEIPT_DETAILS: 'चालान विवरण',
        CUSTOMER_NAME: 'ग्राहक का नाम',
        ITEM_DELIEVERED_NAME: 'आइटम वितरित नाम',
        ITEM_DELIEVERED_QUANTITY: 'आइटम वितरित मात्रा',
        ITEM_RECEIVED_NAME: 'आइटम प्राप्त नाम',
        ITEM_RECEIVED_QUANTITY: 'आइटम प्राप्त मात्रा',
        VEHICLE_NUMBER: 'वाहन संख्या',
        CUSTOMER_DOCUMENT_ID: 'ग्राहक दस्तावेज़ ID',
        TAKE_SIGNATURE: 'हस्ताक्षर लें',
        CONFIRM: 'पुष्टि करें',
        NEXT: 'अगला',
        EMPTY: 'खाली',
        FILLED: 'भरा हुआ',
        QUANTITY: 'मात्रा',
        PAYMENT_RECEIPT_INFORMATION: 'भुगतान रसीद सूचना',
        AMOUNT_PER_ITEM: 'आइटम प्रति राशि',
        PAYMENT_RECEIPT_ACKNOWLEDGEMENT: 'भुगतान रसीद पावती',
        PAYMENT_RECEIPT_DETAILS: 'भुगतान रसीद विवरण',
        SIGNATURE: 'हस्ताक्षर',
        SAVE: 'सहेजें',
        CLEAR: 'साफ़ करें',
        STOCK_OWNER: 'विक्रेता',
        VOUCHER_ID: 'वाउचर आईडी',
        TRANSACTION_TYPE: 'सौदे का प्रकार',
        TV_OUT: 'टीवी आउट',
        REFILL: 'रिफिल',
        NEW_CONNECTION: 'नया कनेक्शन',
        ITEM: 'आइटम',
        TAKE_NEW_IMAGE: 'नई छवि ले',
        SKIP: 'स्किप',
        DETAILS: 'विवरण'
    });

    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy(null);
});
