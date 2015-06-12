/*globals angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.controllers.conferences', [
        'fsmgmt.services.LocalStorageService',
        'fsmgmt.services.GrowlService',
        'fsmgmt.services.freeswitch.FreeswitchRouter',
        'fsmgmt.directives.ngConfirmClick',
        'fsmgmt.directives.ngPopover',
        'fsmgmt.directives.ngMomentAgo'
    ]);

    module.controller('ConferencesController', ['$scope', '$interval', 'localStorage', 'growl', 'freeswitch',
        function ($scope, $interval, localStorage, growl, freeswitch) {
            var gui = require('nw.gui');
            var u = require('underscore');

            // default values
            $scope.servers = [];
            $scope.autoRefresh = null; // interval object
            $scope.lastRefresh = null; // moment obj with datetime of last refresh

            // methods
            $scope.refresh = function () {
                var servers = [];

                u.each($scope.settings.serverList, function (server) {
                    if (server.enabled) {
                        servers.push({
                            name: server.name,
                            host: server.host,
                            username: $scope.settings.username,
                            password: $scope.settings.password
                        });
                    }
                });

                freeswitch
                    .list(servers)
                    .then(function (fsListResponse) {
                        $scope.lastRefresh = moment();
                        $scope.servers = fsListResponse;
                    })
                    .catch(function (error) {
                        var msg = 'A problem occurred accesing the Freeswitch servers.';
                        $scope.showModal({
                            title: 'Error',
                            text: msg,
                            details: error
                        });
                    })
            };

            $scope.toggleAutoRefresh = function () {
                $scope.isAutoRefreshEnabled = !$scope.isAutoRefreshEnabled;

                if ($scope.isAutoRefreshEnabled) {
                    $scope.lastRefresh = null;
                    $scope.autoRefresh = $interval(function() {
                        $scope.refresh();
                    }, $scope.settings.autoRefreshInterval * 1000);
                } else {
                    $interval.cancel($scope.autoRefresh);
                    delete $scope.autoRefresh;
                }
            };

            $scope.hangup = function (server, conference, member) {
                freeswitch
                    .hangup(server, conference, member)
                    .then(function (hangupResponse) {
                        growl.info('Done', 'Hangup');
                    })
                    .then(function () {
                        $scope.refresh();
                    })
                    .catch(function (error) {
                        var msg = 'A problem occurred during hangup.' + error.toString();
                        growl.info(msg, 'Hangup Error');
                    });
            };

            $scope.copyToClipboard = function (text) {
                var clipboard = gui.Clipboard.get();
                clipboard.set(text, 'text');

                growl.info(text, 'Copied to Clipboard');
            };

            $scope.showRecordingStatus = function (server, conference) {
                freeswitch
                    .recordingCheck(server, conference)
                    .then(function (recordingCheckResponse) {
                        $scope.showModal({
                            title: 'Recording status',
                            preText: recordingCheckResponse
                        });
                    })
                    .catch(function (error) {
                        var msg = 'A problem occurred during recording check.';

                        $scope.showModal({
                            title: 'Error',
                            text: msg,
                            details: error
                        });
                    });
            };

        }
    ]);
}());