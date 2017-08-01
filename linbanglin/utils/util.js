
 
/**
 * 正则检验手机号码
 */
function RegMobile(mobile) {
	const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
	if(regMobile.test(mobile)){
		return true;
	}else{
		return false;
	}
}

/**
 * 补零方法
 */
function leftPad(str, len, ch){
	str = String(str);
	var i =-1;
	if(!ch && ch !==0) ch = '';
	len = len - str.length;
	while(++i < len){
		str = ch + str;
	}
	return str;
}

/**
 * 判断是否为json
 */
function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj=JSON.parse(str);
      if(str.indexOf('{')>-1){
        return true;
      }else{
        return false;
      }
    } catch(e) {
      console.log(e);
      return false;
    }
  }
  return false;
}

module.exports = {RegMobile, leftPad,isJSON}