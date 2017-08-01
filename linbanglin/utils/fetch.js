'use strict';

var Promise = require('./es6-promise.min.js'

/**
 * 抓取远端API的结构
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
);module.exports = function (api, path, params) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api + '/' + path,
      data: params,
      method: 'post',
      header: {"Content-Type":"application/x-www-form-urlencoded"},
      success: resolve,
      fail: reject
    });
  });
};