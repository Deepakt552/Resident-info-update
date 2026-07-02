// resources/js/Pages/ResidentSignup/AlreadySubmitted.jsx
import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { CheckCircle, Home, Building2, MapPin, Hash, Clock, AlertCircle } from 'lucide-react';
import { getRemainingTime, getStoredSignup } from '@/utils/storage';

const AlreadySubmitted = () => {
    const [submissionData, setSubmissionData] = useState(null);
    const [remainingTime, setRemainingTime] = useState('');

    useEffect(() => {
        // Get stored data
        const data = getStoredSignup();
        if (data) {
            setSubmissionData(data);
            updateRemainingTime(data.submitted_at);
        }

        // Update remaining time every minute
        const interval = setInterval(() => {
            if (submissionData?.submitted_at) {
                updateRemainingTime(submissionData.submitted_at);
            }
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const updateRemainingTime = (timestamp) => {
        const time = getRemainingTime(timestamp);
        setRemainingTime(time);
    };
    const handleClearSubmission = () => {
        localStorage.removeItem('resident_signup_submission');

        setSubmissionData(null);
        setRemainingTime('');

        // optional UI feedback
        alert('Previous submission cleared successfully.');
    };
    if (!submissionData) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Submission Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please complete the resident signup form.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Already Submitted" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    {/* Main Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        {/* Header with Icon */}
                        <div className="bg-green-50 dark:bg-green-900/20 px-6 py-8 text-center border-b border-green-200 dark:border-green-800">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 mb-4">
                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                You have already completed Resident Signup
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your submission is confirmed and stored securely.
                            </p>
                        </div>

                        {/* Submission Details */}
                        <div className="px-6 py-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Property Name */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                        <Building2 className="w-4 h-4" />
                                        <span className="text-sm font-medium">Property</span>
                                    </div>
                                    <p className="text-gray-900 dark:text-white font-semibold">
                                        {submissionData.property_name || 'N/A'}
                                    </p>
                                </div>

                                {/* Unit Number */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                        <Hash className="w-4 h-4" />
                                        <span className="text-sm font-medium">Unit Number</span>
                                    </div>
                                    <p className="text-gray-900 dark:text-white font-semibold">
                                        {submissionData.unitno || 'N/A'}
                                    </p>
                                </div>

                                {/* Address - Full Width */}
                                <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm font-medium">Address</span>
                                    </div>
                                    <p className="text-gray-900 dark:text-white font-semibold">
                                        {submissionData.property_address || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Submission Info */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                                            Submission Status
                                        </p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">
                                            {remainingTime === 'Expired' ? 'Expired' : `Expires in ${remainingTime}`}
                                        </p>
                                        <p className="text-xs text-blue-500 dark:text-blue-500 mt-1">
                                            Submission ID: {submissionData.submission_id || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Message */}
                            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                                <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <p>
                                    You can only submit one resident signup per 24-hour period.
                                    The submission will automatically expire after 24 hours.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Submitted on {new Date(submissionData.submitted_at).toLocaleString()}
                            </p>
                        </div>
                        {/* <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 text-center space-y-3">

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Submitted on {new Date(submissionData.submitted_at).toLocaleString()}
                            </p>

                            <button
                                onClick={handleClearSubmission}
                                className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all duration-200"
                            >
                                Clear Previous Data
                            </button>

                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlreadySubmitted;