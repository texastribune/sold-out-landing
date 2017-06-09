const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');

const config = require('./webpack.config');
const projectConfig = require('./project.config');

const appSrc = path.join(__dirname, '/app/scripts');
const appBuild = path.join(__dirname, '/dist/scripts');

const productionConfig = Object.assign({}, config, {
  bail: true,
  devtool: 'source-map'
});

productionConfig.output = {
  path: appBuild,
  filename: '[name].js',
  chunkFilename: '[id].[hash].chunk.js',
  publicPath: '/' + path.join(projectConfig.folder, '/scripts/'),
  devtoolModuleFilenameTemplate: info =>
    path.relative(appSrc, info.absoluteResourcePath)
};

productionConfig.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      comparisons: false
    },
    output: {
      comments: false
    },
    sourceMap: true
  })
);

module.exports = productionConfig;
