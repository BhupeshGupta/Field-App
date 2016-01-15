'use strict';

receipt_module.controller('chequeFlowController', function ($scope, $state, $q, $http, $cordovaCamera, DocumentService) {

    $scope.uploadConfirmation = function () {
        $state.go('root.invoice.enter_data_manually');
    };

    console.log("Hi from Cheque Controller");


    $scope.user_input = {
        company: '',
        customer_account: '',
        bank_account: '',
        amount: '',
        instrumentnumber: '',
        instrumentdate: '',
        instrumentbank: '',
        remarks: ''
    };

    $scope.company_search = function (query) {
        var promise = $q.defer();
        DocumentService.search('Company', query, {}).success(function (data) {
            promise.resolve(data.results);
        });
        return promise.promise;
    }

    $scope.account_search = function (query) {
        var promise = $q.defer();
        DocumentService.search('Account', query, {
            company: $scope.user_input.company[0].value
        }).success(function (data) {
            promise.resolve(data.results);
        });
        return promise.promise;
    }

    $scope.instrumentDate = {
        inputDate: new Date(), //Optional
        templateType: 'popup', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        callback: function (val) { //Mandatory
            datePickerCallback(val);
        },
        dateFormat: 'yyyy-MM-dd', //Optional
        closeOnSelect: true, //Optional
    };

    var datePickerCallback = function (val) {
        if (typeof (val) === 'undefined') {
            console.log('No date selected');
        } else {
            $scope.user_input.instrumentdate = moment(val).format("YYYY-MM-DD");
            console.log('Selected date is : ', val)
            $scope.instrumentDate.inputDate = val;
        }
    };

    var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };

    $scope.takePic1 = function () {
        return $q(function (resolve, reject) {
            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.pic1 = "data:image/jpeg;base64," + imageData;
                resolve();
            }, function (err) {
                reject();
            });
        });
    }
    $scope.captureAndReview = function () {
        $scope.takePic1().then(function (image) {
            $state.go('root.cheque.review');
        })
    };

    $scope.createVoucher = function () {
        DocumentService.create('Journal Voucher', {
            "naming_series": "JV-",
            "voucher_type": "Bank Voucher",
            "doctype": "Journal Voucher",
            "cheque_no": $scope.user_input.instrumentnumber,
            "user_remark": $scope.user_input.remarks,
            "docstatus": 1,
            "cheque_date": $scope.user_input.instrumentdate,
            "company": $scope.user_input.company[0].value,
            "reference_bank": $scope.user_input.instrumentbank.split('T')[0],
            "entries": [
                {
                    "doctype": "Journal Voucher Detail",
                    "debit": $scope.user_input.amount,
                    "account": $scope.user_input.bank_account[0].value
                },
                {
                    "doctype": "Journal Voucher Detail",
                    "credit": $scope.user_input.amount,
                    "account": $scope.user_input.customer_account[0].value
                }
            ],
            "posting_date": moment().format("YYYY-MM-DD")
        }).then(
            function(success) {
                console.log(success);
            });
    };

});
