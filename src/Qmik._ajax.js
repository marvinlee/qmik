;
(function(Q) { /* ajax */
	var win = Q.global, toObject = Q.parseJSON, isFun = Q.isFun, ac = {
		type : 'GET',
		async : !0,
		// cache : !1,
		// session or local
		dataType : 'text',
		xhr : function() {
			try {
				return win.XMLHttpRequest && (win.location.protocol !== 'file:' || !win.ActiveXObject)	? new win.XMLHttpRequest()
																																	: new win.ActiveXObject('Microsoft.XMLHTTP')
			} catch (e) {
			}
		}
	};
	function ajax(conf) {
		var _config = Q.extend( {}, ac, conf), dataType = _config.dataType, ttl = _config.timeout, //
		xhr = ac.xhr(), data = _config.data, pid, success = _config.success, error = _config.error //
		;
		_config.beforeSend && _config.beforeSend();
		xhr.onreadystatechange = Q.box(function() {
			if (4 == xhr.readyState) {
				if (200 == xhr.status) {
					clearTimeout(pid);
					success && success(dataType == 'xml' ? xhr.responseXML
																	: (dataType == 'json' ? toObject(xhr.responseText) : xhr.responseText));
				} else {
					error && error(xhr.xhr, xhr.type)
				}
			}
		});
		xhr.open(_config.type, _config.url, _config.async);
		xhr.setRequestHeader("Cache-Control", "no-cache");
		xhr.send(_config.type == "GET" ? Q.param(data) : data);
		if (ttl > 0) pid = Q.delay(function() {
			xhr.abort();
			error && error(xhr.xhr, xhr.type)
		}, ttl)
	}
	function get(url, data, success, dataType, type) {
		ajax( {
			url : url,
			data : data,
			success : success,
			dataType : dataType,
			type : type
		})
	}
	Q.extend( {
		ajax : Q.box(ajax),
		get : get,
		getJSON : function(url, success) {
			get(url, null, success, 'json')
		},
		post : function(url, data, callback, type) {
			if (isFun(data)) {
				type = callback;
				callback = data;
				data = null;
			}
			ajax( {
				url : url,
				data : data,
				success : callback,
				type : type
			})
		}
	})
})(Qmik);
