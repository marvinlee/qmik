;
<<<<<<< .mine
(function($) {
	Qmik.sun.config( {
		alias : {
			'mo' : '/test/module/mo'
		}
	});
=======
(function($) {
	Qmik.sun.config( {
		alias : {
			'mo' : 'http://127.0.0.1/js/mo'
		}
	});
>>>>>>> .theirs
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
<<<<<<< .mine
        $("#click1").on("click", function() {
            $.nav.use("flag1", {
=======
        $("#href1").on("click", function() {
            $.hash.use("flag1", {
>>>>>>> .theirs
                key: "sad%as&derqewr[]{a:'asdf',list:[1,2,3]}",
                age: 14
            });
        });
<<<<<<< .mine
        $("#click2").on("click", function() {
      	  console.log("click click2")
            $.nav.use("mo", {
=======
        $("#href2").on("click", function() {
            $.hash.use("flag2", {

>>>>>>> .theirs
                key: "sad%as&der",
                age: 29
            });
        });
<<<<<<< .mine
        $("#click3").on("click", function() {
            $.nav.use("flag3", {
=======
        $("#href3").on("click", function() {
            $.hash.use("flag3", {
>>>>>>> .theirs
                age: 12
            });
        });
    })


})(Qmik);