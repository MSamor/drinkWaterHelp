// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 云函数入口函数
//判断有没有用户
exports.main = async (event, context) => {
  console.log(event.openid)
  let promise = await db.collection('users').where({
    _openid: event.openid
  }).get()
  console.log(promise)
  if(promise.data[0]){
    return true
  }else
    return false
  

}