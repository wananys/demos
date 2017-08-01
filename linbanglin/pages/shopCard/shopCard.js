const app = getApp();
Page({
  data: {
    apptips: app.tips,
    cardNo: '',
    jsonData: [],
    counts:1,
    mobile:'',
    loading: true,
    isNormal: true,
    isError: true,
    errorMsg:''
  },
  getCardDetail (){
    this.setData({loading:true});
    return app.linbanglin.getCardDetail2({cardNo:this.data.cardNo}).then(res =>{
        console.log(res);
        if(res.code ==0){
          this.setData({jsonData:res.jsonData,loading:false,isNormal: false, isError:true});
        }else if(res.code == 999010){
          wx.navigateTo({url: '../login/login'});
        }else{
          this.setData({loading: false,isNormal:true,isError:false,errorMsg:res.msg});
        }
      }).catch(e => {
        console.log(e);
        this.setData({loading: false,isNormal:true,isError:false,errorMsg:app.tips.error});
      });
  },
  onLoad (params){
    this.data.cardNo = params.cardNo;
    this.getCardDetail();
  },
  getCard (){
    app.sign().then(res =>{
      app.wechat.getStorage('mobile').then(res=>{
        this.setData({counts:this.data.counts,mobile:res.data});
        this.showModal();
      }).catch(res=>{
        wx.navigateTo({url:"../login/login"});
      });
    }).catch(res=>{
      wx.navigateTo({url:"../login/login"});
    });
  },
  showModal () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  minusCounts (){
    if(this.data.counts<=1){
      wx.showToast({title:'不能再减少了'});
      return;
    }
    this.data.counts--;
    this.setData({counts:this.data.counts});
  },
  plusCounts (e){
    console.log(e);
    if(this.data.counts>=e.currentTarget.dataset.maxnum){
      wx.showToast({title:'最多选择'+e.currentTarget.dataset.maxnum+'张'})
      return;
    } 
    this.data.counts++;
    this.setData({counts:this.data.counts});
  },
  //申请办卡
  btnOk (event){
    app.sign().then(res =>{
      app.wechat.getStorage('mobile').then(mobile=>{
        this.setData({mobile:mobile.data});
        app.linbanglin.createOrder(Object.assign(res,{cardNo:event.currentTarget.dataset.cardno,purchaseNum:this.data.counts,enterpriseid:event.currentTarget.dataset.enterpriseId})).then(back=>{
          if(back.code == 0){
            wx.showToast({title:'申请成功'});
            this.hideModal();
            this.getCardDetail();
          }else if(back.code == 999010){
            wx.navigateTo({url: '../login/login'});
          }else{
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: back.msg,
              confirmText: app.tips.confirm
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
      }).catch(res=>{
        wx.navigateTo({url:"../login/login"});
      });
    });
  }
})