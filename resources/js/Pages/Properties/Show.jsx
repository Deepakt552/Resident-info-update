// Show.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Home, MapPin, Calendar, Clock, Building2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Show({ property }) {
    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${property.name}". This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Show loading state
                Swal.fire({
                    title: 'Deleting...',
                    text: 'Please wait',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                router.delete(`/properties/${property.id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            'Deleted!',
                            'The property has been deleted successfully.',
                            'success'
                        ).then(() => {
                            // Redirect to properties index after success
                            router.visit('/properties');
                        });
                    },
                    onError: (errors) => {
                        Swal.fire(
                            'Error!',
                            'There was an error deleting the property. Please try again.',
                            'error'
                        );
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Property: ${property.name}`} />
            <div className="py-12">
                <div className="mx-auto max-w-8xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-lg transition-all duration-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <Building2 className="w-6 h-6 text-[#f34853]" />
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Property Details
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href="/properties"
                                    className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    <ArrowLeft size={18} />
                                    Back
                                </Link>
                                <Link
                                    href={`/properties/${property.id}/edit`}
                                    className="inline-flex items-center gap-2 bg-[#22346e] hover:bg-[#1a2855] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    <Edit size={18} />
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-6">
                                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                        <Home size={20} className="text-[#f34853]" />
                                        Basic Information
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <Home size={12} /> Property Name
                                        </label>
                                        <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                            {property.name}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <Calendar size={12} /> Created At
                                        </label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {new Date(property.created_at).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <MapPin size={12} /> Address
                                        </label>
                                        <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">
                                            {property.address}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}