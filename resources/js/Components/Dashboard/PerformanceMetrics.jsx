import React from 'react';

const STATUS_CONFIG = {
    pending: { gradient: 'from-amber-400 to-orange-500', label: 'Pending' },
    approved: { gradient: 'from-green-400 to-emerald-500', label: 'Approved' },
    rejected: { gradient: 'from-red-400 to-rose-500', label: 'Rejected' },
    completed: { gradient: 'from-indigo-400 to-blue-500', label: 'Completed' },
    // draft: { gradient: 'from-gray-400 to-slate-500', label: 'Draft' },
};

export default function PerformanceMetrics({ statusStats, totalInspections }) {
    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 shadow-sm">
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Performance Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(statusStats).map(([key, count]) => {
                    const config = STATUS_CONFIG[key] || STATUS_CONFIG.draft;
                    const percentage =
                        totalInspections > 0 ? (count / totalInspections) * 100 : 0;

                    return (
                        <div
                            key={key}
                            className={`relative overflow-hidden rounded-2xl p-4 text-white bg-gradient-to-br ${config.gradient} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                        >
                            {/* soft shine overlay */}
                            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/5" />

                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium opacity-90">
                                        {config.label}
                                    </span>
                                    <span className="text-2xl font-bold">
                                        {count}
                                    </span>
                                </div>

                                {/* progress bar */}
                                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white/80 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                <p className="text-xs mt-2 opacity-80">
                                    {percentage.toFixed(1)}% of total
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 
// import React from 'react';

// const STATUS_CONFIG = {
//     pending: { color: 'amber', label: 'Pending', icon: 'ClockIcon' },
//     approved: { color: 'green', label: 'Approved', icon: 'CheckCircleIcon' },
//     rejected: { color: 'red', label: 'Rejected', icon: 'XCircleIcon' },
//     completed: { color: 'navy', label: 'Completed', icon: 'DocumentCheckIcon' },
//     draft: { color: 'gray', label: 'Draft', icon: 'PencilSquareIcon' },
// };

// const getColorClasses = (color) => {
//     const colors = {
//         amber: { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', bar: 'bg-amber-500' },
//         green: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', bar: 'bg-green-500' },
//         red: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', bar: 'bg-red-500' },
//         navy: { bg: 'bg-indigo-100 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-400', bar: 'bg-indigo-600' },
//         gray: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', bar: 'bg-gray-500' },
//     };
//     return colors[color];
// };

// export default function PerformanceMetrics({ statusStats, totalInspections }) {
//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
//                 Performance Metrics
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {Object.entries(statusStats).map(([key, count]) => {
//                     const config = STATUS_CONFIG[key];
//                     const percentage = totalInspections > 0 ? (count / totalInspections) * 100 : 0;
//                     const colors = getColorClasses(config.color);

//                     return (
//                         <div key={key} className="space-y-2">
//                             <div className="flex items-center justify-between">
//                                 <div className={`flex items-center space-x-2 ${colors.text}`}>
//                                     <span className="text-sm font-medium">{config.label}</span>
//                                 </div>
//                                 <span className="text-2xl font-bold text-gray-900 dark:text-white">
//                                     {count}
//                                 </span>
//                             </div>
//                             <div className="relative pt-1">
//                                 <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
//                                     <div
//                                         style={{ width: `${percentage}%` }}
//                                         className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${colors.bar} transition-all duration-500`}
//                                     />
//                                 </div>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                     {percentage.toFixed(1)}% of total
//                                 </p>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }