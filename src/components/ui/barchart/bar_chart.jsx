import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { RadioGroup, RadioGroupItem } from '../../shared/radio_group';

const RadioButtons = ({ setCategoricalSelectedValue }) => {
  const items = ['sex', 'smoker', 'day', 'time'];
  return (
    <div className="">
      <RadioGroup
        className="flex w-full justify-between relative top-2 right-2"
        defaultValue="day"
      >
        {items.map((item, idx) => {
          return (
            <div key={idx} className="flex items-center gap-2">
              <label className="">{item}</label>
              <RadioGroupItem
                className="text-white border-white"
                value={item}
                id={item}
                onClick={(e) => {
                  setCategoricalSelectedValue(e.target.value);
                }}
              >
                {item}
              </RadioGroupItem>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

const BarChart = ({ numerical_data, categorical_data, selectedValue }) => {
  const svgRef = useRef();
  const [categoricalSelectedValue, setCategoricalSelectedValue] = useState('day');

  const computeSum = (values, selectedProperty) => {
    return d3.sum(values, (d) => d[selectedProperty]);
  };

  const genChart = useCallback(() => {
    const orderedDays = ['Thur', 'Fri', 'Sat', 'Sun'];
    // Combine numerical and categorical data into an array of objects
    const combinedData =
      numerical_data &&
      numerical_data.map((numData, index) => {
        const categoryValue =
          categorical_data && categorical_data[index][categoricalSelectedValue];
        return {
          ...numData,
          [categoricalSelectedValue]: categoryValue,
        };
      });
    if (!combinedData) return;

    const tempData = d3.flatRollup(
      combinedData,
      (values) => {
        const totalSum = computeSum(values, selectedValue);
        const average = totalSum / values.length;
        return average;
      },
      (d) => d[categoricalSelectedValue]
    );

    if (categoricalSelectedValue === 'day') {
      tempData &&
        tempData.sort((a, b) => {
          return orderedDays.indexOf(a[0]) - orderedDays.indexOf(b[0]);
        });
    }

    // Clear previous chart *** THIS IS KEYYY ***
    d3.select(svgRef.current).selectAll('*').remove();

    const w = 400;
    const h = 300;
    const svg = d3
      .select(svgRef.current)
      .attr('width', w)
      .attr('height', h)
      .style('overflow', 'visible')
      .style('margin-top', '20px');

    const xScale = d3
      .scaleBand()
      .domain(tempData.map((data) => data[0]))
      .range([0, w])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(tempData, (data) => data[1])])
      .range([h, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g').call(xAxis).attr('transform', `translate(0, ${h})`);
    svg.append('g').call(yAxis);

    svg
      .selectAll('.bar')
      .data(tempData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (data) => xScale(data[0]))
      .attr('y', (data) => yScale(data[1]))
      .attr('width', xScale.bandwidth())
      .attr('height', (data) => h - yScale(data[1]))
      .style('fill', 'royalblue');

    // Labels
    svg
      .selectAll('.bar-label')
      .data(tempData)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', function (d) {
        return xScale(d[0]) + xScale.bandwidth() / 2;
      })
      .attr('y', function (d) {
        return yScale(d[1]) + (h - yScale(d[1])) / 2;
      })
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(function (d) {
        return d[1].toFixed(2); // Display the value of the bar
      })
      .style('fill', 'white');
  }, [categoricalSelectedValue, categorical_data, numerical_data, selectedValue]);

  useEffect(() => {
    genChart();
  }, [genChart]);

  return (
    <div className="">
      <div className="">
        <RadioButtons
          setCategoricalSelectedValue={setCategoricalSelectedValue}
        />
      </div>
      <svg className="svg" ref={svgRef}></svg>
    </div>
  );
};

export { BarChart };
