var app = getApp();
Page({
  data:{
    apptips: app.tips,
  	cardId:'',
  	jsonData: [],
  	loading: true,
  	hasMore: true,
  	page: 1,
    isNormal: true,
    isError: true,
    errorMsg:''
  },
  handleLoadMore () {
    if (!this.data.hasMore) return

    this.setData({loading: true })

    return app.sign().then(res =>{
      app.linbanglin.getTradeRecordList(Object.assign(res,{cardId:this.data.cardId,pageNum:this.data.page}))
        .then(res =>{
        	console.log(res);
          if(res.code == 999010){
            wx.navigateTo({url: '../login/login'});
          }else if(res.code == 0){
            if (this.data.page <res.jsonData.totalPage) {

              this.setData({jsonData: res.jsonData.details, loading: false, hasMore: true,isNormal: false, isError:true});
            } else if(this.data.page >= res.jsonData.totalPage){
               this.setData({jsonData: res.jsonData.details, loading: false,hasMore: false,isNormal: false, isError:true });
            } else {
              this.setData({hasMore: false, loading: false ,isNormal: false, isError:true})
            }
            this.data.page++;
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
  	this.data.cardId = params.cardId;
  },
  onShow (){
    this.handleLoadMore();
  },
  /**
   * 上拉分页
   * @return {[type]} [description]
   */
  onReachBottom (){
    this.handleLoadMore();
  }
})