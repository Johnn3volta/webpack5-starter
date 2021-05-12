const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/* Удаляет пустые js скрипты */
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const common = require('./common');

const conf = {
  mode: 'production',
  target: 'browserslist',
  devtool: false,
  output: {
    filename: 'js/[name].js',
    publicPath: './',
  },
  module: {
    rules: [
      /* css */
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      /* JavaScript */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css',
    }),
  ],
};

module.exports = merge(common, conf);
