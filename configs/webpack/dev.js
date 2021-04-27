const paths = require('../paths');

const webpack = require('webpack');
const { merge } = require('webpack-merge');

const common = require('./common');

const { build } = paths;

const conf = {
  mode: 'development',
  target: 'web',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    compress: true,
    contentBase: build,
    historyApiFallback: true,
    open: true,
    port: 3001,
    clientLogLevel: 'silent',
  },
  module: {
    rules: [
      /* css */
      {
        test: /\.(sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = merge(common, conf);
