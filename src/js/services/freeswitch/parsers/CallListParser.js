/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.parsers.CallListParser', [
        'fsmgmt.services.freeswitch.models.Conference',
        'fsmgmt.services.freeswitch.models.Call'
    ]);

    module.factory('CallListParser', ['$q', '$http', 'FreeswitchConference', 'Call',
        function ($q, $http, FreeswitchConference, Call) {
            var S = require('string');
            //var u = require('underscore');
            var cheerio = require('cheerio');
            var tabletojson = require('tabletojson');

            var CallListParser = function () {
            };

            CallListParser.prototype.parse = function(fsTextResponse) {
                return $q(function(resolve, reject) {
                    var response = [];

                    // parse html table in response into json object
                    var $ = cheerio.load(fsTextResponse);
                    var tableHtml = $('table').html();

                    if (S(tableHtml).isEmpty()) {
                        resolve(response);
                    } else {
                        var tableAsJson = tabletojson.convert('<table>' + tableHtml + '</table>');

                        // iterate results
                        for (var i = 0; i < tableAsJson[0].length; i++) {
                            if (tableAsJson[0].hasOwnProperty(i)) {
                                var row = tableAsJson[0][i];

                                // ignore row 0 which is the header row
                                if (i > 0) {
                                    // build call based on row
                                    response.push(new Call(row));
                                }
                            }
                        }

                        resolve(response);
                    }
                });
            };

            return CallListParser;
        }
    ]);
}());