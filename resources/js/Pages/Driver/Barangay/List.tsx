import Layout from '@/Pages/Layout/LayoutDriver';
import Title from '@/Pages/Components/Title';
import Map, { MapMarker, MANGAGOY_CENTER } from '@/Pages/Components/Map';
import DataTable from '@/Pages/Components/Table';
import barangayColumns from '@/Pages/Data/barangayColumn';
import { router, PageProps, Head } from '@inertiajs/react';
import { toast } from "sonner"
import { route } from "ziggy-js";

interface Barangay {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

interface Props extends PageProps {
    barangays: Barangay[];
}

const BarangayList = ({ barangays }: Props) => {
    const handleDelete = (id: number) => {
        toast.warning('Are you sure you want to delete this barangay?', {
            action: {
                label: 'Confirm',
                onClick: () => {
                    router.delete(route('driver.barangay.delete', id), {
                        preserveScroll: true,
                        onStart: () => toast.loading('Deleting barangay...'),
                        onSuccess: () => {
                            toast.dismiss();
                            toast.success('Barangay deleted successfully!');
                        },
                        onError: () => {
                            toast.dismiss();
                            toast.error('Failed to delete barangay.');
                        },
                    });
                },
            },
            duration: 5000,
        });
    };

    // Convert barangays to DataGrid rows
    const rows = barangays.map(barangay => ({
        id: barangay.id,
        name: barangay.name,
        latitude: barangay.latitude,
        longitude: barangay.longitude,
    }));

    const markers: MapMarker[] = barangays.map((b) => ({
        id: b.id,
        position: [b.latitude, b.longitude],
        popup: (
            <div className="space-y-2 text-sm">
                <div>
                    <strong>{b.name}</strong>
                    <br />
                </div>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => router.get(route('driver.barangay.edit', b.id))}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(b.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ),
        color: "#0affa1ff",
        useCircle: true,
        radius: 8,
    }));

    return (
        <Layout>
            <Head title="Barangay List" />
            <Title title="Barangay List" subtitle="View and manage barangays" />

            {/* Action Buttons */}
            <div className="mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    Total Barangays: {barangays.length}
                </div>
                <button
                    onClick={() => router.get(route('driver.barangay.create'))}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Barangay
                </button>
            </div>

            {/* DataTable Component */}
            <div className='w-full bg-gray-100 rounded-lg mb-6'>
                <div className="py-4">
                    <DataTable
                        columns={barangayColumns}
                        rows={rows}
                        title="Barangays"
                        pageSize={5}
                        checkboxSelection={false}
                    />
                </div>
            </div>

            {/* Map View */}
            <div className="w-full bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Barangays Map View</h3>
                <div className="flex w-full items-center justify-center">
                    <Map
                        center={MANGAGOY_CENTER}
                        zoom={12}
                        markers={markers}
                        style={{ height: 500 }}
                    />
                </div>
            </div>

            {/* Empty State */}
            {barangays.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No barangays</h3>
                    <p className="mt-2 text-sm text-gray-500">Get started by creating your first barangay.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => router.get(route('driver.barangay.create'))}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Barangay
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default BarangayList;