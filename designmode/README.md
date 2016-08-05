#this、call和apply的用法

**this**的指向
除去不常用的with和eval的情况，大致可以分为以下4种情况：
1.作为对象的方法
2.作为普通函数调用
3.构造器调用
4.Function.prototype.call或Function.prototype.apply调用。

-------------------------------------------

1.作为对象的方法调用
当函数作为对象的方法被调用时，this指向**该对象**。
{% codeblock lang:javascript %}
var obj = {
    a:1,
    getA: function(){
        alert(this === obj); //输出：true
        alert(this.a);  //输出：1
    }
}
obj.getA();
{% endcodeblock %}

2.作为普通函数调用
当函数不作为对象的属性被调用时，也就是我们常说的普通函数方式，此时的this总是指向**全局对象**。
在浏览器的Javascript里，这个全局对象是**window对象**。

{% codeblock lang:javascript %}
window.name = "globalName";
var getName = function(){
    return this.name;
};
console.log(getName());  //输出:globalName
{% endcodeblock %}

{% codeblock lang:javascript %}
window.name = "globalName";
		
var myObject = {
    name:'sven',
    getName: function(){
        return this.name;
    }
}
var getName = myObject.getName;
console.log(getName());  //输出:globalName
console.log(myObject.getName());  //输出： sven
{% endcodeblock %}

有时候我们会遇到一些困扰，比如在div节点的事件函数内部，有一个局部的callback方法，callback被作为普通函数调用时，callback内部的this指向了window，但我们往往是想让它指向该div节点，代码如下：
{% codeblock %}
<html>
  <body>
    <div id="div1">我是一个div</div>
  </body>
  <script>
    window.id = "window";
    document.getElementById('div1').onclick = function(){
        alert(this.id);  //输出： div1
        var callback = function(){
            alert(this.id);  //输出window
        }
        callback();
    }
  </script>
</html>
{% endcodeblock %}
此时有一种简单的解决方案，可以用一个**变量**保存div节点的引用：

{% codeblock lang:javascript %}
window.id = "window";
document.getElementById('div1').onclick = function(){
    alert(this.id);  //输出： div1
    var callback = function(){
        alert(this.id);  //输出window
    }
    callback();
}
{% endcodeblock %}

>在ECMAScript5的strict模式下，这种情况下的this已经被规定为不会指向全局对象，而是**undefine**。


3.构造器调用
javascript没有类，但是可以从构造器中创建对象，同时提供了new运算符，使构造器看起来像一个类。
除了宿主提供的一些内置函数，大部分javascript函数都可以当做构造器使用。
构造器的外表跟普通函数一模一样，它们的区别在于被调用的方式。
当用new运算符调用函数时，该函数总会返回一个对象，通常情况下，构造器里的this就指向**返回的这个对象**。
{% codeblock lang:javascript %}
var MyClass = function(){
    this.name = "sven";
}
var obj = new MyClass();
console.log(obj.name);  //输出：sven
{% endcodeblock %}

注意：如果构造器显式地返回了一个**object类型**的对象，那么此次运算结果最终会返回这个对象。
{% codeblock lang:javascript %}
var MyClass = function(){
    this.name = "sven";
    return{
        name: 'anne'
    }
}
var obj = new MyClass();
console.log(obj.name);  //输出：anne
{% endcodeblock %}

如果**不显式**地返回任何数据（即第一种情况）,或者返回一个**非对象类型**的数据（如下），就不会造成这个问题。
{% codeblock lang:javascript %}
var MyClass = function(){
    this.name = "sven";
    return 'anne';
}
var obj = new MyClass();
console.log(obj.name);  //输出：sven
{% endcodeblock %}

4.Function.prototype.call或Function.prototype.apply调用
跟普通的函数调用相比，这两个方法可以**动态改变**传入函数的this。
{% codeblock lang:javascript %}
var obj1 = {
    name: 'sven',
    getName: function(){
        return this.name;
    }
};
var obj2 = {
    name: 'anne'
};
console.log(obj1.getName());  //输出： sven
console.log(obj1.getName.call(obj2));  //输出： anne
{% endcodeblock %}
