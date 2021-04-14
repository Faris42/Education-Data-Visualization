/**
 * Represents a state and contains a nested data structure of the time series
 * of Records.
 */
class State {
  constructor(key, name) {
    this.key = key;
    this.name = name;
    this.years = [];
  }
}
