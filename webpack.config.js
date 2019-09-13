const webpack = require('webpack');
const pkg = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        exclude: /\/node_modules/
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        APP_VERSION: JSON.stringify(pkg.version)
      }
    })
  ]
};
