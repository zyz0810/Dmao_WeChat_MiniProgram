//获取应用实例
var app = getApp()
var Order = require('../../../service/order')
var util = require('../../../utils/util')
var actionsheet = require('../../../template/actionsheet/actionsheet')
var payTemp = require("../../../template/password/payPassword")
var Balance = require("../../../service/balance")
var Member = require("../../../service/member")
var login = require("../../../service/login")
var Tenant = require("../../../service/tenant")
var getPwd = require("../../../utils/getPassword")
var util = require("../../../utils/util")

Page(Object.assign({}, actionsheet, payTemp, {
  data: {
    winHeight: 0, //设备高度度
    all: [], //全部
    unpaid: [], //待支付
    unreciver: [], //待签收
    accept: [], //待评价
    unshipped: [], //待发货
    currentTab: 0, //显示全部
    allTips: '下拉刷新',
    unpaidTips: '下拉刷新',
    unreciverTips: '下拉刷新',
    acceptTips: '下拉刷新',
    unshippedTips: '下拉刷新',
    // sType: ['all', 'unpaid', 'unshipped', 'unreciver', 'unreview'],
    sType: ['unshipped', 'unreciver', 'accept'],
    scroll: [0, 0, 0],
    currentOrderTab: 0,
    orderType: 'myOrder',
    allOrderNum: {},
    allOrderPay: {},
    allOrderProfit: {},
    agent: false,
    deliveryCenterId: ''
  },
  technical: function() {
    wx.navigateTo({
      url: '/pages/technical/technical',
    })
  },
  bindChange: function(e) { //滑动选项卡
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //切换我的订单店铺订单
  swichOrderTab(e) {
    var that = this
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentOrderTab: e.currentTarget.dataset.current,
        orderType: e.currentTarget.dataset.otype
      })
      // this.onLoad()
      this.dataLoadOrder()
    }
  },
  swichNav: function(e) { //点击选项卡
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  touchstart: function(e) {
    this.data.startTouches = e.changedTouches[0]
  },
  touchmove: function(e) {
    this.data.moveTouches = e.changedTouches[0]
  },
  touchend: function(e) {
    let index = this.data.currentTab,
      sTypeList = this.data.sType,
      startTouch = this.data.startTouches,
      Y = e.changedTouches[0].pageY - startTouch.pageY,
      X = Math.abs(e.changedTouches[0].pageX - startTouch.pageX)

    if (this.data.scroll[index] > 10) {
      return false
    }
    this.data.endTouches = e.changedTouches[0]
    if (Y > 50 && X < 200) {
      if (wx.startPullDownRefresh) {
        wx.startPullDownRefresh()
        paging(this, this.data.orderType, sTypeList[index], 'up', function() {
          wx.stopPullDownRefresh()
        }, this.data.begin, this.data.end, this.data.deliveryCenterId ? this.data.deliveryCenterId : '')
      } else {
        wx.showLoading({
          title: '加载中...',
        })
        paging(this, this.data.orderType, sTypeList[index], 'up', function() {
          wx.hideLoading()
        }, this.data.begin, this.data.end, this.data.deliveryCenterId ? this.data.deliveryCenterId : '')
      }
    }
  },
  onPullDownRefresh() {
    let index = this.data.currentTab,
      sTypeList = this.data.sType
    paging(this, this.data.orderType, sTypeList[index], 'up', function() {
      wx.stopPullDownRefresh()
    }, this.data.begin, this.data.end, this.data.deliveryCenterId ? this.data.deliveryCenterId : '')
  },
  scroll: function(e) {
    let index = this.data.currentTab
    this.data.scroll[index] = e.detail.scrollTop
  },
  lower: function() {
    var index = this.data.currentTab
    var sTypeList = this.data.sType
    paging(this, this.data.orderType, sTypeList[index], 'down', function() {}, this.data.begin, this.data.end)
  },

  //选择日期加载订单
  dataLoadOrder() {
    var that = this
    var id = that.data.currentTab
    wx.showLoading({
      title: '查询中',
    })
    paging(that, this.data.orderType, that.data.sType[id], 'up', function() {
      for (var i = 0; i < that.data.sType.length; i++) {
        if (i == id) {
          continue
        }
        paging(that, that.data.orderType, that.data.sType[i], 'up', function() {}, that.data.begin, that.data.end, that.data.deliveryCenterId)
      }
    }, that.data.begin, that.data.end, that.data.deliveryCenterId)
  },

  //选择服务导购
  guideChange: function(e) {
    var deliveryCenterId = this.data.deliveryCenterList[e.detail.value].id;
    var deliveryCenterList = this.data.deliveryCenterList
    this.setData({
      guideId: e.detail.value,
      deliveryCenterId: deliveryCenterId > 0 ? deliveryCenterId : '',
      storeName: deliveryCenterList[e.detail.value].name + '▼'
    })
    this.dataLoadOrder()
  },

  onLoad: function(options) { //页面加载
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        var name = 'iPhone X'
        if (res.model.indexOf(name) > -1) {
          that.setData({
            isIphoneX: true
          })
        } else {
          isIphoneX: false
        }
      }
    })
    this.setData({
      mainColor: app.globalData.mainColor
    })
    if (wx.getStorageSync('isAgent')) {
      this.setData({
        agent: true,
        storeName: '全部门店▼',
        orderType: 'agentOrder'
      })
      new Tenant(res => {
        var dataAll = {
          'id': '-1',
          name: '全部门店'
        }
        res.data.unshift(dataAll)
        that.setData({
          deliveryCenterList: res.data
        })
      }).getAllDeliveryCenterByTenant({
        tenantId: wx.getStorageSync('tenantIdNow')
      })
    } else {
      this.setData({
        storeName: '订单'
      })
    }
    var that = this
    var id = that.data.currentTab
    //获取当前的年月日
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var date = new Date().getDate();
    var systemInfo = wx.getSystemInfoSync()
    that.setData({
      nowyear: year,
      nowmonth: month,
      nowdate: date,
      begin_year: year,
      begin_month: month,
      begin_day: '1',
      end_year: year,
      end_month: month,
      end_day: date,
      year: year,
      month: month,
      date: date,
      begin: year + '-' + month + '-' + 1,
      end: year + '-' + month + '-' + +(parseInt(date) + 1),
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight,
    })
    wx.showLoading({
      title: '查询中',
    })
    paging(that, this.data.orderType, that.data.sType[id], 'up', function() {
      for (var i = 0; i < that.data.sType.length; i++) {
        if (i == id) {
          continue
        }
        paging(that, that.data.orderType, that.data.sType[i], 'up', function() {}, that.data.begin, that.data.end)
      }
    }, that.data.begin, that.data.end)
    var id = options.id ? options.id : 0
    var systemInfo = wx.getSystemInfoSync()
    this.ActionsheetSet({
      item: [{
          name: '支付类型',
          content: '转账',
          more: false,
          fn: '',
          index: 0,
          data: null
        },
        {
          name: '付款方式',
          content: '微信支付',
          more: true,
          fn: 'changeMethod',
          index: 1,
          data: null
        }
      ]
    })

    this.PayTempSet({
      iconFn: 'returnChangeMethod'
    })
    this.setData({
      currentTab: id,
      winHeight: systemInfo.windowHeight
    })
  },


  //开始日期选择器
  bindBeginDateChange: function(e) {
    var that = this;
    var selectDate = e.detail.value;
    var selectYear = selectDate.split("-")[0];
    var selectMonth = selectDate.split("-")[1];
    var selectDay = selectDate.split("-")[2];
    var todayDate = this.data.nowdate
    if (selectYear >= this.data.end_year) {
      if (selectMonth > this.data.end_month) {
        this.setData({
          end_year: selectYear,
          end_month: selectMonth,
          end_day: todayDate,
          end: selectYear + '-' + selectMonth + '-' + todayDate,
        })
      } else if (selectMonth == this.data.end_month) {
        if (selectDay > this.data.end_day) {
          this.setData({
            end_year: selectYear,
            end_month: selectMonth,
            end_day: selectDay,
            end: selectYear + '-' + selectMonth + '-' + selectDay,
          })
        }
      }
    }
    this.setData({
      begin_year: selectYear,
      begin_month: selectMonth,
      begin_day: selectDay,
      begin: selectYear + '-' + selectMonth + '-' + selectDay,
    });
    this.dataLoadOrder()
  },

  //结束日期选择器
  bindEndDateChange: function(e) {
    var that = this;
    var selectDate = e.detail.value;
    var selectYear = selectDate.split("-")[0];
    var selectMonth = selectDate.split("-")[1];
    var selectDay = selectDate.split("-")[2];
    if (selectYear < this.data.begin_year) {
      // if (selectMonth <= this.data.end_month) {
      this.setData({
        begin_year: selectYear,
        begin_month: selectMonth,
        begin_day: 1,
        begin: selectYear + '-' + selectMonth + '-' + 1,
      })
      // }
    } else if (selectYear == this.data.begin_year) {
      if (selectMonth < this.data.begin_month) {
        this.setData({
          begin_year: selectYear,
          begin_month: selectMonth,
          begin_day: 1,
          begin: selectYear + '-' + selectMonth + '-' + 1,
        })
      }
      if (selectMonth == this.data.begin_month) {
        if (selectDay < this.data.begin_day) {
          this.setData({
            begin_year: selectYear,
            begin_month: selectMonth,
            begin_day: 1,
            begin: selectYear + '-' + selectMonth + '-' + 1,
          })
        }
      }
    }
    this.setData({
      end_year: selectYear,
      end_month: selectMonth,
      end_day: selectDay,
      end: selectYear + '-' + selectMonth + '-' + selectDay,
    });
    this.dataLoadOrder()
  },
  onShow() {
    var that = this
    if (app.globalData.isChangeTenantId) {
      app.globalData.isChangeTenantId = false
      that.dataLoadOrder()
    }
  },
  PayTempSuccess(val) {
    var that = this
    var sTypeList = this.data.sType
    var index = this.data.currentTab
    var sn = this.ActionsheetGetItem(1).sn
    wx.showToast({
      title: '支付请求中',
      icon: 'loading',
      mask: true,
      duration: 50000
    })
    getPwd(val, function(pwd) {
      new Order(function(data) {
        wx.showToast({
          title: data.message.content,
          icon: 'success'
        })
        setTimeout(() => {
          util.navigateTo({
            url: '/pages/pay/success?sn=' + sn
          })
        }, 500)
        paging(that, that.data.orderType, sTypeList[index], 'up', function() {}, that.data.begin, that.data.end)
        that.PayTempClose()
      }, function() {
        that.PayTempClear()
      }).paymentSubmit({
        paymentPluginId: 'balancePayPlugin',
        enPassword: pwd,
        sn: sn
      })
    })
  },
  returnChangeMethod() {
    this.PayTempClose()
    this.ActionsheetShow()
  },
  changeMethod() { //修改支付方式
    var data = ['微信支付', '余额支付'],
      that = this
    wx.showActionSheet({
      itemList: data,
      success: function(res) {
        if (typeof res.tapIndex !== 'undefined') {
          that.ActionsheetSetItem({
            fn: 'changeMethod',
            content: data[res.tapIndex],
            more: true,
            data: {
              type: res.tapIndex == 0 ? 'chinaumsAppletPayPlugin' : 'balancePayPlugin',
              sn: that.ActionsheetGetItem(1).sn
            }
          }, 1)
        }
      },
      fail: function(res) {
        that.ActionsheetSetItem({
          content: data[0]
        }, 1)
      }
    })
  },
  weixinPayCanClick: true,
  actionsheetConfirm(e) { //弹框确定
    var selectData = this.ActionsheetGetItem(1)
    var that = this
    var sTypeList = this.data.sType
    var index = this.data.currentTab
    if (selectData.type == 'chinaumsAppletPayPlugin') {
      if (!this.weixinPayCanClick) {
        return
      }
      that.weixinPayCanClick = false
      new Order(function(data) {

        wx.requestPayment({
          'timeStamp': data.data.timeStamp,
          'nonceStr': data.data.nonceStr,
          'package': data.data.package,
          'signType': data.data.signType,
          'paySign': data.data.paySign,
          'success': function(res) {
            that.weixinPayCanClick = true
            paging(that, that.data.orderType, sTypeList[index], 'up', function() {}, that.data.begin, that.data.end)
            that.ActionsheetHide()
          },
          'fail': function(res) {
            that.weixinPayCanClick = true

          },
          'complete': function() {
            that.weixinPayCanClick = true
          }
        })
      }).paymentSubmit({
        paymentPluginId: 'chinaumsAppletPayPlugin',
        sn: selectData.sn
      })
      return
    }
    this.ActionsheetHide()
    this.PayTempShow()
  },

  //用于表单提交模板推送
  formSubmit(e) {

    var formId = e.detail.formId;
    var info = e.detail.target.dataset.info
    var sTypeList = this.data.sType
    var index = this.data.currentTab
    var that = this
    wx.showToast({
      title: '信息获取中',
      icon: 'loading',
      duration: 50000
    })
    new Order((res) => {
      new Order((data) => {
        wx.hideToast()
        that.ActionsheetSet({
          "header": "￥" + data.data.amount.toFixed(2)
        })
        that.ActionsheetSetItem({
          content: data.data.memo
        }, 0)
        that.ActionsheetSetItem({
          fn: data.data.useBalance ? 'changeMethod' : '',
          content: '微信支付',
          more: data.data.useBalance,
          data: {
            type: 'chinaumsAppletPayPlugin',
            sn: res.data
          }
        }, 1)
        that.ActionsheetShow()
      }).paymentView({
        sn: res.data
      })
    }).tradePayment({
      id: info,
      formId: formId
    })
    // new Order((a) => {
    //   wx.redirectTo({
    //     url: '/pages/member/order/order?id=0',
    //   })
    //   wx.navigateToMiniProgram({
    //     appId: 'wx441dd0c007894173',
    //     path: 'pages/pay/payjump?sn=' + a.data + '&tenantId=' + app.globalData.tenantId,
    //     extraData: {},
    //     envVersion: 'develop',
    //     success(res) {
    //       // 打开成功
    //       console.log(res)
    //     },
    //     fail: function(err) {
    //       console.log(err)
    //     }
    //   })
    //   new Order(function(res) {
    //     wx.hideToast()
    //     that.jumpPayShow()
    //     that.setData({
    //       jumpPay_path: 'pages/pay/payjump?sn=' + a.data + '&tenantId=' + app.globalData.tenantId,
    //       jumpPay_amount: res.data.amount,
    //       jumpPay_type: res.data.memo,
    //       jumpPay_closeUrl: '/pages/member/order/order?id=0'
    //     })
    //   }).paymentView({
    //     sn: a.data
    //   })
    // }).tradePayment({
    //   id: info,
    //   formId: formId
    // })
  },

  methodBtn(e) {
    var info = e.currentTarget.dataset.info
    var opType = e.currentTarget.dataset.type
    var sTypeList = this.data.sType
    var index = this.data.currentTab
    var that = this
    if (!opType || !info) return
    switch (opType) {
      case 'refund': //取消订单
        wx.showModal({
          title: '提示',
          content: '是否确认取消该订单',
          success: function(res) {
            if (res.confirm) {
              new Order((data) => {
                wx.showToast({
                  title: data.message.content,
                  icon: 'success',
                  duration: 1000
                })
                paging(that, that.data.orderType, sTypeList[index], 'up', function() {}, that.data.begin, that.data.end)
              }).refund({
                id: info
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 'return': //退货
        wx.showModal({
          title: '提示',
          content: '是否确认申请退货',
          success: function(res) {
            if (res.confirm) {
              new Order((data) => {
                wx.showToast({
                  title: data.message.content,
                  icon: 'success',
                  duration: 1000
                })
                paging(that, that.data.orderType, sTypeList[index], 'up', function() {}, that.data.begin, that.data.end)
              }).return({
                id: info
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 'confirm': //签收

        wx.showModal({
          title: '提示',
          content: '是否确认收货',
          success: function(res) {
            if (res.confirm) {
              new Order((data) => {
                wx.showToast({
                  title: data.message.content,
                  icon: 'success',
                  duration: 1000
                })
                // if (data.data.canShare) {
                //   that.popupShow()
                //   that.setData({
                //     couponId: data.data.couponId,
                //     username: data.data.username
                //   })
                // }
                paging(that, that.data.orderType, sTypeList[index], 'up', function() {}, that.data.begin, that.data.end)
              }).confirm({
                id: info
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 'remind': //提醒卖家发货/退货
        new Order((data) => {
          wx.showToast({
            title: data.message.content,
            icon: 'success',
            duration: 1000
          })
        }).remind({
          id: info
        })
        break;
      case 'evaluate': // 前去评价
        util.navigateTo({
          url: 'orderEvaluate/orderEvaluate?id=' + info,
        })
        break;
      case 'waitpay': //付款
        wx.showToast({
          title: '信息获取中',
          icon: 'loading',
          duration: 50000
        })
        new Order((res) => {
          // new Order((data) => {
          //   wx.hideToast()
          //   that.ActionsheetSet({ "header": "￥" + data.data.amount.toFixed(2) })
          //   that.ActionsheetSetItem({ content: data.data.memo }, 0)
          //   that.ActionsheetSetItem({
          //     fn: data.data.useBalance ? 'changeMethod' : '',
          //     content: '微信支付',
          //     more: data.data.useBalance,
          //     data: {
          //       type: 'chinaumsAppletPayPlugin',
          //       sn: res.data
          //     }
          //   }, 1)
          //   that.ActionsheetShow()
          // }).paymentView({
          //   sn: res.data
          // })

          wx.redirectTo({
            url: '/pages/member/order/order?id=0',
          })
          wx.navigateToMiniProgram({
            appId: 'wx441dd0c007894173',
            path: 'pages/pay/payjump?sn=' + res.data,
            extraData: {},
            // envVersion: 'develop',
            success(res) {
              // 打开成功
              console.log(res);

            },
            fail: function(err) {
              console.log(err)
            }
          })

        }).tradePayment({
          id: info
        })
        break;
      case 'logistics':
        util.navigateTo({
          url: '/pages/member/order/logistics/logistics?no=' + info,
        })
        break;
    }
  },
  pageModel: {
    // 'all': {
    //   pageNumber: 0,
    //   pageSize: 5,
    //   totalPages: 999
    // },
    // 'unpaid': {
    //   pageNumber: 0,
    //   pageSize: 5,
    //   totalPages: 999
    // },
    'unshipped': {
      pageNumber: 0,
      pageSize: 10,
      totalPages: 999
    },
    'unreciver': {
      pageNumber: 0,
      pageSize: 10,
      totalPages: 999
    },
    'accept': {
      pageNumber: 0,
      pageSize: 10,
      totalPages: 999
    }
  },
  goorderDetail(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'orderDetails/orderDetails?id=' + id + '&tradeType=' + this.data.orderType,
    })
  },
  //显示分润明细
  clickBonus(e) {
    var data = this.data
    var index = e.currentTarget.dataset.index
    var sTypeList = this.data.sType
    var currentTab = this.data.currentTab
    data[sTypeList[currentTab]][index].showBonusDetail = !data[sTypeList[currentTab]][index].showBonusDetail
    this.setData(data)
  }
}))

function paging(that, orderType, sType, direction, cb, beginTime, endTime, deliveryCenterId) {
  var tips = that.data[sType + 'Tips']
  var info = that.data[sType]
  if (direction == 'up') {
    info = []
  }
  if (direction !== 'up' && that.pageModel[sType].pageNumber + 1 > that.pageModel[sType].totalPages) {
    return
  }
  that.setData({
    [sType + 'Tips']: '加载中...'
  })
  new Order(function(data) {
    wx.hideLoading()
    var allOrderNum = that.data.allOrderNum;
    var allOrderPay = that.data.allOrderPay;
    var allOrderProfit = that.data.allOrderProfit;
    allOrderNum[sType] = data.data.allOrderNum,
      allOrderPay[sType] = data.data.allOrderPay,
      allOrderProfit[sType] = data.data.allOrderProfit,
      that.setData({
        allOrderNum: allOrderNum,
        allOrderPay: allOrderPay,
        allOrderProfit: allOrderProfit,
      })
    that.pageModel[sType].totalPages = data.pageModel.totalPages
    if (data.pageModel.totalPages == 0) {
      that.setData({
        [sType + 'Tips']: '暂无相关订单！',
        [sType]: []
      })
      cb ? cb() : ''
      return
    }
    var listModels = data.data.listModels
    for (var i = 0; i < listModels.length; i++) {
      listModels[i].create_date = util.formatTimeTwo(parseInt(listModels[i].create_date), 'Y/M/D h:m:s')
      listModels[i].showBonusDetail = false
    }
    info = info.concat(data.data.listModels)
    if (data.pageModel.totalPages <= data.pageModel.pageNumber) {
      that.setData({
        [sType + 'Tips']: '',
        [sType]: info
      })
      if (data.pageModel.totalPages < data.pageModel.pageNumber) {
        cb ? cb() : ''
        return
      }
    } else {
      that.setData({
        [sType + 'Tips']: "上拉加载",
        [sType]: info
      })
    }
    cb ? cb() : ''
  }).list({
    type: sType,
    pageNumber: direction == 'up' ? that.pageModel[sType].pageNumber = 1 : ++that.pageModel[sType].pageNumber,
    pageSize: that.pageModel[sType].pageSize,
    tradeType: orderType,
    beginTime: beginTime,
    endTime: endTime,
    deliveryCenterId: deliveryCenterId ? deliveryCenterId : ''
  })
}