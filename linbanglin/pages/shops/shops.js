const app = getApp();
Page({
  data: {
    apptips: app.tips,
  	enterpriseId:'',
  	page: 1,
  	jsonData: [],
    cards:[],
  	hasMore: true,
  	loading: true,
  	title: '',
    isNormal: true,
    isError: true,
    errorMsg:''
  },
  handleLoadMore () {
    if (!this.data.hasMore) return

    this.setData({ loading: true });
    return app.sign().then(res =>{
      app.linbanglin.getPreviewList(Object.assign(res,{enterpriseId:this.data.enterpriseId,pageNum:this.data.page}))
        .then(res =>{
          console.log(res);
          if(res.code == 999010){
            wx.navigateTo({url: '../login/login'});
          }else if(res.code == 0){
            this.setData({jsonData: res.jsonData});
            if (res.jsonData.cards.length>0 && this.data.page <res.jsonData.totalPage) {
              this.setData({cards: this.data.cards.concat(res.jsonData.cards), loading: false,isNormal: false, isError:true});
            } else if(res.jsonData.cards.length>0 && this.data.page>= res.jsonData.totalPage){
              this.setData({cards: this.data.cards.concat(res.jsonData.cards), loading: false,hasMore:false,isNormal: false, isError:true});
            } else {
              this.setData({hasMore: false, loading: false,isNormal: false, isError:true })
            }
            this.data.title = res.jsonData.enterpriseName;
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
  	this.data.enterpriseId = params.enterpriseId;
  },
   onShow (){
  	this.handleLoadMore();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    wx.setNavigationBarTitle({ title: this.data.title});
  },
  clickCard (event){
    wx.navigateTo({
      url: '../shopCard/shopCard?cardNo='+event.currentTarget.dataset.cardno
    });
  },
  /**
   * 上拉分页
   * @return {[type]} [description]
   */
  onReachBottom (){
    this.handleLoadMore();
  }
})