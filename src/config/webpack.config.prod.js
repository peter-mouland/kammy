const { SRC } = require('./paths');
const defaultConfig = require('./webpack.common');

const merge = require('webpack-merge');
const Visualizer = require('webpack-visualizer-plugin');

const prodConfig = merge(defaultConfig, {
  entry: {
    app: [`${SRC}/client-entry.js`],
    vendor: [`${SRC}/vendor.js`]
  },
  plugins: [
    new Visualizer({
      filename: '../webpack-stats.html'
    }),
  ]
});

module.exports = prodConfig;
