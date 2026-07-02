import React from 'react';
import * as Icons from '@heroicons/react/24/outline';

export default function StatCard({ title, value, gradient, icon, subtitle }) {
    const IconComponent = Icons[icon];

    return (
        <div className={`cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>

            {/* ONLY opacity change (no color change) */}
            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/0 transition-all duration-300" />

            <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                        {IconComponent && (
                            <IconComponent className="w-6 h-6 text-white" />
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium text-white/80 uppercase tracking-wider">
                        {title}
                    </p>

                    <p className="text-3xl font-bold text-white mt-2">
                        {value}
                    </p>

                    {subtitle && (
                        <p className="text-xs text-white/70 mt-2">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* same gradient line, no color change */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
    );
}
// import React from 'react';
// import * as Icons from '@heroicons/react/24/outline';

// export default function StatCard({ title, value, gradient, icon, subtitle }) {
//     const IconComponent = Icons[icon];

//     return (
//         <div className="cursor-pointer group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            
//             {/* Hover Overlay */}
//             <div
//                 className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
//             />

//             <div className="relative p-6">
//                 <div className="flex items-center justify-between mb-4">
//                     <div
//                         className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-700 group-hover:bg-gradient-to-br ${gradient} transition-all duration-300`}
//                     >
//                         {IconComponent && (
//                             <IconComponent className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
//                         )}
//                     </div>
//                 </div>

//                 <div>
//                     <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                         {title}
//                     </p>

//                     <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
//                         {value}
//                     </p>

//                     {subtitle && (
//                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                             {subtitle}
//                         </p>
//                     )}
//                 </div>
//             </div>

//             {/* Bottom Gradient Line */}
//             <div
//                 className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
//             />
//         </div>
//     );
// }