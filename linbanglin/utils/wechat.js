'use strict';

var Promise = require('./es6-promise.min.js');

/**
 * 登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({ success: resolve, fail: reject });
  });
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({ success: resolve, fail: reject });
  });
}

/**
 * 设置数据缓存
 * @param {String} key   本地缓存中的指定的 key
 * @param {Object/String} value   需要存储的内容
 */
function setStorage(key, value) {
  return new Promise(function (resolve, reject) {
    wx.setStorage({ key: key, data: value, success: resolve, fail: reject });
  });
}

/**
 * 异步获取本地缓存
 * @param {String} key   本地缓存中的指定的 key
 */
function getStorage(key) {
  return new Promise(function (resolve, reject) {
    wx.getStorage({ key: key, success: resolve, fail: reject });
  });
}

/**
 * 调起小程序设置界面
 */
function openSetting(){
  return new Promise(function(resolve, reject){
    wx.openSetting({success: resolve, fail: reject });
  });
}

/**
 * 获取系统信息
 */
function getSystemInfo(){
  return new Promise(function(resolve, reject){
    wx.getSystemInfo({success: resolve, fail: reject});
  })
}

/**
 * 小程序登录以及获取用户信息
 * 根据自身业务作出的处理
 */
function userLogin(){
  return Promise.all([login(),getUserInfo()])
    .then(res => {
      return {code: true, res: res};
    })
    .catch(res =>{
      return {code: false, res: res};
    })
}

/**
 * 获取签名校验
 * 结合自身业务作出的处理
 */
function sign(){
  return Promise.all([getStorage('token'),getStorage('user_id')])
    .then(res => {
      return {code: true, res: res};
    })
    .catch(res =>{
      return {code: false, res: res};
    })
}

module.exports = {
  login: login,
  getUserInfo: getUserInfo,
  setStorage: setStorage,
  getStorage: getStorage,
  openSetting: openSetting,
  userLogin: userLogin,
  sign: sign,
  getSystemInfo: getSystemInfo
};
