/**
 * @author Jasman <jasman@ihsana.com>
 * @copyright Ihsana IT Solutiom 2015
 * @license Commercial License
 
 * @package Galau UI
 */
(function() {
	tinymce.PluginManager.add('gui_animate', function(editor, url) {
		var $_ = tinymce.dom.DomQuery;
		var each = tinymce.util.Tools.each;
		var Env = tinymce.Env;
		var animateFx = ["scrollLeft", "scrollRight", "scrollUp", "scrollDown", "bounce", "flash", "pulse", "rubberBand", "shake", "swing", "tada", "wobble", "jello", "bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp", "bounceOut", "bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp", "fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig", "fadeInUp", "fadeInUpBig", "fadeOut", "fadeOutDown", "fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig", "fadeOutRight", "fadeOutRightBig", "fadeOutUp", "fadeOutUpBig", "flip", "flipInX", "flipInY", "flipOutX", "flipOutY", "lightSpeedIn", "lightSpeedOut", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight", "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight", "slideInUp", "slideInDown", "slideInLeft", "slideInRight", "slideOutUp", "slideOutDown", "slideOutLeft", "slideOutRight", "zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp", "zoomOut", "zoomOutDown", "zoomOutLeft", "zoomOutRight", "zoomOutUp", "hinge", "rollIn", "rollOut"];
		animateFx.sort();
		var animateOption = [];
		var css_list = [url + '/assets/css/plugin.min.css'];
		each(animateFx, function(name) {
			animateOption.push({
				text: name,
				value: name,
				onclick: function() {
					changeAnimation(name);
				}
			});
		});
		editor.on('init', function() {
			var animateFormat = {};
			each(animateFx, function(name) {
				format = {
					selector: "p,div,img",
					classes: "animated " + name,
					ids: name,
				};
				formatName = "animated" + name;
				editor.formatter.register(formatName, format);
			});
			editor.addContextToolbar('.animated', 'gui_animate | undo redo | gui_animate_remove');
		});

		function changeAnimation(format) {
			editor.undoManager.transact(function() {
				each(animateFx, function(name) {
					editor.formatter.remove('animated' + name);
				});
				editor.formatter.apply('animated' + format);
			});
			if (window.galau_ui_debug == true) {
				console.log('animate => format: ', 'animated' + format);
			}
		}
		/**
		 * Load config
		 */
		if (typeof editor.settings['gui_animate'] === 'object') {
			var config = editor.settings['gui_animate'];
		}
		var display_toolbar_text = true;
		if (typeof config === 'object') {
			if (typeof config.css !== 'undefined') {
				if (!config.css.exist) {
					if (!config.css.external) {
						css_list.push(url + '/assets/css/animate.min.css');
						if (window.galau_ui_debug == true) {
							console.log('animate => css: internal');
						}
					} else {
						css_list.push(config.css.external);
						if (window.galau_ui_debug == true) {
							console.log('animate => css: external');
						}
					}
				} else {
					if (window.galau_ui_debug == true) {
						console.log('animate => css: exist');
					}
				}
			} else {
				css_list.push(url + '/assets/css/animate.min.css');
				if (window.galau_ui_debug == true) {
					console.log('animate => css: internal');
				}
			}
			if (config.toolbar_text) {
				display_toolbar_text = true;
			} else {
				display_toolbar_text = false;
			}
		} else {
			css_list.push(url + '/assets/css/animate.min.css');
			if (window.galau_ui_debug == true) {
				console.log('animate => css: internal');
			}
		}
		// Include CSS 
		if (typeof editor.settings.content_css !== 'undefined') {
			if (typeof editor.settings.content_css.push === "function") {
				for (var i = 0; i < css_list.length; i++) {
					editor.settings.content_css.push(css_list[i]);
				};
			} else if (typeof editor.settings.content_css === "string") {
				editor.settings.content_css = [editor.settings.content_css];
				for (var i = 0; i < css_list.length; i++) {
					editor.settings.content_css.push(css_list[i]);
				};
			} else {
				editor.settings.content_css = css_list;
			}
		} else {
			editor.settings.content_css = css_list;
		}
		// Include CSS 
		editor.on('init', function() {
			if (document.createStyleSheet) {
				for (var i = 0; i < css_list.length; i++) {
					document.createStyleSheet(css_list[i]);
				}
			} else {
				for (var i = 0; i < css_list.length; i++) {
					cssLink = editor.dom.create('link', {
						rel: 'stylesheet',
						href: css_list[i]
					});
					document.getElementsByTagName('head')[0].appendChild(cssLink);
				}
			}
		});
		var toolbar_text = '';
		if (display_toolbar_text) {
			toolbar_text = 'Animate';
		}
		editor.addButton('gui_animate', {
			icon: 'guicon-fx guicon guicon-fx',
			text: toolbar_text,
			type: 'splitbutton',
			tooltip: 'Insert animate',
			stateSelector: '.animated',
			menu: animateOption,
		});
		editor.addButton('gui_animate_remove', {
			icon: 'remove',
			tooltip: 'remove this animate',
			stateSelector: '.animated',
			onclick: function() {
				editor.undoManager.transact(function() {
					each(animateFx, function(name) {
						editor.formatter.remove('animated' + name);
					});
				});
			},
		});
	});
})();