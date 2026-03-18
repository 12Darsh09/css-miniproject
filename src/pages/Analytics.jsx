import React, { useState, useEffect } from 'react';
import { initialDebrisData } from '../data/debrisData';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';

function getDebris() {
  const s = localStorage.getItem('debrisData');
  return s ? JSON.parse(s) : initialDebrisData;
}

export default function Analytics() {
  const [debris, setDebris] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [agencyData, setAgencyData] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const rawData = getDebris();
    setDebris(rawData);

    // 1. Process Timeline Data (Cumulative launches over time)
    const yearCounts = {};
    rawData.forEach(d => {
      yearCounts[d.launchYear] = (yearCounts[d.launchYear] || 0) + 1;
    });

    const sortedYears = Object.keys(yearCounts).sort((a, b) => Number(a) - Number(b));
    let cumulative = 0;
    const tData = sortedYears.map(year => {
      cumulative += yearCounts[year];
      return { year: year, count: cumulative, newObjects: yearCounts[year] };
    });
    setTimelineData(tData);

    // 2. Process Agency/Country Data
    const countryCounts = {};
    rawData.forEach(d => {
      countryCounts[d.country] = (countryCounts[d.country] || 0) + 1;
    });

    const aData = Object.keys(countryCounts)
      .map(c => ({ country: c, count: countryCounts[c] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10
    setAgencyData(aData);

    // 3. Overview Stats
    const topYear = sortedYears.length > 0 
      ? sortedYears.reduce((a, b) => yearCounts[a] > yearCounts[b] ? a : b) 
      : '-';

    setStats({
      totalObjects: rawData.length,
      topAgency: aData.length > 0 ? aData[0].country : '-',
      activeYears: sortedYears.length,
      peakYear: topYear
    });

  }, []);

  const COLORS = ['#3b82f6', '#a855f7', '#22c55e', '#f97316', '#ef4444', '#eab308', '#ec4899', '#14b8a6', '#6366f1', '#8b5cf6'];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Analytics</div>
        <div className="page-subtitle">Historical trends and global agency breakdowns</div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-value">{stats.totalObjects}</div>
          <div className="stat-label">Total Monitored</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{stats.topAgency}</div>
          <div className="stat-label">Leading Contributor</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.activeYears}</div>
          <div className="stat-label">Years of Data</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--red)' }}>{stats.peakYear}</div>
          <div className="stat-label">Peak Launch Year</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Historical Timeline Container */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="section-title">Historical Debris Timeline</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '20px' }}>
            Cumulative growth of tracked objects in orbit since the first recorded launch in the dataset.
          </p>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3040" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  stroke="var(--text-3)" 
                  tick={{ fill: 'var(--text-3)', fontSize: 12 }} 
                  tickMargin={10} 
                  axisLine={{ stroke: '#2a3040' }} 
                />
                <YAxis 
                  stroke="var(--text-3)" 
                  tick={{ fill: 'var(--text-3)', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  itemStyle={{ color: 'var(--blue)' }}
                  labelStyle={{ color: 'var(--text-2)', fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Total Objects" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: 'var(--bg)' }} 
                  activeDot={{ r: 6, stroke: '#60a5fa', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Agency Leaderboard */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="section-title">Global Agency Leaderboard</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '20px' }}>
            Top 10 countries responsible for the currently monitored orbital objects.
          </p>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={agencyData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3040" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="var(--text-3)" 
                  tick={{ fill: 'var(--text-3)', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  dataKey="country" 
                  type="category" 
                  stroke="var(--text-3)" 
                  tick={{ fill: 'var(--text-2)', fontSize: 12, fontWeight: 500 }} 
                  axisLine={{ stroke: '#2a3040' }} 
                  tickLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  itemStyle={{ color: 'var(--text)' }}
                />
                <Bar dataKey="count" name="Objects" radius={[0, 4, 4, 0]} barSize={24}>
                  {agencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
