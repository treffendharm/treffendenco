const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob');

module.exports = {
  entry: {
    main: './src/scss/style.scss',
    blocks: glob.sync('./blocks/**/style.scss')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    clean: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/images',
          to: 'images',
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['**/.DS_Store', '**/Thumbs.db'],
          }
        },
        {
          from: 'src/fonts',
          to: 'fonts',
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['**/.DS_Store', '**/Thumbs.db'],
          }
        }
      ],
    }),
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
      ]
    }]
  },
  watch: process.env.NODE_ENV === 'development',
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000
  }
}; 