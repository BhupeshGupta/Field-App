'use strict';

angular.module('starter')
    .controller('GoodsReceiptController', goodsReceiptController);

function goodsReceiptController(
    $scope, $state, Persistence, DocumentService, $q, gr_config, Utils,
    $cordovaCamera, FileFactory, $cordovaGeolocation, FileDataService, $cordovaFile,
    UploadService
) {

    var vm = this;
    vm.autocomplete_customer = autocomplete_customer;
    vm.autocomplete_vehicle = autocomplete_vehicle;
    vm.gr_config = gr_config;
    vm.set_item = set_item;
    vm.moveToSignatureForm = moveToSignatureForm;
    vm.captureSignatureAndCaptureImage = captureSignatureAndCaptureImage;
    vm.acceptAndUpload = acceptAndUpload;
    vm.retakeImage = retakeImage;

    //UI Utils
    vm.getItemDict = getItemDict;

    vm.signature = {
        bg: ''
    };

    vm.user_input = {
        "goods_receipt_number": "",
        "transaction_date": moment().format("YYYY-MM-DD"),
        "customer": {},
        "vehicle": {},

        "item_delivered": "",
        "delivered_quantity": "",
        "delivered_remarks": "",

        "item_received": "",
        "received_quantity": "",
        "received_remarks": "",

        "customer_document_id": "",
        "delivery_type": "Refill",
        "excess": "",
        "residue": "",
        "short": "",
        "remarks": "",


        "doctype": "Goods Receipt",
        "docstatus": 1,
        "company": "Arun Logistics",

        "posting_date": moment().format("YYYY-MM-DD"),
        "location_latitude": "",
        "location_longitude": ""
    };

    function autocomplete_vehicle(query) {
        return DocumentService.search('Transportation Vehicle', query, {})
            .then(function (success) {
                return success.data.results;
            });
    }

    function autocomplete_customer(query) {
        return DocumentService.search('Customer', query, {
            enabled: 1,
            sale_enabled: 1
        }).then(function (success) {
            return success.data.results;
        });
    }

    function set_item(mode, item) {
        vm.user_input['item_' + mode] = item.id;
    }

    function moveToSignatureForm() {
        html2canvas(document.getElementById('review_template'), {
            onrendered: function (canvas) {
                vm.signature.bg = canvas.toDataURL();
                $state.transitionTo('root.good_receipt.step8');
            }
        });

    }

    function captureSignatureAndCaptureImage() {
        // Dump Signature To File
        var signature = vm.acceptSignaturePad();
        var file_name = Utils.guid();
        var signature_blob = FileDataService.dataURItoBlob(signature.dataUrl, 'image/png');
        $cordovaFile.writeFile(cordova.file.dataDirectory, file_name, signature_blob, true)
            .then(function (file) {
                vm.signature.signatureFile = {
                    dir: cordova.file.dataDirectory,
                    file: file_name
                };
            });

        // Start Geo-lock
        $cordovaGeolocation.getCurrentPosition({
            timeout: 10000,
            enableHighAccuracy: true
        }).then(function (location) {
            vm.user_input.location_latitude = location.coords.latitude;
            vm.user_input.location_longitude = location.coords.longitude;
            //location.coords.accuracy;
            console.log(location);
            alert("Location Captured!");
        }).catch(function (error) {
            console.log(error);
            alert(error);
        });

        // Capture & dump file
        captureImage()
            .then(function (cameraFile) {
                vm.signature.cameraFile = cameraFile;
                $state.transitionTo('root.good_receipt.step9');
            });

    }

    function retakeImage() {
        captureImage();
    }

    function acceptAndUpload() {
        var gr_response = null;
        return DocumentService.create('Goods Receipt', prepareForErp(vm.user_input), false)
            .then(function (success) {
                gr_response = success.data;
                // Save file to database
                var cameraFile = new Persistence.Entities.Files({
                    fileName: success.data.requestId + '_camera',
                    parentId: success.data.requestId,
                    uploaded: 0,
                    fdir: vm.signature.cameraFile.dir,
                    fname: vm.signature.cameraFile.file,
                    opts: JSON.stringify({
                        server: 'erp',
                        doctype: 'Goods Receipt',
                        docname: gr_response.data.name,
                        file_field: 'customer_image',
                        filename: gr_response.data.name + '_customer.jpg'
                    })
                });
                Persistence.add(cameraFile);

                // Save file to database
                var signatureFile = new Persistence.Entities.Files({
                    fileName: success.data.requestId + '_signature',
                    parentId: success.data.requestId,
                    uploaded: 0,
                    fdir: vm.signature.signatureFile.dir,
                    fname: vm.signature.signatureFile.file,
                    opts: JSON.stringify({
                        server: 'erp',
                        doctype: 'Goods Receipt',
                        docname: gr_response.data.name,
                        file_field: 'signature',
                        filename: gr_response.data.name + '_signature.jpg'
                    })
                });
                Persistence.add(signatureFile);

                debugger;

                UploadService.upload();

            })
            .catch(function (error) {
                console.log(error);
                alert('GR: Upload of images failed.');
            });
    }

    function captureImage() {

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

    function prepareForErp(data) {
        // Create a deep copy
        var transformed_data = JSON.parse(JSON.stringify(data));
        transformed_data.customer = transformed_data.customer[0].value;
        transformed_data.vehicle = transformed_data.vehicle[0].value;
        transformed_data.transaction_date = moment(transformed_data.transaction_date).format("YYYY-MM-DD");
        transformed_data.remarks = transformed_data.delivered_remarks + '\n' + transformed_data.received_remarks;
        return transformed_data;
    }

    function getItemDict(itemId) {
        var returnItem = {};
        var itemList = vm.gr_config.empty.concat(vm.gr_config.filled);
        angular.forEach(itemList, function (item, index) {
            if (item.id == itemId) {
                returnItem = item;
            }
        });
        return returnItem;
    }
}
