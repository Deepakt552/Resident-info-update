// resources/js/Pages/Users/Show.jsx

import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeft, Edit, Trash2, Mail, Calendar, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Show({ user }) {
    const handleDelete = () => {
        Swal.fire({
            title: 'Delete User?',
            text: `Delete ${user.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f34853',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('users.destroy', user.id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: `${user.name} has been deleted.`,
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to delete user.',
                            icon: 'error',
                            confirmButtonColor: '#f34853'
                        });
                    }
                });
            }
        });
    };

    const getRoleIcon = (role) => {
        return role === 'admin' ? (
            <Shield size={20} className="text-[#22346e]" />
        ) : (
            <Shield size={20} className="text-[#f34853]" />
        );
    };

    return (
        <AuthenticatedLayout header="User Details">
            <Head title={`User: ${user.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('users.index')}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-[#22346e] dark:text-white">User Details</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">View user information</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('users.edit', user.id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22346e] text-white rounded-full hover:bg-[#22346e]/90 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                        >
                            <Edit size={16} />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#f34853] to-[#22346e] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                        user.role === 'admin'
                                            ? 'bg-[#22346e]/10 text-[#22346e] dark:bg-[#22346e]/30'
                                            : 'bg-[#f34853]/10 text-[#f34853] dark:bg-[#f34853]/30'
                                    }`}>
                                        {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <Mail size={20} className="text-[#f34853]" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email Address</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            {getRoleIcon(user.role)}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Role</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5 capitalize">{user.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <Calendar size={20} className="text-[#22346e]" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Member Since</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                                    {new Date(user.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}