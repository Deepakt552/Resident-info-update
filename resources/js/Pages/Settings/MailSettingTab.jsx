// resources/js/Pages/Settings/MailSettingTab.jsx

import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { 
    EnvelopeIcon,
    CheckIcon,
    ArrowPathIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const MailSettingTab = ({ data, setData, users, processing, errors, handleSubmit }) => {
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    useEffect(() => {
        if (data.send_user_emails && data.send_user_emails.length > 0) {
            const selectedIds = users
                .filter(user => data.send_user_emails.includes(user.email))
                .map(user => user.id);
            setSelectedUserIds(selectedIds);
        }
    }, []);

    const handleToggle = () => {
        setData('send_mail', !data.send_mail);
    };

    const handleUserToggle = (userId, userEmail) => {
        let newSelectedIds;
        if (selectedUserIds.includes(userId)) {
            newSelectedIds = selectedUserIds.filter(id => id !== userId);
        } else {
            newSelectedIds = [...selectedUserIds, userId];
        }
        setSelectedUserIds(newSelectedIds);
        
        // Update the send_user_emails array with emails of selected users
        const selectedEmails = users
            .filter(user => newSelectedIds.includes(user.id))
            .map(user => user.email);
        setData('send_user_emails', selectedEmails);
    };

    const selectAllUsers = () => {
        const allIds = users.map(user => user.id);
        setSelectedUserIds(allIds);
        const allEmails = users.map(user => user.email);
        setData('send_user_emails', allEmails);
    };

    const deselectAllUsers = () => {
        setSelectedUserIds([]);
        setData('send_user_emails', []);
    };

    const isAllSelected = users.length > 0 && selectedUserIds.length === users.length;
    const isSomeSelected = selectedUserIds.length > 0 && selectedUserIds.length < users.length;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Enable Send Mail Toggle */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#f34853]/10 rounded-xl">
                            <EnvelopeIcon className="w-6 h-6 text-[#f34853]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Enable Send Mail
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Toggle to enable or disable all mail sending functionality system-wide
                            </p>
                            {data.send_mail && (
                                <div className="mt-2 flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                                    <CheckCircleIcon className="w-4 h-4" />
                                    <span>Mail sending is currently enabled</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${data.send_mail ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                            {data.send_mail ? 'ON' : 'OFF'}
                        </span>
                        <Switch
                            checked={data.send_mail}
                            onChange={handleToggle}
                            className={`
                                relative inline-flex h-7 w-14 items-center rounded-full 
                                transition-colors duration-300 focus:outline-none focus:ring-2 
                                focus:ring-[#f34853] focus:ring-offset-2
                                ${data.send_mail ? 'bg-[#f34853]' : 'bg-gray-300 dark:bg-gray-600'}
                            `}
                        >
                            <span
                                className={`
                                    inline-block h-5 w-5 transform rounded-full bg-white 
                                    transition-transform duration-300 shadow-md
                                    ${data.send_mail ? 'translate-x-8' : 'translate-x-1'}
                                `}
                            />
                        </Switch>
                    </div>
                </div>
                {errors.send_mail && (
                    <p className="mt-3 text-sm text-red-600 dark:text-red-400">{errors.send_mail}</p>
                )}
            </div>

            {/* Send User Emails - Checkbox List */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#22346e]/10 rounded-xl">
                            <UserIcon className="w-6 h-6 text-[#22346e]" />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                                Send User Emails
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Select users who will receive email notifications
                            </p>
                            {selectedUserIds.length > 0 && (
                                <p className="mt-1 text-sm text-[#22346e] dark:text-[#6b8cbe]">
                                    {selectedUserIds.length} user{selectedUserIds.length > 1 ? 's' : ''} selected
                                </p>
                            )}
                        </div>
                    </div>
                    {users.length > 0 && (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={selectAllUsers}
                                className="text-sm text-[#22346e] dark:text-[#6b8cbe] hover:text-[#1a284f] dark:hover:text-[#8aacd4] transition-colors font-medium"
                            >
                                Select All
                            </button>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <button
                                type="button"
                                onClick={deselectAllUsers}
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors font-medium"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* Users List with Scroll */}
                <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                    <div className="max-h-72 overflow-y-auto">
                        {users.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {users.map(user => (
                                    <label
                                        key={user.id}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                                    >
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={selectedUserIds.includes(user.id)}
                                                onChange={() => handleUserToggle(user.id, user.email)}
                                                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 
                                                         text-[#22346e] focus:ring-[#22346e] focus:ring-2 
                                                         transition-colors cursor-pointer
                                                         dark:bg-gray-800 dark:checked:bg-[#22346e]"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {user.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {user.email}
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {selectedUserIds.includes(user.id) && (
                                                <CheckIcon className="w-4 h-4 text-[#22346e] dark:text-[#6b8cbe]" />
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                <UserIcon className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                <p>No users available</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {errors.send_user_emails && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.send_user_emails}</p>
                )}
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {processing ? 'Saving changes...' : 'Ready to save'}
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="relative group px-8 py-3.5 bg-[#f34853] text-white text-sm font-semibold rounded-full 
                             hover:bg-[#d43d47] transition-all duration-300 transform hover:scale-105 
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 
                             shadow-md hover:shadow-xl flex items-center gap-2
                             focus:outline-none focus:ring-2 focus:ring-[#f34853] focus:ring-offset-2"
                >
                    {processing ? (
                        <>
                            <ArrowPathIcon className="w-5 h-5 animate-spin" />
                            <span>Saving Changes...</span>
                        </>
                    ) : (
                        <>
                            <CheckIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Save Settings</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default MailSettingTab;