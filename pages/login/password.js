// pages/login/login.js
var app = getApp()
var Member = require("../../service/member.js")
var login = require("../../service/login.js")
var util = require("../../utils/util")
var countdown = util.countdown //验证码计时
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opacity: '0.5',
    tips: '获取验证码',
    count: 60,
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
  //输入验证码
  captcha(e) {
    this.setData({
      captcha: e.detail.value
    })
    if (this.data.userName && this.data.captcha) {
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
  focusCaptcha() {
    this.setData({
      focusPwd: true
    })
  },
  //输入密码失焦
  blurCaptcha() {
    this.setData({
      focusPwd: false
    })
  },
  //发送验证码
  sendCap() {
    if (!(/^1\d{10}$/.test(this.data.userName))) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
    } else {
      new login(res => {
        countdown(this);
      }).getCheckCode({
        mobile: this.data.userName
      })
    }
  },
  //登录提交
  loginSub() {
    if (!(/^1\d{10}$/.test(this.data.userName))) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
    } else if (!this.data.captcha) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else {
      new login(res => {
        wx.redirectTo({
          url: 'pwdChange?mobile=' + this.data.userName + '&securityCode=' + this.data.captcha,
        })
      }).check_mobile({
        mobile: this.data.userName,
        securityCode: this.data.captcha
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  }


})