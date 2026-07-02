import React from 'react';

export default function QuickInsights({ insights }) {
    const insightCards = [
        {
            title: 'Most Common Inspection',
            value: insights.most_common_inspection_type,
            description: 'Most requested inspection type',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Best Performing Property',
            value: insights.best_performing_property,
            description: 'Highest inspection count',
            gradient: 'from-emerald-500 to-teal-500',
        },
        {
            title: 'Approval Ratio',
            value: `${insights.approval_ratio}%`,
            description: 'Inspections approved',
            gradient: 'from-green-500 to-emerald-500',
        },
        {
            title: 'Completion Ratio',
            value: `${insights.completion_ratio}%`,
            description: 'Overall completion rate',
            gradient: 'from-indigo-500 to-purple-500',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {insightCards.map((card, index) => (
                <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <div className="p-6">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {card.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                            {card.value}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {card.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}