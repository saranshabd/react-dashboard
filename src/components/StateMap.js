import {FormControl, Select} from '@material-ui/core';
import React, {useState} from 'react';

function StateMap() {
  const [wards, setWards] = useState(['a', 'b', 'c']);
  return (
    <>
      <div className="stateMapHeader">
        <div>
          <h1>Ward-Wise Stats</h1>
        </div>
        <div>
          <FormControl>
            <Select value="abd"></Select>
          </FormControl>
        </div>
      </div>
    </>
  );
}

export default StateMap;
