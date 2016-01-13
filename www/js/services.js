console.log("Services.js ran");

receipt_module.service('getInvoiceMetaData', function ($http) {
    this.get_meta = function (meta) {
        return $http({
            url: 'http://192.168.31.124:8080/',
            method: 'POST',
            params: {
                cmd: "flows.flows.controller.ephesoft_integration.get_meta",
                doc: meta
            }
        });
    };
});
