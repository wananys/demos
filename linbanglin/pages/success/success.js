const app = getApp();
Page({
  data :{
    apptips: app.tips,
    cardIds:[],
    orderNo:'',
    tradeType:'',
    jsonData:[],
    loading: true,
    isNormal: true,
    isError: true,
    errorMsg:''
  },
  confirmComplete (){
  	return app.sign().then(res =>{
      app.linbanglin.payOrder(Object.assign(res,{orderNo:this.data.orderNo,cardIds:this.data.cardIds}))
      .then(res =>{
        console.log(res);
        this.setData({loading: false});
      	if(res.code ==0){
          this.setData({jsonData:res.jsonData,isNormal: false, isError:true});

        }else if(res.code == 999010){
          wx.navigateTo({url: '../login/login'});
        }else{
          this.setData({loading: false,isNormal:true,isError:false,errorMsg:res.msg});
        }
      }).catch(e => {
        console.log(e);
        this.setData({loading: false,isNormal:true,isError:false,errorMsg:app.tips.error});
      });
    });
  },
  onLoad (params){
  	this.data.orderNo = params.orderNo;
  	this.data.cardIds = params.cardIds;
  },
  onShow (){
    this.confirmComplete();
  },
  seccess (){
  	wx.navigateBack({delta: 5});
  }
})