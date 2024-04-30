import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const ScatterPlot = ({ numerical_cols, selectedPair, graphColor }) => {
  const scatterRef = useRef(null);

  useEffect(() => {
    if (!numerical_cols || !selectedPair) return;

    var data = numerical_cols;

    var margin = { top: 10, right: 10, bottom: 50, left: 50 },
      w = 1547 - margin.left - margin.right - 200,
      h = 300 - margin.top - margin.bottom;

    d3.select(scatterRef.current).selectAll('*').remove();

    var svg = d3
      .select(scatterRef.current)
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom + 10);

    var container = svg
      .append('g')
      .attr('class', 'g_1')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Add X axis
    var x_data = data.map((item) => item[selectedPair.x]);
    const x_scale = d3
      .scaleLinear()
      .domain([0, d3.max(x_data)])
      .range([0, w]);
    container
      .append('g')
      .attr('class', 'x_axis_g')
      .attr('transform', `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale))
      .style('color', 'white')
      .style('font-size', '12px');

    container
      .append('text')
      .attr('class', 'x_label')
      .attr('text-anchor', 'middle')
      .attr('x', w / 2)
      .attr('y', h + margin.bottom)
      .text(
        selectedPair.x.replace('_', ' ').replace(/\b\w/g, function (char) {
          return char.toUpperCase();
        })
      )
      .style('fill', 'white')
      .style('padding', '10px');

    var y_data = data.map((item) => item[selectedPair.y]);
    const y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(y_data)])
      .range([h, 0]);
    container
      .append('g')
      .attr('class', 'y_axis_g')
      .call(d3.axisLeft(y_scale))
      .style('color', 'white')
      .style('font-size', '12px');

    container
      .append('text')
      .attr('class', 'y_label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -h / 2)
      .text(
        selectedPair.y.replace('_', ' ').replace(/\b\w/g, function (char) {
          return char.toUpperCase();
        })
      )
      .style('fill', 'white');

    container
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', function (d) {
        return x_scale(d[selectedPair.x]);
      })
      .attr('cy', function (d) {
        return y_scale(d[selectedPair.y]);
      })
      .attr('r', 3)
      .style('fill', graphColor === '#232423' ? 'white' : graphColor)
      .style('opacity', 0.6);
  }, [numerical_cols, selectedPair, graphColor]);

  return <svg ref={scatterRef}></svg>;
};

export { ScatterPlot };
