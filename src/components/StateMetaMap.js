import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function StateMetaMap({newData}) {
  return (
    <div>
      <LineChart width={150} height={75} data={newData ? newData : data}>
        <Line
          type="monotone"
          dataKey="data"
          stroke="#ff073a"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </div>
  );
}

export default StateMetaMap;
