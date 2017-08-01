const app = getApp();

Page({
	data: {
		captcha: '',
		mobile: '',
		smsCode: '',
		captcha:'',
		captchaKey:'',
		codeBtn: '获取验证码',
		disabled: false,
		modalHidden: true,
		mobileFocus: true,  //手机号输入框聚焦
		smsCodeFocus: false,  //验证码输入框聚焦
		picCodeFocus: false   //图形验证码输入框聚焦
	},
	onLoad (){
		this.setData(this.data);
	},
	bindMobileInput (e){
		this.data.mobile = e.detail.value;
	},
	bindSmsCodeInput (e){
		this.data.smsCode = e.detail.value;
	},
	bindCaptchaInput (e){
		this.data.captcha = e.detail.value;
	},
	checkForm (type){
		var mobile = this.data.mobile;
	  	var msg = "请输入正确的手机号码";
	  	if(!app.util.RegMobile(mobile)){
			wx.showToast({
				title: msg
			});
			this.setData({mobileFocus: true});
			return false;
		}
		if(type == 'getcode'){
			if('' ===this.data.captcha){
				wx.showToast({
					title: '请输入验证码'
				});
				this.setData({picCodeFocus: true});
				return false;
			}
		}
		if(type==="submit"){
			if(this.data.smsCode === ''){
				wx.showToast({
					title: '请输入验证码'
				});
				this.setData({smsCodeFocus: true});
				return false;
			}
		}
		return true;
	},
	countDown (){
		var that = this;
		//倒计时
  		let t = 60;
  		that.data.disabled = true;
  		that.setData(that.data);
      	var timer = setInterval(function(){
		    t--;
		    
		    if(t < 10){
		    	t = app.util.leftPad(t,2,0);
		    }
		    if(t<0){
		    	that.data.disabled = false;
		    	that.data.codeBtn= "获取验证码";
		        that.setData(that.data);
		        clearInterval(timer);
		        return;
		    }  
		    that.setData({codeBtn: '('+t+')重新获取'});
		},1000);
	},
	getCaptcha (){
		app.linbanglin.getCaptcha().then(res =>{
			this.data.captchaKey = res.jsonData.captchaModel.captchaKey;
			this.setData({captcha:"data:image/jpeg;base64," + res.jsonData.captchaModel.captcha,modalHidden:false,picCodeFocus: true});
		});
	},
	changeCaptcha (){
		this.getCaptcha();
	},
	getMobileCode (){
		console.log('发送短信');
		this.setData({disabled:true});
		let params = {};
  		params.captcha = this.data.captcha;
  		params.captchaKey = this.data.captchaKey;
  		params.mobile = this.data.mobile;
		app.linbanglin.getMobileCode(params).then(res => {
			console.log(res);
  			if(res.code == '0'){
  				this.setData({modalHidden: true,smsCodeFocus: true});
  				this.countDown();
  				wx.showToast({title:'发送成功'});
  			}else if(res.code == '100001'){
  				//弹出验证码
  				this.data.captchaKey = res.jsonData.captchaModel.captchaKey;
  				this.setData({captcha:"data:image/jpeg;base64," + res.jsonData.captchaModel.captcha,modalHidden:false,picCodeFocus:true});
  			}else if(res.code == '100010'){//短信次数限制
  				wx.showToast({title: res.msg});
  			}else{
  				this.getCaptcha();
  				wx.showToast({title: res.msg});
  			}
  		}).catch(e=>{
  			console.log(e);
  			wx.showModal({
			  showCancel: false,
			  title: '提示',
			  content: app.tips.error,
			  confirmText: app.tips.confirm,
			  success: function(res) {
			    if (res.confirm) {
			      that.data.disabled = false;
			    }
			  }
			});
  		});
	},
	getCodeByCaptcha (){
		if(this.checkForm('getcode')){
  			this.getMobileCode();
  		}
	},
  	getCode () {
  		if(this.checkForm()){
  			this.getMobileCode();	
  		}
	},
	userLogin (params){
		console.log(params);
		app.linbanglin.userLogin(params).then(res => {
			if(res.code === 0){
				console.log('登录成功');
				app.wechat.setStorage('token', res.jsonData.token);
				app.wechat.setStorage('mobile', this.data.mobile);
				app.wechat.setStorage('user_id', res.jsonData.userId);
				wx.navigateBack();
			}else{
				wx.showToast({title: res.msg});
			}
					
		})
	},
	//绑定
	formSubmit (e) {
		let params = e.detail.value;
		if(this.checkForm('submit')){
			app.wechat.getStorage('thirdSessionId').then(res=>{
				console.log(res);
				params.thirdSessionId = encodeURIComponent(res.data);
				this.userLogin(params);
			}).catch(e =>{
				app.login().then(res =>{
			      if(res.code){
			        //授权成功
			        app.authorized(res.params).then(res=>{
			        	params.userId = res;
			        	this.userLogin(params);
			        });
			      }      
			    }).catch(e=>{
			    	console.log(e);
			    	wx.showModal({
			          showCancel: false,
			          title: '提示',
			          content: app.tips.error,
			          confirmText: app.tips.confirm
			        });
			    });
				
			})
		}
		
	},
	cancel (){
		this.setData({modalHidden:true});
	}
})