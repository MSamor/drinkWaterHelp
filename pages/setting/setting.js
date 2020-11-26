var app = new getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openTime: '08:00',
    endTime: '22:00',
    time: 8
  },
  openTimeChange(e) {
    this.setData({
      openTime: e.detail.value
    })
  },
  endTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  //订阅提醒
  setTip() {
    wx.requestSubscribeMessage({
      tmplIds: ['0W7Bz7a_eIaTpu2JtY057evKvXf8Etd-oa-SG9T3xeg'],
      success(res) {
        if (res['0W7Bz7a_eIaTpu2JtY057evKvXf8Etd-oa-SG9T3xeg'] == 'accept') {
          // wx.showToast({
          //   title: '订阅成功',
          // })
        } else {
          // wx.showToast({
          //   icon: 'fail',
          //   title: '订阅失败',
          // })
        }
      },
    })
  },
  plan() {
    this.setTip()
    // var that = this
    db.collection('plan')
      .where({
        openid: app.globalData.openid
      }).get({
        success: res => {
          if (res.data.length != 0) {
            db.collection('plan').where({
              openid: app.globalData.openid
            }).update({
              data: {
                openTime: this.data.openTime,
                endTime: this.data.endTime
              },
              success: (res) => {
                wx.showToast({
                  title: '设置成功',
                })
              },
              fail: function (res) {}
            })
          } else {
            db.collection('plan').add({
              data: {
                openid: app.globalData.openid,
                planTime: this.data.time,
                openTime: this.data.openTime,
                endTime: this.data.endTime,
                drinkTime: [],
                today: (new Date().getMonth() + 1) + '.' + (new Date().getDate())
              },
              success: res => {
                wx.showToast({
                  title: '设置成功',
                })
                setTimeout(() => {
                  wx.showToast({
                    icon: 'none',
                    title: '一次授权推送一次，建议勾选总是',
                  })
                }, 1000)
                // setTimeout(() => {
                //   wx.navigateTo({
                //     url: '../mainIndex/mainIndex',
                //   })
                // }, 500)
              },
              fail: res => {
                console.log("err")
              }
            })
          }
        },
        fail: res => {
          console.log("err")
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('plan')
      .where({
        openid: app.globalData.openid
      }).get({
        success: res => {
          this.setData({
            openTime: res.data[0].openTime,
            endTime: res.data[0].endTime
          })
        },
        fail: res => {

        }
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