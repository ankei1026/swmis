import DataTable from '@/Pages/Components/Table';
import Title from '@/Pages/Components/Title';
import userColumns from '@/Pages/Data/userColumn';
import Layout from '@/Pages/Layout/Layout';
import { Head, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { route } from "ziggy-js";
import { useState, useMemo } from 'react';

const UserList = () => {
    const { props } = usePage();
    const { users } = props as { users: any[] };
    const [searchTerm, setSearchTerm] = useState('');

    // Filter users based on search term
    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        
        const term = searchTerm.toLowerCase();
        return users.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.barangay?.toLowerCase().includes(term) ||
            user.phone_number?.toLowerCase().includes(term)
        );
    }, [users, searchTerm]);

    const rows = filteredUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        barangay: user.barangay,
        phone: user.phone_number,
        role: user.role,
        status: user.status,
    }));

    return (
        <Layout>
            <Head title='User List'/>
            <Title title="User List" subtitle="View and manage users" />
            
            {/* Action Buttons and Search Bar */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        Total Users: {filteredUsers.length} / {users.length}
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-80"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Create New User Button */}
                    <button
                        onClick={() => router.get(route('admin.users.create'))}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New User
                    </button>
                </div>
            </div>
            
            <div className='w-full bg-gray-100 py-4 rounded-lg'>
                <div className="flex w-full items-center justify-center">
                    <DataTable
                        columns={userColumns}
                        rows={rows}
                        title="Users"
                        pageSize={5} />
                </div>
            </div>
        </Layout>
    );
};

export default UserList;