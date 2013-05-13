;
(function($) {
	Qmik.sun.config( {
		alias : {
			'mo' : '/test/module/mo'
		}
	});
	$.ready(function() {
		$("#click1").on("click", function() {
			$.nav.use("mo", {
				key : "sawr[]{a:'asdf',list:[1,2,3]}",
				age : 14
			});
		});
		$("#click2").on("click", function() {
			$.nav.use("mo", {
				key : "sad%as&der",
				age : 29
			});
		});
		$("#click3").on("click", function() {
			$.nav.use("mo", {
				age : 12
			});
		});
	})
})(Qmik);
