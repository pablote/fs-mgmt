/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.parsers.ConferenceListParser', [
        'fsmgmt.services.freeswitch.models.Conference',
        'fsmgmt.services.freeswitch.models.Member'
    ]);

    module.factory('ConferenceListParser', ['$q', '$http', 'FreeswitchConference', 'FreeswitchMember',
        function ($q, $http, FreeswitchConference, FreeswitchMember) {
            var S = require('string');
            var u = require('underscore');

            var ConferenceListParser = function () {
            };

            ConferenceListParser.prototype.parse = function(fsTextResponse) {
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
                });
            };

            return ConferenceListParser;
        }
    ]);
}());