// pages/details/details.js
//引入文件
var WxParse = require('../../wxParse/wxParse.js');

//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "datas":[],
    styles: 'textStyle',
    animation1: '',
    animation2: '',
    timer: '',
    DZStyle: '../image/guzhang1.png',
    counts:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pid = app.globalData.detail_id ;
    var _this=this;
      wx.request({
        url: 'https://api.imory.cn/news/getById/'+pid,
        method:'GET',
        success: function (res) {
          if (res.data.code == 0) {
              _this.setData({
                datas: res.data.news
              })
            console.log(res.data.news);
            var article = res.data.news.newInfo;
             WxParse.wxParse('article', 'html', article, _this, 5);   // 实例化对象
            }
        },
        fail: function (err) {
          console.log(err);
        }
      })
  },
  //点赞
  DianZan: function () {
    var pid = app.globalData.detail_id;
    var _this = this;
    // 获取点赞数
    wx.request({
      url: 'https://api.imory.cn/news/likeCnt/' + pid,
      method: 'POST',
      success: function (res) {
        console.log(res);
        _this.setData({
          counts: res.data.likeCnt
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    this.animation = animation
    animation.scale3d(1.2, 1.2, 1).step()
    animation.scale3d(1, 1, 1).step()
    this.setData({
      animation1: animation.export(),
      DZStyle: '../image/guzhang.png'
    })
    this.animation.translate3d(0, -140, 0).opacity(1).step()
    this.animation.translate3d(0, -180, 0).step()
    this.animation.translate3d(0, 0, 0).opacity(0).step({ duration: 0 })
    
    this.setData({
      animation2: animation.export(),
      DZStyle: '../image/guzhang.png'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})