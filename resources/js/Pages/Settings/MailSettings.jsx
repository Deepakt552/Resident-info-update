// resources/js/Pages/Settings/MailSettings.jsx

import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import { 
    EnvelopeIcon, 
    UsersIcon, 
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MailSettingTab from './MailSettingTab';
import MailLogsTab from './MailLogsTab';

const MailSettings = ({ setting, users, mailLogs, auth }) => {
    const [activeTab, setActiveTab] = useState('logs');

    const { data, setData, post, processing, errors, reset } = useForm({
        send_mail: setting.send_mail || false,
        send_user_emails: setting.send_user_emails || []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put('/settings/mail', data, {
            onSuccess: () => {
                toast.success('Settings updated successfully!');
            },
            onError: (errors) => {
                toast.error('Failed to update settings');
            }
        });
    };

    const tabs = [
        {
            id: 'logs',
            label: 'Mail Logs',
            icon: DocumentTextIcon,
            component: MailLogsTab
        },
        {
            id: 'setting',
            label: 'Mail Setting',
            icon: Cog6ToothIcon,
            component: MailSettingTab
        },
    ];

    const getTabStats = () => {
        const total = mailLogs.total || 0;
        const success = mailLogs.data?.filter(log => log.status).length || 0;
        const failed = total - success;
        return { total, success, failed };
    };

    const stats = getTabStats();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#f34853]/10 rounded-lg">
                            <EnvelopeIcon className="w-6 h-6 text-[#f34853]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Mail Settings
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Mail Settings" />
            
            <div className="py-6">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Mails</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                                </div>
                                <div className="p-3 bg-[#22346e]/10 rounded-lg">
                                    <EnvelopeIcon className="w-6 h-6 text-[#22346e]" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Successful</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.success}</p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failed}</p>
                                </div>
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                    <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{users?.length || 0}</p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    {/* <UsersIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" /> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Enhanced Tab Navigation */}
                        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-6 pt-4">
                            <div className="flex items-center gap-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                                flex items-center gap-2 px-5 py-2.5 text-sm font-medium 
                                                rounded-t-xl transition-all duration-300 relative
                                                ${isActive 
                                                    ? 'bg-white dark:bg-gray-800 text-[#22346e] dark:text-white shadow-sm' 
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }
                                            `}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#22346e] dark:text-white' : ''}`} />
                                            <span>{tab.label}</span>
                                            {isActive && (
                                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22346e] dark:bg-white" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {activeTab === 'setting' ? (
                                <MailSettingTab
                                    data={data}
                                    setData={setData}
                                    users={users}
                                    processing={processing}
                                    errors={errors}
                                    handleSubmit={handleSubmit}
                                />
                            ) : (
                                <MailLogsTab mailLogs={mailLogs} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default MailSettings;