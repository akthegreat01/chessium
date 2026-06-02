"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockRatingData = [
  { name: 'Jan', rating: 1200 },
  { name: 'Feb', rating: 1250 },
  { name: 'Mar', rating: 1230 },
  { name: 'Apr', rating: 1300 },
  { name: 'May', rating: 1380 },
  { name: 'Jun', rating: 1420 },
  { name: 'Jul', rating: 1450 },
];

export default function StatisticsPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Statistics</h1>
        <p className="text-text-secondary">Track your progress and analyze your performance.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-secondary border border-border rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 22H5v-2h14v2M13 2c-1.25 0-2.42.62-3.11 1.66L7 8l2 2 2.06-2.06C11.28 8.56 12 9.44 12 10.5V16h2v-5.5c0-1.7-.76-3.27-2.06-4.31L14 4h5V2h-6z" />
            </svg>
          </div>
          <div className="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Blitz Rating</div>
          <div className="text-4xl font-bold text-white relative z-10">1450</div>
          <div className="text-accent text-sm mt-2 relative z-10 font-medium">▲ +30 this month</div>
        </div>
        <div className="bg-bg-secondary border border-border rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Win Rate</div>
          <div className="text-4xl font-bold text-white relative z-10">54.2%</div>
          <div className="text-text-tertiary text-sm mt-2 relative z-10">Based on 142 games</div>
        </div>
        <div className="bg-bg-secondary border border-border rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-[#F3CA20]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div className="text-text-secondary text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Puzzles Solved</div>
          <div className="text-4xl font-bold text-white relative z-10">342</div>
          <div className="text-[#F3CA20] text-sm mt-2 relative z-10 font-medium">15 day streak 🔥</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Rating Progression</h3>
            <p className="text-sm text-text-tertiary">Your Blitz rating over the last 6 months.</p>
          </div>
          <select disabled className="bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 text-sm text-white opacity-50 cursor-not-allowed">
            <option>Blitz</option>
            <option>Rapid</option>
            <option>Bullet</option>
          </select>
        </div>
        <div className="p-6 h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockRatingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a30" vertical={false} />
              <XAxis dataKey="name" stroke="#6b6b75" tick={{fill: '#6b6b75'}} tickLine={false} axisLine={false} dy={10} />
              <YAxis domain={['dataMin - 100', 'dataMax + 100']} stroke="#6b6b75" tick={{fill: '#6b6b75'}} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141416', borderColor: '#2a2a30', borderRadius: '8px' }}
                itemStyle={{ color: '#81b64c', fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="rating" stroke="#81b64c" strokeWidth={3} dot={{ fill: '#0a0a0b', stroke: '#81b64c', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#81b64c' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}
