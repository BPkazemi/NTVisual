$(document).ready(function() {
	var svgHeight = window.innerHeight/1.1,
	svgWidth = window.innerWidth,
	numNodes = 300,
	min=1000, max=0,
	nodes;

	var svg = d3.select("body").append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	// Generate an array of length num containing objects w/ circle properties
	function generateNodes(num) {
		var newNodes = d3.range(num).map(function() {
			return {
				radius: d3.random.normal(179.7, 35)()/10,
				cx: Math.random() * svgWidth-50,
				cy: Math.random() * svgHeight-50
			}
		});
		return newNodes;
	}

	function update(data) {
		// Data join - binding the circle's data to elements
		var circle = svg.selectAll('circle')
			.data(data),
		text = svg.selectAll('text')
			.data(data);

		// UPDATE 
		// ------ Whenever data changes, update old elements as needed
		circle.attr('cx', function(d) { 
			return d.cx; 
		})
		.attr('cy', function(d) {
			return d.cy;
		})
		.attr('r', function(d) {
			return d.radius;
		})
		.attr('fill', function() {
			return 'hsl(' + Math.random()*365 + ', 75%, 75%)';
		})
		.style('stroke-width', 1);

		text.attr('x', function(d) {
			return d.cx-10;
		})
		.attr('y', function(d) {
			return d.cy;
		})
		.text(function(d) {
			min = Math.min(min, d.radius);
			max = Math.max(max, d.radius);

			return Math.floor(d.radius*10);
		});

		// ENTER
		// ----- When new nodes are created
		circle.enter().append('circle')
		.attr('cx', function(d) { 
			return d.cx; 
		})
		.attr('cy', function(d) {
			return d.cy;
		})
		.attr('r', function(d) {
			return d.radius;
		})
		.attr('fill', function() {
			return 'hsl(' + Math.random()*365 + ', 75%, 75%)';
		})
		.style('stroke-width', 1);

		text.enter().append('text')
		.attr('x', function(d) {
			return d.cx-10;
		})
		.attr('y', function(d) {
			return d.cy;
		})
		.text(function(d) {
			min = Math.min(min, d.radius);
			max = Math.max(max, d.radius);

			return Math.floor(d.radius*10);
		});

		// EXIT
		// ---- When nodes are removed
		circle.exit().remove();
		text.exit().remove();
	}

	// Render initially
	update(generateNodes(numNodes));
	console.log(min*10, max*10);
	$('#render-btn').on('click', function() {
		min = 1000, max = 0;
		numNodes = $('#num-nodes').val();
		var newData = generateNodes(numNodes);
		
		update(newData);
		console.log(min*10, max*10);
	})


	// -- Awesome CSS circle background --
	// -----------------------------------
	// var colorArray = [
	// 	'#77dfc9',
	// 	'#778ddf',
	// 	'#df778d',
	// 	'#dfc977'
	// ], whichColor, htmlString;

	// for(var i=0; i<1000; i++) {
	// 	whichColor = Math.floor(Math.random() * 4); // (0, 1, 2, 3)

	// 	htmlString = '<div class="circle" style="background:' + colorArray[whichColor] + '"></div>';
	// 	$('#shapesHolder').append($(htmlString));
	// }

	// var diameter = 0,
	// acceptableRadii = [];
	// for(var i=10; i<200; i++) {
	// 	diameter = i;
	// 	radius = i/2;
	// 	if(window.innerWidth%diameter === 0) {
	// 		acceptableRadii.push(radius);
	// 	}
	// }
	// -----------------------------------
});

/*
	To generate a more random distribution, recall the SO answer of how adding 
	random()+random() yields closer to a normal distribution
*/