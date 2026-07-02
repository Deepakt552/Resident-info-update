// resources/js/Components/SearchBar.jsx

import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ placeholder = "Search..." }) {
    const { filters } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters?.search) {
                router.get(
                    window.location.pathname,
                    { ...filters, search: search || undefined },
                    { preserveState: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, filters]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#f34853] focus:border-transparent transition-all"
            />
            {search && (
                <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
}