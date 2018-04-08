const mapWebpackAssets = require('./mapWebpackAssets');

function getAssets() {
  const assets = (process.env.NODE_ENV === 'production')
    ? require('../../../compiled/webpack-assets.json') // eslint-disable-line global-require
    : {
      app: { js: '/app.js', css: '/app.css' },
      polyfills: { js: '/polyfills.js' },
      vendor: { js: '/vendor.js' }
    };
  return mapWebpackAssets(assets);
}

module.exports = getAssets;
