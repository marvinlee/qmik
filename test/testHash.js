;
(function() {
    function flag1() {
        console.log("flag1 ");
    }

    function flag2() {
        console.log("flag2 ");
    }

    function flag3() {
        console.log("flag3 ");
    }
    $.Hash.register("flag1", flag1);
    $.Hash.register("flag2", flag2);
    $.Hash.register("flag3", flag3);
    $.ready(function() {
        $("#href1").on("click", function() {
            $.Hash.hash("flag1", {
                key: "sad%as&derqewr[]{a:'asdf',list:[1,2,3]}",
                age: 14
            });
        });
        $("#href2").on("click", function() {
            $.Hash.hash("flag2", {
                key: "sad%as&der",
                age: 29
            });
        });
        $("#href3").on("click", function() {
            $.Hash.hash("flag3", {
                age: 12
            });
        });
    })


})();