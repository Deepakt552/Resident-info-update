import { useEffect, useState } from 'react';

export default function FlashMessage({ message, type = 'success' }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!visible || !message) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in-down`}>
            {message}
        </div>
    );
}