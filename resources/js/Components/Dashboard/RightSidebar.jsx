import React from "react";
import {
    Settings,
    Mail,
    Users,
    Activity,
    CheckCircle,
    XCircle,
} from "lucide-react";

const iconMap = {
    users: Users,
    mail: Mail,
    settings: Settings,
};

const colorMap = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    purple:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function RightSidebar({ settings }) {
    return (
        <div className="space-y-6">
            {/* ===================== System Settings ===================== */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900">
                {/* Header */}
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F34853]/10 dark:bg-[#F34853]/20">
                        <Settings className="h-5 w-5 text-[#F34853]" />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-[#1D294D] dark:text-white">
                            System Settings
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Current application configuration
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Mail Status */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-gray-700">
                                <Mail className="h-4 w-4 text-[#F34853]" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-[#1D294D] dark:text-white">
                                    Mail Service
                                </p>

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Email notification status
                                </p>
                            </div>
                        </div>

                        {settings.mailEnabled ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Enabled
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                <XCircle className="h-3.5 w-3.5" />
                                Disabled
                            </span>
                        )}
                    </div>

                    {/* CC Emails */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-gray-700">
                                <Users className="h-4 w-4 text-[#F34853]" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-[#1D294D] dark:text-white">
                                    CC Email Addresses
                                </p>

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Additional email recipients
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {settings.ccEmails?.length ? (
                                settings.ccEmails.map((email, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full bg-[#1D294D] px-3 py-1 text-xs font-medium text-white dark:bg-[#F34853]"
                                    >
                                        {email}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    No CC emails configured.
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================== Recent Activity ===================== */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900">
                {/* Header */}
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F34853]/10 dark:bg-[#F34853]/20">
                        <Activity className="h-5 w-5 text-[#F34853]" />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-[#1D294D] dark:text-white">
                            Recent Activity
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Latest system events
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {settings.recentActivities?.length ? (
                        settings.recentActivities.map((activity, index) => {
                            const Icon = iconMap[activity.icon] || Activity;

                            return (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    <div
                                        className={`rounded-xl p-2 ${
                                            colorMap[activity.color] ||
                                            "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-[#1D294D] dark:text-white">
                                            {activity.title}
                                        </h4>

                                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                            {activity.description}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Activity className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />

                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                No recent activity found
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}