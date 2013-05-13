;
(function($) {
	Qmik.sun.config( {
		alias : {
			'mo' : '/test/module/mo'
		}
	});
    function flag1() {
        console.log("flag1 ");
    }

    function flag2() {
        console.log("flag2 ");
    }

    function flag3() {
        console.log("flag3 ");
    }
 
    $.ready(function() {
        $("#click1").on("click", function() {
            $.nav.use("flag1", {
                key: "sad%as&derqewr[]{a:'asdf',list:[1,2,3]}",
                age: 14
            });
        });
        $("#click2").on("click", function() {
      	  console.log("click click2")
            $.nav.use("mo", {
                key: "sad%as&der",
                age: 29
            });
        });
        $("#click3").on("click", function() {
            $.nav.use("flag3", {
                age: 12
            });
        });
    })


})(Qmik);