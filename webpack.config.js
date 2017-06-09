const path = require('path');

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const appSrc = path.join(__dirname, '/app/scripts');
const appBuild = path.join(__dirname, '/dist/scripts');

module.exports = {
  devtool: 'cheap-module-source-map',
  context: appSrc,
  entry: {
    // if you are building an embed, swap out these two lines
    main: ['./utils/polyfills.js', './main.js']
    // main: ['./utils/polyfills.js', './main-embed.js']
  },
  output: {
    path: appBuild,
    pathinfo: true,
    publicPath: '/scripts/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].chunk.js',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath)
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: appSrc,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [new CaseSensitivePathsPlugin()],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    setImmediate: false
  }
};
