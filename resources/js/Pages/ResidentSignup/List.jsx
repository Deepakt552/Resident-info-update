// resources/js/Pages/ResidentSignup/List.jsx

import React, { useState, useCallback, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Home,
    Building2,
    Users,
    Search,
    Eye,
    Hash,
    MapPin,
    Calendar,
    ClipboardList,
    FileText,
    User,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Plus,
    FileDown,
    FileSearch,
    Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import ResidentSignupEmailModal from '@/Components/ResidentSignupEmailModal';

const List = ({ residentSignups, filters }) => {
    const [search, setSearch] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [signups, setSignups] = useState(residentSignups);

    // Update signups when prop changes
    useEffect(() => {
        setSignups(residentSignups);
    }, [residentSignups]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((value) => {
            router.get(
                '/resident-signup/list',
                { search: value },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onSuccess: (page) => {
                        setSignups(page.props.residentSignups);
                    }
                }
            );
            setIsSearching(false);
        }, 300),
        []
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        setIsSearching(true);
        debouncedSearch(value);
    };

    // Format date
    const formatDate = (date) => {
        const d = new Date(date);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    // Handle pagination
    const handlePageChange = (url) => {
        if (url) {
            router.get(url, { search: search }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onSuccess: (page) => {
                    setSignups(page.props.residentSignups);
                }
            });
        }
    };

    // Handle delete without page reload
    const handleDelete = (id, signupUid) => {
        Swal.fire({
            title: 'Are you sure?',
            html: `
                <div class="text-left">
                    <p class="text-gray-600 dark:text-gray-400 mb-2">You are about to delete resident signup:</p>
                    <p class="font-bold text-navy dark:text-white text-lg">${signupUid}</p>
                    <p class="text-red-500 text-sm mt-3">This action cannot be undone!</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl shadow-2xl',
                title: 'text-2xl font-bold text-navy dark:text-white',
                confirmButton: 'px-6 py-2.5 rounded-full font-medium',
                cancelButton: 'px-6 py-2.5 rounded-full font-medium',
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return new Promise((resolve, reject) => {
                    setDeletingId(id);

                    // Optimistic update: Remove item from list immediately
                    setSignups(prev => ({
                        ...prev,
                        data: prev.data.filter(item => item.id !== id),
                        total: prev.total - 1,
                        from: prev.from,
                        to: prev.to - 1
                    }));

                    router.delete(`/resident-signup-delete/${id}`, {
                        preserveScroll: true,
                        preserveState: true,
                        onSuccess: () => {
                            toast.success('Resident signup deleted successfully!');

                            // Refresh the list to get updated pagination
                            router.get(
                                '/resident-signup/list',
                                { search: search },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                    onSuccess: (page) => {
                                        setSignups(page.props.residentSignups);
                                    }
                                }
                            );
                            resolve();
                        },
                        onError: (errors) => {
                            // Revert optimistic update on error
                            setSignups(residentSignups);
                            toast.error('Failed to delete resident signup.');
                            reject(new Error('Delete failed'));
                        },
                        onFinish: () => {
                            setDeletingId(null);
                        }
                    });
                });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).catch((error) => {
            console.error('Delete error:', error);
            // Revert on error
            setSignups(residentSignups);
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-navy dark:text-gray-200">
                    Resident Signup Directory
                </h2>
            }
        >
            <Head title="Resident Signup List" />

            <div className="min-h-screen bg-gray-100/80 dark:bg-gray-900/80 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Sticky Header with Glassmorphism */}
                    <div className="sticky top-0 z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 rounded-t-3xl  px-4 sm:px-6 lg:px-8 py-6 ">
                        <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            {/* Left: Icon + Titles */}
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gradient-to-br from-coral/20 to-coral/10 rounded-2xl shadow-inner">
                                    <ClipboardList className="w-6 h-5 text-coral" />
                                </div>
                                <div>
                                    <h2 className="text-1xl font-bold text-navy dark:text-white tracking-tight">
                                        Resident Signup Directory
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        Manage and review all resident registration records efficiently.
                                    </p>
                                </div>
                            </div>

                            {/* Right: Search + Add Button */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                                {/* Search Pill */}
                                <div className="relative w-full sm:w-72">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 dark:text-gray-500">
                                        {isSearching ? (
                                            <Loader2 className="h-5 w-5 animate-spin text-coral" />
                                        ) : (
                                            <Search className="h-5 w-5" />
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={handleSearch}
                                        placeholder="Search by , Unit, or Property..."
                                        className="w-full h-10 pl-12 pr-5 rounded-full border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-coral focus:ring-offset-2 focus:border-transparent dark:text-white transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                </div>

                                {/* Add Button */}
                                <Link
                                    href="/resident-signup"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-coral to-[#ff6b74] text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 font-medium whitespace-nowrap"
                                >
                                    <Plus className="w-5 h-4" />
                                    Add Resident Signup
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Table Card with Glassmorphism */}
                    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-b-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden ">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-navy/5 dark:bg-navy/10 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-navy dark:text-gray-300 uppercase tracking-wider">
                                            Sr No
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-navy dark:text-gray-300 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <Building2 className="w-3 h-3" />
                                                Property
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-navy dark:text-gray-300 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <Hash className="w-3 h-3" />
                                                Unit No
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-navy dark:text-gray-300 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                Tenants
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-navy dark:text-gray-300 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Created
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-navy dark:text-gray-300 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {signups.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="text-center py-20 px-4">
                                                    <div className="inline-flex p-4 bg-coral/10 rounded-full mb-6">
                                                        <FileText className="w-16 h-16 text-coral/70" />
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 text-2xl font-bold">
                                                        No Resident Signups Found
                                                    </p>
                                                    <p className="text-gray-500 dark:text-gray-400 text-base mt-2 max-w-md mx-auto">
                                                        There are currently no resident signup records available.
                                                        Try adjusting your search criteria or create a new signup.
                                                    </p>
                                                    <div className="mt-8">
                                                        <Link
                                                            href="/resident-signup"
                                                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-coral to-[#ff6b74] text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 font-medium"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                            Add Resident Signup
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        signups.data.map((signup, index) => (
                                            <tr
                                                key={signup.id}
                                                className={`border-b border-gray-100/50 dark:border-gray-700/50 hover:bg-coral/5 dark:hover:bg-coral/10 transition-all duration-300 odd:bg-white/40 dark:odd:bg-gray-800/20 ${deletingId === signup.id ? 'opacity-50 pointer-events-none' : ''
                                                    }`}
                                            >
                                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white font-medium">
                                                    {signups.from + index}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                                    {signup.property?.name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                                    {signup.unitno}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-coral/10 text-coral dark:bg-coral/20">
                                                        <Users className="w-3.5 h-3.5" />
                                                        {Array.isArray(signup.tenants) ? signup.tenants.length : 0} Tenants
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(signup.created_at)}
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {/* View Button */}
                                                        <Link
                                                            href={`/resident-signup/${signup.id}`}
                                                            className="inline-flex items-center gap-2 px-4 py-2  text-navy dark:bg-navy/20 dark:text-gray-300 rounded-full hover:bg-navy hover:text-white hover:shadow-lg hover:scale-[1.03] transition-all duration-300 text-sm font-medium"
                                                        >
                                                            <Eye className="w-5 h-5" />

                                                        </Link>

                                                        {/* PDF Button */}
                                                        <a
                                                            href={`/${signup.pdf_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-2  text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:scale-[1.03] transition-all duration-300 text-xs font-medium"
                                                        >
                                                            <FileDown className="w-5 h-5" />

                                                        </a>
                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() => handleDelete(signup.id, signup.signup_uid)}
                                                            disabled={deletingId === signup.id}
                                                            className="inline-flex items-center gap-1.5 px-3 py-2  text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full hover:bg-red-600 hover:text-white hover:shadow-lg hover:scale-[1.03] transition-all duration-300 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {deletingId === signup.id ? (
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-5 h-5" />
                                                            )}

                                                        </button>
                                                        
                                                        <ResidentSignupEmailModal
                                                            id={signup.id}
                                                            buttonText=""
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {signups.data.length > 9 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/40 dark:bg-gray-800/20 backdrop-blur-sm">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing <span className="font-bold text-navy dark:text-white">{signups.from}</span> to{' '}
                                    <span className="font-bold text-navy dark:text-white">{signups.to}</span> of{' '}
                                    <span className="font-bold text-navy dark:text-white">{signups.total}</span> results
                                </div>
                                <nav className="flex items-center gap-2" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(signups.prev_page_url)}
                                        disabled={!signups.prev_page_url}
                                        className="p-2.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-500 dark:text-gray-400 hover:bg-coral/10 dark:hover:bg-coral/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {signups.links && signups.links.map((link, index) => {
                                        if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                            return null;
                                        }
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(link.url)}
                                                disabled={!link.url}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${link.active
                                                        ? 'bg-coral text-white shadow-lg hover:bg-coral/90'
                                                        : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-navy dark:text-gray-300 hover:bg-coral/10 dark:hover:bg-coral/20 border border-gray-300 dark:border-gray-600'
                                                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                                            >
                                                {link.label}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => handlePageChange(signups.next_page_url)}
                                        disabled={!signups.next_page_url}
                                        className="p-2.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-500 dark:text-gray-400 hover:bg-coral/10 dark:hover:bg-coral/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default List;