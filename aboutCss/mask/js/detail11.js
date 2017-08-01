/**
 *详情 
 */
var ptid;
var code_detail = true,code_bask = true;//判断是否第一次点击
var bask_page = 1,pagesize = 3,bask_total;//晒单列表页数
var countdown_begin,countdown_end,countdown_open;//三个倒计时时间
var nowtime;//当前服务器时间
var downTime; // 计算截止时间
var down_status;//区分状态 0:开始倒计时，1:竞标倒计时，2:揭晓结果倒计时
var expire,zone='';//批量杀价zone(区间号)
var price_type;//判断是单个还是批量
var leftTime;
var selt_mod=0;
var FullCount=0;	//总需出价次数
var my_pass_num=[];		// 已经出价的号码
var nowSeltNums=[];	//现在选择的号码
var url = '#',pid=0,term=0,user_url='';

//高精度算法
Number.prototype.mul = function (arg)   
{   
    var m=0,s1=this.toString(),s2=arg.toString();   
    try{m+=s1.split(".")[1].length}catch(e){}   
    try{m+=s2.split(".")[1].length}catch(e){}   
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)   
}

$(function(){
	getDetail();//获取商品信息详情
	get_money();//获取用户金币
	get_bask_list(bask_page,pagesize);  //获取用户晒单
	get_history(); //获取往期记录
	//关闭二维码弹窗
	$('.spe_ewm_layer').on('click',function(){
		$(this).hide();
	});

	//我要出价
	$('#btn_my_price').on('click',function(){
		$(".view_wycj").show();
		$(".bg_cover").show();
		// 获取自己在当前商品的出价记录
		get_myprice();
		
	});
	// 获取自己在当前商品的出价记录列表
	function get_myprice(){
		$.post(url,{
			action:"getSelfBuyRecByPtid",
			ptid:ptid
		},function(result){
			var nums = result.data;
			my_pass_num = nums;
			if(count_obj(nums)>0){
				var price_html = "";
				for(i in nums){
					price_html+="<font>￥"+nums[i]+"</font>";
				}
				$('#my_price_list').html(price_html).show();
			}
		},"json");
	}
	
	// 查看已经选过的num
	$("#show_mynums").on("click",function(){
		$(".my_nums").show();
	});
	
	// 关闭出价记录
	$(".my_nums>.close").on("click",function(){
		$(".my_nums").hide();
	});
	
	
	// 关闭出价
	$("#close_cj").on("click",function(){
		$(".view_wycj").hide();
		$(".bg_cover").hide();
	});
	
	//打开教程
	$(".tutorial").on("click",function(){
		$(".jiaocheng").show();
	});
	$(document).delegate("#show_rule","click",function(){
		$(".jiaocheng").show();
	});
	// 关闭教程
	$(".close_rule").on("click",function(){
		$(".jiaocheng").hide();
	});
	
	// 获取往期揭晓
	function get_history(){
		$.post(url,{
			action:"getPassList",
			pid:pid,
			pagesize:5
		},function(result){
			var his_html = template('history_template', result);
			$('.history').html(his_html);
		},"json");
	}
	
	// 获取目前的购买进度
	function getCurrentBuyCount(){
		$.post(url,{
			action:"getCurrentBuyCount",
			pid:pid
		},function(result){
			
			if(result.code==0){
				pro_html = template('tmp-progress', result.data);
				$('#now-progress').html(pro_html);
				if(parseInt(result.data.buy_count)>=parseInt(result.data.fullcount)){
					// 开奖倒计时
//					$('#me_lottery').show();
//					show_opentime();
					location.reload();
				}else{
					setTimeout(function(){
						getCurrentBuyCount();
					},13000);
				}
			}else{
				$.toast(result.msg);
			}
		},"json");
	}
	
	
	// 生产不重复的随机数
	/*
	num 要产生多少个随机数
	from 产生随机数的最小值
	to 产生随机数的最大值
	arr 已经选过的num
	*/
	function createRandom(num ,myarr, from , to){
	    var arr=[];
	    var json={};
		var new_arr=[];
		for(i in myarr){
			new_arr.push(myarr[i]*100);
		}
		var data=new_arr;
		// 标记已经存在的号码
		for(i in data){
			json[data[i]]=1;
		}
	    while(arr.length<num)
	    {
	        //产生单个随机数
	        var ranNum=Math.ceil(Math.random()*(to-from))+from;
	        //通过判断json对象的索引值是否存在 来标记 是否重复
	        if(!json[ranNum])
	        {
	            json[ranNum]=1;  //标记为true
	            arr.push(ranNum);
	        }
	         
	    }
	    return arr;
	}
	
	// 点击选择几张票
	$(".click_btn").find("li").on("click",function(){
		var num=$(this).data("num");
		if(num>(FullCount-my_pass_num.length)){
			$.toast("剩余次数不足");
			return false;
		}
		$(this).addClass("action");
		$(this).html("重选");
		$(this).siblings().each(function(){
			var num = $(this).data("num");
			$(this).removeClass("action").html(num+"个");
		});
		$("#output").removeClass("down");
		setTimeout(function(){
			var nums = createRandom(num,my_pass_num,0,FullCount);
			nowSeltNums=nums;
			var str = "";
			for(i in nums){
				str+='<li>￥'+Number(nums[i]).mul(0.01)+'</li>';
			}
			$("#output>ul").html(str);
			$("#output").addClass("down");
		},500);
	});
	
	
	/************* 确认出价  **************/
	
	$('#confirm_price').on('click',function(){

		if(nowSeltNums.length==0){
			$(".view_wycj .tip").removeClass("shake");
			setTimeout(function(){
				$(".view_wycj .tip").addClass("shake");
			},300);
			$.toast("请先选择号码");
			return false;
		}
		var new_Nums=[];
		for(i in nowSeltNums){
			new_Nums.push(Number(nowSeltNums[i]).mul(0.01));
		}
		$('#confirm_price').addClass("wait");
		$.post(url, {
			action: 'createGameRecord',
			pid:pid,
			ptid:ptid,
			buy_num:new_Nums,
			buy_type:3
		}, function(data){
			$('#confirm_price').removeClass("wait");
			reset_wycj();	// 重置我要出价
			getCurrentBuyCount(); // 更新当前竞标进度
			get_price(data);	// 出价结果
			get_myprice();	// 更新已经出价号码池
			getPlayer();	// 更新目前参与人
		}, "json");
	});
	
	// 重置我要出价
	function reset_wycj(){
		$("#output").removeClass("down");
		nowSeltNums = [];
		$(".click_btn").find("li").each(function(){
			var num = $(this).data("num");
			$(this).removeClass("action").html(num+"个");
		});
	}
	
	//继续出价
	$('#price_on').on('click',function(){
		$('.com_model').hide();
	});
	
	
	$('#my_price').on('keyup',function(){
		var v = $('#my_price').val();
		var obj = $('#btn_price');
		if(v!== ""){
			obj.addClass('active').removeAttr("disabled");
			$('#btn_price .me_offer').show();
		}else{
			obj.removeClass('active').attr("disabled","disabled");
			$('#btn_price .me_offer').hide();
		}
	});
	
	
	/*****************************普通商品end**********************************/
	

	//关闭弹窗
	$('.com_m_close').on('click',function(){
		$('.com_model').hide();
		$(".view_wycj").hide();
		$(".bg_cover").hide();
	});
  	
});

// 获取对象长度
function count_obj(o){
    var t = typeof o;
    if(t == 'string'){
            return o.length;
    }else if(t == 'object'){
            var n = 0;
            for(var i in o){
                    n++;
            }
            return n;
    }
    return false;
};

//获取当前参与人
var player_ps=12;  //参与人分页的pagesize
var player_page=0;	//参与人的当前页数
var player_total=0;	//参与人总共几页
var player_data=[];	//存储用户静态data
function getPlayer(){
	$.post(url, {
		action: 'getCurrentBuyer',
		pid:pid,
		page:1,
		pagesize:9999
	}, function(result){
		var c_data=result.data.list;
		player_total = Math.ceil(c_data.length/player_ps);

		for(var k=0;k<player_total;k++){
			player_data[k]=[];
			for(i in c_data){
				if(i>=k*player_ps && i<(k+1)*player_ps){
					// 数组分页
					player_data[k].push(c_data[i]);
				}
			}
		}
		var data = {
			total:player_total,
		    list: player_data[player_page]
		};
		var h_player = template('tmp-player', data);
		$('.now_winner').append(h_player);
	},"json");
}
// 第一次获取，显示第一页
getPlayer();

// 查看更多参与人
$(".ajax_more").on("click",function(){
	player_page++;
	console.log(player_page+"/"+player_total);
	if(player_page>=player_total){
		$(".ajax_more").html("没有更多了");
		return false;
	}
	var data = {
		total:player_total,
	    list: player_data[player_page]
	};
	var h_player = template('tmp-player', data);
	$('.now_winner').append(h_player);
});


//获取详情
function getDetail(){
	$.post(url, {
			action: 'getProductDetail',
			pid:pid,
			term:term
		}, function(result){
			if (result.code == 0) {
				var data = result.data;
				
				$('#limit_url').attr('href',limit_url+'?cid='+data.cid);
				
				// 轮播图对接
				if(data.photos.length>0){
					var h_swiper = template('tmp-photos', data);
					$('.swiper-container').find('.swiper-wrapper').html(h_swiper);
					//初始化轮播图
					var mySwiper = $('.swiper-container').swiper({
		                loop: true,
		                observer: true,//修改swiper自己或子元素时，自动初始化swiper
		                observeParents: true//修改swiper的父元素时，自动初始化swiper
		            });
					
				}
				
				FullCount = data.fullcount;
				expire = data.expire;
				countdown_open = parseInt(data.opentime);
				nowtime = parseInt(data.time);
				countdown_end = parseInt(data.endtime);
				countdown_begin = parseInt(data.begintime);
				leftTime = parseInt((countdown_open - nowtime)*100);	//开始竞标时间-服务器当前时间
				downTime = Math.floor(countdown_end-nowtime)*100; 	//结束时间-服务器当前时间
				
				/* 已经结束竞标 */
				if(countdown_end>0 && countdown_end<=nowtime){
					// 已经开奖状态
					if(data.status==2){
						window.location.href = result_url +"?ptid=" + data.id;
					}else if(data.status==1){	//结束竞标， 未开奖
						if(countdown_open-nowtime <= 0){	//正在计算中。。。
							$('#me_lotterying').show();
							is_result();
							
						}else{		//揭晓结果2分钟倒计时(opentime)
							$('#me_lottery').show();
							down_status = 2;
							show_opentime();
						}
						$('.btn_price').hide();
						$('.btn_priceing').show();
					}else{	// 开奖错误
						// 未处理
						window.location.href = "/index.php";
					}
				}else{
					// data.isbegin 是否开始竞标
					if(data.isbegin==true){
						// 正常竞标中状态
						down_status = 1;
					}else{
						// 竞标未开始
						show_begintime();
						down_status = 0;
						$('.btn_price').removeClass('active').attr('disabled','disabled');
					}
				}
				
				
				// 对接标题简介	
				var h_disc = template('tmp-disc', data);
				$('.me-disc').html(h_disc);
	
				if(data.supplier.length>0){
					if(data.supplier.name){
						if(data.supplier.location){
							$('#d_p1').html('该商品由 '+data.supplier.name+' 提供<span>由 '+data.supplier.location+' 发货</span>');
						}else{
							$('#d_p1').html('该商品由 '+data.supplier.name+' 提供');
						}
					}
					var supplier = '';
					supplier += '<li><i class="icon_t1"></i><span>正品保证</span></li> ';
					if(data.supplier.is_direct == 1){
						supplier += '<li><i class="icon_t2"></i><span>全球直供</span></li> ';
					}
					if(data.supplier.is_haitao == 1){
						supplier += '<li><i class="icon_t3"></i><span>极速海淘</span></li> ';
					}
					if(data.supplier.is_low == 1){
						supplier += '<li><i class="icon_t4"></i><span>低价省时</span></li>';
					}
					$('#d_p2').html(supplier);
				}
				if(data.fullcount){
					$('#fullcount').html(data.fullcount+'次');
				}
				
				ptid = data.id;
				
			} else {
				$.toast(result.msg);
				setTimeout(function() {
        				getDetail();
      			}, 1000);
			}
			$.init();
		}, "json");	
}

var startPosition=0;
$.fn.scrollToBottom = function(scrollHeight ,duration) {    //目的 时间
    var $el = this;
    var el  = $el[0];
    var delta = scrollHeight  - startPosition;
    var startTime = Date.now();
    function scroll() {
        var fraction = Math.min(1, (Date.now() - startTime) / duration);
        el.scrollTop = delta * fraction + startPosition;
        if(fraction < 1) {
            setTimeout(scroll, 10);
        }
    }
    scroll();
};

/* 点击后获取详情  */
$("#get_detail").on("click",function(){
	get_detail();
});

//获取图文详情
function get_detail(){
	$.post(url, {
		action: 'getProductContent',
		pid:pid
	}, function(data){
		if (data.code == 0) {
			code_detail = false;
			if(data.data){
				$("#details").show();
				$('#detail_content').html(data.data);
			}else{
				$('#detail_content').html('<p class="com_none">还没有商品详情哦～</p>');
			}
		} else {
			$('#detail_content').html('<button class="com_retry" onclick="get_detailcontent();">点击重试</button>');
//			$.alert(data.msg);
		}
	}, "json");
}


//晒单
function get_bask_list(_page,_pagesize){
	$.post(url, {
		action: 'getShareWinList',
		pid:pid,
		page:_page,
		pagesize:_pagesize
	}, function(result){
		if (result.code == 0) {
			code_bask = false;
			var data = result.data;
			if(data.list.length>0){
				var h_bask = template('tmp-share', data);
				$('.bask_list').append(h_bask);
				bask_page ++ ;
			    bask_total = data.totalpage;
			    //点击时打开图片浏览器
				  $(document).on('click','.me_imgs',function () {
				  	var photo = $(this).children();
				  	var show_imgs = [];
				  	photo.each(function(){
				  		show_imgs.push($(this).attr("src"));
				  	});
				  	
				  	var nyPhotoBrowser = $.photoBrowser({
				      	photos : show_imgs
				  	});
				    nyPhotoBrowser.open();
				  });
			}else{
				
				//$('#bask').html('<p class="com_none">还没有用户晒单哦～</p>');
			}
		} else {
			$('#bask').html('<button class="com_retry" onclick="get_bask_list(bask_page,pagesize);">点击重试</button>');
//			$.alert(data.msg);
		}
	}, "json");
}

//获取用户金币
function get_money(){
	$.post(user_url,{
		action:"getUserInfo"
	},function(data){
		if(data.code == 0){
			var _money = data.data.money;
			$('.my_coins>font').html(_money);
		}
	},"json");
}

/*
 * 开始倒计时（begintime）
 * 该结束后：竞标截止倒计时
 */
var b_status;
function show_begintime(){
	clearTimeout(b_status);
	var obj = $('#me_time');
	var leftTime = parseInt(countdown_begin - nowtime);
	var h = parseInt(leftTime/(60*60));
	var m = parseInt(leftTime/60%60);
	var s = parseInt(leftTime%60);
	if (h<10) h = "0"+h.toString();
	if (m<10) m = "0"+m.toString(); 
	if (s<10) s = "0"+s.toString();
	obj.html('<span>距离竞标开始 </span> <em>'+h+':'+m+':'+s+'</em>');
	if(leftTime<=0){
		down_status = 1;
		return false;
	}
	nowtime++;
	b_status = setTimeout(show_begintime,1000);
}

/*
 * 竞标截止倒计时（endtime）
 * 结束后：揭晓结果倒计时
 */
var e_status;


/*
 * 揭晓结果倒计时（opentime）
 * 结束后：显示正在计算中...
 */
var o_status;


function show_opentime(){
	clearTimeout(o_status);
	$('.com_model').hide();
	$('.com_winner').remove();
	var obj = $('#me_time_lottery');
	var m = Math.floor(leftTime/(100*60));
	var s = Math.floor((leftTime/100)%60);
	var ss = Math.floor(leftTime%100);
	if (m<10) m = "0"+m.toString();
	if (s<10) s = "0"+s.toString(); 
	if (ss<10) ss = "0"+ss.toString();
	obj.html('<span class="me_downtime">'+m+'</span>:<span class="me_downtime">'+s+'</span>:<span class="me_downtime">'+ss+'</span>');
	if(leftTime<=0){
		is_result();
		down_status = 2;
		$('#me_lottery').hide();
		$('#me_lotterying').show();
		return false;
	}
	leftTime--;
	o_status = setTimeout(show_opentime,10);
}

/**
 * 正在计算中，不断请求后台计算结果，若完成则跳到结果页
 */
var result_time;
function is_result(){
	clearTimeout(result_time);
	$.post(url, {
		action: 'getTermStatus',
		ptid:ptid
	}, function(result){
		
		if(result.data.status == 1){
			//留在当前页面
			
		}else if(result.data.status == 2){
			window.location.href = result_url +"?ptid=" + ptid;
		}else{
			window.location.href = '/';
		}
	}, "json");
	result_time = setTimeout(is_result,10000);
}



//获取服务器时间
function get_time(){
	 $.ajax({
		type: 'get',
 		url: "/time.php",
		success: function (data){ 
            nowtime = parseInt(data);
            if(down_status == 0){//开始倒计时
				show_begintime();
			}else if(down_status ==1){
				// 正常竞标
			}else if(down_status == 3){//揭晓倒计时
				show_opentime();
			}
		}
	});
}
setInterval(get_time,10000);

//获取二维码
function getcode(){
	$.post(home_url,{
		action:'getPromoteQR'
	},function(result){
		if(result.code==0){
			var ewmImg = result.data.imgurl;
			$(".spe_ewm_layer img").attr("src",ewmImg);
		}else{
			setTimeout(getcode,3000);
		}
	},"json");
}

//出价
function get_price(data){
	if (data.code == 0) {
		get_money();
		$('.com_model').hide();
		/*var notice_code = data.data.notice_code;
		if(notice_code==1){
			$('.m_success .icons').attr('class','icons icon_success_l');
		}else if(notice_code == 2){
			$('.m_success .icons').attr('class','icons icon_success');
		}else if(notice_code == 3){
			$('.m_success .icons').attr('class','icons icon_success_d');
		}else if(notice_code == 4){
			$('.m_success .icons').attr('class','icons icon_success_up');
		}*/
		$('#cost_gold').html(data.data.coins);

		$('.share_tips').removeClass('com_hide');
		$('#m_result').show();
		$('.m_success').show();
		$('.m_error').hide();
		
	}else if(data.code == 10005){
		$.toast(data.msg);
	}else if(data.code == 10006){
		$('.com_model').hide();
		$('#m_result').show();
		$('.m_error').show();
		$('.m_success').hide();
	}else if(data.code == 20001){
		window.location.href = data.data.redirect;
	}else{
		$.toast(data.msg);
	}
}

//点击单个出价
function single_price(){
	$('#m_my_price').show();
	$('.m_offer').show();
	$('.m_success').hide();
	$('.m_error').hide();
	var obj_price = $('#my_price');
	var val = obj_price.val();
	var obj = $('#btn_price');
	if(val !== ''){
		obj.addClass('active').removeAttr("disabled");
		$('#btn_price .me_offer').show();
	}else{
		obj.removeClass('active').attr("disabled","disabled");
		$('#btn_price .me_offer').hide();
	}
}


