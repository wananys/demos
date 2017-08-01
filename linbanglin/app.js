/**
 * WeChat API 模块
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
var wechat = require('./utils/wechat.js');

/**
 * linbanglin API 模块
 * @type {Object}
 */
var linbanglin = require('./utils/linbanglin.js');

/**
 * 公用函数
 * @type {Object}
 */
var util = require('./utils/util.js');

/**
 * md5加密
 */
var md5 = require('./utils/md5.js');

/**
 * 解密
 */
var aes = require('./utils/aes.js');

App({
  /**
   * Global shared
   * 可以定义任何成员，用于在整个应用中共享
   */
  data:{
    userInfo:''
  },
  tips: {
    error: '系统小差，请稍后再来！',   //
    loadingtoast: '加载中...',   //toast加载提示文字
    nomore: '没有更多内容了',   //上拉无内容
    loading:'玩了命的加载中...',  //分页加载提示
    confirm:'好的！'  //确认按钮提示文字
  },
  wechat: wechat,
  linbanglin: linbanglin,
  util: util,
  md5: md5,
  aes: aes,
  /**
   * 微信小程序登录授权获取用户信息
   * @return params {String}
   */
  login (){
    return wechat.userLogin().then(res=>{
      if(res.code){
        let login = res.res[0];
        let userInfo = res.res[1];
        let params = {
          code: login.code,
          rawData: encodeURIComponent(userInfo.rawData),
          encryptedData: encodeURIComponent(userInfo.encryptedData),
          signature:userInfo.signature,
          iv: encodeURIComponent(userInfo.iv)
        }
        this.data.userInfo = userInfo.userInfo;
        return {code: true, params: params};
      }else{
        return {code: false}
      }
    })
  },

  /**
   * 授权获取userId
   * @param  params {Object}
   * @return thirdSessionId {String}
   */
  authorized (params){
    console.log(params);
    return linbanglin.authorized(params).then(d=>{
      console.log(d);
      wechat.setStorage('thirdSessionId', d.jsonData.thirdSessionId);
      return d.jsonData.thirdSessionId;
    });
  },
  /**
   * 签名校验
   * @return param {Object}
   */
  sign (){
    return wechat.sign().then(res => {
      if(res.code){
        let param = {};
        param.token = res.res[0].data;  //对token进行解密
        param.userId = res.res[1].data;
        param.timestamp = new Date().getTime();
        param.sign = md5.hex_md5("userId=" + param.userId + "&token=" + aes.decrypt(param.token) + "&timestamp=" + param.timestamp);
        return param;
      }else{
        return wx.navigateTo({url: '../login/login'});
      }
    })
  },

  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function onLaunch() {
    
    console.log(' ========== Application is launched ========== ');
  },
});

