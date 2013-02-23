; (function () {
    alert("test Storage ,please look console.log!!");

    var win = window,
        doc = document
    ;
    var Store = Qmik.Store;


    function test() {
        
        var me = this;
        var key1 = "mgk1",
            key2 = "mgk2",
            key3 = "mgk3",
            key4 = "mgk4",
            key5 = "mgk5",
            key6 = "mgk6",
             value;
        me.val1 = "val1";
        me.val2 = { name: "xiaohau", age: 25 };
        me.val3 = "\r\nabcadsfsdf";
        me.val4 = "<br/>adfasdf<br/>\r \n \t";
        me.val5 = { bk: "<br/>adfasdf<br/>\r \n \t", mm: 109 };
        me.val6 = { bk: "<br/>adfasdf<br/>\r \n \t", mm: 109, child: { name: "<<\\\\\\>>" } };



        var count = 100;

        localStorage.setItem("mmmgbc", "rereafasdfsadfasdfsadf[]<>adf");

        console.log("------------test localStorage-------------------------------------------");
        //test localStorage
        for (var i = 1; i < count; i++) {
            if (me["val" + i]) {
                if (i % 3 == 0) {
                    Store.setLocal("mgk" + i, me["val" + i],20);
                } else {
                    Store.setLocal("mgk" + i, me["val" + i]);
                }
            } 
        }
        for (var i = 1; i < count; i++) {
            if (me["val" + i]) logLocal("mgk" + i);
        }
        
        //test sessionStorage
        console.log("///////////////////////////////////////////////////////////////////////");
        console.log("------------test sessionStorage-------------------------------------------");
        console.log("///////////////////////////////////////////////////////////////////////");
        for (var i = 1; i < count; i++) {
            if (me["val" + i]) Store.setSession("mgk" + i, me["val" + i]);
        }
        for (var i = 1; i < count; i++) {
            if (me["val" + i]) logSession("mgk" + i);
        }

        //test cookie
        console.log("///////////////////////////////////////////////////////////////////////");
        console.log("------------test cookie ,cookie需要在域名下测试-------------------------------------------");
        console.log("///////////////////////////////////////////////////////////////////////");
        for (var i = 1; i < count; i++) {
            if (me["val" + i]) Store.setCookie("mgk" + i, me["val" + i]);
        }
        for (var i = 1; i < count; i++) {
            if (me["val" + i]) logCookie("mgk" + i);
        }
    }
    function logLocal(key) {
        var val = Store.getLocal(key);
        if (val instanceof String) {
            console.log("getValue>string>key:" + key + ":" + val);
        } else {
            console.log("getValue>json>key:" + key + ":" + JSON.stringify(val));
        }
    }
    function logSession(key) {
        var val = Store.getSession(key);
        if (val instanceof String) {
            console.log("getValue>string>key:" + key + ":" + val);
        } else {
            console.log("getValue>json>key:" + key + ":" + JSON.stringify(val));
        }
    }
    function logCookie(key) {
        var val = Store.getCookie(key);
        if (val instanceof String) {
            console.log("getValue>string>key:" + key + ":" + val);
        } else {
            console.log("getValue>json>key:" + key + ":" + JSON.stringify(val));
        }
    }
    test();
})();