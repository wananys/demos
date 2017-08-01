
$(function(){
	//我要出价
	$('#btn_my_price').on('click',function(){
		$(".view_wycj").show();
		$(".bg_cover").show();
	});

	// 关闭出价
	$("#close_cj").on("click",function(){
		$(".view_wycj").hide();
		$(".bg_cover").hide();
	});
	//打开教程
	$(".tutorial").on("click",function(){
		$("#step1").show();
	});
	$('#step1').on('click',function(){
		$(this).hide();
		$(".view_wycj").show();
		$(".bg_cover").show();
		$('#step2').show();
	});
	$('#step2').on('click',function(){
		$(this).hide();
		$('#step3').show();
	});
	$('#step3').on('click',function(){
		$(this).hide();
		$('#step4').show();
	});
	$('.mask_ok').on('click',function(){
		$('#step4').hide();
		$('#step5').show();
		$(".view_wycj").hide();
		$(".bg_cover").hide();
	});
	$('.mask_close').on('click',function(){
		$('#step5').hide();
	});

});

	
			
			
