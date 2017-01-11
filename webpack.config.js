module.exports = {
	entry: './index.js',
	target: 'node',
	output: {
		path: './bin',
		filename: 'atom-control.js'
	},
	module: {
		loaders: [
			{test: /\.json$/, loader: 'json-loader'}
		]
	}
};
