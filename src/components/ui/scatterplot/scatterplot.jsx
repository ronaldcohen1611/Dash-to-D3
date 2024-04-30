import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const ScatterPlot = ({ numerical_cols, selectedPair }) => {
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
      .selectAll('g')
      .data([0])
      .join('g')
      .attr('class', 'g_1')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    container
      .selectAll('.background-rect')
      .data([0])
      .join('rect')
      .attr('class', 'background-rect')
      .attr('width', w + 10)
      .attr('height', h + 10)
      .attr('fill', '#F9F9F9')
      .attr('y', -10);

    // Add X axis
    var x_data = data.map((item) => item[selectedPair.x]);
    const x_scale = d3
      .scaleLinear()
      .domain([0, d3.max(x_data)])
      .range([0, w]);

    container
      .selectAll('.x_axis_g')
      .data([null])
      .join('g')
      .attr('class', 'x_axis_g')
      .call(
        d3
          .axisBottom(x_scale)
          .tickSize(0)
          .tickPadding(5)
          .ticks(selectedPair.x === 'total_bill' ? 10 : 5)
          .tickValues(
            selectedPair.x === 'total_bill'
              ? d3.range(10, d3.max(x_data) + 10, 10)
              : d3.range(2, d3.max(x_data) + 2, 2)
          )
          .tickFormat((d) => Math.round(d))
      )
      .style('font-size', '12px')
      .attr('transform', `translate(0, ${h})`)
      .selectAll('.domain')
      .attr('stroke', 'transparent');

    container
      .selectAll('.x_label')
      .data([null])
      .join('text')
      .attr('class', 'x_label')
      .attr('text-anchor', 'middle')
      .attr('x', w / 2)
      .attr('y', h + margin.bottom)
      .text(selectedPair.x)
      .style('padding', '10px');

    // Add Y axis
    var y_data = data.map((item) => item[selectedPair.y]);
    const y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(y_data)])
      .range([h, 0]);

    container
      .selectAll('.y_axis_g')
      .data([null])
      .join('g')
      .attr('class', 'y_axis_g')
      .call(
        d3
          .axisLeft(y_scale)
          .tickSize(0)
          .tickPadding(5)
          .tickValues(
            selectedPair.y === 'total_bill'
              ? d3.range(5, d3.max(y_data) + 5, 5)
              : d3.range(2, d3.max(y_data) + 2, 2)
          )
      )
      .style('font-size', '12px')
      .selectAll('.domain')
      .attr('stroke', 'transparent');

    container
      .selectAll('.y_label_g')
      .data([selectedPair.y])
      .join('text')
      .attr('class', 'y_label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -h / 2)
      .text(function (d) {
        return d;
      });

    // Add cricles
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
       .style('fill', '#808080')
       .style('opacity', 0.6);
  }, [numerical_cols, selectedPair]);

  return <svg ref={scatterRef}></svg>;
};

export { ScatterPlot };
