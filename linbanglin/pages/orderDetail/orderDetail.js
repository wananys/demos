var app = getApp();
Page({
  data:{
    apptips: app.tips,
    loading: true,
    jsonData:[],
    orderNo:'',
    isNormal: true,
    isError: true,
    errorMsg:''
  },
  getDetail (){
    app.sign().then(res =>{
      app.linbanglin.getExpenseDetails(Object.assign(res,{orderNo: this.data.orderNo}))
      .then(res=>{
        console.log(res);
        if(res.code ==0){
          this.setData({jsonData:res.jsonData,loading:false,isNormal: false, isError:true});
        }else if(res.code == 999010){
          wx.navigateTo({url: '../login/login'});
        }else{
          this.setData({loading: false,isNormal:true,isError:false,errorMsg:res.msg});
        }
      }).catch(e=>{
        console.log(e);
        this.setData({loading: false,isNormal:true,isError:false,errorMsg:app.tips.error});
      });
    });
  },
  onLoad (params){
    this.data.orderNo = params.orderNo;
  },
  onShow (){
    this.getDetail();
  }
});