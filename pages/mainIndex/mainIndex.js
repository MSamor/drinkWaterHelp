const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    bntText: '今日已完成', //签到按钮
    loadModal: false,
    currentTime: '2020.6.10',
    planTime: '',
    pross: '0%', //喝水进度
    overDrink: '',
    plan: '',
    modalName: 'show',
    showModalBox: false, //setting
    showModal: false,
    loading: true, //进度条
  },
  onLoad() {
    this.loadModal()
  },
  dataALL: function () {
    wx.cloud.callFunction({
      name: 'getOpenId',
      success: res0 => {
        app.globalData.openid = res0.result.openid
        wx.cloud.callFunction({
          name: 'haveUser',
          data: {
            openid: res0.result.openid
          },
          success: res2 => {
            //false没有。true有
            if (!res2.result) { //没有执行
              db.collection('users').add({
                data: {
                  info: app.globalData.userInfo,
                  openid: res0.result.openid
                },
                success: res => {
                  this.showModalBox() //setting
                  this.setData({
                    loadModal: false
                  })
                },
                fail: res => {
                  console.log("写入新用户err")
                }
              })
            } else {
              //判断是否有计划
              db.collection('plan')
                .where({
                  openid: app.globalData.openid
                }).get({
                  success: res => {
                    // var that = this
                    if (res.data.length != 0) { //有计划
                      if (res.data[0].drinkTime.length < 8) {
                        this.setData({
                          bntText: "点击签到"
                        })
                      }
                      var tempToday = (new Date().getMonth() + 1) + '.' + new Date().getDate()
                      if (res.data[0].today != tempToday) { //进入查询
                        db.collection('plan').where({
                          openid: app.globalData.openid
                        }).update({
                          data: {
                            today: tempToday,
                            drinkTime: []
                          },
                          success: (res1) => { //进入数据更新
                            res.data[0].drinkTime.reverse()
                            this.setData({
                              showModal: false,
                              plan: [{
                                drinkTime: ''
                              }],
                              planTime: res.data[0].planTime,
                              overDrink: 0,
                              pross: "0%",
                              loadModal: false,
                              bntText: "点击签到"
                            })
                          }
                        })
                      } else {
                        res.data[0].drinkTime.reverse()
                        this.setData({
                          showModal: false,
                          plan: res.data,
                          planTime: res.data[0].planTime,
                          overDrink: res.data[0].drinkTime.length,
                          pross: ((res.data[0].drinkTime.length / res.data[0].planTime) * 100) + "%",
                          loadModal: false
                        })
                      }
                    } else {
                      this.setData({
                        loadModal: false,
                        bntText: "点击签到"
                      })
                      this.showModalBox()
                    }
                  },
                  fail: res => {
                    console.log("err")
                  },
                })
            }
          }
        })
      }
    })
  },
  addDrink: function (e) {
    this.setTip2()
    this.setData({
      animation: ''
    })
    var myDate = new Date()
    if (this.data.planTime > this.data.plan[0].drinkTime.length) {
      wx.showLoading({
        title: '签到中~',
        mask: true,
        success: (res) => {},
      })
      var that = this
      db.collection('plan').where({
        openid: app.globalData.openid
      }).update({
        data: {
          drinkTime: _.push(myDate.getHours() + ":" + (myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()))
        },
        success: function (res1) {
          //更新成功
          db.collection('plan')
            .where({
              openid: app.globalData.openid
            }).get({
              success: res => {
                //重新加载
                if (res.data[0].drinkTime.length >= 8) {
                  that.setData({
                    bntText: "今日已完成"
                  })
                }
                res.data[0].drinkTime.reverse()
                that.setData({
                  showModal: false,
                  plan: res.data,
                  planTime: res.data[0].planTime,
                  overDrink: res.data[0].drinkTime.length,
                  pross: ((res.data[0].drinkTime.length / res.data[0].planTime) * 100) + "%",
                  loadModal: false,
                  animation: "slide-bottom"
                })
                wx.hideLoading({
                  complete: (res) => {},
                })
                wx.showToast({
                  title: '签到成功',
                })
              },
              fail: res => {
                console.log("err")
              }
            })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    } else {
      this.setData({
        bntText: "今日已完成",
        modalName: e.currentTarget.dataset.target
      })
      // wx.showToast({
      //   title: '身体健康棒棒哒',
      // })
    }

  },
  //跳转setting
  toSetting: function () {
    this.setData({
      showModalBox: false
    })
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  //跳转用户信息
  toUserInfo: function (e) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '../userInfo/userInfo',
          })
        } else {
          this.showModal(e)
        }
      }
    })
  },
  //跳转Ai
  toAi: function (e) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '../Ai/Ai',
          })
          // this.setData({
          //   hasUserInfo: true
          // })
        } else {
          console.log(this.showModal(e))
          this.showModal(e)
        }
      }
    })

  },
  //订阅提醒
  setTip() {
    wx.requestSubscribeMessage({
      tmplIds: ['0W7Bz7a_eIaTpu2JtY057evKvXf8Etd-oa-SG9T3xeg'],
      success(res) {
        if (res['0W7Bz7a_eIaTpu2JtY057evKvXf8Etd-oa-SG9T3xeg'] == 'accept') {
          wx.showToast({
            title: '订阅成功',
          })
        } else {
          wx.showToast({
            title: '订阅失败',
            icon: 'none'
          })
        }
      },
    })
  },
  //订阅提醒
  setTip2() {
    wx.requestSubscribeMessage({
      tmplIds: ['0W7Bz7a_eIaTpu2JtY057evKvXf8Etd-oa-SG9T3xeg'],
      success(res) {
        if (res['0W7Bz7a_eIaTpu2JtY057evKvXf8Etd-oa-SG9T3xeg'] == 'accept') {
          // wx.showToast({
          //   title: '订阅成功',
          // })
        } else {
          wx.showToast({
            title: '订阅失败,可在菜单手动订阅提醒',
            icon: 'none'
          })
        }
      },
    })
  },
  showModalBox(e) {
    this.setData({
      showModalBox: true
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //弹框
  loadModal() {
    this.setData({
      loadModal: true
    })
  },
  //授权失败
  cancel() {
    wx.showToast({
      icon: 'none',
      title: '取消授权',
    })
    this.hideModal()
  },
  getUserInfo: function (e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo
      this.hideModal()
      wx.showToast({
        icon: 'success',
        title: '授权成功',
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '../Ai/Ai',
        })
      }, 500)
    } else {
      console.log("登录失败")
      this.hideModal()
      wx.showToast({
        icon: 'none',
        title: '授权失败',
      })
    }
  },
  onShow: function () {
    this.dataALL()
    var curDate = new Date()
    this.setData({
      currentTime: curDate.getFullYear() + '.' + (Number(curDate.getMonth()) + 1) + '.' + curDate.getDate(),
    })
  }
})