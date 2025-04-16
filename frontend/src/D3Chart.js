import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './ChartStyles.css';

function D3Chart({ data, type }) {
  useEffect(() => {
    if (data.length > 0) {
      drawChart(data, type);
    }
  }, [data, type]);

  const multilineTickFormat = (date) => {
    const formatDate = d3.timeFormat("%b %d");
    const formatTime = d3.timeFormat("%H:%M");

    return `${formatDate(date)}|${formatTime(date)}`;
  }

  const drawChart = (data, type) => {
    // Set chart dimensions
    const margin = { top: 20, right: 30, bottom: 60, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const chartId = `chart-${type}`;

    // Clear previous chart
    d3.select(`#${chartId}`).selectAll("*").remove();

    // Append SVG element
    const svg = d3.select(`#${chartId}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Parse date format
    const parseTime = d3.utcParse("%Y-%m-%d %H:%M:%S");

    const chartData = data.map(d => ({
      time: parseTime(d.time),
      temperature: +d.temperature,
      humidity: +d.humidity
    }));
    
    // Set x and y scales
    const x = d3.scaleTime()
      .domain(d3.extent(chartData, d => d.time))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([d3.min(chartData, d => d[type]) - 5, d3.max(chartData, d => d[type]) + 5])
      .range([height, 0]);

    // Add X axis
    const xAxis = d3.axisBottom(x).tickFormat(multilineTickFormat);
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("fill", "#f5f5f5");

      svg.selectAll(".x-axis .tick text")
      .each(function () {
        const self = d3.select(this);
        const [date, time] = self.text().split("|");
    
        self.text(null)  // Clear original text
    
        self.append("tspan")
          .attr("x", 0)
          .attr("dy", "1.2em")
          .text(date);
    
        self.append("tspan")
          .attr("x", 0)
          .attr("dy", "1.5em")  // Vertical spacing for second line
          .text(time);
      });

    // Add Y axis
    svg.append("g")
      .attr("class", "y-axis")
      .call(type === "temperature" ? d3.axisLeft(y).tickFormat(d => `${d}\u00B0C`) : d3.axisLeft(y).tickFormat(d => `${d}%`));

    // Create line
    const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d[type]));

    // Add line
    svg.append("path")
      .datum(chartData)
      .attr("class", "line")
      .attr("d", line)
      .attr("stroke", type === "temperature" ? "#ff7043" : "#4fc3f7")
      .attr("fill", "none")
      .attr("stroke-dasharray", function() {
        const totalLength = this.getTotalLength();
        return `${totalLength} ${totalLength}`;
      })
      .attr("stroke-dashoffset", function() {
        return this.getTotalLength();
      })
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .attr("stroke-dashoffset", 0);

    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
      }
      
    // Add hover interactive data readings
    svg.selectAll("dot")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d[type]))
      .attr("r", 4)
      .attr("fill", type === "temperature" ? "red" : "blue")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`${d3.utcFormat("%m-%d-%Y, %H:%M")(d.time)}<br/>${type}: ${d[type]}${type === "temperature" ? "\u00B0C" : "%"}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });    

    // Add linear gradient under the curve
    svg.append("linearGradient")
    .attr("id", `gradient-${type}`)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0).attr("y1", y.range()[0])
    .attr("x2", 0).attr("y2", y.range()[1])
    .selectAll("stop")
    .data([
      { offset: "0%", color: type === "temperature" ? "red" : "blue", opacity: 0.1 },
      { offset: "100%", color: type === "temperature" ? "red" : "blue", opacity: 0 }
    ])
    .enter().append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color)
    .attr("stop-opacity", d => d.opacity);

    svg.append("path")
      .datum(chartData)
      .attr("fill", `url(#gradient-${type})`)
      .attr("d", d3.area()
        .x(d => x(d.time))
        .y0(y.range()[0])
        .y1(d => y(d[type]))
    );

    svg.selectAll("path.domain, .tick line")
    .attr("stroke", "#888");

    const yGrid = d3.axisLeft(y)
    .tickSize(-width)
    .tickFormat("")
    .ticks(6);

    svg.append("g")
    .attr("class", "grid")
    .call(yGrid)
    .selectAll("line")
    .attr("stroke", null)
    .attr("stroke-width", null)
    .attr("stroke-dasharray", null);

    };
   return <div id = {`chart-${type}`}></div>;
}

export default D3Chart;
