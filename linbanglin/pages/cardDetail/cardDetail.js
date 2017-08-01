const app = getApp();
Page({
  data :{
    apptips: app.tips,
    loading: true,
    cardId: '',
    jsonData: [],
    isNormal: true,
    isError: true,
    errorMsg:''
  },
  getCardDetail (){
    this.setData({loading: true});
  	return app.sign().then(res =>{
      app.linbanglin.getCardDetail(Object.assign(res,{cardId:this.data.cardId})).then(res =>{
        console.log(res);
      	if(res.code ==0){
          this.setData({loading: false,jsonData:res.jsonData,isNormal: false, isError:true});
        }else if(res.code == 999010){
          wx.navigateTo({url: '../login/login'});
        }else{
          this.setData({loading: false,isNormal:true,isError:false,errorMsg:res.msg});
        }
      }).catch(e => {
        console.log(e);
        this.setData({loading: false,isNormal:true,isError:false,errorMsg:app.tips.error});
      });;
    });
  },
  onLoad (params){
  	this.data.cardId = params.cardId;
  },
  onShow (){
    this.getCardDetail();
  }
})