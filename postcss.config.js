const presetEnv = require('postcss-preset-env')
const autoSize = require('postcss-autosize')
const autoprefixer = require('autoprefixer')
module.exports = {
  plugins: [
    presetEnv({
      stage: 0
    }),
    autoSize(),
    autoprefixer()
  ]
}
