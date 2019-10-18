import { loadScript } from 'utils/utils.js'

// 移动端console
if (process.env.NODE_ENV === 'development' || /debug/ig.test(location.hash)) {
  loadScript('//cdn.jsdelivr.net/npm/eruda', () => {
    window.eruda.init()
  })
}

if (process.env.NODE_ENV === 'production') {
  // 统计
  loadScript('//static.ws.126.net/163/frontend/libs/antanalysis.min.js')
  loadScript('//static.ws.126.net/163/frontend/antnest/' + process.env.ANT_PROJECT_ID + '.js')
}
