module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
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
    },
    
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

  // Default task(s).
  grunt.registerTask('default', ['uglify','sass']);

};