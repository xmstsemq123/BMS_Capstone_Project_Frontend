import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { format } from 'date-fns';
import { Box, Slider, Typography } from '@mui/material';

const colors = [
  '#e6194b','#3cb44b','#ffe119','#4363d8',
  '#f58231','#911eb4','#46f0f0','#f032e6',
  '#bcf60c','#fabebe','#008080','#e6beff',
  '#9a6324','#fffac8','#800000','#aaffc3'
];

// cell_2 / cell2 / cell 2 -> 統一顯示為 "cell 2"
const CELL_KEY_RE = /^cell[_ ]?(\d+)$/;
function canonicalizeKey(k) {
  const m = String(k).match(CELL_KEY_RE);
  return m ? `cell ${m[1]}` : k;
}

function parseTimeToMs(t) {
  if (typeof t === 'number' && Number.isFinite(t)) return t;
  if (typeof t === 'string' && t) {
    const ms = Date.parse(t);
    if (!Number.isNaN(ms)) return ms;
  }
  if (t && typeof t === 'object') {
    if ('$date' in t) {
      const ms = Date.parse(t.$date);
      if (!Number.isNaN(ms)) return ms;
    }
  }
  return undefined;
}

/** 把各種形態的輸入轉成：{ time: <ms>, "cell 2": <val>, ... } */
function convertMongoTimeData(input = []) {
  const rows = [];
  for (const d of input) {
    // 取時間：支援 d.time / d.timestamp / d.timestamp.$date
    const timeMs = parseTimeToMs(d.time ?? d.timestamp ?? d?.timestamp?.$date);
    if (!Number.isFinite(timeMs)) continue;

    const row = { time: timeMs };

    // 來源1：有 BalanceCurrent 物件
    if (d.BalanceCurrent && typeof d.BalanceCurrent === 'object') {
      for (const [k, v] of Object.entries(d.BalanceCurrent)) {
        row[canonicalizeKey(k)] = v;
      }
    } else {
      // 來源2：已扁平（可能只剩 "cell 2"）
      for (const [k, v] of Object.entries(d)) {
        if (k === 'time' || k === 'timestamp' || k === '_id') continue;
        const ck = canonicalizeKey(k);
        if (CELL_KEY_RE.test(ck)) row[ck] = v;
      }
    }

    rows.push(row);
  }

  rows.sort((a, b) => a.time - b.time);
  return rows;
}

export default function BCDataRechart({ data }) {
  const parsed = useMemo(() => convertMongoTimeData(data), [data]);
  const hasData = parsed.length > 0;

  // 動態蒐集所有 series key（排除 time），並依 cell 編號排序
  const seriesKeys = useMemo(() => {
    if (!hasData) return [];
    const set = new Set();
    for (const row of parsed) {
      for (const k of Object.keys(row)) {
        if (k !== 'time') set.add(k);
      }
    }
    return [...set].sort((a, b) => {
      const ma = a.match(CELL_KEY_RE), mb = b.match(CELL_KEY_RE);
      if (ma && mb) return Number(ma[1]) - Number(mb[1]);
      return a.localeCompare(b);
    });
  }, [parsed, hasData]);

  const [lineChartMargin, setLineChartMargin] = useState({ top: 20, right: 10, bottom: 60, left: -20 });

  // 時間範圍（滑桿）
  const [isRangeInitialized, setIsRangeInitialized] = useState(false);
  const [range, setRange] = useState(() => {
    if (!hasData) return [0, 1];
    const times = parsed.map(d => d.time);
    return [Math.min(...times), Math.max(...times)];
  });

  const handleSliderChange = (_, newValue) => setRange(newValue);

  const filteredData = useMemo(() => {
    if (!hasData) return [];
    return parsed.filter(d => d.time >= range[0] && d.time <= range[1]);
  }, [parsed, range, hasData]);

  useEffect(() => {
    if (hasData && !isRangeInitialized) {
      const times = parsed.map(d => d.time);
      setRange([Math.min(...times), Math.max(...times)]);
      setIsRangeInitialized(true);
    }
  }, [parsed, hasData, isRangeInitialized]);

  useEffect(() => {
    if (window.innerWidth < 640)
      setLineChartMargin({ top: 0, right: -20, bottom: 0, left: -20 });
    else
      setLineChartMargin({ top: 20, right: 10, bottom: 60, left: -20 });
  }, []);

  return hasData ? (
    <div className="w-[1440px] lg:w-auto right-[20px] overflow-hidden">
      <div className="w-full rounded-md bg-white p-4 overflow-x-auto sm:overflow-visible">
        <div className="origin-top-left sm:origin-center sm:w-full">
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={filteredData} margin={lineChartMargin}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                type="number"
                scale="time"
                domain={['auto', 'auto']}
                tickFormatter={(unixTime) => format(new Date(unixTime), 'yyyy-MM-dd HH:mm')}
                tick={{ fill: '#6B7280', fontSize: 14 }}
                height={70}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => format(new Date(label), 'yyyy-MM-dd HH:mm:ss')}
              />
              <Legend wrapperStyle={{ paddingTop: 8 }} />

              {/* 依資料自動產生多條線；支援 key 含空白（如 "cell 2"） */}
              {seriesKeys.map((key, i) => (
                <Line
                  key={key}
                  dataKey={key}          // 這裡可直接用 "cell 2"
                  strokeWidth={2}
                  dot={false}
                  stroke={colors[i % colors.length]}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Slider */}
        <Box sx={{ px: 4, mt: -10 }}>
          <Typography variant="body2" color="text.secondary">
            顯示區間：
            <strong>{format(new Date(range[0]), 'yyyy/MM/dd HH:mm')}</strong>
            {' ~ '}
            <strong>{format(new Date(range[1]), 'yyyy/MM/dd HH:mm')}</strong>
          </Typography>

          <Slider
            value={range}
            min={parsed[0].time}
            max={parsed[parsed.length - 1].time}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            getAriaLabel={() => '時間範圍'}
            valueLabelFormat={(value) => format(new Date(value), 'MM/dd HH:mm')}
            step={1000 * 60 * 1}
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
