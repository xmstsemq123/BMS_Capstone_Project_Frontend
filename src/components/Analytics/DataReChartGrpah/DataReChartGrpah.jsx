import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { format } from 'date-fns';
import { Box, Slider, Typography } from '@mui/material';

function convertMongoTimeData(input) {
  return input.map(d => ({
    time: new Date(d.time.$date).getTime(),
    value: d.value,
  }));
}

export default function VoltageHistoryFigure({ data }) {
  data = convertMongoTimeData(data);
  const hasData = data.length > 0;
  const [lineChartMargin, setLineChartMargin] = useState({ top: 20, right: 10, bottom: 60, left: -30 })
  const [isRangeInitialized, setIsRangeInitialized] = useState(false);
  const [range, setRange] = useState(() => {
    if (!hasData) return [0, 1];
    const times = data.map(d => d.time);
    return [Math.min(...times), Math.max(...times)];
  });
  const handleSliderChange = (_, newValue) => {
    setRange(newValue);
  };
  const filteredData = useMemo(() => {
    return data.filter(d => d.time >= range[0] && d.time <= range[1]);
  }, [data, range]);
  useEffect(() => {
    if (hasData && !isRangeInitialized) {
      const times = data.map(d => d.time);
      setRange([Math.min(...times), Math.max(...times)]);
      setIsRangeInitialized(true);
    }
  }, [data, hasData, isRangeInitialized]);
  useEffect(() => {
    if (window.innerWidth < 640) setLineChartMargin({
      top: 0, right: -20, bottom: 0, left: -20
    })
    else setLineChartMargin({
      top: 20, right: 10, bottom: 60, left: -20
    })
  }, [])
  return hasData ? (
    <div
      className="w-[1440px] lg:w-auto right-[20px] overflow-hidden"
    >
      <div className="w-full rounded-md bg-white p-4 overflow-x-auto sm:overflow-visible">
        <div className="origin-top-left sm:origin-center sm:w-full">
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={filteredData}
              margin={lineChartMargin}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                type="number"
                scale="time"
                domain={['auto', 'auto']}
                tickFormatter={(unixTime) =>
                  format(new Date(unixTime), 'yyyy-MM-dd HH:mm')
                }
                angle={0}
                tick={{ fill: '#6B7280', fontSize: 14 }}
                height={70}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) =>
                  format(new Date(label), 'yyyy-MM-dd HH:mm:ss')
                }
              />
              <Line dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Slider 保持原方向 */}
        <Box sx={{ px: 4, mt: -10 }}>
          <Typography variant="body2" color="text.secondary">
            顯示區間：
            <strong>{format(new Date(range[0]), 'yyyy/MM/dd HH:mm')}</strong> ~{' '}
            <strong>{format(new Date(range[1]), 'yyyy/MM/dd HH:mm')}</strong>
          </Typography>

          <Slider
            value={range}
            min={data[0].time}
            max={data[data.length - 1].time}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            getAriaLabel={() => '時間範圍'}
            valueLabelFormat={(value) => format(new Date(value), 'MM/dd HH:mm')}
            step={1000 * 60 * 1}
            color='black'
          />
        </Box>
      </div>
    </div>


  ) : (
    <div className='w-full h-[400px] flex items-center justify-center text-gray-400 text-3xl'>
      📭 此時段無數據
    </div>
  );
}
