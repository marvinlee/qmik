(function() {

	var user = {
		nick: "leo",
		msgCount: 1,
		shoppingCount: 3,
	};
	var search = {
		"q": '方便随时随地打盹的“环形午睡枕”',
		"hots":[{"title":"时尚女包","href":"//s.taobao.com/search","class":""},{"title":"羽绒服","href":"//s.taobao.com/search","class":""},{"title":"雪地靴","href":"//s.taobao.com/search","class":"h"},{"title":"毛呢外套","href":"//s.taobao.com/search","class":""},{"title":"男鞋","href":"//s.taobao.com/search","class":""},{"title":"时尚保温杯","href":"//s.taobao.com/search","class":""},{"title":"进口零食","href":"//s.taobao.com/search","class":""},{"title":"新款棉衣","href":"//s.taobao.com/search","class":""},{"title":"秋冬四件套","href":"//s.taobao.com/search","class":""},{"title":"秋冬童装","href":"//s.taobao.com/search","class":""},{"title":"皮衣","href":"//s.taobao.com/search","class":""},{"title":"新款毛衣","href":"//s.taobao.com/search","class":""},{"title":"打底裤","href":"//s.taobao.com/search","class":""},{"title":"睡衣","href":"//s.taobao.com/search","class":""},{"title":"秋冬沙发垫","href":"//s.taobao.com/search","class":""},{"title":"更多","href":"http://top.taobao.com/index.php","class":"more more-with-border"}]
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
	var shops = {"list":[{"header":{"title":"星店","desc":"明星开店在这里","href":"http://star.taobao.com"},"body":{"title":"音乐大师课，跟导师面对面","desc":"音乐大师课，跟导师面对面\n明星福利\n","img":"http://img03.taobaocdn.com/imgextra/i3/2363203880/TB2NZmCbFXXXXaZXpXXXXXXXXXX_!!2363203880.jpg","href":"http://star.taobao.com/?slide=1"},"pics":[{"title":"小红果刺绣连衣裙","img":"http://gtms04.alicdn.com/tps/i4/TB1RpIgGVXXXXayapXX1J2J6XXX-122-121.jpg"},{"title":"迷人香氛","img":"http://gtms04.alicdn.com/tps/i4/TB1LPubHXXXXXbkXFXXyytwIpXX-70-70.jpg"}],"channels":[{"title":"最强折扣","href":"http://star.taobao.com/?slide=2"},{"title":"新年美肤","href":"http://star.taobao.com/?slide=5"},{"title":"星同款","href":"http://star.taobao.com#guid-1408949859693"}],"tags":[{"title":" 0元星福利 ","href":"http://star.taobao.com#guid-1408957859445"},{"title":"人气明星店","href":"http://star.taobao.com#guid-1408949741924"}]},{"header":{"title":"全球购","desc":"足不出户 淘遍全球","href":"http://g.taobao.com/?scm=1219.9.9.5"},"body":{"title":"冬季也性感","desc":"冬季也性感\n国外街拍最in运动装\n","img":"http://gtms04.alicdn.com/tps/i4/TB1zOiiHXXXXXcjXFXXSutbFXXX.jpg","href":"http://www.taobao.com/market/gmall/overseas/index.php?spm=5148.1292865.a31d3.4.tocqgJ"},"pics":[{"title":"人气美包","img":"http://gtms01.alicdn.com/tps/i1/TB1fzqdHXXXXXbOaXXXSutbFXXX.jpg"},{"title":"2015新首饰","img":"http://gtms04.alicdn.com/tps/i4/TB1.zfrGFXXXXbbaXXXyytwIpXX-70-70.jpg"}],"channels":[{"title":"","href":"http://www.taobao.com/market/2014/1212/trade/global.php"},{"title":"","href":"http://www.taobao.com/market/2014/1212/trade/global.php"},{"title":"","href":"http://www.taobao.com/market/2014/1212/trade/global.php"},{"title":"","href":"http://www.taobao.com/market/2014/1212/trade/global.php"},{"title":"","href":"http://www.taobao.com/market/2014/1212/trade/global.php"}],"tags":[{"title":" 海外团 ","href":"http://www.taobao.com/market/gmall/overseas/index.php"},{"title":"全球Mall折扣同步","href":"http://www.taobao.com/market/gmall/live.php"}]},{"header":{"title":"拍卖会","desc":"年末压轴 终极盛典","href":"http://paimai.taobao.com/"},"body":{"title":"雅阁轿车 4.9万拍","desc":"雅阁轿车 4.9万拍\n法院低价处置资产\n","img":"http://gtms02.alicdn.com/tps/i2/TB197xSHXXXXXbcXpXXzPooUXXX-169-100.png","href":"http://sf.taobao.com/item_list.htm?spm=a213w.3064813.a214dqe.2.RjLcqN&category=50025972&item_id=43318415799"},"pics":[{"title":"翡翠甩拍","img":"http://gtms02.alicdn.com/tps/i2/TB1Q14RHXXXXXXiXXXXyytwIpXX-70-70.jpg"},{"title":"买公车啦！","img":"http://gtms01.alicdn.com/tps/i1/TB1R1rYGVXXXXaYaXXXcy0wIpXX-70-70.png"}],"channels":[{"title":"低价房产","href":"http://s.paimai.taobao.com/pmp_list/3_54016002__1_1_1.htm?spm=1.7274553.1997522505.5.ep7OZr&st_price=0"},{"title":"美瓷之王","href":"http://s.paimai.taobao.com/pmp_list/3_53848006___1_1.htm#sort-bar"},{"title":"开运奢品","href":"http://s.paimai.taobao.com/pmp_list/3_53882003___1_1.htm?#sort-bar"}],"tags":[{"title":" 投资 ","href":"http://s.paimai.taobao.com/pmp_list/3_53922004___1_1.htm?spm=a213x.7340941.1003.3.tZWkv7&st_price=0#sort-bar"},{"title":"1元拍扁古今艺术品","href":"http://s.paimai.taobao.com/pmp_list/3_53922004___1_1.htm?spm=a213x.7340941.1003.3.tZWkv7&st_price=0#sort-bar"}]},{"header":{"title":"天天特价","desc":"专享低价 包邮","href":"http://tejia.taobao.com"},"body":{"title":"新品女装棉服 萌萌哒!","desc":"新品女装棉服 萌萌哒!\n绝对超值 包邮\n","img":"http://gtms04.alicdn.com/tps/i4/TB1lNyhHXXXXXafXpXX3bpXTXXX-170-100.png","href":"http://tejia.taobao.com/tejiaListRec.htm?spm=a3109.6190702.1997029713.1.sK4y04&promotionId=1"},"pics":[{"title":"100元封顶","img":"http://gtms01.alicdn.com/tps/i1/TB1UqyhHXXXXXX6XpXXcy0wIpXX-70-70.png"},{"title":"10元惊喜","img":"http://gtms01.alicdn.com/tps/i1/TB1p3x8HXXXXXbBaXXXcy0wIpXX-70-70.png"}],"channels":[{"title":"今日特卖","href":"http://zhi.taobao.com/"},{"title":"大码女装","href":"http://tejia.taobao.com/tejiaListRec.htm?spm=a3109.6190706.0.0.6Q16My&promotionId=1&cid=1629"},{"title":"连衣裙","href":"http://tejia.taobao.com/tejiaListRec.htm?spm=a3109.6190706.0.0.NpzfLP&promotionId=1&cid=50010850"}],"tags":[{"title":" 百货 ","href":"http://tejia.taobao.com/tejiaListRec.htm?spm=a3109.6190706.0.0.MORxUs&promotionId=9"},{"title":"韩版儿童羽绒服 1折起","href":"http://tejia.taobao.com/tejiaListRec.htm?spm=a3109.6190706.0.0.MORxUs&promotionId=9"}]},{"header":{"title":"淘女郎","desc":"美人美货美图","href":"http://mm.taobao.com/"},"body":{"title":"高品质【设计感】新年搭配","desc":"高品质【设计感】新年搭配\n新年好运出彩搭配 出街吸睛100%\n","img":"http://gtms04.alicdn.com/tps/i4/TB1A_49HXXXXXaEXFXX3bpXTXXX-170-100.png","href":"http://mm.taobao.com/index.htm?spm=719.1001036.1001088.3.bUcqxK"},"pics":[{"title":"欧美复古","img":"http://gtms01.alicdn.com/tps/i1/TB15Od3HXXXXXbyaXXXcy0wIpXX-70-70.png"},{"title":"教你显瘦","img":"http://gtms02.alicdn.com/tps/i2/TB1ha9bHXXXXXX_XpXXcy0wIpXX-70-70.png"}],"channels":[{"title":"厚打底裤","href":"http://mm.taobao.com/guide/acquisition_list.htm?spm=719.100103615.0.0.bLZLyM&col_album_id=10000261732"},{"title":"帽子戏法","href":"http://mm.taobao.com/guide/acquisition_list.htm?spm=719.100103615.0.0.bLZLyM&col_album_id=10000258703"},{"title":"假期出游","href":"http://mm.taobao.com/guide/acquisition_list.htm?spm=719.100103615.0.0.bLZLyM&col_album_id=301997001"}],"tags":[{"title":" 显瘦 ","href":"http://mm.taobao.com/guide/acquisition_list.htm?spm=719.100103615.0.0.bLZLyM&col_album_id=10000256599"},{"title":"冬季拒绝臃肿 教你穿出瘦","href":"http://mm.taobao.com/guide/acquisition_list.htm?spm=719.100103615.0.0.bLZLyM&col_album_id=10000256599"}]},{"header":{"title":"去啊","desc":"世界触手可行","href":"http://trip.taobao.com?acm=tt-1097038-38022.1003.8.80049&uuid=80049&scm=1003.8.tt-1097038-38022.OTHER_1403385165786_80049&pos=1"},"body":{"title":"三亚5天自由行999","desc":"三亚5天自由行999\n往返机票+蜈支洲门票\n","img":"http://gtms03.alicdn.com/tps/i3/T1euoIFQxcXXX0gpb4-170-100.jpg","href":"http://trip.taobao.com/market/trip/act/trip2015/spring-festival.php?abbucke…88&abtest=&scm=1003.8.tt-1097038-38023.OTHER_1419640490384_175588&pos=1#gn"},"pics":[],"channels":[{"title":"血拼香港","href":"http://trip.taobao.com/market/trip/act/trip2015/spring-festival.php?abbucke…&abtest=&scm=1003.8.tt-1097038-38025.OTHER_1422528364719_176197&pos=1#jpzq"},{"title":"最美三亚","href":"http://trip.taobao.com/market/trip/act/trip2015/spring-festival.php?abbucke…97&abtest=&scm=1003.8.tt-1097038-38025.OTHER_1420144302200_176197&pos=2#gn"},{"title":"七彩云南","href":"http://trip.taobao.com/market/trip/act/trip2015/spring-festival.php?abbucke…97&abtest=&scm=1003.8.tt-1097038-38025.OTHER_1422883846185_176197&pos=3#gn"}],"tags":[{"title":" 发红包 ","href":"http://trip.taobao.com/market/trip/act/trip2015/spring-festival.php?abbucke…76201&abtest=&scm=1003.8.tt-1097038-38026.OTHER_1420914845799_176201&pos=1"},{"title":"1分钱抢100元啦","href":"http://trip.taobao.com/market/trip/act/trip2015/spring-festival.php?abbucke…76201&abtest=&scm=1003.8.tt-1097038-38026.OTHER_1420914845799_176201&pos=1"}]},{"header":{"title":"汇吃","desc":"","href":"http://chi.taobao.com"},"body":{"title":"34.90","desc":"¥","img":"http://img03.taobaocdn.com/bao/uploaded/i3/TB11VJZHXXXXXcoXXXXSutbFXXX.jpg","href":"http://item.tiaoshi.taobao.com/item.htm?spm=0.0.0.0.mn0xGK&id=41878000685"},"pics":[],"channels":[],"tags":[]},{"header":{"title":"","desc":"","href":""},"body":{"title":"","desc":"","img":"","href":""},"pics":[],"channels":[],"tags":[]},{"header":{"title":"二手","desc":"","href":"http://2.taobao.com"},"body":{"title":"","desc":"","img":"http://img.taobaocdn.com/bao/uploaded/i4/TB1GLWkHXXXXXa7XFXXXmZnFFXX_110x110xz.jpg","href":"http://2.taobao.com/item.htm?id=42616376830"},"pics":[],"channels":[],"tags":[]},{"header":{"title":"","desc":"","href":""},"body":{"title":"","desc":"","img":"","href":""},"pics":[],"channels":[],"tags":[]}]} ;

	define(function() {
		var data = {
			user: user,
			search: search,
			teshe: teshe,
			main: main,
			shops: shops
		};
		return data;
	});
})();