import State from './State';
import Record from './Record';

export function construct(data) {
  const out = [];
  const stateDict = {};
  data.forEach((record) => {
    const recordObj = new Record(record);
    if (record.state in stateDict) {
      // push new record
    } else {
      const state = new State(record.state, record.state);
      state.addRecord();
      stateDict[record.state] = state;
    }
  });
}
