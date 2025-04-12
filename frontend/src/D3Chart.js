import React, { useEffect } from 'react';
import * as d3 from 'd3';

function D3Chart({ data }) {
  useEffect(() => {
    if (data.length > 0) {
      drawChart(data);
    }
  }, [data]);

  const drawChart = (data) => {
    // Set chart dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear any previous chart
    d3.select("#chart").html("");

    // Append SVG element
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Parse date format
    const parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
    data.forEach(d => {
      // d.time = parseTime(d.time);
      d.time = +d.time;
      d.temperature = +d.temperature;
      d.humidity = +d.humidity;
    });

    console.log(data);

    // Set x and y scales
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.time))
      .range([0, width]);

    const yTemp = d3.scaleLinear()
      .domain([d3.min(data, d => d.temperature), d3.max(data, d => d.temperature)])
      .range([height, 0]);

    const yHum = d3.scaleLinear()
      .domain([d3.min(data, d => d.humidity), d3.max(data, d => d.humidity)])
      .range([height, 0]);

    // Add X axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis for temperature
    svg.append("g")
      .call(d3.axisLeft(yTemp))
      .append("text")
      .attr("y", -10)
      .attr("x", -40)
      .attr("dy", "0.75em")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("Temperature (�C)");

    // Add Y axis for humidity (on the right)
    svg.append("g")
      .attr("transform", "translate(" + width + " ,0)")
      .call(d3.axisRight(yHum))
      .append("text")
      .attr("y", -10)
      .attr("x", 40)
      .attr("dy", "0.75em")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("Humidity (%)");

    // Create the line for temperature
    const tempLine = d3.line()
      .x(d => x(d.time))
      .y(d => yTemp(d.temperature));

    // Create the line for humidity
    const humLine = d3.line()
      .x(d => x(d.time))
      .y(d => yHum(d.humidity));

    // Add temperature line
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", tempLine)
      .attr("stroke", "red")
      .attr("fill", "none");

    // Add humidity line
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", humLine)
      .attr("stroke", "blue")
      .attr("fill", "none");
  };

  return <div id="chart"></div>;
}

export default D3Chart;
