var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry:{
		main: './src/script/main.js',
		a: './src/script/a.js',
		b: './src/script/b.js',
		c: './src/script/c.js',
	},   //打包入口文件
	output: {
		// filename:'./dist/js/bundle.js'
		filename: 'js/[name]-[chunkhash].js',
    	path: __dirname + '/dist',
    	publicPath: 'http://cdn.com/'   //发布上线时地址配置
	},
	plugins: [
		new htmlWebpackPlugin({
			filename: 'a.html',
			template: 'index.html',
			inject: false,
			title: 'this is a.html',
			// chunks:['main','a'],
			excludeChunks:['b','c']
			// date: new Date(),
			// minify:{
			// 	removeComments: true,  //删除注释
			// 	collapseWhitespace: true  //删除空格
			// }
		}),
		new htmlWebpackPlugin({
			filename: 'b.html',
			template: 'index.html',
			inject: false,
			title: 'this is b.html',
			excludeChunks:['a','c']
		}),
		new htmlWebpackPlugin({
			filename: 'c.html',
			template: 'index.html',
			inject: false,
			title: 'this is c.html',
			excludeChunks:['b','a']
		})
	]
}