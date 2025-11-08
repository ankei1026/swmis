import DataTable from '@/Pages/Components/Table';
import Title from '@/Pages/Components/Title';
import userColumns from '@/Pages/Data/userColumn';
import Layout from '@/Pages/Layout/Layout';
import { usePage } from '@inertiajs/react';

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
            <Title title="User List" />
            <div className='w-full bg-gray-100 p-6 rounded-lg'>
                <div className="flex w-full items-center justify-center">
                    <DataTable columns={userColumns} rows={rows} pageSize={5} />
                </div>
            </div>
        </Layout>
    );
};

export default UserList;
