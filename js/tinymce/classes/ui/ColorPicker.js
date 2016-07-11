/**
 * ColorPicker.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Color picker widget lets you select colors.
 *
 * @-x-less ColorPicker.less
 * @class tinymce.ui.ColorPicker
 * @extends tinymce.ui.Widget
 */
define("tinymce/ui/ColorPicker", [
	"tinymce/ui/Widget",
	"tinymce/ui/DragHelper",
	"tinymce/ui/DomUtils",
	"tinymce/util/Color"
], function(Widget, DragHelper, DomUtils, Color) {
	"use strict";

	return Widget.extend({
		Defaults: {
			classes: "widget colorpicker"
		},

		/**
		 * Constructs a new colorpicker instance with the specified settings.
		 *
		 * @constructor
		 * @param {Object} settings Name/value object with settings.
		 * @setting {String} color Initial color value.
		 */
		init: function(settings) {
			this._super(settings);
		},

		postRender: function() {
			var self = this, color = self.color(), hsv, hueRootElm, huePointElm, svRootElm, svPointElm, alphaRootElm, alphaPointElm, alpha;

			hueRootElm = self.getEl('h');
			huePointElm = self.getEl('hp');
			svRootElm = self.getEl('sv');
			svPointElm = self.getEl('svp');
			alphaRootElm = self.getEl('alpha');
			alphaPointElm = self.getEl('alphap');

			console.log(self);
			console.log(self.getEl('h'));
			console.log(self.getEl('hp'));
			console.log(self.getEl('sv'));
			console.log(self.getEl('svp'));
			console.log(self.getEl('alpha'));
			console.log(self.getEl('alphap'));

			function getPos(elm, event) {
				var pos = DomUtils.getPos(elm), x, y;

				x = event.pageX - pos.x;
				y = event.pageY - pos.y;

				x = Math.max(0, Math.min(x / elm.clientWidth, 1));
				y = Math.max(0, Math.min(y / elm.clientHeight, 1));

				return {
					x: x,
					y: y
				};
			}

			function updateOpacity(alpha) {
				DomUtils.css(alphaPointElm, {
					top: (alpha * 100) + '%'
				});

				// alphaRootElm.style.background = new Opacity(alpha);
				self.color().parseAlpha(alpha);

				console.log("updateOpacity");
			}

			function updateColor(hsv, hueUpdate) {
				var hue = (360 - hsv.h) / 360;

				DomUtils.css(huePointElm, {
					top: (hue * 100) + '%'
				});

				if (!hueUpdate) {
					DomUtils.css(svPointElm, {
						left: hsv.s + '%',
						top: (100 - hsv.v) + '%'
					});
				}

				svRootElm.style.background = new Color({s: 100, v: 100, h: hsv.h}).toHex();
				console.log("Parsing 1");
				self.color().parse({s: hsv.s, v: hsv.v, h: hsv.h});
			}

			function updateSaturationAndValue(e) {
				var pos;

				pos = getPos(svRootElm, e);
				hsv.s = pos.x * 100;
				hsv.v = (1 - pos.y) * 100;

				updateColor(hsv);
				self.fire('change');
			}

			function updateHue(e) {
				var pos;

				pos = getPos(hueRootElm, e);
				hsv = color.toHsv();
				hsv.h = (1 - pos.y) * 360;
				updateColor(hsv, true);
				self.fire('change');
			}

			function updateAlpha(e) {
				var pos;

				pos = getPos(alphaRootElm, e);
				alpha = pos.y;
				updateOpacity(alpha);
				self.fire('change');
			}

			self._repaint = function() {
				hsv = color.toHsv();
				updateColor(hsv);
			};

			self._super();

			self._svdraghelper = new DragHelper(self._id + '-sv', {
				start: updateSaturationAndValue,
				drag: updateSaturationAndValue
			});

			self._hdraghelper = new DragHelper(self._id + '-h', {
				start: updateHue,
				drag: updateHue
			});

			self._alphadraghelper = new DragHelper(self._id + '-alpha', {
				start: updateAlpha,
				drag: updateAlpha
			});

			self._hdraghelper = new DragHelper(self._id + '-h', {
				start: 100
			});

			self._alphadraghelper = new DragHelper(self._id + '-alpha', {
				start: 100
			});

			self._repaint();
		},

		rgb: function() {
			return this.color().toRgb();
		},

		value: function(value) {
			var self = this;

			if (arguments.length) {
				self.color().parse(value);

				if (self._rendered) {
					self._repaint();
				}
			} else {
				return self.color().toHex();
			}
		},

		color: function() {
			if (!this._color) {
				this._color = new Color();
			}

			return this._color;
		},

		/**
		 * Renders the control as a HTML string.
		 *
		 * @method renderHtml
		 * @return {String} HTML representing the control.
		 */
		renderHtml: function() {
			var self = this, id = self._id, prefix = self.classPrefix, hueHtml, alphaHtml;
			var stops = '#ff0000,#ff0080,#ff00ff,#8000ff,#0000ff,#0080ff,#00ffff,#00ff80,#00ff00,#80ff00,#ffff00,#ff8000,#ff0000';
			var alphaStops = '#ffffff, #000000';

			function getOldIeFallbackHtml() {
				var i, l, html = '', gradientPrefix, stopsList, alphaStopsList;

				gradientPrefix = 'filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=';
				stopsList = stops.split(',');
				alphaStopsList = alphaStops.split(',');
				for (i = 0, l = stopsList.length - 1; i < l; i++) {
					html += (
						'<div class="' + prefix + 'colorpicker-h-chunk" style="' +
							'height:' + (100 / l) + '%;' +
							gradientPrefix + stopsList[i] + ',endColorstr=' + stopsList[i + 1] + ');' +
							'-ms-' + gradientPrefix + stopsList[i] + ',endColorstr=' + stopsList[i + 1] + ')' +
						'"></div>'
					);
				}

				// html += (
				// 	'<div class="' + prefix + 'colorpicker-h-chunk" style="' +
				// 		'height:' + (100) + '%;' +
				// 		gradientPrefix = alphaStopsList[0] + ',endColorstr=' + alphaStopsList[1] + ');' +
				// 		'-ms-' + gradientPrefix + alphaStopsList[0] + ',endColorstr=' + alphaStopsList[1] + ')' +
				// 	'"></div>'
				// );


				return html;
			}

			var gradientCssText = (
				'background: -ms-linear-gradient(top,' + stops + ');' +
				'background: linear-gradient(to bottom,' + stops + ');'
			);

			var grayGradientCssText = (
				'background: -ms-linear-gradient(top,' + alphaStops + ');' + 'background: linear-gradient(to bottom,' + alphaStops + ');'
			);

			hueHtml = (
				'<div id="' + id + '-h" class="' + prefix + 'colorpicker-h" style="' + gradientCssText + '">' +
					getOldIeFallbackHtml() +
					'<div id="' + id + '-hp" class="' + prefix + 'colorpicker-h-marker"></div>' +
				'</div>'
			);

			alphaHtml = (
				'<div id="' + id + '-alpha" class="' + prefix + 'colorpicker-h" style="' + grayGradientCssText + 'right: -30px;">' +
					getOldIeFallbackHtml() +
					'<div id="' + id + '-alphap" class="' + prefix + 'colorpicker-h-marker" style="top: 100%"></div>' +
				'</div>'
			);

			return (
				'<div id="' + id + '" class="' + self.classes + '">' +
					'<div id="' + id + '-sv" class="' + prefix + 'colorpicker-sv">' +
						'<div class="' + prefix + 'colorpicker-overlay1">' +
							'<div class="' + prefix + 'colorpicker-overlay2">' +
								'<div id="' + id + '-svp" class="' + prefix + 'colorpicker-selector1">' +
									'<div class="' + prefix + 'colorpicker-selector2"></div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					hueHtml +
					alphaHtml +
				'</div>'
			);
		}
	});
});
