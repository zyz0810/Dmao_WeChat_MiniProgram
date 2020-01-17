// pages/home/home.js

let swiperAutoHeight = require("../../../template/swiper/swiper.js"),
  login = require("../../../service/login.js"),
  Tenant = require("../../../service/tenant.js"),
  member = require("../../../service/member.js"),
  Ad = require("../../../service/ad.js"),
  WxParse = require('../../wxParse/wxParse.js'),
  app = getApp(),
  util = require("../../../utils/util.js"),
  kuaixun = require("../../../service/kuaixun.js")
var page = undefined;
Page(Object.assign({}, swiperAutoHeight, {

  /**
   * 页面的初始数据
   */
  data: {
    scrollTo: '', //页面跳转到
    sys: app.globalData.sys,
    percent: 10,
    currentTab: 0,
    homeLoadReady: false,
    showClerkRank: true,
    showActivityRule: false
  },

  selectTab(e) {
    if (e.currentTarget.dataset.tab == this.data.currentTab) {
      return
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.tab
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    page = this;
    this.setData({
      rankId: options.id
    })
  },
  //获取数据
  getData() {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('tenantNameNow'),
    })
    let that = this,
      promiseList = []
    //广告位(顶部)
    promiseList.push(new Promise((resolve, reject) => {
      new Ad(res => {
        resolve(res)
      }).do(264)
    }))

    Promise.all(promiseList).then(res => {
      this.setData({
        topImgs: {
          data: res[0].data.length === 0 ? [{
            image: '/resources/images/noneimg.png'
          }] : res[0].data,
          key: 'image'
        }
      })
      setTimeout(() => {
        this.setData({
          homeLoadReady: true
        })
      }, 500)
    }, err => {
      this.setData({
        homeLoadReady: true
      })
    })

    new member(res => {
      wx.stopPullDownRefresh()
      if (!res.data) {
        this.setData({
          memberRoleShopper: false,
          currentTab: 1
        })
      } else if (this.data.currentTab == 0) {
        this.setData({
          memberRoleShopper: true,
          currentTab: 0
        })
      }
      this.setData({
        activityName: res.data.activityName,
        totalAmount: res.data.totalAmount.toFixed(2).toString().replace(/\s/g, '').replace(/(.{1})/g, "$1 "),
        activityName: res.data.activityName,
        // rankshoperSelf: res.data.ranking,
        showRank: true,
        startDate: util.formatTimeTwo(res.data.startDate, 'Y/M/D h:m:s'),
        endDate: util.formatTimeTwo(res.data.endDate, 'Y/M/D h:m:s')
      })
      if (res.data.ranking) {
        if (res.data.ranking.username.length > 10) {
          res.data.ranking.username = res.data.ranking.username.substr(0, 3) + '···' + res.data.ranking.username.substr(res.data.ranking.username.length - 3, 3)
        }
      }
      this.setData({
        rankshoperSelf: res.data.ranking
      })
      if (res.data.rankingList) {
        for (var i = 0; i < res.data.rankingList.length; i++) {
          if (res.data.rankingList[i].username.length > 10) {
            res.data.rankingList[i].username = res.data.rankingList[i].username.substr(0, 3) + '···' + res.data.rankingList[i].username.substr(res.data.rankingList[i].username.length - 3, 3)
          }
        }
      }

      if (res.data.runInfos) {
        for (var i = 0; i < res.data.runInfos.length; i++) {
          if (res.data.runInfos[i].username.length > 10) {
            res.data.runInfos[i].username = res.data.runInfos[i].username.substr(0, 3) + '···' + res.data.runInfos[i].username.substr(res.data.runInfos[i].username.length - 3, 3)
          }
        }
      }
      this.setData({
        shopkeeperList: res.data.rankingList,
        runInfos: res.data.runInfos
      })
      if (res.data.memo) {
        var article = res.data.memo.replace(/embed(?=\s+)/gi, 'video');
        WxParse.wxParse('article', 'html', article, that, 5);
      }

      function time1() {
        var beginDate = res.data.startDate
        var endDate = res.data.endDate
        // 活动是否已经开始
        var totalSecond = beginDate / 1000 - Date.parse(new Date()) / 1000;
        // 活动是否已经结束
        var endSecond = endDate / 1000 - Date.parse(new Date()) / 1000;
        //活动剩余时间
        var goTime = (endDate - Date.parse(new Date())) / 1000
        var allSecond = (endDate - beginDate) / 1000
        var percent = ((goTime / allSecond) * 100)
        that.setData({
          percent: percent
        })
        // 秒数
        var second = endSecond;
        // 天数位
        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        if (dayStr.length == 1) dayStr = '0' + dayStr;

        // 小时位
        var hr = Math.floor(second / 3600);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;

        // 分钟位
        var min = Math.floor((second - hr * 3600) / 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;

        // 秒位
        var sec = second - hr * 3600 - min * 60;
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;

        totalSecond--;
        var timeStap = []
        if (goTime < 0) {
          clearInterval(time1);
          that.setData({
            'timeStap.countDownDay': '00',
            'timeStap.countDownHour': '00',
            'timeStap.countDownMinute': '00',
            'timeStap.countDownSecond': '00',
            finish: true
          });
        } else {
          that.setData({
            'timeStap.countDownDay': dayStr,
            'timeStap.countDownHour': hrStr,
            'timeStap.countDownMinute': minStr,
            'timeStap.countDownSecond': secStr,
            finish: false
          });
        }
      }
      time1();
      var timer = setInterval(time1, 1000);
    }, function(err) {
      that.setData({
        currentTab: 1
      })
    }).preSalesIncentiveDetails({
      joinRole: 'shopkeeper',
      memberId: wx.getStorageSync('memberIdNow'),
      id: that.data.rankId,
      pageSize: 1000,
      tenantId: wx.getStorageSync('tenantIdNow')
    })


    new member(res => {
      this.setData({
        activityName2: res.data.activityName,
        // clerkList: res.data.rankingList,
        tenantName: res.data.tenantName,
        totalAmount2: res.data.totalAmount.toString().replace(/\s/g, '').replace(/(.{1})/g, "$1 "),
        activityName2: res.data.activityName,
        // rankclerkSelf: res.data.ranking
        showRank: true,
        startDate1: util.formatTimeTwo(res.data.startDate, 'Y/M/D h:m:s'),
        endDate1: util.formatTimeTwo(res.data.endDate, 'Y/M/D h:m:s')
      })

      if (res.data.ranking) {
        if (res.data.ranking.username.length > 10) {
          res.data.ranking.username = res.data.ranking.username.substr(0, 3) + '···' + res.data.ranking.username.substr(res.data.ranking.username.length - 3, 3)
        }
      }
      if (res.data.rankingList) {
        for (var i = 0; i < res.data.rankingList.length; i++) {
          if (res.data.rankingList[i].username.length > 10) {
            res.data.rankingList[i].username = res.data.rankingList[i].username.substr(0, 3) + '···' + res.data.rankingList[i].username.substr(res.data.rankingList[i].username.length - 3, 3)
          }
        }
      }

      if (res.data.runInfos) {
        for (var i = 0; i < res.data.runInfos.length; i++) {
          if (res.data.runInfos[i].username.length > 10) {
            res.data.runInfos[i].username = res.data.runInfos[i].username.substr(0, 3) + '···' + res.data.runInfos[i].username.substr(res.data.runInfos[i].username.length - 3, 3)
          }
        }
      }
      this.setData({
        clerkList: res.data.rankingList,
        rankclerkSelf: res.data.ranking,
        runInfos: res.data.runInfos
      })

      if (res.data.memo) {
        var article2 = res.data.memo.replace(/embed(?=\s+)/gi, 'video');
        WxParse.wxParse('article2', 'html', article2, that, 5);
      }

      function time2() {
        var beginDate = res.data.startDate
        var endDate = res.data.endDate
        // 活动是否已经开始
        var totalSecond = beginDate / 1000 - Date.parse(new Date()) / 1000;
        // 活动是否已经结束
        var endSecond = endDate / 1000 - Date.parse(new Date()) / 1000;
        //活动剩余时间
        var goTime = (endDate - Date.parse(new Date())) / 1000
        var allSecond = (endDate - beginDate) / 1000
        var percent = ((goTime / allSecond) * 100)
        that.setData({
          percent2: percent
        })
        // 秒数
        var second = endSecond;
        // 天数位
        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        if (dayStr.length == 1) dayStr = '0' + dayStr;

        // 小时位
        var hr = Math.floor(second / 3600);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;

        // 分钟位
        var min = Math.floor((second - hr * 3600) / 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;

        // 秒位
        var sec = second - hr * 3600 - min * 60;
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;

        totalSecond--;
        var timeStap = []
        if (goTime < 0) {
          clearInterval(time2);
          that.setData({
            'timeStap2.countDownDay': '00',
            'timeStap2.countDownHour': '00',
            'timeStap2.countDownMinute': '00',
            'timeStap2.countDownSecond': '00',
            finish2: true
          });
        } else {
          that.setData({
            'timeStap2.countDownDay': dayStr,
            'timeStap2.countDownHour': hrStr,
            'timeStap2.countDownMinute': minStr,
            'timeStap2.countDownSecond': secStr,
            finish2: false
          });
        }
      }
      time2();
      var timer = setInterval(time2, 1000);
    }, function(err) {
      console.log(err)
      if (err.message.type == 'error') {
        that.setData({
          showRank: that.data.showRank ? true : false,
          requestInfo: err.message.content,
          showClerkRank: false
        })
      }
    }).preSalesIncentiveDetails({
      joinRole: 'clerk',
      memberId: wx.getStorageSync('memberIdNow'),
      id: that.data.rankId,
      tenantId: wx.getStorageSync('tenantIdNow')
    })

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    if (app.globalData.isChangeTenantId) {
      app.globalData.isChangeTenantId = false
      this.setData({
        homeLoadReady: false
      })
    }
    if (wx.getStorageSync('submit')) {
      wx.login({
        success: function(res) {
          if (res.code) {
            new login(function(loginres) { //初始化登录
              wx.setStorageSync('JSESSIONID', loginres.data.sessionId)
              wx.setStorageSync('loginType', loginres.data.login)
              that.getData()
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
      this.getData()
    }
  },

  //分享
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '挑货新零售',
      path: '/pages/login/login',
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getData()
  },
  goRule() {
    wx.navigateTo({
      url: '/pages/news/view/view',
    })
  },
  clickShowRule() {
    this.setData({
      showActivityRule: true
    })
  },
  closeRule() {
    this.setData({
      showActivityRule: false
    })
  },
  showRankList() {
    wx.navigateTo({
      url: 'rank/list',
    })
  }

}))