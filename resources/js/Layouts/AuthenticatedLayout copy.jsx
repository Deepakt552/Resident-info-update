import { useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// icons
import { Home, User, Building2, Menu, Moon, Sun, CheckSquare, ClipboardList, Eye, Users } from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { url } = usePage();
    const { flash } = usePage().props;
    const { hasChecklistRecords } = usePage().props;

    const [open, setOpen] = useState(true);

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

    const isActive = (path) => url.startsWith(path);
    // Updated active colors to use #f34853 (coral red) and #22346e (deep blue)
    const activeBg = "bg-[#f34853]";
    const activeText = "text-white";
    const inactiveBg = "hover:bg-[#22346e]/10 dark:hover:bg-[#22346e]/30";

    const NavItem = ({ href, icon: Icon, label }) => (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive(href)
                    ? `${activeBg} ${activeText} shadow-md`
                    : `text-gray-600 dark:text-gray-300 ${inactiveBg}`
                }`}
        >
            <Icon size={20} strokeWidth={1.8} />
            {open && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
        </Link>
    );

    // Tenant-specific navigation with conditional logic
    const getNavItems = () => {
        if (user.role == 'user') {
            const items = [
                { href: "/dashboard", icon: Home, label: "Dashboard" },
                { href: "/inspection-reports", icon: Building2, label: "Inspection Reports" },
            ];
            return items;
        }

        // Admin navigation
        return [
            { href: "/dashboard", icon: Home, label: "Dashboard" },
            { href: "/resident-signup/list", icon: Building2, label: "Resident" },
            { href: "/users", icon: Users, label: "Users" },
            { href: "/properties", icon: Building2, label: "Properties" },
            { href: "/profile", icon: User, label: "Profile" },
            
        ];
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 relative">
            {/* PNG Background Image for main area - subtle pattern */}
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

            {/* SIDEBAR */}
            <div
                className={`sticky top-0 h-screen flex flex-col transition-all duration-300 border-r
                bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm
                ${open ? "w-64" : "w-20"}`}
            >
                {/* TOP */}
                <div className="flex items-center justify-between p-2 border-b border-[#22346e]/20 dark:border-[#22346e]/40">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="text-[#f34853] dark:text-[#f34853]">
                            <img
                                src="/images/Im_logo.png"
                                alt="Logo"
                                className="h-16 w-auto"
                            />
                            {/* <ApplicationLogo className="h-8 w-auto fill-current" /> */}
                        </div>
                        {open && <span className="text-[#22346e] dark:text-white font-bold text-lg hidden sm:inline">PropManage</span>}
                    </Link>

                    <button
                        onClick={() => setOpen(!open)}
                        className="text-[#22346e] dark:text-gray-300 hover:text-[#f34853] dark:hover:text-[#f34853] transition-colors"
                    >
                        <Menu size={22} />
                    </button>
                </div>

                {/* NAV */}
                <nav className="mt-6 space-y-2 px-2 flex-1">
                    {getNavItems().map((item) => (
                        <NavItem key={item.href} {...item} />
                    ))}
                </nav>
                {/* BOTTOM LOGOUT */}
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
                            className="h-5 w-5"
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
                            <span className="text-sm font-medium">
                                Logout
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                {/* TOP BAR */}
                <header className="z-[9999] flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-b border-[#22346e]/10">
                    <h1 className="font-semibold text-[#22346e] dark:text-white text-lg">
                        {header ?? "Dashboard"}
                    </h1>

                    <div className="flex items-center gap-4">
                        {/* DARK MODE TOGGLE */}
                        <button
                            onClick={() => setDark(!dark)}
                            className="p-2 rounded-md bg-gray-200/80 dark:bg-gray-800/80 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            {dark ? (
                                <Sun size={18} className="text-[#f34853]" />
                            ) : (
                                <Moon size={18} className="text-[#22346e]" />
                            )}
                        </button>

                        <span className="text-sm text-[#22346e] dark:text-gray-300 font-medium">
                            {user.name}
                        </span>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="w-9 h-9 bg-gradient-to-br from-[#f34853] to-[#22346e] rounded-full hover:opacity-90 transition-opacity shadow-md" />
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
                <main className="flex-1 p-4 md:p-6 bg-transparent overflow-y-auto">
                    <div className="max-w-8xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}