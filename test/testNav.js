;
(function(Q) {
	Q.sun.config( {
		alias : {
			'mo' : '/test/module/mo'
		}
		//,map:[['.js',".min.js"]]
	});
	var selector="div";
	Q(document).ready(function() {
	 		
		var heads = document.getElementsByTagName("head");
		Q("#click1").on("click", function(e,a) {
			Q.nav.use("mo", "/test/testSun.html", {
				key : "sawr[]{a:'asdf',list:[1,2,3]}",
				age : 14
			}, function(v) {
				Q("#show").html("abc");
				// Q.log("cccccbakk back:" + v);
			});
		},"a");
		Q("#click2").on("click", function() {
			Q.nav.use("mo", "/test/testSun.html", {
				key : "sad%as&der",
				age : 29
			});
		});
		Q("#click3").on("click", function() {
			Q.nav.use("mo", "/test/testSun.html", {
				age : 12
			});
		});
	})
})(Qmik);
