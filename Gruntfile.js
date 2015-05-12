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
                    'app/js/bundle.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/bootstrap/dist/js/bootstrap.js',
                        'bower_components/jquery-growl/javascripts/jquery.growl.js',
                        'bower_components/moment/moment.js',
                        'bower_components/angular/angular.js',
                        'bower_components/angular-sanitize/angular-sanitize.js',
                        'bower_components/angular-resource/angular-resource.js',
                        'bower_components/angular-ui-router/release/angular-ui-router.js'
                    ]
                }
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
    grunt.registerTask('bundle', ['newer:uglify']);
    grunt.registerTask('build', ['nodewebkit']);
    grunt.registerTask('run', ['build', 'exec:mac']);
    grunt.registerTask('run:linux', ['build', 'exec:linux']);
    grunt.registerTask('run:mac', ['build', 'exec:mac']);
    grunt.registerTask('default', []);
};
