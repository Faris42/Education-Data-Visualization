class StateDict {
  static capFirstLetter(words) {
    const wordArr = words.toLowerCase().split('_');
    for (let i = 0; i < wordArr.length; i++) {
      wordArr[i] = wordArr[i].charAt(0).toUpperCase() + wordArr[i].substring(1);
    }
    return wordArr.join(' ');
  }

  constructor(data) {
    this.states = {};
    data.forEach((r) => {
      const record = new Record(r);
      record.STATE = StateDict.capFirstLetter(record.STATE);
      if (record.STATE in this.states) {
        // push new record
        this.states[record.STATE].addRecord(record);
      } else {
        const state = new State(record.STATE);
        state.addRecord(record);
        this.states[record.STATE] = state;
      }
    });
  }

  getAllForField(yr = null, fieldName = null) {
    if (fieldName === null) return [];
    const result = [];
    for (const name in this.states) {
      const state = this.states[name];
      if (yr === null) {
        for (const year in state.years) {
          const record = state.years[year];
          result.push(record[fieldName]);
        }
      } else {
        const record = state.years[yr];
        result.push(record[fieldName]);
      }
    }
    return result;
  }

  getYears() {
    const result = new Set();
    for (const name in this.states) {
      const state = this.states[name];
      for (const year in state.years) {
        result.add(parseInt(year));
      }
    }
    return [...result].sort((a, b) => a - b);
  }

  getGDP(stateName, year) {
    const state = this.states[stateName];
    const record = state.years[year];
    return record.GDP;
  }

  getRecord(stateName, year) {
    const state = this.states[stateName];
    const record = state.years[year];
    return record;
  }

  getRecords(stateName) {
    const state = this.states[stateName];
    return state;
  }
}

class State {
  constructor(name) {
    this.name = name;
    this.years = {};
  }

  addRecord(record) {
    this.years[record.YEAR] = record;
  }
}

class Record {
  static toInt(str) {
    return str ? parseInt(str) : null;
  }

  static toFloat(str) {
    return str ? parseFloat(str) : null;
  }

  constructor(obj) {
    const { YEAR, PRIMARY_KEY, STATE, POPULATION, ...rest } = obj;
    for (const key in rest) {
      // Remove empty keys and set type to float
      if (key !== '') this[key] = Record.toFloat(rest[key]);
    }
    this.YEAR = Record.toInt(YEAR);
    this.PRIMARY_KEY = PRIMARY_KEY;
    this.STATE = STATE;
    this.POPULATION = Record.toInt(POPULATION);
    this.EXPENDITURE_PER_STUDENT = this.TOTAL_EXPENDITURE / this.ENROLL;
    this.AVG_SCORE_PERCENTAGE = this.AVG_SCORE / 500;
  }
}
