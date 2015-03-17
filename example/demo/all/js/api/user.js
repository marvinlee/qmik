/**
 * 用户基础接口
 */
(function ($) {
    var Module = {
        /**
         *[callback]
         * @param callback
         */
        "get": function (callback) {
            //通过ajax向后台取数据,这边模块延迟回调
            $.delay(function () {
                var result = {
                    code: 1,
                    data: {
                        id: 1,
                        name: "leo@qmik.org",
                        nick: "leochen",
                        qq: "qq",
                        email: "leo@qmik.org"
                    }
                };
                callback && callback(result, result.data);
            }, 500)
        }
    };

    $.define("api/user", function (require, exports, module) {
        module.exports = Module;//导出模块
    });
})(Qmik);