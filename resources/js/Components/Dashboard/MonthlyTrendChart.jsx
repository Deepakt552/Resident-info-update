import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonthlyTrendChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22346e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22346e" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#22346e"
                    strokeWidth={2}
                    fill="url(#colorCount)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}