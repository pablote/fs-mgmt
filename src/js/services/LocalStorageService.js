/*global angular, localStorage */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.LocalStorageService', []);

    module.factory('localStorage', function ($q) {
        var u = require('underscore');

        var LocalStorageService = function () {
        };

        LocalStorageService.prototype.get = function(key) {
            return $q(function (resolve, reject) {
                var value = localStorage.getItem(key);
                resolve(value);
            });
        };

        LocalStorageService.prototype.set = function(key, value) {
            return $q(function (resolve, reject) {
                if (!u.isNull(value) && !u.isUndefined(value)) {
                    localStorage.setItem(key, value);
                }

                resolve();
            });
        };

        return new LocalStorageService();
    });
}());