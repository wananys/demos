#this、call和apply的用法

**call和apply**

ECAMScript3给Function的原型定义了两个方法，分别是`Function.prototype.call`和`Function.prototype.apply`。在实际开发中，特别是一些函数式风格的代码编写中，call和apply尤为重要。

<!--more-->

1.call和apply的区别
`Function.prototype.call`和`Function.prototype.apply`都是非常常用的方法，它们的作用一模一样，区别仅在于传入参数形式的不同。

apply接受**两个参数**，第一个参数指定了函数体内**this对象的指向**，第二个参数为一个**带下标的集合**，这个集合可以为数组，也可以为类数组，apply方法把这个集合中的元素作为参数传递给被调用的函数。

{% codeblock lang:javascript%}
var fun = function(a,b,c){
    alert([a,b,c]);//输出1,2,3
};
fun.apply(null,[1,2,3]);
{% endcodeblock %}

在这段代码中，参数1,2,3被放在数组中一起传入func函数，它们分别对应func参数列表中的a,b,c。
-------------------------------------------------------

call传入的参数**数量不固定**，跟apply相同的是，第一个参数也是代表函数体内的**this指向**，从第二个参数开始往后，每个参数被依次传入函数。

{% codeblock lang:javascript %}
var func= function(a,b,c){
    alert([a,b,c]);  //输出1,2,3
};
func.call(null,1,2,3,4);
{% endcodeblock %}

当调用一个函数时，javascript的解释器并不会计较形参和实参在**数量**、**类型**以及**顺序**上的区别，Javascript的参数在内部就是用一个数组来表示的。从这个意义上说，apply比call的使用率更高，我们不必关心具体有多少参数被传入函数，只要用apply一股脑地推过去就可以了。

如果我们明确地知道函数接受多少个参数，而且想一目了然地表达形参和实参的对应关系，那么也可以用call来传达参数。

>当使用call或apply时，如果我们传入的第一个参数为`null`，函数体内的this会指向默认的宿主对象，在浏览器中则是window。

{% codeblock lang:javascript %}
var func = function(a,b,c){
    alert(this == window);  //输出true 
};
func.apply(null,[1,2,3]);
{% endcodeblock %}

如果是在严格模式下，函数体内的this还是为null
>有时候我们使用call和apply的目的不在于指定this指向，而是另有用途，比如借用其他对象的方法，那么我们可以传入null来代替某个具体的对象：

`Math.max.apply(null,[1,2,5,3,4]);`

-----------------------------------------

2.call和apply的用途

1.改变this指向
来看个例子：
{% codeblock lang:javascript %}
var obj1 = {
    name : 'sven'
};
var obj2 = {
    name: 'anne'
};
window.name = "Window";
var getName = function(){
    alert(this.name);
};
		
getName();
getName.call(obj1);
getName.call(obj2);
{% endcodeblock %}
当执行getName.call(obj1)这句代码时，getName函数体内的this就指向obj1对象，所以此处的
{% codeblock lang:javascript %}
var getName = function(){
    alert(this.name);
};
{% endcodeblock %}
实际上相当于
{% codeblock lang:javascript%}
var getName = function(){
    alert(obj1.name);   //输出sven
};
{% endcodeblock %}
