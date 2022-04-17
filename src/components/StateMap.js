import {FormControl, Select, MenuItem} from '@material-ui/core';
import React, {useState} from 'react';
import Rechart from './Rechart';

function StateMap({wards, data, allDates}) {
  //const [wards, setWards] = useState(['a', 'b', 'c']);
  console.log(data);
  console.log(allDates);
  const w = wards;
  console.log(w);
  const [ward, setWard] = useState('all');
  // let ward = 'all';
  const [confirmed, setConfirmed] = useState([]);
  const [deceased, setDeceased] = useState([]);
  const [recovered, setRecovered] = useState([]);
  const [rt, setRT] = useState([]);

  const dates = Object.keys(data['A']);
  console.log(dates);

  const onChangeWard = (e) => {
    const val = e.target.value;
    // ward = val;
    setWard(val);
    console.log(val);
    console.log(data[val]);
    console.log(data[val].length);

    // Set confirmed
    const confirmData = [];

    for (let i = 0; i < data[val].length; i++) {
      const currDate = allDates[i].date;
      const cases = data[val][i][currDate]['delta.confirmed'];
      confirmData.push({date: currDate, cases: cases});
    }
    setConfirmed(confirmData);

    // Set deceased
    const deceasedData = [];

    for (let i = 0; i < data[val].length; i++) {
      const currDate = allDates[i].date;
      const cases = data[val][i][currDate]['delta.deceased'];
      deceasedData.push({date: currDate, cases: cases});
    }
    setDeceased(deceasedData);

    // Set recovered
    const recoveredData = [];

    for (let i = 0; i < data[val].length; i++) {
      const currDate = allDates[i].date;
      const cases = data[val][i][currDate]['delta.recovered'];
      recoveredData.push({date: currDate, cases: cases});
    }
    setRecovered(recoveredData);

    // Set rt
    const rtData = [];

    for (let i = 0; i < data[val].length; i++) {
      const currDate = allDates[i].date;
      const cases = data[val][i][currDate]['delta.deceased'];
      rtData.push({date: currDate, cases: cases});
    }
    setRT(rtData);

    e.preventDefault();
  };

  return (
    <>
      <div className="stateMapHeader">
        <div>
          <h1>Ward-Wise Stats</h1>
        </div>
        <div>
          <FormControl>
            <Select value={ward} onChange={onChangeWard}>
              {/* default value */}
              <MenuItem value={'all'}>All</MenuItem>
              {w.map((ele, index) => (
                <MenuItem value={ele}>{ele}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="RechartNew">
            <Rechart title={'Confirmed'} data={confirmed} />
            <Rechart title={'Deceased'} data={deceased} />
            <Rechart title={'Recovered'} data={recovered} />
            <Rechart title={'RT'} data={rt} />
          </div>
        </div>
      </div>
    </>
  );
}

export default StateMap;
