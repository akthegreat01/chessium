"use client";

import { ResponsiveContainer, AreaChart, Area, ReferenceLine, Tooltip, XAxis } from "recharts";

interface EvalData {
  moveNumber: number;
  cp: number | null;
  mate: number | null;
}

interface EvalGraphProps {
  data: EvalData[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

export default function EvalGraph({ data, currentMoveIndex, onMoveClick }: EvalGraphProps) {
  const MAX_CP = 500;

  const chartData = data.map((d, i) => {
    let score = 0;
    if (d.mate !== null) {
      score = d.mate > 0 ? MAX_CP : -MAX_CP;
    } else {
      score = Math.max(-MAX_CP, Math.min(MAX_CP, d.cp ?? 0));
    }
    
    // Normalize to -100 to 100 for display
    const normalized = (score / MAX_CP) * 100;
    
    return {
      index: i,
      move: Math.floor(i / 2) + 1,
      score: normalized,
      rawCp: d.cp,
      mate: d.mate,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const text = data.mate !== null 
        ? `M${Math.abs(data.mate)}` 
        : (data.rawCp > 0 ? "+" : "") + (data.rawCp / 100).toFixed(1);
      
      return (
        <div className="bg-[#1a1a1f] border border-[#2a2a30] p-2 rounded shadow-lg text-xs font-mono">
          <p className="text-[#a0a0a8]">Move {data.move}</p>
          <p className="text-white font-bold text-sm">{text}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-24 bg-[#0a0a0b] rounded-lg border border-[#2a2a30] overflow-hidden relative group">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          onClick={(e: any) => {
            if (e && e.activePayload && e.activePayload.length) {
              onMoveClick(e.activePayload[0].payload.index);
            }
          }}
        >
          <defs>
            <linearGradient id="evalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#ffffff" stopOpacity={0.2} />
              <stop offset="50%" stopColor="#2a2a30" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#2a2a30" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <XAxis dataKey="index" hide />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#81b64c', strokeWidth: 1 }} />
          <ReferenceLine y={0} stroke="#4a4a55" strokeWidth={1} />
          {chartData.length > 0 && (
            <ReferenceLine x={currentMoveIndex} stroke="#81b64c" strokeWidth={2} />
          )}
          <Area
            type="monotone"
            dataKey="score"
            stroke="none"
            fill="url(#evalGradient)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
