/**
 * jQuery.AceTextarea
 */

;(function($, window, document, undefined){

 	var Name = 'AceTextarea',
 		name = Name.toLowerCase();

	// our plugin constructor
	var Plugin = function(dom, options){
			this.dom = dom;
			this.$dom = $(dom);
			this.options = options,
			this.config = $.extend({}, this.defaults, this.options);

			this.initialize();
		};

	window[Name] = Plugin;

	// the plugin prototype
	Plugin.prototype = {
		defaults: {
			ace: {
				theme: 'tomorrow',
				mode: 'javascript',
				wrap: true				
			},
			styles: {
				position: 'relative'
			}
		},

		ace: null,

		initialize: function() {
			this._build();
		},

		update: function() {
			this.ace.setValue(this.$dom.text());
			this.ace.clearSelection();
		},

		_build: function() {
			var editor = this._buildEditor();
			var scope = this;

			this.ace = ace.edit(editor);
			this.ace.setTheme("ace/theme/" + this.config.ace.theme);
			this.ace.getSession().setMode("ace/mode/" + this.config.ace.mode);
			this.ace.getSession().setUseWrapMode(this.config.ace.wrap);

			this.update();

			this.ace.getSession().on('change', function() {
				scope.$dom.val(scope.ace.getValue());
			});
		},

		_copyTextareaStyles: function() {
			var styles = {};
			var scope = this;

			$.each(['margin', 'width', 'height', 'top', 'right', 'bottom', 'left'], function(index, property) {
				styles[property] = scope.$dom.css(property);
			});

			return styles;
		},

		_buildEditor: function() {
			var pre = this.$dom.after('<pre></pre>').next();

			// copy all the styles of the textarea so we can apply to our editor
			var styles = $.extend({}, this._copyTextareaStyles(), this.config.styles);

			$.each(styles, function(property, value) {
				pre.css(property, value);
			});

			// copy textarea value over
			//pre.html(this.$dom.html());

			this.$dom.hide();

			return pre.get(0);
		}
	}

	Plugin.defaults = Plugin.prototype.defaults;

	$.fn[name] = function(method) {
		var args = arguments;
		return this.each(function() {
			var instance = $.data(this, name);

			if(instance && instance[method] && typeof instance[method] == 'function') {
				if(method.indexOf('_') == 0) $.error('Method ' + method + ' is protected.');
				instance[method].apply(instance, Array.prototype.slice.call(args, 1));
			} else if(typeof method == 'object' || !method) {
				$.data(this, name, new Plugin(this, method));
			} else {
				$.error('Method ' +  method + ' does not exist on jQuery.' + name);
			}

		});
	};

})(jQuery, window , document);
