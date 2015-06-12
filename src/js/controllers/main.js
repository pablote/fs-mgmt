/*globals angular, console, require */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.controllers.main', [
        'ui.router',
        'fsmgmt.services.LocalStorageService',
        'fsmgmt.controllers.conferences',
        'fsmgmt.controllers.calls',
        'fsmgmt.directives.ngModalClose',
        'fsmgmt.directives.ngMomentAgo'
    ]);

    var consts = {
        StorageKeys: {
            FreeswitchServerList: 'settings-server-list',
            FreeswitchUsername: 'settings-username-v2',
            FreeswitchPassword: 'settings-password-v2',
            AutoRefreshInterval: 'settings-autorefresh-interval-v2'
        }
    };

    module.controller('MainController', ['$scope', '$interval', 'localStorage',
        function ($scope, $interval, localStorage) {
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
            $scope.settings = {};
            $scope.isAutoRefreshEnabled = false;
            $scope.autoRefresh = null; //interval object
            $scope.messageDialog = {};

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

            // mac menus
            if (process.platform === 'darwin') {
                var gui = require('nw.gui');

                var nativeMenuBar = new gui.Menu({type: "menubar"});
                nativeMenuBar.createMacBuiltin("Freeswitch Desktop", {
                    hideEdit: false,
                    hideWindow: true
                });

                var win = gui.Window.get();
                win.menu = nativeMenuBar;
            }

            // settings methods
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

            // modal dialog methods
            $scope.showModal = function(options) {
                $scope.messageDialog.title = options.title || '';
                $scope.messageDialog.text = options.text || null;
                $scope.messageDialog.details = options.details || null;
                $scope.messageDialog.preText = options.preText || null;

                $('#dlgMessage').modal();
            };

            $scope.onModalClose = function () {
                $scope.messageDialog = {};
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

    module.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/conferences");

        $stateProvider
            .state('conferences', { url: "/conferences", controller: 'ConferencesController', templateUrl: "conferences/main.html" })
            .state('calls', { url: "/calls", controller: 'CallsController', templateUrl: "calls/main.html" });
    }]);
}());