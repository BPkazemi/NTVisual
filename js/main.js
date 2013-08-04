$(document).ready(function() {
	var svgHeight = window.innerHeight/1.1,
	svgWidth = window.innerWidth,
	numNodes = 100,
	totalWeight = 0, averageWeight = 0,
	min=1000, max=0,
	nodes;

	var svg = d3.select("body").append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	// Generate an array of length num containing objects w/ circle properties
	function generateNodes(num) {
		var newNodes = d3.range(num).map(function() {
			var person = {
				radius: d3.random.normal(179.7, 35)()/10,
				cx: Math.random() * svgWidth-50 + 55,
				cy: Math.random() * svgHeight-50 + 55
			}
			totalWeight += person.radius*10;
			return person;
		});

		// So larger radii overlay smaller radii
		newNodes.sort(function(a, b) {
			if(a.radius > b.radius) {
				return 1;
			}
			if(a.radius < b.radius) {
				return -1;
			}
			return 0;
		});
		return newNodes;
	}

	function update(data, enterTransitionTime) {
		// Data join - binding the circle's data to elements
		var circle = svg.selectAll('circle')
			.data(data),
		text = svg.selectAll('text')
			.data(data),
		enterTime = enterTransitionTime || 325;

		// UPDATE 
		// ------ Whenever data changes, update old elements as needed
		circle.transition().duration(1000)
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

		text.transition().duration(1000)
		.attr('x', function(d) {
			return d.cx-18;
		})
		.attr('y', function(d) {
			return d.cy+5;
		})
		.text(function(d) {
			min = Math.min(min, d.radius);
			max = Math.max(max, d.radius);

			return Math.floor(d.radius*10);
		});

		// ENTER
		// ----- When new nodes are created
		circle.enter().append('circle')
		.attr('r', 0)
		.transition().duration(enterTime)
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
		.style('font-size', 0)
		.transition().duration(enterTime)
		.attr('x', function(d) {
			return d.cx-18;
		})
		.attr('y', function(d) {
			return d.cy+5;
		})
		.style('font-size', 15)
		.text(function(d) {
			min = Math.min(min, d.radius);
			max = Math.max(max, d.radius);

			return Math.floor(d.radius*10);
		});

		// EXIT
		// ---- When nodes are removed
		circle.exit().transition()
		.duration(1000)
		.attr('r', 0)
		.remove();

		text.exit().transition()
		.duration(1000)
		.style("font-size", function() { return '0px';})
		.remove();
	}

	function calcAverage(sum, count) {
		// Calculate average weight
		averageWeight = sum/count;
		$('.average-weight').html(Math.floor(averageWeight) + ' lbs');
	}

	function renderMediocristan() {
		min = 1000, max = 0, totalWeight = 0, averageWeight = 0;

		var numNodes = $('#num-nodes').val(),
		newData = generateNodes(numNodes);
		calcAverage(totalWeight, numNodes);

		update(newData);
	}
	function renderExtremistan() {
		min = 1000, max = 0, totalWeight = 0, averageWeight = 0;

		var totalNodes = $('#num-nodes').val(),
		numOnePercent = Math.floor(totalNodes * 0.01) || 1,
		num99Percent = totalNodes-numOnePercent,

		plebianArray = generateNodes(num99Percent),
		richArray = d3.range(numOnePercent).map(function() {
			var fatPerson = { 
				radius: d3.random.normal(45000, 5000)()/10, 
				cx: Math.random() * svgWidth-50 + 55,
				cy: Math.random() * svgHeight-50 + 55 
			}
			totalWeight += fatPerson.radius;
			return fatPerson;
		}),

		newData = plebianArray.concat(richArray);

		calcAverage(totalWeight, totalNodes);
		console.log(numOnePercent);
		// Slow down Billy G!! 2s is enough to dramatize the impact.
		update(newData, 2000);
	}

	// Render initially
	update(generateNodes(numNodes));

	// Click Listeners
	// ---------------
	$('#render-btn').on('click', function() {
		renderMediocristan();
	})
	$('.mediocristan').on('click', function() {
		renderMediocristan();
	});
	$('.extremistan').on('click', function() {
		renderExtremistan();
	});


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