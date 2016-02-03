'use strict';

angular.module('starter')
    .controller('GoodsReceiptController', goodsReceiptController);

function goodsReceiptController(
    $scope, $state, Persistence, DocumentService, $q, gr_config, Utils,
    $cordovaCamera, FileFactory, $cordovaGeolocation, FileDataService, $cordovaFile
) {

    var vm = this;
    vm.autocomplete_customer = autocomplete_customer;
    vm.autocomplete_vehicle = autocomplete_vehicle;
    vm.gr_config = gr_config;
    vm.set_item = set_item;
    vm.moveToSignatureForm = moveToSignatureForm;
    vm.captureSignatureAndCaptureImage = captureSignatureAndCaptureImage;
    vm.acceptAndUpload = acceptAndUpload;

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

    function set_item(mode, item, nextState) {
        vm.user_input['item_' + mode] = item.id;
        $state.go(nextState);
    }

    function moveToSignatureForm() {
        html2canvas(document.getElementById('review_template'), {
            onrendered: function (canvas) {
                vm.signature.bg = canvas.toDataURL();
                $state.transitionTo('root.good_receipt.step8');
            }
        });

    }

    function captureSignatureAndCaptureImage(nextState) {
        // Dump Signature To File
        var signature = vm.acceptSignaturePad();
        var file_name = Utils.guid();
        var signature_blob = FileDataService.dataURItoBlob(signature.dataUrl, 'image/png');
        $cordovaFile.writeFile(cordova.file.dataDirectory, file_name, signature_blob, true)
            .then(function (file) {
                vm.signature.signatureFile = file;
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

    function acceptAndUpload() {
        var gr_creation_promise = DocumentService.create('Goods Receipt', prepareForErp(vm.user_input), false);
        gr_creation_promise.then(function () {
            alert('success');
        }).catch(function (error) {
            console.log(error);
            alert('lol!!');
        });

        //        gr_creation_promise.then(function () {
        //            return FileDataService.uploadFileFromDisk(
        //                vm.signature.cameraFile,
        //                success.data.requestId, ['Cheque Image'],
        //                true
        //            ).catch(function (error) {
        //                console.log(error);
        //                return $q.reject("Unable to upload file");
        //            });
        //        })


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
}



receipt_module.controller('good_receipt_controller', function ($scope, $rootScope, $state, $cordovaToast, $cordovaCamera, $cordovaFile, $cordovaGeolocation, get_customer_live, images_link_empty, images_link_filled, get_vehicle_live, create_new_good_receipt, canvas_signature, send_image, $q, DocumentService) {
    var me = this;

    $scope.new_good_receipt_object = {
        customer_name: {},
        item_delievered_name: '',
        item_delievered_quantity: '',
        item_received_name: '',
        item_received_quantity: '',
        done: false,
        vehicle_number: '',
        customer_document_id: '',
        voucher_id: '',
        customer_image: {},
        loc_lat: '',
        loc_long: ''
    };

    $scope.new_good_receipt_search_object = {
        vehicle_search: function (query) {
            var promise = $q.defer();
            DocumentService.search('Transportation Vehicle', query, {}).success(function (data) {
                promise.resolve(data.results);
            });
            return promise.promise;
        },
        customer_search: function (query) {
            var promise = $q.defer();
            DocumentService.search('Customer', query, {
                enabled: 1,
                sale_enabled: 1
            }).success(function (data) {
                promise.resolve(data.results);
            });
            return promise.promise;
        },
        item_images_empty: images_link_empty,
        item_images_filled: images_link_filled,
        confirm_disable: false,
        customer_image: '',
        take_signature_button_disable: false,
        take_signature_next_disable: false
    };

    $scope.new_good_receipt = angular.copy($scope.new_good_receipt_object);

    $scope.new_good_receipt_search = angular.copy($scope.new_good_receipt_search_object);


    // Log Out Event
    $scope.$on('log_out_event', function (event, args) {
        delete $scope.new_good_receipt;
        $scope.new_good_receipt = angular.copy($scope.new_good_receipt_object);
        delete $scope.new_good_receipt_search;
        $scope.new_good_receipt_search = angular.copy($scope.new_good_receipt_search_object);
    });


    // Read Data As URL
    me.read_data_url = function (path, file) {
        document.addEventListener('deviceready', function () {
            $cordovaFile.readAsDataURL(path, file).then(function (success) {
                $scope.new_good_receipt_search.customer_image = success;
            }, function (error) {
                console.log(error);
            });
        });
    };


    // Create Good Receipt
    me.create_good_receipt = function () {
        $scope.new_good_receipt_search.confirm_disable = true;
        now_date = moment().format("YYYY-MM-DD");
        now_time = moment().format("HH:mm:ss");
        voucher_id = $scope.new_good_receipt.voucher_id.toString();
        data = {
            docstatus: 1,
            customer: $scope.new_good_receipt.customer_name.value,
            item_delivered: $scope.new_good_receipt.item_delievered_name,
            delivered_quantity: $scope.new_good_receipt.item_delievered_quantity,
            item_received: $scope.new_good_receipt.item_received_name,
            received_quantity: $scope.new_good_receipt.item_received_quantity,
            transaction_date: now_date,
            posting_date: now_date,
            posting_time: now_time,
            vehicle: $scope.new_good_receipt.vehicle_number.value,
            goods_receipt_number: voucher_id,
            customer_document_id: $scope.new_good_receipt.customer_document_id,
            location_latitude: $scope.new_good_receipt.loc_lat,
            location_longitude: $scope.new_good_receipt.loc_long
        };
        create_new_good_receipt.create_feed(data)
            .success(function (data) {
                $scope.new_good_receipt_search.confirm_disable = false;
                send_image.send(voucher_id, $scope.new_good_receipt_search.customer_image, 'gr_' + voucher_id + '_customer_image.jpg', 'Goods Receipt', 'customer_image').success(function (data) {
                    $scope.new_good_receipt_search.customer_image = "";
                    $scope.new_good_receipt.customer_image = {};
                });
                send_image.send(voucher_id, canvas_signature.signature, 'gr_' + voucher_id + '_signature.jpg', 'Goods Receipt', 'signature').success(function (data) {});
                delete $scope.new_good_receipt;
                $scope.new_good_receipt = angular.copy($scope.new_good_receipt_object);
                delete $scope.new_good_receipt_search;
                $scope.new_good_receipt_search = angular.copy($scope.new_good_receipt_search_object);
                $state.transitionTo('root.select_receipt');
            })
            .error(function (data) {
                $scope.new_good_receipt_search.confirm_disable = false;
                if (data._server_messages)
                    message = JSON.parse(data._server_messages);
                else
                    message = "Server Error";
                $cordovaToast.show(message, 'short', 'bottom');
            });
    };


    // Take Image from camera
    me.take_img = function () {
        document.addEventListener("deviceready", function () {

            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.PNG,
                cameraDirection: Camera.Direction.FRONT
            };

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                var image_name = imageURI.substring(imageURI.lastIndexOf('/') + 1);
                $scope.new_good_receipt.customer_image = {
                    path: cordova.file.dataDirectory,
                    name: image_name
                };
                me.file_move(image_name);
                $cordovaCamera.cleanup().then(); // only for FILE_URI
            }, function (err) {
                $scope.new_good_receipt_search.take_signature_next_disable = false;
                $cordovaToast.show("Camera Not Working", 'short', 'bottom');
                console.log(err);
            });
        }, false);
    };


    // Move File from one location to other
    me.file_move = function (file_name) {
        document.addEventListener('deviceready', function () {
            $cordovaFile.moveFile(cordova.file.externalCacheDirectory, file_name, cordova.file.dataDirectory)
                .then(function (success) {
                    me.read_data_url(cordova.file.dataDirectory, file_name);
                    $scope.new_good_receipt_search.take_signature_next_disable = false;
                    $state.transitionTo('root.good_receipt.take_picture_location');
                    me.geo_location();
                }, function (error) {
                    $scope.new_good_receipt_search.take_signature_next_disable = false;
                    $cordovaToast.show("File Not Moved", 'short', 'bottom');
                    console.log(error);
                });
        });
    };


    // Geo Location
    me.geo_location = function () {
        document.addEventListener('deviceready', function () {
            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.new_good_receipt.loc_lat = position.coords.latitude;
                    $scope.new_good_receipt.loc_long = position.coords.longitude;
                }, function (err) {
                    $cordovaToast.show("Location not taken", 'short', 'bottom');
                    console.log(err);
                });
        });
    };

    $scope.customer_name_next = function () {
        $state.transitionTo('root.good_receipt.item_delievered_name');
    };

    $scope.item_delievered_name_empty_next = function (index) {
        $scope.new_good_receipt.item_delievered_name = $scope.new_good_receipt_search.item_images_empty[index].id;
        $state.transitionTo('root.good_receipt.item_delievered_quantity');
    };

    $scope.item_delievered_name_filled_next = function (index) {
        $scope.new_good_receipt.item_delievered_name = $scope.new_good_receipt_search.item_images_filled[index].id;
        $state.transitionTo('root.good_receipt.item_delievered_quantity');
    };

    $scope.item_delievered_name_next = function () {
        $state.transitionTo('root.good_receipt.item_received_name');
    };

    $scope.item_delievered_quantity_next = function () {
        $state.transitionTo('root.good_receipt.item_received_name');
    };

    $scope.item_received_name_empty_next = function (index) {
        $scope.new_good_receipt.item_received_name = $scope.new_good_receipt_search.item_images_empty[index].id;
        $state.transitionTo('root.good_receipt.item_received_quantity');
    };

    $scope.item_received_name_filled_next = function (index) {
        $scope.new_good_receipt.item_received_name = $scope.new_good_receipt_search.item_images_filled[index].id;
        $state.transitionTo('root.good_receipt.item_received_quantity');
    };

    $scope.item_received_name_next = function () {
        $state.transitionTo('root.good_receipt.acknowledgement');
    };

    $scope.item_received_quantity_next = function () {
        $state.transitionTo('root.good_receipt.acknowledgement');
    };

    $scope.take_signature_button = function () {
        $scope.new_good_receipt_search.take_signature_button_disable = true;
        html2canvas(document.getElementById('get_acknowledgement_information'), {
            onrendered: function (canvas) {
                canvas_signature.back_image = canvas.toDataURL();
                $scope.new_good_receipt_search.take_signature_button_disable = false;
                $rootScope.$emit('signature_canvas_clear', {});
                $state.transitionTo('root.good_receipt.take_signature');
            }
        });
    };

    $scope.take_signature_next = function () {
        canvas_signature.signature = canvas_signature.signature_pad.toDataURL('image/jpeg');
        $scope.new_good_receipt_search.take_signature_next_disable = true;
        me.take_img();
    };

    $scope.take_new_image = function () {
        $cordovaFile.removeFile(cordova.file.dataDirectory, $scope.new_good_receipt.customer_image.name);
        me.take_img();
    };

    $scope.confirm_good_receipt = function () {
        me.create_good_receipt();
    };
});



// Signature Pad Controller

receipt_module.controller('take_signature_controller', function ($scope, $rootScope, canvas_signature) {
    document.getElementById("signature_canvas_div").innerHTML = "<canvas id='signatureCanvas' style='border: 1px solid black;'></canvas>";
    var canvas = document.getElementById('signatureCanvas'),
        ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 170;
    var background = new Image();
    background.src = canvas_signature.back_image;

    background.onload = function () {
        ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
    };

    canvas_signature.signature_pad = new SignaturePad(canvas);

    $scope.clear_canvas = function () {
        canvas_signature.signature_pad.clear();
        background.src = canvas_signature.back_image;
    };

    $rootScope.$on('signature_canvas_clear', function () {
        $scope.clear_canvas();
    });
});
