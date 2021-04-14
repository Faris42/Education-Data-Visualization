/**
 * Record for a single state, for a single year.
 */
export default class Record {
  constructor(data) {
    this.enroll = data.ENROLL;
    this.year = data.YEAR;
    this.state = data.STATE;
    // ...
  }
}
