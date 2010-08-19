(function($) {
	
	elRTE.prototype.commands._style = function() {
		
		
		this.init = function(rte) {
			var self = this;
			this.rte = rte;
			this.dom = rte.dom;
			this.sel = rte.selection;
			this._input = false;
			
			self.test = function(n) {
				return n.nodeType == 1 && (self.regExp.test(n.nodeName) || $(n).css(self.cssProp) == self.cssValue);
			}
			
			this.rte.bind('keyup', function(e) {
				if (self.rte.utils.isKeyChar(e.keyCode)) {
					self._input = true;
				} else if (self.rte.utils.isKeyArrow(e.keyCode)) {
					self._input = false;
				} 
			}).bind('mouseup', function() {
				self._input = false;
			})
			
		}
		
		
		
		this.state = function() {
			return this.dom.testSelection(this.test, this) ? this._active : this._enabled;
		}
		
		this._unwrap = function(n) {
			if (this.regExp.test(n.nodeName)) {
				this.dom.unwrap(n);
			} else  {
				$(n).css(this.cssProp, '');
			}
		}
		
		this.exec = function() {
			
			var self = this, 
				n    = this.sel.node(), p, bm, tmp;
				
			
				
			if (this.sel.collapsed()) {
				p = this.dom.parents(n, this.test, true);
				if (p.length) {
					// unwrap nodes
					bm = this.sel.bookmark();
					if (this.dom.parent(bm[1], this.test) == p[0] 
					&& this._input
					&& !this.dom.nextAll(bm[1], function(t) { return !(t.nodeType == 3 && (t.nodeValue == '' || t.nodeValue == '\uFEFF'));}).length ) {
						// carret at the end of node and user is typing - move selection after node
						this.sel.rmBookmark(bm);
						this.rte.log(this._input)
						if (!(n = this.dom.next(p[0]))) {
							n = this.dom.createTextNode("\n");
							n.parentNode.appendChild(n);
						}
						if ($.browser.webkit) {
							n.parentNode.insertBefore((tmp = this.dom.createTextNode('\uFEFF')), n);
							$(this.rte.active.document).one('keyup', function() {
								tmp.nodeValue = tmp.nodeValue.replace('\uFEFF', '');
							});
						}
						this.sel.select(n).collapse(true)
						bm = this.sel.bookmark();
						p.shift();
					}
					// unwrap parents
					$.each(p, function(i, n) {
						self._unwrap(n);
					});
					this.sel.toBookmark(bm).collapse(true);
				} else {
					// create node
					this.rte.log('create')
					n = this.dom.create(this.node);
					n.appendChild((tmp = this.dom.createTextNode($.browser.webkit ? '\uFEFF' : '')));
					if ($.browser.webkit) {
						$(this.rte.active.document).one('keyup mouseup', function() {
							tmp.nodeValue = tmp.nodeValue.replace('\uFEFF', '');
						});
					}
					if ((n = this.sel.insertNode(n))) {
						this.sel.selectContents(n).collapse(false);
					}
				}
				return true;
			} else {
				var s = this.sel.get()
				this.rte.log(s)
			}
				
		}
		
	}
	
	elRTE.prototype.commands._style.prototype = elRTE.prototype.command;
	
	
	elRTE.prototype.commands.bold = function(rte) {
		this.name     = 'bold'
		this.title    = 'Bold';
		this.node     = { name : 'strong' };
		this.regExp   = /^(B|STRONG)$/;
		this.cssProp  = 'font-weight';
		this.cssValue = 'bold';
		
		this.init(rte);
		
	}
	
	elRTE.prototype.commands.italic = function(rte) {
		this.name     = 'italic'
		this.title    = 'Italic';
		this.node     = { name : 'em' };
		this.regExp   = /^(I|EM)$/;
		this.cssProp  = 'font-style';
		this.cssValue = 'italic';
		
		this.init(rte);
		
	}
	
	elRTE.prototype.commands.bold.prototype = elRTE.prototype.commands.italic.prototype = new elRTE.prototype.commands._style();
	
	
	// elRTE.prototype.commands.style = function() {
	// 	
	// 	
	// 	this.exec = function() {
	// 		this.rte.log('exec style '+this.name)
	// 	}
	// }
	// 
	// elRTE.prototype.commands.style.prototype = elRTE.prototype.command;
	// 
	// 
	// 
	// elRTE.prototype.commands._bold = function(rte) {
	// 	this.name = 'bold'
	// 	this.title = 'Bold';
	// 	
	// 	this.init(rte)
	// }
	
	// elRTE.prototype._commands.bold.prototype = elRTE.prototype._command;
	
	// elRTE.prototype._commands.bold.prototype = new elRTE.prototype._commands.style()
	
	
	// elRTE.prototype.commands._italic = function(rte) {
	// 	this.name = 'italic'
	// 	this.title = 'Italic';
	// 	
	// 	this.init(rte)
	// }
	
	// elRTE.prototype._commands.bold.prototype = elRTE.prototype._command;
	// elRTE.prototype.commands._bold.prototype = 
	// elRTE.prototype.commands._italic.prototype = new elRTE.prototype.commands.style()
	
	// elRTE.prototype._commands.italic = function(rte) {
	// 	this.name = 'italic';
	// 	
	// 	this.init(rte)
	// }
	// 
	// elRTE.prototype._commands.italic.prototype = elRTE.prototype._command;
	
	// elRTE.prototype._commands.italic.prototype = elRTE.prototype._commands.bold.prototype = new elRTE.prototype._commands._style();
	
	/**
	 * @Class Parent class for bold,italic etc.
	 *
	 */
	// elRTE.prototype.commands_.style = function() {
	// 
	// 	this.state = function() {
	// 		return this.dom.selectionMatchAll(this.test) ? 1 : 0;
	// 	}
	// 	
	// 	this.exec = function() {
	// 		var self = this, 
	// 			c = this.sel.collapsed(),
	// 			b = this.sel.getBookmark(), 
	// 			s = this.sel.selected(), 
	// 			n, l, r, i;
	// 		this.rte.log(c)
	// 		function unwrap(n) {
	// 			n.nodeName.match(self.find) ? self.dom.unwrap(n) : $(n).css(self.css, '');
	// 		}
	// 		
	// 		if (c) {
	// 			/* selection collapsed - unwrap parent with required tag/style if exists */
	// 			if ((n = this.dom.parent(this.sel.getNode(), this.test, null, true))) {
	// 				unwrap(n);
	// 			}
	// 		} else if (this.dom.selectionMatchAll(this.test)) {
	// 			
	// 			/* find selection and nodes intersect */
	// 			l = this.rte.dom.parent(s[0], this.test);
	// 			r = this.rte.dom.parent(s[s.length-1], this.test);
	// 
	// 			if (l && r && l == r) {
	// 				/* selection inside node */
	// 				n = this.dom.is(l, 'block') ? l : this.dom.slice(l, s[0], s[s.length-1]);
	// 				unwrap(n);
	// 			} else {
	// 				if (l) {
	// 					/* intersect with node on left side */
	// 					if (l.nodeName.match(this.find)) {
	// 						this.dom.moveNodesAfter(l, s[0]);
	// 					} else {
	// 						(this.dom.is(l, 'block') ? l : $(this.dom.split(l, s[0], true))).css(this.css, '');
	// 					}
	// 				} 
	// 				if (r) {
	// 					/* intersect with node on right side */
	// 					if (r.nodeName.match(this.find)) {
	// 						this.dom.moveNodesBefore(r, s[s.length-1]);
	// 					} else {
	// 						!this.dom.is(r, 'block') && this.dom.split(r, s[s.length-1]);
	// 						$(r).css(this.css, '');
	// 					}
	// 				}
	// 			}
	// 			/* find nodes in selection and unwrap */
	// 			$.each(s, function() {
	// 				$.each(self.dom.descendants(this, self.test), function() {
	// 					unwrap(this);
	// 				});
	// 				self.test(this) && unwrap(this);
	// 			});
	// 			
	// 		} else {
	// 			/* not required node in selection - create it */
	// 			// this.dom.smartWrapAll(s, this.node);
	// 			// this.rte.history.add();
	// 			this.wrap(s);
	// 		}
	// 
	// 		this.sel.moveToBookmark(b);
	// 		c && this.sel.collapse(true);
	// 		return true;
	// 	}
	// 	
	// 	this.wrap = function(s) {
	// 		this.dom.smartWrapAll(s, this.node);
	// 	}
	// 	
	// 	this._init = function(rte) {
	// 		this.init(rte);
	// 		var self  = this;
	// 		this.test = function(n) { 
	// 			return n.nodeName.match(self.find) || self.dom.cssMatch(n, self.css, self.cssval); 
	// 		};
	// 	}
	// 	
	// }
	
	// elRTE.prototype.commands_.style.prototype = elRTE.prototype.command;
	
	/**
	 * @Class Make text bold
	 *
	 * @param elRTE
	 */
	// elRTE.prototype.commands_.bold = function(rte) {
	// 	this.name   = 'bold';
	// 	this.title  = 'Bold';
	// 	this.find   = /^(STRONG|B)$/;
	// 	this.css    = 'font-weight';
	// 	this.cssval = /(bold|900)/;
	// 	this.defval = 'normal'
	// 	this.node   = 'strong';
	// 	
	// 	this._init(rte);
	// }
	
	/**
	 * @Class Make text italic
	 *
	 * @param elRTE
	 */
	// elRTE.prototype.commands_.italic = function(rte) {
	// 	this.name   = 'italic';
	// 	this.title  = 'Italic';
	// 	this.find   = /^(EM|I)$/;
	// 	this.css    = 'font-style';
	// 	this.cssval = 'italic';
	// 	this.node   = 'em';
	// 
	// 	this._init(rte);
	// }
	// 
	/**
	 * @Class Make text underlined
	 *
	 * @param elRTE
	 */
	// elRTE.prototype.commands_.underline = function(rte) {
	// 	var self    = this;
	// 	this.name   = 'underline';
	// 	this.title  = 'Underline';
	// 	this.find   = /^U$/;
	// 	this.css    = 'text-decoration';
	// 	this.cssval = 'underline';
	// 	this.node   = {name : 'span', css : {'text-decoration' : 'underline'}};
	// 
	// 	this.wrap = function(s) {
	// 		$.each(s, function() {
	// 			if (this.nodeType == 1) {
	// 				$(this).css(self.css, self.cssval);
	// 			} else if (this.nodeType == 3) {
	// 				this.dom.wrap(this, self.node);
	// 			}
	// 		});
	// 	}
	// 
	// 	this._init(rte);
	// }
	
	/**
	 * @Class Make text sub
	 *
	 * @param elRTE
	 */
	// elRTE.prototype.commands_.sub = function(rte) {
	// 	this.name   = 'sub';
	// 	this.title  = 'sub';
	// 	this.find   = /^SUB$/;
	// 	this.css    = 'vertical-align';
	// 	this.cssval = 'sub';
	// 	this.node   = 'sub';
	// 
	// 	this._init(rte);
	// }
	
	/**
	 * @Class Make text sup
	 *
	 * @param elRTE
	 */
	// elRTE.prototype.commands_.sup = function(rte) {
	// 	this.name   = 'sup';
	// 	this.title  = 'sup';
	// 	this.find   = /^SUP$/;
	// 	this.css    = 'vertical-align';
	// 	this.cssval = 'super';
	// 	this.node   = 'sup';
	// 
	// 	this._init(rte);
	// }
	
	// elRTE.prototype.commands.bold.prototype = 
	// elRTE.prototype.commands.italic.prototype = 
	// elRTE.prototype.commands.underline.prototype = 
	// elRTE.prototype.commands.sub.prototype =
	// elRTE.prototype.commands.sup.prototype = new elRTE.prototype.commands.style();
	// 


})(jQuery);