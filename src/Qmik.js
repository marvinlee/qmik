/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function () {
    window.QmikNode = function (win) {
        win = win || window;
        var e = encodeURIComponent,
			d = decodeURIComponent,
			doc = win.document,
			fn, ar = Array.prototype,
			slice = ar.slice,
			sr = String.prototype,
			R = sr.replace,
			hasOwnProperty = Object.prototype.hasOwnProperty,
			dttl = 30000,
			Q = function (selector, context) {
			    return init(selector, context)
			},
			cache = {},
			UA = navigator.userAgent,
			filter = function (f, r) {
			    var r = r || [];
			    E(this, function (i, v) {
			        f(v) && r.push(v)
			    });
			    return r
			},
			rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,
			readyRE = /complete|loaded|interactive/,
			match = {
			    ID: /^#[\w-_\u00c0-\uFFFF]+/,
			    ATTR: /^([\w-_]+)\[\s*[\w-_]+\s*!?=\s*('|")?(.*)('|")?\s*\]/,
			    CT: /^([\w-_]+)?\.[\w-_]+/,
			    TAG: /^[\w-_]+/
			},
			rNode = /^\s*(<.+>.*<\/.+>)+|(<.+\/\s*>)+\s*$/;
        regular = {
            querys: match,
            node: rNode
        },
        settings = {
            compile: compile,
            regular: regular,
            initList: initList,
            resoTKV: TKV,
            resoTC: TC,
            hasClass: HC
        },
        list = [win.NodeList, win.HTMLCollection];
        sr.trim = sr.trim || function () { T(this) };

        function initList(a) {
            for (var m in list) {
                var v = list[m];
                if (v) {
                    v.prototype.slice = ar.slice;
                    v.prototype.splice = ar.splice;
                    for (var k in a) v.prototype[k] = a[k];
                }
            }
        }
        initList(ar);
        Q.extend = function () {
            var r = arguments[0] || {},
				i = 1,
				L = arguments.length;
            switch (L) {
                case 0:
                    return;
                case 1:
                    r = this;
                    i = 0;
                    break;
            }
            E(slice.call(arguments, i), function (j, v) {
                E(v, function (m, n) {
                    if (!N(n)) r[m] = n
                })
            });
            return r
        }
        Q.extend({
            find: function (s, c) {
                return new QM(s, c)
            },
            ready: function (f) {
                ready(f)
            },
            isQmik: isQ,
            isElement: D,
            isFun: isF,
            isFunction: isF,
            isNum: isZ,
            isNumber: isZ,
            isArray: A,
            likeArray: LA,
            isBool: isB,
            isString: S,
            isDate: function (v) {
                return v instanceof Date
            },
            isObject: function (v) {
                return v instanceof Object
            },
            isPlainObject: isP,
            isStandard: SE,
            isNull: N,
            likeNull: LN,
            isEvent: function (e) {
                return isE(e)
            },
            trim: T,
            array: function (array) {
                return merge([], array)
            },
            inArray: function (value, array) {
                if (LA(array)) for (var i = 0; i < array.length; i++) if (array[i] === value) i;
                return -1
            },
            unique: function (array) {
                for (var i = array.length - 1, j; i >= 0; i--)
                    for (j = i - 1; j >= 0; j--)
                        if (array[i] === array[j]) array.splice(i, 1)
            },
            contains: function (p, c) {
                if (D(p) && D(c)) return p === c || NGP(p, c);
                for (var k in p) if (p[k] === c) return !0;
                return !1
            },
            each: E,
            merge: merge,
            //合并数组或对象
            map: function (array, callback) {
                var r = [];
                E(array, function (i, v) {
                    r.push(callback(i, v))
                });
                return r
            },
            getScript: function (u, f) {
                var s = doc.createElement("script");
                s.type = "text/javascript";
                s.src = u;
                Q(doc.head).append(s);
                s.onload = f;
            },
            serialize: function (a) {
                return Q.param(Q.serializeArray(a))
            },
            serializeArray: function (a) {
                return toV(a, function (v) {
                    return v && v.name ? {
                        name: v.name,
                        value: toFV(v.value)
                    } : !1;
                })
            },
            grep: toV,
            //buid a new array,filter by fun
            param: function (o) {
                var h = [];
                E(o, function (i, v) {
                    h.push(e(v.name) + '=' + e(toFV(v.value)))
                });
                return h.join('&')
            },
            stringify: toS,
            parseJSON: toO,
            time: function (d) {
                return (d || 0) + parseInt((new Date()).getTime() / 1000)
            },
            clone: clone,
            //延迟执行,==setTimeout
            delay: function (f, t) {
                var p = slice.call(arguments, 2);
                return setTimeout(function () {
                    f.apply(f, p)
                }, t)
            },
            //周期执行,==setInterval
            cycle: function (f, t) {
                var p = slice.call(arguments, 2);
                return setInterval(function () {
                    f.apply(f, p)
                }, t)
            },
            isIphone: function () {
                return /i(Phone|P(o|a)d)/.test(UA)
            },
            isAndroid: function () {
                return /Android/.test(UA)
            },
            isWP: function () {
                return /Windows Phone/.test(UA)
            },
            toLower: toL,
            toUpper: toU
        });

        function T(v) {
            return N(v) ? '' : R.call(v, rtrim, '')
        } //trim


        function N(v) {
            return v === undefined || v == null
        } //isNull


        function LN(v) {
            return N(v) || v == "undefined" || v == "null" || v == ""
        }

        function D(v) {
            return v && v.nodeType == 1
        } //isDom


        function A(v) {
            return v instanceof Array
        } //isArray


        function LA(v) {
            return A(v) || isQ(v) || (v && !D(v) && !S(v) && isZ(v.length) && v != win)
        }

        function isP(v) { //isPlainObject
            if (N(v) || v + '' != '[object Object]' || v.nodeType || v.setInterval) return !1;
            var k;
            for (k in v) { }
            return N(k) || hasOwnProperty.call(v, k)
        }

        function S(v) {
            return typeof v == 'string'
        } //isString


        function isF(v) {
            return v instanceof Function
        } //isFunction


        function E(o, f) { //each fun(k,v)
            var i;
            if (LA(o)) for (i = 0; i < o.length; i++) {
                if (f.call(o[i], i, o[i]) === !1) break
            } else if (isBS(o) || isZ(o) || isF(o)) f.call(o, i, o);
            else for (i in o) {
                if (f.call(o[i], i, o[i]) === !1) break
            }
        }

        function isZ(v) {
            return typeof v == 'number'
        } //isNumber


        function isB(v) {
            return typeof v == 'boolean'
        }

        function isBS(v) {
            return isB(v) || S(v)
        }

        function toS(v) {
            return isBS(v) || isZ(v) ? v : JSON.stringify(v)
        };

        function toO(v) {
            try {
                if (S(v) && v.match(/^\s*[\[{].*[\]}]\s*$/)) return Q.exec('(' + v + ')')
            } catch (e) { }
            return v
        } //to object


        function NP(p, c) {
            return D(c) && p === c.parentNode
        } //isparent


        function NGP(g, c) {
            return NP(g, c) ? !0 : D(c) && NGP(g, c.parentNode)
        } //is parent or gparent


        function isQ(v) {
            return v instanceof QM
        } //is qmik


        function isE(e) {
            return e == event || win.Event && e instanceof win.Event
        }

        function toV(a, f) {
            return filter.call(a, function (v) {
                return f ? f(v) : !N(v)
            })
        }

        function toFV(v) {
            return isF(v) ? v() : v
        }

        function toL(s) {
            return s ? s.toLowerCase() : ""
        }

        function toU(s) {
            return s ? s.toUpperCase() : ""
        }

        function HC(o, cn) {
            if (!D(o)) return !1;
            var cs = o.className.split(" ") || [],
				cn = T(cn);
            for (var i = 0; i < cs.length; i++)
                if (cs[i] == cn) return !0;
            return !1
        }

        function merge() { //merge array or object
            var f = arguments[0],
				a = A(f),
				i = 1;
            for (; i < arguments.length; i++) {
                E(arguments[i], function (k, v) {
                    a ? f.push(v) : f[k] = v
                })
            }
            return f
        }

        function FM(v) {
            return v.replace(/[A-Z]/g, function (v) {
                return "-" + v.toLowerCase()
            })
        }

        function SE() {
            return !N(doc.addEventListener)
        }

        function VC(c) {
            c = toFV(c);
            return S(c) && rNode.test(c) ? Q(c) : c
        }

        function append(o, c) {
            c = VC(c);
            if (LA(o)) {
                E(o, function (k, v) {
                    append(v, c)
                });
            } else if (D(o)) {
                if (LA(c)) {
                    E(c, function (k, v) {
                        append(o, v)
                    });
                } else {
                    o.appendChild(D(c) ? c : doc.createTextNode(c))
                }
            }
        }
        function before(o, c) {
            c = VC(c);
            if (LA(o)) E(o, function (k, v) {
                before(v, c)
            });
            else if (D(o)) {
                if (LA(c)) E(c, function (k, v) {
                    before(o, v)
                });
                else {
                    o.parentNode.insertBefore(D(c) ? c : doc.createTextNode(c), o)
                }
            }
        }

        function after(o, c) {
            if (D(o)) {
                var n = GN(o);
                n ? before(n, c) : append(o.parentNode, c)
            } else if (LA(o)) E(o, function (i, v) {
                after(v, c)
            })
        }

        function css(o, k, v) {
            k = S(k) && !N(v) ? toO('{"' + k + '":"' + toFV(v) + '"}') : k;
            if (LA(o)) {
                if (S(k)) return css(o[0], k);
                E(o, function (i, j) {
                    css(j, k)
                })
            } else if (D(o)) {
                if (S(k)) return o.style[FM(k)];
                v = "";
                E(k, function (i, j) {
                    v += FM(i) + ':' + j + ';'
                });
                o.style.cssText += ';' + v
            }
        }

        function attr(o, k, v, t) {
            if (LA(o)) {
                if (S(k) && N(v)) return attr(o[0], k, v, t);
                E(o, function (i, j) {
                    attr(j, k, v, t)
                })
            } else if (!N(o)) {
                if (S(k) && N(v)) return o[k] ? o[k] : o.getAttribute(k);
                if (isP(k)) E(k, function (i, j) {
                    attr(o, i, j, t)
                });
                else (t || !SE()) ? o[k] = toFV(v) : o.setAttribute(k, toFV(v))
            }
        }

        function clone(o, t) {
            if (D(o)) {
                return o.cloneNode(t == !0)
            }
            var r = new o.constructor(o.valueOf());
            E(o, function (k, v) {
                r[k] = r[k] != v && Q.isObject(v) ? clone(v, t) : v
            })
            return r
        }

        function ready(fun) {
            function f() {
                fun(Q)
            };
            if (readyRE.test(doc.readyState)) f();
            else if (SE()) Q(doc).bind('DOMContentLoaded', f);
            else {
                Q(doc).bind("readystatechange", f)
            }
        }
        var dn = "$Qmikdata:";

        function data(o, k, v) {
            if (LA(o)) {
                if (S(k) && N(v)) return data(o[0], k, v);
                E(o, function (i, j) {
                    data(j, k, v)
                })
            } else if (!N(o)) {
                if (N(o[dn])) o[dn] = {};
                if (N(v) && S(k)) return o[dn][k];
                S(k) ? o[dn][k] = v : E(k, function (i, j) {
                    o[dn][i] = j
                });
            }
        }

        function queue(o, k, f) {
            if (isF(k)) {
                f = k;
                k = "fx"
            }
            k = "queue$" + (k || "fx");
            var s = data(o, k) || [];
            if (A(f)) data(o, k, toV(f, F));
            else if (isF(f)) {
                s.push(f);
                data(o, k, s)
            }
            return N(f) ? A(f) ? f : s : o
        }
        var rK = /[\S-_]+=/,
			rC = /[.][\S-_]+/;

        function TKV(select) { //div[name=aa] get div name aa
            var s = select,
				tags = match.TAG.exec(s),
				tag = "",
				k, v, type = 1;
            if (tags) tag = tags[0];
            s = s.replace(tag, "").replace(/^\s*\[/, "").replace(/\]\s*$/, "");
            k = T(rK.exec(s)[0]);
            if (k.match(/!\s*=$/)) type = 2;
            k = k.replace(/!?=$/, "");
            v = T(s.replace(rK, "")).replace(/"$/, "").replace(/^"/, "");
            v = v || "true";
            return [tag, k, v, type]
        }

        function TC(select) { //div.cc get div cc
            var s = select,
				tags = match.TAG.exec(s),
				tag = "",
				cn;
            if (tags) tag = tags[0];
            s = s.replace(tag, "");
            cn = rC.exec(s);
            cn = cn ? T(cn[0]).replace(/^\s*[.]/, "") : "";
            return [tag, cn]
        }

        function at(o, n) {
            return o[n] || o.getAttribute(n)
        }

        function compile(s, qa) { //编译查询条件，返回[{type,query,isChild}...]
            var st, n, isChild = /^\s*>\s*/.test(s);
            s = s.replace(/^\s*>?\s*/, "");
            qa = qa || [];
            for (st in match) {
                n = match[st].exec(s);
                if (n) break
            }
            if (!n) return qa;
            n = T(n[0]);
            s = s.replace(n, "");
            qa.push({
                type: st,
                query: n,
                isChild: isChild
            });
            return compile(s, qa)
        }
        //找compile()解析出的对象,判断当前的查找条件是否满足其对应的父查询条件 isCycle:是否遍历父节点,默认true
        function adapRule(o, qa, isCycle, c) {
            if (!D(o)) return !1;
            c = c || doc;
            isCycle = N(isCycle) ? !0 : isCycle;
            var s = qa.query,
				isGP = !qa.isChild && (isCycle != !1),
				p = o.parentNode;
            if (!D(p)) return !1;
            if (!NGP(c, o)) return !1;
            switch (qa.type) {
                case 'ID':
                    return (at(p, "id") == T(s.replace(/^#/, ""))) ? !0 : isGP ? adapRule(p, qa, isCycle, c) : !1;
                case 'ATTR':
                    var ds = TKV(s),
                        tag = ds[0],
                        k = ds[1],
                        v = ds[2];
                    return (toL(p.tagName) == tag && at(p, k) == v) ? !0 : isGP ? adapRule(p, qa, isCycle, c) : !1;
                case 'CT':
                    var ds = TC(s),
                        tag = ds[0],
                        className = ds[1];
                    if (tag) {
                        return (toL(p.tagName) == tag && HC(p, className)) ? !0 : isGP ? adapRule(p, qa, isCycle, c) : !1
                    } else {
                        return HC(p, className) ? !0 : isGP ? adapRule(p, qa, isCycle, c) : !1
                    }
                case 'TAG':
                    return (toL(p.tagName) == s) ? !0 : isGP ? adapRule(p, qa, isCycle, c) : !1;
            }
            return !1
        }

        function FD(s, c) {
            if (s == "") return [];
            return AS(c.querySelectorAll(s))
        }

        function GN(v, t) {
            if (v) {
                v = t == "prev" ? v.previousSibling : v.nextSibling;
                return D(v) ? v : GN(v, t)
            }
        }

        function QM(s, c) {
            var m = this,
				r, c = c || doc,
				fd = settings.find,
				i;
            if (S(s)) {
                if (rNode.test(s)) {
                    var t = doc.createElement('div');
                    t.innerHTML = s;
                    r = t.childNodes
                } else {
                    r = fd ? fd(s, c) : FD(s, c)
                }
            } else {
                r = LA(s) ? s : [s]
            }
            r = r || [];
            for (i = 0; i < r.length; i++) m[i] = r[i];
            m.selector = s;
            m.context = c;
            m.length = r.length;
            return m
        }
        fn = Q.fn = QM.prototype = {};

        function init(selector, context) {
            var s = selector,
				c = context || doc,
				co;
            s = S(s) ? T(s) : s;
            if (isF(s)) {
                Q(doc).ready(s);
                return
            }
            return isQ(s) ? s : new QM(s, c);
        }
        Q.fn.extend = function (o) {
            E(o, function (k, v) {
                QM.prototype[k] = v
            });
            initList(o)
        }

        function upon(m, s, t) {
            var r = [],
				f;
            E(m, function (i, v) {
                N(s) ? r.push(GN(v, t)) : E($(">" + s, v.parentNode), function (j, h) {
                    if (!f) {
                        for (var z = v; z = GN(z) ;) {
                            if (z == h) {
                                r.push(h);
                                f = !0;
                                return
                            }
                        }
                    }
                })
            })
            return new QM(r, m)
        }
        Q.fn.extend({
            last: function () {
                return Q(this[this.length - 1])
            },
            eq: function (i) {
                return Q(this[i])
            },
            first: function () {
                return Q(this[0])
            },
            filter: function (f) {
                var r = new QM(),
					c = 0;
                E(this, function (i, v) {
                    if (f(i, v)) r[c++] = v
                });
                r.length = c;
                return r
            },
            even: function () {
                return this.filter(function (i, v) {
                    return i % 2 == 0
                })
            },
            odd: function () {
                return this.filter(function (i, v) {
                    return i % 2 != 0
                })
            },
            gt: function (i) {
                var r = new QM(),
					c = 0;
                for (; i < this.length; i++) {
                    r[c++] = this[i]
                };
                r.length = c;
                return r
            },
            lt: function (i) {
                var r = new QM(),
					c = 0;
                for (; i >= 0; i--) {
                    r[c++] = this[i]
                };
                r.length = c;
                return r
            },
            find: function (s) {
                return new QM(s, this)
            },
            each: function (f) {
                E(this, f)
            },
            append: function (c) {
                append(this, c);
                return this
            },
            remove: function () {
                E(this, function (i, v) {
                    var p = v.parentNode;
                    D(p) && p.removeChild(v)
                });
                return this
            },
            before: function (c) {
                before(this, c);
                return this
            },
            after: function (c) {
                after(this, c);
                return this
            },
            html: function (v) {
                if (arguments.length < 1) return attr(this, "innerHTML");
                else attr(this, "innerHTML", isQ(v) ? v.html() : v, !0);
                return this
            },
            empty: function () {
                this.html("");
                return this
            },
            text: function (v) {
                var r = attr(this, "innerText", isQ(v) ? v.text() : v, !0);
                return N(v) ? r : this
            },
            addClass: function (n) {
                E(this, function (i, v) {
                    if (D(v) && !HC(v, n)) v.className += ' ' + T(toFV(n))
                });
                return this
            },
            rmClass: function (n) {
                var r = new RegExp(toFV(n).replace(/\s+/g, "|"), 'g');
                E(this, function (i, v) {
                    v.className = T(v.className.replace(r, '')).replace(/[\s]+/g, ' ')
                });
                return this
            },
            show: function () {
                css(this, 'display', 'block');
                return this
            },
            hide: function () {
                css(this, 'display', 'none');
                return this
            },
            toggle: function () {
                E(this, function (i, v) {
                    css(v, 'display') == 'none' ? $(v).show() : $(v).hide()
                });
                return this
            },
            map: function (callback) {
                return Q.map(this, callback)
            },
            ready: function (fun) {
                ready(fun);
                return this
            },
            css: function (k, v) {
                var r = css(this, k, v);
                return isP(k) || (S(k) && !N(v)) ? this : r
            },
            attr: function (k, v) {
                var r = attr(this, k, v);
                return (arguments.length > 1 || isP(k)) ? this : r
            },
            rmAttr: function (k) {
                E(this, function (i, v) {
                    D(v) && v.removeAttribute(k)
                })
            },
            data: function (k, v) {
                return data(this, k, v)
            },
            rmData: function (k) {
                E(this, function (i, v) {
                    if (v.$Qmikdata) delete v.$Qmikdata[k]
                })
            },
            val: function (v) {
                if (N(v)) return this.attr("value") || "";
                E(this, function (i, u) {
                    Q(u).attr("value", v)
                })
            },
            serialize: function () {
                var r = [];
                if (this) r = Q('input', this);
                else E(this, function (i, v) {
                    if (D(v)) Q.merge(r, Q.serializeArray(Q('input', v)))
                });
                return Q.serialize(r)
            },
            next: function (s) {
                return upon(this, s, "next")
            },
            prev: function (s) {
                return upon(this, s, "prev")
            },
            queue: function (k, v) {
                return queue(this, k, v)
            },
            dequeue: function (k) {
                var a = queue(this, k);
                a[0] && a[0]();
                a.splice(0, 1);
                return this
            },
            clearQueue: function (k) {
                queue(this, k, []);
                return this
            },
            clone: function (t) {
                return clone(this, t)
            },
            hover: function (fi, fo) {
                this.bind("mouseover", fi).bind("mouseout", fo).bind("touchstart", function () {
                    fi();
                    Q.delay(fo, 500)
                }).bind("touchmove", fo)
            },
            hasClass: function (c) {
                return HC(this[0], c)
            },
            closest: function (s) {//查找最近的匹配的父(祖父)节点
                return parents(s, this, false)
            },
            parents: function (s) {//查找所有的匹配的父(祖父)节点
                return parents(s, this, true)
            },
            parent: function (s) {//查找匹配的父节点
                return parents(s, this, true, true)
            }
        });
        Q.fn.extend({
            removeClass: fn.rmClass,
            removeData: fn.rmData,
            removeAttr: fn.rmAttr,
            toArray: fn.array
        });
        /**
		 * selector:选择器
		 * qmik:qmik查询对象
		 * isAllP:是否包含所有父及祖父节点 默认true
		 * isOnlyParent:是否只包含父节点 默认false
		 */
        function parents(selector, qmik, isAllP, isOnlyParent) {
            var i = 0,
				m = qmik,
				array = [],
				p, qa = S(selector) ? compile(selector) : null;
            isAllP = N(isAllP) ? !0 : (isAllP != !1);
            isOnlyParent = N(isOnlyParent) ? !1 : (isOnlyParent == !0);
            for (; i < m.length; i++) {
                p = m[i];
                while (p) {
                    if (p.parentNode == doc.body) break;
                    if (N(qa) || adapRule(p, qa[0], false)) {
                        array.push(p.parentNode);
                        if (!isAllP) break
                    }
                    if (isOnlyParent) break;
                    p = p.parentNode;
                }
            }
            return Q(array);
        }

        var qwc = "touchstart touchmove touchend focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change select keydown keypress keyup error".split(" ");
        E(qwc, function (i, v) {
            Q.fn[v] = function (f) {
                return this.bind(v, f)
            }
        });
        Q.encode = e;
        Q.decode = d;
        Q.event = {};
        Q.fn.ui = {}, Q.settings = settings;
        Q.version = "0.91.008";
        win.Qmik = Q;
        win.$ = win.$ || Q;
    }
    new QmikNode(window)
})();
(function (Q) {
    Q.exec = function (v) {
        return eval(v)
    }
})(Qmik);
(function (Q) { /*query*/
    var win = window,
		doc = win.document,
		isQ = Q.isQmik,
		N = Q.isNull,
		E = Q.each,
		D = Q.isElement,
		toU = Q.toUpper,
		sets = Q.settings,
		TKV = sets.resoTKV,
		TC = sets.resoTC,
		match = sets.regular.querys,
		rNode = sets.regular.node,
		HC = sets.hasClass,
		SE = Q.isStandard;

    function at(target, name) {
        return target[name] || target.getAttribute(name)
    }

    function fa(r, k, v, t) {
        var q, p, tr = [],
			u = k == "class";
        E(r, function (i, n) {
            if (D(n)) {
                p = at(n, k);
                p = p ? p : (u ? n.className : p);
                q = u ? new RegExp(v.replace(/[ ]/g, "|")).test(p) : p == v;
                t ? q && tr.push(n) : !q && tr.push(n);
            }
        })
        return tr
    }

    function byId(o, s) {
        s = s.replace(/^#/, "");
        var t, r = doc.getElementById(s);
        t = [r];
        return N(r) ? [] : o == doc ? t : byAttr(o, "[id=\"" + s + "\"]")
    }

    function byAttr(o, s) {
        o = o || doc;
        var st = TKV(s),
			t = st[0],
			k = st[1],
			v = st[2],
			y = s.indexOf('!=') == -1;
        return fa(AS(o.getElementsByTagName(t || "*")), k, v, y);
    }
    var compile = sets.compile;//编译查询条件，返回[{type,query,isChild}...]

    function AS(a) {
        return SE() ? a.slice(0, a.length) : a
    }

    function FDO(c, qa) {
        var q = qa.query,
			r;
        if (qa.isChild) {
            var cs = AS(c.childNodes);
            r = [];
            for (var i = 0, t; i < cs.length; i++) {
                t = cs[i];
                if (D(t)) {
                    switch (qa.type) {
                        case 'ID':
                            if (at(t, "id") == q) r.push(t);
                            break;
                        case 'ATTR':
                            var ds = TKV(q),
                                tn = ds[0],
                                k = ds[1],
                                v = ds[2],
                                type = ds[3],
                                bi;
                            if (type == 1) bi = at(t, k) == v;
                            else bi = at(t, k) != v;
                            if (t.tagName == toU(tn) && bi) r.push(t);
                            break;
                        case 'CT':
                            var ds = TC(q),
                                tn = ds[0],
                                cn = ds[1];
                            if (tn) (t.tagName == toU(tn) && HC(t, cn)) && r.push(t);
                            else HC(t, cn) && r.push(t);
                            break;
                        case 'TAG':
                            t.tagName == toU(q) && r.push(t);
                            break;
                    }
                }
            }
        } else {
            switch (qa.type) {
                case 'ID':
                    r = byId(c, q);
                    break;
                case 'ATTR':
                    r = byAttr(c, q);
                    break;
                case 'CT':
                    var sq = TC(q),
                        t = sq[0] || "",
                        cn = sq[1];
                    r = SE() ?
                    function () {
                        var a = AS(c.getElementsByClassName(cn) || []),
                            g = toU(t);
                        if (t == "") return a;
                        return function (a) {
                            for (var i = a.length - 1; i >= 0; i--) {
                                if (a[i].tagName != g) a.splice(i, 1)
                            };
                            return a
                        }(a);
                    }() : byAttr(c, t + "[class=" + cn + "]");
                    break;
                case 'TAG':
                    r = AS(c.getElementsByTagName(q));
                    break;
            }
        }
        return r
    }

    function FD(s, c, sa) {
        var w = Q.trim(s),
			m = match,
			n, z, f, r = [],
			c = c || doc,
			rs = [];
        if (isQ(c)) {
            E(c, function (i, v) {
                if (D(v)) r = r.concat(FD(s, v))
            });
            return r
        }
        sa = sa || compile(w);
        if (N(sa) || sa.length < 1) return;
        r = FDO(c, sa[0]);
        if (r == null || sa.length < 2) return r;
        w = sa[1].query;
        if (w != '') {
            sa.shift();
            E(r, function (k, x) {

                E(FD(w, x, sa), function (o, p) {
                    Q.inArray(p, rs) < 0 && rs.push(p)
                })
            });
            r = rs
        }
        return r
    }
    Q.settings.find = FD;
})(Qmik);
(function (Q) { /*ajax*/
    var win = window,
		toO = Q.parseJSON,
		ac = {
		    type: 'GET',
		    async: !0,
		    cache: !1,
		    cacheType: "session",
		    //session or local
		    dataType: 'text',
		    xhr: function () {
		        try {
		            return win.XMLHttpRequest && (win.location.protocol !== 'file:' || !win.ActiveXObject) ? new win.XMLHttpRequest() : new win.ActiveXObject('Microsoft.XMLHTTP')
		        } catch (e) { }
		    }
		};

    function ajax(conf) {
        var s = Q.extend({}, ac, conf),
			k = "ajax:" + s.url,
			t = s.dataType,
			h = ac.xhr(),
			b = s.data,
			i, u = s.timeout,
			su = s.success,
			se = s.error,
			ct = s.cacheType == "local",
			ca = s.cache,
			v;
        s.beforeSend && s.beforeSend();
        h.onreadystatechange = function () {
            if (4 == h.readyState) {
                if (200 == h.status) {
                    clearTimeout(i);
                    var v = t == 'xml' ? h.responseXML : (t == 'json' ? toO(h.responseText) : h.responseText);
                    su && su(v);
                } else {
                    se && se(h.xhr, h.type)
                }
            }
        };
        h.open(s.type, s.url, s.async);
        h.setRequestHeader("Cache-Control", "no-cache");
        h.send(s.type == "GET" ? Q.param(b) : b);
        if (u > 0) i = Q.delay(function () {
            h.abort();
            se && se(h.xhr, h.type)
        }, u)
    }

    function get(u, d, f, dt, t) {
        ajax({
            url: u,
            data: d,
            success: f,
            dataType: dt,
            type: t
        })
    }
    Q.extend({
        ajax: ajax,
        get: get,
        getJSON: function (u, f) {
            get(u, null, f, 'json')
        },
        post: function (url, data, callback, type) {
            if (isF(data)) {
                type = callback;
                callback = data;
                data = null;
            }
            ajax({
                url: url,
                data: data,
                success: callback,
                type: type
            })
        },
    })
})(Qmik);
(function (Q) { /*event*/
    var win = window,
		doc = win.document,
		ek = "$QmikEvents",
		N = Q.isNull,
		F = Q.isFun,
		SE = Q.isStandard,
		D = Q.isElement,
		E = Q.each;

    function Eadd(o, n, f, p) {
        var t = Q(o),
			d = t.data(ek),
			h;
        if (N(d)) {
            d = {};
            t.data(ek, d)
        }
        h = d[n];
        if (!h) {
            d[n] = h = [];
            if (F(o['on' + n])) h[0] = o['on' + n];
            if (SE()) o.addEventListener(n, handle, !1);
            else o["on" + n] = handle;
        }
        if (F(f)) h.push({
            fun: f,
            param: p || []
        })
    }

    function Erm(o, n, f) {
        var s = Q(o).data(ek) || {},
			h = s[n] || [],
			i = h.length - 1;
        if (f) for (; i >= 0; i--) h[i].fun == f && h.splice(i, 1);
        else if (D(o)) {
            if (SE()) o.removeEventListener(n, handle, !1);
            else o["on" + n] = null;
            delete s[n]
        }
    }

    function Etrig(o, n) {
        var e;
        if (SE() && D(o)) {
            switch (n) {
                case "hashchange":
                    e = doc.createEvent("HashChangeEvent");
                    break;
                default:
                    e = doc.createEvent("MouseEvents");
            }
            e.initEvent(n, !0, !0);
            o.dispatchEvent(e)
        } else o.fireEvent('on' + n);
    }

    function handle(e) {
        e = e || fixEvent(win.event);
        var m = SE() ? this : e.target,
			f, p, h = Q(m).data(ek) || [];
        E(h[e.type], function (i, v) {
            f = v.fun;
            p = v.param || [];
            E(p, function (j, a) {
                if (Q.isEvent(a)) p[j] = e
            })
            F(f) && f.apply(m, p.length < 1 ? [e] : p)
        })
    }

    function fixEvent(e) {
        e.preventDefault = function () {
            this.returnValue = !0
        };
        e.stopPropagation = function () {
            this.cancelBubble = !0
        };
        return e
    }
    Q.fn.extend({
        on: function (n, f) {
            var p = Array.prototype.slice.call(arguments, 2);
            E(this, function (k, v) {
                Q.isPlainObject(n) ?
                    E(n, function (k, j) {
                        Eadd(v, k, j, f)
                    }) :
                    Eadd(v, n, f, p)
            });
            return this
        },
        un: function (n, f) {
            E(this, function (k, v) {
                Erm(v, n, f)
            });
            return this
        },
        once: function (name, fun) {//只执行一次触发事件,执行后删除
            var me = this,
                oneexec = function () {
                    fun.apply(fun);
                    me.un(name, oneexec)
                }
            me.on(name, oneexec)
        },
        trigger: function (n) {
            E(this, function (k, v) {
                Etrig(v, n)
            });
            return this
        },
        live: function (name, fun) {
            var selector = this.selector;
            Q("body").on(name, function (e) {
                if ($(e.target.childNodes[0]).closest(selector).length > 0) {
                    fun.apply(event.target, [e]);
                }
            })
        },
        die:function(name,fun){
            E(Q(document.body), function (k, v) {
                Erm(v, name, fun)
            });
            return this       	
        }
    });
    Q.fn.extend({
        bind: Q.fn.on,
        unbind: Q.fn.un
    });
})(Qmik);
(function (Q) {//location位置+效果
    var win = window,
	doc = win.document,
	N = Q.isNull,
	D = Q.isElement;

    //计算元素的X(水平，左)位置
    function pageX(elem) {
        return elem.offsetParent ?
			elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft
    }

    //计算元素的Y(垂直，顶)位置
    function pageY(elem) {
        return elem.offsetParent ?
			elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop
    }
    //查找元素在其父元素中的水平位置
    function parentX(elem) {
        return elem.parentNode == elem.offsetParent ?
		   elem.offsetLeft : pageX(elem) - pageX(elem.parentNode)
    }

    //查找元素在其父元素中的垂直位置
    function parentY(elem) {
        return elem.parentNode == elem.offsetParent ?
				elem.offsetTop : pageY(elem) - pageY(elem.parentNode)
    }

    Q.fn.extend({
        width: function (v) {
            var o = this[0];
            return N(o) ? (v || 0) : D(o) ? o.offsetWidth : o == win ? win.screenX : win.screen.availWidth
        },
        height: function (v) {
            var o = this[0];
            return N(o) ? (v || 0) : D(o) ? o.offsetHeight : o == win ? win.screenY : win.screen.availHeight
        },
        offset: function () {//获取匹配元素在当前视口的相对偏移
            if (!this[0]) return null;
            var obj = this[0].getBoundingClientRect();
            return {
                left: obj.left + win.pageXOffset,
                top: obj.top + win.pageYOffset,
                width: obj.width,
                height: obj.height
            };
        },
        position: function () {//获取匹配元素相对父元素的偏移。
            var o = this[0];
            if (!o) return null;
            return {
                left: parentX(o),
                top: parentY(o),
                width: obj.width,
                height: obj.height
            }
        },
        animate: function (styles, speed, easing, callback) {
            var m = this;
            Q.delay(function () {
                m.css(styles)
            }, speed || 500)
        }
    });
})(Qmik);