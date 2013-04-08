// Standard margins around the content
// see http://bl.ocks.org/mbostock/3019563
var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 4600 - margin.top - margin.bottom;

// row height
var y = 25; // bar height

// some constants
var funding_max = 13648194056,
    population_max = 1347565324,
    bubble_min_radius = 10;
    bubble_max_radius = 100;

// get and append an svg element inside the document body
// and immediately add a group, translate it to create
// the margins.
// At the end, 'svg' is a reference to the translated group,
// not the actual <svg> node.
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// The x axis is a logarithmic, nice scale
// Logarithmic because there are order-of-magnitude jumps
// in the amount of funding provided. Linear scale would
// show a lot of countries near zero and a few countries
// all the way to the right. Log scale spreads them out
// more evenly.
// Lower bound of 100000 manually chosen for prettyness.
// If the country received < $100k funding, it's pretty
// much like zero.
var x = d3.scale.log()
        .clamp(true)
        .domain([100000, funding_max])
        .range([0, width])
        .nice();

// Linear mapping of population onto bubble radius
var r = d3.scale.linear()
        .domain([0, population_max])
        .range([bubble_min_radius, bubble_max_radius]);

// Generate the axis markers
// Tickmarks are in $millions
// Below $0.01 million, show $0.
var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .ticks(10, function(d,i) {
          frac = (d / 1000000);
          if (frac >= 0.01)
            return "$" + frac + "M";
          else
            return "$0";
        });

// Load the data and render it
d3.json("data.json", function(error, data) {
  console.log("data loaded!");

  // Draw the X axis near the top
  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  // Perform the data join
  // One group per datum (country)
  // translated vertically 
  var countries = svg.selectAll(".country")
    .data(data)
    .enter().append("g")
    .attr("class", "country")
    .attr("transform", function(d, i) {
      // this is an accessor function
      // d is the datum being operated on
      // i is the index (e.g. 15 out of 180)
      // we want to translate each country down by
      // i * y pixels (plus 50 for the axis markers)
      return "translate(0, " + ((i * y) + 50) + ")"; });

  // Draw a line between each country
  countries.append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", 0)
    .attr("y2", 0)
    .style("stroke", "black")
    .style("stroke-opacity", 0.1)
    .style("stroke-width", 1)
    .style("z-index", -999);

  // Draw the country name
  // 5px right of the bubble center
  // shifted up by y/4 so it's centered in the row.
  countries.append("text")
    .style("text-anchor", "center")
    .text(function(d) { return d.name; })
    .attr("transform", function(d) {
      return "translate(" + (x(d.annual_aid[61]) + 5) + ", " + -(y/4) + ")"; } );

  // Draw the large, semitransparent circles
  // Note that the styling happens in CSS!
  countries.append("circle")
    .attr("cy", -y/2)
    .attr("cx", function(d) {
      // x position according to the x scale
      return x(d.annual_aid[61]); })
    .attr("r", function(d) {
      // radius according the r scale
      return r(d.population[61]); });

  // Draw small dots in the center of the bubble
  // Note that the styling happens right here!
  // These styles are applied as a style attribute on the
  // DOM nodes.
  countries.append("circle")
    .attr("cy", -y/2)
    .attr("cx", function(d) {
      // x position according to the x scale
      return x(d.annual_aid[61]); })
    .attr("r", 2) // fixed radius of 2px
    .style("fill", "black");
});