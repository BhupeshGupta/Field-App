'use strict';

angular.module('starter')
    .controller('chequeFlowController', chequeFlowController);

function chequeFlowController($scope, $state, $q, $http, $cordovaCamera,
    DocumentService, FileFactory, FileDataService) {

    var vm = this;

    $scope.uploadConfirmation = function () {
        $state.go('root.invoice.enter_data_manually');
    };

    console.log("Hi from Cheque Controller");

    $scope.user_input = {
        "naming_series": "JV-",
        "voucher_type": "Bank Voucher",
        "doctype": "Journal Voucher",
        "cheque_no": '',
        "user_remark": '',
        "docstatus": 1,
        "cheque_date": moment().format("YYYY-MM-DD"),
        "company": '',
        "reference_bank": '',
        "entries": [
            // Bank Account in case of receipt
            {
                "doctype": "Journal Voucher Detail",
                "debit": '',
                "account": ''
            },
            // Customer's Account in case of receipt
            {
                "doctype": "Journal Voucher Detail",
                "credit": '',
                "account": ''
            }
        ],
        "posting_date": moment().format("YYYY-MM-DD")
    };

    $scope.company_search = function (query) {
        var promise = $q.defer();
        DocumentService.search('Company', query, {}).success(function (data) {
            promise.resolve(data.results);
        });
        return promise.promise;
    };

    $scope.account_search = function (query) {
        var promise = $q.defer();
        DocumentService.search('Account', query, {
            company: $scope.user_input.company[0].value,
            group_or_ledger: 'Ledger'
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



    $scope.takePic1 = function () {

        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1200,
            targetHeight: 1600,
            cameraDirection: Camera.Direction.FRONT,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        return $cordovaCamera.getPicture(options).then(
            function (imageURI) {
                var image_name = imageURI.substring(imageURI.lastIndexOf('/') + 1);
                return FileFactory.moveFileFromCameraToExtrenalDir(image_name);
            }).then(
            function (fileInfo) {
                $cordovaCamera.cleanup();
                return $q.when(fileInfo);
            });
    }

    $scope.captureAndReview = function () {
        $scope.takePic1().then(function (image) {
            vm.capturedCameraImage = image;
            $state.go('root.cheque.review');
        })
    };

    $scope.createVoucher = function () {
        $scope.user_input.entries[1].credit = $scope.user_input.entries[0].debit
        DocumentService.create('Journal Voucher', prepareForErp($scope.user_input), true).then(
            function (success) {
                console.log(success);
                FileDataService.uploadFileFromDisk(
                    vm.capturedCameraImage,
                    success.data.requestId, ['Cheque Image'],
                    true
                ).then(function () {
                    alert('File uploaded');
                }).catch(function (error) {
                    alert('File Not uploaded');
                    console.log(error);
                })

            });
    };

    function prepareForErp(data) {
        // Create a deep copy
        var transformed_data = JSON.parse(JSON.stringify(data));
        transformed_data.company = transformed_data.company[0].value;
        transformed_data.entries[0].account = transformed_data.entries[0].account[0].value;
        transformed_data.entries[1].account = transformed_data.entries[1].account[0].value;
        transformed_data.cheque_date = moment(transformed_data.cheque_date).format("YYYY-MM-DD");
        console.log(JSON.stringify(transformed_data));
        return transformed_data;
    }

    function prepareForView(data) {
        var transformed_data = JSON.parse(JSON.stringify(data));
        transformed_data.cheque_data = moment(transformed_data.cheque_data).toDate();
        transformed_data.entries[1].account = [{
            value: transformed_data.entries[1].account
        }];
        transformed_data.entries[0].account = [{
            value: transformed_data.entries[0].account
        }];
        transformed_data.company = [{
            value: transformed_data.company
        }];
        return transformed_data;
    }
}
