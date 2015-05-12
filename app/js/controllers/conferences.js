/*globals angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.controllers.conferences', [
        'fsmgmt.services.LocalStorageService',
        'fsmgmt.services.GrowlService',
        'fsmgmt.services.freeswitch.FreeswitchRouter',
        'fsmgmt.directives.ngConfirmClick',
        'fsmgmt.directives.ngMomentAgo',
        'fsmgmt.directives.ngPopover'
    ]);

    var consts = {
        StorageKeys: {
            FreeswitchServerList: 'settings-server-list',
            FreeswitchUsername: 'settings-username-v2',
            FreeswitchPassword: 'settings-password-v2',
            AutoRefreshInterval: 'settings-autorefresh-interval-v2'
        }
    };

    module.controller('ConferencesController', ['$scope', '$interval', 'localStorage', 'growl', 'freeswitch',
        function ($scope, $interval, localStorage, growl, freeswitch) {
            var gui = require('nw.gui');
            var u = require('underscore');

            window.moment = require('moment');
            window.moment.fn.fromNowOrNow = function (a) {
                if (Math.abs(moment().diff(this)) < 3000) {
                    return 'just now';
                }
                return this.fromNow(a);
            };

            // default values
            $scope.isSettingsVisible = true;
            $scope.isAutoRefreshEnabled = false;
            $scope.settings = {};
            $scope.autoRefresh = null; //interval object
            $scope.servers = [];

            localStorage.get(consts.StorageKeys.FreeswitchServerList).then(function(value) {
                if (value) {
                    // compatibility, if no enabled property in object, then default it to true
                    u.each(value, function (server) {
                        if (!server.hasOwnProperty('enabled')) {
                            server.enabled = true;
                        }
                    });

                    $scope.settings.serverList = value;
                }
                else {
                    $scope.settings.serverList = [];
                }
            });

            localStorage.get(consts.StorageKeys.FreeswitchUsername).then(function(value) {
                if (value) $scope.settings.username = value;
            });

            localStorage.get(consts.StorageKeys.FreeswitchPassword).then(function(value) {
                if (value) $scope.settings.password = value;
            });

            localStorage.get(consts.StorageKeys.AutoRefreshInterval).then(function(value) {
                if (value)
                    $scope.settings.autoRefreshInterval = value;
                else
                    $scope.settings.autoRefreshInterval = 5;
            });

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

            $scope.toggleSettings = function () {
                $scope.isSettingsVisible = !$scope.isSettingsVisible;
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

            $scope.addServer = function () {
                var host = prompt('Server host:');

                if (host) {
                    var existingServers = u.where($scope.settings.serverList, { name: host });

                    if (existingServers.length === 0) {
                        $scope.settings.serverList.push({
                            name: host,
                            host: host,
                        });
                    } else {
                        alert ('There\'s already a server by that name');
                    }
                }
            };

            $scope.removeServer = function (server) {
                $scope.settings.serverList = u.without($scope.settings.serverList, server);
            };

            // watches
            $scope.$watch("settings.serverList", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchServerList, newValue);
            }, true);

            $scope.$watch("settings.username", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchUsername, newValue);
            });

            $scope.$watch("settings.password", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchPassword, newValue);
            });

            $scope.$watch("settings.autoRefreshInterval", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.AutoRefreshInterval, newValue);
            })
        }
    ]);
}());