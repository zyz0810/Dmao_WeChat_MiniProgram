// pages/login/login.js
var app = getApp()
var Member = require("../../service/member.js")
var getPwd = require('../../utils/getPassword.js')
var login = require("../../service/login.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opacity: '0.5'
  },
  //是否显示密码
  showPwd() {
    this.setData({
      showPwd: !this.data.showPwd
    })
  },
  //输入第一次密码
  password(e) {
    this.setData({
      password: e.detail.value
    })
    if (this.data.password && this.data.passwordCon) {
      this.setData({
        opacity: '1'
      })
    } else {
      this.setData({
        opacity: '0.5'
      })
    }
  },
  //输入第一次密码聚焦
  focuspwd() {
    this.setData({
      focusName: true
    })
  },
  //输入第一次密码失焦
  blurpwd() {
    this.setData({
      focusName: false
    })
  },
  //输入确认密码
  passwordCon(e) {
    this.setData({
      passwordCon: e.detail.value
    })
    if (this.data.password && this.data.passwordCon) {
      this.setData({
        opacity: '1'
      })
    } else {
      this.setData({
        opacity: '0.5'
      })
    }
  },
  //输入确认密码聚焦
  focusPwdcon() {
    this.setData({
      focusPwd: true
    })
  },
  //输入确认密码失焦
  blurPwdcon() {
    this.setData({
      focusPwd: false
    })
  },
  //确认提交修改密码
  loginSub() {
    var that = this
    if (!this.data.password && !this.data.passwordCon) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
    } else if (this.data.password.length < 6) {
      wx.showToast({
        title: '密码不得少于6位',
        icon: 'none'
      })
    } else if (this.data.password != this.data.passwordCon) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
    } else {
      getPwd(this.data.passwordCon, function(pwd) {
        new login(res => {
          wx.showToast({
            title: '重置成功',
            icon: 'success'
          })
          wx.setStorageSync('pwd', '')
          wx.setStorageSync('loginType', false)
          setTimeout(function() {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }, 1500)
        }).reset({
          mobile: that.data.mobile,
          securityCode: that.data.securityCode,
          newpassword: pwd
        })
      })
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
      mobile: options.mobile,
      securityCode: options.securityCode
    })
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