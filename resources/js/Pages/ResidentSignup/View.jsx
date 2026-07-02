// resources/js/Pages/ResidentSignup/View.jsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    Building2,
    Users,
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Hash,
    Home,
    UserCircle,
    FileText,
    CheckSquare
} from 'lucide-react';

const View = ({ residentSignup }) => {
    // Format date
    const formatDate = (date) => {
        const d = new Date(date);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    // Format date with time
    const formatDateTime = (date) => {
        const d = new Date(date);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} at ${hours}:${minutes}`;
    };

    // Get tenant count
    const tenantCount = Array.isArray(residentSignup.tenants) ? residentSignup.tenants.length : 0;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-navy dark:text-gray-200">
                    Resident Signup Details
                </h2>
            }
        >
            <Head title="Resident Signup Details" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-8xl mx-auto">
                    {/* Sticky Header */}
                    <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm rounded-t-2xl -mx-4 px-4 sm:px-6 lg:px-8 py-4 mb-6">
                        <div className="max-w-8xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/resident-signup/list"
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </Link>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-coral/10 rounded-full">
                                        <FileText className="w-5 h-5 text-coral" />
                                    </div>
                                    <h1 className="text-xl font-bold text-navy dark:text-white">
                                        Resident Signup Details
                                    </h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/resident-signup/list" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-coral/10 text-coral dark:bg-coral/20">
                                     <Users className="w-3.5 h-3.5" /> Go To List
                                </Link>
                                <span className="bg-coral/10 text-coral rounded-full px-4 py-1.5 text-xs font-medium">
                                    #{residentSignup.signup_uid}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                        {/* Property Information */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5 mb-8">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <Building2 className="w-5 h-5 text-coral" />
                                <h2 className="text-lg font-semibold text-navy dark:text-gray-200">
                                    Property Information
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Property Name
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                        {residentSignup.property?.name || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Address
                                    </label>
                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {residentSignup.property?.address || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Unit No
                                    </label>
                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                        {residentSignup.unitno}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Created At
                                    </label>
                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {formatDateTime(residentSignup.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Total Tenants
                                    </label>
                                    <p className="text-gray-900 dark:text-white">
                                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-coral/10 text-coral dark:bg-coral/20">
                                            <Users className="w-3 h-3" />
                                            {tenantCount}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tenant Information */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <Users className="w-5 h-5 text-coral" />
                                <h2 className="text-lg font-semibold text-navy dark:text-gray-200">
                                    Tenant Information
                                </h2>
                            </div>

                            {tenantCount === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No tenants found.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {residentSignup.tenants.map((tenant, index) => (
                                        <div
                                            key={index}
                                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 p-6 space-y-5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-5 h-5 text-coral" />
                                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                                        Tenant Information #{String(index + 1).padStart(2, '0')}
                                                    </h3>
                                                </div>
                                                <span className="bg-coral/10 text-coral rounded-full px-4 py-1 text-xs font-medium">
                                                    Tenant {index + 1}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                        Full Name
                                                    </label>
                                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                                        <UserCircle className="w-4 h-4 text-gray-400" />
                                                        {tenant.full_name || 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                        Email
                                                    </label>
                                                    <p className="text-gray-900 dark:text-white break-all flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-gray-400" />
                                                        {tenant.email || 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                        Phone
                                                    </label>
                                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        {tenant.phone || 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                        Date
                                                    </label>
                                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {tenant.date ? formatDate(tenant.date) : 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                        Emergency Contact Name
                                                    </label>
                                                    <p className="text-gray-900 dark:text-white">
                                                        {tenant.emergency_contact_name || 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                        Emergency Contact Phone
                                                    </label>
                                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        {tenant.emergency_contact_phone || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Signature */}
                                            {tenant.signature && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                                        <CheckSquare className="w-4 h-4 text-coral" />
                                                        Signature
                                                    </label>
                                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 max-w-md">
                                                        <img
                                                            src={`/${tenant.signature}`}
                                                            alt={`Signature for ${tenant.full_name}`}
                                                            className="w-full h-auto max-h-48 object-contain"
                                                            onError={(e) => {
                                                                e.target.src = ''; // Clear broken image
                                                                e.target.alt = 'Signature not available';
                                                                e.target.className = 'w-full h-32 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default View;