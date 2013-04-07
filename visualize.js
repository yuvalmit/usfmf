var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 4550 - margin.top - margin.bottom,
        y = 25; // bar height

var funding_max = 13648194056,
    population_max = 1347565324,
    bubble_min_radius = 10;
    bubble_max_radius = 100;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scale.log()
        .clamp(true)
        .domain([0.1, funding_max])
        .range([0, width])
        .nice();

var r = d3.scale.linear()
        .domain([0, population_max])
        .range([bubble_min_radius, bubble_max_radius]);

var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

// Load the data and do stuff with it
d3.json("data.json", function(error, data) {
  console.log("data loaded!");

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  // Perform the data join
  var countries = svg.selectAll(".country")
    .data(data)
    .enter().append("g")
    .attr("class", "country")
    .attr("transform", function(d, i) { return "translate(0, " + i * y + ")"; });

  // Draw a line between each country
  countries.append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", 0)
    .attr("y2", 0)
    .style("stroke", "#ddd");

  // Draw the country name
  countries.append("text")
    .style("text-anchor", "center")
    .text(function(d) { return d.name; })
    .attr("transform", function(d) { return "translate(" + x(d.annual_aid[61]) + ", 0)"; } );

  // Draw the circles
  countries.append("circle")
    .attr("cy", -y/4)
    .attr("cx", function(d) { return x(d.annual_aid[61]); })
    .attr("r", function(d) { return r(d.population[61]); });



});