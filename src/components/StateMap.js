import {FormControl, Select, MenuItem} from '@material-ui/core';
import React, {useState} from 'react';
import Rechart from './Rechart';

function StateMap({
  wards,
  data,
  allDates,
  allConfirmedData,
  allRecoveredData,
  allDeceasedData,
  allMeanRT,
}) {
  //const [wards, setWards] = useState(['a', 'b', 'c']);
  console.log(data);
  console.log(allDates);
  const w = wards;
  console.log(w);
  const [ward, setWard] = useState('all');
  // let ward = 'all';
  const [confirmed, setConfirmed] = useState(allConfirmedData);
  const [deceased, setDeceased] = useState(allDeceasedData);
  const [recovered, setRecovered] = useState(allRecoveredData);
  const [rt, setRT] = useState(allMeanRT);

  console.log(allRecoveredData);
  console.log(allDeceasedData);

  const dates = Object.keys(data['A']);
  console.log(dates);

  const onChangeWard = (e) => {
    const val = e.target.value;
    // ward = val;
    setWard(val);
    console.log(val);
    // console.log(data[val]);
    // console.log(data[val].length);

    if (val === 'all') {
      console.log(data);

      // Data for confirmed
      const rechartConfirmedData = [];
      for (let i = 0; i < data['A'].length; i++) {
        const date = allDates[i].date;
        let cases = 0;
        for (let j = 0; j < data['A'].length; j++) {
          if (data['A'][j][date]) {
            cases +=
              +data['A'][j][date]['delta.confirmed'] +
              data['B'][j][date]['delta.confirmed'] +
              data['C'][j][date]['delta.confirmed'] +
              data['D'][j][date]['delta.confirmed'] +
              data['E'][j][date]['delta.confirmed'] +
              data['FN'][j][date]['delta.confirmed'] +
              data['FS'][j][date]['delta.confirmed'] +
              data['GN'][j][date]['delta.confirmed'] +
              data['GS'][j][date]['delta.confirmed'] +
              data['HE'][j][date]['delta.confirmed'] +
              data['HW'][j][date]['delta.confirmed'] +
              data['KE'][j][date]['delta.confirmed'] +
              data['KW'][j][date]['delta.confirmed'] +
              data['L'][j][date]['delta.confirmed'] +
              data['ME'][j][date]['delta.confirmed'] +
              data['MW'][j][date]['delta.confirmed'] +
              data['N'][j][date]['delta.confirmed'] +
              data['PN'][j][date]['delta.confirmed'] +
              data['PS'][j][date]['delta.confirmed'] +
              data['RC'][j][date]['delta.confirmed'] +
              data['RN'][j][date]['delta.confirmed'] +
              data['RS'][j][date]['delta.confirmed'] +
              data['S'][j][date]['delta.confirmed'] +
              data['T'][j][date]['delta.confirmed'];
            break;
          }
        }
        rechartConfirmedData.push({date: date, cases: cases});
      }

      setConfirmed(rechartConfirmedData);

      // Data for recovered
      const rechartRecoveredData = [];
      for (let i = 0; i < data['A'].length; i++) {
        const date = allDates[i].date;
        let cases = 0;
        for (let j = 0; j < data['A'].length; j++) {
          if (data['A'][j][date]) {
            cases +=
              +data['A'][j][date]['delta.recovered'] +
              data['B'][j][date]['delta.recovered'] +
              data['C'][j][date]['delta.recovered'] +
              data['D'][j][date]['delta.recovered'] +
              data['E'][j][date]['delta.recovered'] +
              data['FN'][j][date]['delta.recovered'] +
              data['FS'][j][date]['delta.recovered'] +
              data['GN'][j][date]['delta.recovered'] +
              data['GS'][j][date]['delta.recovered'] +
              data['HE'][j][date]['delta.recovered'] +
              data['HW'][j][date]['delta.recovered'] +
              data['KE'][j][date]['delta.recovered'] +
              data['KW'][j][date]['delta.recovered'] +
              data['L'][j][date]['delta.recovered'] +
              data['ME'][j][date]['delta.recovered'] +
              data['MW'][j][date]['delta.recovered'] +
              data['N'][j][date]['delta.recovered'] +
              data['PN'][j][date]['delta.recovered'] +
              data['PS'][j][date]['delta.recovered'] +
              data['RC'][j][date]['delta.recovered'] +
              data['RN'][j][date]['delta.recovered'] +
              data['RS'][j][date]['delta.recovered'] +
              data['S'][j][date]['delta.recovered'] +
              data['T'][j][date]['delta.recovered'];
            break;
          }
        }
        rechartRecoveredData.push({date: date, cases: cases});
      }
      setRecovered(rechartRecoveredData);

      // Data for recovered
      const rechartDeceasedData = [];
      for (let i = 0; i < data['A'].length; i++) {
        const date = allDates[i].date;
        let cases = 0;
        for (let j = 0; j < data['A'].length; j++) {
          if (data['A'][j][date]) {
            cases +=
              +data['A'][j][date]['delta.deceased'] +
              data['B'][j][date]['delta.deceased'] +
              data['C'][j][date]['delta.deceased'] +
              data['D'][j][date]['delta.deceased'] +
              data['E'][j][date]['delta.deceased'] +
              data['FN'][j][date]['delta.deceased'] +
              data['FS'][j][date]['delta.deceased'] +
              data['GN'][j][date]['delta.deceased'] +
              data['GS'][j][date]['delta.deceased'] +
              data['HE'][j][date]['delta.deceased'] +
              data['HW'][j][date]['delta.deceased'] +
              data['KE'][j][date]['delta.deceased'] +
              data['KW'][j][date]['delta.deceased'] +
              data['L'][j][date]['delta.deceased'] +
              data['ME'][j][date]['delta.deceased'] +
              data['MW'][j][date]['delta.deceased'] +
              data['N'][j][date]['delta.deceased'] +
              data['PN'][j][date]['delta.deceased'] +
              data['PS'][j][date]['delta.deceased'] +
              data['RC'][j][date]['delta.deceased'] +
              data['RN'][j][date]['delta.deceased'] +
              data['RS'][j][date]['delta.deceased'] +
              data['S'][j][date]['delta.deceased'] +
              data['T'][j][date]['delta.deceased'];
            break;
          }
        }
        rechartDeceasedData.push({date: date, cases: cases});
      }
      setDeceased(rechartDeceasedData);

      // Data for RT
      const rechartRTData = [];
      for (let i = 0; i < data['A'].length; i++) {
        const date = allDates[i].date;
        let cases = 0;
        for (let j = 0; j < data['A'].length; j++) {
          if (data['A'][j][date]) {
            cases +=
              +data['A'][j][date]['mean.RT'] +
              data['B'][j][date]['mean.RT'] +
              data['C'][j][date]['mean.RT'] +
              data['D'][j][date]['mean.RT'] +
              data['E'][j][date]['mean.RT'] +
              data['FN'][j][date]['mean.RT'] +
              data['FS'][j][date]['mean.RT'] +
              data['GN'][j][date]['mean.RT'] +
              data['GS'][j][date]['mean.RT'] +
              data['HE'][j][date]['mean.RT'] +
              data['HW'][j][date]['mean.RT'] +
              data['KE'][j][date]['mean.RT'] +
              data['KW'][j][date]['mean.RT'] +
              data['L'][j][date]['mean.RT'] +
              data['ME'][j][date]['mean.RT'] +
              data['MW'][j][date]['mean.RT'] +
              data['N'][j][date]['mean.RT'] +
              data['PN'][j][date]['mean.RT'] +
              data['PS'][j][date]['mean.RT'] +
              data['RC'][j][date]['mean.RT'] +
              data['RN'][j][date]['mean.RT'] +
              data['RS'][j][date]['mean.RT'] +
              data['S'][j][date]['mean.RT'] +
              data['T'][j][date]['mean.RT'];
            break;
          }
        }
        rechartRTData.push({date: date, cases: cases});
      }
      setRT(rechartRTData);
    } else {
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
    }

    e.preventDefault();
  };
  // onChangeWard('all');
  return (
    <>
      <div className="stateMapHeader">
        <div>
          <h1>Ward-Wise Stats</h1>
        </div>
        <div>
          <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
            <Select value={ward} onChange={onChangeWard}>
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
