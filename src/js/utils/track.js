// 统计
function trackEvent (event, info) {
  if (!window['NTESAntAnalysis']) {
    window.addEventListener('NTMReady', () => {
      trackEvent(event, info)
    })
  } else {
    window['NTESAntAnalysis'].sendData({
      projectid: process.env.ANT_PROJECT_ID,
      val_nm: 'c-ntm',
      val_act: event,
      info
    })
  }
}

export {
  trackEvent
}
