requirejs.config({
	'baseUrl': '/static/js',
	'paths': {
		// Lib paths
		'jquery': 'lib/jquery-2.0.3',
		'bootstrap': '../bootstrap/js/bootstrap.min',
		'json2': 'lib/json2',
		'underscore': 'lib/underscore-min',
		'backbone': 'lib/backbone',
		'd3': 'lib/d3.v3.min',
		'jquery-ui': 'lib/jquery-ui-draggable',
		'jquery-ui-core': 'lib/jquery-ui-core',
		'jquery-ui-slide': 'lib/jquery-ui-effects-slide',
		'text': 'lib/text'
	},
	'shim': {
		'underscore': {
			'exports': '_'
		},
		'backbone': {
			'deps': ['jquery', 'underscore'],
			'exports': 'Backbone'
		},
		'bootstrap': {
			'deps': ['jquery']
		},
		'd3': {
			'exports': 'd3'
		},
		'jquery-ui-core': {
			'deps': ['jquery']
		},
		'jquery-ui': {
			'deps': ['jquery']
		},
		'jquery-ui-slide': {
			'deps': ['jquery', 'jquery-ui-core']
		}
	}
});

require(['jquery', 'underscore', 'backbone', 'router', 'd3', 'bootstrap'], function($, _, Backbone, Phaidra, d3) {
	$(document).ready(function() {
		var app = new Phaidra.Router();
		Backbone.history.start({ pushState: true });

		// Activate Bootstrap JS Components
		$('.module .circle').tooltip({ container: 'body'});
		$('div[data-toggle="tooltip"]').tooltip();
		$('a[data-toggle="tooltip"]').tooltip();
	});
});
