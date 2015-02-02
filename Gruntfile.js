module.exports = function(grunt) {
  
  
  // Project configuration.
  grunt.initConfig({
    

    // Load package config options
    pkg: grunt.file.readJSON('package.json'), 
    
    
    // *********************************************************************************************
    // Deploy your theme with FTP using username and password
    // The user and password must be stored in the file .ftppass
    // *********************************************************************************************
    'ftp-deploy': {
        build: {
          auth: {
            host: 'ftp.server.com', // your server ftp address
            port: 21, // ftp server port (default: 21)
            authKey: 'key1' // authkey name in .ftppass used for authentication
        },
        src: './', // local folder used to sync ( ./ sync current directory ) 
        dest: '/public_html/wp-content/themes/orangepress-starterkit-theme/', // remote folder to receive your files
        exclusions: ['.ftppass', '.git', '.sass-cache', 'bower_components', 'node_modules' ] // files and folders that are not synchronized (some for security reasons)
      }
    }, //'ftp-deploy' 
    
    
    // *********************************************************************************************
    // Run shell commands to automate some tasks, like git, etc
    // *********************************************************************************************
    shell: {
      // Run git credential.helper to cache your credentials for 15 minutes
      gitCachePassword: {
        command: "git config --global credential.helper cache || git push --all"
      },
      // Add all changes in current repository to git
      gitAddAll: {
        command: "git add -A"
      },
      // Push all commits and tags to your remote
      gitPush: {
        command: [
                'git push --all',
                'git push --tags'
            ].join('&&')
      },
      // Make a changelog of your repository history grouped by tagg
      gitdoc: {
        command: [
                "sh .changelog_generator.sh > changelog.txt",
                "git log --graph --oneline --decorate > history.txt"
            ].join('&&')
      }
    }, //shell
    
    
    // *********************************************************************************************
    // Bumps package version without create git tags and commits
    // *********************************************************************************************
    bump: {
        options: {
          files: ['package.json'],
          commit: false,
          createTag: false,
          push: false,
          globalReplace: false
        }
      }, //bump  
    
    
    // *********************************************************************************************
    // Bump version numbers for the theme in style.scss and functions.php
    // *********************************************************************************************
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
    }, //version
    
    
    // *********************************************************************************************
    // Creates a git commit with a message: "Release: v1.0.0"
    // *********************************************************************************************    
    gitcommit: {
      version: {
        options: {
          message: 'Release: v<%= pkg.version %>'
        }
      }
     }, //gitcommit
    
    
    // *********************************************************************************************
    // Creates a git tag with a message: "v1.0.0"
    // ********************************************************************************************* 
    gittag: {
      version: {
        options: {
          tag: 'v<%= pkg.version %>',
          message: 'v<%= pkg.version %>'
        }
      }
    }, //gittag
        
    
    // *********************************************************************************************
    // Compiles the all scripts on "/core-js" folder and the frameworks provided by bower
    // Outputs:
    //   orangepress-core-frameworks.min.js (All frameworks provided by bower)
    //   orangepress-core-scripts.min.js (All scripts on "/core-js" folder)
    // *********************************************************************************************
    uglify: {
      dist: {
        options: {
          preserveComments: false,
          banner: "Powered by Orangepress"
        },
        // Consider adding bootstrap, jquery and other frameworks here to consolidate your browser requests
        files: {
          'orangepress-core-frameworks.min.js': [
            'bower_components/jquery/dist/jquery.js', 'bower_components/bootstrap/dist/js/bootstrap.js'
          ],
          'orangepress-core-scripts.min.js': [
            'core-js/*.js'
          ]
        }
      }
    }, // uglify
    
    
    // *********************************************************************************************
    // Compiles the all styles on "/core-scss" folder and the frameworks provided by bower
    // Outputs:
    //   orangepress-core-frameworks.min.css (All frameworks provided by bower)
    //   orangepress-core-styles.min.css (All styles on "/core-scss" folder)
    // *********************************************************************************************
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {                         // Dictionary of files 
          'orangepress-core-frameworks.min.css': 'core-scss/core-frameworks.scss',
          'orangepress-core-styles.min.css': 'core-scss/core-styles.scss',
          'style.css': 'style.scss'
        }
      }
    } // sass
    
    
}); //grunt.initConfig
   
  
  // *********************************************************************************************
  // Load the NPM tasks
  // *********************************************************************************************   
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-changelog');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-ftp-deploy');
  

  // *********************************************************************************************
  // Tasks provided by Orangepress
  // *********************************************************************************************   
  // Compile assets
  grunt.registerTask('default', ['uglify','sass']);
  // Only Bump major version of package
  grunt.registerTask('bumpMajor', ['bump:major','version']);
  // Only Bump minor version of package  
  grunt.registerTask('bumpMinor', ['bump:minor','version']);
  // Only Bump patch version of package
  grunt.registerTask('bumpPatch', ['bump:patch','version']);
  // Use this task to prepare your release
  grunt.registerTask( 'prepareRelease', [ 'shell:gitCachePassword', 'version', 'uglify',
                                          'sass', 'shell:gitAddAll', 'gitcommit:version',
                                          'gittag:version', 'shell:gitPush', 'shell:gitdoc' ]);
  // By default, the task release makes a bump patch, prepare your files and send to repository
  grunt.registerTask( 'release', ['releasePatch'] );
  // Make a Major Bump and prepare your files to send to your repository
  grunt.registerTask( 'releaseMajor', ['bump:major','prepareRelease']);
  // Make a Minor Bump and prepare your files to send to your repository  
  grunt.registerTask( 'releaseMinor', ['bump:minor','prepareRelease']);
  // Make a Patch Bump and prepare your files to send to your repository  
  grunt.registerTask( 'releasePatch', ['bump:patch','prepareRelease']);
  // Create a changelog of your repository history
  grunt.registerTask( 'doc', ['shell:gitdoc'] );
  
  

};