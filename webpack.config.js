const path = require('path');
const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssNormalize = require('postcss-normalize');
const postcssAutoreset = require('postcss-autoreset');
const postcssUncss = require('postcss-uncss');

const sharedConfig = {
  entry: ['./src/index.js'],
  output: {
    filename: 'js/main.js',
    path: path.resolve('dist'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                postcssAutoreset({
                  reset: {
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box',
                  },
                }),
                postcssNormalize({
                  forceImport: true,
                }),
                postcssUncss({
                  html: ['./src/index.hbs', './src/templates/*.hbs'],
                }),
                autoprefixer(),
              ],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime'],
        },
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'font',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Другофильтр',
      template: './src/index.hbs',
    }),
  ],
};

const productionConfig = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          filename: 'js/vendor.js',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: 'js/main.js.map',
      exclude: ['js/vendor.js'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/styles.css',
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    }),
    new CleanWebpackPlugin(['dist']),
  ],
};

const developmentConfig = {
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ['style-loader'],
      },
    ],
  },
  devtool: 'cheap-module-eval-source-map',
};

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  return isProduction
    ? WebpackMerge(productionConfig, sharedConfig)
    : WebpackMerge(developmentConfig, sharedConfig);
};
