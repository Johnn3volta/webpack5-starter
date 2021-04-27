const paths = require('../paths');
const fs = require('fs');

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { js, build, scss, images, fonts, pugPages } = paths;

const imagesLoadersOptions = [
  {
    loader: 'url-loader',
    options: {
      limit: 1000, // in bytes,
      name(url) {

        const newName = url.replace(`${images}\\`, '');
        const regex = new RegExp(/\\/g);

        return newName.replace(regex, '/');
      },
      publicPath: '../images',
      outputPath: 'images',
    },
  },
  {
    loader: 'webpack-image-resize-loader',
    options: {
      width: 1920,
    },
  },
];

/* Если верстка ведется в обычном html,
 * код ниже либо переделать под html,
 * либо закоментить */

const pagesOfPug = fs.readdirSync(pugPages);
const templates = [];
pagesOfPug.forEach(page => {
  const baseName = page.replace('.pug', '');
  templates.push(
    new HtmlWebpackPlugin({
      template: `${pugPages}/${page}`,
      filename: `${baseName}.html`,
      chunk: [baseName],
    }),
  );
});

const conf = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  /* Чанки назвать так же как и входной файл .pug,
   * в противном случае css и js не подтянутся автоматом */
  entry: {
    index: [
      `${js}/pages/index.js`,
      `${scss}/pages/index.scss`,
    ],
  },
  output: {
    path: build,
    filename: 'js/[name].js',
    publicPath: '/',
    clean: true,
    crossOriginLoading: 'anonymous',
  },
  resolve: {
    alias: {
      '@images': images,
      'vue$': 'vue/dist/vue.esm.js',
      Components: path.resolve(__dirname, 'src/js/Components/'),
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
    },
    extensions: ['.vue', '.js', '.json'],
  },

  module: {
    rules: [
      /* Vue */
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader',
          },
        },
      },

      /* Если нужно верстать с html, закоментить кодд ниж */

      /* Pug */
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'pug-html-loader',
            options: {
              'pretty': true,
            },
          },
        ],
      },
      /* images */
      {
        test: /\.(png|jpe?g|webp|gif?)$/i,
        use: imagesLoadersOptions,
      },
      /* fonts */
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // меняет слешы на линуксовские
              name(url) {
                const newName = url.replace(`${fonts}\\`, '');
                const regex = new RegExp(/\\/g);

                return newName.replace(regex, '/');
              },
              publicPath: '../fonts',
              outputPath: 'fonts',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    ...templates,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: images,
          to: 'images',
        },
      ],
    }),
    new VueLoaderPlugin(),
  ],
};

module.exports = conf;
