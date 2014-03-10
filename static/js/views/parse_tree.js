define(['jquery', 'underscore', 'backbone', 'd3'], function($, _, Backbone, d3) {
	var View = Backbone.View.extend({
		tagName: 'div',
		className: 'text',
		events: {
		},
		initialize: function(options) {
			this.$el = $('');
			var that = this;
			$.ajax({
				url: '/api/sentence/3602/?format=json',
				dataType: 'json', 
				success: function(sentence) {

					// Populate html
					options.container.find('.sentence').html(sentence.sentence);

					data = that.convertData(sentence.words);
					that.renderTree(data);
				},
				failure: function(x, y, z) {
					console.log(x, y, z);
				}
			});
		},
		render: function() {
			return this;	
		},
		/*
		*	Converts data from flat JSON into hierarchical.
		*/
		convertData: function(words) {
			// Right now, our data comes in reverse. Delete this later.
			words = words.reverse();
			words = _.map(words, function(obj) {
				return _.pick(obj, 'tbwid', 'head', 'value');
			});

			var dataMap = words.reduce(function(map, node) {
				map[node.tbwid] = node;
				return map;
			}, {});

			// Create hierarchical data
			var treeData = [];
			words.forEach(function(node) {
				var head = dataMap[node.head];
				if (head) 
					(head.children || (head.children = [])).push(node);
				else 
					treeData.push(node);
			});
			return treeData;
		},
		/*
		*	Renders the parse tree
		*/
		renderTree: function(treeData) {
			var margin = { top: 20, right: 120, bottom: 20, left: 120 },
				width = 960 - margin.right - margin.left,
				height = 800 - margin.top - margin.bottom;

			var i = 0;

			var tree = d3.layout.tree().size([height, width]);

			var diagonal = d3.svg.diagonal().projection(function(d) {
				return [d.x, d.y];
			});

			var svg = d3.select('.parse-tree').append('svg')
				.attr('width', width + margin.right + margin.left)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			root = treeData[0];
			update(root);

			function update(source) {
				var nodes = tree.nodes(root).reverse(),
					links = tree.links(nodes);

				nodes.forEach(function(d) {
					d.y = d.depth * 100;
				});

				var node = svg.selectAll('g.node')
					.data(nodes, function(d) {
						return d.id || (d.id = ++i);
					});

				var nodeEnter = node.enter().append('g')
					.attr('class', 'node')
					.attr('transform', function(d) {
						return 'translate(' + d.x + ', ' + d.y + ')';
					});

				nodeEnter.append('circle')
					.attr('r', 10)
					.on('click', function(d, i) {
						var c = d3.select(this);

						// If this node was previously selected, unselect it.
						if (c.classed('selected')) 
							this.setAttribute('class', '');

						/* Otherwise, it's either going to be:
						*		1. Another node's parent or child
						* 		2. No change, it's already the child of clicked-on-parent 
						*/

						else {
							c.attr('class', 'selected');

							/*
							If user has selected a new parent:
								1. Get current parent of node-to-move.
								2. Store and remove node-to-move from parent list. Update node-to-move's parent pointer.
								3. Change the head value of the node to point to the parent id.
								4. Call a transition to alter appearance of tree
							*/
						}

					});

				nodeEnter.append('text')
					.attr('y', 20)
					.attr('dy', '.55em')
					.attr('text-anchor', 'middle')
					.text(function(d) {
						return d.value;
					})
					.style('fill-opacity', 1);

				var link = svg.selectAll('path.link')
					.data(links, function(d) {
						return d.target.id;
					});

				link.enter().insert('path', 'g')
					.attr('class', 'link')
					.attr('d', diagonal);
			}
		}
	});

	return View;
});