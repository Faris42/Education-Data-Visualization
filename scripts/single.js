function renderSingle(sd, stateName, yrs, activeYear) {
  console.log('single render', sd, stateName, yrs, activeYear);

  const records = sd.getRecords(stateName);
  console.log(records);
  console.log(activeYear);

  const currRecord = records.years[activeYear];

  // for mosaic at top
  console.log('mosaic');
  console.log(currRecord.INSTRUCTION_EXPENDITURE);
  console.log(currRecord.CAPITAL_OUTLAY_EXPENDITURE);
  console.log(currRecord.OTHER_EXPENDITURE);
  console.log(currRecord.SUPPORT_SERVICES_EXPENDITURE);

  other_costs =
    currRecord.OTHER_EXPENDITURE +
    (currRecord.TOTAL_EXPENDITURE -
      (currRecord.INSTRUCTION_EXPENDITURE +
        currRecord.CAPITAL_OUTLAY_EXPENDITURE +
        currRecord.OTHER_EXPENDITURE +
        currRecord.SUPPORT_SERVICES_EXPENDITURE));
  console.log(currRecord.TOTAL_EXPENDITURE);

  const svg = d3.select('svg#singleSvg');

  svg.selectAll('*').remove();
  const width = svg.attr('width');
  const height = svg.attr('height');
  const style = svg.attr('style');
  const margin = { top: 15, right: 10, bottom: 10, left: 10 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const percentScale = d3
    .scaleLinear()
    .domain([0, currRecord.TOTAL_EXPENDITURE])
    .range([0, chartWidth]);

  const mosaic = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  mosaic
    .append('text')
    .attr('x', chartWidth / 2 - 100)
    .text('Education Expenditure Breakdown');

  mosaic
    .append('rect')
    .attr('x', 0)
    .attr('y', 5)
    .attr('width', percentScale(currRecord.INSTRUCTION_EXPENDITURE))
    .attr('height', 50)
    .attr('fill', '#202c49');

  mosaic
    .append('rect')
    .attr('x', percentScale(currRecord.INSTRUCTION_EXPENDITURE))
    .attr('y', 5)
    .attr('width', percentScale(currRecord.CAPITAL_OUTLAY_EXPENDITURE))
    .attr('height', 50)
    .attr('fill', '#274c6f');

  mosaic
    .append('rect')
    .attr(
      'x',
      percentScale(currRecord.CAPITAL_OUTLAY_EXPENDITURE) +
        percentScale(currRecord.INSTRUCTION_EXPENDITURE)
    )
    .attr('y', 5)
    .attr('width', percentScale(currRecord.SUPPORT_SERVICES_EXPENDITURE))
    .attr('height', 50)
    .attr('fill', '#16b6eb');

  mosaic
    .append('rect')
    .attr(
      'x',
      percentScale(currRecord.CAPITAL_OUTLAY_EXPENDITURE) +
        percentScale(currRecord.INSTRUCTION_EXPENDITURE) +
        percentScale(currRecord.SUPPORT_SERVICES_EXPENDITURE)
    )
    .attr('y', 5)
    .attr('width', percentScale(other_costs))
    .attr('height', 50)
    .attr('fill', '#2979a3');

  // make legend

  // for graph

  const graph = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',0)');

  graph
    .append('text')
    .attr('x', chartWidth / 2 - 250)
    .attr('y', 95)
    .text(
      'GDP per Capita vs. Expenditure per Student vs Average Student Score'
    );

  const expendExtent = d3.extent(
    yrs,
    (d) => records.years[d].EXPENDITURE_PER_STUDENT
  );

  const gdpExtent = d3.extent(
    yrs,
    (d) => records.years[d].GDP_PER_CAPITA * 1000
  );

  const scoreExtent = d3.extent(yrs, (d) => records.years[d].AVG_SCORE);

  const moneyScale = d3
    .scaleLinear()
    .domain([
      Math.min(expendExtent[0], gdpExtent[0]),
      Math.max(expendExtent[1], gdpExtent[1]),
    ])
    .range([chartHeight - margin.bottom, 100]);

  const scoreScale = d3
    .scaleLinear()
    .domain(scoreExtent)
    .range([chartHeight - margin.bottom, 100]);

  const yearScale = d3
    .scaleLinear()
    .domain([2003, 2015])
    .range([margin.right + 30, chartWidth - margin.right - 50]);

  let leftAxis = d3.axisLeft(moneyScale).tickFormat(d3.format('$,'));
  graph
    .append('g')
    .lower()
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (margin.left + 30) + ',' + 0 + ')')
    .call(leftAxis);

  svg
    .append('text')
    .attr('x', -chartHeight / 2)
    .attr('y', margin.left + 3)
    .attr('transform', 'rotate(-90)')
    .style('text-anchor', 'middle')
    .text('Dollars (thousands)');

  let rightAxis = d3.axisRight(scoreScale).tickFormat(d3.format(''));
  graph
    .append('g')
    .lower()
    .attr('class', 'y axis')
    .attr(
      'transform',
      'translate(' + (chartWidth - margin.right - 40) + ',' + 0 + ')'
    )
    .call(rightAxis);

  svg
    .append('text')
    .attr('x', chartHeight / 2)
    .attr('y', -chartWidth - margin.left + 5)
    .attr('transform', 'rotate(90)')
    .style('text-anchor', 'middle')
    .text('Avg. Score');

  let bottomAxis = d3.axisBottom(yearScale).tickFormat(d3.format(''));
  graph
    .append('g')
    .lower()
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + 0 + ',' + chartHeight + ')')
    .call(bottomAxis);

  graph
    .append('path')
    .datum(yrs)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return yearScale(d);
        })
        .y(function (d) {
          return moneyScale(records.years[d].EXPENDITURE_PER_STUDENT);
        })
    );

  graph
    .append('path')
    .datum(yrs)
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return yearScale(d);
        })
        .y(function (d) {
          return moneyScale(records.years[d].GDP_PER_CAPITA * 1000);
        })
    );

  graph
    .append('path')
    .datum(yrs)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return yearScale(d);
        })
        .y(function (d) {
          return scoreScale(records.years[d].AVG_SCORE);
        })
    );

  svg.select('#timeMarker').remove();

  graph
    .append('line')
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 1.5)
    .attr('id', 'timeMarker')
    .attr('x1', yearScale(activeYear))
    .attr('x2', yearScale(activeYear))
    .attr('y1', chartHeight - 5)
    .attr('y2', 100);

  // let leftGridlines = d3
  //   .axisLeft(priceScale)
  //   .tickSize(-chartWidth - 10)
  //   .tickFormat('');
  // svg
  //   .append('g')
  //   .lower()
  //   .attr('class', 'y gridlines')
  //   .attr(
  //     'transform',
  //     'translate(' + (margins.left - 10) + ',' + margins.top + ')'
  //   )
  //   .call(leftGridlines);

  // let bottomGridlines = d3
  //   .axisBottom(caratScale)
  //   .ticks(5)
  //   .tickSize(-chartHeight - 10)
  //   .tickFormat('');

  console.log(yrs);
  yrs.forEach((year) => {
    console.log(year);
    if (year === activeYear) {
      console.log('ACTIVE');
    }
    console.log(records.years[year].GDP_PER_CAPITA);
    console.log(records.years[year].AVG_SCORE);
    console.log(records.years[year].EXPENDITURE_PER_STUDENT);
  });

  // gdp is in millions
  // expenditure is in thousands

  return;
}
