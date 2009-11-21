/*****************************************************************

typeface.js, version 0.11 | typefacejs.neocracy.org

Copyright (c) 2008, David Chester davidchester@gmx.net 

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*****************************************************************/

(function() {

var _typeface_js = {

	faces: {},

	loadFace: function(typefaceData) {

		var familyName = typefaceData.familyName.toLowerCase();
		
		if (!this.faces[familyName]) {
			this.faces[familyName] = {};
		}
		if (!this.faces[familyName][typefaceData.cssFontWeight]) {
			this.faces[familyName][typefaceData.cssFontWeight] = {};
		}

		var face = this.faces[familyName][typefaceData.cssFontWeight][typefaceData.cssFontStyle] = typefaceData;
		face.loaded = true;
	},

	log: {
		debug: function(message) {
			var typefaceConsole = document.getElementById('typeface-console');
			if (typefaceConsole) 
				typefaceConsole.innerHTML += 'DEBUG: ' + message + "<br>";
		},

		error: function(message) {
			var typefaceConsole = document.getElementById('typeface-console');
			if (typefaceConsole) 
				typefaceConsole.innerHTML += 'ERROR: ' + message + "<br>";
		}
	},
	
	pixelsFromPoints: function(face, style, points, dimension) {
		var pixels = points * parseInt(style.fontSize) * 72 / (face.resolution * 100);
		if (dimension == 'horizontal' && style.fontStretchPercent) {
			pixels *= style.fontStretchPercent;
		}
		return pixels;
	},

	pointsFromPixels: function(face, style, pixels, dimension) {
		var points = pixels * face.resolution / (parseInt(style.fontSize) * 72 / 100);
		if (dimension == 'horizontal' && style.fontStretchPrecent) {
			points *= style.fontStretchPercent;
		}
		return points;
	},

	cssFontWeightMap: {
		normal: 'normal',
		bold: 'bold',
		400: 'normal',
		700: 'bold'
	},

	cssFontStretchMap: {
		'ultra-condensed': 0.55,
		'extra-condensed': 0.77,
		'condensed': 0.85,
		'semi-condensed': 0.93,
		'normal': 1,
		'semi-expanded': 1.07,
		'expanded': 1.15,
		'extra-expanded': 1.23,
		'ultra-expanded': 1.45,
		'default': 1
	},
	
	fallbackCharacter: '.',

	getTextExtents: function(face, style, text) {
		var extentX = 0;
		var extentY = 0;
		var horizontalAdvance;
	
		for (var i = 0; i < text.length; i++) {
			var glyph = face.glyphs[text.charAt(i)] ? face.glyphs[text.charAt(i)] : face.glyphs[this.fallbackCharacter];
			var letterSpacingAdjustment = this.pointsFromPixels(face, style, style.letterSpacing);
			extentX += Math.max(glyph.ha, glyph.x_max) + letterSpacingAdjustment;
			horizontalAdvance += glyph.ha + letterSpacingAdjustment;
		}
		return { 
			x: extentX, 
			y: extentY,
			ha: horizontalAdvance
			
		};
	},

	pixelsFromCssAmount: function(cssAmount, defaultValue) {

		var matches = undefined;

		if (cssAmount == 'normal') {
			return defaultValue;

		} else if (matches = cssAmount.match(/([\-\d+\.]+)px/)) {
			return matches[1];

		} else if (matches = cssAmount.match(/([\-\d\.]+)pt/)) {
			return matches[1] * 100 / 75;
		} else {
			return defaultValue;
		}
	},

	getRenderedText: function(e) {

		var browserStyle = window.getComputedStyle ? 
			document.defaultView.getComputedStyle(e.parentNode, '') : 
			e.parentNode.currentStyle ? 
				e.parentNode.currentStyle : 
				{ color: '#ff0000', fontSize: 12, fontFamily: 'arial' };

		var inlineStyleAttribute = e.parentNode.getAttribute('style');
		if (inlineStyleAttribute && typeof(inlineStyleAttribute) == 'object') {
			inlineStyleAttribute = inlineStyleAttribute.cssText;
		}

		if (inlineStyleAttribute) {

			var inlineStyleDeclarations = inlineStyleAttribute.split(/\s*\;\s*/);

			var inlineStyle = {};
			for (var i = 0; i < inlineStyleDeclarations.length; i++) {
				var declaration = inlineStyleDeclarations[i];
				var declarationOperands = declaration.split(/\s*\:\s*/);
				inlineStyle[declarationOperands[0]] = declarationOperands[1];
			}
		}

		var style = { 
			color: browserStyle.color, 
			fontFamily: browserStyle.fontFamily.split(/\s*,\s*/)[0].replace(/(^"|^'|'$|"$)/g, '').toLowerCase(), 
			fontSize: this.pixelsFromCssAmount(browserStyle.fontSize, 12),
			fontWeight: this.cssFontWeightMap[browserStyle.fontWeight],
			fontStyle: browserStyle.fontStyle ? browserStyle.fontStyle : 'normal',
			fontStretchPercent: this.cssFontStretchMap[inlineStyle && inlineStyle['font-stretch'] ? inlineStyle['font-stretch'] : 'default'],
			textDecoration: browserStyle.textDecoration,
			lineHeight: this.pixelsFromCssAmount(browserStyle.lineHeight, 'normal'),
			letterSpacing: this.pixelsFromCssAmount(browserStyle.letterSpacing, 0)
		};

		var face;
		if (
			this.faces[style.fontFamily] && 
			this.faces[style.fontFamily][style.fontWeight]
		) {
			face = this.faces[style.fontFamily][style.fontWeight][style.fontStyle];
		}

		if (!face) {
			return;
		}
	
		var text = e.nodeValue.replace(/(?:^\s+|\s+$)/g, '');
		text = text.replace(/\s+/g, ' ');
		var words = text.split(/\s/);

		var containerSpan = document.createElement('span');

		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			var delimiter = i == words.length - 1 ? '' : ' ';
			var vectorElement = this.renderWord(face, style, word + delimiter);
			if (vectorElement)
				containerSpan.appendChild(vectorElement);
		}

		return containerSpan;
	},

	renderDocument: function(callback) { // args: onComplete
		
		if (this.renderDocumentLock) 
			return;

		this.renderDocumentLock = true;

		if (!callback)
			callback = function(e) { e.style.visibility = 'visible' };

		var elements = document.getElementsByTagName('*');
		
		var elementsLength = elements.length;
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].className.match(/(^|\s)typeface-js(\s|$)/) || elements[i].tagName.match(/^(H1|H2|H3|H4|H5|H6)$/)) {
				this.replaceText(elements[i]);
				if (typeof callback == 'function') {
					callback(elements[i]);
				}
			}
		}
	},

	replaceText: function(e) {
		if (e.hasChildNodes()) {
			var childNodes = [];
			for (var i = 0; i < e.childNodes.length; i++) {
				childNodes[i] = e.childNodes[i];
			}
			for (var i = 0; i < childNodes.length; i++) {
				this.replaceText(childNodes[i]);
			}
		}

		if (e.nodeType == 3 && e.nodeValue.match(/\S/)) {
			var parentNode = e.parentNode;
		
			var renderedText = this.getRenderedText(e);
			
			if (renderedText) {	
				parentNode.insertBefore(renderedText, e);
				parentNode.removeChild(e);
			}	
		}
	},

	applyElementVerticalMetrics: function(face, style, e) {

		var boundingBoxAdjustmentTop = this.pixelsFromPoints(face, style, face.ascender - Math.max(face.boundingBox.yMax, face.ascender)); 
		var boundingBoxAdjustmentBottom = this.pixelsFromPoints(face, style, Math.min(face.boundingBox.yMin, face.descender) - face.descender); 
				
		var cssLineHeightAdjustment = 0;
		if (style.lineHeight != 'normal') {
			cssLineHeightAdjustment = style.lineHeight - this.pixelsFromPoints(face, style, face.lineHeight);
		}
		
		var marginTop = Math.round(boundingBoxAdjustmentTop + cssLineHeightAdjustment / 2);
		var marginBottom = Math.round(boundingBoxAdjustmentBottom + cssLineHeightAdjustment / 2);

		e.style.marginTop = marginTop + 'px';
		e.style.marginBottom = marginBottom + 'px';
	
	},

	vectorBackends: {

		canvas: {

			_initializeSurface: function(face, style, text) {

				var extents = this.getTextExtents(face, style, text);

				var canvas = document.createElement('canvas');
				canvas.innerHTML = text;

				this.applyElementVerticalMetrics(face, style, canvas);
				canvas.height = Math.round(this.pixelsFromPoints(face, style, face.lineHeight));

				canvas.width = Math.round(this.pixelsFromPoints(face, style, extents.x, 'horizontal'));
	
				if (extents.x > extents.ha) 
					canvas.style.marginRight = Math.round(this.pixelsFromPoints(face, style, extents.x - extents.ha, 'horizontal')) + 'px';

				var ctx = canvas.getContext('2d');

				var pointScale = this.pixelsFromPoints(face, style, 1);
				ctx.scale(pointScale * style.fontStretchPercent, -1 * pointScale);
				ctx.translate(0, -1 * face.ascender);
				ctx.fillStyle = style.color;

				return { context: ctx, canvas: canvas };
			},

			_renderGlyph: function(ctx, face, char, style) {

				var glyph = face.glyphs[char];

				if (!glyph) {
					//this.log.error("glyph not defined: " + char);
					return this.renderGlyph(ctx, face, this.fallbackCharacter, style);
				}

				if (glyph.o) {

					var outline;
					if (glyph.cached_outline) {
						outline = glyph.cached_outline;
					} else {
						outline = glyph.o.split(' ');
						glyph.cached_outline = outline;
					}

					for (var i = 0; i < outline.length; ) {

						var action = outline[i++];

						switch(action) {
							case 'm':
								ctx.moveTo(outline[i++], outline[i++]);
								break;
							case 'l':
								ctx.lineTo(outline[i++], outline[i++]);
								break;

							case 'q':
								var cpx = outline[i++];
								var cpy = outline[i++];
								ctx.quadraticCurveTo(outline[i++], outline[i++], cpx, cpy);
								break;
						}
					}					
				}
				if (glyph.ha) {
					var letterSpacingPoints = 
						style.letterSpacing && style.letterSpacing != 'normal' ? 
							this.pointsFromPixels(face, style, style.letterSpacing) : 
							0;

					ctx.translate(glyph.ha + letterSpacingPoints, 0);
				}
			},

			_renderWord: function(face, style, text) {
				var surface = this.initializeSurface(face, style, text);
				var ctx = surface.context;
				var canvas = surface.canvas;
				ctx.beginPath();
				ctx.save();

				var chars = text.split('');
				for (var i = 0; i < chars.length; i++) {
					var char = chars[i];
					this.renderGlyph(ctx, face, char, style);
				}

				ctx.fill();

				if (style.textDecoration == 'underline') {

					ctx.beginPath();
					ctx.moveTo(0, face.underlinePosition);
					ctx.restore();
					ctx.lineTo(0, face.underlinePosition);
					ctx.strokeStyle = style.color;
					ctx.lineWidth = face.underlineThickness;
					ctx.stroke();
				}

				return ctx.canvas;
			}
		},

		vml: {

			_initializeSurface: function(face, style, text) {

				var shape = document.createElement('v:shape');

				var extents = this.getTextExtents(face, style, text);
				
				shape.style.width = style.fontSize + 'px'; 
				shape.style.height = style.fontSize + 'px'; 

				if (extents.x > extents.ha) {
					shape.style.marginRight = this.pixelsFromPoints(face, style, extents.x - extents.ha, 'horizontal') + 'px';
				}

				this.applyElementVerticalMetrics(face, style, shape);

				shape.coordsize = (face.resolution * 100 / style.fontStretchPercent / 72 ) + "," + (face.resolution * 100 / 72);
				
				shape.coordorigin = '0,' + face.ascender;
				shape.style.flip = 'y';

				shape.fillColor = style.color;
				shape.stroked = false;

				shape.path = 'hh m 0,' + face.ascender + ' l 0,' + face.descender + ' ';

				return shape;
			},

			_renderGlyph: function(shape, face, char, offsetX, style) {

				var glyph = face.glyphs[char];

				if (!glyph) {
					//this.log.error("glyph not defined: " + char);
					this.renderGlyph(shape, face, this.fallbackCharacter, offsetX, style);
				}
				
				var vmlSegments = [];

				if (glyph.o) {
					
					var outline;
					if (glyph.cached_outline) {
						outline = glyph.cached_outline;
					} else {
						outline = glyph.o.split(' ');
						glyph.cached_outline = outline;
					}

					var prevAction, prevX, prevY;

					var i;
					for (i = 0; i < outline.length;) {

						var action = outline[i++];
						var vmlSegment = '';

						var x = Math.round(outline[i++]) + offsetX;
						var y = Math.round(outline[i++]);
	
						switch(action) {
							case 'm':
								vmlSegment = (vmlSegments.length ? 'x ' : '') + 'm ' + x + ',' + y;
								break;
	
							case 'l':
								vmlSegment = 'l ' + x + ',' + y;
								break;

							case 'q':
								var cpx = Math.round(outline[i++]) + offsetX;
								var cpy = Math.round(outline[i++]);

								var cp1x = Math.round(prevX + 2.0 / 3.0 * (cpx - prevX));
								var cp1y = Math.round(prevY + 2.0 / 3.0 * (cpy - prevY));

								var cp2x = Math.round(cp1x + (x - prevX) / 3.0);
								var cp2y = Math.round(cp1y + (y - prevY) / 3.0);

								vmlSegment = 'c ' + cp1x + ',' + cp1y + ',' + cp2x + ',' + cp2y + ',' + x + ',' + y;
								break;
						}
						
						prevAction = action;
						prevX = x;
						prevY = y;
				
						if (vmlSegment.length) {
							vmlSegments.push(vmlSegment);
						}
					}					
				}

				vmlSegments.push('x', 'e');
				return vmlSegments.join(' ');
			},

			_renderWord: function(face, style, text) {
				var offsetX = 0;
				var shape = this.initializeSurface(face, style, text);
		
				var letterSpacingPoints = 
					style.letterSpacing && style.letterSpacing != 'normal' ? 
						this.pointsFromPixels(face, style, style.letterSpacing) : 
						0;

				letterSpacingPoints = Math.round(letterSpacingPoints);
				var chars = text.split('');
				for (var i = 0; i < chars.length; i++) {
					var char = chars[i];
					shape.path += this.renderGlyph(shape, face, char, offsetX, style) + ' ';
					offsetX += face.glyphs[char].ha + letterSpacingPoints ;	
				}

				shape.style.marginRight = this.pixelsFromPoints(face, style, face.glyphs[' '].ha) + 'px';
				return shape;
			}

		}

	},

	setVectorBackend: function(backend) {

		var backendFunctions = ['renderWord', 'initializeSurface', 'renderGlyph'];

		for (var i = 0; i < backendFunctions.length; i++) {
			var backendFunction = backendFunctions[i];
			this[backendFunction] = this.vectorBackends[backend]['_' + backendFunction];
		}
	}
};

// IE won't accept real selectors...
var typefaceSelectors = ['.typeface-js', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

if (document.createStyleSheet) { 
	var styleSheet = document.createStyleSheet();
	for (var i = 0; i < typefaceSelectors.length; i++) {
		var selector = typefaceSelectors[i];
		styleSheet.addRule(selector, 'visibility: hidden');
	}

} else if (document.styleSheets && document.styleSheets.length) {
	var styleSheet = document.styleSheets[0];
	document.styleSheets[0].insertRule(typefaceSelectors.join(',') + ' { visibility: hidden; }', styleSheet.cssRules.length); 
}

var backend = !!(window.attachEvent && !window.opera) ? 'vml' : window.CanvasRenderingContext2D || document.createElement('canvas').getContext ? 'canvas' : null;

if (backend == 'vml') {
	
	document.namespaces.add("v");
	
	var styleSheet = document.createStyleSheet();
	styleSheet.addRule('v\\:*', "behavior: url(#default#VML); display: inline-block;");
}

_typeface_js.setVectorBackend(backend);

window._typeface_js = _typeface_js;
	
// based on code by Dean Edwards / Matthias Miller / John Resig

function typefaceInit() {

	// quit if this function has already been called
	if (arguments.callee.done) return;
	
	// flag this function so we don't do the same thing twice
	arguments.callee.done = true;

	// kill the timer
	if (window._typefaceTimer) clearInterval(_typefaceTimer);

	_typeface_js.renderDocument( function(e) { e.style.visibility = 'visible' } );
};

if (/WebKit/i.test(navigator.userAgent)) {

	var _typefaceTimer = setInterval(function() {
		if (/loaded|complete/.test(document.readyState)) {
			typefaceInit(); 
		}
	}, 10);
}

if (document.addEventListener) {
	window.addEventListener('DOMContentLoaded', function() { typefaceInit() }, false);
} 

/*@cc_on @*/
/*@if (@_win32)

document.write("<script id=__ie_onload_typeface defer src=javascript:void(0)><\/script>");
var script = document.getElementById("__ie_onload_typeface");
script.onreadystatechange = function() {
	if (this.readyState == "complete") {
		typefaceInit(); 
	}
};

/*@end @*/

})();
