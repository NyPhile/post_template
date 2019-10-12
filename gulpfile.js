const pkg = require('./package.json')
const fs = require('fs')
const del = require('del')
const path = require('path')
const easeftp = require('easeftp/upload')
const ftppass = JSON.parse(fs.readFileSync('.ftppass', 'utf-8'))

const cacheDir = path.resolve('node_modules/.cache/easeftp/')

function findFiles (rootPath, replacePath = '') {
  let result = []

  function finder (tempPath) {
    let files = fs.readdirSync(tempPath)
    files.forEach((val) => {
      let fPath = path.posix.join(tempPath, val)
      let stats = fs.statSync(fPath)

      if (stats.isDirectory()) {
        finder(fPath)
      } else if (stats.isFile()) {
        result.push(fPath.replace(rootPath, replacePath))
      }
    })
  }

  finder(rootPath)
  return result
}

function getPublickPath (staticUrls, isHTML = false) {
  let urls = staticUrls.slice(0)
  if (isHTML) {
    urls = urls.map(item => item.replace('https://static.ws.126.net/', 'https://wp.m.163.com/'))
  }
  return urls
}

function uploadStatic () {
  let allFiles = findFiles(`dist/static/`, 'static/')

  let cacheFiles = []
  let cachePath = `${cacheDir}/cache-files.json`
  if (fs.existsSync(cachePath)) {
    cacheFiles = JSON.parse(fs.readFileSync(cachePath, 'utf-8'))
  }

  let newFiles = allFiles.filter(item => cacheFiles.indexOf(item) === -1)

  return easeftp.addFile(newFiles, {
    debug: true,
    ...ftppass,
    path: `f2e/${pkg.channel}/${pkg.name}`,
    cwd: path.resolve('dist')
  }).then(res => {
    console.log(getPublickPath(res.urls))
    if (!fs.existsSync(cacheDir)) {
      cacheDir.split('/').reduce((current, next) => {
        const full = path.resolve(current, next)
        if (!fs.existsSync(full)) {
          fs.mkdirSync(full)
        }
        return full
      }, '/')
    }
    fs.writeFileSync(cachePath, JSON.stringify(allFiles))
  })
}

function uploadHtml (dir) {
  return easeftp.addFile(['index.html', 'service-worker.js'], {
    debug: true,
    ...ftppass,
    path: `${dir}/${pkg.channel}/${pkg.name}`,
    cwd: path.resolve('dist')
  }).then(res => {
    console.log(getPublickPath(res.urls, true))
  })
}

exports['test'] = async function () {
  await uploadStatic()
  // await uploadHtml('test')
}

exports['publish'] = async function () {
  await uploadStatic()
  // await uploadHtml('page')
}

exports['clear'] = function () {
  return del([cacheDir])
}
