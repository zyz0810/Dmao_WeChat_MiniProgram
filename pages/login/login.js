// pages/login/login.js
let app = getApp()
let getPwd = require('../../utils/getPassword.js')
let login = require('../../service/login.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opacity: '0.5',
    userName: '',
    passWord: ''
  },
  //注册
  register() {
    wx.navigateTo({
      url: '../register/register',
    })
  },
  //输入账号
  userName(e) {
    this.setData({
      userName: e.detail.value
    })
    if (this.data.userName && this.data.passWord) {
      this.setData({
        opacity: '1'
      })
    } else {
      this.setData({
        opacity: '0.5'
      })
    }
  },
  //输入账号聚焦
  focusName() {
    this.setData({
      focusName: true
    })
  },
  //输入账号失焦
  blurName() {
    this.setData({
      focusName: false
    })
  },
  //输入密码
  passWord(e) {
    this.setData({
      passWord: e.detail.value
    })
    if (this.data.userName && this.data.passWord) {
      this.setData({
        opacity: '1'
      })
    } else {
      this.setData({
        opacity: '0.5'
      })
    }
  },
  //输入密码聚焦
  focusPwd() {
    this.setData({
      focusPwd: true
    })
  },
  //输入密码失焦
  blurPwd() {
    this.setData({
      focusPwd: false
    })
  },
  //登录提交
  loginSub() {
    var that = this
    if (!(/^1\d{10}$/.test(this.data.userName))) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
    } else if (!this.data.passWord) {
      wx.showToast({
        title: '请输入登录密码',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '登录中'
      })
      if (wx.getStorageSync('quitType')) {
        wx.login({
          success: function(res) {
            if (res.code) {
              new login(function(loginres) { //初始化登录
                wx.setStorageSync('JSESSIONID', loginres.data.sessionId)
                wx.setStorageSync('loginType', loginres.data.login)
                getPwd(that.data.passWord, function(pwd) {
                  new login(res => {
                    wx.setStorageSync('quitType', false);
                    wx.setStorageSync('phone', that.data.userName)
                    wx.setStorageSync('pwd', that.data.passWord)
                    wx.setStorageSync('submit', true)
                    wx.hideLoading()
                    wx.navigateTo({
                      url: '/pages/tenant/change',
                    })
                  }).submit({
                    username: that.data.userName,
                    enPassword: pwd
                  })
                })

              }).logininit({
                js_code: res.code
              })
            }
          },
          fail: function(res) {

          },
          complete: function(res) {}
        })
      } else {
        getPwd(that.data.passWord, function(pwd) {
          new login(res => {
            wx.setStorageSync('quitType', false);
            // success
            wx.setStorageSync('phone', that.data.userName)
            wx.setStorageSync('pwd', that.data.passWord)
            wx.setStorageSync('submit', true)
            wx.hideLoading()
            wx.navigateTo({
              url: '/pages/tenant/change',
            })
          }).submit({
            username: that.data.userName,
            enPassword: pwd
          })
        })
      }
    }
  },
  //忘记密码
  forgetPwd() {
    wx.navigateTo({
      url: 'password',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function(options) {
    this.setData({
      userName: wx.getStorageSync('phone'),
      passWord: wx.getStorageSync('pwd'),
    })
    if (this.data.userName && this.data.passWord) {
      this.setData({
        opacity: '1'
      })
    }
    if (wx.getStorageSync('JSESSIONID') && wx.getStorageSync('loginType') && wx.getStorageSync('tenantIdNow')) { //当自动登录时跳转到member页
      wx.setStorageSync('submit', false)
      wx.setStorageSync('quitType', false)
      wx.showToast({
        title: '登录中',
        icon: 'loading',
        duration: 2000,
        mask: true,
        success: function() {
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/home/home',
            })
          }, 500)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //分享
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮

    }
    return {
      title: '店茂小助手',
      path: 'pages/login/login',
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success'
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }


})

function submit(that) {
  var exponent, modulus;
  var phone = that.data.userName;
  var pwd = that.data.passWord;
  var sessionId = wx.getStorageSync('sessionId');
  new server().getPwd(phone, pwd, function(res) {
    wx.setStorageSync('quitType', false);
    // success
    wx.setStorageSync('phone', phone)
    wx.setStorageSync('pwd', pwd)
    wx.setStorageSync('submit', true)
    wx.redirectTo({
      url: '../member/member'
    })
  })
}