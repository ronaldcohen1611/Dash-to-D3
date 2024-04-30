import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import chroma from 'chroma-js';
var jz = require('jeezy');
var data2grid = require('data2grid');

const CorrelationMap = ({ numerical_cols, setSelectedPair }) => {
  const gridRef = useRef(null);
  const legendRef = useRef(null);

  var margin = { top: 50, bottom: 50, left: 60, right: 50 };

  var dim = 500;

  var width = dim - margin.left - margin.right,
    height = dim - margin.top - margin.bottom;

  useEffect(() => {
    if (!numerical_cols) return;
    var cols = ['total_bill', 'tip', 'size'];
    const data = numerical_cols.filter(
      (dp) =>
        dp.total_bill !== undefined &&
        dp.tip !== undefined &&
        dp.size !== undefined &&
        dp.total_bill !== null &&
        dp.tip !== null &&
        dp.size !== null
    );

    var corr = jz.arr.correlationMatrix(data, cols);
    var extent = d3.extent(
      corr
        .map(function (d) {
          return d.correlation;
        })
        .filter(function (d) {
          return d !== 1;
        })
    );

    var grid = data2grid.grid(corr);
    var rows = d3.max(grid, function (d) {
      return d.row;
    });

    // Clear previous chart *** THIS IS KEYYY ***
    d3.select(gridRef.current).selectAll('*').remove();
    d3.select(legendRef.current).selectAll('*').remove();

    d3.select('body')
      .append('div')
      .attr('class', 'tip')
      .style('display', 'none');

    var svg = d3
      .select(gridRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    var padding = 0.1;

    var x = d3
      .scaleBand()
      .range([0, width])
      .paddingInner(padding)
      .domain(d3.range(1, rows + 1));

    var y = d3
      .scaleBand()
      .range([0, height])
      .paddingInner(padding)
      .domain(d3.range(1, rows + 1));

    var c = chroma
      .scale(['0D0887', 'DB5C67', '860BA3', 'yellow'])
      .domain([extent[0], 0.5, 0.6, 1]);

    var x_axis = d3.axisTop(y).tickFormat(function (d, i) {
      return cols[i];
    });
    var y_axis = d3.axisLeft(x).tickFormat(function (d, i) {
      return cols[i];
    });

    svg
      .append('g')
      .attr('class', 'x axis')
      .call(x_axis)
      .style('font-size', '14px');

    svg
      .append('g')
      .attr('class', 'y axis')
      .call(y_axis)
      .style('font-size', '14px');

    svg
      .selectAll('rect')
      .data(grid, function (d) {
        return d.column_a + d.column_b;
      })
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d.column);
      })
      .attr('y', function (d) {
        return y(d.row);
      })
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', function (d) {
        return c(d.correlation);
      })
      .style('opacity', 1e-6)
      .transition()
      .style('opacity', 1);

    svg.selectAll('rect');

    var textGroup = svg.append('g').attr('class', 'text-group');

    textGroup
      .selectAll('text')
      .data(grid)
      .enter()
      .append('text')
      .text(function (d) {
        return d.correlation.toFixed(2);
      })
      .attr('x', function (d) {
        return x(d.column) + x.bandwidth() / 2;
      })
      .attr('y', function (d) {
        return y(d.row) + y.bandwidth() / 2;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', 'black')
      .style('pointer-events', 'none');

    svg.node().appendChild(textGroup.node());

    svg
      .selectAll('rect')
      .on('mouseover', function (d) {
        d3.select(this).style('stroke', 'green').style('stroke-width', 4);
      })
      .on('mouseout', function () {
        d3.select(this).style('stroke', 'none');
      })
      .on('click', function (d) {
        const obj = d['srcElement']['__data__'];
        setSelectedPair({ x: obj.column_x, y: obj.column_y });
      });
  }, [
    height,
    margin.bottom,
    margin.left,
    margin.right,
    margin.top,
    numerical_cols,
    setSelectedPair,
    width,
  ]);

  return (
    <div>
      <h2 className="flex justify-center items-center text-lg">
        Correlation Matrix
      </h2>
      <div className="flex">
        <div ref={gridRef}></div>
        <div id="container" className="">
          <svg
            style={{ fill: 'white' }}
            height={530}
            className="axis w-24"
          >
            <defs>
              <linearGradient
                id="legend-linear-gradient"
                x1="0%"
                x2="0%"
                y1="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffec47"></stop>
                <stop offset="20%" stopColor="#FBAE32"></stop>
                <stop offset="40%" stopColor="#DB5C67"></stop>
                <stop offset="60%" stopColor="#9D3984"></stop>
                <stop offset="80%" stopColor="#860BA3"></stop>
                <stop offset="100%" stopColor="#0D0887"></stop>
              </linearGradient>
            </defs>
            <rect
              x="25"
              y="20"
              width="25"
              height={500}
              className="fill-legend"
            ></rect>
            <g
              transform="translate(60, 20)"
              fill="none"
              fontSize="10"
              fontFamily="sans-serif"
              textAnchor="start"
            >
              <path stroke="currentColor" d={`M0,0V${500}`}></path>
              <g fill="currentColor" transform={`translate(0, ${0})`}>
                <text dy="0.32em" y="0" x="5" fontSize={12}>
                  1.0
                </text>
              </g>
              <g fill="currentColor" transform={`translate(0, ${100})`}>
                <text dy="0.32em" y="0" x="5" fontSize={12}>
                  0.9
                </text>
              </g>
              <g fill="currentColor" transform={`translate(0, ${200})`}>
                <text dy="0.32em" y="0" x="5" fontSize={12}>
                  0.8
                </text>
              </g>
              <g fill="currentColor" transform={`translate(0, ${300})`}>
                <text dy="0.32em" y="0" x="5" fontSize={12}>
                  0.7
                </text>
              </g>
              <g fill="currentColor" transform={`translate(0, ${400})`}>
                <text dy="0.32em" y="0" x="5" fontSize={12}>
                  0.6
                </text>
              </g>
              <g fill="currentColor" transform={`translate(0, ${500})`}>
                <text dy="0.32em" y="0" x="5" fontSize={12}>
                  0.5
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export { CorrelationMap };
