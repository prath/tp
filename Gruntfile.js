/**
 * Grunt task Runner
 *
 * @param  {object} grunt
 * @return {mixed} builded files
 */
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-dom-munger');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-prettify');

    grunt.initConfig({

        /**
         * clean all builded files
         *
         * @type {Object}
         */
        clean: {
            all: ['dist', 'dist/css', 'dist/js', 'dist/img'],
            css: ['dist/css'],
            js: ['dist/js'],
            img: ['dist/img'],
            template: ['dist/*.html']
        },

        /**
         * livereload
         *
         * @type {Object}
         * @todo still not working
         */
        connect: {
            con: {
                options: {
                    port: 4000,
                    base: './dist'
                }
            }
        },

        /**
         * Open Dist index in new tab browser
         *
         * @type {Object}
         */
        open: {
            dev: {
                path: 'http://localhost:4000'
            }
        },
        /**
         * less tasks
         * less task for both bootstrap-based codes and mobile-first-based codes
         *
         * @type {Object}
         * @todo pass image dir variable into in_variables.less and (perhaps) variables.less (bootstrap's less variables)
         */
        less: {
            bootstrap: {
                options: {
                    paths: ['src/stylesheets/less-bootstrap']
                },
                files: [{
                    expand: true,
                    cwd: 'src/stylesheets/less-bootstrap',
                    src: ['*.less'],
                    dest: 'dist/css',
                    ext: '.css',
                }]
            },
        },
        /**
         * minimize css files into *.min.css
         *
         * @type {css}
         */
        cssmin: {
            minify: {
                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: ['*.css', '!mixed.css'],
                    dest: 'dist/css',
                    ext: '.min.css',
                }]
            },
            combine: {
                files: {
                    'dist/css/all/mixed.css': ['<%= dom_munger.data.myCssRefs %>']
                }
            }
        },
        /**
         * autoprefix css
         * @type {Object}
         */
        autoprefixer: {
            dist: {
                options: {
                    browsers: ['last 3 version', '> 1%', 'ie 8', 'ie 7']
                },
                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: ['*.css'],
                    dest: 'dist/css',
                    ext: '.css',
                }]
            }
        },
        /**
         * copy files tasks
         *
         * @type {Object}
         */
        copy: {
            jsbootstrap: {
                files: [{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: ['src/scripts/twitter-bootstrap/javascript/vendor/*'],
                    dest: 'dist/js/vendor/'
                }, {
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: ['src/scripts/twitter-bootstrap/javascript/*'],
                    dest: 'dist/js'
                }]
            },
            imgbootstrap: {
                files: [{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: ['src/images/twitter-bootstrap/*', 'src/images/*'],
                    dest: 'dist/img'
                }, {
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: ['src/images/favicons/*'],
                    dest: 'dist'
                }]
            },
            htaccess: {
                files: [{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: ['src/templates/twitter-bootstrap/.htaccess'],
                    dest: 'dist'
                }]
            },
            build : {
                files: [{
                    expand: true,
                    flatten: false,
                    filter: 'isFile',
                    src: ['dist/**/*'],
                    dest: 'prod'
                }]
            }
        },
        /**
         * Dom manipulation tasks
         *
         * @type {Object}
         */
        dom_munger: {
            target: {
                options: {
                    read: {
                        selector: 'script.concat',
                        attribute: 'src',
                        writeto: 'myJsRefs',
                        isPath: true,
                    }
                },
                src: 'dist/*.html'
            },
            targetCss: {
                options: {
                    read: {
                        selector: 'link.cm',
                        attribute: 'href',
                        writeto: 'myCssRefs',
                        isPath: true,
                    }
                },
                src: 'dist/*.html'
            },
            jsconcat: {
                options: {
                    callback: function($) {
                        $('script.concat:last').after('<script src="js/all/all.min.js"></script>');
                        $('script.concat').remove();
                    },
                },
                src: 'dist/*.html'
            },
            jscompress: {
                options: {
                    callback: function($) {
                        $('script.plugin').each(function(i) {
                            src = $(this).attr('src');
                            split = src.split('.js');
                            concat = split[0] + '.min.js';
                            $(this).attr('src', concat);
                        });
                    }
                },
                src: 'dist/*.html'
            },
            jsnone: {
                options: {
                    callback: function($) {}
                },
                src: 'dist/*.html'
            },
            cssconcat: {
                options: {
                    callback: function($) {
                        $('link.cm:last').after('<link rel="stylesheet" href="css/all/mixed.css">');
                        $('link.cm').remove();
                    }
                },
                src: 'dist/*.html'
            },
            csscompress: {
                options: {
                    callback: function($) {
                        $('link.cm').each(function(i) {
                            src = $(this).attr('href');
                            split = src.split('.css');
                            concat = split[0] + '.min.css';
                            $(this).attr('href', concat);
                        });
                    }
                },
                src: 'dist/*.html'
            },
            cleanlr: {
                options: {
                    remove: '.livereload'
                },
                src: 'dist/*.html'
            }
        },
        /**
         * uglify js tasks
         * @type {Object}
         */
        uglify: {
            compress: {
                files: [{
                    expand: true,
                    src: '*.js',
                    dest: 'dist/js',
                    cwd: 'dist/js',
                    ext: '.min.js'
                }]
            },
            concat: {
                src: ['<%= dom_munger.data.myJsRefs %>'],
                dest: 'dist/js/all/all.min.js'
            }
        },
        /**
         * concat files task
         *
         * @type {Object}
         * @todo concat JS Files
         */
        concat: {
            files: {
                src: ['<%= dom_munger.data.myCssRefs %>'],
                dest: 'dist/css/mixed.css'
            }
        },
        /**
         * Jade tasks
         *
         * @type {Object}
         * @todo layout options variables (e.g. two columns, three columns, etc.)
         */
        jade: {
            bootstrap: {
                options: {
                    data: {
                        debug: true,
                        title: 'tokopress',
                        css_dir: 'css',
                        js_dir: 'js',
                        img_dir: 'img'
                        // data : grunt.file.readYAML('src/templates/twitter-bootstrap/data/data.yml') //PENTING : tambahkan ini di site sekeleton
                    },
                    pretty: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/templates/twitter-bootstrap/',
                    src: ['*.jade'],
                    dest: 'dist',
                    ext: '.html',
                }]
            }
        },

        prettify: {
            options: {
                indent_size: 4,
                brace_style: 'expand',
            },
            all: {
                expand: true, 
                cwd: 'dist/', 
                ext: '.html',
                src: ['*.html'],
                dest: 'dist/'
            }
        },

        /**
         * watch and guard tasks
         *
         * @type {Object}
         * @todo other regarde tasks for js, image etc.
         */
        watch: {
            options: {
                livereload: true,
                nospawn: true
            },
            css: {
                files: [
                    'src/stylesheets/**/*.less'],
                tasks: [
                    'clean:css', 'less', 'autoprefixer'],
            },
            scripts: {
                files: [
                     'src/scripts/twitter-bootstrap/javascript/**/**'],
                tasks: ['clean:js', 'copy:jsbootstrap']
            },
            imgs: {
                files: [
                    'src/images/**/*'],
                tasks: ['clean:img', 'copy:imgbootstrap']
            },
            templates: {
                files: [
                    'src/templates/**/**'],
                tasks: [
                    'clean:template', 'less', 'autoprefixer', 'jade', 'copy:jsbootstrap', 'copy:htaccess']
            }
        }
    });

    /**
     * ======================================================================================================================================
     */

    grunt.registerTask('default', ['clean:all', 
        'less', 'autoprefixer',
        'jade', 
        'copy:imgbootstrap',
        'copy:jsbootstrap', 'copy:htaccess', 
        'prettify',
        'connect', 
        'open', 
        'watch'
    ]);

    /**
     * ======================================================================================================================================
     */

    grunt.registerTask('scriptsalone', ['clean:js', 'copy:jsbootstrap']);

    grunt.registerTask('csssalone', ['less', 'autoprefixer']);

    grunt.registerTask('jadecompilealone', ['clean:all', 
        'less', 'autoprefixer',
        'jade',
        'copy:jsbootstrap', 'copy:htaccess',
        'prettify'
    ]);
    grunt.registerTask('buildconcat', 'build html with compressed and concatted css and js', function(t) {
        if (t) grunt.task.run(['clean:all', 
            'less', 'autoprefixer',
            'jade', 
            'copy:imgbootstrap', 
            'dom_munger:target', 'dom_munger:targetCss', 'cssmin', 
            'copy:jsbootstrap', 'copy:htaccess',
            'uglify', 
            'dom_munger:jsconcat', 'dom_munger:cssconcat', 'dom_munger:cleanlr', 'prettify']);
        else grunt.task.run(['clean:all', 
            'less', 'autoprefixer',
            'jade',
            'copy:imgbootstrap',
            'dom_munger:target', 'dom_munger:targetCss', 'cssmin', 
            'copy:jsbootstrap', 'copy:htaccess', 
            'uglify', 'dom_munger:cleanlr', 'prettify']);

    });
    grunt.registerTask('cleanlr', 'tasks to clean livereload JS', function(){
        grunt.task.run(['dom_munger:cleanlr']);
    });
    grunt.registerTask('pretty', 'tasks to prettify html', function(){
        grunt.task.run(['prettify']);
    });
    grunt.registerTask('build', 'tasks to prettify html', function(){
        grunt.task.run(['copy:build']);
    });

};