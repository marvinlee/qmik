(function ($) {
    $.define("com", function (require, exports, module) {
        module.exports = {
            show: function(msg){
                $.log("com show:", msg);
            }
        };
    });
})(Qmik);