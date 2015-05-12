/*global angular, localStorage */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.GrowlService', []);

    module.factory('growl', [function () {
        var GrowlService = function () {
        };

        GrowlService.prototype.info = function(message, title) {
            $.growl({ title: title || '', message: message || ''});
        };

        GrowlService.prototype.error = function(message, title) {
            $.growl.error({ title: title || '', message: message || ''});
        };

        GrowlService.prototype.notice = function(message, title) {
            $.growl.notice({ title: title || '', message: message || ''});
        };

        GrowlService.prototype.warn = function(message, title) {
            $.growl.warning({ title: title || '', message: message || ''});
        };

        return new GrowlService();
    }]);
}());