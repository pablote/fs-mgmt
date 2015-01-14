/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.parsers.ListParser', []);

    module.factory('FreeswitchListParser', function ($q, $http) {
        var S = require('string');
        var u = require('underscore');

        var FreeswitchListParser = function () {
        };

        FreeswitchListParser.prototype.parse = function(fsTextResponse) {
            return $q(function(resolve, reject) {
                var response = [];

                if (S(fsTextResponse).contains('No active conferences.')) {
                    resolve(response);
                } else {
                    u.each(S(fsTextResponse).lines(), function (line) {
                        line = S(line).replaceAll('<pre>', '').trim();

                        if (!line.isEmpty()) {
                            // starts new conference
                            if (line.startsWith('Conference ')) {
                                response.push({
                                    name: line.slice(11, line.indexOf(' ', 11)).s,
                                    members: []
                                });
                            }
                            // its a member in the current conference
                            else {
                                var memberAttributes = line.split(';');
                                response[response.length - 1].members.push({ //TODO: this object should be a class
                                    id: memberAttributes[0],
                                    participantRegister: memberAttributes[1],
                                    channelId: memberAttributes[2],
                                    callerIdName: memberAttributes[3],
                                    callerIdNumber: memberAttributes[4],
                                    entitlements: memberAttributes[5],
                                    isInternalCall: (memberAttributes[1].indexOf("sofia/internal/conf_") > -1 ||
                                        memberAttributes[1].indexOf("sofia/internal/00000") > -1) || memberAttributes[1].indexOf("loopback") > -1
                                });
                            }
                        }
                    });

                    resolve(response);
                }
            });
        };

        return FreeswitchListParser;
    });
}());