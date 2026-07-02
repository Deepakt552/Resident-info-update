import { useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// icons
import { Home, User, Building2,MailOpen, Menu, Moon, Sun, CheckSquare, ClipboardList, Eye, Users, X } from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { url } = usePage();
    const { flash } = usePage().props;
    const { hasChecklistRecords } = usePage().props;

    const [open, setOpen] = useState(() => {
        // Check if window is available (client-side)
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024; // Open by default on large screens
        }
        return true;
    });

    const [mobileOpen, setMobileOpen] = useState(false);

    const [dark, setDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    // Handle window resize for sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setOpen(false);
            } else {
                setOpen(true);
                setMobileOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isActive = (path) => url.startsWith(path);
    const activeBg = "bg-[#f34853]";
    const activeText = "text-white";
    const inactiveBg = "hover:bg-[#22346e]/10 dark:hover:bg-[#22346e]/30";

    const NavItem = ({ href, icon: Icon, label, onClick }) => (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                ${isActive(href)
                    ? `${activeBg} ${activeText} shadow-md`
                    : `text-gray-600 dark:text-gray-300 ${inactiveBg}`
                }`}
        >
            <Icon size={20} strokeWidth={1.8} className="flex-shrink-0" />
            {open && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
        </Link>
    );

    const getNavItems = () => {
        if (user.role == 'user') {
            return [
                { href: "/dashboard", icon: Home, label: "Dashboard" },
                { href: "/inspection-reports", icon: Building2, label: "Inspection Reports" },
            ];
        }
        return [
            { href: "/dashboard", icon: Home, label: "Dashboard" },
            { href: "/resident-signup/list", icon: Building2, label: "Resident" },
            { href: "/users", icon: Users, label: "Users" },
            { href: "/properties", icon: Building2, label: "Properties" },
            { href: "/profile", icon: User, label: "Profile" },
            { href: "/settings/mail", icon: MailOpen, label: "Email Setting" },
        ];
    };

    // Close mobile sidebar when clicking a link
    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setMobileOpen(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 relative">
            {/* Background Pattern */}
            <div
                className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-10 z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%23f34853' stroke-width='0.5' opacity='0.3'/%3E%3Ccircle cx='20' cy='80' r='15' fill='none' stroke='%2322346e' stroke-width='0.5' opacity='0.3'/%3E%3Ccircle cx='80' cy='20' r='25' fill='none' stroke='%23f34853' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '40px'
                }}
            />

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={dark ? "dark" : "light"}
            />

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* SIDEBAR - Desktop */}
            <div
                className={`hidden lg:flex sticky top-0 h-screen flex-col transition-all duration-300 border-r
                    bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-30
                    ${open ? "w-64" : "w-20"}`}
            >
                {/* Sidebar content */}
                <div className="flex items-center justify-between p-2 border-b border-[#22346e]/20 dark:border-[#22346e]/40">
                    <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
                        <div className="text-[#f34853] dark:text-[#f34853] flex-shrink-0">
                            <img
                                src="/images/Im_logo.png"
                                alt="Logo"
                                className="h-12 w-auto md:h-16"
                            />
                        </div>
                        {open && (
                            <span className="text-[#22346e] dark:text-white font-bold text-base md:text-lg truncate">
                                PropManage
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setOpen(!open)}
                        className="text-[#22346e] dark:text-gray-300 hover:text-[#f34853] dark:hover:text-[#f34853] transition-colors flex-shrink-0"
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={22} />
                    </button>
                </div>

                <nav className="mt-6 space-y-2 px-2 flex-1 overflow-y-auto">
                    {getNavItems().map((item) => (
                        <NavItem key={item.href} {...item} />
                    ))}
                </nav>

                <div className="mt-auto p-2 border-t border-[#22346e]/20 dark:border-[#22346e]/40">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                            bg-[#22346e] hover:bg-[#f34853] text-white`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                            />
                        </svg>
                        {open && (
                            <span className="text-sm font-medium truncate">
                                Logout
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* SIDEBAR - Mobile */}
            <div
                className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm 
                    border-r border-[#22346e]/20 dark:border-[#22346e]/40 z-50 
                    transform transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between p-4 border-b border-[#22346e]/20 dark:border-[#22346e]/40">
                    <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                        <div className="text-[#f34853]">
                            <img
                                src="/images/Im_logo.png"
                                alt="Logo"
                                className="h-12 w-auto"
                            />
                        </div>
                        <span className="text-[#22346e] dark:text-white font-bold text-lg">
                            PropManage
                        </span>
                    </Link>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="text-[#22346e] dark:text-gray-300 hover:text-[#f34853] dark:hover:text-[#f34853] transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-4 space-y-2 px-3 flex-1 overflow-y-auto pb-4">
                    {getNavItems().map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleNavClick}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                                ${isActive(item.href)
                                    ? `${activeBg} ${activeText} shadow-md`
                                    : `text-gray-600 dark:text-gray-300 ${inactiveBg}`
                                }`}
                        >
                            <item.icon size={20} strokeWidth={1.8} className="flex-shrink-0" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#22346e]/20 dark:border-[#22346e]/40">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                            bg-[#22346e] hover:bg-[#f34853] text-white justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                            />
                        </svg>
                        <span className="text-sm font-medium">Logout</span>
                    </Link>
                </div>
            </div>

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                {/* TOP BAR */}
                <header className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-b border-[#22346e]/10">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-1.5 rounded-md text-[#22346e] dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-800/80 transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>
                        <h1 className="font-semibold text-[#22346e] dark:text-white text-sm sm:text-base md:text-lg truncate">
                            {header ?? "Dashboard"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        {/* DARK MODE TOGGLE */}
                        <button
                            onClick={() => setDark(!dark)}
                            className="p-1.5 sm:p-2 rounded-md bg-gray-200/80 dark:bg-gray-800/80 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {dark ? (
                                <Sun size={16} className="sm:text-[18px] text-[#f34853]" />
                            ) : (
                                <Moon size={16} className="sm:text-[18px] text-[#22346e]" />
                            )}
                        </button>

                        <span className="hidden sm:inline text-sm text-[#22346e] dark:text-gray-300 font-medium">
                            {user.name}
                        </span>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#f34853] to-[#22346e] rounded-full hover:opacity-90 transition-opacity shadow-md flex-shrink-0" />
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route("profile.edit")}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* CONTENT */}
                <main className="flex-1 p-3 sm:p-4 md:p-6 bg-transparent overflow-y-auto">
                    <div className="max-w-8xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}