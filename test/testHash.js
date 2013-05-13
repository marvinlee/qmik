;
(function($) {
	Qmik.sun.config( {
		alias : {
			'mo' : 'http://127.0.0.1/js/mo'
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
        $("#href1").on("click", function() {
            $.hash.use("flag1", {
                key: "sad%as&derqewr[]{a:'asdf',list:[1,2,3]}",
                age: 14
            });
        });
        $("#href2").on("click", function() {
            $.hash.use("flag2", {
                key: "sad%as&der",
                age: 29
            });
        });
        $("#href3").on("click", function() {
            $.hash.use("flag3", {
                age: 12
            });
        });
    })


})(Qmik);