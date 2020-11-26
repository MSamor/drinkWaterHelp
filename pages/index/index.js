//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {

  //   wx.getSetting({
  //     success: res => {
  //       if (!res.authSetting['scope.userInfo']){
  //         this.setData({
  //           hasUserInfo: true
  //         })
  //       }
  //     }
  //   })

  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       // hasUserInfo: true,
  //     })
  //     wx.redirectTo({
  //       url: '../mainIndex/mainIndex',
  //     })
  //   } else if (this.data.canIUse) {
  //     //这里生成一个app的函数
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         // hasUserInfo: true,
  //       })
  //       wx.redirectTo({
  //         url: '../mainIndex/mainIndex',
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           // hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // },
  // getUserInfo: function (e) {
  //   if (e.detail.errMsg == "getUserInfo:ok") {
  //     app.globalData.userInfo = e.detail.userInfo
  //     this.setData({
  //       userInfo: e.detail.userInfo,
  //       hasUserInfo: true,
  //     })
  //     wx.redirectTo({
  //       url: '../mainIndex/mainIndex',
  //     })
  //   } else {
  //     console.log("登录失败")
  //   }
  setTimeout(()=>{
    wx.redirectTo({
      url: '../mainIndex/mainIndex',
    })
  },2000)
  }
})