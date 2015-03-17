Qmik(function ($) {
    //$.app() 编译并生成应用,$.app().ctrl()定义控制器

    $.app(function(scope){
        window.scope = scope;
        $.use("api/user", function (User) {
            User.get(function (result, user) {
                //scope.constructor.prototype.user = user;
                scope.user = user;
                console.log(user);
                scope.apply(["user"]);//更新
            });
        });
    }).ctrl({
        user: function (scope) {
            window.scope = scope;
            $.use("api/user", function (User) {
                User.get(function (result, user) {
                    scope.user = user;
                    scope.apply(["user"]);//更新
                });
            });
        },
        shop: function (scope) {//购物
            $.use("api/shop", function (Shop) {
                Shop.get(function (result, shop) {
                    scope.shop = shop;
                    scope.apply(["shop"]);
                });

                scope.clickme = function (e) {
                    scope.msg = "我变了 " + parseInt($.now() / 1000 + Math.random() * 100) + '';
                    scope.apply(["msg", "gohome"]); //这种写法,性能比较好,保更新 msg 对应的节点信息
                    //scope.apply();//这种写法性能比较差,会更新整个控制器的所有节点信息,
                }

                //倒计时
                var ttl = 5000;//
                scope.time = parseInt(ttl / 1000);
                var startTime = $.now() + ttl;
                $.cycle(function () {
                    var t = startTime - $.now();
                    scope.time = parseInt(t / 1000);
                    scope.apply("time");
                    if (scope.time < 1) {
                        scope.$(".load").hide();
                    }
                }, 1000, ttl);

            });
        }
    });
});