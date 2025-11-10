import DataTable from '@/Pages/Components/Table';
import Title from '@/Pages/Components/Title';
import userColumns from '@/Pages/Data/userColumn';
import Layout from '@/Pages/Layout/Layout';
import { Head, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { route } from "ziggy-js";

const UserList = () => {
    const { props } = usePage();
    const { users } = props as { users: any[] };

    const rows = users.map((user) => ({
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
            {/* Action Buttons */}
            <div className="mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    Total Users: {users.length}
                </div>
                <button
                    onClick={() => router.get(route('admin.users.create'))}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New User
                </button>
            </div>
            <div className='w-full bg-gray-100 p-6 rounded-lg'>
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
