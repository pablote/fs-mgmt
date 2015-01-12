/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.parsers.ListParser', []);

    module.factory('FreeswitchListParser', function ($q, $http) {
        var FreeswitchListParser = function () {
        };

        FreeswitchListParser.prototype.parse = function(fsTextResponse) {
            return $q(function(resolve, reject) {
                resolve({});
            });
        };

        return FreeswitchListParser;
    });
}());