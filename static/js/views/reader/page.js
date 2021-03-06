define(['jquery', 'underscore', 'backbone', 'text!/templates/js/reader/page.html', 'utils'], function($, _, Backbone, PageTemplate, Utils) { 

	var View = Backbone.View.extend({
		events: { 
			'click .corner a': 'turnPage',
			'mouseenter .page-content span': 'hoverWord',
			'mouseleave .page-content span': 'hoverWord',
			'click .page-content span': 'clickWord'
		},
		tagName: 'div',
		className: 'col-md-6',
		template: _.template(PageTemplate),
		initialize: function(options) {
			this.options = options;
			this.$el.addClass('loading');

			// Bind to our document model and our word collection
			this.model.on('populated', this.reRender, this);
			this.model.words.on('change:selected', this.toggleHighlight, this); 

			// If we've been given a too-high-level CTS, derive the sentence
			if (this.options.CTS.split(':')[4].split('.').length !== 3) {
				var index = this.options.side === 'left' ? 0 : 1;
				this.options.CTS = this.model.words.at(index).get('sentenceCTS');
			}

			this.model.populate(this.options.CTS);
		},
		render: function() {

			this.$el.addClass('loading');

			var side;
			if (DIR === 'rtl')
				side = (side === 'right') ? 'left': 'right';

			this.$el.html(this.template({ 
				side: this.options.side, 
				author: this.model.get('author'),
				work: this.model.get('name'),
				lang: this.model.get('lang'),
				words: {},
				cts: this.options.CTS
			})); 
			return this;
		},
		reRender: function(model) {

			this.$el.html(this.template({ 
				side: this.options.side, 
				author: this.model.get('author'),
				work: this.model.get('name'),
				lang: this.model.get('lang'),
				words: this.model.words.models,
				cts: this.options.CTS
			})); 

			// Update the 'next or previous' page links
			var that = this;
			this.$el.find('.corner a').attr('href', function() {
				var cts = that.options.side == 'left' ? that.model.getPrevCTS(that.options.CTS) : that.model.getNextCTS(that.options.CTS); 
				return '/reader/' + (cts || '');
			}).tooltip();

			var ref = this.options.CTS.split(':');
			var title = this.$el.find('.section');

			if (LOCALE === 'fa')
				title.html(Utils.convertToPersian(ref[ref.length - 1]));
			else
				title.html(ref[ref.length-1]);

			this.$el.removeClass('loading');

			return this;	
		},
		turnPage: function(e) {
			this.$el.addClass('loading');
			if (e) e.preventDefault();
			Backbone.history.navigate(this.$el.find('.corner a').attr('href'), { trigger: true });		
		},
		turnToPage: function(CTS) {
			this.$el.addClass('loading');

			this.options.CTS = CTS;
			this.model.populate(CTS);
		},
		hoverWord: function(e) {
			var word = this.model.words.findWhere({ 
				CTS: $(e.target).attr('data-cts') 
			});

			var hovered = (e.type == 'mouseenter') ? true : false;
			word.set('hovered', hovered);
		},
		clickWord: function(e) {
			// See if any word is previously selected
			var prev = this.model.words.findWhere({
				selected: true
			});
			var target = this.model.words.findWhere({ 
				CTS: $(e.target).attr('data-cts') 
			});

			// If this word is the same as current word, deselect
			if (target == prev) {
				prev.set('selected', false);
				this.$el.parent().css('padding-bottom', '80px');
			}
			else if (typeof(prev) != 'undefined') {
				prev.set('selected', false);
				target.set('selected', true);
				this.$el.parent().css('padding-bottom', '200px');
			}
			else {
				target.set('selected', true);
				this.$el.parent().css('padding-bottom', '200px');
			}
		},
		toggleHighlight: function(model) {

			// If an element becomes selected or de-selected, update highlight accordingly
			model.fetch();

			if (model.get('selected'))
				this.$el.find('.page-content span[data-cts="' + model.get('CTS') + '"]')
					.addClass('selected');
			else if (!model.get('selected'))
				this.$el.find('.page-content span[data-cts="' + model.get('wordCTS') + '"]')
					.removeClass('selected');
		}
	});

	return View;
});
