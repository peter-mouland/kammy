const webpack = require('webpack');
const nodemon = require('nodemon');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodemonConfig = require('./nodemon.json');
const baseConfig = require('./webpack.common');
const { SRC, DIST } = require('./src/config/paths');
require('./src/config/config');

module.exports = merge(baseConfig, {
  devtool: 'inline-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      `${SRC}/client-entry.js`
    ],
    vendor: [`${SRC}/vendor.js`]
  },
  output: {
    path: DIST,
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '**': 'http://localhost:9090'
    },
    setup() {
      process.env.PORT = 9090;
      nodemonConfig.script = 'src/server-entry.js';
      nodemon(nodemonConfig);
    },
    hot: true
    // enable HMR on the server
  }
});
