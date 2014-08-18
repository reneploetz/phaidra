define(['jquery', 'underscore', 'backbone', 'models', 'collections', 'text!/templates/js/slide-info.html', 'daphne', 'morea'], function($, _, Backbone, Models, Collections, Template, Daphne, Morea) {
	var View = Backbone.View.extend({
		tagName: 'div',
		className: 'slide-unit',
		template: _.template(Template),
		events: { },
		initialize: function(options) {
			this.options = options;

			// Decide whether we can draw right away or must wait
			if (this.model.get('populated'))
				this.draw();
			else
				this.model.on('populated', this.draw, this);
		},
		render: function() {
			return this;
		},
		draw: function() {
			var that = this;

			this.$el.html(this.template(this.model.attributes));
			this.$el.find('a[data-toggle="popover"]').popover();
			this.$el.find('em[data-toggle="tooltip"]').tooltip();

			// If there are any parse trees, render them
			// TODO: Make this more robust
			this.$el.find('[data-toggle="daphne"]').each(function(i, el) {
				var words = JSON.parse(el.innerHTML);
				el.innerHTML = '';

				el.addEventListener('submitted', that.submitTree.bind(that));
				el.addEventListener('completed', that.completeTree.bind(that));

				new Daphne(el, {
					data: words,
					mode: el.getAttribute('data-mode'),
					width: el.getAttribute('data-width') || 200,
					height: 400,
					initialScale: 0.9
				});
			});

			this.$el.find('[data-toggle="morea"]').each(function(i, el) {
				new Morea(el, {
					mode: el.getAttribute('data-mode'),
					dataUrl: el.getAttribute('data-dataUrl'),
					targets: el.getAttribute('data-targets').split(","),
					langs: {
						"grc": {
							"hr": "Greek",
							"resource_uri": "",
							"dir": "ltr"
						},
						"en": {
							"hr": "English",
							"resource_uri": "",
							"dir": "ltr"
						}
					}
				});
			});

			return this;
		},
		submitTree: function(e) {
			this.model.set('starttime', new Date(this.$el.data('starttime')));
			this.model.set(e.detail);
			this.model.checkAnswer(this.model.get('response'));
		},
		completeTree: function(e) {
			this.model.set('starttime', new Date(this.$el.data('starttime')));
			this.model.set(e.detail);
			this.model.checkAnswer(this.model.get('response'));

			setTimeout(function() {
				console.log("Navigate to Next Slide.");
			}, 2000);
		}
	});

	return View;
});
