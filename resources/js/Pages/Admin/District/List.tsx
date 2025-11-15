import DataTable from '@/Pages/Components/Table';
import Title from '@/Pages/Components/Title';
import districtColumns from '@/Pages/Data/districtColumn';
import Layout from '@/Pages/Layout/Layout';
import { Head, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { route } from "ziggy-js";

const DistrictList = () => {
    const { props } = usePage();
    const { districts } = props as { users: any[] };

    const rows = districts.map((district) => ({
        id: district.id,
        name: district.name,
    }));

    return (
        <Layout>
            <Head title='District List'/>
            <Title title="District List" subtitle="View and manage districts" />
            {/* Action Buttons */}
            <div className="mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    Total Districts: {districts.length}
                </div>
                <button
                    onClick={() => router.get(route('admin.district.create'))}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New District
                </button>
            </div>
            <div className='w-full bg-gray-100 py-4 rounded-lg'>
                <div className="flex w-full items-center justify-center">
                    <DataTable
                        columns={districtColumns}
                        rows={rows}
                        title="Districts"
                        pageSize={5} />
                </div>
            </div>
        </Layout>
    );
};

export default DistrictList;
