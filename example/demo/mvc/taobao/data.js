(function() {

	var user = {
		nick: "leo",
		msgCount: 1,
		shoppingCount: 3,
	};
	var search = {
		q: '方便随时随地打盹的“环形午睡枕”'
	};

	var teshe = {
		theme: [{
			"title": "淘宝女人",
			"href": "http://nvren.taobao.com/"
		}, {
			"title": "运动派",
			"href": "http://www.taobao.com/market/sport/citiao/yundongpai.php"
		}, {
			"title": "情侣",
			"href": "http://qinglv.taobao.com/"
		}, {
			"title": "淘宝男人",
			"href": "http://nanren.taobao.com/"
		}, {
			"title": "孕婴童",
			"href": "http://www.taobao.com/market/baobao/2014/index.php"
		}, {
			"title": "家居",
			"href": "http://www.taobao.com/market/home/2014/index.php"
		}, {
			"title": "美容护肤",
			"href": "http://www.taobao.com/market/mei/index.php"
		}, {
			"title": "中老年",
			"href": "http://zln.taobao.com/"
		}, {
			"title": "美食",
			"href": "http://chi.taobao.com/"
		}, {
			"title": "保险理财",
			"href": "http://bxlc.taobao.com/"
		}, {
			"title": "有车族",
			"href": "http://www.taobao.com/market/car/index.php"
		}, {
			"title": "装修",
			"href": "http://www.taobao.com/market/jia/2014index.php"
		}, {
			"title": "手机数码",
			"href": "http://www.taobao.com/market/3c/home.php"
		}, {
			"title": "生活家",
			"href": "http://shenghuo.taobao.com/"
		}, {
			"title": "游戏",
			"href": "http://game.taobao.com/"
		}],
		teshe: [{
			"title": "淘宝二手",
			"href": "http://2.taobao.com/"
		}, {
			"title": "拍卖会",
			"href": "http://paimai.taobao.com/"
		}, {
			"title": "爱逛街",
			"href": "http://guang.taobao.com/"
		}, {
			"title": "淘宝奇葩",
			"href": "http://tese.taobao.com/"
		}, {
			"title": "全球购",
			"href": "http://g.taobao.com/"
		}, {
			"title": "挑食",
			"href": "http://tiaoshi.chi.taobao.com/"
		}, {
			"title": "淘宝同学",
			"href": "http://xue.taobao.com/"
		}, {
			"title": "淘女郎",
			"href": "http://mm.taobao.com/"
		}, {
			"title": "星店",
			"href": "http://star.taobao.com/"
		}, {
			"title": "淘宝众筹",
			"href": "http://hi.taobao.com/"
		}, {
			"title": "B格",
			"href": "http://big.taobao.com/big/index.html"
		}, {
			"title": "动漫",
			"href": "http://acg.taobao.com/"
		}, {
			"title": "淘宝达人",
			"href": "http://daren.taobao.com/"
		}, {
			"title": "腔调",
			"href": "http://style.taobao.com/"
		}, {
			"title": "逛搭配",
			"href": "http://dapei.taobao.com/"
		}, {
			"title": "生活服务",
			"href": "http://life.taobao.com/"
		}],
		youhui: [{
			"title": "天天特价",
			"href": "http://tejia.taobao.com/"
		}, {
			"title": "免费试用",
			"href": "http://try.taobao.com/"
		}, {
			"title": "清仓",
			"href": "http://qing.taobao.com/"
		}, {
			"title": "一元起拍",
			"href": "http://qiang.taobao.com/"
		}, {
			"title": "淘金币",
			"href": "http://taojinbi.taobao.com/"
		}, {
			"title": "夜抢购",
			"href": "http://ye.taobao.com/"
		}],
		tool: [{
			"title": "阿里旺旺",
			"href": "http://wangwang.taobao.com/"
		}, {
			"title": "支付宝",
			"href": "https://www.alipay.com/"
		}, {
			"title": "来往",
			"href": "http://www.laiwang.com/"
		}]
	};

	var main = {
		promo: [{
			"url": " http://gtms03.alicdn.com/tps/i3/TB1V2uaHXXXXXbHXVXXvKyzTVXX-520-280.jpg ",
			"href": " http://www.taobao.com/market/paimai/act/zspmj.php?pos=1 "
		}, {
			"url": " http://gtms01.alicdn.com/tps/i1/TB1jIFGHXXXXXb_XVXXvKyzTVXX-520-280.jpg ",
			"href": " http://www.taobao.com/market/try/jyxs2015.php?pos=1 "
		}, {
			"url": " http://i.mmcdn.cn/simba/img/TB1m_d1HXXXXXatXFXXSutbFXXX.jpg ",
			"href": " http://click.mz.simba.taobao.com/ecpm?u=http%3A%2F%2Fxuezhongfei.tmall.com&k=225 "
		}, {
			"url": " http://i.mmcdn.cn/simba/img/TB1toX6HXXXXXbbaXXXSutbFXXX.jpg ",
			"href": " http://click.mz.simba.taobao.com/ecpm?u=http%3A%2F%2Fbosideng.tmall.com&k=225 "
		}, {
			"url": " http://i.mmcdn.cn/simba/img/TB1u9fCGVXXXXb5XpXXSutbFXXX.jpg ",
			"href": " http://click.mz.simba.taobao.com/ecpm?k=225 "
		}, {
			"url": " http://gtms03.alicdn.com/tps/i3/TB1V2uaHXXXXXbHXVXXvKyzTVXX-520-280.jpg ",
			"href": " http://www.taobao.com/market/paimai/act/zspmj.php?pos=1 "
		}, {
			"url": " http://gtms01.alicdn.com/tps/i1/TB1jIFGHXXXXXb_XVXXvKyzTVXX-520-280.jpg ",
			"href": " http://www.taobao.com/market/try/jyxs2015.php?pos=1"
		}],
		tmall: [{
			"url": " http://i.mmcdn.cn/simba/img/TB1TE0AGXXXXXXJXXXXSutbFXXX.jpg ",
			"href": " http://click.mz.simba.taobao.com/ecpm"
		}, {
			"url": " http://gtms01.alicdn.com/tps/i1/TB1DGvOGVXXXXX0apXXc8PZ9XXX-130-200.png ",
			"href": " http://nianhuo.tmall.com/"
		}, {
			"url": " http://gtms02.alicdn.com/tps/i2/TB1S2XVHXXXXXaSXFXXc8PZ9XXX-130-200.png ",
			"href": " http://www.tmall.com/go/market/fushi/xinzhongzhuang.php"
		}, {
			"url": " http://gtms03.alicdn.com/tps/i3/TB1_jR.HXXXXXaQXXXXc8PZ9XXX-130-200.png ",
			"href": " http://www.tmall.com/go/market/meizhuang/beautyaward.php"
		}, {
			"url": " http://gtms02.alicdn.com/tps/i2/TB1XJ7.FVXXXXaQXFXXy8jZ9XXX-130-200.jpg ",
			"href": " http://www.tmall.com/go/market/promotion-act/nvzhuang828.php"
		}, {
			"url": " http://img.taobaocdn.com/bao/uploaded/T1eYDyFfdbXXb1upjX.jpg ",
			"href": " //list.tmall.com/search_product.htm"
		}, {
			"url": " http://i.mmcdn.cn/simba/img/TB1TE0AGXXXXXXJXXXXSutbFXXX.jpg ",
			"href": " http://click.mz.simba.taobao.com/ecpm"
		}, {
			"url": " http://gtms01.alicdn.com/tps/i1/TB1DGvOGVXXXXX0apXXc8PZ9XXX-130-200.png ",
			"href": " http://nianhuo.tmall.com/"
		}],
		bianMin: [{
			"title": "话费",
			"icon": "",
			"href": "http://wt.taobao.com/?ks-menu=cz"
		}, {
			"title": "游戏",
			"icon": "",
			"href": "http://game.taobao.com"
		}, {
			"title": "旅行",
			"icon": "",
			"href": "http://trip.taobao.com"
		}, {
			"title": "保险",
			"icon": "",
			"href": " http://baoxian.taobao.com/"
		}, {
			"title": "彩票",
			"icon": "",
			"href": "http://caipiao.taobao.com/"
		}, {
			"title": "电影票",
			"icon": "",
			"href": "http://dianying.taobao.com"
		}, {
			"title": "点外卖",
			"icon": "",
			"href": "http://waimai.taobao.com/shop_list.htm"
		}, {
			"title": "理财",
			"icon": "",
			"href": "https://zhaocaibao.alipay.com/pf/productList.htm"
		}, {
			"title": "电子书",
			"icon": "",
			"href": "http://ebook.taobao.com/"
		}, {
			"title": "音乐",
			"icon": "",
			"href": "http://music.taobao.com"
		}, {
			"title": "水电煤",
			"icon": "",
			"href": "http://life.taobao.com/market/sdmjf2011.php"
		}, {
			"title": "火车票",
			"icon": "",
			"href": "http://trip.taobao.com/market/trip/train-home2014.php"
		}]
	};

	var catas = {
		cata1: {
			header: {
				"index1": {
					"title": "女装",
					"href": "http://www.taobao.com/market/nvzhuang/index.php"
				},
				"index2": {
					"title": "男装",
					"href": "http://www.taobao.com/market/nanzhuang/index.php"
				},
				"index3": {
					"title": "年度TOP热卖羽绒",
					"href": "http://www.taobao.com/market/nvzhuang/rmyr.php"
				},
				"index4": {
					"title": "风格尚新",
					"href": "http://www.taobao.com/market/nvzhuang/aqfenge.php"
				},
				"index5": {
					"title": "毛呢大衣",
					"href": "http://www.taobao.com/market/nanzhuang/mndy2014.php"
				}
			},
			type1: [{
				"title": "潮流女装",
				"href": "http://www.taobao.com/market/nvzhuang/index.php",
				"class": "item-header"
			}, {
				"title": "冬上新",
				"href": "http://www.taobao.com/market/nvzhuang/xinpin.php",
				"class": ""
			}, {
				"title": "韩版",
				"href": "http://www.taobao.com/market/nvzhuang/sweet.php",
				"class": ""
			}, {
				"title": "连衣裙",
				"href": "http://www.taobao.com/market/nvzhuang/dress.php",
				"class": ""
			}, {
				"title": "套装裙",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "大码MM",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "羽绒服",
				"href": "http://www.taobao.com/market/nvzhuang/yurong.php",
				"class": "item-header"
			}, {
				"title": "短羽绒",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "奢华毛领",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "棉服",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "皮草",
				"href": "http://www.taobao.com/market/nvzhuang/piyipicaopingdao.php",
				"class": ""
			}, {
				"title": "外套",
				"href": "http://www.taobao.com/market/nvzhuang/qiuwaitao.php",
				"class": ""
			}, {
				"title": "毛呢大衣",
				"href": "http://www.taobao.com/market/nvzhuang/maoni.php",
				"class": "item-header"
			}, {
				"title": "中长款",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "羊绒大衣",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "卫衣",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "皮衣",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "衬衫",
				"href": "http://www.taobao.com/market/nvzhuang/shirt.php",
				"class": ""
			}, {
				"title": "毛衣针织",
				"href": "http://www.taobao.com/market/nvzhuang/maoyi.php",
				"class": "item-header"
			}, {
				"title": "羊绒衫",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "裤子",
				"href": "http://www.taobao.com/market/nvzhuang/trousers.php",
				"class": ""
			}, {
				"title": "加绒裤",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "打底裤",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "内衣",
				"href": "http://s.taobao.com/list",
				"class": ""
			}],
			type2: [{
				"title": "精选男装",
				"href": "http://www.taobao.com/market/nanzhuang/index.php",
				"class": "item-header"
			}, {
				"title": "冬上新",
				"href": "http://www.taobao.com/market/nanzhuang/xinpin.php",
				"class": ""
			}, {
				"title": "潮流",
				"href": "http://www.taobao.com/market/nanzhuang/citiao/nanchao.php",
				"class": ""
			}, {
				"title": "时尚",
				"href": "http://www.taobao.com/market/nanzhuang/shishang.php",
				"class": ""
			}, {
				"title": "商务",
				"href": "http://www.taobao.com/market/nanzhuang/swss.php",
				"class": ""
			}, {
				"title": "保暖棉衣",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "冬季外套",
				"href": "http://s.taobao.com/list",
				"class": "item-header"
			}, {
				"title": "毛呢",
				"href": "http://www.taobao.com/market/nanzhuang/mndy2014.php",
				"class": ""
			}, {
				"title": "毛衣",
				"href": "http://www.taobao.com/market/nanzhuang/citiao/maoyi.php",
				"class": ""
			}, {
				"title": "夹克",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "皮衣",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "卫衣",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "西服",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "羽绒服",
				"href": "http://www.taobao.com/market/nanzhuang/citiao/yurongfu.php",
				"class": "item-header"
			}, {
				"title": "牛仔裤",
				"href": "http://www.taobao.com/market/nanzhuang/citiao/kuzhuang.php",
				"class": ""
			}, {
				"title": "休闲裤",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "衬衫",
				"href": "http://www.taobao.com/market/nanzhuang/citiao/chenshan.php",
				"class": ""
			}, {
				"title": "风衣",
				"href": "http://s.taobao.com/list",
				"class": ""
			}, {
				"title": "针织衫",
				"href": "http://s.taobao.com/list",
				"class": ""
			}],
			type3: [{
				"title": "潮流男装",
				"href": "http://s.taobao.com/list",
				"class": "guess"
			}, {
				"title": "羽绒服",
				"href": "http://s.taobao.com/list",
				"class": "em"
			}, {
				"title": "卫衣",
				"href": "http://s.taobao.com/list",
				"class": "em"
			}, {
				"title": "内裤",
				"href": "http://s.taobao.com/list",
				"class": "em"
			}, {
				"title": "女装精品",
				"href": "http://s.taobao.com/list",
				"class": "em"
			}, {
				"title": "打底裙",
				"href": "http://s.taobao.com/list",
				"class": "em"
			}, {
				"title": "毛呢外套",
				"href": "http://s.taobao.com/list",
				"class": "em"
			}, {
				"title": "打底衫",
				"href": "http://s.taobao.com/list",
				"class": "em"
			}, {
				"title": "冬装",
				"href": "http://s.taobao.com/list",
				"class": "em"
			}, {
				"title": "毛针织衫",
				"href": "http://s.taobao.com/list",
				"class": "em"
			}]
		},
		cata2: [],
		cata3: [],
		cata4: [],
		cata5: [],
		cata6: []
	};
	define(function() {
		var data = {
			user: user,
			search: search,
			teshe: teshe,
			main: main,
			catas: catas
		};
		return data;
	});
})();