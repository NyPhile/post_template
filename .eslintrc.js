module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  rules: {
    "linebreak-style": [0 , 'error', 'windows'],
    indent: [1, 2, {SwitchCase: 1}]
  }
}