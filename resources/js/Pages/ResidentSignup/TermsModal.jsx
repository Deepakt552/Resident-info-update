// resources/js/Components/TermsModal.jsx
import React, { useState, useEffect } from 'react';

const TermsModal = ({ isOpen, onAccept }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Trigger animation after mount
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        } else {
            setIsVisible(false);
            // Remove from DOM after animation completes
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onAccept}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div 
                    className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col pointer-events-auto transition-all duration-300 ${
                        isVisible 
                            ? 'opacity-100 scale-100 translate-y-0' 
                            : 'opacity-0 scale-95 translate-y-4'
                    }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Terms & Conditions
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Please review and accept to continue
                            </p>
                        </div>
                        <div className="bg-coral/10 rounded-full p-2">
                            <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Dear Resident(s),
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                This notice is to inform you that Management is committed to maintaining accurate resident records and ensuring efficient communication with all occupants of the community. As part of this effort, we are requesting that all adult tenants listed on the Lease Agreement complete the enclosed Resident Sign-Up Sheet.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                The information collected will be used to update Management's records and maintain current contact information for residents. Accurate resident information is essential to ensure that communications are directed to the appropriate individuals and that Management is able to effectively administer and operate the property.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Please be advised that effective August 1, 2026, Management intends to utilize email as a primary method of communication with residents, where permitted by applicable law. To facilitate this transition, each adult tenant listed on the Lease Agreement is requested to provide a valid and regularly monitored email address on the enclosed form.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Please carefully complete all requested information contained in the Resident Sign-Up Sheet, including contact and emergency contact information, and return the completed form to the Management Office within three (3) days of receipt of this letter.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Residents are responsible for ensuring that the information provided remains current and accurate. Any future changes to contact information should be promptly reported to Management in writing.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Your cooperation in this matter is appreciated and will assist Management in maintaining accurate records and effective communication with residents.
                            </p>
                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-gray-700 dark:text-gray-300">
                                    Sincerely,
                                </p>
                                <p className="text-gray-700 dark:text-gray-300 font-medium">
                                    The Management
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                        <button
                            onClick={onAccept}
                            className="w-full py-3.5 bg-coral hover:bg-coral/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            I Agree & Continue
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsModal;