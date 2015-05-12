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
                winIco: "src/images/icon.ico",
                macZip: true,
                macIcns: "src/images/icon.icns"
            },
            src: ['./src/**/*']
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
    grunt.registerTask('build', ['nodewebkit']);
    grunt.registerTask('run', ['build', 'exec:mac']);
    grunt.registerTask('run:linux', ['build', 'exec:linux']);
    grunt.registerTask('run:mac', ['build', 'exec:mac']);
    grunt.registerTask('default', []);
};
