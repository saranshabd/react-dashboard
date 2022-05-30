import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {formatNumber} from '../utils/commonFunctions';

function createData(name, calories, fat, carbs, protein) {
  return {name, calories, fat, carbs, protein};
}

export default function MumbaiTable({wards, timeseries2, date}) {
  const rows = [];
  console.log(wards);
  console.log(timeseries2);
  const wardsLength = wards.length;
  console.log(wardsLength);
  const lastElementIndex = timeseries2['Mumbai']['A'].length - 1;
  console.log(lastElementIndex);

  for (let i = 0; i < wardsLength; i++) {
    const ward = wards[i];
    console.log(timeseries2['Mumbai'][ward][lastElementIndex]);
    rows.push(
      createData(
        ward,
        formatNumber(
          timeseries2['Mumbai'][ward][lastElementIndex][date]['delta.confirmed']
        ),
        formatNumber(
          timeseries2['Mumbai'][ward][lastElementIndex][date]['delta.deceased']
        ),
        formatNumber(
          timeseries2['Mumbai'][ward][lastElementIndex][date]['delta.recovered']
        ),
        formatNumber(
          timeseries2['Mumbai'][ward][lastElementIndex][date]['mean.RT']
        )
      )
    );
  }

  return (
    <div id="mumbaiTable">
      <TableContainer component={Paper}>
        <Table
          sx={{minWidth: '100%', border: '2px solid black'}}
          aria-label="simple table"
        >
          <TableHead
          // sx={{backgroundColor: '#FDE0E6'}}
          >
            <TableRow>
              <TableCell
                sx={{textAlign: 'center', borderBottom: '2px solid black'}}
              >
                <h3>Ward</h3>
              </TableCell>
              <TableCell
                sx={{textAlign: 'center', borderBottom: '2px solid black'}}
                Tabalign="right"
              >
                <h3>Confirmed</h3>
              </TableCell>
              <TableCell
                sx={{textAlign: 'center', borderBottom: '2px solid black'}}
                align="right"
              >
                <h3>Deceased</h3>
              </TableCell>
              <TableCell
                sx={{textAlign: 'center', borderBottom: '2px solid black'}}
                align="right"
              >
                <h3>Recovered</h3>
              </TableCell>
              <TableCell
                sx={{textAlign: 'center', borderBottom: '2px solid black'}}
                align="right"
              >
                <h3>mean RT</h3>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{
                  '&:last-child td, &:last-child th': {border: 0},
                }}
              >
                <TableCell
                  sx={{textAlign: 'center'}}
                  component="th"
                  scope="row"
                >
                  <h4>{row.name}</h4>
                </TableCell>
                <TableCell sx={{textAlign: 'center'}} align="right">
                  <h4>{row.calories}</h4>
                </TableCell>
                <TableCell sx={{textAlign: 'center'}} align="right">
                  <h4>{row.fat}</h4>
                </TableCell>
                <TableCell sx={{textAlign: 'center'}} align="right">
                  <h4>{row.carbs}</h4>
                </TableCell>
                <TableCell sx={{textAlign: 'center'}} align="right">
                  <h4>{row.protein}</h4>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
