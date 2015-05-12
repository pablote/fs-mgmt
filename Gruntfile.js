/*globals module */

module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        nodewebkit: {
            options: {
                appName: 'Freeswitch Desktop',
                version: '0.12.0',
                buildDir: './build',
                platforms: [ 'osx64', 'linux64' ],
                winIco: "app/images/icon.ico",
                macZip: true,
                macIcns: "app/images/icon.icns"
            },
            src: ['./app/**/*']
        },

        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true
            },
            all: {
                files: {
                    'app/js/bundle-header.js': [
                        'bower_components/modernizr/modernizr.js'
                    ],
                    'app/js/bundle.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/bootstrap/dist/js/bootstrap.js',
                        'bower_components/jquery-growl/javascripts/jquery.growl.js',
                        'bower_components/moment/moment.js',
                        'bower_components/angular/angular.js',
                        'bower_components/angular-sanitize/angular-sanitize.js',
                        'bower_components/angular-resource/angular-resource.js',
                        'bower_components/angular-ui-router/release/angular-ui-router.js',
                        'src/js/controllers/main.js',
                        'src/js/controllers/conferences.js',
                        'src/js/directives/ngConfirmClick.js',
                        'src/js/directives/ngMomentAgo.js',
                        'src/js/directives/ngModalClose.js',
                        'src/js/directives/ngPopover.js',
                        'src/js/services/AllSettled.js',
                        'src/js/services/LocalStorageService.js',
                        'src/js/services/GrowlService.js',
                        'src/js/services/freeswitch/FreeswitchRouter.js',
                        'src/js/services/freeswitch/FreeswitchClient.js',
                        'src/js/services/freeswitch/parsers/ListParser.js',
                        'src/js/services/freeswitch/models/Member.js',
                        'src/js/services/freeswitch/models/Conference.js',
                        'src/js/services/freeswitch/models/Server.js'
                    ]
                }
            }
        },

        clean: {
            all: {
                src: [
                    'app/js/bundle-header.js.map',
                    'app/js/bundle.js.map'
                ]
            }
        },

        exec: {
            linux: {
                command: './build/Freeswitch\\ Desktop/linux64/Freeswitch\\ Desktop',
                stdout: true,
                stderr: true
            },
            mac: {
                command: 'open build/Freeswitch\\ Desktop/osx64/Freeswitch\\ Desktop.app/',
                stdout: true,
                stderr: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('bundle', ['newer:uglify']);
    grunt.registerTask('build', ['bundle', 'clean', 'nodewebkit']);
    grunt.registerTask('run:linux', ['build', 'exec:linux']);
    grunt.registerTask('run:mac', ['build', 'exec:mac']);
    grunt.registerTask('default', []);
};
