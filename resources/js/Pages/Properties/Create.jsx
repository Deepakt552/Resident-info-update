import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const [formData, setFormData] = useState({
        name: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        router.post('/properties', formData, {
            onSuccess: () => {
                setSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setSubmitting(false);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Property" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
                <div className="mx-auto max-w-8xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-2xl transition-all duration-300">
                        {/* Header with gradient accent */}
                        <div className="relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f34853] to-[#22346e]"></div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f34853] to-[#22346e] bg-clip-text text-transparent">
                                    Create New Property
                                </h2>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Fill in the details to add a new property
                                </div>
                            </div>
                        </div>

                        <div className="p-6 lg:p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Property Name Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        Property Name <span className="text-[#f34853]">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 
                                                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                                     focus:border-[#f34853] dark:focus:border-[#f34853] 
                                                     focus:ring-2 focus:ring-[#f34853]/20 dark:focus:ring-[#f34853]/30
                                                     transition-all duration-200 outline-none"
                                            placeholder="Enter property name"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-[#f34853] flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Address Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        Address <span className="text-[#f34853]">*</span>
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            rows="4"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 
                                                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                                     focus:border-[#f34853] dark:focus:border-[#f34853] 
                                                     focus:ring-2 focus:ring-[#f34853]/20 dark:focus:ring-[#f34853]/30
                                                     transition-all duration-200 outline-none resize-none"
                                            placeholder="Enter property address"
                                        />
                                        <div className="absolute top-3 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-[#f34853] flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                    <Link
                                        href="/properties"
                                        className="group relative overflow-hidden px-6 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 
                                                 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                                                 transition-all duration-200 text-center"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="relative overflow-hidden px-6 py-2.5 rounded-xl font-semibold text-white
                                                 bg-gradient-to-r from-[#f34853] to-[#22346e] 
                                                 hover:shadow-lg hover:shadow-[#f34853]/20 dark:hover:shadow-[#22346e]/20
                                                 transform hover:scale-[1.02] active:scale-[0.98]
                                                 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                                 disabled:hover:scale-100"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {submitting ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                                    </svg>
                                                    Create Property
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}