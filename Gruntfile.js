module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
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
				timeout : 5000,
				'--cookies-file' : ''
			},
			all : [
				'test/**/test*.html'
			]
		},
		connect: {
	        server: {
	            options: {
	                port: 3000,
	                base: '.'
	            }
	        }
	    },
		concat : {
			core : {//核心版本
				src : [
					'src/Qmik.js', 
					'src/Qmik._query.js', 
					'src/Qmik._event.js', 
					'src/Qmik._ajax.js', 
					'src/Qmik.task.js',
					'src/Qmik.sun.js', 
					'src/Qmik._view.js'
				],
				dest : "assets/Qmik-debug.js"
			},
			all: {//全部合并版本
				src : [
					'src/Qmik.js', 
					'src/Qmik._query.js', 
					'src/Qmik._event.js', 
					'src/Qmik._ajax.js', 
					'src/Qmik.task.js',
					'src/Qmik.sun.js', 
					'src/Qmik._view.js', 
					'src/modules/mvc.js'
				],
				dest : "assets/Qmik-debug.all.js"
			}
		},
		uglify : {
			options : {
				// 减小名称压缩
				mangle : true
			},
			build : {
                options: {
                    mangle: true,
                    banner : '/* welcome use qmik; http://www.qmik.org */\r\n'
                },
				files : {
					'assets/Qmik.js' : [//core版本
						'src/Qmik.js',
						'src/Qmik._query.js',
						'src/Qmik._event.js',
						'src/Qmik.task.js',
						'src/Qmik.sun.js',
						'src/Qmik._ajax.js',
						'src/Qmik._view.js'
					],
					'assets/Qmik.all.js' : [//全部合并版本
						'src/Qmik.js',
						'src/Qmik._query.js',
						'src/Qmik._event.js',
						'src/Qmik.task.js',
						'src/Qmik.sun.js',
						'src/Qmik._ajax.js',
						'src/Qmik._view.js', 
						'src/modules/mvc.js'
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
					'assets/Qmik._event.js' : [
						'src/Qmik._event.js'
					],
					'assets/Qmik._view.js' : [
						'src/Qmik._view.js'
					],
					'assets/Qmik._ajax.js' : [
						'src/Qmik._ajax.js'
					],
					'assets/Qmik.task.js' : [
						'src/Qmik.task.js'
					],
					'assets/modules/mvc.js' : [
						'src/modules/mvc.js'
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
	grunt.registerTask('server', ['connect', 'watch']);
	// Default task(s).
	grunt.event.on('qunit.spawn', function (url) {
	  grunt.log.ok("Running test: " + url);
	});
	grunt.registerTask('default', [
		'clean', 'uglify', 'concat', 'qunit'
	]);
	
};
