var svgW = document.getElementById('interests_graph').clientWidth,
	svgH = document.getElementById('interests_graph').clientHeight;

var svg = d3.select("svg#interests_graph"),
	width = +svgW,
	height = +svgH;
	// width = +svg.attr("width"),
	// height = +svg.attr("height");

// "#A4A4A6","#385273","#BFAB93","#F2EADF","#595652"

var farrben = [ "#A4A4A6", "#273240", "#424C59", "#737372", "#F2EAE4", "#283240", "#BFBDB8", "#88898C", "#686D73", "#474F59" ];
// var color = d3.scaleOrdinal(d3.schemeCategory20);
var color = d3.scaleOrdinal(farrben);


var simulation = d3.forceSimulation()
	.force("link", d3.forceLink().id(function(d) { return d.id; }))
	.force("charge", d3.forceManyBody().strength(-20))
	// .force("x", d3.forceX(width / .5))
	.force("y", d3.forceY(height / .5))
	.force("center", d3.forceCenter(width / 2, height / 2));


d3.json("interests.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
	  .attr("class", "links")
	.selectAll("line")
	.data(graph.links)
	.enter().append("line")
	  .attr("stroke", function(d) { return color(d.value); });

  var node = svg.append("g")
	  .attr("class", "nodes")
	.selectAll("circle")
	.data(graph.nodes)
	.enter().append("circle")
	  .attr("id", function(d) { return d.id.replace(/ /g, " "); })
	  .attr("r", 4)
	  .attr("stroke", function(d) { return color(d.group); })
	  .attr("data-group", function(d) { return d.group; })
	  .call(d3.drag()
		  .on("start", dragstarted)
		  .on("drag", dragged)
		  .on("end", dragended));

  // node.append("title")
  // node.nextSibling("text")
  // 	  .attr("class", function(d) { return d.id; })
	//   .text(function(d) { return d.id; });

var textL = svg.selectAll("g.nodes")
	.selectAll("text.label")
	.data(graph.nodes)
	.enter().append("text")
		.attr("class", "label")
	// .attr("fill", "black")
		.attr("data-for-label", function(d) { return d.id.replace(/ /g, " "); })
		.text(function(d) {  return d.id;  });

  simulation
	  .nodes(graph.nodes)
	  .on("tick", ticked);

  simulation.force("link")
	  .links(graph.links);

  function ticked() {
	link
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

	node
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
		
	textL
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; });	
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}