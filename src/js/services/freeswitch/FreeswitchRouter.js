/*global angular, require */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.FreeswitchRouter', [
        'fsmgmt.services.freeswitch.FreeswitchClient'
    ]);

    module.factory('freeswitch', function ($q, FreeswitchClient) {
        var u = require('underscore');

        var FreeswitchRouter = function () {
        };

        FreeswitchRouter.prototype.list = function(servers, username, password) {
            return $q(function (resolve, reject) {
                var serverList = servers.split(',');
                u.each(serverList, function (server) {
                    var client = new FreeswitchClient(server.trim(), username, password);
                    client.list().then(function (result) {
                        console.log(result);
                    });
                })
            });
        };

        return new FreeswitchRouter();
    });
}());