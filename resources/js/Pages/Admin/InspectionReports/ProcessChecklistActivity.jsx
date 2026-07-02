// resources/js/Pages/Admin/InspectionReports/ProcessChecklistActivity.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    FaBuilding,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaImage,
    FaComment,
    FaClipboardList,
    FaEye,
    FaFileAlt,
    FaSave,
    FaSpinner,
    FaHistory,
    FaEdit,
} from 'react-icons/fa';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

// Image Gallery Component
const ImageGallery = ({ images = [] }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!images || images.length === 0) {
        return (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                No images uploaded
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map((image, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className="relative cursor-pointer group"
                    >
                        <img
                            src={image.startsWith('http') ? image : `/storage/${image}`}
                            alt={`Inspection image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-all"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                            <FaEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-full p-4">
                        <img
                            src={selectedImage.startsWith('http') ? selectedImage : `/storage/${selectedImage}`}
                            alt="Full size inspection image"
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

// Status Badge Component
const StatusBadge = ({ status, size = 'md' }) => {
    const statusConfig = {
        pending: {
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            text: 'text-yellow-800 dark:text-yellow-300',
            icon: FaClock
        },
        approved: {
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-800 dark:text-green-300',
            icon: FaCheckCircle
        },
        rejected: {
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-800 dark:text-red-300',
            icon: FaTimesCircle
        }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

    return (
        <span className={`inline-flex items-center gap-1.5 ${sizeClasses} rounded-full font-medium ${config.bg} ${config.text}`}>
            <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// Checklist Item Component with Status Update (for admin)
const ChecklistItem = ({ item, savedData, onStatusUpdate, isUpdating }) => {
    const [selectedStatus, setSelectedStatus] = useState(savedData?.status || 'pending');
    const [comment, setComment] = useState('');

    const hasData = savedData;
    const status = savedData?.status || 'pending';
    const images = savedData?.images_json ?
        (typeof savedData.images_json === 'string' ? JSON.parse(savedData.images_json) : savedData.images_json)
        : [];
    const existingComment = savedData?.comment || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error('Please add a comment before updating');
            return;
        }

        await onStatusUpdate(item.id, selectedStatus, comment);
        setComment('');
    };

    return !hasData ? null : (

        <div className={`p-4 border rounded-lg bg-white dark:bg-gray-800 ${hasData ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200 dark:border-gray-700 opacity-75'
            }`}>
            <div className="flex items-start gap-3">
                <div className="mt-1">
                    {status === 'approved' && <FaCheckCircle className="w-5 h-5 text-green-500" />}
                    {status === 'rejected' && <FaTimesCircle className="w-5 h-5 text-red-500" />}
                    {status === 'pending' && <FaClock className="w-5 h-5 text-yellow-500" />}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <label className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                        </label>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={status} size="sm" />
                        </div>
                    </div>

                    {!hasData ? (
                        <div className="mt-2 text-sm text-gray-400 dark:text-gray-500 italic">
                            Not Uploaded by Tenant
                        </div>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {/* Images Section - Always Visible */}
                            {images.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <FaImage className="w-4 h-4" />
                                        <span>Uploaded Images ({images.length})</span>
                                    </div>
                                    <ImageGallery images={images} />
                                </div>
                            )}

                            {/* Existing Comment Section - Always Visible */}
                            {existingComment && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <FaComment className="w-4 h-4" />
                                        <span>Current Comments</span>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {existingComment}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Status Update Form */}
                            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Update Status
                                </h4>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Change Status
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        disabled={isUpdating}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Comment *
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter reason for status change..."
                                        required
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isUpdating || !comment.trim()}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isUpdating ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
                                        Update Status
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// PDF Update Section Component
const PDFUpdateSection = ({ pdf, onPDFUpdate, isUpdating }) => {
    const [status, setStatus] = useState(pdf?.status || 'pending');
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error('Please add a comment before updating');
            return;
        }
        await onPDFUpdate(status, comment);
        setComment('');
    };

    if (!pdf) return null;

    const existingComment = pdf.comment || '';

    return (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaFileAlt className="w-4 h-4 text-indigo-600" />
                PDF Status
            </h3>

            {/* Existing Comment - Always Visible */}
            {existingComment && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FaComment className="w-4 h-4" />
                        <span>Current Comment</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {existingComment}
                    </p>
                </div>
            )}

            {/* Status Update Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Status
                    </label>
                    <div className="mb-4">
                        <StatusBadge status={pdf.status} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Change Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        disabled={isUpdating}
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Comment *
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter reason for status change..."
                        required
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isUpdating ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
                        Update PDF Status
                    </button>
                </div>
            </form>
        </div>
    );
};

// PDF History Component
const PDFHistory = ({ history = [] }) => {
    if (!history || history.length === 0) return null;

    return (
        <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
                <FaHistory className="w-4 h-4 text-gray-500" />
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Status History</h4>
            </div>
            <div className="space-y-2">
                {history.map((item, index) => (
                    <div key={index} className="text-xs text-gray-600 dark:text-gray-400 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                        <div className="flex items-center gap-2 mb-1">
                            <StatusBadge status={item.status} size="sm" />
                            <span className="text-gray-500">by {item.updated_by || 'Admin'}</span>
                        </div>
                        {item.comment && <p className="mt-1">{item.comment}</p>}
                        <p className="text-gray-400 mt-1">{new Date(item.updated_at).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Component
export default function ProcessChecklistActivity({
    properties,
    checklistItems,
    existingInspections,
    selectedPropertyId,
    pdfs,
}) {
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [propertyInspections, setPropertyInspections] = useState({});
    const [pdfRecord, setPdfRecord] = useState(null);
    const [isUpdatingPDF, setIsUpdatingPDF] = useState(false);
    const [isUpdatingChecklist, setIsUpdatingChecklist] = useState({});
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState('');

    // console.log(pdfRecord)
    // Initialize with the provided property ID
    useEffect(() => {
        if (selectedPropertyId && properties.length > 0) {
            const property = properties.find(p => p.id === selectedPropertyId);
            if (property) {
                setSelectedProperty(property);
            }
        }
    }, [selectedPropertyId, properties]);

    // Load inspections for selected property
    useEffect(() => {
        if (selectedProperty && existingInspections[selectedProperty.id]) {
            const inspectionsMap = {};
            existingInspections[selectedProperty.id].forEach(insp => {
                inspectionsMap[insp.checklist_item_id] = insp;
            });
            setPropertyInspections(inspectionsMap);
            setPdfRecord(pdfs);
        }
    }, [selectedProperty, existingInspections, pdfs]);

    // Update checklist item status
    const handleChecklistUpdate = async (checklistItemId, newStatus, comment) => {
        setIsUpdatingChecklist(prev => ({ ...prev, [checklistItemId]: true }));

        try {
            const response = await fetch('/Admin/inspection/update-checklist-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    property_id: selectedProperty.id,
                    checklist_item_id: checklistItemId,
                    status: newStatus,
                    comment: comment
                })
            });

            const data = await response.json();

            if (data.success) {
                setPropertyInspections(prev => ({
                    ...prev,
                    [checklistItemId]: data.data.inspection
                }));
                toast.success(`Checklist item status updated to ${newStatus}`);
            } else {
                throw new Error(data.message || 'Update failed');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update checklist status');
        } finally {
            setIsUpdatingChecklist(prev => ({ ...prev, [checklistItemId]: false }));
        }
    };

    // Update PDF status
    const handlePDFUpdate = async (newStatus, comment) => {
        if (!pdfRecord) return;

        setIsUpdatingPDF(true);

        try {
            const response = await fetch('/Admin/inspection/final-approval', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    property_id: selectedProperty.id,
                    final_status: newStatus,
                    pdf_status: newStatus,
                    comment: comment
                })
            });

            const data = await response.json();

            if (data.success) {
                setPdfRecord(data.data.pdf);

                if (newStatus === 'approved') {
                    const updatedInspections = {};
                    data.data.checklists.forEach(checklist => {
                        updatedInspections[checklist.checklist_item_id] = checklist;
                    });
                    setPropertyInspections(updatedInspections);
                    toast.success('PDF Approved! All inspection checklist items have been automatically approved.');
                } else {
                    toast.success(`PDF status updated to ${newStatus}. Checklist items remain unchanged.`);
                }
            } else {
                throw new Error(data.message || 'Update failed');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update PDF status');
        } finally {
            setIsUpdatingPDF(false);
        }
    };

    const getSavedData = (itemId) => propertyInspections[itemId] || null;

    const pdfHistory = pdfRecord?.history || [];

    return (
        <AuthenticatedLayout>
            <Head title="Inspection Report - Admin Review" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaClipboardList className="w-6 h-6 text-indigo-600" />
                            Inspection Report Review
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Review tenant inspection report and update checklist/PDF status
                        </p>
                    </div>

                    {/* Property Information & PDF Card */}
                    {selectedProperty && pdfRecord && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FaBuilding className="w-5 h-5 text-indigo-600" />
                                        PDF Report Details
                                    </h2>
                                    <StatusBadge status={pdfRecord.status} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Tenant Name
                                            </label>
                                            <div className="text-gray-900 dark:text-white font-medium">
                                                {pdfRecord.tenant?.name || 'N/A'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Property Name
                                            </label>
                                            <div className="text-gray-900 dark:text-white">
                                                {selectedProperty.name}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Property Address
                                            </label>
                                            <div className="text-gray-900 dark:text-white">
                                                {selectedProperty.address}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Created Date
                                            </label>
                                            <div className="text-gray-900 dark:text-white">
                                                {pdfRecord.created_at ? new Date(pdfRecord.created_at).toLocaleString() : 'N/A'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Last Updated
                                            </label>
                                            <div className="text-gray-900 dark:text-white">
                                                {pdfRecord.updated_at ? new Date(pdfRecord.updated_at).toLocaleString() : 'N/A'}
                                            </div>
                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Inspection Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaCheckCircle className="w-5 h-5 text-indigo-600" />
                            Inspection Checklist Summary
                        </h2>

                        {!selectedProperty ? (
                            <div className="text-center py-12 text-gray-500">
                                <FaClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Loading inspection data...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {checklistItems.map((item) => {
                                    const savedData = getSavedData(item.id);
                                    return (
                                        <ChecklistItem
                                            key={item.id}
                                            item={item}
                                            savedData={savedData}
                                            onStatusUpdate={handleChecklistUpdate}
                                            isUpdating={isUpdatingChecklist[item.id]}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <button
                            onClick={() => {
                                setSelectedPdf(`/storage/${pdfRecord.pdf_path}`);
                                setShowPdfModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full
                                bg-indigo-100 text-indigo-800
                                dark:bg-indigo-900/30 dark:text-indigo-300
                                hover:bg-indigo-200 dark:hover:bg-indigo-900/50
                                transition-all"
                            >
                            {/* <FileText className="h-4 w-4" /> */}
                            <span className="text-sm ">View PDF</span>
                        </button>
                        {/* PDF Update Section */}
                        <PDFUpdateSection
                            pdf={pdfRecord}
                            onPDFUpdate={handlePDFUpdate}
                            isUpdating={isUpdatingPDF}
                        />
                        {/* <div className='mt-5'>
                            <iframe
                                src={`/storage/${pdfRecord.pdf_path}`}
                                title="PDF Preview"
                                className="w-full h-[600px] border-0"
                            />
                        </div> */}
                        {/* PDF Status History */}
                        <PDFHistory history={pdfHistory} />

                    </div>
                </div>
            </div>
            {showPdfModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                PDF Preview
                            </h3>

                            <button
                                onClick={() => {
                                    setShowPdfModal(false);
                                    setSelectedPdf('');
                                }}
                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* PDF */}
                        <div className="flex-1">
                            <iframe
                                src={selectedPdf}
                                title="PDF Preview"
                                className="w-full h-full border-0"
                            />
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}