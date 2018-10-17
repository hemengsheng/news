//index.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "datas":null,
    "showhide":0,
    "loadingHidden":0,
    "offset":0,
    "limit":10,
    "text":"下拉加载",
    "length":0,
    "hidden":true
  },
  showhide: function(event){
    var that=this;
    var toggleBtnVal = that.data.showhide;
    var itemId = event.currentTarget.id;
    if (toggleBtnVal == itemId) {
      that.setData({
        showhide: 0
      })
    } else {
      that.setData({
        showhide: itemId
      })
    }
    
  },
  details:function(e){
    var id = e.currentTarget.id;
    app.globalData.detail_id = id;
    wx.navigateTo({
      url: '../details/details',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },
  init:function(){
    var _this = this;
    wx.request({
      url: 'https://api.imory.cn/news/listNewsInfo?offset=' + _this.data.offset + '&limit=' + _this.data.limit,
      method: 'POST',
      header: {
        'Content-Type': 'aoolication/json'
      },
      success: function (res) {
        if (res.data.listNews.length==_this.data.length){
          _this.setData({
            text:"亲，已经到底了，拉不动了",
            loadingHidden: 1
          })
        }else{
          _this.setData({
            text: "下拉加载",
            loadingHidden: 1
          })
        }
        _this.setData({
          datas: res.data.listNews,
          loadingHidden:1,
          length: res.data.listNews.length
        })
        console.log(res.data.listNews.length);
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  /**
    * 生成分享图
   */
  onSaveImg: function (e) {
    var id = e.currentTarget.id;
    app.globalData.detail_id = id;
    wx.navigateTo({
      url: '../canvas1/canvas1',
    })
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
    this.setData({
      loadingHidden: 0
    })
    this.init();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      loadingHidden: 0
      })
    this.setData({
      limit:this.data.limit+10
    }) 
    this.init();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '实时掌握全球互联网前沿资讯',
      desc: '闻也实时资讯'
    }
  }
})