$(document).ready(function() {
	var svgHeight = window.innerHeight/1.1,
	svgWidth = window.innerWidth,
	numNodes = 100,
	totalWeight = 0, averageWeight = 0,
	min=100000, max=0,
	nodes,
	giniDenmark = 0.24, giniUS = 0.477, giniSouthAfrica = 0.631, giniWorld = 0.68,
	giniSmall = giniDenmark, giniLarge = giniSouthAfrica,
	currentGini = giniSmall,
	curStep;

	// ======== Gini Coefficients ==========
	// The Gini coefficient is the area between 
	// the line of perfect equality and the line of perfect inequality.
	// Given A and B, Gini = A/(A+B)
	// L(F) = W, where F is the percent of population and W is the wealth

	// A note on the limitations of Gini Coefficients - they do not explain the differences, only report them
	// Moreover, since the Gini coefficient is a relative measure, it doesn't take into account absolute wealth

	// Given G, we know p = -2G/(G-1), and y = x^p

	var svg = d3.select("body").append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	// Generate a random number that is between min and max
	function getRandomArbitrary(min, max) {
		return (Math.random() * (max-min) + min);
	}

	// Givien gini coefficient G, we know p = -2G/(G-1) and y=x^p
	function calculateStep() {
		return (-2*currentGini)/(currentGini-1);
	}

	// Generate an array of length num containing objects w/ circle properties
	function generateNodes(num) {
		totalWeight = 0, min = 100000, max = 0;
		curStep = calculateStep();

		// x corresponds to 'the bottom x%' of the population wealth
		var newNodes = d3.range(num).map(function(val, index) {
			// Since getRandomArbitrary may "weigh" certain x's more
			// heavily than others, we end up with a non-perfect
			// distribution. However, getRandomArbitrary works
			// better for populations less than 100, and is nearly
			// as accurate. More nodes = more accuracy.
			var x = getRandomArbitrary(0.001, 1);
			var y = Math.pow(x, curStep); // y=x^p
			console.log('index: ' + index + ', x: ' + x + ', p: ' + curStep + ', y: ' + y);
			var person = {
				radius: y * 100,
				cx: getRandomArbitrary(50, svgWidth-70),
				cy: getRandomArbitrary(50, svgHeight-70)
			}
			totalWeight += person.radius;
			min = Math.min(min, person.radius);
			max = Math.max(max, person.radius);
			return person;
		});
		// So smaller radii overlay larger radii
		newNodes.sort(function(a, b) {
			if(a.radius > b.radius) {
				return -1;
			}
			if(a.radius < b.radius) {
				return 1;
			}
			return 0;
		});
		return newNodes;
	}

	function update(data, transitionTime) {
		// Data join - binding the circle's data to elements
		var circle = svg.selectAll('circle')
			.data(data),
		text = svg.selectAll('text')
			.data(data),
		transTime = transitionTime || 750;

		// UPDATE 
		// ------ Whenever data changes, update old elements as needed 
		circle.transition().duration(transTime)
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
			return 'hsl(' + Math.random()*365 + ', 100%, 70%)';
		})
		.style('stroke-width', 1);

		text.transition().duration(transTime)
		.attr('x', function(d) {
			return d.cx-18;
		})
		.attr('y', function(d) {
			return d.cy+5;
		})
		.text(function(d) {
			min = Math.min(min, d.radius);
			max = Math.max(max, d.radius);

			return Math.floor(d.radius);
		});

		// ENTER
		// ----- When new nodes are created
		circle.enter().append('circle')
		.attr('r', 0)
		.transition().duration(transTime)
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
			return 'hsl(' + Math.random()*365 + ', 100%, 70%)';
		})
		.style('stroke-width', 1);

		text.enter().append('text')
		.style('font-size', 0)
		.transition().duration(transTime)
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

			return Math.floor(d.radius);
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

	function calcStats(sum, count) {
		// average weight
		averageWeight = sum/count;
		$('#average-weight').html(Math.floor(averageWeight) + ' lbs, ');
		// min, max
		$('#min').html(Math.floor(min) + ' lbs, ');
		$('#max').html(Math.floor(max) + ' lbs');
	}

	function renderMediocristan() {
		totalWeight = 0, averageWeight = 0;
		currentGini = giniSmall;

		var numNodes = $('#num-nodes').val();
		var newData = generateNodes(numNodes);
		calcStats(totalWeight, numNodes);

		update(newData);
	}
	function renderExtremistan() {
		totalWeight = 0, averageWeight = 0;
		min = 100000, max = 0, averageWeight = 0;
		currentGini = giniLarge;

		var numNodes = $('#num-nodes').val();
		var newData = generateNodes(numNodes);

		calcStats(totalWeight, numNodes);
		// 2s is enough to dramatize the impact.
		update(newData, 2000);
	}

	// Render initially
	update(generateNodes(numNodes));

	// Click Listeners
	// ---------------
	$('.mediocristan').on('click', function() {
		renderMediocristan();
	});
	$('.extremistan').on('click', function() {
		renderExtremistan();
	});

	// Avgrund Explanation
	$('.description').on('click', function() {
		Avgrund.show('#default-popup');
	});
	$('.close').on('click', function() {
		Avgrund.hide();
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