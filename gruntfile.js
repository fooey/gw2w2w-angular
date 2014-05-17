module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-closure-compiler');


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concurrent: {
			dev: {
				tasks: ['nodemon:dev', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			},

			prod: {
				tasks: ['nodemon:prod', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},


		nodemon: {
			dev: {
				script: './server.js',
				options: {
					nodeArgs: ['--harmony'],
					ext: 'js,jade,json',
					ignore: ['node_modules/**', 'public/**', 'gruntfile.js'],

					// delay: 1,
					env: {
						PORT: '3002',
						NODE_ENV: 'development'
					},
					cwd: __dirname,

					callback: function(nodemon) {
						function writeReboot() {
							setTimeout(function() {
								require('fs').writeFileSync('.rebooted', Date.now());
							}, 100);
						}

						// watch "./.reboot" to refresh browser when server starts or reboots
						nodemon.on('start', writeReboot);
						nodemon.on('restart', writeReboot);
					}
				}
			},
			prod: {
				script: './server.js',
				options: {
					nodeArgs: ['--harmony'],
					ext: 'js,jade,json',
					ignore: ['node_modules/**', 'public/**', 'views/partials/**', 'gruntfile.js'],

					// delay: 1,
					env: {
						PORT: '3002',
						NODE_ENV: 'production'
					},
					cwd: __dirname,
				}
			}
		},


		watch: {
			lessApp: {
				files: [
					'./public/src/css/app.less'
				],
				tasks: ['less:dev'],
				options: {
					livereload: false,
				},
			},
			lessBootstrap: {
				files: [
					'./public/src/css/bootstrap.less',
				],
				tasks: ['less:bootstrap'],
				options: {
					livereload: false,
				},
			},
			lessAnimations: {
				files: [
					'./public/src/css/animations.less',
				],
				tasks: ['less:animations'],
				options: {
					livereload: false,
				},
			},

			cssApp: {
				files: [
					'./public/dist/css/*.css',
					'!./public/dist/css/*.min.css',
				],
				tasks: ['cssmin'],
				options: {
					livereload: true,
				},
			},


			jsDev: {
				files: [
					'./public/src/js/**/*.js',
				],
				tasks: ['uglify'],
				options: {
					livereload: true,
				},
			},

			jsProd: {
				files: [
					'./public/dist/js/*.min.js',
				],
				options: {
					livereload: true,
				},
			},



			// htmlTemplates: {
			// 	files: [
			// 		'./views/**/*.jade',
			// 	],
			// 	options: {
			// 		livereload: true,
			// 	},
			// },


			server: {
				files: ['./.rebooted'],
				options: {
					livereload: true
				}
			},
		},


		less: {
			dev: {
				files: {
					"./public/dist/css/app.css":
						"./public/src/css/app.less"
				},
				options: {
					sourceMap: true,
					sourceMapURL: '/dist/css/app.css.map',
					sourceMapFilename: './public/dist/css/app.css.map',
					sourceMapBasepath: './public',
					sourceMapRootpath: '/',
				}
			},
			bootstrap: {
				files: {
					"./public/dist/css/bootstrap.css": [
						"./public/src/css/bootstrap.less",
					]
				},
				options: {
					sourceMap: true,
					sourceMapURL: '/dist/css/bootstrap.css.map',
					sourceMapFilename: './public/dist/css/bootstrap.css.map',
					sourceMapBasepath: './public',
					sourceMapRootpath: '/',
				}
			},
			animations: {
				files: {
					"./public/dist/css/animations.css": [
						"./public/src/css/animations.less",
					]
				},
				options: {
					sourceMap: true,
					sourceMapURL: '/dist/css/animations.css.map',
					sourceMapFilename: './public/dist/css/animations.css.map',
					sourceMapBasepath: './public',
					sourceMapRootpath: '/',
				}
			}
		},


		cssmin: {
			app: {
				files: {
					'public/dist/css/app.min.css': [
						'public/dist/css/bootstrap.css',
						'public/dist/css/animations.css',
						'public/dist/css/app.css',
					]
				}
			}
		},

		uglify: {
			options: {
				report: 'min',
				stripBanners: false,
				banner: '/*! grunt-uglify <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
				mangle: true,
				preserveComments: 'some',
			},
			appJs: {
				options: {
					sourceMap: true,
				},
				files: {
					'public/dist/js/app.min.js': [
						'public/src/js/app.js',
						// // 'public/src/js/animations.js',
						'public/src/js/filters.js',
						'public/src/js/directives.js',

						// 'public/src/js/components/objective.js',

						'public/src/js/services/memCache.js',
						'public/src/js/services/localstorage.js',
						'public/src/js/services/i18n.js',
						'public/src/js/services/gw2api.js',
						'public/src/js/services/gw2data.js',
						'public/src/js/services/gw2.js',

						'public/src/js/controllers/app.js',
						'public/src/js/controllers/overview.js',
						'public/src/js/controllers/tracker.js',
					]
				}
			},
		},

	});



	// grunt.registerTask('minify', ['cssmin:css', 'closure-compiler2:appJs', 'uglify:appJs']);
	grunt.registerTask('dev', ['less', 'cssmin', 'uglify', 'concurrent:dev']);
	grunt.registerTask('prod', ['less', 'cssmin', 'uglify', 'concurrent:prod']);
	grunt.registerTask('default', ['less', 'nodemon:dev']);
	// grunt.registerTask('closure', ['uglify']);
};
