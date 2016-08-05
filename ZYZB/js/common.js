//通用js

$(document).ready(function(){
	/**
	 * 顶部菜单
	 */
	$('.menus li').on('mouseover',function(){
		var _this = $(this);
		var more = _this.data('more');
		if(more === 'more'){
			_this.children('.submenu').removeClass('none');
		}
	}).on('mouseout',function(){
		var _this = $(this);
		var more = _this.data('more');
		if(more === 'more'){
			_this.children('.submenu').addClass('none');
		}
	});
	
	/**
	 * 返回顶部
	 */
	var offset = 220;
	var duration = 500;
	
	$(window).scroll(function() {
		if ($(this).scrollTop() > offset) {
			$('.to-top').fadeIn(duration);
	 	} else {
	  	$('.to-top').fadeOut(duration);
		}
	});
	
	$(".to-top").on("click",function(){
	    $("html body").animate({
	    	scrollTop:0
		},500);
	});
});



