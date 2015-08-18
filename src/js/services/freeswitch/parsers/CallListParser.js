/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.parsers.CallListParser', [
        'fsmgmt.services.freeswitch.models.Conference',
        'fsmgmt.services.freeswitch.models.Call'
    ]);

    module.factory('CallListParser', ['$q', '$http', 'FreeswitchConference', 'Call',
        function ($q, $http, FreeswitchConference, Call) {
            //var S = require('string');
            //var u = require('underscore');

            var CallListParser = function () {
            };

            CallListParser.prototype.parse = function(fsTextResponse) {
                return $q(function(resolve, reject) {
                    var response = [];
                    response.push(new Call(fsTextResponse));
/*
                    if (S(fsTextResponse).contains('No active calls.')) {
                        resolve(response);
                    } else {
                        u.each(S(fsTextResponse).lines(), function (line) {
                            line = S(line).replaceAll('<pre>', '').trim();

                            if (!line.isEmpty()) {
                                // starts new conference
                                if (line.startsWith('Conference ')) {
                                    response.push(new FreeswitchConference(line));
                                }
                                // its a member in the current conference
                                else {
                                    response[response.length - 1].members.push(new FreeswitchMember(line));
                                }
                            }
                        });

                        resolve(response);
                    }
                    */
                    resolve(response);

                });
            };

            return CallListParser;
        }
    ]);
}());