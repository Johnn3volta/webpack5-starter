const path = require('path');

const paths = {
  src: path.resolve(__dirname, '../src'),
  fonts: path.resolve(__dirname, '../src/fonts/'),
  images: path.resolve(__dirname, '../src/images'),
  scss: path.resolve(__dirname, '../src/styles/scss'),
  js: path.resolve(__dirname, '../src/js'),
  public: path.resolve(__dirname, '../public'),
  build: path.resolve(__dirname, '../build'),
  pugPages: path.resolve(__dirname, '../src/pug/pages'),
};

module.exports = paths;
