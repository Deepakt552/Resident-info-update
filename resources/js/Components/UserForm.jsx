// resources/js/Components/UserForm.jsx

import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function UserForm({ user = null, roles }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role: user?.role || 'user',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = user ? put(route('users.update', user.id)) : post(route('users.store'));
        action.then(() => {
            Swal.fire('Success!', `User ${user ? 'updated' : 'created'} successfully`, 'success');
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#f34853]" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#f34853]" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Password {!user && '*'}</label>
                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} 
                        className="w-full px-3 py-2 border rounded-lg" placeholder={user ? 'Leave blank' : 'Enter password'} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} 
                        className="w-full px-3 py-2 border rounded-lg" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Role *</label>
                <select value={data.role} onChange={e => setData('role', e.target.value)} 
                    className="w-full px-3 py-2 border rounded-lg">
                    {Object.entries(roles).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                </select>
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => router.get(route('users.index'))} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" disabled={processing} className="px-6 py-2 bg-[#f34853] text-white rounded-lg hover:bg-[#f34853]/90">
                    {processing ? 'Saving...' : (user ? 'Update' : 'Create')}
                </button>
            </div>
        </form>
    );
}