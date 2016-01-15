receipt_module.directive('signaturePad', function () {
    return {
        restrict: 'E',
        scope: {
            srcFunction: '='
        },
        template: 'Name: {{customer.name}} Address: {{customer.address}}'
    };
});
