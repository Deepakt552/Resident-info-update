// resources/js/Components/UserFormModal.jsx
import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function UserFormModal({ isOpen, onClose, user = null, roles = [] }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'user',
                password: '',
                password_confirmation: ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'user',
                password: '',
                password_confirmation: ''
            });
        }
        setErrors({});
    }, [user, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const method = user ? 'put' : 'post';
        const url = user ? route('users.update', user.id) : route('users.store');

        router[method](url, formData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    title: user ? 'Updated!' : 'Created!',
                    text: user ? 'User has been updated.' : 'New user has been created.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                onClose();
                setProcessing(false);
            },
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
                Swal.fire({
                    title: 'Error!',
                    text: user ? 'Failed to update user.' : 'Failed to create user.',
                    icon: 'error',
                    confirmButtonColor: '#f34853'
                });
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
            
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-auto">
                    <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
                        <h2 className="text-xl font-bold text-[#22346e] dark:text-white">
                            {user ? 'Edit User' : 'Create New User'}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#f34853] focus:outline-none dark:bg-gray-800 dark:border-gray-700"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#f34853] focus:outline-none dark:bg-gray-800 dark:border-gray-700"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Role *
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#f34853] focus:outline-none dark:bg-gray-800 dark:border-gray-700"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {user ? 'New Password (optional)' : 'Password *'}
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#f34853] focus:outline-none dark:bg-gray-800 dark:border-gray-700"
                                required={!user}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirm Password {!user && '*'}
                            </label>
                            <input
                                type="password"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#f34853] focus:outline-none dark:bg-gray-800 dark:border-gray-700"
                                required={!user}
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-[#f34853] text-white rounded-lg hover:bg-[#f34853]/90 disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Saving...' : (user ? 'Update User' : 'Create User')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}