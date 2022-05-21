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
  const w = wards;
  delete w[0];
  const [ward, setWard] = useState('A');
  const [confirmed, setConfirmed] = useState(allConfirmedData);
  const [deceased, setDeceased] = useState(allDeceasedData);
  const [recovered, setRecovered] = useState(allRecoveredData);
  const [rt, setRT] = useState(allMeanRT);

  const dates = Object.keys(data['A']);

  const onChangeWard = (e) => {
    const val = e.target.value;
    setWard(val);

    // // Set confirmed

    const confirmData = [];
    for (let i = 0; i < data['A'].length; i++) {
      const date = allDates[i].date;
      let cases = 0;
      for (let j = 0; j < data['A'].length; j++) {
        if (data[val][j][date]) {
          cases += data[val][j][date]['delta.confirmed'];
          break;
        }
      }
      confirmData.push({date: date, cases: cases});
    }
    setConfirmed(confirmData);

    // Set deceased
    const deceasedData = [];
    for (let i = 0; i < data['A'].length; i++) {
      const date = allDates[i].date;
      let cases = 0;
      for (let j = 0; j < data['A'].length; j++) {
        if (data[val][j][date]) {
          cases += data[val][j][date]['delta.deceased'];
          break;
        }
      }
      deceasedData.push({date: date, cases: cases});
    }

    setDeceased(deceasedData);

    // Set recovered
    const recoveredData = [];

    for (let i = 0; i < data['A'].length; i++) {
      const date = allDates[i].date;
      let cases = 0;
      for (let j = 0; j < data['A'].length; j++) {
        if (data[val][j][date]) {
          cases += data[val][j][date]['delta.recovered'];
          break;
        }
      }
      recoveredData.push({date: date, cases: cases});
    }

    setRecovered(recoveredData);

    // Data for RT
    const rechartRTData = [];
    for (let i = 0; i < data['A'].length; i++) {
      const date = allDates[i].date;
      let cases = 0;
      for (let j = 0; j < data['A'].length; j++) {
        if (data[val][j][date]) {
          cases += data[val][j][date]['mean.RT'];
          break;
        }
      }
      const roundOfCases = (Math.round(cases * 100) / 100).toFixed(2);
      rechartRTData.push({date: date, cases: roundOfCases});
    }
    setRT(rechartRTData);

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
            <div className="dropdown">
              <Select
                // autoWidth={true}
                MenuProps={{
                  sx: {
                    '&& .MuiInputBase-input': {
                      color: 'blue',
                    },
                  },
                }}
                variant="outlined"
                value={ward}
                onChange={onChangeWard}
                sx={{m: 1, minWidth: 500}}
              >
                <MenuItem value={'A'}>A</MenuItem>
                {w.map((ele, index) => (
                  <MenuItem value={ele}>{ele}</MenuItem>
                ))}
              </Select>
            </div>
          </FormControl>
          <div className="RechartNew">
            <Rechart title={'Confirmed'} data={confirmed} />
            <Rechart title={'Deceased'} data={deceased} />
            <Rechart title={'Recovered'} data={recovered} />
            {/* <Rechart title={'RT'} data={rt} /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default StateMap;
