import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
var jz = require('jeezy');

const CorrelationMap = ({ numerical_cols, setSelectedPair }) => {
  const gridRef = useRef(null);
  const legendRef = useRef(null);

  var margin = { top: 50, bottom: 50, left: 60, right: 50 };

  var dim = 500;

  var width = dim - margin.left - margin.right,
    height = dim - margin.top - margin.bottom;

  // helper function to add row column indexes to each obj in data
  const getGrid = (data) => { 
    if (!data) return null;
    const columnLen = Object.keys(data[0]).length;
    let objArr = []
    let rowCounter = 1;
    let colCounter = 1;
    for (let i = 0; i < data.length; i++) {
      if (colCounter === columnLen + 1) {
        rowCounter++;
        colCounter = 1;
      }
      objArr.push({...data[i], row: rowCounter, column: colCounter})
      colCounter++

    }
    return objArr;
  }

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
    const grid = getGrid(corr);

    var rows = d3.max(grid, function (d) {
      return d.row;
    });

    // Clear previous chart *** THIS IS KEYYY ***
    d3.select(gridRef.current).selectAll('*').remove();
    d3.select(legendRef.current).selectAll('*').remove();

    d3.select('body')
      .selectAll('.tip')
      .data([0])
      .join('div')
      .attr('class', 'tip')
      .style('display', 'none');

    var svg = d3
      .select(gridRef.current)
      .selectAll('svg')
      .data([0])
      .join('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .selectAll('g')
      .data([0])
      .join('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(d3.range(1, rows + 1));

    var y = d3
      .scaleBand()
      .range([0, height])
      .domain(d3.range(1, rows + 1));

    var colorScale = d3
      .scaleLinear()
      .domain([extent[0], 0.6, 0.7, 0.8, 0.9, 1])
      .range([
        '#1A078C',
        '#7301A8',
        '#B73289',
        '#E16562',
        '#FCA736',
        '#F0F921',
      ]);

    var x_axis = d3
      .axisBottom(y)
      .tickFormat(function (d, i) {
        return cols[i];
      })
      .tickSize(0)
      .tickPadding(5)

    var y_axis = d3.axisLeft(x).tickFormat(function (d, i) {
      return cols[i];
    }).tickSize(0).tickPadding(5);

    svg
      .selectAll('.x_axis_g')
      .data([0])
      .join('g')
      .attr('class', 'x axis')
      .call(x_axis)
      .style('font-size', '14px')
      .attr('transform', 'translate(0, ' + height + ')')
      .select('.domain')
      .attr('stroke', 'transparent');

    svg
      .selectAll('.y_axis_g')
      .data([0])
      .join('g')
      .attr('class', 'y axis')
      .call(y_axis)
      .style('font-size', '14px')
      .select('.domain')
      .attr('stroke', 'transparent');

    svg
      .selectAll('rect')
      .data(grid, function (d) {
        return d.column_a + d.column_b;
      })
      .join('rect')
      .attr('x', function (d) {
        return x(d.column);
      })
      .attr('y', function (d) {
        return y(d.row);
      })
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', function (d) {
        return colorScale(d.correlation);
      })
      .style('opacity', 1e-6)
      .transition()
      .style('opacity', 1);

    var textGroup = svg
      .selectAll('.text-group')
      .data([null])
      .join('g')
      .attr('class', 'text-group');

    textGroup
      .selectAll('text')
      .data(grid)
      .join('text')
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
      .style('fill', (d) => (d.correlation > 0.7 ? 'black' : 'white'))
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

  const legendHeight = 350

  return (
    <div>
      <h2 className="flex justify-center items-center text-lg">
        Correlation Matrix
      </h2>
      <div className="flex items-center">
        <div ref={gridRef}></div>
        <div id="container" className="">
          <svg
            style={{ fill: 'white' }}
            height={legendHeight + 30}
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
                <stop offset="0%" stopColor="#F0F921"></stop>
                <stop offset="20%" stopColor="#FCA736"></stop>
                <stop offset="40%" stopColor="#E16562"></stop>
                <stop offset="60%" stopColor="#B73289"></stop>
                <stop offset="80%" stopColor="#7301A8"></stop>
                <stop offset="100%" stopColor="#1A078C"></stop>
              </linearGradient>
            </defs>
            <rect
              x="25"
              y="20"
              width="25"
              height={legendHeight}
              className="fill-legend bg-green-400"
            ></rect>
            <g
              transform="translate(60, 20)"
              fill="none"
              fontSize="10"
              fontFamily="sans-serif"
              textAnchor="start"
            >
              <g
                fill="currentColor"
                transform={`translate(0, ${(legendHeight / 5) * 0})`}
              >
                <text dy="0.32em" y="0" x="0" fontSize={12}>
                  1.0
                </text>
              </g>
              <g
                fill="currentColor"
                transform={`translate(0, ${(legendHeight / 5) * 1})`}
              >
                <text dy="0.32em" y="0" x="0" fontSize={12}>
                  0.9
                </text>
              </g>
              <g
                fill="currentColor"
                transform={`translate(0, ${(legendHeight / 5) * 2})`}
              >
                <text dy="0.32em" y="0" x="0" fontSize={12}>
                  0.8
                </text>
              </g>
              <g
                fill="currentColor"
                transform={`translate(0, ${(legendHeight / 5) * 3})`}
              >
                <text dy="0.32em" y="0" x="0" fontSize={12}>
                  0.7
                </text>
              </g>
              <g
                fill="currentColor"
                transform={`translate(0, ${(legendHeight / 5) * 4})`}
              >
                <text dy="0.32em" y="0" x="0" fontSize={12}>
                  0.6
                </text>
              </g>
              <g
                fill="currentColor"
                transform={`translate(0, ${(legendHeight / 5) * 5})`}
              >
                <text dy="0.32em" y="0" x="0" fontSize={12}>
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
