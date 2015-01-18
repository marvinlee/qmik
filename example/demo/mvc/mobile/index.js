(function($){
	$.app().ctrl({
		model2002122: function(scope){
			getData(function(data){
				var model = data.content.model2002122;
				scope.model = model;
				scope.list = model.itemList;
				scope.apply();
			});
		},
		model2002119: function(scope){
			getData(function(data){
				var model = data.content.model2002119;
				scope.model = model;
				scope.itemLeft = model.itemList[0];
				scope.itemCenter = model.itemList[1];
				scope.brand = model.itemList[2];
				scope.apply();
			});
		},
		model2002111: function(scope){
			getData(function(data){
				var model = data.content.model2002111;
				scope.model = model;
				scope.item = model.itemList[0];
				var time = $.now() + 72000*1000;
				$.cycle(function(){
					var diff = parseInt( (time - $.now())/1000);
					var hh = to2Bit(parseInt(diff / 3600));
					var mm = to2Bit(parseInt(( diff%3600 ) / 60));
					var ss = to2Bit(diff % 60);
					model.h1 = hh.substring(0,1);
					model.h2 = hh.substring(1);
					model.m1 = mm.substring(0,1);
					model.m2 = mm.substring(1);
					model.s1 = ss.substring(0,1);
					model.s2 = ss.substring(1);
					scope.apply(["model.h1","model.h2","model.m1","model.m2","model.s1","model.s2"]);
				}, 1000);
				scope.apply();
			});
		},
		model2002112: function(scope){
			getData(function(data){
				var model = data.content.model2002112;
				scope.model = model;
				scope.list = model.itemList;
				scope.apply();
			});
		},
		model2002115: function(scope){
			getData(function(data){
				var model = data.content.model2002115;
				scope.model = model;
				scope.list = model.itemList;
				scope.apply();
			});
		},
		model2002123: function(scope){
			getData(function(data){
				var model = data.content.model2002123;
				scope.model = model;
				scope.list = model.itemList;
				scope.apply();
			});
		},
		model2002116: function(scope){
			getData(function(data){
				var model = data.content.model2002116;
				scope.model = model;
				scope.list = model.itemList;
				scope.apply();
			});
		},
		model2002110: function(scope){
			getData(function(data){
				var model = data.content.model2002110;
				console.log(model)
				scope.model = model;
				scope.list = model.itemList;
				console.log(scope)
				scope.apply();
			});
		}
	});
	function to2Bit(val){
		return val < 10 ? "0"+val : ""+val
	}
	function getData(callback){
		if(getData.data){
			return callback && callback(getData.data);
		}
		$.use("data.js?"+$.now(), function(data){
			getData.data = data;
			callback && callback(getData.data);
		})
	}
})(Qmik);