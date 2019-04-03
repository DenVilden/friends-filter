const path = require('path');
const Webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Autoprefixer = require('autoprefixer');
const PostcssNormalize = require('postcss-normalize');
const PostcssAutoreset = require('postcss-autoreset');
const PostcssUncss = require('postcss-uncss');
const CleanCss = require('clean-css');

const sharedConfig = {
  entry: ['./src/index.js'],
  output: {
    filename: 'js/main.js',
    path: path.resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                PostcssAutoreset({
                  reset: {
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box'
                  }
                }),
                PostcssNormalize({
                  forceImport: true
                })
              ]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'font'
        }
      }
    ]
  }
};

const productionConfig = {
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                PostcssUncss({
                  html: ['./src/**/*.hbs']
                }),
                Autoprefixer()
              ]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          filename: 'js/vendor.js',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new Webpack.SourceMapDevToolPlugin({
      filename: 'js/main.js.map',
      exclude: ['js/vendor.js']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/styles.css'
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: CleanCss,
      cssProcessorOptions: {
        level: {
          1: { specialComments: 'none' },
          2: { all: true }
        }
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Другофильтр',
      template: './src/index.hbs',
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeTagWhitespace: true
      }
    }),
    new CleanWebpackPlugin(['dist'])
  ]
};

const developmentConfig = {
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'index',
      template: './src/index.hbs'
    })
  ]
};

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  return isProduction
    ? WebpackMerge(productionConfig, sharedConfig)
    : WebpackMerge(developmentConfig, sharedConfig);
};
