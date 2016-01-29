'use strict';

receipt_module.controller('cashFlowController', cashFlowController);

function cashFlowController($scope, $state, $q, $http, $cordovaCamera, DocumentService, $rootScope, FileDataService, Utils, $cordovaFile) {
    console.log("Hi from Cash Controller");

    var vm = this;

    var signaturePad = null;

    $scope.startTakeSignature = transactTakeSignature;
    $scope.clearCanvas = clearCanvas;
    $scope.saveCanvas = saveCanvas;

    $scope.company_search = company_search;
    $scope.account_search = account_search;
    $scope.acceptAndUpload = acceptAndUpload;


    $scope.user_input = {
        "naming_series": "KJV-",
        "voucher_type": "Cash Voucher",
        "doctype": "Journal Voucher",
        "user_remark": "",
        "docstatus": 0,
        "company": "",
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

    function acceptAndUpload() {
        var request_creation_promise = DocumentService.create('Journal Voucher', prepareForErp($scope.user_input), true);

        var signature = vm.acceptSignaturePad();
        var file_name = Utils.guid();
        var signature_blob = FileDataService.dataURItoBlob(signature.dataUrl, 'image/png');
        var signature_file_promise = $cordovaFile.writeFile(cordova.file.dataDirectory, file_name, signature_blob, true);
        //        var signature_file_promise = $cordovaFile.writeFile(cordova.file.dataDirectory, file_name, signature.dataUrl, true);


        $q.all([request_creation_promise, signature_file_promise])
            .then(function (values) {
                var request_result = values[0];
                var signature_result = values[1];
                console.log(values);

                FileDataService.uploadFileFromDisk({
                        dir: cordova.file.dataDirectory,
                        file: file_name
                    },
                    request_result.data.requestId, ['Cash Signature'],
                    true
                ).then(function () {
                    alert('File uploaded');
                }).catch(function (error) {
                    alert('File Not uploaded');
                    console.log(error);
                });

            });


    }

    function company_search(query) {
        var promise = $q.defer();
        DocumentService.search('Company', query, {}).success(function (data) {
            promise.resolve(data.results);
        });
        return promise.promise;
    }

    function account_search(query) {
        var promise = $q.defer();
        DocumentService.search('Account', query, {
            company: $scope.user_input.company[0].value,
            group_or_ledger: 'Ledger'
        }).success(function (data) {
            promise.resolve(data.results);
        });
        return promise.promise;
    }

    function clearCanvas() {
        signaturePad.clear();
    }

    function saveCanvas() {
        var sigImg = signaturePad.toDataURL();
        $scope.signature = sigImg;
    }

    function transactTakeSignature() {
        html2canvas(document.getElementById('cash_details'), {
            onrendered: function (canvas) {
                $scope.signatureC = {
                    bg: canvas.toDataURL(),
                    width: canvas.width,
                    height: canvas.height
                };
                $state.go('root.cash.review');
            }
        });
    }

    function prepareForErp(data) {
        // Create a deep copy
        var transformed_data = JSON.parse(JSON.stringify(data));
        transformed_data.company = transformed_data.company[0].value;
        // copy over amount & account
        transformed_data.entries[0].debit = transformed_data.entries[1].credit;
        transformed_data.entries[0].account = transformed_data.entries[1].account;


        if (transformed_data.entries[0].account !== '') {
            transformed_data.entries[0].account = transformed_data.entries[0].account[0].value;
        }
        if (transformed_data.entries[1].account !== '') {
            transformed_data.entries[1].account = transformed_data.entries[1].account[0].value;
        }
        return transformed_data;
    }

    function prepareForView(data) {
        var transformed_data = JSON.parse(JSON.stringify(data));
        if (transformed_data.entries[1].account != '') {
            transformed_data.entries[1].account = [{
                value: transformed_data.entries[1].account
        }];
        }
        if (transformed_data.entries[0].account != '') {
            transformed_data.entries[0].account = [{
                value: transformed_data.entries[0].account
        }];
        }
        transformed_data.company = [{
            value: transformed_data.company
        }];
        return transformed_data;
    }

}
