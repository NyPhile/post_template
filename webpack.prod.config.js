const pkg = require('./package.json')
const baseWebpackConfig = require('./webpack.base.config.js')

const path = require('path')
const resolve = path.resolve

const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

let publicPath = `https://static.ws.126.net/163/f2e/${pkg.channel}/${pkg.name}/`
const dev = process.env.NODE_ENV !== 'production'

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[contenthash:8].js',
    publicPath
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
        dev ? 'style-loader' : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../../'
          }
        },
        'css-loader',
        'postcss-loader',
        'less-loader',
        ]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules|\.min\.js|bower_components/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: false,
            attrs: [':src']
          }
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'static/images/[name].[hash:7].[ext]',
            limit: 1024,
            fallback: 'file-loader'
          }
        }]
      },
      {
        test: /\.(mp3|mp4)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name:'static/[name].[ext]',
          limit:10
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: './static/fonts/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(), //打包分析工具，按需打开
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css"
    }),
    new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
        'process.env.BASE_URL': JSON.stringify(publicPath),
        'process.env.ANT_PROJECT_ID': JSON.stringify(pkg.projectId),
        'process.env.PROJECT_NAME': JSON.stringify(pkg.name)
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static'),
        to: path.resolve(__dirname, 'dist/static'),
        ignore: ['.*']
      }
    ]),
  ],
  optimization: {
    minimizer:[
      new UglifyJsPlugin({
        exclude: /\.min\.js$/,
        cache: true,
        parallel: true,
        sourceMap: false,
        extractComments: false,
        uglifyOptions: {
          compress: {
            unused: true,
            drop_debugger: true
          },
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true },
          mergeLonghand: false,
          discardComments: {
            removeAll: true
          }
        },
        canPrint: true
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          priority: 10,
          chunks: 'initial',
          name: 'vendors'
        },
        common: {
          name: 'common'
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  }
})