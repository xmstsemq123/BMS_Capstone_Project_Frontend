import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { format } from 'date-fns';
import { Box, Slider, Typography } from '@mui/material';

// --------- 工具：LTTB 抽稀（Largest-Triangle-Three-Buckets） ---------
function lttb(data, threshold) {
  const n = data.length;
  if (threshold >= n || threshold <= 0) return data;
  const sampled = [];
  const bucketSize = (n - 2) / (threshold - 2);
  let a = 0;
  sampled.push(data[a]); // first point
  for (let i = 0; i < threshold - 2; i++) {
    const rangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const rangeEnd = Math.floor((i + 2) * bucketSize) + 1;
    const rangeStartClamped = Math.min(rangeStart, n - 1);
    const rangeEndClamped = Math.min(rangeEnd, n);
    let avgX = 0, avgY = 0, rangeLen = rangeEndClamped - rangeStartClamped;
    for (let j = rangeStartClamped; j < rangeEndClamped; j++) {
      avgX += data[j].time;
      avgY += data[j].value;
    }
    avgX /= Math.max(rangeLen, 1);
    avgY /= Math.max(rangeLen, 1);

    const rangeAStart = Math.floor(i * bucketSize) + 1;
    const rangeAEnd = Math.floor((i + 1) * bucketSize) + 1;
    const rangeAStartClamped = Math.min(rangeAStart, n - 1);
    const rangeAEndClamped = Math.min(rangeAEnd, n - 1);

    let maxArea = -1;
    let maxAreaIndex = rangeAStartClamped;

    for (let j = rangeAStartClamped; j < rangeAEndClamped; j++) {
      const ax = data[a].time, ay = data[a].value;
      const bx = data[j].time, by = data[j].value;
      const area = Math.abs(
        (ax - avgX) * (by - ay) - (ax - bx) * (avgY - ay)
      );
      if (area > maxArea) {
        maxArea = area;
        maxAreaIndex = j;
      }
    }
    sampled.push(data[maxAreaIndex]);
    a = maxAreaIndex;
  }
  sampled.push(data[n - 1]); // last point
  return sampled;
}

// --------- 工具：時間格式動態切換 ---------
function makeTimeFormatter(start, end) {
  const span = end - start; // ms
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;

  if (span <= 2 * hour) return (t) => format(new Date(t), 'HH:mm:ss');
  if (span <= 2 * day)  return (t) => format(new Date(t), 'MM-dd HH:mm');
  if (span <= 2 * month) return (t) => format(new Date(t), 'MM-dd');
  return (t) => format(new Date(t), 'yyyy-MM');
}

// --------- 工具：debounce ---------
function useDebouncedCallback(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

// --------- 安全轉換 Mongo 時間 ---------
function convertMongoTimeData(input) {
  if (!Array.isArray(input)) return [];
  return input.map(d => {
    // 容錯：可能是 ISO 字串、數字、或 { $date: ... }
    const raw = d?.time?.$date ?? d?.time ?? d?.timestamp ?? d?.t;
    const ms = typeof raw === 'number' ? raw : new Date(raw).getTime();
    return { time: ms, value: Number(d.value) };
  }).filter(d => Number.isFinite(d.time) && Number.isFinite(d.value));
}

export default function VoltageHistoryFigure({ data }) {
  // 只在 data 改變時轉換一次
  const baseData = useMemo(() => convertMongoTimeData(data).sort((a,b)=>a.time-b.time), [data]);
  const hasData = baseData.length > 0;

  // 圖表外距
  const [lineChartMargin, setLineChartMargin] = useState({ top: 20, right: 10, bottom: 60, left: -20 });

  // 容器寬度（用來決定抽稀點數上限）
  const [containerWidth, setContainerWidth] = useState(800);

  // 顯示的時間區間
  const [range, setRange] = useState(() => {
    if (!hasData) return [0, 1];
    return [baseData[0].time, baseData[baseData.length - 1].time];
  });

  // 首次資料到位時初始化 range
  useEffect(() => {
    if (!hasData) return;
    setRange([baseData[0].time, baseData[baseData.length - 1].time]);
  }, [hasData, baseData]);

  // RWD 調整 margin
  useEffect(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (w < 640) setLineChartMargin({ top: 0, right: -20, bottom: 0, left: -20 });
    else setLineChartMargin({ top: 20, right: 10, bottom: 60, left: -20 });
  }, []);

  // Slider 變更加上 debounce，避免頻繁重繪
  const setRangeDebounced = useDebouncedCallback((v) => setRange(v), 80);
  const handleSliderChange = (_, newValue) => {
    setRangeDebounced(newValue);
  };

  // 依 range 過濾可見資料
  const filteredData = useMemo(() => {
    if (!hasData) return [];
    const [start, end] = range;
    // 快速二分切片（可進一步優化），這裡用線性 filter 也可
    return baseData.filter(d => d.time >= start && d.time <= end);
  }, [baseData, hasData, range]);

  // 依容器寬度抽稀（像素級）：最多 ≈ 容器寬度的 1.2 倍點數，介於 200~5000
  const decimatedData = useMemo(() => {
    if (filteredData.length <= 5000) return filteredData; // 小於門檻就不用抽稀
    const maxPts = Math.max(200, Math.min(5000, Math.floor(containerWidth * 1.2 || 800)));
    return lttb(filteredData, maxPts);
  }, [filteredData, containerWidth]);

  // 動態時間格式
  const xTickFormatter = useMemo(() => {
    if (!hasData) return (t) => t;
    return makeTimeFormatter(range[0], range[1]);
  }, [hasData, range]);

  return hasData ? (
    <div className="w-[1440px] lg:w-auto right-[20px] overflow-hidden">
      <div className="w-full rounded-md bg-white p-4 overflow-x-auto sm:overflow-visible">
        <div className="origin-top-left sm:origin-center sm:w-full">
          <ResponsiveContainer width="100%" height={500} onResize={(w,h) => setContainerWidth(w)}>
            <LineChart data={decimatedData} margin={lineChartMargin}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="time"
                type="number"
                scale="time"
                domain={['auto', 'auto']}
                tickFormatter={xTickFormatter}
                // ↓↓↓ 抑制重疊的關鍵
                interval="preserveStartEnd"
                minTickGap={30}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickMargin={8}
                height={50}
                allowDataOverflow
              />

              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                width={60}
              />

              <Tooltip
                labelFormatter={(label) => format(new Date(label), 'yyyy-MM-dd HH:mm:ss')}
                formatter={(v) => [v, 'value']}
              />

              <Line
                dataKey="value"
                type="linear"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false} // 關閉動畫以提速
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Slider */}
        <Box sx={{ px: 4, mt: -10 }}>
          <Typography variant="body2" color="text.secondary">
            顯示區間：
            <strong>{format(new Date(range[0]), 'yyyy/MM/dd HH:mm')}</strong> ~{' '}
            <strong>{format(new Date(range[1]), 'yyyy/MM/dd HH:mm')}</strong>
          </Typography>

          <Slider
            value={range}
            min={baseData[0].time}
            max={baseData[baseData.length - 1].time}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            getAriaLabel={() => '時間範圍'}
            valueLabelFormat={(value) => format(new Date(value), 'MM/dd HH:mm')}
            step={1000 * 60 * 5}
            color="primary"
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
