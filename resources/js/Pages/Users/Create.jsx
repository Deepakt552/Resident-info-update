// resources/js/Pages/Users/Create.jsx

import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserForm from '@/Components/UserForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Create({ roles }) {
    return (
        <AuthenticatedLayout header="Create User">
            <Head title="Create User" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link
                        href={route('users.index')}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#22346e] dark:text-white">Create New User</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Add a new user to the system</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <UserForm roles={roles} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}