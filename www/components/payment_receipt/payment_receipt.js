'use strict';

angular.module('starter')
    .controller('PaymentReceiptController', paymentReceiptController);


function paymentReceiptController(
    $state, $cordovaToast, get_stock_owner, create_new_payment_receipt, DocumentService
) {
    var vm = this;

    vm.autoCompleteStockOwner = autoCompleteStockOwner;
    vm.acceptAndCreateVoucher = acceptAndCreateVoucher;

    vm.user_input = {
        id: '',
        stock_owner: {},
        item: '',
        qty: '',
        transaction_type: '',
        amount_per_item: '',
        customer: '',
        remarks: '',

        total: '',

        docstatus: 1,
        company: "VK Logistics",
        stock_date: moment().format("YYYY-MM-DD"),
        posting_date: moment().format("YYYY-MM-DD"),
    };


    function autoCompleteStockOwner(query) {
        return DocumentService.search('Sales Person', query, {})
            .then(function (success) {
                return success.data.results;
            });
    }

    function acceptAndCreateVoucher() {
        return DocumentService.create('Payment Receipt', prepareForErp(vm.user_input), false)
            .success(function (success) {
                alert("Success");
                $state.transitionTo('root.home');
            });
    }

    function prepareForErp(data) {
        // Create a deep copy
        var transformed_data = JSON.parse(JSON.stringify(data));
        transformed_data.stock_owner = transformed_data.stock_owner[0].value;
        transformed_data.id = transformed_data.id.toString();
        transformed_data.total = transformed_data.qty * transformed_data.amount_per_item;
        return transformed_data;
    }

}
