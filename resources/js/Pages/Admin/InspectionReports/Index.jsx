// resources/js/Pages/Admin/InspectionReports/Index.jsx
import { useState } from 'react';
import { Head,router, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';
import {
    Eye, FileText, Search, ChevronLeft, ChevronRight, Plus,
    Filter, Download, AlertCircle, CheckCircle, XCircle,
    Clock, FileSignature, Building2, User, MapPin, FileCheck,
    Loader2, LayoutGrid
} from 'lucide-react';

// Helper function for notifications
const showToast = (title, icon = 'success') => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
    Toast.fire({ title, icon });
};

export default function Index({ reports, filters }) {

    const { props: pageProps } = usePage();
    const user = pageProps.auth?.user;
    // console.log(user);
    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [showFilters, setShowFilters] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
            approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
            rejected: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800',
            completed: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800',
            draft: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
        };

        const icons = {
            pending: <Clock className="h-3 w-3 mr-1" />,
            approved: <CheckCircle className="h-3 w-3 mr-1" />,
            rejected: <XCircle className="h-3 w-3 mr-1" />,
            completed: <FileCheck className="h-3 w-3 mr-1" />,
            draft: <FileSignature className="h-3 w-3 mr-1" />,
        };

        const labels = {
            pending: 'Pending Review',
            approved: 'Approved',
            rejected: 'Rejected',
            completed: 'Completed',
            draft: 'Draft',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                {icons[status]}
                {labels[status]}
            </span>
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('inspection-reports.index'),
            { search, status: status === 'all' ? '' : status, per_page: perPage },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        router.get(route('inspection-reports.index'),
            { search, status: newStatus === 'all' ? '' : newStatus, per_page: perPage },
            { preserveState: true, replace: true }
        );
    };

    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        router.get(route('inspection-reports.index'),
            { search, status: status === 'all' ? '' : status, per_page: newPerPage },
            { preserveState: true, replace: true }
        );
    };

    const handleEdit = (report) => {
        // Add loading indicator if needed, but proceed with navigation
        window.location.href = `user/checklist-activity/resume/${report.id}`;
    };
    const handleProcess = (report) => {
        // Add loading indicator if needed, but proceed with navigation
        window.location.href = `user/checklist-activity/edit/${report.id}`;
    };

    const handleAddNew = () => {
        window.location.href = `user/checklist-activity`;
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await router.get(route('inspection-reports.export', {
                search,
                status: status === 'all' ? '' : status
            }));
            showToast('Export started successfully!', 'success');
        } catch (error) {
            showToast('Export failed. Please try again.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    // Status counts for filter pills
    const statusCounts = {
        all: reports.total || 0,
        pending: reports.data?.filter(r => r.status === 'pending').length || 0,
        approved: reports.data?.filter(r => r.status === 'approved').length || 0,
        rejected: reports.data?.filter(r => r.status === 'rejected').length || 0,
        completed: reports.data?.filter(r => r.status === 'completed').length || 0,
    };

    return (
        <AuthenticatedLayout header="Inspection Reports">.
         <Head title="Inspection Report" />

            <div className="py-8 bg-white dark:bg-gray-900">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Modern Header Section with Gradient Accent */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-[#f34853]/10 to-[#22346e]/10 rounded-xl">
                                        <FileText className="h-6 w-6 text-[#f34853]" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f34853] to-[#22346e] bg-clip-text text-transparent">
                                            Inspection Reports
                                        </h1>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Manage and review all tenant inspection submissions
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {/* <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:shadow-md disabled:opacity-50"
                                >
                                    {isExporting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4" />
                                    )}
                                    Export
                                </button> */}
                                <button
                                    onClick={handleAddNew}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f34853] to-[#f35b64] hover:from-[#e03a45] hover:to-[#e04a54] text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <Plus className="h-4 w-4" />
                                    New Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Status Filter Pills - Modern Design */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {[
                            { key: 'all', label: 'All Reports', icon: LayoutGrid, color: 'gray' },
                            { key: 'pending', label: 'Pending', icon: Clock, color: 'amber' },
                            { key: 'approved', label: 'Approved', icon: CheckCircle, color: 'emerald' },
                            { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'rose' },
                        ].map((pill) => {
                            const Icon = pill.icon;
                            const isActive = status === pill.key;
                            const count = statusCounts[pill.key];

                            return (
                                <button
                                    key={pill.key}
                                    onClick={() => handleStatusChange(pill.key)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                        ? `bg-${pill.color}-100 text-${pill.color}-700 dark:bg-${pill.color}-900/30 dark:text-${pill.color}-400 shadow-sm ring-2 ring-${pill.color}-500/20`
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    {pill.label}
                                    {count > 0 && (
                                        <span className={`ml-1 text-xs ${isActive ? `text-${pill.color}-600 dark:text-${pill.color}-400` : 'text-gray-500 dark:text-gray-500'
                                            }`}>
                                            ({count})
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search and Per Page Row */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by tenant name, email, or property..."
                                    className="w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f34853]/50 focus:border-transparent transition-all"
                                />
                            </div>
                        </form>

                        <div className="flex items-center gap-3">
                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="sm:hidden inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                            </button>

                            <select
                                value={perPage}
                                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f34853]/50 text-sm"
                            >
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                                <option value={100}>100 per page</option>
                            </select>
                        </div>
                    </div>

                    {/* Mobile Filters Panel */}
                    {showFilters && (
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:hidden">
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    )}

                    {/* Enhanced Table Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                                <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <User className="h-3.5 w-3.5" />
                                                Tenant
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-3.5 w-3.5" />
                                                Property
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-3.5 w-3.5" />
                                                Document
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {reports.data?.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-full mb-4">
                                                        <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                    <p className="text-lg font-medium text-gray-900 dark:text-white">No reports found</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filters</p>
                                                    <button
                                                        onClick={handleAddNew}
                                                        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f34853] to-[#f35b64] hover:from-[#e03a45] hover:to-[#e04a54] text-white rounded-xl transition-all duration-200"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        Create New Report
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        reports.data.map((report) => (
                                            <tr
                                                key={report.id}
                                                className="group hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#f34853]/10 to-[#22346e]/10 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-[#f34853] dark:text-[#f35b64]">
                                                                {report.tenant?.name?.charAt(0)?.toUpperCase() || '?'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                {report.tenant?.name || 'N/A'}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {report.tenant?.email || 'No email'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {report.property?.name || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <MapPin className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {report.property?.address?.split(',')[0] || 'No address'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {report.pdf_path ? (
                                                        <a
                                                            href={`/storage/${report.pdf_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 rounded-full px-2 py-1 bg-[#22346e]/10 text-[#22346e] hover:text-[#f34853] dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:text-[#f35b64] transition-colors duration-200 font-medium text-sm"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                            View PDF
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm text-gray-400 dark:text-gray-500">No PDF</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(report.status)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => handleEdit(report)}
                                                            disabled={(isAdmin !='admin' && report.status == 'approved') || report.is_deleted == 1}
                                                            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 shadow-sm
                                                                ${(isAdmin !='admin' && report.status == 'approved') || report.is_deleted == 1
                                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
                                                                }`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            Edit 
                                                        </button>
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => handleProcess(report)}
                                                                disabled={report.is_deleted == 1 }
                                                                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 shadow-sm
                                                                ${report.is_deleted == 1
                                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                        : "bg-green-600 hover:bg-green-700 text-white hover:shadow-md"
                                                                    }`}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                Process
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Enhanced Pagination */}
                        {reports.data?.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing <span className="font-semibold text-gray-900 dark:text-white">{reports.from}</span> to{' '}
                                        <span className="font-semibold text-gray-900 dark:text-white">{reports.to}</span> of{' '}
                                        <span className="font-semibold text-gray-900 dark:text-white">{reports.total}</span> results
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.get(reports.prev_page_url || '#')}
                                            disabled={!reports.prev_page_url}
                                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="ml-1 text-sm">Previous</span>
                                        </button>
                                        <button
                                            onClick={() => router.get(reports.next_page_url || '#')}
                                            disabled={!reports.next_page_url}
                                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300"
                                        >
                                            <span className="mr-1 text-sm">Next</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}