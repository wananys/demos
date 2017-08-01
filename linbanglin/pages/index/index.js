//index.js
const app = getApp()
Page({
  data: {
    status: true,
    userInfo: ''
  },
  onLoad () {
    app.wechat.getStorage('user_info')
      .then(res => {
        this.data.userInfo = res.data;
        this.setData(this.data);
      })
      .catch(() => {
        this.userLogin();
      });
  },
  userLogin (){
    app.login().then(res =>{
      if(res.code){
        //授权成功
        this.authorizedSuccess();
        app.authorized(res.params);
      }else{
        //授权失败
        this.authorizedFail();
      }         
    });
  },
  authorizedSuccess (){
    console.log(app.data);
    this.data.userInfo = app.data.userInfo;
    this.data.status = true;
    this.setData(this.data);
  },
  authorizedFail (){
    this.data.status = false;
    this.setData(this.data);
  },
  scancode () {
    // 扫一扫
    wx.scanCode({
        success: res => {
          console.log(res);
          if(app.util.isJSON(res.result)){
            console.log(res);
            let obj=JSON.parse(res.result);
            if(obj.type == '01'){//商铺列表
              wx.navigateTo({
                url: '../shops/shops?enterpriseId='+obj.enterpriseId
              });
            }else if(obj.type == '02'){//核对订单
                wx.navigateTo({
                  url: '../order/order?orderNo='+obj.orderNo
                });
              
            }
          }else{
            wx.showModal({title: '提示',content: '二维码扫描错误，请重新扫描',showCancel:false,confirmText:'好的！'});
          }
        }
    });
    
    // wx.navigateTo({
    //           url: '../order/order'
    //         });
    // wx.navigateTo({
    //   url: '../shops/shops?enterpriseId=3'
    // });
  },
  setting () {
    //用户授权
    app.wechat.openSetting().then(() =>{
      this.userLogin();
    }).catch(res => {
      this.setData(this.data);
    });
  },
  mycards (){
    wx.navigateTo({
      url: '../mycards/mycards'
    })
  }
})
