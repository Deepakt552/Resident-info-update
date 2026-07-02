// resources/js/Pages/Users/Index.jsx
import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserFormModal from '@/Components/UserFormModal';
import Swal from 'sweetalert2';

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
export default function Index({ users, filters, roles }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleDelete = (user) => {
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

    const handleSearch = () => {
        router.get(route('users.index'), { search }, { preserveState: true });
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setIsCreateModalOpen(true);
    };

    return (
        <AuthenticatedLayout header="Users">
            <Head title="Users" />

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border">
                <div className="p-6 border-b flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1 className="text-1xl font-bold text-[#22346e]">Users</h1>
                        <p className="text-gray-500 text-sm">Manage system users</p>
                    </div>
                    <div className="flex justify-between gap-3">

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
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full h-10 pl-12 pr-5 rounded-full border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-coral focus:ring-offset-2 focus:border-transparent dark:text-white transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />

                        </div>
                        <button
                            onClick={handleCreate}
                            className="px-5 py-2.5 bg-[#f34853] text-white rounded-full hover:bg-[#f34853]/90 shadow-md hover:shadow-lg transition-all text-sm font-medium"
                        >
                            + Add User
                        </button>
                    </div>
                </div>


                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr className="text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-800">
                            {users.data.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-2 dark:text-gray-300">{user.id}</td>
                                    <td className="px-6 py-2 font-medium dark:text-white">{user.name}</td>
                                    <td className="px-6 py-2 text-gray-600 dark:text-gray-400">{user.email}</td>
                                    <td className="px-6 py-2">
                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                                            ? 'bg-[#22346e]/10 text-[#22346e] dark:bg-[#22346e]/30'
                                            : 'bg-[#f34853]/10 text-[#f34853] dark:bg-[#f34853]/30'
                                            }`}>
                                            {user.role === 'admin' ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 text-gray-500 dark:text-gray-500 text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-2 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="inline-flex px-4 py-1.5 text-sm text-green-600 rounded-full hover:bg-green-500/20 transition-colors"
                                        >
                                             <Eye className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(user)} className="inline-flex px-4 py-1.5 text-sm text-red-600 rounded-full hover:bg-red-500/20 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.data.length > 9 && (
                    <div className="p-6 border-t dark:border-gray-800 flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {users.from}-{users.to} of {users.total}
                        </span>
                        <div className="space-x-2">
                            <button
                                onClick={() => router.get(users.prev_page_url, { search }, { preserveState: true })}
                                disabled={!users.prev_page_url}
                                className="px-4 py-2 border rounded-full disabled:opacity-50 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 transition-colors text-sm"
                            >
                                ← Prev
                            </button>
                            <button
                                onClick={() => router.get(users.next_page_url, { search }, { preserveState: true })}
                                disabled={!users.next_page_url}
                                className="px-4 py-2 border rounded-full disabled:opacity-50 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 transition-colors text-sm"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <UserFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                roles={roles}
            />

            <UserFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                roles={roles}
            />
        </AuthenticatedLayout>
    );
}