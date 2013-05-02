module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    clean: {
      build: ["assets1"],
      release: ["dist1"]
    },
    qunit: {
      options: {
        timeout: 10000,
        '--cookies-file': '**'
      },
      all: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: [
          "src/Qmik.js"],
        dest: "dist/Qmik-debug.js"
      }
    },
    uglify: {
      options: {
        //减小名称压缩
        mangle: true
      },
      build: {
        files: {
          'assets/Qmik.min.old.js': ['src/Qmik.old.js'],
          'assets/Qmik.min.js': ['src/Qmik.js','src/Qmik.Query.js','src/Qmik.Cache.js','src/Qmik.Cache.js','src/Qmik.event.js','src/Qmik.view.js'],
          'assets/Qmik.JSON.min.js': ['src/Qmik.JSON.js'],
           'assets/Qmik.Query.min.js': ['src/Qmik.Query.js'],
          'assets/Qmik.one.min.js': ['src/Qmik.js'],
          'assets/Qmik.Cache.min.js': ['src/Qmik.Cache.js'],
          'assets/Qmik.event.min.js': ['src/Qmik.event.js'],
          'assets/Qmik.view.min.js': ['src/Qmik.view.js']
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

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Default task(s).
  grunt.registerTask('default', ['uglify', 'concat', 'qunit']);



};