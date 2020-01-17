var app = getApp();
var util = require("../../../utils/util.js");
var member = require('../../../service/member.js');
var login = require('../../../service/login.js');
var getPwd = require('../../../utils/getPassword.js');
var password = require('../../../service/common.js');

Page({
  data: {
    len: 0,
    pay: false,
    focus: false,
    captch: '',
    newPwd: '',
    newPwdCon: ''
  },
  onLoad: function(options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.mainColor
    })
    this.setData({
      mainColor: app.globalData.mainColor
    })
    var that = this;
    that.setData({
      captcha: options.captcha,
      codeType: options.codeType
    })
  },
  onShow: function() {

  },

  newPwd: function(e) {
    this.setData({
      newPwd: e.detail.value.trim()
    })
  },
  newPwdCon: function(e) {
    this.setData({
      newPwdCon: e.detail.value.trim()
    })
  },

  //提交修改密码
  submit: function() {
    var that = this;
    var captch = that.data.captch;
    var pwd = that.data.newPwd;
    var pwdCon = that.data.newPwdCon;
    if (pwd == '' || pwdCon == '') {
      util.errShow("请输入密码");
      return false;
    } else if (pwd.length < 6) {
      util.errShow("密码不得小于6位");
      return false;
    } else if (pwd != pwdCon) {
      util.errShow("密码不一致");
      return false;
    } else if (that.data.codeType == 'password' && isNaN(pwd)) {
      wx.showToast({
        title: '支付密码需为6位纯数字',
        icon: 'none'
      })
      return false;
    } else {
      getPwd(pwd, function(pwd) {
        if (that.data.codeType == 'password') {
          new member(function(res) {
            wx.showToast({
              title: res.message.content,
              icon: 'success',
              duration: 1000,
              mask: true,
            });
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1200)
          }).resetPay({
            captcha: that.data.captcha,
            newPass: pwd
          })
        } else if (that.data.codeType == 'loginPassword') {
          new login(function(res) {
            wx.showToast({
              title: res.message.content,
              icon: 'success',
              duration: 1000,
              mask: true,
            });
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1200)
          }).reset({
            mobile: wx.getStorageSync('phone'),
            newpassword: pwd,
            securityCode: that.data.captcha
          })
        }


      })
    }
  }
});