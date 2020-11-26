const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    InputBottom: 0,
    scrollTop: 80,
    value: '',
    date: 1000,
    userImg: "",
    tempAn: "",
    msg: [{
      position: "left",
      msg: "我是你的智能机器人！嘻嘻"
    }],
    src: ""
  },
  onChange(event) {
    this.setData({
      value: event.detail
    })
  },
  palyMedia: async function () {
    await wx.cloud.callFunction({
      name: 'signHc',
      data: {
        text: this.data.tempAn,
      }
    }).then(res => {
      wx.request({
        url: 'https://api.ai.qq.com/fcgi-bin/aai/aai_tts',
        data: {
          ...res.result
        },
        success: (res2) => {
          this.setData({
            src: "data:audio/wav;base64," + res2.data.data.speech
          })
          this.audioCtx.play()
        }
      })
    }).catch(res => {
      console.log(res)
    })
  },

  chat: async function () {
    var that = this
    if (this.data.value == "") {
      return
    }
    await this.data.msg.push({
      position: "right",
      msg: this.data.value
    })
    await this.setData({
      msg: this.data.msg,
    })
    //滑动
    this.data.scrollTop += 80
    wx.pageScrollTo({
      scrollTop: this.data.scrollTop,
      duration: 300
    })
    await wx.cloud.callFunction({
      name: 'sign',
      data: {
        session: this.data.date,
        question: this.data.value
      }
    }).then(res => {
      wx.request({
        url: 'https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat',
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          ...res.result
        },
        success: (res1) => {
          if (res1.data.data.answer == "") {
            res1.data.data.answer = "未找到答案，请重试。"
          }
          this.data.msg.push({
            position: "left",
            msg: res1.data.data.answer
          })
          this.setData({
            msg: this.data.msg,
            tempAn: res1.data.data.answer,
            value: ''
          })
          //滑动
          this.data.scrollTop += 80
          wx.pageScrollTo({
            scrollTop: this.data.scrollTop,
            duration: 300
          })
          that.palyMedia()
        }
      })
    }).catch(res => {
      console.log(res)
    })
  },
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },
  inputIn(e) {
    this.setData({
      value: e.detail.value
    })
  },
  // back(){
  //   wx.navigateBack({
  //     complete: (res) => {},
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      userImg: app.globalData.userInfo.avatarUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio')
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