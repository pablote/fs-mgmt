/*global angular, require */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.FreeswitchRouter', [
        'fsmgmt.services.freeswitch.FreeswitchClient',
        'fsmgmt.services.freeswitch.models.Server',
        'fsmgmt.services.AllSettled'
    ]);

    module.factory('freeswitch', ['$q', 'FreeswitchClient', 'FreeswitchServer', function ($q, FreeswitchClient, FreeswitchServer) {
        var u = require('underscore');

        var FreeswitchRouter = function () {
        };

        FreeswitchRouter.prototype.list = function(servers) {
            return $q(function (resolve, reject) {
                var responses = [];

                u.each(servers, function (server) {
                    var client = new FreeswitchClient(server);
                    responses.push(client.list());
                });

                $q.allSettled(responses)
                    .then(function(allResponses) {
                        resolve(allResponses);
                    })
                    .catch(function(allResponses) {
                        resolve(u.map(allResponses, function (response) {
                            if (response instanceof FreeswitchServer) {
                                return response;
                            } else {
                                return {
                                    name: response.server.name,
                                    host: response.server.host,
                                    error: (response.status === 0) ? "Connection refused" : '(' + response.status + ') ' + response.statusText
                                }
                            }
                        }));
                    });
            });
        };

        FreeswitchRouter.prototype.hangup = function(server, conference, member) {
            var client = new FreeswitchClient(server);
            return client.hangup(conference.name, (member) ? member.id : null);
        };

        FreeswitchRouter.prototype.recordingCheck = function(server, conference) {
            var client = new FreeswitchClient(server);
            return client.recordingCheck(conference.name);
        };

        return new FreeswitchRouter();
    }]);
}());