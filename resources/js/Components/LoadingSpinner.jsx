import React from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center">
            <FaSpinner className="animate-spin h-5 w-5" />
        </div>
    );
}