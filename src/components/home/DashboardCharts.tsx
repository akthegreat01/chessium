"use client";

import React from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";

export function StatSparkline({ data, color }: { data: any[], color: string }) {
  return (
    <div className="h-[40px] w-full mt-2 relative -mx-2 -mb-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color-${color})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerformanceChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#121620', border: '1px solid #1e2433', borderRadius: '8px' }}
            itemStyle={{ color: '#F8FAFC' }}
          />
          <Area type="monotone" dataKey="rating" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
