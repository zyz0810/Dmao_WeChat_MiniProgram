// pages/home/rank/list.js

let swiperAutoHeight = require("../../../template/swiper/swiper.js"),
  login = require("../../../service/login.js"),
  Tenant = require("../../../service/tenant.js"),
  member = require("../../../service/member.js"),
  app = getApp(),
  util = require("../../../utils/util.js")
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
    new member(res => {
      var rankList = res.data
      for (var i = 0; i < rankList.length; i++) {
        rankList[i].startDate = util.formatTimeTwo(rankList[i].startDate, 'Y/M/D h:m:s')
        rankList[i].endDate = util.formatTimeTwo(rankList[i].endDate, 'Y/M/D h:m:s')
      }
      this.setData({
        rankList: rankList
      })
    }).preSalesIncentiveList({
      memberId: wx.getStorageSync('memberIdNow'),
      pageSize: 100,
      tenantId: wx.getStorageSync('tenantIdNow')
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

  },


  goRankDetail(e) {
    wx.navigateTo({
      url: 'detail?id=' + e.currentTarget.dataset.id
    })
  }

})