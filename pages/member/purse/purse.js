let app = getApp();
let member = require('../../../service/member.js')
let login = require('../../../service/login.js')
let balance = require('../../..//service/balance.js')
let util = require('../../../utils/util.js')
let config = require('../../../utils/config.js')


Page({
  data: {
    balance: 0.00,
    freezeBalance: 0.00
  },
  onLoad: function(options) {

  },
  onShow: function() {
    var that = this;
    new balance(function(data) {
      that.setData({
        balance: data.data.balance,
        freezeBalance: data.data.freezeBalance,
        withdrawBalance: data.data.withdrawBalance
      })
    }).balance({
      tenantId: wx.getStorageSync('tenantIdNow')
    })
  },
  //分享
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮

    }
    return {
      title: '挑货新零售',
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
  },
  //充值
  charge: function() {
    util.navigateTo({
      url: '/pages/member/purse/charge/charge',
    })
  },

  //提现
  cash: function() {
    new member(res => {
      if (res.data.authStatus == 'success') {
        util.navigateTo({
          url: 'cash/cash',
        })
      } else if (res.data.authStatus == 'wait') {
        wx.showToast({
          title: '实名认证中，时间若过长请致电0551-67698098',
          icon: 'none'
        })
      } else if (res.data.authStatus == 'none' || res.data.authStatus == 'fail') {
        wx.showToast({
          title: '实名认证后才可提现',
          icon: 'none'
        })
        setTimeout(function() {
          wx.navigateTo({
            url: '../auth/auth',
          })
        }, 2000)
      }
    }).view()
  },
  //银行卡
  toBankList: function() {
    util.navigateTo({
      url: '/pages/member/purse/bankList/bankList',
    })
  },
  //账单
  toBill: function() {
    util.navigateTo({
      url: '/pages/member/purse/bill/bill',
    })
  },
  quitLogin: function(e) {
    var that = this;
    wx.showToast({
      title: '正在退出',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    new login(function(res) {
      wx.hideToast()
      wx.setStorageSync('loginType', false);
      wx.setStorageSync('JSESSIONID', '');
      wx.setStorageSync('quitType', true);
      wx.setStorageSync('tenantIdNow', '')
      const SDKVersionios = wx.getSystemInfoSync().SDKVersion || '1.0.0'
      const [MAJORios, MINORios, PATCHios] = SDKVersionios.split('.').map(Number)
      wx.getSystemInfo({
        success: function(res) {
          if (res.system.indexOf('iOS') > -1 && MAJORios >= 1 && MINORios >= 1) {
            wx.reLaunch({
              url: '../../login/login'
            })
          } else {
            wx.redirectTo({
              url: '../../login/login'
            })
          }
        }
      })
    }).quitLogin()
  },

  changeTenant() {
    wx.navigateTo({
      url: '/pages/tenant/change',
    })
  },
  toPayPassword() {
    wx.navigateTo({
      url: '/pages/include/captcha/captcha?type=password&title=修改支付密码',
    })
  },
  toLoginPassword() {
    wx.navigateTo({
      url: '/pages/include/captcha/captcha?type=loginPassword&title=修改登录密码',
    })
  }

});