var app = getApp();
var util = require("../../../utils/util.js");
var member = require("../../../service/member.js");

Page({
  data: {
    zhengmian: 'https://cdn.laiyijia.com/upload/image/201812/f941ccea-9a9d-4173-aa8a-b3b0ca27bb76.png',
    fanmian: 'https://cdn.laiyijia.com/upload/image/201812/99fe0d34-160a-4bd8-8ba3-7edeeb30c02e.png',
    name: '',
    idCard: '',
    whereFrom: '',
    next: '下一步',
    backgroundBtn: 'default'
  },
  onLoad: function(opt) {
    var that = this;
    that.setData({
      whereFrom: opt.type ? opt.type : ''
    })
    if (opt.type == 'member') {
      that.setData({
        next: '提交',
        backgroundBtn: 'primary'
      })
    } else {
      that.setData({
        next: '下一步',
        backgroundBtn: 'default'
      })
    }
  },
  onShow: function() {

  },


  //上传正面照片
  uploadzheng: function() {
    var that = this;
    util.getUrlAfterUpload(function(data, tempFilePaths) {
      that.setData({
        fontUrl: data,
        zhengmian: tempFilePaths
      })
    })
  },

  //上传反面照片
  uploadfan: function() {
    var that = this;
    var that = this;
    util.getUrlAfterUpload(function(data, tempFilePaths) {
      that.setData({
        backUrl: data,
        fanmian: tempFilePaths
      })
    })
  },

  //输入姓名
  name: function(e) {
    this.setData({
      name: e.detail.value.trim()
    })
  },

  //输入证件号
  idCard: function(e) {
    this.setData({
      idCard: e.detail.value.trim()
    })
  },

  //实名认证提交
  submit: function() {
    var that = this;
    if (that.data.name == '') {
      util.errShow('请填写姓名');
    } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(that.data.idCard))) {
      util.errShow('证件号错误');
    } else if (that.data.zhengmian == 'https://cdn.laiyijia.com/upload/image/201812/f941ccea-9a9d-4173-aa8a-b3b0ca27bb76.png') {
      util.errShow('请上传身份证正面照片');
    } else if (that.data.fanmian == 'https://cdn.laiyijia.com/upload/image/201812/99fe0d34-160a-4bd8-8ba3-7edeeb30c02e.png') {
      util.errShow('请上传身份证反面照片');
    } else {
      new member(function(data) {
        wx.showToast({
          title: '提交成功，等待审核',
          icon: 'none',
        })
        setTimeout(function() {
          wx.redirectTo({
            url: 'status?where=' + that.data.where
          })
        }, 2000)
      }).idcardSave({
        name: that.data.name,
        idcard: that.data.idCard,
        pathFront: that.data.fontUrl,
        pathBack: that.data.backUrl
      })

    }
  }










});