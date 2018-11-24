const path = require('path');
const glob = require('glob-all');
const merge = require('webpack-merge');
const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssNormalize = require('postcss-normalize');
const postcssAutoreset = require('postcss-autoreset');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const sharedConfig = {
  entry: './src/app.js',
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                postcssNormalize({
                  forceImport: true,
                }),
                postcssAutoreset({
                  reset: {
                    margin: 0,
                    padding: 0,
                    outline: 'none',
                    boxSizing: 'border-box',
                  },
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
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'font',
        },
      },
    ],
  },
};

const productionConfig = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles.css',
    }),
    new PurgecssPlugin({
      paths: glob.sync(['./index.hbs', './src/*/**'], { nodir: true }),
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      cssProcessorOptions: {
        map: {
          inline: false,
        },
      },
    }),
    new HtmlPlugin({
      title: 'Drugofiltr',
      template: './index.hbs',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeAttributeQuotes: true,
        removeTagWhitespace: true,
      },
    }),
    new CleanWebpackPlugin(['dist']),
  ],
};

const developmentConfig = {
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ['style-loader'],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      title: 'app',
      template: './index.hbs',
    }),
  ],
};

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  return isProduction
    ? merge(productionConfig, sharedConfig)
    : merge(developmentConfig, sharedConfig);
};
