const merge = require('webpack-merge');
const Visualizer = require('webpack-visualizer-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const { SRC } = require('./src/config/paths');
const defaultConfig = require('./webpack.common');

const prodConfig = merge(defaultConfig, {
  entry: {
    app: [`${SRC}/client-entry.js`],
    vendor: [`${SRC}/vendor.js`]
  },
  plugins: [
    new AssetsPlugin({ filename: 'compiled/webpack-assets.json' }),
    new Visualizer({
      filename: '../webpack-stats.html'
    }),
  ]
});

module.exports = prodConfig;
