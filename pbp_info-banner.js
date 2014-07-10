/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
 (function (factory) {
 	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	function converted(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			return config.json ? JSON.parse(s) : s;
		} catch(er) {}
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				config.raw ? key : encodeURIComponent(key),
				'=',
				config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
				].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key === name) {
				result = converted(cookie);
				break;
			}

			if (!key) {
				result[name] = converted(cookie);
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));

(function(j){
	settings = proboards.plugin.get('info_banner').settings;
	settings.animate = (settings.animate == "1") ? true : false;
	settings.dismissible = (settings.dismissible == "1") ? true : false;
	$body = $($('body')[0]);
	$banner = $('<div>')
	.addClass('info-banner')
	.append(
		$('<span>')
		.addClass('info-banner-content')
		.html(
			function(bannerText){
				return bannerText.replace(
					/(?:\[(?:url|a)\]((?:[a-zA-Z]+\:\/\/)?[^\[\"]+)\[\/(?:url|a)\]|\[(?:url|a)(?: href=(?:\'|\")([^\'\"]+)(?:\'|\")|=([^\]]+))\]([^\[]+)\[\/(?:url|a)\])/ig,
					function(match, group1, group2, group3, group4, offset, original){
						if (group1 != undefined && group1 != "") {
							url = group1;
							text = group1;
						} else if (group2 != undefined && group2 != "") {
							url = group2;
							text = group4;
						} else if (group3 != undefined && group3 != "") {
							url = group3;
							text = group4;
						} else {
							return match;
						}
						return '<a href="'+url+'">'+text+'</a>';
					}
					);
			}(
				settings.banner_text
				)
			)
		)
	.css({
		'background-color': '#'+settings.background_color,
		'color': '#'+settings.text_color,
		'height': ((settings.banner_height)?settings.banner_height:20)+'px',
		'line-height': ((settings.banner_height)?settings.banner_height:20)+'px'
	})
	.hide();
	$banner.bind('dismiss', function(){
		$(this).slideUp();
		$.cookie('banner_value', settings.banner_text, {expires: 99999, path: '/'});
	});
	if (settings.dismissible == 1) {
		$banner.find('.info-banner-content').append($('<a>').text('[Dismiss]').addClass('info-banner-dismiss').click(function(){$(this).parent().trigger('dismiss');}));
		$banner.addClass('info-banner-dismissible');
	} else {
		$banner.addClass('info-banner-fixed');
	}
	
	if ((settings.dismissible && $.cookie('banner_value') != settings.banner_text) || !settings.dismissible) {
		$body.prepend($banner);
		if (settings.dismissible && settings.animate) {
			$banner.delay(200).slideDown();
		} else {
			$banner.show();
		}
	}
})($);