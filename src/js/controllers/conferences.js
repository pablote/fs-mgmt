/*globals angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.controllers.conferences', [
        'fsmgmt.services.LocalStorageService',
        'fsmgmt.services.freeswitch.FreeswitchRouter'
    ]);

    var consts = {
        StorageKeys: {
            FreeswitchServers: 'fsServers',
            FreeswitchUsername: 'fsUsername',
            FreeswitchPassword: 'fsPassword'
        }
    };

    module.controller('ConferencesController', ['$scope', 'localStorage', 'freeswitch',
        function ($scope, localStorage, freeswitch) {
            // default values
            localStorage.get(consts.StorageKeys.FreeswitchServers).then(function(value) {
                $scope.fsServers = value;
            });

            localStorage.get(consts.StorageKeys.FreeswitchUsername).then(function(value) {
                $scope.fsUsername = value;
            });

            localStorage.get(consts.StorageKeys.FreeswitchPassword).then(function(value) {
                $scope.fsPassword = value;
            });

            // methods
            $scope.refresh = function () {
                freeswitch
                    .list($scope.fsServers, $scope.fsUsername, $scope.fsPassword)
                    .then(function (fsListResponse) {
                        $scope.listData = fsListResponse;
                    })
                    .catch(function (error) {
                        alert(error);
                    })
            };

            // watches
            $scope.$watch("fsServers", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchServers, newValue);
            });

            $scope.$watch("fsUsername", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchUsername, newValue);
            });

            $scope.$watch("fsPassword", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchPassword, newValue);
            })
        }
    ]);
}());