/*global angular, localStorage */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.GrowlService', []);

    module.factory('growl', [function () {
        var GrowlService = function () {
        };

        GrowlService.prototype.info = function(message, title) {
            var options = {
                //icon: "http://yourimage.jpg",
                body: message
            };

            var notification = new Notification(title, options);
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