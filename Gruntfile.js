module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig( {
		clean : {
			build : [
				"assets/"
			],
			release : [
				"dist1"
			]
		},
		qunit : {
			options : {
				timeout : 10000,
				'--cookies-file' : '**'
			},
			all : [
				'test/**/*.html'
			]
		},
		concat : {
			dist : {
				src : [
					'src/Qmik.js', 'src/Qmik._query.js', 'src/Qmik.Cache.js', 'src/Qmik._event.js', 'src/Qmik._view.js', 'src/Qmik.sun.js'
				],
				dest : "assets/Qmik-debug.js"
			}
		},
		uglify : {
			options : {
				// 减小名称压缩
				mangle : true
			},
			build : {
				files : {
					'assets/Qmik.min.old.js' : [
						'src/Qmik.old.js'
					],
					'assets/Qmik.min.js' : [
						'src/Qmik.js', 'src/Qmik._query.js', 'src/Qmik.Cache.js', 'src/Qmik._event.js', 'src/Qmik._view.js', 'src/Qmik.sun.js'
					],
					'assets/Qmik._query.min.js' : [
						'src/Qmik._query.js'
					],
					'assets/Qmik.sun.min.js' : [
						'src/Qmik.sun.js'
					],
					'assets/Qmik.one.min.js' : [
						'src/Qmik.js'
					],
					'assets/Qmik.Cache.min.js' : [
						'src/Qmik.Cache.js'
					],
					'assets/Qmik._event.min.js' : [
						'src/Qmik._event.js'
					],
					'assets/Qmik._view.min.js' : [
						'src/Qmik._view.js'
					],
					'assets/plugins/Qmik.nav.min.js' : [
						'src/plugins/Qmik.nav.js'
					]
				}
			}
		},
		cssmin : {
			compress : {
				files : {
					'assets/all.min.css' : [ /* 'css/base.css', 'css/global.css' */]
				}
			},
			// smeite: {
			// files: {
			// 'assets/smeite.all.css':
			// ['/play21/smeite.com/public/assets/css/**/*.css']
			// }
			// },
			with_banner : {
				options : {
					banner : '/* My minified css file test test */'
				},
				files : {
				// 'assets/min/base.css': ['css/base.css'],
				// 'assets/min/global.css': ['css/global.css']
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	// Default task(s).
	grunt.registerTask('default', [
		'clean', 'uglify', 'concat', 'qunit'
	]);
};
