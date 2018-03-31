const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssnano = require('cssnano');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const { SRC, DIST } = require('./src/config/paths');

const postCssPlugins = [cssnano({
  autoprefixer: {
    browsers: [
      'safari 9',
      'ie 10-11',
      'last 2 Chrome versions',
      'last 2 Firefox versions',
      'edge 13',
      'ios_saf 9.0-9.2',
      'ie_mob 11',
      'Android >= 4'
    ],
    cascade: false,
    add: true,
    remove: true
  },
  safe: true
})];


module.exports = {
  devtool: 'eval',
  cache: true,
  context: SRC,
  output: {
    path: DIST,
    filename: '[name]_[hash].js',
    publicPath: '/'
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ names: ['vendor'], minChunks: Infinity }),
    new ExtractTextPlugin('[name]_[hash].css'),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.PORT': JSON.stringify(process.env.PORT),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.GA_KEY': JSON.stringify(process.env.GA_KEY)
    }),
    new CopyWebpackPlugin([
      { from: 'assets', to: '.' }
    ]),
  ],
  resolve: {
    modules: ['node_modules', SRC],
    mainFields: ['src', 'browser', 'module', 'main'],
    extensions: ['.js', '.jsx', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [/src/, /@kammy\/(.*)/],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.scss$/,
        include: [/src/, /@kammy\/(.*)/],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            { loader: 'postcss-loader', options: { plugins: postCssPlugins } },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.svg$/,
        include: [/src/, /@kammy\/(.*)/],
        loader: 'svg-inline-loader',
        options: {
          removeSVGTagAttrs: false
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          'file-loader?name=[name]-[hash].[ext]'
        ]
      }
    ]
  }
};
