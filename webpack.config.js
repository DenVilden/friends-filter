const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const rules = require('./webpack.config.rules');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  return {
    entry: './src/app.js',
    output: {
      filename: 'js/bundle.js',
      path: path.resolve('dist'),
    },
    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
    module: {
      rules: [
        ...rules,
        {
          test: /\.(css|scss)$/,
          use: isProduction
            ? [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../',
                },
              },
              { loader: 'css-loader' },
              {
                loader: 'postcss-loader',
                options: { plugins: [autoprefixer()] },
              },
              { loader: 'sass-loader' },
            ]
            : ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: isProduction
      ? [
        new MiniCssExtractPlugin({
          filename: 'css/styles.css',
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
          template: 'template.hbs',
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
      ]
      : [
        new HtmlPlugin({
          title: 'app',
          template: 'template.hbs',
        }),
      ],
  };
};
