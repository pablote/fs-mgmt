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
                var responses = [];
                var serverList = servers.split(',');

                u.each(serverList, function (server) {
                    var client = new FreeswitchClient(server.trim(), username, password);
                    responses.push(client.list());
                });

                $q.all(responses)
                    .then(function(allResponses) {
                        resolve(allResponses);
                    })
                    .catch(function(error) {
                        reject(error);
                    })
            });
        };

        FreeswitchRouter.prototype.hangup = function(server, conference, member) {
            var client = new FreeswitchClient(server.host, server.username, server.password);
            return client.hangup(conference.name, (member) ? member.id : null);
        };

        FreeswitchRouter.prototype.recordingCheck = function(server, conference) {
            var client = new FreeswitchClient(server.host, server.username, server.password);
            return client.recordingCheck(conference.name);
        };

        return new FreeswitchRouter();
    });
}());