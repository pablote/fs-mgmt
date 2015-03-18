/*global angular, localStorage */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.GrowlService', []);

    module.factory('growl', function ($q) {
        var GrowlService = function () {
        };

        GrowlService.prototype.info = function(message, title) {
            $.growl({ title: title, message: message });
        };

        GrowlService.prototype.error = function(message, title) {
            var payload = { message: message };

            if (title) {
                payload.title = title;
            }

            $.growl.error(payload);
        };

        GrowlService.prototype.notice = function(message, title) {
            var payload = { message: message };

            if (title) {
                payload.title = title;
            }

            $.growl.notice(payload);
        };

        GrowlService.prototype.warn = function(message, title) {
            var payload = { message: message };

            if (title) {
                payload.title = title;
            }

            $.growl.warning(payload);
        };

        return new GrowlService();
    });
}());