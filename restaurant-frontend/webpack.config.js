const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({ 
	template: path.resolve(__dirname, "public", "index.html"),
	favicon: "./public/favicon.ico",
	filename: "index.html",
});

module.exports = {
	entry: path.resolve(__dirname, "./src/index.js"),
	module: {
		rules: [
			{
				test: /\.js$|jsx/,
				use: ["babel-loader"],
			},
			{
				test: /\.ts$|tsx/,
				use: ["babel-loader"],
			},
			{
				test: /\.less$/i,
				use: [
					// compiles Less to CSS
					"style-loader",
					"css-loader",
					"less-loader",
				],
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|svg)$/i,
				use: [
					{
						loader: "file-loader",
						options: {
							limit: 10000,
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
	},
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "bundle.js",
	},
	devServer: {
		static: {
			directory: path.join(__dirname, "public")
		},
		allowedHosts: "all",
		historyApiFallback: true,
	},
	plugins: [HTMLWebpackPluginConfig],
	devtool: "source-map",
};
