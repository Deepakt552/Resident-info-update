import React from "react";
import { Loader2 } from "lucide-react";

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
    loading,
}) {
    return (
        <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
            {/* Hover Gradient */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
            />

            {/* Decorative Circle */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/20 dark:bg-white/5" />

            <div className="relative flex items-center justify-between">
                {/* Left Content */}
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </p>

                    {loading ? (
                        <div className="mt-3 flex items-center">
                            <Loader2 className="h-6 w-6 animate-spin text-[#F34853]" />
                        </div>
                    ) : (
                        <h2 className="mt-2 text-3xl font-bold text-[#1D294D] dark:text-white">
                            {value}
                        </h2>
                    )}
                </div>

                {/* Icon */}
                <div
                    className={`rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:scale-110`}
                >
                    <Icon className="h-7 w-7" />
                </div>
            </div>

            {/* Bottom Accent Line */}
            {/* <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                    className={`h-full w-2/3 rounded-full bg-gradient-to-r ${color}`}
                />
            </div> */}
        </div>
    );
}