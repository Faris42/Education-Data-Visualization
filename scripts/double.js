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
  const state2 = sd.getRecord(stateNames[0], activeYear);

  console.log(sd.getRecord(stateNames[0], activeYear));

  return;
}
