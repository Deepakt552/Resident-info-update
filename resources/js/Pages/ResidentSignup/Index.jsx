// resources/js/Pages/ResidentSignup/Index.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { debounce } from 'lodash';
import SignatureCanvas from 'react-signature-canvas';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Home,
    User,
    Building2,
    Menu,
    Moon,
    Sun,
    CheckSquare,
    ClipboardList,
    Eye,
    Users,
    ChevronDown,
    Plus,
    X,
    AlertCircle,
    CheckCircle,
    Search,
    FileSignature,
    Calendar,
    Phone,
    Mail,
    UserCircle,
    MapPin,
    Hash
} from 'lucide-react';
import { getStoredSignup, storeSignupData, clearExpiredSignup } from '@/utils/storage';
import AlreadySubmitted from './AlreadySubmitted';

// Phone number formatting helper function
const formatPhone = (value) => {
    // Remove all non-digit characters and limit to 10 digits
    const numbers = value.replace(/\D/g, '').slice(0, 10);

    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
        return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;

    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
};

// Phone number validation function
const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') {
        return 'Phone number is required.';
    }

    // Remove hyphens and spaces for validation
    const cleanPhone = phone.replace(/[\s-]/g, '');

    // Check if it contains only numbers
    if (!/^\d+$/.test(cleanPhone)) {
        return 'Please enter a valid phone number.';
    }

    // Check length
    if (cleanPhone.length < 10) {
        return 'Please enter a valid phone number.';
    }

    if (cleanPhone.length > 15) {
        return 'Please enter a valid phone number.';
    }

    return null; // No error
};

const ResidentSignupForm = () => {
    const [properties, setProperties] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [propertyId, setPropertyId] = useState('');
    const [unitno, setUnitno] = useState('');
    const [tenants, setTenants] = useState([
        {
            id: 1,
            full_name: '',
            email: '',
            phone: '',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            signature: '',
            // date: '',
        }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [showAlreadySubmitted, setShowAlreadySubmitted] = useState(false);
    // Get authentication status from Inertia shared props
    const { auth } = usePage().props;
    const isAuthenticated = !!auth?.user;
    // Store signature refs
    const signatureRefs = useRef({});
    const formRef = useRef(null);
    const propertyInputRef = useRef(null);

    // Check for existing submission on mount
    useEffect(() => {
        const existingSubmission = getStoredSignup();
        if (existingSubmission) {
            setShowAlreadySubmitted(true);
        }
    }, [isAuthenticated]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query.length >= 2) {
                axios.get('/resident-signup/property-search', {
                    params: { query }
                })
                    .then(response => {
                        setProperties(response.data);
                        setShowDropdown(true);
                    })
                    .catch(error => {
                        console.error('Error searching properties:', error);
                    });
            } else {
                setProperties([]);
                setShowDropdown(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handlePropertySearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSelectedProperty(null);
        setPropertyId('');
        debouncedSearch(query);
    };

    const handleSelectProperty = (property) => {
        setSelectedProperty(property);
        setSearchQuery(property.name);
        setPropertyId(property.id);
        setShowDropdown(false);
        setProperties([]);
    };

    const handleAddTenant = () => {
        if (tenants.length < 4) {
            const newTenant = {
                id: tenants.length + 1,
                full_name: '',
                email: '',
                phone: '',
                emergency_contact_name: '',
                emergency_contact_phone: '',
                signature: '',
                // date: '',
            };
            setTenants([...tenants, newTenant]);
        }
    };

    const handleRemoveTenant = (index) => {
        if (tenants.length > 1) {
            const updatedTenants = tenants.filter((_, i) => i !== index);
            setTenants(updatedTenants);
            // Remove signature ref
            delete signatureRefs.current[index];
            // Re-index refs
            const newRefs = {};
            Object.keys(signatureRefs.current).forEach(key => {
                const numKey = parseInt(key);
                if (numKey > index) {
                    newRefs[numKey - 1] = signatureRefs.current[numKey];
                } else if (numKey < index) {
                    newRefs[numKey] = signatureRefs.current[numKey];
                }
            });
            signatureRefs.current = newRefs;
        }
    };

    const handleTenantChange = (index, field, value) => {
        const updatedTenants = [...tenants];

        // Apply phone formatting if field is phone or emergency_contact_phone
        if (field === 'phone' || field === 'emergency_contact_phone') {
            // Only allow numbers and hyphens
            const formattedValue = formatPhone(value);
            updatedTenants[index][field] = formattedValue;
        } else {
            updatedTenants[index][field] = value;
        }

        setTenants(updatedTenants);

        // Clear error for this field when user starts typing
        if (errors[`tenants.${index}.${field}`]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`tenants.${index}.${field}`];
                return newErrors;
            });
        }
    };

    const clearSignature = (index) => {
        if (signatureRefs.current[index]) {
            signatureRefs.current[index].clear();
            const updatedTenants = [...tenants];
            updatedTenants[index].signature = '';
            setTenants(updatedTenants);
        }
    };

    // Get signature data from canvas
    const getSignatureData = (index) => {
        if (signatureRefs.current[index]) {
            return signatureRefs.current[index].toDataURL('image/png');
        }
        return '';
    };

    // Check if signature pad is empty
    const isSignatureEmpty = (index) => {
        if (signatureRefs.current[index]) {
            return signatureRefs.current[index].isEmpty();
        }
        return true;
    };

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Generate unique submission ID
    const generateSubmissionId = () => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `SIG-${timestamp}-${random}`.toUpperCase();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        // Capture all signatures before validation
        const updatedTenants = tenants.map((tenant, index) => ({
            ...tenant,
            signature: getSignatureData(index)
        }));
        setTenants(updatedTenants);

        // Validate all fields before submission
        const allErrors = {};
        let hasErrors = false;

        // Validate property
        if (!propertyId) {
            allErrors.property_id = ['Please select a property'];
            hasErrors = true;
        }

        // Validate unit number
        if (!unitno.trim()) {
            allErrors.unitno = ['Unit number is required'];
            hasErrors = true;
        }

        // Validate each tenant
        updatedTenants.forEach((tenant, index) => {
            if (!tenant.full_name.trim()) {
                allErrors[`tenants.${index}.full_name`] = ['Full name is required'];
                hasErrors = true;
            }
            if (!tenant.email.trim()) {
                allErrors[`tenants.${index}.email`] = ['Email is required'];
                hasErrors = true;
            } else if (!/\S+@\S+\.\S+/.test(tenant.email)) {
                allErrors[`tenants.${index}.email`] = ['Please enter a valid email address'];
                hasErrors = true;
            }

            // Validate phone number
            const phoneError = validatePhone(tenant.phone);
            if (phoneError) {
                allErrors[`tenants.${index}.phone`] = [phoneError];
                hasErrors = true;
            }

            if (!tenant.emergency_contact_name.trim()) {
                allErrors[`tenants.${index}.emergency_contact_name`] = ['Emergency contact name is required'];
                hasErrors = true;
            }

            // Validate emergency contact phone
            const emergencyPhoneError = validatePhone(tenant.emergency_contact_phone);
            if (emergencyPhoneError) {
                allErrors[`tenants.${index}.emergency_contact_phone`] = [emergencyPhoneError];
                hasErrors = true;
            }

            // Check if signature is empty using the signature pad instance
            if (isSignatureEmpty(index)) {
                allErrors[`tenants.${index}.signature`] = ['Signature is required.'];
                hasErrors = true;
            }
            // if (!tenant.date) {
            //     allErrors[`tenants.${index}.date`] = ['Date is required'];
            //     hasErrors = true;
            // }
        });

        if (hasErrors) {
            setErrors(allErrors);
            setIsSubmitting(false);
            toast.error('Please fill in all required fields');
            scrollToTop();
            return;
        }

        try {
            const response = await axios.post('/resident-signup', {
                property_id: propertyId,
                unitno: unitno,
                tenants: updatedTenants.map(t => ({
                    full_name: t.full_name,
                    email: t.email,
                    phone: t.phone,
                    emergency_contact_name: t.emergency_contact_name,
                    emergency_contact_phone: t.emergency_contact_phone,
                    signature: t.signature,
                    // date: t.date,
                })),
            });

            if (response.status === 201) {
                // Generate submission ID
                const submissionId = generateSubmissionId();

                // Store data in localStorage
                storeSignupData({
                    submission_id: submissionId,
                    property_name: selectedProperty?.name || '',
                    property_address: selectedProperty?.address || '',
                    unitno: unitno,
                });

                // Show success toast
                toast.success('Resident Signup saved successfully.');

                // Show loading alert
                await Swal.fire({
                    icon: 'success',
                    title: 'Resident Signup Saved Successfully',
                    text: 'Redirecting to confirmation...',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    willClose: () => {
                        window.location.reload();
                    }
                });

                // Switch to AlreadySubmitted view after 2 seconds
                setShowAlreadySubmitted(true);
                scrollToTop();

                // Reset form
                setTenants([{
                    id: 1,
                    full_name: '',
                    email: '',
                    phone: '',
                    emergency_contact_name: '',
                    emergency_contact_phone: '',
                    signature: '',
                    // date: '',
                }]);
                setPropertyId('');
                setUnitno('');
                setSearchQuery('');
                setSelectedProperty(null);
                setProperties([]);
                setErrors({});
                signatureRefs.current = {};
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
                toast.error('Please fix the validation errors');
                scrollToTop();
            } else {
                toast.error('An error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Resident Signup" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Sticky Header */}
                <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
                    {/* <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/dashboard"
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
                                    title="Dashboard"
                                >
                                    <Home className="w-5 h-5 text-navy dark:text-gray-300" />
                                </Link>
                                <h1 className="text-xl font-bold text-navy dark:text-white">
                                    Resident Signup
                                </h1>
                            </div>
                            <div className="flex items-center gap-2">

                            </div>
                        </div>
                    </div> */}
                </div>

                <div className="py-5 px-0 sm:px-6 lg:px-8 lg:py-8">
                    <div className="max-w-4xl mx-auto">

                        {/* Main Form Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 p-2 md:p-8">
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                                {/* Property Section */}
                                <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
                                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                                        <Building2 className="w-5 h-5 text-coral" />
                                        <h2 className="text-lg font-semibold text-navy dark:text-gray-200">
                                            Property Details
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                Property Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    ref={propertyInputRef}
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={handlePropertySearch}
                                                    className={`w-full pl-4 pr-10 py-2.5 border rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${errors.property_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                        }`}
                                                    placeholder="Search property by name..."
                                                    autoComplete="off"
                                                />
                                                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                                {showDropdown && properties.length > 0 && (
                                                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                                        {properties.map((property) => (
                                                            <div
                                                                key={property.id}
                                                                onClick={() => handleSelectProperty(property)}
                                                                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors duration-150"
                                                            >
                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                    {property.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {property.address}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {errors.property_id && (
                                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.property_id[0]}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedProperty?.address || ''}
                                                readOnly
                                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                Unit Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={unitno}
                                                onChange={(e) => setUnitno(e.target.value)}
                                                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${errors.unitno ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                                placeholder="Enter unit number"
                                            />
                                            {errors.unitno && (
                                                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.unitno[0]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Tenant Section */}
                                <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
                                    <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-coral" />
                                            <h2 className="text-lg font-semibold text-navy dark:text-gray-200">
                                                Tenant Information
                                            </h2>
                                        </div>
                                    </div>

                                    {tenants.map((tenant, index) => (
                                        <div
                                            key={tenant.id}
                                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-5 mb-6 last:mb-0"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-5 h-5 text-coral" />
                                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                                        Tenant Information #{String(index + 1).padStart(2, '0')}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-coral/10 text-coral rounded-full px-4 py-1 text-xs font-medium">
                                                        Tenant {index + 1}
                                                    </span>
                                                    {tenants.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTenant(index)}
                                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors duration-200"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                        Full Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={tenant.full_name}
                                                        onChange={(e) => handleTenantChange(index, 'full_name', e.target.value)}
                                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${errors[`tenants.${index}.full_name`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                            }`}
                                                        placeholder="Enter full name"
                                                    />
                                                    {errors[`tenants.${index}.full_name`] && (
                                                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors[`tenants.${index}.full_name`][0]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                        Email Address <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={tenant.email}
                                                        onChange={(e) => handleTenantChange(index, 'email', e.target.value)}
                                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${errors[`tenants.${index}.email`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                            }`}
                                                        placeholder="Enter email address"
                                                    />
                                                    {errors[`tenants.${index}.email`] && (
                                                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors[`tenants.${index}.email`][0]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                        Phone Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={tenant.phone}
                                                            onChange={(e) => handleTenantChange(index, 'phone', e.target.value)}
                                                            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${errors[`tenants.${index}.phone`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                                }`}
                                                            placeholder="(123) 456-7890"
                                                            maxLength={12}
                                                        />
                                                    </div>
                                                    {errors[`tenants.${index}.phone`] ? (
                                                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors[`tenants.${index}.phone`][0]}
                                                        </p>
                                                    ) : (
                                                        <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
                                                            <span>Format: 123-456-7890 (10 digits)</span>
                                                        </p>
                                                    )}
                                                </div>

                                                {/* <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                        Date <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={tenant.date}
                                                        onChange={(e) => handleTenantChange(index, 'date', e.target.value)}
                                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${errors[`tenants.${index}.date`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                            }`}
                                                    />
                                                    {errors[`tenants.${index}.date`] && (
                                                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors[`tenants.${index}.date`][0]}
                                                        </p>
                                                    )}
                                                </div> */}

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                        Emergency Contact Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={tenant.emergency_contact_name}
                                                        onChange={(e) => handleTenantChange(index, 'emergency_contact_name', e.target.value)}
                                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${errors[`tenants.${index}.emergency_contact_name`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                            }`}
                                                        placeholder="Enter emergency contact name"
                                                    />
                                                    {errors[`tenants.${index}.emergency_contact_name`] && (
                                                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors[`tenants.${index}.emergency_contact_name`][0]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                        Emergency Contact Phone <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={tenant.emergency_contact_phone}
                                                            onChange={(e) => handleTenantChange(index, 'emergency_contact_phone', e.target.value)}
                                                            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-coral focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 ${errors[`tenants.${index}.emergency_contact_phone`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                                }`}
                                                            placeholder="(123) 456-7890"
                                                            maxLength={12}
                                                        />
                                                    </div>
                                                    {errors[`tenants.${index}.emergency_contact_phone`] ? (
                                                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />
                                                            {errors[`tenants.${index}.emergency_contact_phone`][0]}
                                                        </p>
                                                    ) : (
                                                        <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
                                                            <span>Format: 123-456-7890 (10 digits)</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Signature Section */}
                                            <div className="pt-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                    Signature <span className="text-red-500">*</span>
                                                </label>
                                                <div className={`border-2 border-dashed rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 transition-all duration-200 ${errors[`tenants.${index}.signature`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    }`}>
                                                    <SignatureCanvas
                                                        ref={(ref) => {
                                                            if (ref) {
                                                                signatureRefs.current[index] = ref;
                                                            }
                                                        }}
                                                        canvasProps={{
                                                            className: 'w-full h-48',
                                                            style: {
                                                                background: 'transparent',
                                                            }
                                                        }}
                                                        backgroundColor="transparent"
                                                        penColor="#000000"
                                                        clearOnResize={false}
                                                    />
                                                </div>
                                                {errors[`tenants.${index}.signature`] && (
                                                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors[`tenants.${index}.signature`][0]}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => clearSignature(index)}
                                                        className="px-5 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {errors.tenants && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.tenants[0]}
                                        </p>
                                    )}

                                    <div className="flex items-center  justify-between  gap-3">
                                        <div className=""></div>
                                        <button
                                            type="button"
                                            onClick={handleAddTenant}
                                            disabled={tenants.length >= 4}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-200 ${tenants.length < 4
                                                ? 'bg-coral hover:bg-opacity-90 shadow-md hover:shadow-lg hover:scale-105'
                                                : 'bg-gray-400 cursor-not-allowed opacity-50'
                                                }`}
                                        >
                                            <User className="w-4 h-4" />
                                            Add Tenant
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex items-center gap-3 px-8 py-3 bg-coral text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckSquare className="w-5 h-5" />
                                                Submit Resident Signup
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default function ResidentSignup() {
    const [showTermsModal, setShowTermsModal] = useState(true);
    const [showAlreadySubmitted, setShowAlreadySubmitted] = useState(false);
    const { auth } = usePage().props;
    const isAuthenticated = !!auth?.user;
    useEffect(() => {
        // Check for existing submission on component mount
        const existingSubmission = getStoredSignup();
        if (existingSubmission) {
            setShowAlreadySubmitted(true);
        }

        // Listen for storage changes (for cross-tab sync)
        const handleStorageChange = (e) => {
            if (e.key === 'resident_signup_submission') {
                const newSubmission = getStoredSignup();
                setShowAlreadySubmitted(!!newSubmission);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [isAuthenticated]);

    // If there's an existing submission, show AlreadySubmitted component
    if (showAlreadySubmitted && !isAuthenticated) {
        return <AlreadySubmitted />;
    }

    return (
        <>

            <Head title="Dashboard" />
            {showTermsModal && (
                <>
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-[fadeInScale_0.3s_ease-out]">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        NOTICE TO RESIDENT

                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        RESIDENT INFORMATION UPDATE
                                    </p>
                                </div>
                                <div className="bg-coral/10 rounded-full p-2">
                                    <CheckCircle className="w-6 h-6 text-coral" />
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex-1 overflow-y-auto p-2 space-y-5 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">

                                    <p>
                                        Dear Resident(s),
                                    </p>

                                    <p>
                                        This notice is to inform you that Management is committed to maintaining accurate resident records and ensuring efficient communication with all occupants of the community.
                                        As part of this process, all adult tenants listed on the Lease Agreement are required to complete the enclosed Resident Sign-Up Sheet.
                                    </p>

                                    <p>
                                        The information collected will be used strictly for updating Management records and maintaining current contact details.
                                        Accurate resident information is essential to ensure proper communication and effective property management operations.
                                    </p>

                                    <p>
                                        Effective August 1, 2026, Management intends to utilize email as a primary method of communication with residents, where permitted by applicable law.
                                        Therefore, each adult tenant is requested to provide a valid and regularly monitored email address on the form.
                                    </p>

                                    <p>
                                        Residents must ensure that all required information is completed accurately, including contact details and emergency contact information,
                                        and must return the completed form to the Management Office within three (3) days of receipt of this notice.
                                    </p>

                                    <p>
                                        Residents are responsible for keeping their information up to date.
                                        Any changes to contact details must be reported to Management in writing without delay.
                                    </p>

                                    <p>
                                        Your cooperation is appreciated and will help ensure smooth communication and efficient management of the property.
                                    </p>

                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Sincerely,<br />
                                        Management
                                    </p>

                                </div>
                            </div>

                            {/* Fixed Footer */}
                            <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                                <button
                                    onClick={() => {
                                        setShowTermsModal(false);
                                        setIsFormAccessible(true);
                                    }}
                                    className="w-full py-3.5 bg-coral hover:bg-coral/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                  Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <ResidentSignupForm />
        </>
    );
}