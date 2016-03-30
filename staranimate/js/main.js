/**
 * Created by jason on 15-6-3.
 */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();
var starPic = new Image();
//var girlPic = new Image();

var stars = [];
var canvasDom,
    context;

var alive = 0;
var switchy = true;

var startNum = 30;
var deltaTime;
var lastTime;

var demo = {
    init:function(){
        starPic.src = "images/star.png";
        //girlPic.src = "images/girl.jpg";
        var _this = this;
        //第一步：获取canvas元素
         canvasDom = document.getElementById("canvas");
        //第二步：获取上下文
         context = canvasDom.getContext('2d');

        for (var i = 0; i < startNum; i++) {
            stars[i] = new start({});
            stars[i].init();
        }
        lastTime = Date.now();
        //girlPic.onload = function(){
         _this.gameLoop();
        //}
    },
    gameLoop:function(){
        var _this = this;
        var meCall =  arguments.callee;
        window.requestAnimFrame(function(){
            meCall.call(demo);
        });
        var now = Date.now();
        deltaTime = now - lastTime;
        lastTime = now;

        _this.fillCanvas();
        //_this.drawGirl(girlPic);
       _this.drawStars(context);
       _this.aliveUpdate();
    },
    fillCanvas:function(){
        //第三步：指定填充线样式颜色
         context.fillStyle = "#393550";
        //第四步：填充矩形。
        context.fillRect(0,0,canvasDom.width,canvasDom.height);
    },
    drawGirl:function(girl){
        context.drawImage(girl, 100, 100, 600, 300);
    },
    drawStars:function(ctx){
        for (var i = 0; i < startNum; i++) {
            stars[i].update();
            stars[i].draw(ctx);
        }
    },
    aliveUpdate:function(){
        if (switchy) {
            alive += 0.03;
            if (alive > 1) {
                alive = 1;
            }
        } else {
            alive -= 0.03;
            if (alive < 0) {
                alive = 0;
            }
        }
    }
}

function start(config){

    this.config = {
        imgWidth:config.imgWidth || 640,
        imgHeight:config.imgHeight || 1136,
        paddingLeft:config.paddingLeft || 0,
        paddingTop:config.paddingTop || 0
    }

    this.x;
    this.y;

    this.xSpd;
    this.ySpd;

    this.picNo;

    this.timer;

    this.beta;

    this.init = function(){
        this.x = Math.random() * this.config.imgWidth + this.config.paddingLeft ;
        this.y = Math.random() * this.config.imgHeight + this.config.paddingTop ;

        this.xSpd = Math.random() * 0.5 - 0.2;
        this.ySpd = Math.random() * 0.6 - 0.3;


        this.picNo = Math.floor(Math.random() * 7);
        this.timer = 0;

        this.beta = Math.random() * Math.PI * 0.5;
    }
    this.draw = function(ctx){//画星星
        ctx.save();
        ctx.globalAlpha = Math.sin(this.beta) * alive;
        ctx.drawImage(starPic, this.picNo*7, 0, 7, 7, this.x, this.y, 7, 7);
        ctx.restore();
    }

    this.update = function(){
        this.xSpd = Math.random() * 0.2 - 0.1;
        this.x += this.xSpd;
        this.y += this.ySpd;

        if (this.x > (this.config.paddingLeft + this.config.imgWidth) || this.x < (this.config.paddingLeft - 10)){
            this.init();
        }else if (this.y > (this.config.paddingTop + this.config.imgHeight) || this.y < (this.config.paddingTop - 10)){
            this.init();
        }
        this.timer += deltaTime;
        if (this.timer > 30) {
            this.picNo += 1;
            this.picNo %= 7;
            this.timer = 0;
        }
    }
}


window.onload = function(){
    demo.init();
}