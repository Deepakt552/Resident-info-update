import React from "react";
import { FileText, Loader2, Eye } from "lucide-react";

export default function RecentSignupsTable({ data = [], loading }) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-semibold text-[#1D294D] dark:text-white">
                    Recent Resident Signups
                </h3>

                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#F34853]" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900">
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F34853]/10 dark:bg-[#F34853]/20">
                    <FileText className="h-5 w-5 text-[#F34853]" />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#1D294D] dark:text-white">
                        Recent Resident Signups
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Latest resident registration activity
                    </p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14">
                    <div className="mb-4 rounded-full bg-gray-100 p-5 dark:bg-gray-800">
                        <FileText className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    </div>

                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        No Signups Found
                    </h4>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Resident signups will appear here once submitted.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                {/* <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    Signup UID
                                </th> */}

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    Property
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    Unit
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    Tenants
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    Created
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {data.map((signup) => (
                                <tr
                                    key={signup.id}
                                    className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                                >
                                    {/* <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[#1D294D] dark:text-white">
                                        {signup.signup_uid}
                                    </td> */}

                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {signup.property_name}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {signup.unit_no}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {signup.tenants
                                            ? Object.keys(signup.tenants).length
                                            : 0}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {signup.created_at}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-4">
                                        {signup.pdf_path ? (
                                            <a
                                                href={signup.pdf_path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <button className="inline-flex items-center gap-2 rounded-lg bg-[#F34853] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#d43a46] hover:shadow-md">
                                                    <Eye className="h-4 w-4" />
                                                    View PDF
                                                </button>
                                            </a>
                                        ) : (
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                No PDF
                                            </span>
                                        )}
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