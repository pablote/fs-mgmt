/*globals module */

module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        nodewebkit: {
            options: {
                // using latest alpha for the moment, because dialogs don't work on linux on 0.11.x
                //version: '0.11.5',
                buildDir: './build',
                platforms: [ /* 'win','osx', 'linux32', */ 'linux64']
            },
            src: ['./src/**/*']
        },

        exec: {
            linux: {
                command: './build/gitp/linux64/gitp',
                stdout: true,
                stderr: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-exec');
    grunt.registerTask('build', ['nodewebkit']);
    grunt.registerTask('run', ['build', 'exec:linux']);
    grunt.registerTask('run:linux', ['build', 'exec:linux']);
    grunt.registerTask('default', []);
};
