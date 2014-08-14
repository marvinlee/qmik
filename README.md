## 关于Qmik

Qmik是一个快速和精简且功能强大的无线端JavaScript库,核心库大小22kb,gzip=8kb,

入门极期简单,只要你使用过jquery(jquery的语法),是在无线端替换jquery,zepto,seajs,task任务处理等的理想框架,

集成了[模块开发](https://github.com/leochen36/qmik/wiki/sun-%E6%A8%A1%E5%9D%97%E5%BC%80%E5%8F%91), 
[插件开发](https://github.com/leochen36/qmik/wiki/%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91)的核心架构
(推荐使用模块开发模式,不推荐使用插件模式,插件模式会破坏框架的代码结构)

简化了dom查询,事件,ajax通讯等的使用,

html[局部渲染](https://github.com/leochen36/qmik/wiki/$.render-%E5%B1%80%E9%83%A8%E6%B8%B2%E6%9F%93)
内核($.render)

任务队列处理内核(
[$.series](https://github.com/leochen36/qmik/wiki/$.series-%E4%B8%B2%E8%A1%8C%E4%BB%BB%E5%8A%A1%E5%A4%84%E7%90%86),
[$.parallel](https://github.com/leochen36/qmik/wiki/$.parallel-%E5%B9%B6%E8%A1%8C%E4%BB%BB%E5%8A%A1%E5%A4%84%E7%90%86))

支持uc,ie>=9,基于webkit内核的浏览器(如chrom,safari等),firefox; 推荐做移动web开发.


## 应用场景

天猫2013双11(亿级pv)

天猫无线一系列大促活动(亿级pv,千万uv,投放入口有淘宝客户端,天猫客户端,无线浏览器等)

天猫无线喵一眼,头条等频道及无线模板

天猫ipad客户端

深圳宜搜科技(音乐频道等,百万uv)

其它公司朋友的使用


## html5无线开发的一些心得

在传统的web开发下,由于网速快,pc性能强,在一些需要前端渲染地方,引入了前端的渲染引擎,
var h=[];
h.push('<div>');
h.push('.....');
h.push('</div>');
这当然远离了上面这种很不友好的前端渲染页面的方式,如:(AngularJS,ejs,jade等等渲染引擎,或具有此功能的框架)

造成的问题:
    h5体验下降的厉害

问题分析:
    1.无线网速偏慢(虽然有wifi,但是我们也要适当照顾下2g的用户),造成.js资源加载耗时大大增长(x00%的增长),
        阻塞页面加载,代码执行时长大大增加

    2.手机性能比较低(iphone还好些,android就惨不忍睹(平台分裂,硬件相差太大)),
        解析模版源码的时长就变长

    3. 以上两点就大大拖累了体验

所以在qmik1.3版本里,增加了局部渲染的功能$.render,这个渲染采用了json的方式,解放了去解析模版源码性能问题,
    且不用加载别的框架,减少了http的请求


## 版本记录
增加1.3.50版本: 
    修复sun模块加载远程模块代码可能出现的异常
    优化模板渲染机制,使用各简洁
    添加fn.appendTo,fn.afterTo,fn.beforeTo;


增加1.3.20版本, 此版本优化的局部渲染机制 $.render 的使用,
1.取消tag必须为 div[]的格式限制,tag:选填,有填必须符合正则(^\s*\w+\s*(\[.*\])?\s*$),
2.取消text对输入< >符号的转换(这种代码安全的检验应该在数据输入时就做了,,放开后的好处是更加方便节点的拼装,
原先只能输入innerText类内容,现在可以输入任意的内容,如果:<div><span>hello</span></div> 这样更加容易生成节点)
3.增加模块加载定义时对return的支持:如:
```
$.define("demo",function(require, exports, module){
    module.exports = {name:"exports"};
    return {name:"leo"};//等于 module.exports = {name:"leo"}
});

```

增加1.3.10版本,,,此版本对sun模块的加载机制进行了调整,影响:新版本如果页面代码里已定义模块名:如 lib/qmik/Store,
在新版本中,如果定义了别名
$.sun.config({
    alias: {
        "lib/qmik/Store":"http://xxx.com/xxx/store.js"
    }
});
那么新版本开始会认为 别名 "lib/qmik/Store" 就是模块名,会优先以模块名进行加载模块,如果加载不到,再去请求对应的js文件,
老版本认为是不一样,在实际使用中及反馈中,应该把二者统一为一样


增加1.3.01大版本, 
    增加html局部渲染功能$.render(htmljson, data),
    任务进度处理模块$.task,有$.series(串行执行), $.parallel(并行执行),
    方法执行,不抛出异常:$.execCatch(fun,args,error);
    废弃不推荐的方法$.fn.animate,$.fn.hover;

增加1.2.36版本,可调试性

增加1.2.35版本,增强sun模块可调试性

增加1.2.33版本,增强稳定性,兼容性

增加1.2.32版本:增强sun模块的稳定性,防止多重依赖时,一个模块异常,造成其它模块不能正常加载

增加1.2.31版本:1优化了模块加载异常的日志信息打印,对节点的after,before调整为直接对本节点操作,不clone节点

增加1.2.30版本:1.优化sun模板,修复并优化getScript的回调策略

增加1.2.23版本:1.增加高清屏的判断 Qmik.isRetinal, 2.修复部分文本添加会造成的bug

增加1.2.22版本, 1.优化并解决查询(closest)的bug

增加1.2.20版本, 1.优化了查询,大幅提升了查询的性能, 2.减小了核心版本的体积,合并后减小到20.7k了,gzip在8k左右. 3.增强了了fn.live委托事件的功能,ie测试最低从ie9开始 4.增加了一个滚动插件Qmik.fn.scrollBar.js 5.增加了一个前进后退插件Qmik.nav.js,Qmik.nav插件依赖核心sun功能

1.2.16版本 修复: 1.sun模块对部分浏览器加载的bug 2.getJSON 少传data参数造成的bug

## API简介:


        encode(value) :等同于encodeURIComponent
        decode(value) :decodeURIComponent ,
        isBool(value) : 布尔判断,
        isString(value) : 字符串判断,
        isFun(value) : 方法判断,
        isFunction(value) : 方法判断,
        isNum(value) :整形判断 ,
        isNumber : 整形判断,
        isArray(value) : 数组判断,
        isNull(value) : 空指针判断,
        isRetinal() : 判断是否是高清屏,默认是高清屏
        likeArray(value) : 像数组,有length字段等一些属性,
        each(value,function(i,val){}) : 循环,
        stringify(value) : json转字符串,
        parseJSON(value) : 字符串转json,
        likeArray(value) : 像数组
        isDate(value) :,
        isObject(value) : ,
        isPlainObject(value) : 
        likeNull(value) : 像空值,如 "","null","undefined",null等会被认为True,
        inherit(subClass, superClass) : 继承类 子类subClass继承父类superClass的属性方法, 注:子类有父类的属性及方法时,不会被父类替换,
        trim(value) :,
        toLower(value) :字符串小写,
        toUpper(value) : 大写,

        merge(arr1,arr2) : merge,   // 合并数组或对象
        array(array) : //合并成一个新数组,
        inArray(value, array) : 在数组里的索引位,
        unique(array) : 数组去重,
        map(array, callback) : //对数组里的内容,全部做一次数据映射转换,
        getScript(url, success, error) :  取得脚本
        getCss(url, success, error) :  取得css
        grep(array,callback):过滤

        param :  抽取数组里面每个元素的name和value属性,转换成一个url形式(a=b&name=g)的字符串,有做encode
        now([date]) :   当前时间
        delay(fun, time,...)  延迟执行,类似setTimeout,返回一个对象,对象有个 stop方法,用于停止执行,...表示要传输的参数,如:$.delay(function(a1,a2){},1000,1,2);//1 对应 a1,2对应 a2
        // 
        /**
         * fun:执行的方法
         * cycleTime:执行的周期时间
         * ttl:过期时间,执行时间>ttl时,停止执行,单位 ms(毫秒)
         * ,...表示要传输的参数 $.cycle(function(a1,a2){},1000,30000,1,2);//1 对应 a1,2对应 a2
         */
        cycle(fun, cycleTime, ttl,...) :  周期执行,类似于setInterval,会返回一个对象,对象有个 stop方法,用于停止执行

        log(msg, event) : 打日志
        isIphone() : 
        isAndroid() :
        isWP() : 
        isIE() : 
        isFF() : is Firefox
        isWK() : is Webkit
        isOpera : 
        config(opts, _config) : 

        url(_url) : 合并url,if 参数 _url为空,则

        ajax:function({
            dataType:'json'|'text'|'jsonp',
            async:bool,
            type: 'get'|'post'
            success,function(data){},
            error:function(){}
        });
        render: function(struct, data), 
            //参数说明:
            struct:{
                tag:'div[name="testdiv" class="show" time="${time}"]',
                text:'显示的文件',//如果<div>显示的文件</div>
                child:[//子节点,tag:是用来描述标签及属性的(如果有子节点child,则一定要有tag,text:输出innerText文本的)
                    {
                        tag:'p[name="title"]',
                        text:'title',
                        child:[
                            {
                                tag:'span[class='remark']',
                                text:'remark'
                            },{
                                text:' xxxxxx'
                            }
                        ]
                    }
                ]
            }
            data:{
                time:'haha' //这个参数在htmljson里通过  ${time} 来引用
            }
        
        series:function(tasks, callback)//串行执行任务列队,如果有输出参数,则前一个任务输出参数给下一个任务
                //例子,tasks:任务方法数组,callback:执行完任务后,回调
                $.series([
                    function(callback){//callback:function(err, exports){}
                        var m = {};
                        callback(null, m);
                    },
                    function(callback, val){
                        callback(null, {name:"leo"});
                    },
                    function(callback, val){
                        callback(null, {name:"leo"});
                    }
                ],function(err, exports){
                    //全部执行完,回调
                });
        parallel:function(tasks, callback)//并行执行任务列队,当中有任务执行出错,不影响其它任务的执行
                //例子:tasks:任务方法数组, callback:执行完任务后,回调
                $.parallel([
                    function(callback){//callback: function(){}
                        callback();
                    },
                    function(callback){
                        callback();
                    }
                ],function(){
                    //全部执行完,回调
                });
            execCatch:function(fun, args, error)
                //执行方法并捕获异常,不向外抛出异常,try{}catch(e){} 影响代码的美观性
                fun:执行方法
                args:数组,参数[]
                error:抛出异常回调,无异常不回调
查询api:支持下面的查询格式


        $("#id") 
        $(".class")
        $("ul")
        $("#id .class")
        $("#id > .class")
        $(".class div[flag=aaa]")   
Qmik.fn api(即 $("#id").api)


        last : function() :最后一个
        eq : function(i)    :指定位置
        first : function()  :第一个
        filter : function(f) :过滤选择
        even : function()   :偶数个
        odd : function()    :奇数个
        gt : function(i) :
        lt : function(i) :
        find : function(s) 
        each : function(f)
        append : function(c)
        remove : function()
        before : function(c) 
        after : function(c)
        html : function(v)
        empty : function() 
        text : function(v) 
        addClass : function(n) 
        rmClass : function(n)  == removeClass
        show : function()
        hide : function() 
        toggle : function()
        toggleClass : function(className)
        map : function(callback)
        css : function(k, v) 
        attr : function(k, v) 
        rmAttr : function(k)    == removeAttr
        removeAttr : function(k)
        data : function(k, v) 
        rmData : function(k) == removeData
        val : function(v)

        next : function(selector) //下一个指定元素
        prev : function(selector) //上一个指定元素
        clone : function(bool) 
        hover : function(fin, fout) 
        hasClass : function(c) 
        closest : function(selector) //查找最近的匹配的父(祖父)节点
        parents : function(selector) 
        parent : function(selector) 
        children : function(selector)

        width:function();//宽度
        height:function()//高度
        offset:function() //return {top:xx,left:xx} 获取匹配元素在当前视口的相对偏移
        position:function() //return {top:xx,left:xx}获取匹配元素相对父元素的偏移

## 按需加载例子:

$.sun.use(["module1","module2"],function(module1,module2){}); $.sun.define(function(require, exports, module){}); $.sun.config();

a. Config.js 文件,写如下内容:



        (function($) {

            $.config({
                context : "/",// 配置工程的访问路径,如果没有配置,默认= /
                debug:true//debug模式
            });

            // 定义模块名及请求路径
            $.sun.config({
                //别名系统,把路径抽象成一个key来表示,后续通过这个key来找到对应的url
                alias : {
                    // qmik组件
                    "Qmik.nav" : $.url("/assets/plugins/Qmik.nav.js"),//
                    ///
                    //业务模块
                    "Home" : "module/home/Home.js",
                },
                preload : [//预加载,在加载其它模块前,最优先加载下面定义的模块
                    "Qmik.nav"
                ]
            });
        })(Qmik);


b.在index.html页面引入js<br/><br/>



        <!-- 加载框架 -->
        <script type="text/javascript" src="/xxxx/Qmik.js"></script>
        <!-- 加载配置文件 -->
        <script type="text/javascript" src="/xxxx/Config.js"></script>
c.实现Home业务模块功能

    (function($) {
        function Home(nav){
            this.nav=nav;
        }
        Home.prototype.showHome=function(){
                var me=this;
                var main = $("#main_module");
                    $.get("module/home/home.html", function(data) {
                        main.html(data);//填充内容
                        me.doxxx();
                    });
        }

            Q.sun.define(function(require, exports, module) {
                var nav = require("Nav");//依赖导航模块
                exports=new Home(nav);
            });
        })(Qmik);



 d.使用模块,在index.html使用 Home模块功能.  在index.html的尾部加入如下代码:



        <script type="text/javascript">
            // 界面初始化 
            (function($) {
                //依赖3个模块初始化
                $.sun.use([
                    "Nav", "Home"
                ], function(nav, home) {
                        nav.doxxx();//显示头部导航
                        home.showHome();//显示首页
                });
            })(Qmik);
        </script>


## 模板渲染例子:
var list=[
    {id:'a3',title:'ww',price:100},
    {id:'a4',title:'nn',price:178}
];
$({
    tag:'div[class="bg"]',
    child:[
        {
            tag:'span[class="tm" style="display:inline-block; padding:5px"]',
            text:'价格'
        },{
            tag:'span[class="tm" style="display:inline-block padding:5px"]',
            text:'18很小呀'
        },{
            tag:'span[class="tm" style="display:inline-block padding:5px"]',
            text:'24'
        }
    ],
    exec: function(){
      var me = this;
        $.each(list, function(i, item){
            me.add({
                tag:'i[]',
                text:'价格:${price}'
            }, item);
        });
    }
}).on({
    click:function(e){
        console.log(e.target);
        var qt = $( e.target ).closest(".bg");
        var me = $(this);
        console.log( me.data("name") );
    }
}).appendTo($("body")).data({
    name:'leo'
})




## 下载源码,自定义构建(构建时,只能选择src目录下的文件合并成一个Qmik.js,不能包含plugins等其它目录)

    1.安装github客户端,需要使用到git-shell  (http://windows.github.com/)
    2.下载 nodejs ,安装 ,http://nodejs.org/
    3. 把nodejs的bin配置到path里,(已经自带了npm)
    4.运行Git Shell,进入下载下来的源码地址,如果d:/download/qmik/
            执行命令:
                    npm uninstall -g grunt  卸载 
                npm install -g grunt-cli  (把安装完后的grunt指令添加到 path里 C:\Users\xxx\AppData\Roaming\npm)
                        npm install grunt-contrib-uglify  安装uglify 
                        npm install  grunt-contrib-cssmin  安装cssmin
                        npm install  grunt-contrib-qunit  安装cssmin
                        npm install  grunt-contrib-concat 安装cssmin
                        npm install  grunt-contrib-clean  安装cssmin

         安装完成后,进入目录,执行  grunt命令,开始自动构建,构建代码后的代码放在 assets 目录下


## Copyright

© 2011 - 2014 leo(cwq0312@163.com)  版权所有 , 遵从BSD开源协议


