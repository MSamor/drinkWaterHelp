// 云函数入口文件
const cloud = require('wx-server-sdk')
const md5 = require('md5');
var urlencode = require('urlencode');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  var ksort = function (arys) {
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newkey = Object.keys(arys).sort();
    //console.log('newkey='+newkey);
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {
      //遍历newkey数组
      newObj[newkey[i]] = arys[newkey[i]];
      //向新创建的对象中按照排好的顺序依次增加键值对

    }
    return newObj; //返回排好序的新对象
  }
  var APP_KEY = "WmtMQKE2jXogZc9R"
  var getReqSign = function (params, appkey) {
    // 1. 字典升序排序
    let params2 = ksort(params);
    // 2. 拼按URL键值对
    let str = '';
    for (var key in params2) {
      if (params2.hasOwnProperty(key)) {
        let value = params2[key];
        if (value !== '') { // 过滤空值，比如sign
          str += key + '=' + urlencode(value) + '&';
        }
      }
    }
    // 3. 拼接app_key
    str += 'app_key=' + appkey;
    // 4. MD5运算+转换大写，得到请求签名
    let sign = md5(str).toUpperCase();
    params1.sign = sign;
    return params1
  }

  let params1 = {
    app_id: '2132925944',
    time_stamp: parseInt(new Date().getTime() / 1000),
    nonce_str: Math.random().toString(36).slice(-5),
    sign: '', // 初始值一定要写成'',不要写成别的值
    speaker:6,
    format:2,
    volume:0,
    speed:100,
    text:event.text,
    aht:0,
    apc:58
  }

  var getData = await getReqSign(params1, APP_KEY)
  return getData
}