/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.models.Server', []);

    module.factory('FreeswitchServer', function () {
        var FreeswitchServer = function (options) {
            this.name = options.name;
            this.host = options.host;
            this.username = options.username;
            this.password = options.password;
            this.conferences = options.conferences;
            this.calls = options.calls;
        };

        return FreeswitchServer;
    });
}());