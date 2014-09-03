$.define("demo/Common", function(require){

	return {

		doing:function(msg){
			console.log("doing common, ",msg);
			$("#result").append("<p>doing common "+msg+"</p>");
		}
	}
});
