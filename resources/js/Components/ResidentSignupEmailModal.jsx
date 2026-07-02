import React, { useState, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { router } from '@inertiajs/react';
import { Mail, X, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ResidentSignupEmailModal = ({ id, buttonText, buttonClassName = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emailInputRef = useRef(null);

    // Reset state when modal opens
    const handleOpen = () => {
        setIsOpen(true);
        setEmail('');
        setErrors({});
        // Focus input after modal opens
        setTimeout(() => {
            if (emailInputRef.current) {
                emailInputRef.current.focus();
            }
        }, 100);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setIsOpen(false);
            setErrors({});
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email address is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate email
        const validationError = validateEmail(email);
        if (validationError) {
            setErrors({ email: validationError });
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        // Submit using Inertia
        router.post('/resident-signups/send-email', 
            {
                id: id,
                email: email
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    toast.success('Email sent successfully!');
                    setIsSubmitting(false);
                    setIsOpen(false);
                    setEmail('');
                },
                onError: (errors) => {
                    console.error('Email send error:', errors);
                    if (errors.email) {
                        setErrors({ email: errors.email });
                    } else {
                        toast.error('Failed to send email. Please try again.');
                    }
                    setIsSubmitting(false);
                },
                onFinish: () => {
                    // Ensure loading state is reset if something goes wrong
                    setIsSubmitting(false);
                }
            }
        );
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={handleOpen}
                className={buttonClassName || "inline-flex items-center gap-1.5 px-3 py-2 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full hover:bg-blue-600 hover:text-white hover:shadow-lg hover:scale-[1.03] transition-all duration-300 text-xs font-medium"}
                type="button"
            >
                <Mail className="w-5 h-5" />
                {buttonText}
            </button>

            {/* Modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog 
                    as="div" 
                    className="relative z-50" 
                    onClose={handleClose}
                    initialFocus={emailInputRef}
                >
                    {/* Backdrop */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-2xl transition-all border border-gray-200/50 dark:border-gray-700/50">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <Dialog.Title
                                                as="h3"
                                                className="text-xl font-bold text-gray-900 dark:text-white"
                                            >
                                                Send Email
                                            </Dialog.Title>
                                        </div>
                                        <button
                                            onClick={handleClose}
                                            disabled={isSubmitting}
                                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Close modal"
                                        >
                                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="mt-2">
                                        <div className="space-y-4">
                                            {/* Email Input */}
                                            <div>
                                                <label 
                                                    htmlFor="email" 
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                                                >
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    ref={emailInputRef}
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        // Clear error when user types
                                                        if (errors.email) {
                                                            setErrors({});
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        // Validate on blur
                                                        if (email) {
                                                            const error = validateEmail(email);
                                                            if (error) {
                                                                setErrors({ email: error });
                                                            }
                                                        }
                                                    }}
                                                    className={`w-full px-4 py-2.5 rounded-xl border ${
                                                        errors.email 
                                                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                                                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200`}
                                                    placeholder="tenant@example.com"
                                                    disabled={isSubmitting}
                                                    aria-invalid={!!errors.email}
                                                    aria-describedby={errors.email ? "email-error" : undefined}
                                                />
                                                {errors.email && (
                                                    <div 
                                                        id="email-error"
                                                        className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500"
                                                    >
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span>{errors.email}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info Message */}
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                                <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <span>
                                                        The email will be sent to the provided address with the resident signup details and PDF attachment.
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                disabled={isSubmitting}
                                                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !email}
                                                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        Send Email
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default ResidentSignupEmailModal;