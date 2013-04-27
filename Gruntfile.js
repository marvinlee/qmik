module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    concat: {
      dist: {
        src: [
          "src/Qmik.js"],
        dest: "dist/Qmik-debug.js"
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      build: {
        files: {
          'assets/Qmik.min.js': ['src/Qmik.js'],
          'assets/Qmik.JSON.min.js': ['src/Qmik.JSON.js']
        }
      }
    },

    cssmin: {
      compress: {
        files: {
          'assets/all.min.css': [ /*'css/base.css', 'css/global.css'*/ ]
        }
      },
      // smeite: {
      //  files: {
      //    'assets/smeite.all.css': ['/play21/smeite.com/public/assets/css/**/*.css']
      //  }
      // },
      with_banner: {
        options: {
          banner: '/* My minified css file test test */'
        },
        files: {
          // 'assets/min/base.css': ['css/base.css'],
          //'assets/min/global.css': ['css/global.css']
        }
      }
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};