function renderSingle(sd, stateName, yrs, activeYear) {
  console.log('single render', sd, stateName, yrs, activeYear);

  const records = sd.getRecords(stateName);
  console.log(records);
  console.log(activeYear);

  // gdp is in millions

  return;
}
