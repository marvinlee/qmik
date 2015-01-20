(function($) {
	var data = {
		desc: {
			"list": [{
				"title": "核心模块",
				"desc": "提供核心的基础方法"
			},{
				title: '查询模块',
				desc: '提供dom节点检索功能,与jquery的语法一致'
			},{
				title: 'sun模块开发',
				desc: '提供模块开发功能,基本遵从cmd,amd的使用规范,与seajs使用一致,相当于简化版本,利用此功能,可以做到很好的代码管理'
			},{
				title: 'mvc开发模式',
				desc: '使前端的各个层之间分开,让业务代码90%不用去关心页面的dom布局,提高50%的开发效率,降低50%的维护成本,完全遵从于面面数据接口编程'
			},{
				title: 'ajax模块',
				desc: 'ajax数据通信模块'
			},{
				title: 'event模块',
				desc:  'event事件模块'
			}]
		},
		use: {
			list: [{
				title: 'Qmik 2.0 开始移除了所有标准属性的浏览器前缀，构建时通过 AutoPrefixer 自动添加。当前的 AutoPrefixer 浏览器支持设置为：',
				code: '[<span class="hljs-string">"ie &gt;= 8"</span>,\
					  <span class="hljs-string">"ie_mob &gt;= 10"</span>,\
				      <span class="hljs-string">"ff &gt;= 30"</span>,\
				      <span class="hljs-string">"chrome &gt;= 34"</span>,\
				      <span class="hljs-string">"safari &gt;= 7"</span>,\
				      <span class="hljs-string">"opera &gt;= 23"</span>,\
				      <span class="hljs-string">"ios &gt;= 7"</span>,\
				      <span class="hljs-string">"android &gt;= 2.3"</span>,\
				      <span class="hljs-string">"bb &gt;= 10"</span>\
				    ]'
			}]
		}
		
	};
	//导出对象
	define(function() {
		return data;
	});
	//
})(Qmik);