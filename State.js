/**
 * Represents a state and contains a nested data structure of the time series
 * of Records. Should be nested inside a TopoJson feature.properties.value.
 */
export default class State {
  constructor(topoJsonKey, name) {
    this.topoJsonKey = topoJsonKey;
    this.name = name;
    this.years = {};
  }

  addRecord(record) {
    this.years[record.year] = record;
  }
}
