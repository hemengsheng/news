const app = getApp();

/*
小程序利用canvas实现一键保存图片功能 */
Page({

  /**
   * 页面的初始数据
   */
  /**
   * 页面的初始数据
   */
  data: {
    cname: '',
    renwu: '',
    yuyan: '',
    fan: '',
    xg: '',
    imgurl: '',
    canvasHidden: true,     
    wxappName: '页面生成图片',    
    shareImgPath: '',
    screenWidth: '',       
    screenHeight: '',
    shareImgSrc: '',
    title:'',
    synopsis:'',
    fbTime:'',
    imgSrc:'../image/ewm.jpg'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pid = app.globalData.detail_id;
    wx.request({
      url: 'https://api.imory.cn/news/getById/' + pid,
      method: 'GET',
      success: function (res) {
        console.log(res);
        that.setData({
          title: res.data.news.title,
          synopsis: res.data.news.synopsis,
          fbTime: res.data.news.fbTime,
          source: res.data.news.source
        })
      }
    })
    wx.getImageInfo({
      src: '../image/ewm.jpg',
      success: function (res) {
        console.log(res);
        that.setData({
          shareImgPath: '../../' + res.path
        })
      }
    })

    //获取用户设备信息，屏幕宽度 
    wx.getSystemInfo({
      success: res => {
        console.log(res);
        that.setData({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight
        })
        //console.log(that.data.screenWidth)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var context = wx.createCanvasContext('share')
    context.setStrokeStyle("#00ff00")
    context.setLineWidth(1)
    context.stroke()
    context.draw(false, this.getTempFilePath)
  },
  //获取临时路径
  getTempFilePath: function () {
    wx.canvasToTempFilePath({
      canvasId: 'share',
      success: (res) => {
        console.log(res);
        this.setData({
          shareTempFilePath: res.tempFilePath
        })
      }
    })
  },
  /**
   * 绘制多行文本，由于文字比较多，这里我们写了一个函数处理
   */
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 26; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },
  //保存至相册
  saveImageToPhotosAlbum: function () {
    var that = this;
    var unit = that.data.screenWidth / 375
    //2. canvas绘制文字和图片
    const ctx = wx.createCanvasContext('share');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 545,771);  

    ctx.setFontSize(20)
    ctx.setFillStyle('#ffc520')
    ctx.fillText(that.data.fbTime, 50, 101)
    ctx.fillText('闻也实时资讯', 50, 141)
    ctx.setFontSize(20)
    ctx.setFillStyle('#000000')
    this.drawText(ctx, that.data.title, 50, 201, 145, 260);
    ctx.setFontSize(14)
    ctx.setFillStyle('#000000')
    this.drawText(ctx, that.data.synopsis, 50, 280, 145, 260);
    ctx.setFontSize(14)
    ctx.setFillStyle('#999999')
    this.drawText(ctx, that.data.source, 280,460, 145, 260);
    ctx.drawImage(that.data.shareImgPath, 50, 465, 100, 100);
    ctx.setFontSize(20)
    ctx.setFillStyle('#5a728e')
    ctx.fillText('每天一分钟', 205, 500)
    ctx.fillText('尽知天下事', 205, 530)
    ctx.stroke()
    ctx.draw(false, function () {
      // 3. canvas画布转成图片
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 545,
        height: 771,
        destWidth: 545,
        destHeight: 771,
        canvasId: 'share',
        fileType: 'jpg',
        success: function (res) {
          console.log(res);
          that.setData({
            shareImgSrc: res.tempFilePath
          })
          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          }
          //4. 当用户点击分享到朋友圈时，将图片保存到相册
          wx.saveImageToPhotosAlbum({
            filePath: that.data.shareImgSrc,
            success(res) {
              console.log(res);
              wx.showModal({
                title: '图片保存成功',
                content: '图片成功保存到相册了，去发圈噻~',
                showCancel: false,
                confirmText: '好哒',
                confirmColor: '#72B9C3',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                  }
                  that.setData({
                    canvasHidden: true
                  })
                }
              })
            }
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    wx.downloadFile({
      url: that.data.shareImgSrc,
      success: function (res) {
        that.data.shareImgSrc = res.tempFilePath
      }, fail: function (res) {
      }
    })
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
    //设置分享参数
    var that = this;
    return {
      fbTime: that.data.fbTime,
      title: that.data.title,
      synopsis: that.data.synopsis,
      source: that.data.source,
      imgSrc: that.data.imgSrc
    }
  }
})