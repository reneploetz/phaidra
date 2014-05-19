define(['jquery', 'underscore', 'backbone', 'utils', 'text!templates/notes.html'], function($, _, Backbone, Utils, NotesTemplate) { 

	var View = Backbone.View.extend({
		tagName: 'div', 
		className: 'col-md-12 notes',
		template: _.template(NotesTemplate),
		events: { 
			'click a > .glyphicon-chevron-up': 'toggleNotes',
			'click #parse-vals': 'toggleParse',
			'click .btn-show-trans': 'showTranslation'
		},
		initialize: function(options) {
			this.options = options;	
			this.collection.bind('change:selected change:hovered', this.toggleNotes, this);

			this.$el.html(NotesTemplate);
			this.$el.find('a[data-toggle="tooltip"]').tooltip({ container: 'body' });
		},
		render: function() {
			return this;	
		},
		renderDetails: function() {
			var selected = this.collection.findWhere({ selected: true });

			// Give the user the definite article with the definition
			if (selected.get('pos') == 'noun') {
				selected.set('article', Utils.getDefiniteArticle(selected.get('gender')));
			}

			var that = this;
			
			this.$el.html(this.template({
				word: selected.attributes,
				lang: that.lang || 'eng', 	// This will obviously be set by user profile for their 'default', not 'eng' 
				grammar: selected.getGrammar()
			}));

			// Bind events
			this.$el.find('a[data-toggle="tooltip"]').tooltip({ container: 'body' });
			this.$el.addClass('expanded');
		},
		toggleParse: function(e) {
			e.preventDefault();
			var link = this.$el.find('#parse-vals');

			link.find('.vals').toggle();
			var toggle = link.find('.vals').is(':visible') ? 'Hide ' : '';
			link.find('strong').html(toggle + 'Parse');
		},
		toggleNotes: function(model) {
			if (model.get('hovered') && !model.get('selected') && (this.collection.findWhere({ selected: true }) == undefined)) {
				this.$el.find('.intro').html(
					'Information about <span lang="' + model.get('lang') +'">' + model.get('value') + '</span>'
				);
				this.$el.removeClass('expanded');
				this.$el.find('.notes-nav a').eq(1).attr('title', 'Hide Resources');
			}

			// This will perform a fetch on the model for full data
			else if (model.get('selected')) {
				this.$el.find('.intro').html('<img src="/static/images/tree-loader.gif"> Loading');
				this.$el.find('.notes-nav a').eq(1).attr('title', 'Show Resources');
				this.renderDetails();
			}

		},
		collapseNotes: function(e) {
			e.preventDefault();
			var selected = this.collection.findWhere({ selected: true });
			if (typeof(selected) != 'undefined')
				selected.set('selected', false);
		},
		showTranslation: function(e) {
			e.preventDefault();
			this.lang = $(e.target).attr('data-lang');
			this.renderDetails();
		}
	});

	return View;

});