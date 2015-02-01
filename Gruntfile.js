module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),    
    
    changelog: {
      sample: {
        options: {
          // Task-specific options go here. 
        }
      }
    },    
    
    shell: {
      gitCachePassword: {
        command: "git config --global credential.helper cache || git push --all"
      },
      gitAddAll: {
        command: "git add -A"
      },
      gitPushAll: {
        command: "git push --all"
      },
      gitPushTags: {
        command: "git push --tags"
      },
      changelog: {
        command: "sh .changelog_generator.sh > changelog.txt"
      },
      history: {
        command: "git log --graph --oneline --decorate > history.txt"
      }
    },
    
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
    
    
    // Commit and tag the new version   
       gitcommit: {
            version: {
                options: {
                    message: 'Release: v<%= pkg.version %>'
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
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-changelog');
  grunt.loadNpmTasks('grunt-bump');
  

  // Default task(s).
  grunt.registerTask('default', ['uglify','sass']);
  
  grunt.registerTask('bumpMajor', ['bump:major','version']);
  grunt.registerTask('bumpMinor', ['bump:minor','version']);
  grunt.registerTask('bumpPatch', ['bump:patch','version']);
  
  // Release task
  grunt.registerTask( 'prepareRelease', [ // Prepare for Release
                                          'shell:gitCachePassword',
                                          'version',
                                          'uglify',
                                          'sass',
                                          'shell:gitAddAll',
                                          'gitcommit:version',
                                          'gittag:version',
                                          'shell:gitPushAll',
                                          'shell:gitPushTags']);

  // By default, the command release makes a bump patch
  grunt.registerTask( 'release', ['releasePatch'] );
  // Make a patch release
  grunt.registerTask( 'releaseMajor', ['bump:major','prepareRelease']);
  grunt.registerTask( 'releaseMinor', ['bump:minor','prepareRelease']);
  grunt.registerTask( 'releasePatch', ['bump:patch','prepareRelease']);

 

};