const path = require('path');
const webpack = require('webpack');
const loadenv = require('node-env-file');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules",
    ],
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    }],
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': (() => {
        loadenv('./.envrc');
        return JSON.stringify(process.env);
      })(),
    }),
    new webpack.optimize.UglifyJsPlugin({ // minifiy
      minimize: true,
      compress: {
        warnings: false,
      },
    }),
  ],
};
