// Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Plus, Search, RefreshCw, Eye, Edit, Trash2,
    ArrowUp, ArrowDown, Minus, Home, MapPin, Calendar
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function Index({ properties, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [nameFilter, setNameFilter] = useState(filters.name || '');
    const [addressFilter, setAddressFilter] = useState(filters.address || '');
    const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');

    const handleSearch = () => {
        router.get('/properties',
            {
                search: search,
                name: nameFilter,
                address: addressFilter,
                sort_field: sortField,
                sort_direction: sortDirection
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true
            }
        );
    };

    const handleReset = () => {
        setSearch('');
        setNameFilter('');
        setAddressFilter('');
        setSortField('created_at');
        setSortDirection('desc');
        router.get('/properties', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleSort = (field) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);

        router.get('/properties',
            {
                search: search,
                name: nameFilter,
                address: addressFilter,
                sort_field: field,
                sort_direction: newDirection
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true
            }
        );
    };

    const handleDelete = (id, propertyName) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You won't be able to revert this! Property "${propertyName}" will be deleted.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f34853',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/properties/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            'Deleted!',
                            'Property has been deleted successfully.',
                            'success'
                        );
                    },
                    onError: () => {
                        Swal.fire(
                            'Error!',
                            'Something went wrong. Property could not be deleted.',
                            'error'
                        );
                    }
                });
            }
        });
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return <Minus size={14} className="text-gray-400" />;
        return sortDirection === 'asc' ?
            <ArrowUp size={14} className="text-coral" /> :
            <ArrowDown size={14} className="text-coral" />;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Properties" />

            <div className="py-12">
                <div className="mx-auto max-w-8xl sm:px-6 lg:px-1">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-lg transition-all duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <Home className="w-6 h-6 text-coral" />
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Properties
                                </h2>
                                <span className="px-2 py-1 text-xs font-medium bg-coral/10 text-coral rounded-full">
                                    {properties.total} Total
                                </span>
                            </div>
                            <Link
                                href="/properties/create"
                                className="inline-flex items-center gap-2 bg-coral hover:bg-[#e03a44] text-white font-medium py-2 px-5 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                                <Plus size={18} />
                                Add Property
                            </Link>
                        </div>

                        <div className="p-6">
                            {/* Search and Filter Section */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search All
                                    </label>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Search by name or address..."
                                        className="w-full rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-5 py-2 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Filter by Name
                                    </label>
                                    <input
                                        type="text"
                                        value={nameFilter}
                                        onChange={(e) => setNameFilter(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Filter by name..."
                                        className="w-full rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-5 py-2 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Filter by Address
                                    </label>
                                    <input
                                        type="text"
                                        value={addressFilter}
                                        onChange={(e) => setAddressFilter(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Filter by address..."
                                        className="w-full rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-5 py-2 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mb-6">
                                <button
                                    onClick={handleSearch}
                                    className="inline-flex items-center gap-2 bg-coral hover:bg-[#e03a44] text-white font-medium py-2 px-5 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
                                >
                                    <Search size={18} />
                                    Search
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium py-2 px-5 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
                                >
                                    <RefreshCw size={18} />
                                    Reset
                                </button>
                            </div>

                            {/* Properties Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                onClick={() => handleSort('id')}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    ID {getSortIcon('id')}
                                                </div>
                                            </th>
                                            <th
                                                onClick={() => handleSort('name')}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Home size={14} /> Name {getSortIcon('name')}
                                                </div>
                                            </th>
                                            <th
                                                onClick={() => handleSort('address')}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} /> Address {getSortIcon('address')}
                                                </div>
                                            </th>
                                            <th
                                                onClick={() => handleSort('created_at')}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} /> Created {getSortIcon('created_at')}
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {properties.data.map((property) => (
                                            <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    {property.id}
                                                </td>
                                                <td className="px-6 py-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    {property.name}
                                                </td>
                                                <td className="px-6 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                    {property.address}
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(property.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={`/properties/${property.id}`}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full  text-blue-800 hover:bg-blue-200 hover:text-white transition-all"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>

                                                        <Link
                                                            href={`/properties/${property.id}/edit`}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full  text-yellow-800 hover:bg-yellow-200 hover:text-white transition-all"
                                                        >
                                                            <Edit size={16} />
                                                        </Link>

                                                        <button
                                                            onClick={() => handleDelete(property.id, property.name)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {properties.links && properties.links.length > 3 && (
                                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing {properties.from} to {properties.to} of {properties.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        {properties.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (link.url && !link.active) {
                                                        router.get(link.url, {}, {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                            replace: true
                                                        });
                                                    }
                                                }}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1 text-sm font-medium
                                                    ${link.active
                                                        ? 'bg-coral text-white shadow-sm'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}