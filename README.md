
Qmik是一个快速和精简的JavaScript库，简化了HTML文档，事件处理，以及Ajax交互。 
Qmik.sun 就按需加载模块,轻松实现按需要加载相应的js,css文件
Qmik的语法与jquery是一致的,核心库大小16-23k左右,支持uc,ie>=10,基于webkit内核的浏览器(如chrom,safari等),firefox; 
	推荐做移动web开发.
	
API简介:<br/><br/>



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
			
			merge(arr1,arr2) : merge,	// 合并数组或对象
			array(array) : //合并成一个新数组,
			inArray(value, array) : 在数组里的索引位,
			unique(array) : 数组去重,
			contains(grandfather, child) : 包含节点,
			map(array, callback) : //对数组里的内容,全部做一次数据映射转换,
			getScript(url, success, error) :  取得脚本
			getCss(url, success, error) :  取得css
			serialize(array) : 把数组序列化成 a=b&c=k 类型的字符串
			serializeArray(array) : 把数组转换成[{name:value},{name:value}]这种类型的数组,如果原数组里没有name,就抛弃此节点
			grep(array,callback):过滤

			param :  抽取数组里面每个元素的name和value属性,转换成一个url形式(a=b&name=g)的字符串,有做encode
			now([date]) :   当前时间
			delay(fun, time, target)  延迟执行,类似setTimeout,返回一个对象,对象有个 stop方法,用于停止执行
			// 
			/**
			 * fun:执行的方法
			 * cycleTime:执行的周期时间
			 * ttl:过期时间,执行时间>ttl时,停止执行,单位 ms(毫秒)
			 * target:apply,call的指向对象
			 */
			cycle(fun, cycleTime, ttl) :  周期执行,类似于setInterval,会返回一个对象,对象有个 stop方法,用于停止执行

			log(msg, event) : 打日志
			isIphone : 
			isAndroid :
			isWP : 
			isIE : 
			isFF : is Firefox
			isWK : is Webkit
			isOpera : 
			config(opts, _config) : 

			url(_url) : 合并url,if 参数 _url为空,则
			box(callback)  : 异常监控,发现异常,并把异常向服务器发送,需要执行$.config({box:{enable : true}})
			
			
2.查询api:支持下面的查询格式<br/><br/>



			$("#id")
			$(".class")
			$("ul")
			$("#id .class")
			$("#id > .class")
			$(".class div[flag=aaa]")	
	
	
	
<br/><br/>


3.按需加载例子:<br/><br/>


	a. Config.js 文件,写如下内容:
	
	
	
			(function($, define) {
				
				$.config({
					context : "/qmik/",// 配置Qmik工程的基础路径,如果没有配置,默认= location.protocol + "//" + location.hostname
					debug:true,//debug模式
					box:{	
						enable : true,//启用异常收集
						ttl : 20000,//收集时间间隔
						url : "/errorCollect" //收集地址
					}
				});
		
				// 定义模块名及请求路径
				$.sun.config({
					//别名系统,把路径抽象成一个key来表示,后续通过这个key来找到对应的url
					alias : {
						// qmik组件
						"Qmik.nav" : $.url("/assets/plugins/Qmik.nav"),//
						///
						//业务模块
						"Home" : "module/home/Home",
					},
					preload : [//预加载,在加载其它模块前,最优先加载下面定义的模块
						"Qmik.nav"
					]
				});
			})(Qmik, Qmik.sun.define);
	
	
	b.在index.html页面引入js<br/><br/>
	
	
	
			<!-- 加载框架 -->
			<script type="text/javascript" src="/xxxx/Qmik.js"></script>
			<!-- 加载配置文件 -->
			<script type="text/javascript" src="/xxxx/Config.js"></script>
  
  
  
  c.实现Home业务模块功能
  
  
  
  		(function($, define) {
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

				define(function(require, exports, module) {
					var nav = require("Nav");//依赖导航模块
					exports=new Home(nav);
				});
			})(Qmik, Qmik.sun.define);
			
		
			
	 d.使用模块,在index.html使用 Home模块功能.  在index.html的尾部加入如下代码:
	 
	 
	 
		 	<script type="text/javascript">
				// 界面初始化 
				(function($, define) {
					//依赖3个模块初始化
					$.use([
						"Nav", "Home"
					], function(nav, home) {
							nav.doxxx();//显示头部导航
							home.showHome();//显示首页
					});
				})(Qmik, Qmik.define);
			</script>
			
			
			
			
			
			
4.下载源码,自定义构建(构建时,只能选择src目录下的文件合并成一个Qmik.js,不能包含plugins等其它目录)

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
			 				