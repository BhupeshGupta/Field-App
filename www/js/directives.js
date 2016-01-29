angular.module('starter').directive('proofPad', proofPad);

function proofPad($window) {
    'use strict';

    var signaturePad, canvas, element, EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

    return {
        restrict: 'AE',
        replace: true,
        template: '<div class="signature" ng-style="{height: height + \'px\', width: width + \'px\'}"><canvas style="border: 1px solid black; background-color: white;" height="{{ height }}" width="{{ width }}"></canvas></div>',
        scope: {
            accept: '=',
            clear: '=',
            dataurl: '=',
            height: '@',
            width: '@'
        },
        controller: [
        '$scope',
        function ($scope) {
                $scope.accept = function () {
                    var signature = {};

                    if (!signaturePad.isEmpty()) {
                        signature.dataUrl = signaturePad.toDataURL();
                        signature.isEmpty = false;
                    } else {
                        signature.dataUrl = EMPTY_IMAGE;
                        signature.isEmpty = true;
                    }

                    return signature;
                };

                $scope.clear = function () {
                    signaturePad.clear();
                };

                $scope.$watch("dataurl", function (dataUrl) {
                    if (dataUrl) {
                        $scope.drawBg(dataUrl);
                    }
                });
        }
      ],
        link: function (scope, element) {
            canvas = element.find('canvas')[0];
            signaturePad = new SignaturePad(canvas);

            if (!scope.height) scope.height = 220;
            if (!scope.width) scope.width = 568;

            scope.onResize = function () {
                var canvas = element.find('canvas')[0];
                var ratio = Math.max($window.devicePixelRatio || 1, 1);
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext("2d").scale(ratio, ratio);
            };

            scope.onResize();

            scope.drawBg = function (dataUrl) {
                var url = (scope.signature && scope.signature.dataUrl) || dataUrl;
                if (url) {
                    var signatureCanvas = element.find('canvas')[0];
                    var ctx = signatureCanvas.getContext("2d");

                    var background = new Image();
                    background.src = url;
                    background.onload = function () {
                        var heightRatio = signatureCanvas.height / background.height;
                        var widthRatio = signatureCanvas.width / background.width;

                        var scalingRatio = heightRatio > widthRatio ? widthRatio : heightRatio;

                        ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, background.width * scalingRatio, background.height * scalingRatio);
                    };
                }
            };

            scope.drawBg();

            angular.element($window).bind('resize', function () {
                scope.onResize();
            });
        }
    };

}
