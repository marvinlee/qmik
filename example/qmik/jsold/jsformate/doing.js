/*
 * JS Beautifier --------------- Written by Einar Lielmanis, <einars@gmail.com>
 * http://jsbeautifier.org/ Originally converted to javascript by Vital,
 * <vital76@gmail.com> You are free to use this in any way you want, in case you
 * find this useful or working for you. Usage: js_beautify(js_source_text);
 * js_beautify(js_source_text, options); The options are: indent_size (default
 * 4) — indentation size, indent_char (default space) — character to indent
 * with, preserve_newlines (default true) — whether existing line breaks should
 * be preserved, indent_level (default 0) — initial indentation level, you
 * probably won't need this ever, e.g js_beautify(js_source_text, {indent_size:
 * 1, indent_char: '\t'});
 */
(function(Q, define) {
	define(function(require, exports, module) {
		var js_beautify = require("beautify").js_beautify;
		function do_js_beautify(qmikquery) {
			var doms = Q(qmikquery);
			doms.each(function(i, dom) {
				var code = Q(dom);
				var js_source = code.val().replace(/^\s+/, '');
				var indent_size = 4;
				var indent_char = ' ';
				var preserve_newlines = true;
				if (indent_size == 1) {
					indent_char = '\t';
				}
				code.html(js_beautify(js_source, {
					indent_size : indent_size,
					indent_char : indent_char,
					preserve_newlines : preserve_newlines
				}))
				return false;
			})
		}
		exports.formate = do_js_beautify;
	})
})(Qmik, Qmik.define);
