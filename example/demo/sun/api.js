(function ($) {
    $.define("api", function (require, exports, module) {
        module.exports = {
            show: function(msg){
                $.log("api show:", msg);
            }
        };
    });
})(Qmik);