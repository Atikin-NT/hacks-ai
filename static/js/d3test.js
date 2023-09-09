// import * as d3 from "./libs/d3.min.js"
// import * as d3 from "//d3js.org/d3.v3.min.js";

// set a width and height for our SVG
var width = 640,
    height = 480;
// setup links
var links = [
    { source: 'Baratheon', target:'Lannister' },
    { source: 'Baratheon', target:'Stark' },
    { source: 'Lannister', target:'Stark' },
    { source: 'Stark', target:'Bolton' },
];

// create empty nodes array
var nodes = {};

console.log(nodes);
// compute nodes from links data
links.forEach(function(link) {
    link.source = nodes[link.source] ||
        (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target});
});
console.log(nodes);


// add an SVG to the body for our viz
var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

// use the force
var force = d3.layout.force()
    .size([width, height])
    .nodes(d3.values(nodes))
    .links(links)
    .on("tick", tick)
    .linkDistance(300)
    .start();

// var force = d3.forceSimulation(nodes);
// force.x = width;
// force.y = height;
// console.log(force);
// console.log(typeof nodes)
// force
//     .links(links)
//     .on("tick", tick)
//     .linkDistance(300)
//     .start();

// add links
var link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link');

// add nodes
var node = svg.selectAll('.node')
    .data(force.nodes())
    .enter().append('circle')
    .attr('class', 'node')
    .attr('r', width * 0.03);



// what to do
function tick(e) {

    node.attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .call(force.drag);

    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

}




