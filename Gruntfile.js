module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),  
    
    
    bump: {
        options: {
          files: ['package.json'],
          commit: false,
          createTag: false,
          push: false,
          globalReplace: false
        }
      },        
    

    // Bump version numbers for the theme in style.css and functions.php
    version: {
        css: {
            options: {
                prefix: 'Version\\:\\s'
            },
            src: [ 'style.scss' ],
        },
        php: {
            options: {
                    prefix: '\@version\\s+'
            },
            src: [ 'functions.php' ],
        }
    },   
    
    
    // Commit, tag, and push the new version of the theme
    gitcommit: {
        version: {
            options: {
                message: 'Release: <%= pkg.version %>'
            },
            files: {
                // Specify the files you want to commit
                src: ['style.css', 'package.json', 'functions.php']
            }
        }
    },
    gittag: {
      version: {
          options: {
              tag: 'v<%= pkg.version %>',
              message: 'v<%= pkg.version %>'
          }
      }
    },
    gitpush: {
        version: {},
        tag: {
            options: {
                tags: true
            }
        }
    },    

    
    uglify: {
      dist: {
        files: {
          'orangepress-core-frameworks.min.js': [
            'bower_components/jquery/dist/jquery.js', 'bower_components/bootstrap/dist/js/bootstrap.js'
          ],
          'orangepress-core-scripts.min.js': [
            'core-js/*.js'
          ]          
          // Consider adding bootstrap js files here to consolidate your browser requests
        },
        options: {
          // JS source map: to enable, uncomment the lines below and update sourceMappingURL based on your install
          // sourceMap: 'assets/js/scripts.min.js.map',
          // sourceMappingURL: '/app/themes/roots/assets/js/scripts.min.js.map'
        }
      }
    }, // uglify
    
    sass: {                              // Task 
      dist: {                            // Target 
        options: {                       // Target options 
          style: 'expanded'
        },
        files: {                         // Dictionary of files 
          'orangepress-core-frameworks.min.css': 'core-scss/core-frameworks.scss',
          'orangepress-core-styles.min.css': 'core-scss/core-styles.scss',
          'style.css': 'style.scss'
        }
      }
    } // sass
    
  });
  

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-bump');
  

  // Default task(s).
  grunt.registerTask('default', ['uglify','sass']);
  
  grunt.registerTask('bumpMajor', ['bump:major','version']);
  grunt.registerTask('bumpMinor', ['bump:minor','version']);
  grunt.registerTask('bumpPatch', ['bump:patch','version']);
  
  // Release task
  grunt.registerTask( 'release', [ 'gitcommit:version', 'gitpush:tag', 'gitpush:version' ]);  

};