(function(){
	function Page1(){

	}
	$.extend(Page1.prototype,{
		show:function(){
			$("#show").html("hahaha 欢迎来到页面1   >>>>>>>>>>.");	
		}
	});
	$.sun.define(function(require,exports,module){
		module.exports=new Page1();
	});
})();