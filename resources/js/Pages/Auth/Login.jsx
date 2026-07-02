import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        // <GuestLayout>
            <>
            <Head title="Apartment Inspection - Log in" />

            {/* Main Container: Full viewport with soft gradient background */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6">
                
                {/* Login Card Container - Responsive width */}
                <div className="relative w-full max-w-md">
                    {/* Card Aspect Ratio Wrapper - Square card */}
                    <div className="relative pt-[100%]">
                        
                        {/* Floating Shadow Layer (behind card) */}
                        <div className="absolute inset-0 rounded-3xl bg-navy/5 blur-2xl transform translate-y-4" />
                        
                        {/* Main Rounded Square Card */}
                        <div 
                            className="absolute inset-0 bg-white rounded-3xl overflow-hidden"
                            style={{
                                borderRadius: '24px',
                                boxShadow: '0 25px 45px -12px rgba(34, 52, 110, 0.15), 0 2px 4px -2px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255,255,255,0.8)'
                            }}
                        >
                            {/* Subtle Glass/Depth Texture Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                            
                            {/* Card Content Container */}
                            <div className="relative h-full flex flex-col px-8 pt-20 pb-8">
                                
                                {/* Welcome Section */}
                                <div className="text-center space-y-2 mt-2">
                                    <h1 
                                        className="text-2xl font-bold tracking-tight"
                                        style={{ color: '#22346e' }}
                                    >
                                        Notice to Resident Portal
                                    </h1>
                                    <p className="text-sm text-slate-500">
                                        Apartment Management Suite
                                    </p>
                                </div>

                                {/* Decorative Line - Coral Accent */}
                                <div className="flex justify-center mt-3">
                                    <div 
                                        className="w-12 h-0.5 rounded-full"
                                        style={{ backgroundColor: '#f34853' }}
                                    />
                                </div>

                                {/* Login Form */}
                                <div className="flex-1 flex flex-col justify-center mt-4">
                                    <form onSubmit={submit} className="space-y-4">
                                        {/* Status Message */}
                                        {status && (
                                            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm text-center border border-emerald-200">
                                                {status}
                                            </div>
                                        )}

                                        {/* Email Field */}
                                        <div>
                                            <InputLabel 
                                                htmlFor="email" 
                                                value="Email Address" 
                                                className="text-sm font-medium"
                                                style={{ color: '#22346e' }}
                                            />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="mt-1.5 block w-full rounded-xl border-slate-200 focus:border-coral focus:ring-coral transition-all duration-200"
                                                autoComplete="username"
                                                isFocused={true}
                                                onChange={(e) => setData('email', e.target.value)}
                                style={{ 
                                    borderRadius: '12px',
                                    borderColor: '#e2e8f0'
                                }}
                            />
                            <InputError message={errors.email} className="mt-1.5" />
                        </div>

                                        {/* Password Field */}
                                        <div>
                                            <InputLabel 
                                                htmlFor="password" 
                                                value="Password" 
                                                className="text-sm font-medium"
                                                style={{ color: '#22346e' }}
                                            />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-1.5 block w-full rounded-xl border-slate-200 focus:border-coral focus:ring-coral transition-all duration-200"
                                                autoComplete="current-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                style={{ 
                                                    borderRadius: '12px',
                                                    borderColor: '#e2e8f0'
                                                }}
                                            />
                                            <InputError message={errors.password} className="mt-1.5" />
                                        </div>

                                        {/* Remember Me & Forgot Password */}
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <Checkbox
                                                    name="remember"
                                                    checked={data.remember}
                                                    onChange={(e) => setData('remember', e.target.checked)}
                                                    className="rounded border-slate-300 text-coral focus:ring-coral/20"
                                                />
                                                <span className="text-sm text-slate-600 group-hover:text-navy transition-colors duration-200">
                                                    Remember me
                                                </span>
                                            </label>

                                            {canResetPassword && (
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-sm font-medium transition-colors duration-200 hover:underline"
                                                    style={{ color: '#f34853' }}
                                                >
                                                    Forgot password?
                                                </Link>
                                            )}
                                        </div>

                                        {/* Login Button - Fixed visibility */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                            style={{
                                                backgroundColor: '#f34853',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 8px -2px rgba(243,72,83,0.3)'
                                            }}
                                        >
                                            {processing ? (
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <>
                                                    <span>Sign In</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>

                                        {/* Secure login hint */}
                                        <p className="text-xs text-center text-slate-400 pt-2">
                                            Secure enterprise login
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Overlapping Circular Logo Container - 50% outside, 50% inside */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
                            <div 
                                className="relative bg-white rounded-full flex items-center justify-center"
                                style={{
                                    width: '96px',
                                    height: '96px',
                                    boxShadow: '0 20px 35px -12px rgba(34, 52, 110, 0.3), 0 0 0 3px #22346e, 0 0 0 6px rgba(243,72,83,0.1)'
                                }}
                            >
                                {/* Inner subtle gradient ring */}
                                <div 
                                    className="absolute inset-1.5 rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                                    }}
                                />
                                
                                {/* Logo Image Container - Using your local logo path */}
                                <div className="absolute inset-2 rounded-full overflow-hidden bg-white flex items-center justify-center">
                                    <img
                                        src="/images/Im_logo.png"
                                        alt="Apartment Inspection Logo"
                                        className="w-4/5 h-4/5 object-contain"
                                        style={{
                                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Subtle accent at bottom of card */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-coral/30 to-transparent rounded-full blur-sm" />
                    </div>
                </div>
            </div>
            </>
        // </GuestLayout>
    );
}