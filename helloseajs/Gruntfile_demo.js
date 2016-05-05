module.exports = function(grunt){
	grunt.initConfig({
		jshint:{
			options: {
				format: 'application/dist/{{filename}}'  //生成的id格式
			},
			application: {
				files: {
					'.build' : ['application.js','util.js'] //将application.js、util.js合并且提取依赖，生成id，之后放在.build目录下
				}
			}
		},
		nodeunit: {
			main : {
				option: {
					relative : true
				},
				files:{
					'dist/application.js' : ['.build/application.js'],  //合并.build/application.js文件到dist/application.js中
					'dist/application-debug.js' : ['.build/application-debug.js']
				}
			}
		},
		uglify : {
			main : {
				files: {
					'dist/application.js' : ['dist/application.js'] //对dist/application.js进行压缩，之后存入dist/application.js文件
				}
			}
		},
		clean : {
			build : ['.build'] //清除.build文件
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.registerTask('build',['jshint','nodeunit','uglify','clean']);
};
