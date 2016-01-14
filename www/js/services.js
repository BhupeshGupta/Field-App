console.log("Services.js ran");


// Default Http Header Change
receipt_module.config(function ($httpProvider) {
   $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
   $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
});

receipt_module.service('getInvoiceMetaData', function ($http) {
    this.get_meta = function (meta) {
        return $http({
            url: 'http://192.168.31.124:8080/?' + $.param({
                cmd: "flows.flows.controller.ephesoft_integration.get_meta",
                doc: meta,
                _type: 'POST',
            }),
            method: 'GET',
            cache: false
        });
    };
});
