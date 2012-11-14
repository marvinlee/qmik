/**
 * qmik工具插件 
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.0
 */
(function($){
	var doc=document,win=window,loc=location,
	regLongDate=/[ ]*[\d]{4}-[\d]{1,2}-[\d]{1,2}[ ][\d]{1,2}:[\d]{1,2}:[\d]{1,2}[ ]*/,
	regTime=/[ ]*[\d]{1,2}:[\d]{1,2}:[\d]{1,2}[ ]*/,regShortDate=/[ ]*[\d]{4}-[\d]{1,2}-[\d]{1,2}[ ]*/,
	regFmt=/(((y|Y){2,4}-M{1,2}-d{1,2}[ ])?h{1,2}:m{1,2}:s{1,2})|((y|Y){2,4}-M{1,2}-d{1,2}[ ](h{1,2}:m{1,2}:s{1,2})?)/,
	regYear=/(y|Y){2,4}/,dfmt="yyyy-MM-dd hh:mm:ss";
	Date.prototype.formate=function(fmt){
		fmt=fmt||dfmt;
		var o={
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(),    //day 
		"h+" : this.getHours(),   //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter 
		"S" : this.getMilliseconds() //millisecond 
		},y=regYear.exec(fmt);
		if(y)fmt=fmt.replace(y[0],(this.getUTCFullYear()+""));
		for(var k in o)
			if(new RegExp("("+ k +")").test(fmt)){
				fmt=fmt.replace(RegExp.$1,RegExp.$1.length==1?o[k]:("00"+ o[k]).substr((""+ o[k]).length))
			}
		return fmt
	}
	Date.prototype.toString=function(fmt){return this.formate(fmt)}
	String.prototype.toDate=function(){
		var r,v,f;
		v=this.replace(/[ ]+/," ");
		if(regLongDate.test(v)){
			r=v.split(/-|:|[ ]/);
			r=new Date(r[0]||0,((r[1]||1)-1),r[2]||0,r[3]||0,r[4]||0,r[5]||0);
			return r
		}
		if(regShortDate.test(v)){
			r=v.split(/-|:|[ ]/);
			r=new Date(r[0]||0,((r[1]||1)-1),r[2]||0,0,0,0);
			return r
		}
		if(regTime.test(v)){
			r=v.split(/-|:|[ ]/);
			f=new Date();
			r=new Date(f.getUTCFullYear(),f.getMonth(),f.getDate(),r[0]||0,r[1]||0,r[2]||0);
			return r			
		}
		throw new Error("string is not date formate!>"+this)
	}
	$.extend({
		util:{
			date:function(v,fmt){
				if($.isDate(v))return v.formate(fmt);
				else return v.toDate();
			},
			isIphone:function(){return /i(Phone|P(o|a)d)/.test(navigator.userAgent)&&typeof win.ontouchstart!=='undefined'},
			isAndroid:function(){return /Android/.test(navigator.userAgent)},
			//是否支持3d
			isSupport3D:function(){try{return $.util.isIphone&&'WebKitCSSMatrix' in win && 'm11' in new WebKitCSSMatrix()}catch(e){return false}},
			selectTxt:function(target,flag){//是否可选文本
				if($.isNull(flag)||flag)$(target).css({"-moz-user-select":"","-webkit-user-select":"","-o-user-select":"","user-select":""});
				else $(target).css({"-oz-user-select":"none","-webkit-user-select":"none","-o-user-select":"none","user-select":"none"});
			},
			cssCompatible:function(key,value){//对css样式做兼容处理,返回一个{}对象
				var r={};
				if($.isString(key)){
					key=$.parseJSON("{"+key+":"+value+"}");
				}
				$.each(key,function(k,v){
					r["-webkit-"+k]=v;
					r["-moz-"+k]=v;
					r["-ms-"+k]=v;
					r["-o-"+k]=v;
					r[k]=v;
				})
				return r
			}
		}
	})
})(Qmik);