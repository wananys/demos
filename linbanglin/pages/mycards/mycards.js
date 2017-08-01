const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    apptips: app.tips,
    currentTab: 1,  //tab切换
    loading: true,
    hasMore1: true,
    hasMore2: true,
    page1: 1,
    page2: 1,
    lists1: [],
    lists2: [],
    isNormal: true,
    isError: true,
    errorMsg:''
  },

  handleLoadMore () {
    let index = this.data.currentTab;
    if (!this.data['hasMore'+index]) return

    this.setData({ loading: true });
    return app.sign().then(res =>{
      app.linbanglin.getUserCardList(Object.assign(res,{cardStatus:'0'+index,pageNum:this.data['page'+index]}))
        .then(res =>{
          console.log(res);
          if(res.code == 999010){
            wx.navigateTo({url: '../login/login'});
          }else if(res.code == 0){
            if (this.data['page'+index] <res.jsonData.totalPage) {
              this.setData({['lists'+index]: this.data['lists'+index].concat(res.jsonData.cardList), loading: false,isNormal:false,isError:true});
            } else if(this.data['page'+index]>= res.jsonData.totalPage){
              this.setData({['lists'+index]: this.data['lists'+index].concat(res.jsonData.cardList), loading: false, ['hasMore'+index]: false,isNormal:false,isError:true});
            } else {
              this.setData({['hasMore'+index]: false, loading: false ,isNormal:false,isError:true})
            }
            this.data['page'+index]++;
          }else{
            this.setData({loading: false});
            wx.showToast({
              title: res.msg
            });
          }
        }).catch(e => {
          console.log(e);
          this.setData({loading: false,isNormal:true,isError:false,errorMsg:app.tips.error});
        });
    });
  },
  onLoad (){
    // this.handleLoadMore();
  },
  onShow (){
    console.log('我的卡包');
    this.handleLoadMore();
  },
  /** 
   * 点击tab切换 
   */  
  swichNav ( e ) {  
    if(this.data.currentTab === e.target.dataset.current) {  
      return false;  
    }else{  
      this.setData({currentTab: e.target.dataset.current});  
    }  
    this.data.hasMore = true;
    this.handleLoadMore();
  },  
  clickCard (event){
    wx.navigateTo({
      url: '../cardDetail/cardDetail?cardId='+event.currentTarget.dataset.cardid
    }); 
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh () {
  //   this.setData({ lists: [], page: 1, hasMore: true })
  //   this.handleLoadMore()
  //     .then(() => app.wechat.original.stopPullDownRefresh());
  // },
  /**
   * 上拉分页
   * @return {[type]} [description]
   */
  onReachBottom (){
    this.handleLoadMore();
  }
})