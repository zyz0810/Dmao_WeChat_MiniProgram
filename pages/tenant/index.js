// pages/tenant/index.js
let app = getApp()
let util = require('../../utils/util.js')
let tenant = require('../../service/tenant.js')
let login = require('../../service/login.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '店铺列表加载中',
    })
  },
  selectTenant(e) {
    wx.showLoading({
      title: '进入店铺中'
    })
    this.setData({
      tenantId: e.currentTarget.dataset.id
    })
    new tenant(res => {
      app.globalData.isChangeTenantId = true
      wx.setStorageSync('tenantIdNow', e.currentTarget.dataset.id)
      wx.setStorageSync('tenantNameNow', e.currentTarget.dataset.name)
      wx.setStorageSync('memberIdNow', res.data)
      wx.hideLoading()
      wx.switchTab({
        url: '/pages/home/home',
      })
    }).select({
      id: e.currentTarget.dataset.id,
      mobile: wx.getStorageSync('phone')
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
    var that = this
    this.setData({
      tenantId: wx.getStorageSync('tenantIdNow')
    })
    if (wx.getStorageSync('submit')) {
      wx.login({
        success: function(res) {
          if (res.code) {
            new login(function(loginres) { //初始化登录
              wx.setStorageSync('JSESSIONID', loginres.data.sessionId)
              wx.setStorageSync('loginType', loginres.data.login)
              new tenant(res => {
                wx.hideLoading()
                that.setData({
                  tenantList: res.data
                })
              }).tenantList()
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
    } else {
      new tenant(res => {
        wx.hideLoading()
        that.setData({
          tenantList: res.data
        })
      }).tenantList()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})