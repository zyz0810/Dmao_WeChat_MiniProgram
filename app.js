let aldstat = require("./utils/ald-stat.js");
let Member = require('/service/member.js')
let util = require('/utils/util.js')
let config = require('/utils/config.js')
let login = require("service/login.js")

App({
  globalData: {
    LOGIN_STATUS: false,
    sys: wx.getSystemInfoSync()
  },
  onShow(opData) {
    checkUpdate()
  },
  loginOkCallbackList: [],
  onLaunch(opData) {
    this.globalData.mainColor = '#ff9c00'
    // wx.setStorageSync('JSESSIONID', 'D3AA0D27267CEF4847CE7168A302D2D0')
    let that = this
    getSession(this)
  }
})


function getSession(that) {
  wx.login({
    success: function(res) {
      if (res.code) {
        new login(function(loginres) { //初始化登录
          wx.setStorageSync('JSESSIONID', loginres.data.sessionId)
          // wx.setStorageSync('loginType', loginres.data.login)
          // wx.setStorageSync('loginType', false)
        }).logininit({
          js_code: res.code
        })
      }
    },
    fail: function(res) {

    },
    complete: function(res) {
      // complete
    }
  })
}
// 检查更新
function checkUpdate() {
  if (!wx.canIUse('getUpdateManager')) return false;
  const updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function(res) {
    if (res.hasUpdate) {
      wx.showToast({
        title: '检查到新版本 正在准备更新',
        icon: 'none',
        duration: 200000,
        mask: true
      })
    }
  })
  updateManager.onUpdateReady(function() {
    wx.showToast({
      title: '将重启以完成更新',
      icon: 'none',
      duration: 2000,
      mask: true
    })
    setTimeout(function() {
      updateManager.applyUpdate()
    }, 500)
  })
  updateManager.onUpdateFailed(function() {
    wx.showToast({
      title: '更新失败',
      icon: 'error',
      duration: 2000
    })
  })
}