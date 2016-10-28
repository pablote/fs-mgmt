/*globals module */
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        nwjs: {
            options: {
                appName: 'Freeswitch Desktop',
                version: '0.18.3',
                flavor: 'normal',
                buildDir: './build',
                platforms: ['osx64'],
                winIco: "app/images/icon.ico",
                zip: true,
                macIcns: "app/images/icon.icns"
            },
            src: ['./app/**/*']
        },

        appdmg: {
            options: {
                title: 'Freeswitch Desktop',
                icon: 'app/images/icon.icns',
                background: 'images/blank.png',
                'icon-size': 80,
                contents: [
                    { "x": 350, "y": 100, "type": "link", "path": "/Applications" },
                    { "x": 150, "y": 100, "type": "file", "path": "build/Freeswitch Desktop/osx64/Freeswitch Desktop.app" }
                ]
            },
            target: {
                dest: 'build/Freeswitch Desktop/osx64/Freeswitch Desktop.dmg'
            }
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
                        'src/js/controllers/calls.js',
                        'src/js/directives/ngConfirmClick.js',
                        'src/js/directives/ngMomentAgo.js',
                        'src/js/directives/ngModalClose.js',
                        'src/js/directives/ngPopover.js',
                        'src/js/services/AllSettled.js',
                        'src/js/services/LocalStorageService.js',
                        'src/js/services/GrowlService.js',
                        'src/js/services/freeswitch/FreeswitchRouter.js',
                        'src/js/services/freeswitch/FreeswitchClient.js',
                        'src/js/services/freeswitch/parsers/ConferenceListParser.js',
                        'src/js/services/freeswitch/parsers/CallListParser.js',
                        'src/js/services/freeswitch/models/Member.js',
                        'src/js/services/freeswitch/models/Call.js',
                        'src/js/services/freeswitch/models/Conference.js',
                        'src/js/services/freeswitch/models/Server.js'
                    ]
                }
            }
        },

        less: {
            options: {
                compress: true,
                cleancss: true,
                sourceMap: true
            },
            all: {
                files: {
                    'app/css/bundle.css': 'src/css/app.less'
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
        }
    });

    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-appdmg');
    grunt.registerTask('bundle', ['newer:uglify', 'less']);
    grunt.registerTask('build', ['bundle', 'clean', 'nwjs', 'appdmg']);
    grunt.registerTask('default', ['build']);
};
