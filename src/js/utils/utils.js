// 加载script
function loadScript (url, callback) {
  let script = document.createElement('script')
  script.src = url
  script.onload = function () {
    callback && callback()
    script.parentNode.removeChild(script)
  }
  let target = document.getElementsByTagName('script')[0]
  target.parentNode.insertBefore(script, target)
}

export { loadScript }