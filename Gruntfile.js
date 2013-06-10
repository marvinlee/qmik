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
					'src/Qmik.js',
					'src/Qmik._query.js',
					'src/Qmik._event.js',
					'src/Qmik._view.js',
					'src/Qmik._ajax.js',
					'src/Qmik.sun.js'
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
					'assets/Qmik.old.js' : [
						'src/Qmik.old.js'
					],
					'assets/Qmik.js' : [
						'src/Qmik.js',
						'src/Qmik._query.js',
						'src/Qmik._event.js',
						'src/Qmik._view.js',
						'src/Qmik._ajax.js',
						'src/Qmik.sun.js'
					],
					'assets/Qmik._query.js' : [
						'src/Qmik._query.js'
					],
					'assets/Qmik.sun.js' : [
						'src/Qmik.sun.js'
					],
					'assets/Qmik.one.js' : [
						'src/Qmik.js'
					],
					'assets/Qmik.Cache.js' : [
						'src/Qmik.Cache.js'
					],
					'assets/Qmik._event.js' : [
						'src/Qmik._event.js'
					],
					'assets/Qmik._view.js' : [
						'src/Qmik._view.js'
					],
					'assets/Qmik._ajax.js' : [
						'src/Qmik._ajax.js'
					],
					'assets/plugins/Qmik.nav.js' : [
						'src/plugins/Qmik.nav.js'
					],
					'assets/plugins/Qmik.JSON.js' : [
						'src/plugins/Qmik.JSON.js'
					],
					'assets/plugins/Qmik.fn.fade.js' : [
						'src/plugins/Qmik.fn.fade.js'
					]
				}
			}
		},
		cssmin : {
			compress : {
				files : {
					'assets/all.css' : [ /* 'css/base.css', 'css/global.css' */]
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
