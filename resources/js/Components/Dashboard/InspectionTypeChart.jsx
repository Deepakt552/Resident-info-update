import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#22346e', '#f34853', '#10b981'];

export default function InspectionTypeChart({ data }) {
    const chartData = [
        { name: 'Move In', value: data.moveIn, color: COLORS[0] },
        { name: 'Move Out', value: data.moveOut, color: COLORS[1] },
        { name: 'Unit Inspection', value: data.unitInspection, color: COLORS[2] },
    ].filter(item => item.value > 0);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}