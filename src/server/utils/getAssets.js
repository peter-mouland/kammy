function mapWebpackAssets(assetsObj) {
  const assets = { scripts: [], stylesheets: [] };
  Object.keys(assetsObj).forEach((key) => {
    const { js, css } = assetsObj[key];
    if (js && key === 'vendor') {
      assets.scripts.unshift(js);
    } else if (js) {
      assets.scripts.push(js);
    }
    if (css) assets.stylesheets.push(css);
  });
  return assets;
}

module.exports = function getAssets() {
  if (process.env.NODE_ENV === 'production') {
    const webpackAssets = require('../../../compiled/webpack-assets.json'); // eslint-disable-line import/no-unresolved, global-require
    return mapWebpackAssets(webpackAssets);
  }
  return { scripts: ['/vendor.js', '/app.js'], stylesheets: ['/app.css'] };
};

module.exports.mapWebpackAssets = mapWebpackAssets;
