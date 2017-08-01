// const URI = 'http://120.27.196.83:8080/yfkcustomer';
const URI = 'http://lbl.jiaxinmore.com/yfkcustomer';
// const URI = 'http://192.168.9.240:8080/yfkcustomer';
const fetch = require('./fetch');
/**
 * 抓取远程数据的API
 * @param  {String} type   类型，例如：'coming_soon'
 * @param {String} path    请求路径
 * @param  {Object} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function fetchApi (path,params) {
  return fetch(URI, path, params);
}

/**
 * 用户信息授权
 * @param {Object} params  参数
 * 
 */
function authorized(params){
	return fetchApi('api/user/authorized',params)
		.then(res => res.data);
}

/**
 * 获取短信验证码
 * @param {Number} mobile 手机号码
 */
function getMobileCode(params){
	return fetchApi('api/user/sendSms',params)
		.then(res => res.data)
	
}

/**
 * 获取图片验证码
 */
function getCaptcha(){
	return fetchApi('api/user/captcha')
		.then(res => res.data)
}

/**
 * 登录/注册
 * @param {Number} mobile 手机号码
 */
function userLogin(params){
	return fetchApi('api/user/login',params)
		.then(res => res.data);	
}

/**
 * 获取我的卡包列表
 */
function getUserCardList(params){
	return fetchApi('api/usercard/list',params)
		.then(res => res.data);
}

/**
 * 获取卡券详情
 */
function getCardDetail(params){
	return fetchApi('api/usercard/details',params)
		.then(res =>res.data);
}

/**
 * 获取交易记录列表
 */
function getTradeRecordList(params){
	return fetchApi('api/trade/tradeRecordList',params)
		.then(res =>res.data);
}

/**
 * 获取企业卡券列表
 */
function getPreviewList(params){
	return fetchApi('api/card/previewList',params)
		.then(res=>res.data);
}

/**
 * 获取卡券详情（申请办卡）
 */
function getCardDetail2(params){
	return fetchApi('api/card/details',params)
		.then(res=>res.data);
}

/**
 * 申请办卡
 */
function createOrder(params){
	return fetchApi('api/purchaseOrder/createOrder',params)
		.then(res=>res.data);
}

/**
 * 核销订单确认
 */
function tradeConfirm(params){
	return fetchApi('api/tradeOrder/checkOrder',params)
		.then(res=>res.data);
}

/**
 * 核销订单确认完成
 */
function payOrder(params){
	return fetchApi('api/tradeOrder/payOrder',params)
		.then(res=>res.data);
}

/**
 * 消费详情
 */
function getExpenseDetails(params){
	return fetchApi('api/tradeOrder/consumptions',params)
		.then(res=>res.data);
}

module.exports = {authorized, getMobileCode,userLogin,getUserCardList,getCardDetail,getTradeRecordList,getCaptcha,getPreviewList,getCardDetail2,createOrder,tradeConfirm,payOrder,getExpenseDetails}
