async function renderDouble(sd, stateNames, yrs, activeYear) {
  // //console.log('double render', sd, stateNames, yrs, activeYear);
  // const data = await d3.csv('/data/final.csv');
  // data.forEach((d) => {
  //   d.YEAR = parseInt(d.YEAR);
  //   d.AVG_SCORE = parseInt(d.AVG_SCORE);
  //   d.GDP = parseInt(d.GDP);
  //   d.GDP_PER_CAPITA = parseFloat(d.GDP_PER_CAPITA);
  //   d.INSTRUCTION_EXPENDITURE = parseInt(d.INSTRUCTION_EXPENDITURE);
  // });
  // const yearData = data.filter(function (point) {
  //   return point.YEAR === activeYear;
  // });
  // let state1 = yearData.filter(function (point) {
  //   return point.STATE === stateNames[0].toUpperCase();
  // });
  // let state2 = yearData.filter(function (point) {
  //   return point.STATE === stateNames[1].toUpperCase();
  // });

  // state1 = state1[0];
  // state2 = state2[0];

  // console.log(data);
  // console.log(yearData);

  // console.log(state1);
  // console.log(state2);

  // console.log(state1.AVG_SCORE);

  // console.log('gdp sd function', stateNames[0], activeYear);
  // // console.log(sd.getGDP(stateNames[0], activeYear));
  // // console.log(state1.GDP);
  // // console.log(state1.GDP_PER_CAPITA);
  // // console.log(state1.INSTRUCTION_EXPENDITURE);

  const state1 = sd.getRecord(stateNames[0], activeYear);
  const state2 = sd.getRecord(stateNames[1], activeYear);

  console.log(state1.GDP);
  console.log(state2.GDP);
  //console.log(sd.getRecord(stateNames[0], activeYear));

  const values = ['GDP', 'GDP_PER_CAPITA', 'INSTRUCTION_EXPENDITURE'];

  const div = d3.select('div#screen_double');
  // div.style("display", "block");

  const svg = d3.select('svg#doubleSvg');
  const width = svg.attr('width');
  const height = svg.attr('height');
  const style = svg.attr('style');
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  let annotations = svg.append('g').attr('id', 'annotations');
  let chartArea = svg
    .append('g')
    .attr('id', 'points')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const percentScale = d3.scaleLinear().domain([0, 1]).range([0, chartWidth]);

  let yCounter = 100;
  values.forEach(function (v) {
    let value1 = state1[v];
    let value2 = state2[v];

    let percent1 = value1 / (value1 + value2);
    let percent2 = value2 / (value1 + value2);

    // console.log(value1);
    // console.log(percent1);
    // console.log(value2);
    // console.log(percent2);

    let text = v;

    // chartArea.append("text")
    //           .attr("x", 25)
    //           .attr("y", yCounter-25)
    //           .style("font: 40px sans serif black;")
    //           .text(text)

    chartArea
      .append('rect')
      .attr('x', 0)
      .attr('y', yCounter)
      .attr('width', percentScale(percent1))
      .attr('height', 50)
      .attr('fill', 'red');

    chartArea
      .append('rect')
      .attr('x', percentScale(percent1))
      .attr('y', yCounter)
      .attr('width', percentScale(percent2))
      .attr('height', 50)
      .attr('fill', 'blue');

    yCounter += 100;
  });
  return;
}
