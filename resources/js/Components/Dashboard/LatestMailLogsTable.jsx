import React from "react";
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function LatestMailLogsTable({ data = [], loading }) {
    if (loading) {
        return (
            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-lg transition-colors duration-300">
                <h3 className="mb-4 text-lg font-semibold text-[#1D294D] dark:text-white">
                    Latest Mail Logs
                </h3>

                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#F34853]" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F34853]/10 dark:bg-[#F34853]/20">
                    <Mail className="h-5 w-5 text-[#F34853]" />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#1D294D] dark:text-white">
                        Latest Mail Logs
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Recent email activity
                    </p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14">
                    <div className="mb-4 rounded-full bg-gray-100 p-5 dark:bg-gray-800">
                        <Mail className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    </div>

                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        No Mail Logs Found
                    </h4>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Mail activity will appear here once emails are sent.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr className="text-left">
                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    Document
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    Action
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    User
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    Property
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    Sent Date
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {data.map((log) => (
                                <tr
                                    key={log.id}
                                    className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                                >
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[#1D294D] dark:text-white">
                                        {log.document}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {log.action}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {log.user_name}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {log.property_name}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-4">
                                        {log.status === 1 ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                Success
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-400">
                                                <XCircle className="h-3.5 w-3.5" />
                                                Failed
                                            </span>
                                        )}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {log.sent_at || "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}