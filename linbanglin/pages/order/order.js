var app = getApp();
Page({
  data: {
    apptips: app.tips,
    countPay:false,
    amountPay: false,
    orderNo:'',
    checkcardIds: [],
    countPayIds:[],
    amountPayIds: [],
    jsonData:[],
    loading: true,
    isNormal: true,
    isError: true,
    errorMsg:''
  },
  getorderDetail (){
    return app.sign().then(res =>{
      app.linbanglin.tradeConfirm(Object.assign(res,{orderNo:this.data.orderNo})).then(res =>{
        console.log(res);
        if(res.code ==0){
          this.setData({jsonData:res.jsonData,loading: false,isNormal: false, isError:true});
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
    if(params.orderNo){
      this.data.orderNo = params.orderNo;
    }
  },
  onShow (){
    this.getorderDetail();
  },
  checkboxChange(e) {
    this.data.checkcardIds = e.detail.value;
  },
  clickCard (event){
    
    let cardId = event.currentTarget.dataset.value;
    let type = event.currentTarget.dataset.type;
    let status = true;

    if(this.data[type]) return false;
    //记录储值卡或记次卡所有的id
    if(this.data[type+'Ids'].indexOf(cardId) === -1){
      this.data[type+'Ids'].push(cardId);
    }
    for(var i=0;i<this.data.checkcardIds.length;i++){
      if(this.data[type+'Ids'].indexOf(this.data.checkcardIds[i])!=-1){
        status = false;
      }
    }
    if(status){
      this.setData({amountPay:false,countPay:false});
    }else{
      if(type=='amountPay'){
        this.setData({amountPay:false,countPay:true});
      }else if(type == "countPay"){
        this.setData({amountPay:true,countPay:false});
      }
    }
    
  },
  ajaxClick: function(event){
    let cardIds = JSON.stringify(this.data.checkcardIds);
    if(cardIds===''){
      wx.showToast({title:'请选择核销方式'});
      return false;
    }
    wx.navigateTo({url:'../success/success?orderNo='+event.currentTarget.dataset.orderno+'&cardIds='+cardIds});
  }
})