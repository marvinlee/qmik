// websocket客户端通信框架
;
(function(Q, define) {
	var win = Q.global;
	function newWebSocket(url) {
		var ws;
		if ('WebSocket' in win) {
			ws = new WebSocket(url);
		} else if ('MozWebSocket' in win) {
			ws = new MozWebSocket(url);
		} else {
			Q.log("Unsupported WebSocket");
		}
		return ws;
	}
	function Socket(url) {
		var me = this, ws = newWebSocket(url);
		// event
		ws.onopen = function() {
			me.onopen && me.onopen()
		}
		ws.onclose = function() {
			me.onclose && me.onclose()
		}
		ws.onmessage = function(event) {
			me.onmessage && me.onmessage(event)
		}
		ws.onerror = function(event) {
			me.onerror && me.onerror(event)
		}
		ws.send = function(msg) {
			me.send && me.send(JSON.stringify(msg))
		}
		ws.close = function() {
			me.close && me.close()
		}
		// me function
		me.readyState = function() {
			return ws.readyState
		}
		me.binaryType = function() {
			return ws.binaryType
		}
		me.bufferedAmount = function() {
			return ws.bufferedAmount
		}
		me.protocol = function() {
			return ws.protocol
		}
		me.url = function() {
			return ws.url
		}
		// String type,EventListener listener,[Boolean useCapture]
		/** bing event */
		me.on = me.addEventListent = function(type, listener, useCapture) {
			ws.addEventListener(type, listener, useCapture)
		}
		/** unbind event */
		me.un = me.removeEventListener = function(type, listener, useCapture) {
			ws.removeEventListener(type, listener, useCapture)
		}
		/** 只运行一次触发事件,之后删除事件 */
		me.once = function(type, listener) {
			me.on(type, function() {
				listener();
				me.un(type, listener);
			})
		}
		me.dispatchEvent = function(_event) {
			ws.dispatchEvent(_event)
		}
		me.CLOSED = ws.CLOSED;
		me.CLOSING = ws.CLOSING;
		me.CONNECTING = ws.CONNECTING;
		me.OPEN = ws.OPEN;
	}
	Q.Socket = Socket;
	define(function(require, exports, module) {
		module.exports = Q
	})
})(Qmik, Qmik.define);
