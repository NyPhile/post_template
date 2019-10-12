const path = require('path')
const resolve = path.resolve

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const dev = process.env.NODE_ENV !== 'production'

module.exports = {
  context: resolve(__dirname, './'),
  entry: [
    path.join(__dirname, './src/js/index.js')
  ],
  externals: [
    /\$/,
    /NE/,
    /NTES/
  ],
  resolve: {
    extensions: ['.js', '.json'],
    // 配置项目文件别名
    alias: {
      '@': resolve('src'),
      'utils': resolve('src/js/utils'),
      'js-bridge': '@mf2e/js-bridge',
      'newsapp-share': '@newsapp-activity/newsapp-share'
    }
  }
}