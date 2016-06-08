angular.module('starter')

.factory('NamingService', namingService);


function namingService($http, $localStorage, SettingsFactory, Persistence, $q) {
    return {
        registerSeries: registerSeries,
        getNext: getNext,
    };

    function registerSeries(series, start, end, current) {
        return $q(function (resolve, reject) {

            Persistence.Entities.NamingSeries.all()
                .filter('series', '=', series)
                .filter('start_serial', '=', start)
                .filter('end_serial', '=', end)
                .list(function (series) {
                    if (series && series.length) {
                        return reject('Series Already Exist');
                    }

                });

            var dbSeries = new Persistence.Entities.NamingSeries({
                series: series,
                start_seriel: start,
                end_serial: end,
                current_serial: current,
                id: series + start + end
            });

            Persistence.add(dbSeries).then(function () {
                return resolve(dbSeries);
            });

        });
    }

    function getNext() {
        return $q(function (resolve, reject) {

            Persistence.Entities.NamingSeries.all()
                .list(function (series) {
                    if (!(series && series.length)) {
                        return reject('No Series Found');
                    }
                    series = series[0];
                    return resolve(seriesFactory(series));
                });

        });
    }

    function seriesFactory(serial) {

        return {
            getSerial: getSerial,
            commitSerial: commitSerial
        };

        function getSerial() {
            serial.current_serial = serial.current_serial || serial.start_serial;
            return [serial.series, padDigits(serial.current_serial, 4)].join('');
        }

        function commitSerial() {
            return $q(function (resolve, reject) {
                serial.current_serial += 1;
                persistence.flush(function () {
                    return resolve();
                });
            });
        }

    }

    function padDigits(number, digits) {
        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
    }

}
