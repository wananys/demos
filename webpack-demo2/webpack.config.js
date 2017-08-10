var htmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
	entry:{
		main: './src/app.js'
	},   //打包入口文件
	output: {
		// filename:'./dist/js/bundle.js'
		filename: 'js/[name].bundle.js',
    	path: __dirname + '/dist',
	},
	module:{
		loaders:[
			{  
			//JS处理
				test: /\.js$/,
				loader: 'babel-loader',
				// exclude: path.resolve(__dirname, 'node_modules'),   //991ms
				// include: path.resolve(__dirname, 'src'),  //1031ms
				// exclude: __dirname+'/node_modules/',   
				// include: __dirname+'/src/',   //506ms
				exclude: path.resolve(__dirname, '/node_modules'),  
				include: path.resolve(__dirname, '/src'),  //492ms
				query: {
					presets: ['latest']
				}
			},{
				//css处理
				test: /\.css$/,
				loader: 'style-loader!css-loader!postcss-loader'
			}
		]
	},
	postcss:[
		require('autoprefixer')({
			broswers: ['last 5 versions']
		})
	],
	plugins: [
		new htmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: 'body'
		})
	]
}