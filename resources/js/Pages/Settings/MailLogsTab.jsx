// resources/js/Pages/Settings/MailLogsTab.jsx

import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    UserIcon,
    DocumentTextIcon,
    CalendarIcon,
    HomeIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import {
    Activity,
} from 'lucide-react';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const MailLogsTab = ({ mailLogs }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const formatDate = (date) => {
        if (!date) return '-';
        return format(new Date(date), 'MMM dd, yyyy HH:mm');
    };

    const getStatusBadge = (status, text) => {
        return status ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                Success <Activity className="w-3.5 h-3.5" /> {text}
            </span>
        ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800">
                <XCircleIcon className="w-3.5 h-3.5" />
                Failed <Activity className="w-3.5 h-3.5" /> {text}
            </span>
        );
    };

    const getStatusColor = (status) => {
        return status ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    };

    const filteredLogs = mailLogs.data?.filter(log => {
        const matchesSearch = log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.document?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.property?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'success' && log.status) ||
            (statusFilter === 'failed' && !log.status);

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#22346e] focus:border-transparent outline-none transition text-gray-900 dark:text-white"
                        />
                        <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${statusFilter === 'all'
                            ? 'bg-[#22346e] text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('success')}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-1.5 ${statusFilter === 'success'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        <CheckCircleIcon className="w-4 h-4" />
                        Success
                    </button>
                    <button
                        onClick={() => setStatusFilter('failed')}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-1.5 ${statusFilter === 'failed'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        <XCircleIcon className="w-4 h-4" />
                        Failed
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gradient-to-r from-[#22346e] to-[#1a284e] dark:from-[#1a284e] dark:to-[#121d3a]">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-medium text-white uppercase tracking-wider">
                                        <DocumentTextIcon className="w-4 h-4" />
                                        Document
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-medium text-white uppercase tracking-wider">
                                        <ArrowPathIcon className="w-4 h-4" />
                                        Action
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-medium text-white uppercase tracking-wider">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Status
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-medium text-white uppercase tracking-wider">
                                        <HomeIcon className="w-4 h-4" />
                                        Property
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-medium text-white uppercase tracking-wider">
                                        <CalendarIcon className="w-4 h-4" />
                                        Date
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {filteredLogs && filteredLogs.length > 0 ? (
                                filteredLogs.map((log, index) => (
                                    <tr
                                        key={log.id}
                                        className={`${index % 2 === 0
                                            ? 'bg-white dark:bg-gray-800'
                                            : 'bg-gray-50/50 dark:bg-gray-800/50'
                                            } hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-colors group`}
                                    >

                                        <td className="px-6 py-4">
                                            <a
                                                href={`/storage/pdfs/${log.document}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                   >
                                                <span className="text-sm text-blue-500 dark:text-gray-300">
                                                    {log.document || '-'}
                                                </span>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                                                {log.action || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(log.status, log.error_message)}
                                            {/* <span className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate block">
                                                {log.error_message || '-'}
                                            </span> */}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                {log.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                                                <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                                                {formatDate(log.sent_at)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <DocumentTextIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                            <p className="text-gray-500 dark:text-gray-400">No mail logs found</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                                {searchTerm ? 'Try adjusting your search filters' : 'Mail logs will appear here once emails are sent'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {mailLogs.links && mailLogs.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {mailLogs.from || 0} to {mailLogs.to || 0} of {mailLogs.total || 0} results
                            </div>
                            <div className="flex items-center gap-2">
                                {mailLogs.links.map((link, index) => {
                                    const isActive = link.active;
                                    const label = link.label.replace(/&laquo;|&raquo;/g, '').trim();

                                    if (link.label.includes('&laquo;')) {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.visit(link.url)}
                                                disabled={!link.url}
                                                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeftIcon className="w-5 h-5" />
                                            </button>
                                        );
                                    }

                                    if (link.label.includes('&raquo;')) {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.visit(link.url)}
                                                disabled={!link.url}
                                                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRightIcon className="w-5 h-5" />
                                            </button>
                                        );
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.visit(link.url)}
                                            className={`px-3.5 py-1.5 text-sm rounded-lg transition-all ${isActive
                                                ? 'bg-[#22346e] text-white shadow-md'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: label }}
                                            disabled={!link.url}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MailLogsTab;