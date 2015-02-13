/*global angular, window */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.directives.ngMomentAgo', []);

    module.directive('ngMomentAgo', [
        function () {
            return {
                link: function (scope, element, attr) {
                    var momentName = attr.ngMomentAgo;
                    var momentFormat = attr.momentFormat;

                    setInterval(function() {
                        scope.$apply(function() {
                            if (scope[momentName]) {
                                var fromNow = scope[momentName].fromNowOrNow();
                                element[0].innerHTML = (momentFormat) ? momentFormat.replace('%s', fromNow) : fromNow;
                            }
                        });
                    }, 500);
                }
            };
        }]);
}());