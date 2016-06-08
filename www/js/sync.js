angular.module('starter')

.factory('Sync', function ($http, $localStorage, SettingsFactory, Persistence) {
    return {
        cloneCollection: cloneAll
    };

    function cloneAll(coll, deep) {
        [
            'Customer',
            'Address',
            'Contact',
            'Transportation Vehicle'
        ].map(function (collection) {
            cloneCollection(collection, deep);
        });

    }

    function cloneCollection(collection, deep) {
        deep = deep || false;
        $localStorage.lastSync = $localStorage.lastSync || {};
        var epoch = deep ? 0 : $localStorage.lastSync[collection] || 0;

        var queryData = {
            'doctype': collection,
            'epoch': epoch
        };

        var url = SettingsFactory.getERPServerBaseUrl() + '/api/method/field_report.field_report.sync_controller.get_data_patch?' + $.param(queryData);
        return $http({
            url: url,
            loading: true,
            method: 'GET'
        }).then(function (data) {
            $localStorage.lastSync[collection] = data.data.message.meta.epoch;

            angular.forEach(data.data.message.data, function (record) {
                var recordDbObject = null;

                if (collection === 'Customer') {
                    var customer = record;
                    customer.id = customer.name;
                    customer.object = JSON.stringify(customer);
                    recordDbObject = new Persistence.Entities.Customer(customer);
                } else if (collection === 'Address') {
                    var address = record;
                    address.id = address.name;
                    address.object = JSON.stringify(address);
                    recordDbObject = new Persistence.Entities.Address(address);
                } else if (collection === 'Contact') {
                    var contact = record;
                    contact.id = contact.name;
                    contact.object = JSON.stringify(contact);
                    recordDbObject = new Persistence.Entities.Contact(contact);
                } else if (collection === 'Transportation Vehicle') {
                    var vehicle = record;
                    vehicle.id = vehicle.name;
                    vehicle.object = JSON.stringify(vehicle);
                    recordDbObject = new Persistence.Entities.Vehicle(vehicle);
                }

                Persistence.add(recordDbObject);
            });

        });

    }

});
