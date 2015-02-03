/*global angular, window */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.directives.ngPopover', []);

    module.directive('ngPopover', [
        function () {
            return {
                link: function (scope, element, attr) {
                    $(element).popover();
                }
            };
        }]);
}());