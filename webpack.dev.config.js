const pkg = require('./package.json')
const baseWebpackConfig = require('./webpack.base.config.js')

const path = require('path')
const resolve = path.resolve

const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const dev = process.env.NODE_ENV !== 'production'
const channels = require('./config/channels.js')

const articleData = {"resultcode":200,"msg":null,"data":{"pageSize":1,"del":0,"source":"网易跟贴","body":"<p>滴滴滴！跟贴局要发车啦！</p><p class=\"f_center\"><img alt=\"发车啦！跟贴老司机速来定制车贴！\" src=\"http://cms-bucket.ws.126.net/2019/09/02/1f5b2156b9c04ba8a75f6e6e67fd6bde.jpeg?imageView&amp;thumbnail=550x0\" /><br  /></p><p>速来跟贴区参与活动吧~~~~</p><p><!--#include virtual=\"/special/0030ad/newpostad2.html\"-->","userid":"shihuan","media_url":"#","source_url":"#","topicid":"00307VL1","stitle":null,"boardid":"tie_bbs","replaceKeywordCount":5,"mtitle":null,"processPageData":"true","source_pic":"0030","duty_editor":"施欢_NY3461","modelid":"0030post1301_ad","author":"","info3g":null,"adstr":"<!--#include virtual=\"/special/0030ad/newpostad2.html\"-->","iscomment":"y","quality":80,"otitle":"","status":0,"hismod":false,"originalflag":0,"postid":"EO2G7Q2S00307VL1","title":"发车啦！跟贴老司机速来定制你的专属车贴！","pcommentid":"EO2G7Q2S00307VL1","newsid":null,"nickname":"施欢","digest":"","navtopicid":null,"statement":"","commentid":"EO2G7Q2S00307VL1","exe_editor":"王晓易_NE0011","hasad":true,"ptime":1567390283000,"setAdstr":false,"userinfo":null,"view_name":"网易跟贴","createtime":1567390555000,"statementtype":0,"docid":"EO2G7Q2S00307VL1","dkeys":"车贴,跟贴,老司机","hideAd":false,"url":"http://tie.163.com/gt/19/0902/10/EO2G7Q2S00307VL1.html","realname":null,"relatekey":"","buloid":"","sdigest":null,"photosetCovers":"","cnavbar":null}}

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'static/js/[name].js'
  },
  devtool: 'inline-source-map',
  devServer: {
    disableHostCheck: true,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    },
    proxy: {
      // 代理
      // '/api': {
      //   target: 'https://test.3g.163.com/ug'
      // }
    }
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
        },{
          loader: 'ne-node-parse-loader',
          options: {
            data: articleData.data,
            channels: channels
          }
        },{
          loader: 'ne-ssi-loader',
          options: {
            remote: {
              locations: 'https://news.163.com',
              charset: 'GBK'
            }
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
    new MiniCssExtractPlugin({
      filename: './static/css/[name].css'
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify('/'),
      'process.env.ANT_PROJECT_ID': JSON.stringify(pkg.projectId)
    })
  ]
})