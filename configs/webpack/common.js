const paths = require('../paths');
const fs = require('fs');

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { js, build, scss, images, fonts, pugPages } = paths;
const imageLoader = {
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
};

const imageResize = {
  loader: 'webpack-image-resize-loader',
  options: {
    width: 1920,
  },
};

const imagesLoadersOptions = [
  imageLoader,
  imageResize,
];

/* Если верстка ведется в обычном html,
 * код ниже либо переделать под html,
 * либо закоментить */

const pagesOfPug = fs.readdirSync(pugPages);
const templates = [];
const entryChunks = {};
pagesOfPug.forEach(page => {
  const baseName = page.replace('.pug', '');
  templates.push(
    new HtmlWebpackPlugin({
      template: `${pugPages}/${page}`,
      filename: `${baseName}.html`,
      chunk: [
        'general',
        baseName,
      ],
    }),
  );

  entryChunks[baseName] = [
    `${js}/pages/${baseName}.js`,
    `${scss}/pages/${baseName}.scss`,
  ];
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
    general: [
      `${js}/general.js`,
      `${scss}/common/general.scss`,
    ],
    ...entryChunks,
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
            options: {
              sources: false,
            },
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
        test: /\.(jpe?g|png|gif)$/,
        use: imagesLoadersOptions,
      },
      /* svg */
      {
        test: /\.(svg)$/,
        use: imageLoader,
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
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
    }),
    new VueLoaderPlugin(),
  ],
};

module.exports = conf;
