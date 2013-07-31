$(document).ready(function() {
	var svgHeight = window.innerHeight,
	svgWidth = window.innerWidth,
	numNodes = 300,
	min=1000, max=0,
	nodes = d3.range(numNodes).map(function() {
		// var randomSeed = Math.random();
		// for(var i=0; i<2; i++) {
		// 	randomSeed += Math.random();
		// }
		return {
			// radius: (Math.random() * 325 + 75)/10,
			radius: d3.random.normal(179.7, 35)()/10,
			cx: Math.random() * svgWidth-50,
			cy: Math.random() * svgHeight-50
		}
	});

	var svg = d3.select("body").append("svg")
		.attr("width", svgWidth)
		.attr("height", svgHeight);

	$(svg).addClass('circle');

	for(var i=0; i<numNodes; i++) {
		svg.append("circle")
			.attr("cx", nodes[i].cx)
			.attr("cy", nodes[i].cy)
			.attr("r", nodes[i].radius)
			.attr("fill", function() { return "hsl(" + Math.random() * 360 + ", 75%, 75%)" })
			.style("stroke-width", "1");

		svg.append("text")
			.attr("x", nodes[i].cx-10)
			.attr("y", nodes[i].cy)
			.text(Math.floor(nodes[i].radius*10));

		min = Math.min(min, nodes[i].radius);
		max = Math.max(max, nodes[i].radius);
	}
	console.log(min*10, max*10);

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
	// -----------------------------------
});

/*
	To generate a more random distribution, recall the SO answer of how multiplying 
	random()+random() yields closer to a normal distribution
*/