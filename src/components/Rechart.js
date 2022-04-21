import {
  LineChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

function Rechart({title, data}) {
  return (
    <>
      {title && data && (
        <div>
          <h3 className="text-heading">{title}</h3>
          <ResponsiveContainer width="100%" aspect={1}>
            <LineChart data={data}>
              {/* <CartesianGrid /> */}
              <XAxis
                dataKey="date"
                style={{
                  fontSize: '1rem',
                  fontFamily: 'Times New Roman',
                }}
                interval={'preserveStartEnd'}
                minTickGap={50}
              />
              <YAxis
                orientation="right"
                style={{
                  fontSize: '1rem',
                  fontFamily: 'Times New Roman',
                }}
              ></YAxis>
              {/* <Legend /> */}
              <Tooltip />
              {/* <Line dataKey="student" stroke="black" activeDot={{r: 8}} /> */}
              <Line
                dataKey="cases"
                stroke="#ff073a"
                activeDot={{r: 8}}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
export default Rechart;
